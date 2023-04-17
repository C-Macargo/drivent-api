import { prisma } from '@/config';

async function findTicketTypeById(ticketTypeId: number) {
  const ticket = prisma.ticketType.findFirst({ where: { id: ticketTypeId } });
  return ticket;
}

type CreateTicketType = { ticketTypeId: number; enrollmentId: number };

async function createTicket(ticket: CreateTicketType) {
  const createdTicket = await prisma.ticket.create({
    data: {
      ticketTypeId: ticket.ticketTypeId,
      enrollmentId: ticket.enrollmentId,
      status: 'RESERVED',
    },
  });
  return createdTicket;
}

async function findTicketByUserId(userId: number) {
  const tickets = prisma.ticket.findFirst({
    where: {
      Enrollment: {
        userId,
      },
    },
    select: {
      id: true,
      status: true,
      ticketTypeId: true,
      enrollmentId: true,
      TicketType: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return tickets;
}

async function findTicketByTicketId(ticketId: number) {
  const ticket = await prisma.ticket.findFirst({
    where: {
      id: ticketId,
    },
    include: {
      Enrollment: {
        select: {
          userId: true,
        },
      },
      TicketType: true,
    },
  });
  return ticket;
}

async function findTypes() {
  const types = prisma.ticketType.findMany();
  return types;
}

const ticketRepository = {
  createTicket,
  findTicketTypeById,
  findTicketByUserId,
  findTypes,
  findTicketByTicketId,
};

export default ticketRepository;
