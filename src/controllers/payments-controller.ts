import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { paymentsService } from '@/services';

export async function findPayments(req: AuthenticatedRequest, res: Response) {
  const { userId } = req as { userId: number };
  const ticketId = Number(req.query.ticketId);

  try {
    const payments = await paymentsService.getPayment(ticketId, userId);
    return res.status(httpStatus.OK).send(payments);
  } catch (error) {
    if (error.name === 'NotFoundError') return res.status(httpStatus.NOT_FOUND).send(error.message);
    if (error.name === 'UnauthorizedError') return res.status(httpStatus.UNAUTHORIZED).send(error.message);
    if (error.name === 'BadRequestError') return res.status(httpStatus.BAD_REQUEST).send(error.message);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
  }
}

export async function postPayment(req: AuthenticatedRequest, res: Response) {
  try {
    const { ticketId, cardData } = req.body;
    const { userId } = req;
    const payment = await paymentsService.postPayment(ticketId, cardData, userId);
    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    if (error.name === 'NotFoundError') return res.status(httpStatus.NOT_FOUND).send(error.message);
    if (error.name === 'UnauthorizedError') return res.status(httpStatus.UNAUTHORIZED).send(error.message);
    if (error.name === 'BadRequestError') return res.status(httpStatus.BAD_REQUEST).send(error.message);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
  }
}
