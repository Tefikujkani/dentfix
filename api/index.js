import serverless from "serverless-http";
import { getReadyApp } from "../backend/src/app.js";

let handlerPromise;

export default async function handler(req, res) {
  if (!handlerPromise) {
    handlerPromise = getReadyApp().then((app) => serverless(app));
  }
  const run = await handlerPromise;
  return run(req, res);
}
