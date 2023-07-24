import { isValidTicket } from '../hotels-service';
import bookingRepository from '@/repositories/booking-repository';
import { notFoundError, forbidden } from '@/errors';
import ticketsRepository from '@/repositories/tickets-repository';
import roomRepository from '@/repositories/room-repository';

async function getBookings(userId: number) {
  const booking = await bookingRepository.list(userId);

  if (!booking) {
    throw notFoundError();
  }

  return booking;
}

async function createBooking(userId: number, roomId: number) {
  await getUserTicketAndCheck(userId);
  await getRoomAndcheck(roomId);

  const booking = await bookingRepository.create(userId, roomId);

  return booking;
}

async function updateBooking(userId: number, roomId: number) {
  await getUserTicketAndCheck(userId);
  await getRoomAndcheck(roomId);
  const userBooking = await checkIfUserBookingExists(userId);

  const booking = await bookingRepository.update(userBooking.id, roomId);

  return booking;
}

async function getUserTicketAndCheck(userId: number) {
  const userTicket = await ticketsRepository.ticketByUserId(userId);

  if (!userTicket || !isValidTicket(userTicket)) {
    throw forbidden();
  }
}

async function getRoomAndcheck(roomId: number) {
  const room = await roomRepository.listById(roomId);

  if (!room) {
    throw notFoundError();
  }

  if (room.Booking.length === room.capacity) {
    throw forbidden();
  }
}

async function checkIfUserBookingExists(userId: number) {
  const userBooking = await bookingRepository.listByUserId(userId);

  if (!userBooking) {
    throw forbidden();
  }

  return userBooking;
}

export default {
  getBookings,
  createBooking,
  updateBooking,
};
