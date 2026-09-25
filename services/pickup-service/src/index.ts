import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "pickup-service",
  domain: "fulfillment",
  port: Number(process.env.PORT ?? "3032"),
  pubsubEvents: ["pickup.ready"],
  enableDatabase: false,
});

registerRoutes(service.app, service.deps);
await service.start();

