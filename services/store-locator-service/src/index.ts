import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "store-locator-service",
  domain: "fulfillment",
  port: Number(process.env.PORT ?? "3033"),
  pubsubEvents: ["store.updated"],
  enableDatabase: false,
});

registerRoutes(service.app, service.deps);
await service.start();

