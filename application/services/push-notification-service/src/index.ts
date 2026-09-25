import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "push-notification-service",
  domain: "engagement",
  port: Number(process.env.PORT ?? "3063"),
  pubsubEvents: ["push.sent"],
  enableDatabase: false,
});

registerRoutes(service.app, service.deps);
await service.start();

