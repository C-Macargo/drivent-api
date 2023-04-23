import supertest from 'supertest';
import { TicketStatus } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import { cleanDb, generateValidToken } from '../helpers';
import {
  createEnrollmentWithAddress,
  createHotel,
  createRemoteTicketType,
  createRoom,
  createTicket,
  createTicketType,
  createTicketTypeWithoutHotel,
  createUser,
  createValidTicketType,
} from '../factories';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /hotels', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/hotels');
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
});

describe('GET /hotels when token is valid', () => {
  it('should respond with 404 if there is no enrollment', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  });

  it('should respond with 404 if there is no ticket', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrolment = await createEnrollmentWithAddress(user);
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  });

  it('should respond with 402 if ticket is not paid', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType();
    await createTicket(enrollment.id, ticketType.id, 'RESERVED');
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
  });

  it('should respond with 402 if ticket is remote', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createRemoteTicketType();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
  });

  it('should respond with 402 if ticket does not include hotel', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeWithoutHotel();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
  });

  it('should respond with 200 it there are hotels', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createValidTicketType();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const hotel = await createHotel();
    const room = await createRoom(hotel.id);
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toEqual([
      {
        id: hotel.id,
        name: hotel.name,
        image: hotel.image,
        createdAt: hotel.createdAt.toISOString(),
        updatedAt: hotel.updatedAt.toISOString(),
      },
    ]);
  });

  it('should respond with status 404 if there is no hotels', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createValidTicketType();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });
});
