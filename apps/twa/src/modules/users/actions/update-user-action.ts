"use server";

import { authActionClient } from "@/libs/safe-action";
import { updateUser } from "@tonner/supabase/mutations";
import { updateUserSchema } from "../schema";

export const updateUserAction = authActionClient
  .schema(updateUserSchema)
  .action(async ({ parsedInput: input, ctx: { user, supabase } }) => {
    const result = await updateUser({ ...input, user_id: user.id }, supabase);

    return result;
  });
