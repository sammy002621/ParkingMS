import { hashSync } from "bcrypt";
import { config } from "dotenv";
import { Request, Response } from "express";
import prisma from "../prisma/prisma-client";
import ServerResponse from "../utils/ServerResponse";
import { sendOtpEmail } from "../utils/email";

config();

const createUser = async (req: Request, res: Response) => {
  try {
    const { email, firstName, lastName, password, role } = req.body;
    const hashedPassword = hashSync(password, 10);
    const iUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (iUser) {
      return ServerResponse.error(
        res,
        `User with email ${email} already exists`,
        400
      );
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    try {
      await sendOtpEmail(email, code);
      console.log("OTP email sent to:", email);
    } catch (e) {
      console.error("Email send failed:", e);
      return ServerResponse.error(
        res,
        "Failed to send OTP email. Please try again later.",
        500
      );
    }
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        role,
        password: hashedPassword,
      },
    });
    await prisma.otp.create({
      data: {
        userId: user.id,
        otpCode: code,
        expiresAt,
      },
    });

    return ServerResponse.created(res, "User created successfully", { user });
  } catch (error: any) {
    if (error.code === "P2002") {
      const key = error.meta.target[0];
      return ServerResponse.error(
        res,
        `${key.charAt(0).toUpperCase() + key.slice(1)} (${
          req.body[key]
        }) already exists`,
        400
      );
    }
    return ServerResponse.error(res, "Error occured", { error });
  }
};

const userController = {
  createUser,
};

export default userController;
