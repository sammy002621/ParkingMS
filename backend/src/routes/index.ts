import { Router } from "express";
import authRouter from "./auth.route";
import userRouter from "./user.route";
import parkingSession from "./session.route";
import parkingSlotRouter from "./slot.route";
import paymentRouter from "./payment.route";
const router = Router();

router.use(
  "/auth",
  authRouter
  /*
        #swagger.tags = ['Auth']
        #swagger.security = [{
                "bearerAuth": []
        }] 
    */
);
router.use(
  "/user",
  userRouter
  /*
        #swagger.tags = ['Users']
        #swagger.security = [{
        }] 
    */
);
router.use(
  "/session",
  parkingSession
  /*
        #swagger.tags = ['Parking Session']
        #swagger.security = [{
                "bearerAuth": []
        }] 
    */
);
router.use(
  "/slot",
  parkingSlotRouter
  /*
        #swagger.tags = ['Parking Slot']
        #swagger.security = [{
                "bearerAuth": []
        }] 
    */
);
router.use(
  "/payment",
  paymentRouter
  /*
        #swagger.tags = ['Payment ']
        #swagger.security = [{
                "bearerAuth": []
        }] 
    */
);
export default router;
