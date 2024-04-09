"use server";

import { User } from "@haelp/auth";
import { auth, checkValidUsername } from "@lib";
import { checkValidEmail } from "@lib/email";
import { APIResponse } from "@types";
import { cookies } from "next/headers";

export const signup = async (
  user: Omit<User, "id"> & { password: string }
): Promise<APIResponse<User>> => {
  try {
    const validationRes = await validateUser(user);
    if (validationRes !== true) return { success: false, error: validationRes };

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

export const validateUser = async (user: Omit<User, "id">) => {
  // validate username
  if (!checkValidUsername(user.username)) return "Invalid username";
  if (await auth.checkIdentifier(user.username)) return "Username taken";

  // validate email
  if (!checkValidEmail(user.email)) return "Invalid email";
  if (await auth.checkIdentifier(user.email)) return "Email already in use";

  return true;
};
