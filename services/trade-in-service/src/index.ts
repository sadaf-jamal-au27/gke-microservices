import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";
const service = createService({
  name: "trade-in-service",
  domain: "automobile-tradein",
  port: Number(process.env.PORT ?? "3110"),
  pubsubEvents: ["automobile.event"],
  enableDatabase: true,
});
registerRoutes(service.app, service.deps);
await service.start();
