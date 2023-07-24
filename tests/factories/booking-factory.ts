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
