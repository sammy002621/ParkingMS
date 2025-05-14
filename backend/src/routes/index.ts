import { Router } from "express";
import authRouter from "./auth.route";
import userRouter from "./user.route";
import bookRouter from "./book.route";

const router = Router()

router.use("/auth", authRouter
    /*
        #swagger.tags = ['Auth']
        #swagger.security = [{
                "bearerAuth": []
        }] 
    */
)
router.use("/user", userRouter
    /*
        #swagger.tags = ['Users']
        #swagger.security = [{
        }] 
    */
)
router.use("/books", bookRouter
    /*
        #swagger.tags = ['Books']
        #swagger.security = [{
                "bearerAuth": []
        }] 
    */
)
export default router