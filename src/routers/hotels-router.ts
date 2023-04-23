import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getHotels } from '@/controllers/hotels-controller';

const hotelsRouter = Router();

hotelsRouter.all('/*', authenticateToken);
hotelsRouter.get('', getHotels);
hotelsRouter.get('/:hotelId');

export { hotelsRouter };
