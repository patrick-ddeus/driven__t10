import faker from '@faker-js/faker';
import { Booking, Room } from '@prisma/client';
import { prisma } from '@/config';

export async function createHotelWithRooms() {
  return prisma.hotel.create({
    data: {
      name: faker.company.companyName(),
      image: faker.image.image(),
      Rooms: {
        create: [
          { name: faker.company.companyName(), capacity: faker.datatype.number({ min: 1, max: 6 }) },
          { name: faker.company.companyName(), capacity: faker.datatype.number({ min: 1, max: 6 }) },
          { name: faker.company.companyName(), capacity: 2 },
          { name: faker.company.companyName(), capacity: 1 },
          { name: faker.company.companyName(), capacity: 3 },
        ],
      },
    },
    include: {
      Rooms: true,
    },
  });
}

export function buildRoomWithBookings(capacity: number, bookings: number): Room & { Booking: Booking[] } {
  return {
    id: 1,
    capacity,
    hotelId: faker.datatype.number({ min: 1, max: 10 }),
    name: faker.company.companyName(),
    createdAt: new Date(),
    updatedAt: new Date(),
    Booking: [...Array(bookings)].map((_, index) => ({
      id: index,
      userId: faker.datatype.number({ min: 1, max: 10 }),
      roomId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
  };
}

export function buildRoom(roomId?: number): Room {
  return {
    id: roomId || faker.datatype.number({ min: 1, max: 10 }),
    capacity: faker.datatype.number({ min: 1, max: 10 }),
    hotelId: faker.datatype.number({ min: 1, max: 10 }),
    name: faker.company.companyName(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
