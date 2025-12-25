import { z } from "zod";

export const idParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id"),
});

export const updateUserSchema = z.object({
  username: z.string().min(3, "username must be at least 3 characters"),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type IdParam = z.infer<typeof idParamSchema>;
