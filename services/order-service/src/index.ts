import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "order-service",
  domain: "commerce",
  port: Number(process.env.PORT ?? "3022"),
  pubsubEvents: ["order.placed","order.cancelled"],
  enableDatabase: true,
});

registerRoutes(service.app, service.deps);
await service.start();

