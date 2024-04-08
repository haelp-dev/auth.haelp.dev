"use server";

import { User } from "@haelp/auth";
import { auth } from "@lib";
import { APIResponse } from "@types";
import { cookies } from "next/headers";

export const login = async (
  username: string,
  password: string
): Promise<APIResponse<User>> => {
  try {
    const { user, jwt } = await auth.authenticateUser(username, password);

    cookies().set(auth.jwt.cookie, jwt, {
      domain: auth.domain,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    return { success: true, data: user };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
};
