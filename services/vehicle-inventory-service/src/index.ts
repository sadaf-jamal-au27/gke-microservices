import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";
const service = createService({
  name: "vehicle-inventory-service",
  domain: "automobile-inventory",
  port: Number(process.env.PORT ?? "3103"),
  pubsubEvents: ["automobile.event"],
  enableDatabase: true,
});
registerRoutes(service.app, service.deps);
await service.start();
