import { UserRole } from "@prisma/client";

export interface IAuthUser {
  id: number;
  hotelId: number;
  branches: {id: number; role: UserRole}[];
}