import bookingRepository from '@/repositories/booking-repository';
import { notFoundError } from '@/errors';

async function getBookings(userId: number) {
  const booking = await bookingRepository.list(userId);

  if (booking.length === 0) {
    return notFoundError();
  }
}

export default {
  getBookings,
};
