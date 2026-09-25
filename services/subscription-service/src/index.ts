import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "subscription-service",
  domain: "engagement",
  port: Number(process.env.PORT ?? "3065"),
  pubsubEvents: ["subscription.renewed"],
  enableDatabase: false,
});

registerRoutes(service.app, service.deps);
await service.start();

