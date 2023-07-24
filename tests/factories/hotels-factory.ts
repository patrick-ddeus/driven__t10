import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createHotel() {
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
