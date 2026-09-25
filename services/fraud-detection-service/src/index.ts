import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "fraud-detection-service",
  domain: "platform",
  port: Number(process.env.PORT ?? "3082"),
  pubsubEvents: ["fraud.alert.raised"],
  enableDatabase: false,
});

registerRoutes(service.app, service.deps);
await service.start();

