import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "loyalty-service",
  domain: "customer",
  port: Number(process.env.PORT ?? "3051"),
  pubsubEvents: ["loyalty.points.earned","loyalty.tier.changed"],
  enableDatabase: false,
});

registerRoutes(service.app, service.deps);
await service.start();

