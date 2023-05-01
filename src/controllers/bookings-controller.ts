import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { bookingService } from '@/services';

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req as { userId: number };
  try {
    const booking = await bookingService.getBooking(userId);
    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    if (error.name === 'NotFoundError') return res.status(httpStatus.NOT_FOUND).send(error.message);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
  }
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req as { userId: number };
  const { roomId } = req.body as { roomId: number };
  try {
    const booking = await bookingService.postBooking(userId, roomId);
    return res.status(httpStatus.OK).send({ bookingId: booking.id });
  } catch (error) {
    if (error.name === 'NotFoundError') return res.status(httpStatus.NOT_FOUND).send(error.message);
    if (error.name === 'ForbiddenError') return res.status(httpStatus.FORBIDDEN).send(error.message);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
  }
}
