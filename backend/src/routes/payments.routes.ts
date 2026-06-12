import { Router } from 'express';
import { z } from 'zod';
import { PaymentsController } from '../controllers/payments.controller';
import { validate } from '../middleware/validate';

const router = Router();

const initiateMpesaSchema = z.object({
  orderId: z.string().min(1, 'orderId is required'),
  phone: z.string().min(1, 'Phone number is required for STK Push'),
  amount: z.number().int().min(1, 'Amount must be positive'),
});

const cardPaymentSchema = z.object({
  orderId: z.string().min(1, 'orderId is required'),
  cardNumber: z.string().min(12, 'Card number must be at least 12 digits'),
  expiry: z.string().min(4, 'Expiry date is required'),
  cvc: z.string().min(3, 'CVC is required'),
});

router.post('/mpesa/initiate', validate({ body: initiateMpesaSchema }), PaymentsController.initiateMpesaPush);
router.post('/mpesa/callback', PaymentsController.mpesaCallback);
router.get('/mpesa/status/:orderId', PaymentsController.queryMpesaStatus);
router.post('/card', validate({ body: cardPaymentSchema }), PaymentsController.processCardPayment);

export default router;
