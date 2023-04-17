import { prisma } from '@/config';
import { PaymentData } from '@/protocols';

async function getTicketPayment(ticketId: number) {
  const payment = await prisma.payment.findFirst({
    where: {
      ticketId,
    },
  });
  return payment;
}

async function postPayment(ticketId: number, cardData: PaymentData) {
  return prisma.payment.create({
    data: {
      ticketId: ticketId,
      value: cardData.value,
      cardIssuer: cardData.cardIssuer,
      cardLastDigits: cardData.cardLastDigits,
    },
  });
}

const paymentRepository = {
  getTicketPayment,
  postPayment,
};

export default paymentRepository;
