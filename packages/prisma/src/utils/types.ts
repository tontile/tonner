import type { Prisma, PrismaClient } from "@prisma/client";
import type { DefaultArgs, JsonValue } from "@prisma/client/runtime/library";

export type TPrismaTransaction = Omit<
  PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

export interface GoTrueClaims {
  sub: string;
  aud: string;
  exp: number;
  email?: string;
  phone?: string;
  app_metadata: JsonValue;
  user_metadata: JsonValue;
  role: string;
  session_id: string;
  authenticator_assurance_level?: string;
}
