
import express from "express";

const app = express();

app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/contest", contestRouter);

app.listen(process.env.PORT ?? 4000);