import bookingService from '@/services/booking-service';
import bookingRepository from '@/repositories/booking-repository';

describe('Booking service unit tests', () => {
  describe('should return 404', () => {
    it('when theres no booking for the user', async () => {
      const user = {
        id: 1,
        email: 'user@email.com',
        password: '123456',
      };
      jest.spyOn(bookingRepository, 'list').mockImplementationOnce(() => null);

      const booking = bookingService.getBookings(user.id);
      expect(booking).rejects.toEqual({ message: 'No result for this search!', name: 'NotFoundError' });
    });
  });
});
