import { UserRole } from "@prisma/client";

export interface IAuthUser {
  id: number;
  branches: {id: number; role: UserRole}[];
}