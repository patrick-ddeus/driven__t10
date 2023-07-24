import { prisma } from '@/config';

async function list(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
    select: {
      Room: true,
      id: true,
    },
  });
}

async function listByUserId(userId: number) {
  return prisma.booking.findFirst({
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

async function deleteOne(bookingId: number) {
  return prisma.booking.delete({
    where: {
      id: bookingId,
    },
  });
}

async function update(bookingId: number, roomId: number) {
  return prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      roomId,
    },
  });
}

export default {
  list,
  listByUserId,
  create,
  deleteOne,
  update,
};
