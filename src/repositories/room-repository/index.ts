import { prisma } from '@/config';

async function listById(roomId: number) {
  return prisma.room.findFirst({
    where: {
      id: roomId,
    },
    include: {
      Booking: true,
    },
  });
}

export default {
  listById,
};
