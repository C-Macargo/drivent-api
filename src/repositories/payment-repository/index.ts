import { prisma } from '@/config';

async function getTicketPayment(ticketId: number) {
  const payment = await prisma.payment.findFirst({
    where: {
      ticketId,
    },
  });
  return payment;
}

const paymentRepository = {
  getTicketPayment,
};

export default paymentRepository;
