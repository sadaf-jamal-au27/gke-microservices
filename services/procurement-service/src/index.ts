import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "procurement-service",
  domain: "supply",
  port: Number(process.env.PORT ?? "3041"),
  pubsubEvents: ["purchase.order.created"],
  enableDatabase: false,
});

registerRoutes(service.app, service.deps);
await service.start();

