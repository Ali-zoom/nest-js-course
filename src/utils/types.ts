import { UserRole } from "../generated/prisma/enums.js"

export type JwtPayloadType={
    id:string,
    role:UserRole
}

export type AccessTokeType={
    accessToken:string
}