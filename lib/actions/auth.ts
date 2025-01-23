"use server";

import { signIn } from "@/auth";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { ratelimit } from "../ratelimit";
import { redirect } from "next/navigation";
import { workflowClient } from "@/lib/workflow";
import config from "../config";

export async function signInWithCredentials(
  params: Pick<AuthCredentials, "email" | "password">
): Promise<{ success: boolean; error?: string }> {
  const { email, password } = params;

  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);

  if (!success) return redirect("/too-fast");

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (result.error) {
      return { success: false, error: "Invalid Credentials!" };
    }

    return { success: true };
  } catch (error) {
    console.log(error, "Signup error!");
    return { success: false, error: "Something went wrong!" };
  }
}

export async function signUp(
  params: AuthCredentials
): Promise<{ success: boolean; error?: string }> {
  const { fullName, email, universityId, universityCard, password } = params;

  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);

  if (!success) return redirect("/too-fast");

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    return { success: false, error: "Invalid Credentials!" };
  }

  const hashedPassword = await hash(password, 10);

  try {
    await db.insert(users).values({
      fullName,
      email,
      universityId,
      universityCard,
      password: hashedPassword,
    });

    await workflowClient.trigger({
      url: `${config.env.prodApiEndpoint}/api/workflows/onboarding`,
      body: {
        email,
        fullName,
      },
    });

    const signInResult = await signInWithCredentials({ email, password });

    if (!signInResult.success) {
      return signInResult;
    }

    return { success: true };
  } catch (error) {
    console.error(error, "Signup error!");
    return { success: false, error: "Something went wrong!" };
  }
}
