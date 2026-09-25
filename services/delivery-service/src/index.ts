import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "delivery-service",
  domain: "fulfillment",
  port: Number(process.env.PORT ?? "3031"),
  pubsubEvents: ["delivery.scheduled","delivery.completed"],
  enableDatabase: false,
});

registerRoutes(service.app, service.deps);
await service.start();

