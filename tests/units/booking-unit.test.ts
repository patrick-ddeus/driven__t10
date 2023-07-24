import { buildTicket, buildUser } from '../factories';
import { returnUserBooking, buildBooking } from '../factories/booking-factory';
import { buildRoom, buildRoomWithBookings } from '../factories/hotels-factory';
import bookingService from '@/services/booking-service';
import bookingRepository from '@/repositories/booking-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import roomRepository from '@/repositories/room-repository';

describe('getBookings service unit tests', () => {
  it('should return notFoundError when theres no booking for the user', () => {
    const user = buildUser();
    jest.spyOn(bookingRepository, 'list').mockImplementationOnce(() => null);

    const booking = bookingService.getBookings(user.id);
    expect(booking).rejects.toEqual({ message: 'No result for this search!', name: 'NotFoundError' });
  });

  it("should return a user's booking", () => {
    const user = buildUser();
    const userBooking = returnUserBooking();
    jest.spyOn(bookingRepository, 'list').mockResolvedValue(userBooking);

    const booking = bookingService.getBookings(user.id);
    expect(booking).resolves.toBe(userBooking);
  });
});

describe('createBookings service unit tests', () => {
  it('should return a error object with forbidden when theres no ticket for the user', () => {
    const user = buildUser();
    jest.spyOn(ticketsRepository, 'ticketByUserId').mockResolvedValue(null);

    const booking = bookingService.createBooking(user.id, 1);
    expect(booking).rejects.toEqual({ name: 'Forbidden', message: 'Forbidden' });
  });

  it('should return forbidden when ticket is remote', () => {
    const user = buildUser();
    const userTicket = buildTicket('PAID', true, true);
    jest.spyOn(ticketsRepository, 'ticketByUserId').mockResolvedValue(userTicket);

    const booking = bookingService.createBooking(user.id, 1);
    expect(booking).rejects.toEqual({ name: 'Forbidden', message: 'Forbidden' });
  });

  it('should return forbidden when ticket does not have hotel', () => {
    const user = buildUser();
    const userTicket = buildTicket('PAID', true, false);
    jest.spyOn(ticketsRepository, 'ticketByUserId').mockResolvedValue(userTicket);

    const booking = bookingService.createBooking(user.id, 1);
    expect(booking).rejects.toEqual({ name: 'Forbidden', message: 'Forbidden' });
  });

  it('should return NotFoundError when theres no room with provided id', () => {
    const user = buildUser();
    const userTicket = buildTicket('PAID', false, true);

    jest.spyOn(ticketsRepository, 'ticketByUserId').mockResolvedValue(userTicket);
    jest.spyOn(roomRepository, 'listById').mockResolvedValue(null);

    const booking = bookingService.createBooking(user.id, 1);
    expect(booking).rejects.toEqual({ name: 'NotFoundError', message: 'No result for this search!' });
  });

  it('should return forbidden when theres no vacancy in provided room', () => {
    const user = buildUser();
    const userTicket = buildTicket('PAID', false, true);
    const roomWithoutVacancy = buildRoomWithBookings(2, 2);

    jest.spyOn(ticketsRepository, 'ticketByUserId').mockResolvedValue(userTicket);
    jest.spyOn(roomRepository, 'listById').mockResolvedValue(roomWithoutVacancy);

    const booking = bookingService.createBooking(user.id, roomWithoutVacancy.id);
    expect(booking).rejects.toEqual({ name: 'Forbidden', message: 'Forbidden' });
  });

  it('should return user booking with all infos of creation', () => {
    const user = buildUser();
    const userTicket = buildTicket('PAID', false, true);
    const userBooking = buildBooking(1, user.id);
    const roomWithVacancy = buildRoomWithBookings(4, 2);

    jest.spyOn(ticketsRepository, 'ticketByUserId').mockResolvedValue(userTicket);
    jest.spyOn(roomRepository, 'listById').mockResolvedValue(roomWithVacancy);
    jest.spyOn(bookingRepository, 'create').mockResolvedValue(userBooking);

    const booking = bookingService.createBooking(user.id, roomWithVacancy.id);
    expect(booking).resolves.toEqual(userBooking);
  });
});

describe('updateBooking unit tests', () => {
  it('should return a error object with forbidden when theres no ticket for the user', () => {
    const user = buildUser();
    jest.spyOn(ticketsRepository, 'ticketByUserId').mockResolvedValue(null);

    const booking = bookingService.updateBooking(user.id, 1);
    expect(booking).rejects.toEqual({ name: 'Forbidden', message: 'Forbidden' });
  });

  it('should return forbidden when ticket is remote', () => {
    const user = buildUser();
    const userTicket = buildTicket('PAID', true, true);
    jest.spyOn(ticketsRepository, 'ticketByUserId').mockResolvedValue(userTicket);

    const booking = bookingService.updateBooking(user.id, 1);
    expect(booking).rejects.toEqual({ name: 'Forbidden', message: 'Forbidden' });
  });

  it('should return forbidden when ticket does not have hotel', () => {
    const user = buildUser();
    const userTicket = buildTicket('PAID', true, false);
    jest.spyOn(ticketsRepository, 'ticketByUserId').mockResolvedValue(userTicket);

    const booking = bookingService.updateBooking(user.id, 1);
    expect(booking).rejects.toEqual({ name: 'Forbidden', message: 'Forbidden' });
  });

  it('should return NotFoundError when theres no room with provided id', () => {
    const user = buildUser();
    const userTicket = buildTicket('PAID', false, true);

    jest.spyOn(ticketsRepository, 'ticketByUserId').mockResolvedValue(userTicket);
    jest.spyOn(roomRepository, 'listById').mockResolvedValue(null);

    const booking = bookingService.updateBooking(user.id, 1);
    expect(booking).rejects.toEqual({ name: 'NotFoundError', message: 'No result for this search!' });
  });

  it('should return forbidden when theres no vacancy in provided room', () => {
    const user = buildUser();
    const userTicket = buildTicket('PAID', false, true);
    const roomWithoutVacancy = buildRoomWithBookings(2, 2);

    jest.spyOn(ticketsRepository, 'ticketByUserId').mockResolvedValue(userTicket);
    jest.spyOn(roomRepository, 'listById').mockResolvedValue(roomWithoutVacancy);

    const booking = bookingService.updateBooking(user.id, roomWithoutVacancy.id);
    expect(booking).rejects.toEqual({ name: 'Forbidden', message: 'Forbidden' });
  });

  it('should return forbidden when user does not have booking', () => {
    const user = buildUser();
    const userTicket = buildTicket('PAID', false, true);
    const room = buildRoom();
    const userBooking = buildBooking(room.id, user.id);

    jest.spyOn(ticketsRepository, 'ticketByUserId').mockResolvedValue(userTicket);
    jest.spyOn(roomRepository, 'listById').mockResolvedValue({ ...room, Booking: [userBooking] });
    jest.spyOn(bookingRepository, 'listByUserId').mockResolvedValue(null);

    const booking = bookingService.updateBooking(user.id, room.id);
    expect(booking).rejects.toEqual({ name: 'Forbidden', message: 'Forbidden' });
  });

  it('should return user booking with all info of update', () => {
    const user = buildUser();
    const userTicket = buildTicket('PAID', false, true);
    const room = buildRoom(1);
    const userBooking = buildBooking(room.id, user.id);

    const newRoom = buildRoom(2);
    const userNewBooking = buildBooking(newRoom.id, user.id);

    jest.spyOn(ticketsRepository, 'ticketByUserId').mockResolvedValue(userTicket);
    jest.spyOn(roomRepository, 'listById').mockResolvedValue({ ...room, Booking: [userBooking] });
    jest.spyOn(bookingRepository, 'listByUserId').mockResolvedValue(userBooking);
    jest.spyOn(bookingRepository, 'update').mockResolvedValue(userNewBooking);

    const booking = bookingService.updateBooking(user.id, newRoom.id);
    expect(booking).resolves.toEqual(userNewBooking);
  });
});
