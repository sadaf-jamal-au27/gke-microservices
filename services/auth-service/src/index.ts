import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "auth-service",
  domain: "identity",
  port: Number(process.env.PORT ?? "3001"),
  pubsubEvents: ["user.authenticated","user.logout"],
  enableDatabase: true,
});

registerRoutes(service.app, service.deps);
await service.start();

