import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { createTicket, getUserTicket } from '@/controllers/tickets-controller';
import { createTicketSchema } from '@/schemas';

const ticketsRouter = Router();

ticketsRouter.all('/*', authenticateToken);

ticketsRouter.post('/', validateBody(createTicketSchema), createTicket);
ticketsRouter.get('/', getUserTicket);
export { ticketsRouter };
