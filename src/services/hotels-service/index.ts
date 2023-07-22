import hotelsRepository from '@/repositories/hotels-repository';
import ticketsRepository, { UserTicket } from '@/repositories/tickets-repository';
import { notFoundError } from '@/errors';
import { paymentRequired } from '@/repositories/hotels-repository/error';
import { badRequest } from '@/errors/bad-request';

async function getHotels(userId: number) {
  await validateHotel(userId);

  const hotels = await hotelsRepository.listAll();

  if (hotels.length === 0) {
    throw notFoundError();
  }

  return hotels;
}

async function getHotelById(userId: number, hotelId: number) {
  if (isNaN(hotelId)) {
    throw badRequest();
  }

  await validateHotel(userId, hotelId);

  const hotel = await hotelsRepository.listByHotelId(hotelId);
  return hotel;
}

async function validateHotel(userId: number, hotelId?: number) {
  const userTicket = await ticketsRepository.ticketByUserId(userId);

  if (!userTicket || !userTicket.enrollmentId) {
    throw notFoundError();
  }

  if (hotelId) {
    const hotelWithRooms = await hotelsRepository.listByHotelId(hotelId);

    if (!hotelWithRooms) {
      throw notFoundError();
    }
  }

  if (!isValidTicket(userTicket)) {
    throw paymentRequired();
  }
}

export function isValidTicket(ticket: UserTicket) {
  return !ticket.TicketType.isRemote && ticket.TicketType.includesHotel && ticket.status === 'PAID';
}

export default {
  getHotels,
  getHotelById,
};
