<<<<<<< HEAD
import { Prisma } from "../generated/prisma/client.js"
=======
>>>>>>> 47a567bc117c759e3298386dea82475883322a25
import { UserRole } from "../generated/prisma/enums.js"

export type JwtPayloadType={
    id:string,
    role:UserRole
}

export type AccessTokeType={
    accessToken:string
<<<<<<< HEAD
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
=======
}
>>>>>>> 47a567bc117c759e3298386dea82475883322a25
