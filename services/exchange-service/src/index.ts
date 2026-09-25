import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "exchange-service",
  domain: "fulfillment",
  port: Number(process.env.PORT ?? "3035"),
  pubsubEvents: ["exchange.processed"],
  enableDatabase: false,
});

registerRoutes(service.app, service.deps);
await service.start();

