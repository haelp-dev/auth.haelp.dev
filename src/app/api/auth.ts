"use server";

import { auth } from "@lib";
import { cookies,  } from "next/headers";

export const getAccount = async () => {
  const cookie = cookies().get(auth.jwt.cookie);
  if (!cookie) return null;
  try {
    return await auth.getUser(cookie.value);
  } catch {
    return null;
  }
};
