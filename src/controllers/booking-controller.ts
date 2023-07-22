import { Response } from 'express';
import httpStatus from 'http-status';
import bookingService from '@/services/booking-service';
import { AuthenticatedRequest } from '@/middlewares';

export async function getBookings(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  const bookings = await bookingService.getBookings(userId);
  res.status(httpStatus.OK).json(bookings);
}
