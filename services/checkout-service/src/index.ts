import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "checkout-service",
  domain: "commerce",
  port: Number(process.env.PORT ?? "3021"),
  pubsubEvents: ["checkout.started","checkout.completed"],
  enableDatabase: false,
});

registerRoutes(service.app, service.deps);
await service.start();

