import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "coupon-service",
  domain: "catalog",
  port: Number(process.env.PORT ?? "3017"),
  pubsubEvents: ["coupon.redeemed"],
  enableDatabase: false,
});

registerRoutes(service.app, service.deps);
await service.start();

