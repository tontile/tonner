import { type Prisma, PrismaClient, type users } from "@prisma/client";
import * as jwt from "jsonwebtoken";
import { secureToken } from "../utils/secure-token";
import type { GoTrueClaims, TPrismaTransaction } from "../utils/types";

const prisma = new PrismaClient();

const DEFAULT_INSTANCE_ID = "00000000-0000-0000-0000-000000000000";
const SEVEN_DAYS_IN_SECONDS = 604800;

export const generateAccessToken = async (
  user: users,
  expiresIn: number,
  tx: TPrismaTransaction,
  sessionId?: string,
): Promise<string> => {
  if (sessionId) {
    const session = await tx.sessions.findUnique({
      where: {
        id: sessionId,
      },
    });

    if (!session) {
      throw new Error("Session not found");
    }
  }

  if (!user.aud || !user.role || !sessionId) {
    throw new Error("Missing user information");
  }

  const claims: GoTrueClaims = {
    sub: user.id,
    aud: user.aud,
    exp: Math.floor(Date.now() / 1000) + expiresIn,
    app_metadata: user.raw_app_meta_data,
    user_metadata: user.raw_user_meta_data,
    role: user.role,
    session_id: sessionId,
    email: "",
    phone: "",
  };

  const token = jwt.sign(claims, process.env.SUPABASE_JWT_SECRET!);
  return token;
};

interface TonUser {
  account_name?: string;
  address?: string;
  network?: string;
}

interface TelegramUser {
  id?: number;
  first_name?: string;
  last_name?: string;
  photo_url?: string;
  username?: string;
  is_bot?: boolean;
  language_code?: string;
  is_premium?: boolean;
}

interface SignInRequest {
  ton?: TonUser | undefined;
  telegram?: TelegramUser | undefined;
}

export async function createOrUpdateUser({ ton, telegram }: SignInRequest) {
  const tokens = await prisma.$transaction(async (tx) => {
    const existingUser = await tx.users.findFirst({
      where: {
        OR: [
          ton
            ? {
                raw_user_meta_data: {
                  path: ["ton_address"],
                  equals: ton.address,
                },
                AND: {
                  raw_user_meta_data: {
                    path: ["ton_network"],
                    equals: ton.network.toString(),
                  },
                },
              }
            : undefined,
          telegram
            ? {
                raw_user_meta_data: {
                  path: ["telegram_id"],
                  equals: telegram.id,
                },
              }
            : undefined,
        ].filter(Boolean),
      },
    });

    if (existingUser) {
      // Check if user registered via TON but logged in via TG
      const app_metadata = existingUser.raw_app_meta_data as Prisma.JsonObject;
      const user_metadata =
        existingUser.raw_user_meta_data as Prisma.JsonObject;
      // verify user account and assign TG's data to user
      if (!app_metadata?.account_name_verified) {
        if (!telegram || telegram.username !== app_metadata.account_name) {
          throw new Error("Account is not verified");
        }

        app_metadata.account_name_verified = true;
        user_metadata.telegram_id = telegram.id;
        user_metadata.telegram_avatar_url = telegram.photo_url;
        user_metadata.display_name = `${telegram.first_name} ${telegram.last_name}`;
        user_metadata.locale = telegram.language_code;
      }

      // Check for an existing session and update the last sign in date
      let existingSession = await tx.sessions.findFirst({
        where: {
          user_id: existingUser.id,
        },
      });
      await tx.users.update({
        where: {
          id: existingUser.id,
        },
        data: {
          raw_app_meta_data: app_metadata,
          raw_user_meta_data: user_metadata,
          last_sign_in_at: new Date().toISOString(),
        },
      });
      if (!existingSession) {
        existingSession = await tx.sessions.create({
          data: {
            user_id: existingUser.id,
          },
        });
      }

      const existingIdentity = await tx.identities.findFirst({
        where: {
          user_id: existingUser.id,
        },
      });
      if (!existingIdentity) {
        await tx.identities.create({
          data: {
            id: existingUser.id,
            provider: ton ? "ton" : "telegram",
            user_id: existingUser.id,
            provider_id: ton ? ton.address : telegram.id.toString(),
            identity_data: {
              sub: existingUser.id,
              address: ton.address,
              account_name: ton ? ton.account_name : telegram.username,
            },
            last_sign_in_at: new Date().toISOString(),
          },
        });
      }

      // Generate access and refresh tokens
      const generatedRefreshToken = secureToken();

      const refreshToken = await tx.refresh_tokens.create({
        data: {
          session_id: existingSession.id,
          user_id: existingUser.id,
          instance_id: DEFAULT_INSTANCE_ID,
          parent: "",
          token: generatedRefreshToken,
        },
      });
      const accessToken = await generateAccessToken(
        existingUser,
        SEVEN_DAYS_IN_SECONDS,
        tx,
        existingSession.id,
      );

      return { refresh_token: refreshToken.token, access_token: accessToken };
    }

    const newUser = await tx.users.create({
      data: {
        aud: "authenticated",
        role: "authenticated",
        email_confirmed_at: new Date().toISOString(),
        confirmation_token: secureToken(8),
        instance_id: DEFAULT_INSTANCE_ID,
        last_sign_in_at: new Date().toISOString(),
        raw_app_meta_data: {
          provider: ton ? "ton" : "telegram",
          providers: ["ton", "telegram"],
          account_name: telegram ? telegram.username : ton.account_name,
          account_name_verified: !!telegram,
        },
        raw_user_meta_data: {
          account_name: telegram ? telegram.username : ton.account_name,
          telegram_id: telegram.id,
          telegram_avatar_url: telegram.photo_url,
          ton_address: ton.address,
          ton_network: ton.network.toString(),
          display_name: `${telegram.first_name} ${telegram.last_name}`,
          locale: telegram.language_code,
          onboarded: false,
        },
      },
    });

    // Create the session and identity
    const session = await tx.sessions.create({
      data: {
        user_id: newUser.id,
      },
    });
    await tx.identities.create({
      data: {
        id: newUser.id,
        provider: ton ? "ton" : "telegram",
        user_id: newUser.id,
        provider_id: ton ? ton.address : telegram.id.toString(),
        identity_data: {
          sub: newUser.id,
          address: ton.address,
          account_name: ton ? ton.account_name : telegram.username,
        },
        last_sign_in_at: new Date().toISOString(),
      },
    });

    // Generate tokens
    const generatedRefreshToken = secureToken();
    const refreshToken = await tx.refresh_tokens.create({
      data: {
        session_id: session.id,
        user_id: newUser.id,
        instance_id: DEFAULT_INSTANCE_ID,
        parent: "",
        token: generatedRefreshToken,
      },
    });
    const accessToken = await generateAccessToken(
      newUser,
      SEVEN_DAYS_IN_SECONDS,
      tx,
      session.id,
    );

    return { refresh_token: refreshToken.token, access_token: accessToken };
  });

  return tokens;
}
