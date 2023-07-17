import hotelsRepository from '@/repositories/hotels-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import { notFoundError } from '@/errors';
import { paymentRequired } from '@/repositories/hotels-repository/error';
import { badRequest } from '@/errors/bad-request';

async function getHotels(userId: number) {
  await validateHotel(userId);

  const hotels = await hotelsRepository.listAll();
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

  if (userTicket.status !== 'PAID' || userTicket.TicketType.isRemote || !userTicket.TicketType.includesHotel) {
    throw paymentRequired();
  }
}

export default {
  getHotels,
  getHotelById,
};
