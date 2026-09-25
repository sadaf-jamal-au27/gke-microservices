import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "inventory-service",
  domain: "catalog",
  port: Number(process.env.PORT ?? "3013"),
  pubsubEvents: ["inventory.adjusted","inventory.low"],
  enableDatabase: true,
});

registerRoutes(service.app, service.deps);
await service.start();

