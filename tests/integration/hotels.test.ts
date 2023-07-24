import supertest from 'supertest';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import * as jwt from 'jsonwebtoken';
import { cleanDb, generateValidToken } from '../helpers';
import { createEnrollmentWithAddress, createTicket, createTicketType, createUser } from '../factories';
import { createHotel } from '../factories/hotels-factory';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe('GET /hotels', () => {
  it('should respond with status 401 if no token is given', async () => {
    const { status } = await server.get('/hotels');

    expect(status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const { status } = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const { status } = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 404 if user there is no ticket or there is no enrollment', async () => {
    const token = await generateValidToken();
    const { status } = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(status).toBe(httpStatus.NOT_FOUND);
  });

  it("should respond with 402 if the user's ticket has not been paid", async () => {
    const user = await createUser();
    const enrollment = await createEnrollmentWithAddress(user);
    const token = await generateValidToken(user);

    const ticketType = await createTicketType('false', 'true');
    await createTicket(enrollment.id, ticketType.id, 'RESERVED');

    const { status } = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  it("should respond with 402 if the user's ticket is remote", async () => {
    const user = await createUser();
    const enrollment = await createEnrollmentWithAddress(user);
    const token = await generateValidToken(user);

    const ticketType = await createTicketType('true', 'true');
    await createTicket(enrollment.id, ticketType.id, 'PAID');

    const { status } = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  it("should respond with 402 if the user's ticket doesn't have a hotel", async () => {
    const user = await createUser();
    const enrollment = await createEnrollmentWithAddress(user);
    const token = await generateValidToken(user);

    const ticketType = await createTicketType('false', 'false');
    await createTicket(enrollment.id, ticketType.id, 'PAID');

    const { status } = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  it('should respond with 404 if theres no hotels', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);

    const { status } = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(status).toBe(httpStatus.NOT_FOUND);
  });

  it('should return 200 OK with all hotels', async () => {
    const user = await createUser();
    const enrollment = await createEnrollmentWithAddress(user);
    const token = await generateValidToken(user);

    const ticketType = await createTicketType('false', 'true');
    await createTicket(enrollment.id, ticketType.id, 'PAID');

    const hotel = await createHotel();

    const { status, body } = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(status).toBe(httpStatus.OK);
    expect(body).toEqual([
      {
        id: hotel.id,
        name: expect.any(String),
        image: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    ]);
  });
});

describe('GET /hotels/:hotelId', () => {
  it('should respond with status 401 if no token is given', async () => {
    const { status } = await server.get('/hotels/1');

    expect(status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const { status } = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    expect(status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const { status } = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    expect(status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 404 if user there is no ticket or there is no enrollment', async () => {
    const token = await generateValidToken();
    const { status } = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    expect(status).toBe(httpStatus.NOT_FOUND);
  });

  it("should respond with 402 if the user's ticket has not been paid", async () => {
    const user = await createUser();
    const enrollment = await createEnrollmentWithAddress(user);
    const token = await generateValidToken(user);

    const ticketType = await createTicketType('false', 'true');
    await createTicket(enrollment.id, ticketType.id, 'RESERVED');

    const hotel = await createHotel();

    const { status } = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);

    expect(status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  it("should respond with 402 if the user's ticket is remote", async () => {
    const user = await createUser();
    const enrollment = await createEnrollmentWithAddress(user);
    const token = await generateValidToken(user);

    const ticketType = await createTicketType('true', 'true');
    await createTicket(enrollment.id, ticketType.id, 'PAID');

    const hotel = await createHotel();

    const { status } = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);

    expect(status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  it("should respond with 402 if the user's ticket doesn't have a hotel", async () => {
    const user = await createUser();
    const enrollment = await createEnrollmentWithAddress(user);
    const token = await generateValidToken(user);

    const ticketType = await createTicketType('false', 'false');
    await createTicket(enrollment.id, ticketType.id, 'PAID');

    const hotel = await createHotel();

    const { status } = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);

    expect(status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  it("should respond with 404 when hotel with hotelId doesn't exist", async () => {
    const user = await createUser();
    const enrollment = await createEnrollmentWithAddress(user);
    const token = await generateValidToken(user);

    const ticketType = await createTicketType('false', 'true');
    await createTicket(enrollment.id, ticketType.id, 'PAID');

    const { status } = await server.get('/hotels/999999').set('Authorization', `Bearer ${token}`);

    expect(status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with 400 when hotelId is invalid', async () => {
    const user = await createUser();
    const enrollment = await createEnrollmentWithAddress(user);
    const token = await generateValidToken(user);

    const ticketType = await createTicketType('false', 'true');
    await createTicket(enrollment.id, ticketType.id, 'PAID');

    const { status } = await server.get('/hotels/qualquercoisa').set('Authorization', `Bearer ${token}`);

    expect(status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with 200 when hotelId is valid', async () => {
    const user = await createUser();
    const enrollment = await createEnrollmentWithAddress(user);
    const token = await generateValidToken(user);

    const ticketType = await createTicketType('false', 'true');
    await createTicket(enrollment.id, ticketType.id, 'PAID');

    const hotel = await createHotel();

    const { status, body } = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);

    expect(status).toBe(httpStatus.OK);
    expect(body).toEqual({
      id: hotel.id,
      name: expect.any(String),
      image: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      Rooms: [
        {
          id: expect.any(Number),
          name: expect.any(String),
          capacity: expect.any(Number),
          hotelId: hotel.id,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        {
          id: expect.any(Number),
          name: expect.any(String),
          capacity: expect.any(Number),
          hotelId: hotel.id,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        {
          id: expect.any(Number),
          name: expect.any(String),
          capacity: expect.any(Number),
          hotelId: hotel.id,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        {
          id: expect.any(Number),
          name: expect.any(String),
          capacity: expect.any(Number),
          hotelId: hotel.id,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        {
          id: expect.any(Number),
          name: expect.any(String),
          capacity: expect.any(Number),
          hotelId: hotel.id,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ],
    });
  });
});
