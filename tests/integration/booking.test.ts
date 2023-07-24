import supertest from 'supertest';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import jwt from 'jsonwebtoken';
import { cleanDb, generateValidToken } from '../helpers';
import { createEnrollmentWithAddress, createTicket, createTicketType, createUser } from '../factories';
import { createHotel } from '../factories/hotels-factory';
import { createBooking, getUserBooking } from '../factories/booking-factory';
import app, { init } from '@/app';
import { disconnectDB } from '@/config';

const server = supertest(app);

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

afterAll(async () => {
  await disconnectDB();
});

describe('GET /booking', () => {
  describe('when token is not valid', () => {
    it('should respond with status 401 if no token is given', async () => {
      const { status } = await server.get('/booking');

      expect(status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();

      const { status } = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

      const { status } = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(status).toBe(httpStatus.UNAUTHORIZED);
    });
  });

  describe('when token is valid', () => {
    describe('should return 404', () => {
      it('when user does not have a booking', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);

        const { status } = await server.get('/booking').set('Authorization', `Bearer ${token}`);
        expect(status).toBe(httpStatus.NOT_FOUND);
      });

      it('when user does not have a booking', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);

        const { status } = await server.get('/booking').set('Authorization', `Bearer ${token}`);
        expect(status).toBe(httpStatus.NOT_FOUND);
      });
    });

    describe('should return 200', () => {
      it("with the user's booking", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const hotel = await createHotel();
        const booking = await createBooking(user.id, hotel.Rooms[2].id);

        const { status, body } = await server.get('/booking').set('Authorization', `Bearer ${token}`);
        expect(status).toBe(httpStatus.OK);

        expect(body).toEqual({
          id: booking.id,
          Room: {
            capacity: expect.any(Number),
            createdAt: expect.any(String),
            hotelId: hotel.id,
            id: hotel.Rooms[2].id,
            name: expect.any(String),
            updatedAt: expect.any(String),
          },
        });
      });
    });
  });
});

describe('POST /booking', () => {
  describe('when token is not valid', () => {
    it('should respond with status 401 if no token is given', async () => {
      const { status } = await server.post('/booking');

      expect(status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();

      const { status } = await server.post('/booking').set('Authorization', `Bearer ${token}`);

      expect(status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

      const { status } = await server.post('/booking').set('Authorization', `Bearer ${token}`);

      expect(status).toBe(httpStatus.UNAUTHORIZED);
    });
  });

  describe('when token is valid', () => {
    describe('should return 400', () => {
      it('when body is invalid', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);

        const { status } = await server
          .post(`/booking`)
          .set('Authorization', `Bearer ${token}`)
          .send({ roomId: 'asdasd' });
        expect(status).toBe(httpStatus.BAD_REQUEST);
      });
    });

    describe('should return 403', () => {
      it("if the user's ticket has not been paid", async () => {
        const user = await createUser();
        const enrollment = await createEnrollmentWithAddress(user);
        const token = await generateValidToken(user);

        const ticketType = await createTicketType('false', 'true');
        await createTicket(enrollment.id, ticketType.id, 'RESERVED');

        const hotel = await createHotel();

        await createBooking(user.id, hotel.Rooms[2].id);

        const { status } = await server
          .post(`/booking`)
          .set('Authorization', `Bearer ${token}`)
          .send({ roomId: hotel.Rooms[2].id });

        expect(status).toBe(httpStatus.FORBIDDEN);
      });

      it("if the user's ticket is remote", async () => {
        const user = await createUser();
        const enrollment = await createEnrollmentWithAddress(user);
        const token = await generateValidToken(user);

        const ticketType = await createTicketType('true', 'true');
        await createTicket(enrollment.id, ticketType.id, 'PAID');

        const hotel = await createHotel();

        await createBooking(user.id, hotel.Rooms[2].id);

        const { status } = await server
          .post(`/booking`)
          .set('Authorization', `Bearer ${token}`)
          .send({ roomId: hotel.Rooms[2].id });

        expect(status).toBe(httpStatus.FORBIDDEN);
      });

      it("if the user's ticket doesn't have a hotel", async () => {
        const user = await createUser();
        const enrollment = await createEnrollmentWithAddress(user);
        const token = await generateValidToken(user);

        const ticketType = await createTicketType('false', 'false');
        await createTicket(enrollment.id, ticketType.id, 'PAID');

        const hotel = await createHotel();

        await createBooking(user.id, hotel.Rooms[2].id);

        const { status } = await server
          .post(`/booking`)
          .set('Authorization', `Bearer ${token}`)
          .send({ roomId: hotel.Rooms[2].id });

        expect(status).toBe(httpStatus.FORBIDDEN);
      });

      it('if there is no vacancy in the room', async () => {
        const user = await createUser();
        const enrollment = await createEnrollmentWithAddress(user);
        const token = await generateValidToken(user);

        const ticketType = await createTicketType('false', 'true');
        await createTicket(enrollment.id, ticketType.id, 'PAID');

        const hotel = await createHotel();

        await createBooking(user.id, hotel.Rooms[3].id);

        const { status } = await server
          .post(`/booking`)
          .set('Authorization', `Bearer ${token}`)
          .send({ roomId: hotel.Rooms[3].id });

        expect(status).toBe(httpStatus.FORBIDDEN);
      });
    });

    describe('should return 404', () => {
      it('when roomId does not exist', async () => {
        const user = await createUser();
        const enrollment = await createEnrollmentWithAddress(user);
        const token = await generateValidToken(user);

        const ticketType = await createTicketType('false', 'true');
        await createTicket(enrollment.id, ticketType.id, 'PAID');

        const hotel = await createHotel();

        await createBooking(user.id, hotel.Rooms[2].id);

        const { status } = await server
          .post(`/booking`)
          .set('Authorization', `Bearer ${token}`)
          .send({ roomId: 9999999 });

        expect(status).toBe(httpStatus.NOT_FOUND);
      });
    });

    describe('should return 200', () => {
      it('with bookingId when everything is OK!', async () => {
        const user = await createUser();
        const enrollment = await createEnrollmentWithAddress(user);
        const token = await generateValidToken(user);

        const ticketType = await createTicketType('false', 'true');
        await createTicket(enrollment.id, ticketType.id, 'PAID');

        const hotel = await createHotel();

        const { status, body } = await server
          .post(`/booking`)
          .set('Authorization', `Bearer ${token}`)
          .send({ roomId: hotel.Rooms[2].id });

        expect(status).toBe(httpStatus.OK);
        expect(body).toEqual({
          bookingId: expect.any(Number),
        });
      });
    });
  });
});

describe('PUT /booking', () => {
  describe('when token is not valid', () => {
    it('should respond with status 401 if no token is given', async () => {
      const { status } = await server.put('/booking');

      expect(status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();

      const { status } = await server.put('/booking').set('Authorization', `Bearer ${token}`);

      expect(status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

      const { status } = await server.put('/booking').set('Authorization', `Bearer ${token}`);

      expect(status).toBe(httpStatus.UNAUTHORIZED);
    });
  });

  describe('when token is valid', () => {
    describe('should return 403', () => {
      it("if the user's ticket has not been paid", async () => {
        const user = await createUser();
        const enrollment = await createEnrollmentWithAddress(user);
        const token = await generateValidToken(user);

        const ticketType = await createTicketType('false', 'true');
        await createTicket(enrollment.id, ticketType.id, 'RESERVED');

        const hotel = await createHotel();

        const booking = await createBooking(user.id, hotel.Rooms[2].id);

        const { status } = await server
          .put(`/booking/${booking.id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({ roomId: hotel.Rooms[2].id });

        expect(status).toBe(httpStatus.FORBIDDEN);
      });

      it("if the user's ticket is remote", async () => {
        const user = await createUser();
        const enrollment = await createEnrollmentWithAddress(user);
        const token = await generateValidToken(user);

        const ticketType = await createTicketType('true', 'true');
        await createTicket(enrollment.id, ticketType.id, 'PAID');

        const hotel = await createHotel();

        const booking = await createBooking(user.id, hotel.Rooms[2].id);

        const { status } = await server
          .put(`/booking/${booking.id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({ roomId: hotel.Rooms[2].id });

        expect(status).toBe(httpStatus.FORBIDDEN);
      });

      it("if the user's ticket doesn't have a hotel", async () => {
        const user = await createUser();
        const enrollment = await createEnrollmentWithAddress(user);
        const token = await generateValidToken(user);

        const ticketType = await createTicketType('false', 'false');
        await createTicket(enrollment.id, ticketType.id, 'PAID');

        const hotel = await createHotel();

        const booking = await createBooking(user.id, hotel.Rooms[2].id);

        const { status } = await server
          .put(`/booking/${booking.id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({ roomId: hotel.Rooms[2].id });

        expect(status).toBe(httpStatus.FORBIDDEN);
      });

      it('if there is no vacancy in the room', async () => {
        const user = await createUser();
        const enrollment = await createEnrollmentWithAddress(user);
        const token = await generateValidToken(user);

        const ticketType = await createTicketType('false', 'true');
        await createTicket(enrollment.id, ticketType.id, 'PAID');

        const hotel = await createHotel();

        const booking = await createBooking(user.id, hotel.Rooms[3].id);

        const { status } = await server
          .put(`/booking/${booking.id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({ roomId: hotel.Rooms[3].id });

        expect(status).toBe(httpStatus.FORBIDDEN);
      });
    });

    describe('should return 200', () => {
      it("should return 200 with the bookingId and when the user's booking has been changed", async () => {
        const user = await createUser();
        const enrollment = await createEnrollmentWithAddress(user);
        const token = await generateValidToken(user);

        const ticketType = await createTicketType('false', 'true');
        await createTicket(enrollment.id, ticketType.id, 'PAID');

        const hotel = await createHotel();

        const booking = await createBooking(user.id, hotel.Rooms[4].id);
        const newRoom = hotel.Rooms[2].id;

        const { status, body } = await server
          .put(`/booking/${booking.id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({ roomId: newRoom });

        const userBooking = await getUserBooking(user.id);

        expect(status).toBe(httpStatus.OK);
        expect(body).toEqual({
          bookingId: expect.any(Number),
        });
        expect(userBooking.roomId).toBe(newRoom);
      });
    });
  });
});
