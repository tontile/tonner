import { z } from "zod";

export const telegramSigninSchema = z.object({
  initData: z.string(),
});
