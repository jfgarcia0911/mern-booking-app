import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'

//To add interface to Request
declare global {
    namespace Express {
        interface Request {
            userId: string
        }
    }
}

 const verifyToken = (req: Request, res: Response, next: NextFunction) => {
	const token = req.cookies["auth_token"];
    if(!token){
        return res.status(401).send({msg: "unauthorized"})
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string)
        req.userId = (decoded as JwtPayload).userId
        //next is like return
        next()

    } catch (err) {
        return res.status(401).send({msg: "unauthorized"})
        
    }
};

export default verifyToken;