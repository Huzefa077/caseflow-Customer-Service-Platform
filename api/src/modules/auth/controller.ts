// WHAT: the "receptionist" for auth folder — This file reads the HTTP request, calls the service, sends the response.
// WHY:  keeps HTTP details (req, res, status codes) out of the login logic in service.ts.

import { Request , Response } from "express";
import { login } from "./service";

export async function loginController( req: Request, res: Response){

    const {email,password} = req.body;

    try{
        const user = await login(email, password);
        res.status(200).json({user});
    }catch(err){
        res.status(401).json({message: "Invalid email or password"});
    }
}








//----STEPS (WHAT THIS FILE DOES)------
//  1.  take email + password out of the request body
//  2.  try: ask the service to log in
//  3.  success--> send 200 + the user
//  4.  service threw an error --> send 401 "invalid email or password"