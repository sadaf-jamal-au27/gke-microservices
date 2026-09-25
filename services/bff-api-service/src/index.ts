import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "bff-api-service",
  domain: "edge",
  port: Number(process.env.PORT ?? "3090"),
  pubsubEvents: ["bff.request.routed"],
  enableDatabase: false,
});

registerRoutes(service.app, service.deps);
await service.start();

