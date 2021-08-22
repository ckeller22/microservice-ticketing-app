import express from "express";

import { currentUser } from "@csktickets/common";

const router = express.Router();

router.get("/api/users/currentuser", currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
  console.log(req.currentUser);
});

export { router as currentUserRouter };
