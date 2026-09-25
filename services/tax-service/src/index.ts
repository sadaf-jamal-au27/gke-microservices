import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "tax-service",
  domain: "commerce",
  port: Number(process.env.PORT ?? "3028"),
  pubsubEvents: ["tax.calculated"],
  enableDatabase: false,
});

registerRoutes(service.app, service.deps);
await service.start();

