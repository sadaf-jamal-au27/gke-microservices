import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "reporting-service",
  domain: "platform",
  port: Number(process.env.PORT ?? "3081"),
  pubsubEvents: ["report.generated"],
  enableDatabase: false,
});

registerRoutes(service.app, service.deps);
await service.start();

