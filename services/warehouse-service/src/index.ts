import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "warehouse-service",
  domain: "catalog",
  port: Number(process.env.PORT ?? "3014"),
  pubsubEvents: ["warehouse.stock.moved"],
  enableDatabase: false,
});

registerRoutes(service.app, service.deps);
await service.start();

