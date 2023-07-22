import { Router } from 'express';
import { getBookings } from '@/controllers/booking-controller';
import { authenticateToken, validateBody } from '@/middlewares';
import { bookingSchema } from '@/schemas';

const bookingRouter = Router();

bookingRouter.get('/', authenticateToken, getBookings);
bookingRouter.post('/', authenticateToken, validateBody(bookingSchema), getBookings);

export { bookingRouter };
