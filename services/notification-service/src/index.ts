import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "notification-service",
  domain: "engagement",
  port: Number(process.env.PORT ?? "3060"),
  pubsubEvents: ["notification.sent"],
  enableDatabase: false,
});

registerRoutes(service.app, service.deps);
await service.start();

