import { Router } from 'express';
import { createBooking, getBookings, updateBooking } from '@/controllers/booking-controller';
import { authenticateToken, validateBody } from '@/middlewares';
import { bookingSchema } from '@/schemas';

const bookingRouter = Router();

bookingRouter
  .all('/*', authenticateToken)
  .get('/', getBookings)
  .post('/', validateBody(bookingSchema), createBooking)
  .put('/:bookingId', validateBody(bookingSchema), updateBooking);

export { bookingRouter };
