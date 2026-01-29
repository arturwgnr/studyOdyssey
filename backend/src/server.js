import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { authMiddleware } from "./middleware/middleware.js";

import {
  userRegisterController,
  userLoginController,
} from "./controllers/auth.controller.js";

import {
  addStudySectionController,
  listStudySectionController,
  deleteStudySectionController,
  dashboardSummaryController,
  getTotalStudyMinutesController,
  getRecentSessionsController,
  getLastSessionController,
  userSummaryController,
  weeklyReportController,
  topicDistributionController,
  updateStudySectionController,
} from "./controllers/studySession.controller.js";

import {
  addProjectController,
  getProjectsController,
  deleteProjectController,
} from "./controllers/projects.controller.js";

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

//Study Section
app.get("/dashboard/summary", authMiddleware, dashboardSummaryController);
app.get("/dashboard/week-report", authMiddleware, weeklyReportController);
app.get(
  "/dashboard/topic-distribution",
  authMiddleware,
  topicDistributionController,
);
app.get("/dashboard/complete-summary", authMiddleware, userSummaryController);
app.get("/dashboard/minutes", authMiddleware, getTotalStudyMinutesController);
app.get(
  "/dashboard/recent-sessions",
  authMiddleware,
  getRecentSessionsController,
);
app.get("/dashboard/last-session", authMiddleware, getLastSessionController);
app.get("/study-sections", authMiddleware, listStudySectionController);

app.post("/study-sections", authMiddleware, addStudySectionController);
app.delete("/study-sections/:id", authMiddleware, deleteStudySectionController);
app.put("/study-sections/:id", authMiddleware, updateStudySectionController);

//Projects
app.post("/projects", authMiddleware, addProjectController);
app.get("/projects", authMiddleware, getProjectsController);
app.delete("/projects/:id", authMiddleware, deleteProjectController);
