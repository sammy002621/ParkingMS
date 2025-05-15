import { Router } from "express";
import ParkingSlotController from "../controllers/slot.controller";
import { validationMiddleware } from "../middlewares/validator.middleware";
import { checkAdmin, checkLoggedIn } from "../middlewares/auth.middleware";
import { CreteParkingSlotDTO } from "../dtos/parking_slot.dto";

const ParkingSlotRouter = Router();

ParkingSlotRouter.post(
  "/create",
  [checkAdmin, validationMiddleware(CreteParkingSlotDTO)],
  ParkingSlotController.createParkingSlot
);
ParkingSlotRouter.get(
  "/all",
  [checkAdmin, checkLoggedIn],
  ParkingSlotController.fetchParkingSlots
);
ParkingSlotRouter.get(
  "/all/available",
  [checkLoggedIn],
  ParkingSlotController.fetchFreeSlots
);
ParkingSlotRouter.get("/:id", [checkLoggedIn], ParkingSlotController.findById);

export default ParkingSlotRouter;
