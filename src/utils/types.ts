import { Prisma } from "../generated/prisma/client.js"
import { UserRole } from "../generated/prisma/enums.js"

export type JwtPayloadType={
    id:string,
    role:UserRole
}

export type AccessTokeType={
    accessToken:string
}


//this is a type that will be used to return the user without the password field
const userSelect = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

export type PublicUser = Prisma.UserGetPayload<{
  select: typeof userSelect;
}>;
