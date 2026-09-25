import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "sms-service",
  domain: "engagement",
  port: Number(process.env.PORT ?? "3062"),
  pubsubEvents: ["sms.sent"],
  enableDatabase: false,
});

registerRoutes(service.app, service.deps);
await service.start();

