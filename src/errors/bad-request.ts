import { ApplicationError } from '@/protocols';

export function badRequest(): ApplicationError {
  return {
    name: 'BadRequest',
    message: 'Bad request',
  };
}
