import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getHotelById, getHotels } from '@/controllers/hotels-controller';

const hotelsRouter = Router();

hotelsRouter.use(authenticateToken).get('/', getHotels).get('/:hotelId', getHotelById);

export { hotelsRouter };
