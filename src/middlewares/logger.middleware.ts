import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response,NextFunction } from "express";
@Injectable()
export class LoggerMiddleware implements NestMiddleware{
    use(req: Request, res: Response, next: NextFunction) {
        console.log({
            header:req.headers,
            method:req.method,
            host:req.hostname,
            origin:req.originalUrl
        })
        next()

        //res.status(401).json({message:"you are not allowed"}) res for error
    }
}