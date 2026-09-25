import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "recommendation-service",
  domain: "customer",
  port: Number(process.env.PORT ?? "3055"),
  pubsubEvents: ["recommendation.generated"],
  enableDatabase: false,
});

registerRoutes(service.app, service.deps);
await service.start();

