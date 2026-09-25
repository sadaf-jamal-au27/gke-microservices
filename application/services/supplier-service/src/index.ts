import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "supplier-service",
  domain: "supply",
  port: Number(process.env.PORT ?? "3040"),
  pubsubEvents: ["supplier.onboarded"],
  enableDatabase: false,
});

registerRoutes(service.app, service.deps);
await service.start();

