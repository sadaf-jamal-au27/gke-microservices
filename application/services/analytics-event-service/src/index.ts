import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "analytics-event-service",
  domain: "platform",
  port: Number(process.env.PORT ?? "3080"),
  pubsubEvents: ["analytics.event.ingested"],
  enableDatabase: false,
});

registerRoutes(service.app, service.deps);
await service.start();

