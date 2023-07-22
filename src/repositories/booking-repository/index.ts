import { prisma } from '@/config';

async function list(userId: number) {
  return prisma.booking.findMany({
    where: {
      userId,
    },
  });
}

async function create(userId: number, roomId: number) {
  return prisma.booking.create({
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
  });
}

export default {
  list,
  create,
};
