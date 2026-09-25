import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "order-fulfillment-service",
  domain: "commerce",
  port: Number(process.env.PORT ?? "3023"),
  pubsubEvents: ["fulfillment.started","fulfillment.completed"],
  enableDatabase: false,
});

registerRoutes(service.app, service.deps);
await service.start();

