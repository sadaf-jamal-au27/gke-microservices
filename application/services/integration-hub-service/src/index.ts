import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "integration-hub-service",
  domain: "platform",
  port: Number(process.env.PORT ?? "3085"),
  pubsubEvents: ["integration.sync.completed"],
  enableDatabase: false,
});

registerRoutes(service.app, service.deps);
await service.start();

