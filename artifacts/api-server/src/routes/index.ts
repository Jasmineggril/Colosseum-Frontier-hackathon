import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import dreamsRouter from "./dreams";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(dreamsRouter);

export default router;
