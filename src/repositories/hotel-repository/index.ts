import { Hotel, Room } from '@prisma/client';
import { prisma } from '@/config';

async function findHotels() {
  const hotels = prisma.hotel.findMany();
  return hotels;
}

export async function findRooms(hotelId: number): Promise<Hotel & { Rooms: Room[] }> {
  const hotel = await prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
    },
  });
  return hotel;
}

const hotelRepository = {
  findHotels,
  findRooms,
};

export default hotelRepository;
