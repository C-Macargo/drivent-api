import { notFoundError, unauthorizedError } from '@/errors';
import { badRequestError } from '@/errors/bad-request-error';
import paymentRepository from '@/repositories/payment-repository';
import ticketRepository from '@/repositories/ticket-repository';

async function getPayment(ticketId: number, userId: number) {
  if (!ticketId) throw badRequestError();
  const ticket = await ticketRepository.findTicketByTicketId(ticketId);
  if (!ticket) throw notFoundError();
  if (ticket.Enrollment.userId !== userId) throw unauthorizedError();
  const payment = await paymentRepository.getTicketPayment(ticketId);
  return payment;
}

const paymentsService = {
  getPayment,
};
export { paymentsService };
