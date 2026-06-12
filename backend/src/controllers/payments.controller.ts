import { Request, Response, NextFunction } from 'express';
import { PaymentsService } from '../services/payments.service';
import { successResponse } from '../utils/response';

export class PaymentsController {
  static async initiateMpesaPush(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await PaymentsService.initiateMpesaPush(req.body);
      return successResponse(res, result, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async mpesaCallback(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await PaymentsService.mpesaCallback(req.body);
      return successResponse(res, result, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async queryMpesaStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await PaymentsService.queryMpesaStatus(req.params.orderId as string);
      return successResponse(res, result, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async processCardPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await PaymentsService.processCardPayment(req.body);
      return successResponse(res, result, 200);
    } catch (error) {
      return next(error);
    }
  }
}
