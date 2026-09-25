import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "cart-service",
  domain: "commerce",
  port: Number(process.env.PORT ?? "3020"),
  pubsubEvents: ["cart.updated","cart.abandoned"],
  enableDatabase: true,
});

registerRoutes(service.app, service.deps);
await service.start();

