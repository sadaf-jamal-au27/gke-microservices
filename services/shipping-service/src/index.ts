import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "shipping-service",
  domain: "fulfillment",
  port: Number(process.env.PORT ?? "3030"),
  pubsubEvents: ["shipment.created"],
  enableDatabase: false,
});

registerRoutes(service.app, service.deps);
await service.start();

