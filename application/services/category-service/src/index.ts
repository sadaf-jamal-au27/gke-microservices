import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "category-service",
  domain: "catalog",
  port: Number(process.env.PORT ?? "3011"),
  pubsubEvents: ["category.updated"],
  enableDatabase: false,
});

registerRoutes(service.app, service.deps);
await service.start();

