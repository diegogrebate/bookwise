import { redis } from "@/database/redis";
import { Ratelimit } from "@upstash/ratelimit";

export const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.fixedWindow(5, "60s"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});
