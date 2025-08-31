
import express from "express";
import userRouter from "./routes/user"
import contestRouter from "./routes/contest"
import adminRouter from "./routes/admin"
const app = express();

app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/contest", contestRouter);

app.listen(process.env.PORT ?? 4000);