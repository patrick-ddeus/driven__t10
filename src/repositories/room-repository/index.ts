import { prisma } from '@/config';

async function listById(roomId: number) {
  return prisma.room.findFirst({
    where: {
      id: roomId,
    },
  });
}

async function updateCapacity(roomId: number, increment: boolean) {
  const mode = increment ? `increment` : `decrement`;

  return prisma.room.update({
    where: {
      id: roomId,
    },
    data: {
      capacity: { [mode]: 1 },
    },
  });
}

export default {
  listById,
  updateCapacity,
};
