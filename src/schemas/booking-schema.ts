import Joi from 'joi';
import { BookingBody } from '@/protocols';

const bookingSchema = Joi.object<BookingBody>({
  roomId: Joi.number().required(),
});

export { bookingSchema };
