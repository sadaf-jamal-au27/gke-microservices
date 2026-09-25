import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "promotion-service",
  domain: "catalog",
  port: Number(process.env.PORT ?? "3016"),
  pubsubEvents: ["promotion.started","promotion.ended"],
  enableDatabase: false,
});

registerRoutes(service.app, service.deps);
await service.start();

