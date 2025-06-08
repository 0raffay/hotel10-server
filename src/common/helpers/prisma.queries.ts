export const reservationInclude = {
  reservationResource: true,
  branch: true,
  payments: true,
  room: {
    include: {
      roomType: true,
      floor: true
    }
  },
  guest: true,
  createdBy: true,
  updatedBy: true
};

export const userInclude = {
  reservationsCreated: {
    include: reservationInclude
  },
  branches: {
    include: {
      branch: true
    }
  }
};

export const roomInclude = {
  branch: true,
  floor: true,
  reservations: true,
  roomResources: true,
  roomType: true
};
