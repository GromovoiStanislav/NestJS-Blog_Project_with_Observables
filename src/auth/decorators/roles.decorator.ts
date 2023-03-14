import { SetMetadata } from "@nestjs/common";

export const hasRoles = (...arrRoles: string[]) => SetMetadata('roles', arrRoles);