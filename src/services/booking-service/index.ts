import { isValidTicket } from '../hotels-service';
import bookingRepository from '@/repositories/booking-repository';
import { notFoundError, forbidden } from '@/errors';
import ticketsRepository from '@/repositories/tickets-repository';
import roomRepository from '@/repositories/room-repository';

async function getBookings(userId: number) {
  const booking = await bookingRepository.list(userId);

  if (booking.length === 0) {
    throw notFoundError();
  }

  return booking;
}

async function createBooking(userId: number, roomId: number) {
  await getUserTicketAndCheck(userId);
  await getRoomAndcheck(roomId);

  const booking = await bookingRepository.create(userId, roomId);

  await roomRepository.updateCapacity(roomId, false);
  return booking;
}

async function getUserTicketAndCheck(userId: number) {
  const userTicket = await ticketsRepository.ticketByUserId(userId);

  if (!userTicket || !isValidTicket(userTicket)) {
    throw forbidden();
  }

  return userTicket;
}

async function getRoomAndcheck(roomId: number) {
  const room = await roomRepository.listById(roomId);

  if (!room) {
    throw notFoundError();
  }

  if (room.capacity === 0) {
    throw forbidden();
  }

  return room;
}

export default {
  getBookings,
  createBooking,
};
