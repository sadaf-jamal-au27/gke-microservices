import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "session-service",
  domain: "identity",
  port: Number(process.env.PORT ?? "3004"),
  pubsubEvents: ["session.created","session.revoked"],
  enableDatabase: false,
});

registerRoutes(service.app, service.deps);
await service.start();

