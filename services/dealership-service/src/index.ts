import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";
const service = createService({
  name: "dealership-service",
  domain: "automobile-dealer",
  port: Number(process.env.PORT ?? "3102"),
  pubsubEvents: ["automobile.event"],
  enableDatabase: true,
});
registerRoutes(service.app, service.deps);
await service.start();
