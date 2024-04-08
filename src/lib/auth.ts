import { Auth } from "@haelp/auth";

export const auth = new Auth({
  database: {
    uri: process.env.MONGODB_URI!,
    name: "auth",
  },
  domain: ".haelp.dev",
  jwt: {
    secret: process.env.JWT_SECRET!,
    cookie: "haelp.auth",
  },
});
