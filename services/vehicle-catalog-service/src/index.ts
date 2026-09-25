import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";
const service = createService({
  name: "vehicle-catalog-service",
  domain: "automobile-catalog",
  port: Number(process.env.PORT ?? "3101"),
  pubsubEvents: ["automobile.event"],
  enableDatabase: true,
});
registerRoutes(service.app, service.deps);
await service.start();
