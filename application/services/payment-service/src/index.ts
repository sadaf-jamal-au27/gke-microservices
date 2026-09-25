import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "payment-service",
  domain: "commerce",
  port: Number(process.env.PORT ?? "3024"),
  pubsubEvents: ["payment.authorized","payment.captured"],
  enableDatabase: false,
});

registerRoutes(service.app, service.deps);
await service.start();

