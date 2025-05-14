import { Router } from "express";
import bookController from "../controllers/book.controller";
import { CreateBookDTO } from "../dtos/book.dto";
import { validationMiddleware } from "../middlewares/validator.middleware";
import { checkAdmin, checkLoggedIn } from "../middlewares/auth.middleware";

const bookRouter = Router();

bookRouter.post(
  "/create",
  [checkAdmin, validationMiddleware(CreateBookDTO)],
  bookController.createBook
);
bookRouter.get("/all", [checkLoggedIn], bookController.fetchBooks);
bookRouter.get("/:id", [checkLoggedIn], bookController.findById);

export default bookRouter;
