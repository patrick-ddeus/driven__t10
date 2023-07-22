import { prisma } from '@/config';

async function list(userId: number) {
  return prisma.booking.findMany({
    where: {
      userId,
    },
  });
}

export default {
  list,
};
