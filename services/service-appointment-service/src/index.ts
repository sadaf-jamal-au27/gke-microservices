import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";
const service = createService({
  name: "service-appointment-service",
  domain: "automobile-aftersales",
  port: Number(process.env.PORT ?? "3109"),
  pubsubEvents: ["automobile.event"],
  enableDatabase: true,
});
registerRoutes(service.app, service.deps);
await service.start();
