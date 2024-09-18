"use server";

import { actionClient } from "@/libs/safe-action";
import { AuthDataValidator, objectToAuthDataMap } from "@telegram-auth/server";
import { createClient } from "@tonner/supabase/server";
import { telegramSigninSchema } from "../schema";

// export const telegramSigninAction = actionClient
//   .schema(telegramSigninSchema)
//   .action(async ({ parsedInput: input }) => {
//     const supabase = createClient()
//     const result = await telegramSignin(supabase, input);

//     return result;
//   });
