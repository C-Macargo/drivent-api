import { prisma } from '@/config';

async function findTicketTypeById(ticketTypeId: number) {
  const ticket = prisma.ticketType.findFirst({ where: { id: ticketTypeId } });
  return ticket;
}

type CreateTicketType = { ticketTypeId: number; enrollmentId: number };

async function createTicket(ticket: CreateTicketType) {
  const createdTicket = await prisma.ticket.create({
    data: {
      ...ticket,
      status: 'RESERVED',
    },
  });
  return createdTicket;
}

const ticketRepository = {
  createTicket,
  findTicketTypeById,
};

export default ticketRepository;
