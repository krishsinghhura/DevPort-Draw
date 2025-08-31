import { Request,Response,NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/servers-common/config";

export function middleware(req:Request,res:Response,next:NextFunction){
    const header=req.headers["authorization"]??"";

    const decoded=jwt.verify(header,JWT_SECRET);

    if(typeof decoded=="string"){
        return;
    }

    if(decoded){
        req.userId=decoded .userId;
        next();
    } else {
        res.status(403).json({message:"Unauthozied"});
    }
}