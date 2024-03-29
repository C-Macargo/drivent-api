import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import ticketsService from '@/services/tickets-service';

export async function createTicket(_req: AuthenticatedRequest, res: Response) {
  const { ticketTypeId } = _req.body as { ticketTypeId: number };
  const { userId } = _req as { userId: number };

  try {
    const ticket = await ticketsService.createTicket({ ticketTypeId, userId });
    const ticketType = await ticketsService.getTicketType(ticketTypeId);
    return res.status(httpStatus.CREATED).send({
      ...ticket,
      TicketType: { ...ticketType },
    });
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send({});
  }
}

export async function getUserTicket(_req: AuthenticatedRequest, res: Response) {
  const { userId } = _req as { userId: number };
  try {
    const userTickets = await ticketsService.getTicketByUserId(userId);
    if (!userTickets) throw new Error();
    return res.status(httpStatus.OK).send(userTickets);
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send({});
  }
}

export async function getTicketTypes(_req: AuthenticatedRequest, res: Response) {
  try {
    const types = await ticketsService.getTicketTypes();
    return res.status(httpStatus.OK).send(types);
  } catch (error) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}
