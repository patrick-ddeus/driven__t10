import faker from '@faker-js/faker';
import { Booking } from '@prisma/client';
import { prisma } from '@/config';

export async function createBooking(userId: number, roomId: number) {
  const booking = await prisma.booking.create({
    data: {
      userId,
      roomId,
    },
    include: {
      Room: true,
    },
  });

  return booking;
}

export async function getUserBooking(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
  });
}

export function returnUserBooking() {
  return {
    id: 1,
    Room: {
      id: 1,
      capacity: 3,
      name: 'Room 1',
      hotelId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };
}

export function buildBooking(roomId: number, userId: number): Booking {
  return {
    id: faker.datatype.number({ min: 1, max: 10 }),
    userId,
    roomId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
