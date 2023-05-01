import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getBooking, postBooking, putBooking } from '@/controllers';

const bookingRouter = Router();

bookingRouter.all('/*', authenticateToken);
bookingRouter.get('/', getBooking);
bookingRouter.post('/', postBooking);
bookingRouter.put('/:bookingId', putBooking);

export { bookingRouter };
