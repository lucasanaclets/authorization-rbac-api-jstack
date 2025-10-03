import express from "express";

import { routeAdapter } from "./adapters/routeAdapter";

import { makeSignUpController } from "../factories/makeSignUpController";
import { makeSignInController } from "../factories/makeSignInController";
import { makeListLeadsController } from "../factories/makeListLeadsController";
import { middlewareAdapter } from "./adapters/middlewareAdapter";
import { makeAuthenticationMiddleware } from "../factories/makeAuthenticationMiddleware";
import { prismaClient } from "../application/libs/prismaClient";

const app = express();

// Middleware - Body Parse
app.use(express.json());

app.post("/sign-up", routeAdapter(makeSignUpController()));
app.post("/sign-in", routeAdapter(makeSignInController()));

app.get(
  "/leads",
  middlewareAdapter(makeAuthenticationMiddleware()),
  routeAdapter(makeListLeadsController())
);

app.post(
  "/leads",
  middlewareAdapter(makeAuthenticationMiddleware()),
  (req, res) => {
    console.log(req.metadata?.account?.role);
    res.json({ created: true });
  }
);

app.listen(3001, () =>
  console.log("🔥 Server started at http://localhost:3001")
);
