export interface ICrudService<Entity, CreateDto, UpdateDto> {
  findAll(user?:any): Promise<Entity[] | []>;
  findOne(id: number, user?: any): Promise<Entity | null>;
  create(data: CreateDto, user?: any): Promise<Entity | null>;
  update(id: number, data: UpdateDto, user?: any): Promise<Entity | null>;
  remove(id: number, user?: any): Promise<Entity | null>;
}
export interface ICrudController<Entity, CreateDto, UpdateDto> {
  create(data: CreateDto, req?: any): Promise<Entity | null>;
  update(id: string, data: UpdateDto, req?: any): Promise<Entity | null>;
  findAll(req?: any): Promise<Entity[] | []>;
  findOne(id: string, req?: any): Promise<Entity | null>;
  remove(id: string, req?: any): Promise<Entity | null>;
}

export enum Entity {
  ROOM = "room",
  RESERVATION = "reservation",
  RESOURCE = "resource"
}

export enum Role {
  ADMIN = "admin",
  MANAGER = "manager",
  AGENT = "agent"
}

export enum RoomStatus {
  AVAILABLE = "available",
  BOOKED = "booked",
  UNDER_MAINTENANCE = "under_maintenance",
}