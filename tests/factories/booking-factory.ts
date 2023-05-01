import { prisma } from '@/config';

export async function createBooking(userId: number, roomId: number) {
  const booking = await prisma.booking.create({
    data: {
      userId: userId,
      roomId: roomId,
    },
  });
  return booking;
}
