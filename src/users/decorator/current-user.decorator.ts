import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { JwtPayloadType } from "../../utils/types.js";

export const CurrentUser= createParamDecorator((data, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user: JwtPayloadType = request['user'] //we add it to request in AuthGuard
    return user
})