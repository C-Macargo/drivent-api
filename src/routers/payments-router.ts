import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { findPayments } from '@/controllers';

const paymentsRouter = Router();

paymentsRouter.all('/*', authenticateToken);

paymentsRouter.get('/', findPayments);

export { paymentsRouter };
