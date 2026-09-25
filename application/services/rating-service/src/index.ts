import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "rating-service",
  domain: "customer",
  port: Number(process.env.PORT ?? "3054"),
  pubsubEvents: ["rating.updated"],
  enableDatabase: false,
});

registerRoutes(service.app, service.deps);
await service.start();

