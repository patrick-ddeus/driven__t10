import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';

export async function getHotels(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const userId = req.userId;

  try {
    const hotels = await hotelsService.getHotels(userId);
    res.status(httpStatus.OK).json(hotels);
  } catch (error) {
    if (error.name === 'BadRequest') {
      return res.status(httpStatus.BAD_REQUEST).send({
        message: error.message,
      });
    }
    next(error);
  }
}

export async function getHotelById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const userId = req.userId;
  const { hotelId } = req.params;

  try {
    const hotels = await hotelsService.getHotelById(userId, parseInt(hotelId));
    res.status(httpStatus.OK).json(hotels);
  } catch (error) {
    if (error.name === 'BadRequest') {
      return res.status(httpStatus.BAD_REQUEST).send({
        message: error.message,
      });
    }
    next(error);
  }
}
