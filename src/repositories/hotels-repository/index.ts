import { prisma } from '@/config';

async function listAll() {
  return prisma.hotel.findMany();
}

async function listByHotelId(hotelId: number) {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
    },
  });
}

export default {
  listAll,
  listByHotelId,
};
