import express from "express";
import cors from "cors";

import {
  userRegisterController,
  userLoginController,
} from "./controllers/auth.controller.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.send("I have all that I need in order to succed!");
});

app.listen(3000, () => {
  console.log("🔥 Server on: httpp://localHhost/5433");
});

//Routes
//Auth Route
app.post("/auth/register", userRegisterController);
app.post("/auth/login", userLoginController);
