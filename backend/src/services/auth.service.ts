import prisma from '../models/prisma';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateToken } from '../utils/jwt';
import { AuthResponse } from '@shared/types/user.types';
import { Role } from '@prisma/client';
import { sendVerificationEmail } from '../utils/email';

export class AuthService {
  static async register(data: any): Promise<AuthResponse> {
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      const error = new Error('Email is already registered');
      (error as any).status = 400;
      throw error;
    }

    const passwordHash = await hashPassword(data.password);
    const roleMapping: Record<string, Role> = {
      ATTENDEE: Role.ATTENDEE,
      ORGANIZER: Role.ORGANIZER,
      ADMIN: Role.ADMIN,
    };

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: passwordHash,
        phone: data.phone || null,
        role: roleMapping[data.role] || Role.ATTENDEE,
        isVerified: false,
        verificationCode: code,
        verificationExpires: expires,
      },
    });

    // Send verification email
    try {
      await sendVerificationEmail(user.email, code);
    } catch (smtpError: any) {
      console.error('SMTP Error during registration:', smtpError);
      // Clean up the created user if registration fails due to email send failure
      await prisma.user.delete({ where: { id: user.id } });
      const error = new Error('Failed to send verification email. Please check your SMTP settings.');
      (error as any).status = 500;
      throw error;
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone || undefined,
        role: user.role,
        ...(process.env.NODE_ENV !== 'production' && { devCode: code })
      },
    };
  }

  static async verifyCode(data: { email: string; code: string }): Promise<{ message: string; token: string; user: any }> {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      const error = new Error('User not found');
      (error as any).status = 404;
      throw error;
    }

    if (!user.verificationCode || user.verificationCode !== data.code) {
      const error = new Error('Invalid verification code');
      (error as any).status = 400;
      throw error;
    }

    if (user.verificationExpires && user.verificationExpires < new Date()) {
      const error = new Error('Verification code has expired');
      (error as any).status = 400;
      throw error;
    }

    const updatedUser = await prisma.user.update({
      where: { email: data.email },
      data: {
        isVerified: true,
        verificationCode: null,
        verificationExpires: null,
      },
    });

    const token = generateToken({
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
    });

    return {
      message: 'Email verified successfully',
      token,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        phone: updatedUser.phone || undefined,
        role: updatedUser.role,
      },
    };
  }

  static async verifyEmail(data: { email: string; code: string }): Promise<{ message: string; token: string; user: any }> {
    return this.verifyCode(data);
  }

  static async resendVerification(data: { email: string }): Promise<{ message: string }> {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      const error = new Error('User not found');
      (error as any).status = 404;
      throw error;
    }

    if (user.isVerified) {
      return { message: 'Email is already verified' };
    }

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.user.update({
      where: { email: data.email },
      data: {
        verificationCode: newCode,
        verificationExpires: expires,
      },
    });

    try {
      await sendVerificationEmail(user.email, newCode);
    } catch (smtpError: any) {
      console.error('SMTP Error during resendVerification:', smtpError);
      const error = new Error('Failed to send verification email. Please check your SMTP settings.');
      (error as any).status = 500;
      throw error;
    }

    return { message: 'Verification code resent successfully' };
  }

  static async login(data: any): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      const error = new Error('Invalid email or password');
      (error as any).status = 401;
      throw error;
    }

    const matches = await comparePassword(data.password, user.password);
    if (!matches) {
      const error = new Error('Invalid email or password');
      (error as any).status = 401;
      throw error;
    }

    // Always require email verification on login (creates 2FA behavior)
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: false,
        verificationCode: code,
        verificationExpires: expires,
      },
    });

    try {
      await sendVerificationEmail(user.email, code);
    } catch (smtpError: any) {
      console.error('SMTP Error during login:', smtpError);
      const error = new Error('Failed to send verification email. Please check your SMTP settings.');
      (error as any).status = 500;
      throw error;
    }

    const message = process.env.NODE_ENV !== 'production'
      ? `Please verify your email address before logging in. (Dev Code: ${code})`
      : 'Please verify your email address before logging in';
    const error = new Error(message);
    (error as any).status = 403;
    throw error;
  }

  static async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      const error = new Error('User not found');
      (error as any).status = 404;
      throw error;
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone || undefined,
      role: user.role,
    };
  }
}
