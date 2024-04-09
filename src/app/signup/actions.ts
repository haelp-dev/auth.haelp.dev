"use server";

import { User } from "@haelp/auth";
import { auth } from "@lib";
import { APIResponse } from "@types";
import { cookies } from "next/headers";

export const signup = async (
  user: Omit<User, "id"> & { password: string }
): Promise<APIResponse<User>> => {
  try {
    const { user: resUser, jwt } = await auth.createUser(user);

    cookies().set(auth.jwt.cookie, jwt, {
      domain: auth.domain,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    return { success: true, data: resUser };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
};

export const checkIdentifier = async (email: string): Promise<boolean> => {
  return await auth.checkIdentifier(email);
};

export const validateUser = (user: User) => {
  // TODO: implement
  return true;
};
