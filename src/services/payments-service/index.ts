import { notFoundError, unauthorizedError } from '@/errors';
import { badRequestError } from '@/errors/bad-request-error';
import { CardData, PaymentData } from '@/protocols';
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

async function postPayment(ticketId: number, cardData: CardData, userId: number) {
  if (!ticketId || !cardData) throw badRequestError();
  const ticket = await ticketRepository.findTicketByTicketId(ticketId);
  if (!ticket) throw notFoundError();
  if (ticket.Enrollment.userId !== userId) throw unauthorizedError();

  const paymentData: PaymentData = {
    value: ticket.TicketType.price,
    cardIssuer: cardData.issuer,
    cardLastDigits: cardData.number.toString().slice(-4),
  };

  const payment = await paymentRepository.postPayment(ticketId, paymentData);
  await ticketRepository.updateTicketById(ticketId);
  return payment;
}

const paymentsService = {
  getPayment,
  postPayment,
};
export { paymentsService };
