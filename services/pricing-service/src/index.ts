import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "pricing-service",
  domain: "catalog",
  port: Number(process.env.PORT ?? "3015"),
  pubsubEvents: ["price.changed"],
  enableDatabase: false,
});

registerRoutes(service.app, service.deps);
await service.start();

