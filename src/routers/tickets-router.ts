import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { createTicket } from '@/controllers/tickets-controller';
import { createTicketSchema } from '@/schemas';

const ticketsRouter = Router();

ticketsRouter.all('/*', authenticateToken);

ticketsRouter.post('/', validateBody(createTicketSchema), createTicket);

export { ticketsRouter };
