import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { findPayments, postPayment } from '@/controllers';
import { PaymentSchema } from '@/schemas/payment-schemas';

const paymentsRouter = Router();

paymentsRouter.all('/*', authenticateToken);

paymentsRouter.get('/', findPayments);

paymentsRouter.post('/process', validateBody(PaymentSchema), postPayment);

export { paymentsRouter };
