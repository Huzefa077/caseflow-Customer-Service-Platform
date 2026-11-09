// WHAT: the "receptionist" for auth folder — This file reads the HTTP request, calls the service, sends the response.
// WHY:  keeps HTTP details (req, res, status codes) out of the login logic in service.ts.

import { Request, Response } from "express";
import { login, refresh } from "./service";

export async function loginController(req: Request, res: Response) {

    const { email, password } = req.body;

    try {
        const { user, accessToken, refreshToken } = await login(email, password);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({ user, accessToken });  //users first login will give not only his data, but also a JWT token which will be later verfied by the server in every single URL navigations.
    } catch (err) {
        res.status(401).json({ message: "Invalid email or password" });
    }
}

export async function refreshController(req: Request, res: Response) {
    const token = req.cookies.refreshToken;
     if (!token) {
        return res.status(401).json({ message: "No refresh token, please login" });
    }
    try {
        const { accessToken } = await refresh(token);
        res.status(200).json({ accessToken });
    } catch(err){
        res.status(401).json({message: "Auto id verification failed, Please login again"});
    }
}

export function meController(req: Request, res: Response) {
    res.json({ user: req.user });
}

//----STEPS (WHAT THIS FILE DOES)------
//  1.  take email + password out of the request body
//  2.  try: ask the service to log in
//  3.  success--> send 200 + the user
//  4.  service threw an error --> send 401 "invalid email or password"