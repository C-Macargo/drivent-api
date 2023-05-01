import supertest from 'supertest';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import * as jwt from 'jsonwebtoken';
import { cleanDb, generateValidToken } from '../helpers';

import {
  createBooking,
  createEnrollmentWithAddress,
  createHotel,
  createPayment,
  createRemoteTicketType,
  createRoom,
  createRoomWithCapacity,
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

describe('GET /booking', () => {
  it('Should respond with status 401 if no token is given', async () => {
    const response = await server.get('/booking/');
    expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
  });

  it('Should respond with 401 if given token is not valid', async () => {
    const token = faker.lorem.word();
    const response = await server.get('/booking/').set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for a given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    const response = await server.get('/booking/').set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
  });

  describe('GET /bookings when token is valid', () => {
    it('should respond with 404 if there is no booking', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const response = await server.get('/booking/').set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with 200 if there are bookings', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const booking = await createBooking(user.id, room.id);
      const response = await server.get('/booking/').set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual({
        id: booking.id,
        Room: {
          id: room.id,
          name: room.name,
          capacity: room.capacity,
          hotelId: room.hotelId,
          createdAt: room.createdAt.toISOString(),
          updatedAt: room.updatedAt.toISOString(),
        },
      });
    });
  });
});

describe('POST /booking', () => {
  it('Should respond with status 401 if no token is given', async () => {
    const response = await server.post('/booking/');
    expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
  });

  it('Should respond with 401 if given token is not valid', async () => {
    const token = faker.lorem.word();
    const response = await server.post('/booking/').set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for a given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    const response = await server.post('/booking/').set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
  });

  describe('POST /bookings when token is valid', () => {
    it('Should respond with status 200 and booking id', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createValidTicketType();
      const ticket = await createTicket(enrollment.id, ticketType.id, 'PAID');
      const payment = await createPayment(ticket.id, ticketType.price);
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const result = await server.post('/booking/').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });
      expect(result.status).toBe(httpStatus.OK);
      expect(result.body).toEqual({
        bookingId: expect.any(Number),
      });
    });
    it('should respond with 404 if room is not found', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const response = await server.post('/booking/').set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond 403 if ticket is not PAID', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const ticketType = await createTicketType();
      const ticket = await createTicket(enrollment.id, ticketType.id, 'RESERVED');
      const response = await server.post('/booking/').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });
      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });
    it('should respond 403 if ticket is remote', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const ticketType = await createRemoteTicketType();
      const ticket = await createTicket(enrollment.id, ticketType.id, 'PAID');
      const response = await server.post('/booking/').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });
      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });
    it('should respond 403 if ticket does not include hotel', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const ticketType = await createTicketTypeWithoutHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, 'PAID');
      const response = await server.post('/booking/').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });
      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond 403 if romm is at capacity', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createValidTicketType();
      const ticket = await createTicket(enrollment.id, ticketType.id, 'PAID');
      const payment = await createPayment(ticket.id, ticketType.price);
      const hotel = await createHotel();
      const room = await createRoomWithCapacity(hotel.id);
      const booking = await createBooking(user.id, room.id);
      const response = await server.post('/booking/').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });
      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });
  });
});
