import { notFoundError } from '@/errors';
import { paymentRequired } from '@/errors/payment-requeired-error';
import enrollmentRepository from '@/repositories/enrollment-repository';
import hotelRepository from '@/repositories/hotel-repository';
import ticketRepository from '@/repositories/ticket-repository';

async function getHotels(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketRepository.findTicketByUserId(userId);
  if (!ticket) throw notFoundError();

  if (ticket.status !== 'PAID' || ticket.TicketType.includesHotel === false || ticket.TicketType.isRemote === true)
    throw paymentRequired();

  const hotels = await hotelRepository.findHotels();
  if (hotels.length === 0) throw notFoundError();
  return hotels;
}

const hotelService = {
  getHotels,
};

export { hotelService };
