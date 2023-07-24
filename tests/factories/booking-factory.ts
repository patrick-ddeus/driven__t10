import { prisma } from '@/config';

export async function createBooking(userId: number, roomId: number) {
  const booking = await prisma.booking.create({
    data: {
      User: {
        connect: {
          id: userId,
        },
      },
      Room: {
        connect: {
          id: roomId,
        },
      },
    },
    include: {
      Room: true,
    },
  });

  await decrementRoomCapacity(roomId);
  return booking;
}

export async function getUserBooking(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
  });
}

async function decrementRoomCapacity(roomId: number) {
  return prisma.room.update({
    where: {
      id: roomId,
    },
    data: {
      capacity: { decrement: 1 },
    },
  });
}
