import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "payment-gateway-adapter",
  domain: "commerce",
  port: Number(process.env.PORT ?? "3025"),
  pubsubEvents: ["gateway.callback.received"],
  enableDatabase: false,
});

registerRoutes(service.app, service.deps);
await service.start();

