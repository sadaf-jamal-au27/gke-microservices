import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "returns-service",
  domain: "fulfillment",
  port: Number(process.env.PORT ?? "3034"),
  pubsubEvents: ["return.requested","return.approved"],
  enableDatabase: false,
});

registerRoutes(service.app, service.deps);
await service.start();

