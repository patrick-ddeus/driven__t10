import faker from '@faker-js/faker';
import { TicketStatus, TicketType } from '@prisma/client';
import { prisma } from '@/config';
import { UserTicket } from '@/repositories/tickets-repository';

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
      TicketType: {
        connect: {
          id: ticketTypeId,
        },
      },
      status,
      Enrollment: {
        connect: {
          id: enrollmentId,
        },
      },
    },
  });
}
export function buildTicket(status: TicketStatus, isRemote: boolean, includesHotel: boolean): UserTicket {
  return {
    id: 1,
    ticketTypeId: 1,
    enrollmentId: 1,
    status,
    createdAt: new Date(),
    updatedAt: new Date(),
    TicketType: buildTicketType(isRemote, includesHotel),
  };
}

export function buildTicketType(isRemote: boolean, includesHotel: boolean) {
  return {
    id: 1,
    name: faker.name.findName(),
    price: faker.datatype.number(),
    isRemote,
    includesHotel,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
