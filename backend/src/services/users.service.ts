import prisma from '../models/prisma';
import { hashPassword, comparePassword } from '../utils/hash';

export class UsersService {
  static async getProfile(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
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
      createdAt: user.createdAt,
    };
  }

  static async updateProfile(id: string, requesterId: string, data: any) {
    if (id !== requesterId) {
      const error = new Error('Unauthorized to modify this profile');
      (error as any).status = 403;
      throw error;
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || null,
      },
    });

    return {
      id: updated.id,
      email: updated.email,
      firstName: updated.firstName,
      lastName: updated.lastName,
      phone: updated.phone || undefined,
      role: updated.role,
    };
  }

  static async changePassword(id: string, requesterId: string, data: any) {
    if (id !== requesterId) {
      const error = new Error('Unauthorized to change this password');
      (error as any).status = 403;
      throw error;
    }

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      const error = new Error('User not found');
      (error as any).status = 404;
      throw error;
    }

    const matches = await comparePassword(data.oldPassword, user.password);
    if (!matches) {
      const error = new Error('Incorrect current password');
      (error as any).status = 400;
      throw error;
    }

    const newHash = await hashPassword(data.newPassword);
    await prisma.user.update({
      where: { id },
      data: { password: newHash },
    });

    return { message: 'Password updated successfully' };
  }
}
