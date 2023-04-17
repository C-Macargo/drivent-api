import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { createTicket, getTicketTypes, getUserTicket } from '@/controllers/tickets-controller';
import { createTicketSchema } from '@/schemas';

const ticketsRouter = Router();

ticketsRouter.all('/*', authenticateToken);

ticketsRouter.post('/', validateBody(createTicketSchema), createTicket);
ticketsRouter.get('/', getUserTicket);
ticketsRouter.get('/types', getTicketTypes);

export { ticketsRouter };
