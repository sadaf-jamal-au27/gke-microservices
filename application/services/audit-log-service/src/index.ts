import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "audit-log-service",
  domain: "platform",
  port: Number(process.env.PORT ?? "3083"),
  pubsubEvents: ["audit.entry.recorded"],
  enableDatabase: false,
});

registerRoutes(service.app, service.deps);
await service.start();

