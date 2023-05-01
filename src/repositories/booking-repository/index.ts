import { prisma } from '@/config';

async function getBooking(userId: number) {
  return prisma.booking.findFirst({
    where: { userId },
    select: {
      id: true,
      Room: true,
    },
  });
}

export async function checkRoomAvailability(roomId: number) {
  const room = await prisma.room.findUnique({
    where: {
      id: roomId,
    },
    include: {
      Booking: true,
    },
  });
  const numberOfBookings = room.Booking.length;
  const openSpots = room.capacity - numberOfBookings;
  return openSpots;
}

export async function checkBookingById(bookingId: number) {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
    },
  });
  return booking;
}

async function postBooking(userId: number, roomId: number) {
  const booking = await prisma.booking.create({
    data: {
      roomId: roomId,
      userId: userId,
    },
  });
  return booking;
}

async function updateBookingById(bookingId: number, roomId: number) {
  return await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      roomId: roomId,
    },
  });
}

const bookingRepository = {
  getBooking,
  checkRoomAvailability,
  postBooking,
  checkBookingById,
  updateBookingById,
};

export default bookingRepository;
