import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "email-service",
  domain: "engagement",
  port: Number(process.env.PORT ?? "3061"),
  pubsubEvents: ["email.queued","email.delivered"],
  enableDatabase: false,
});

registerRoutes(service.app, service.deps);
await service.start();

