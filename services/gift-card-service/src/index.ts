import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "gift-card-service",
  domain: "engagement",
  port: Number(process.env.PORT ?? "3064"),
  pubsubEvents: ["giftcard.issued","giftcard.redeemed"],
  enableDatabase: false,
});

registerRoutes(service.app, service.deps);
await service.start();

