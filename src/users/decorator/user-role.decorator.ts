import { SetMetadata } from "@nestjs/common";
import { UserRole } from "../../utils/enums.js";

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);// we will use it in the controller and AuthRolesGuard to get 'roles' key and check if the user has the required role to access the route