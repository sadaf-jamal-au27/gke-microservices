import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "brand-service",
  domain: "catalog",
  port: Number(process.env.PORT ?? "3012"),
  pubsubEvents: ["brand.updated"],
  enableDatabase: false,
});

registerRoutes(service.app, service.deps);
await service.start();

