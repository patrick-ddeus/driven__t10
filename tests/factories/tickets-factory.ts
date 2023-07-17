import faker from '@faker-js/faker';
import { TicketStatus, TicketType } from '@prisma/client';
import { prisma } from '@/config';

export async function createTicketType(
  ticketIsRemote: string | undefined = faker.datatype.boolean().toString(),
  includesHotel: string | undefined = faker.datatype.boolean().toString(),
): Promise<TicketType> {
  const parseBoolean = (value: string): boolean => value.toLowerCase() === 'true';

  const incomingIsRemote = parseBoolean(ticketIsRemote);
  const incomingIncludesHotel = parseBoolean(includesHotel);

  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: incomingIsRemote,
      includesHotel: incomingIncludesHotel,
    },
  });
}

export async function createTicket(enrollmentId: number, ticketTypeId: number, status: TicketStatus) {
  return prisma.ticket.create({
    data: {
      enrollmentId,
      ticketTypeId,
      status,
    },
  });
}
