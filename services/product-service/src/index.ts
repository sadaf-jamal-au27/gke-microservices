import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "product-service",
  domain: "catalog",
  port: Number(process.env.PORT ?? "3010"),
  pubsubEvents: ["product.created","product.updated"],
  enableDatabase: true,
});

registerRoutes(service.app, service.deps);
await service.start();

