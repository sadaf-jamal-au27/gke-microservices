import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "webhook-dispatcher-service",
  domain: "platform",
  port: Number(process.env.PORT ?? "3084"),
  pubsubEvents: ["webhook.dispatched"],
  enableDatabase: false,
});

registerRoutes(service.app, service.deps);
await service.start();

