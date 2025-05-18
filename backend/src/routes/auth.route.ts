import { Router } from "express";
import authController from "../controllers/auth.controller";
import { LoginDTO, ResendOtpDTO, VerifyOtpDTO } from "../dtos/auth.dto";
import { validationMiddleware } from "../middlewares/validator.middleware";

const authRouter = Router();

authRouter.post(
  "/login",
  [validationMiddleware(LoginDTO)],
  authController.login
);
authRouter.post(
  "/verify-otp",
  [validationMiddleware(VerifyOtpDTO)],
  authController.verifyOtp
);
authRouter.post(
  "/resend-otp",
  [validationMiddleware(ResendOtpDTO)],
  authController.resendOtp
);
export default authRouter;
