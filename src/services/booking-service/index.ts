import { forbiddenError, notFoundError } from '@/errors';
import bookingRepository from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import hotelRepository from '@/repositories/hotel-repository';
import ticketRepository from '@/repositories/ticket-repository';

async function getBooking(userId: number) {
  const booking = await bookingRepository.getBooking(userId);
  if (!booking) throw notFoundError();
  return booking;
}

async function postBooking(userId: number, roomId: number) {
  const room = await hotelRepository.findRoomById(roomId);
  if (!room) throw notFoundError();

  const enrollment = enrollmentRepository.findEnrollmentByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketRepository.findTicketByUserId(userId);
  const TicketType = await ticketRepository.findTicketTypeById(ticket.ticketTypeId);
  if (ticket.status !== 'PAID' || TicketType.isRemote === true || TicketType.includesHotel == false) {
    throw forbiddenError();
  }
  const isBookingAvailable = await bookingRepository.checkRoomAvailability(roomId);
  if (isBookingAvailable === 0) throw forbiddenError();

  const booking = await bookingRepository.postBooking(userId, roomId);
  return booking;
}

const bookingService = {
  getBooking,
  postBooking,
};

export { bookingService };
