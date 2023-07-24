import { Response } from 'express';
import httpStatus from 'http-status';
import bookingService from '@/services/booking-service';
import { AuthenticatedRequest } from '@/middlewares';
import { BookingBody } from '@/protocols';

export async function getBookings(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  const booking = await bookingService.getBookings(userId);
  res.status(httpStatus.OK).json(booking);
}

export async function createBooking(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  const { roomId } = req.body as BookingBody;

  const booking = await bookingService.createBooking(userId, roomId);
  res.status(httpStatus.OK).json({ bookingId: booking.id });
}

export async function updateBooking(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  const { roomId } = req.body as BookingBody;

  const booking = await bookingService.updateBooking(userId, roomId);
  res.status(httpStatus.OK).json({ bookingId: booking.id });
}
