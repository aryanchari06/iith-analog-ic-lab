import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().trim(), //identifier: username/email
  password: z.string(),
});
