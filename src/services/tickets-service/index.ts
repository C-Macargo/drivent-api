import { notFoundError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketRepository from '@/repositories/ticket-repository';

export type CreateTicketType = {
  ticketTypeId: number;
  userId: number;
};

async function getTicketType(ticketTypeId: number) {
  const ticketType = ticketRepository.findTicketTypeById(ticketTypeId);
  return ticketType;
}

async function createTicket(ticket: CreateTicketType) {
  const { ticketTypeId, userId } = ticket;
  const enrollment = await enrollmentRepository.findEnrollmentByUserId(userId);
  if (!enrollment) throw notFoundError();
  const enrollmentId = enrollment.id;
  if (!enrollmentId) throw notFoundError();
  const data = await ticketRepository.createTicket({ ticketTypeId, enrollmentId });
  if (!data) throw notFoundError();
  return data;
}

async function getTicketByUserId(userId: number) {
  const { id: enrollmentId } = await enrollmentRepository.findEnrollmentByUserId(userId);
  const tickets = await ticketRepository.findTicketByUserId(userId);
  if (!enrollmentId || !userId) throw notFoundError();
  return tickets;
}

const ticketsService = {
  createTicket,
  getTicketType,
  getTicketByUserId,
};

export default ticketsService;
