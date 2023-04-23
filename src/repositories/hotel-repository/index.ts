import { prisma } from '@/config';

async function findHotels() {
  const hotels = prisma.hotel.findMany();
  return hotels;
}

const hotelRepository = {
  findHotels,
};

export default hotelRepository;
