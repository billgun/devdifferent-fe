// lib/markerSchema.ts

import { z } from "zod";

export const markerUpdateSchema = z.object({
  price: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .positive("Price must be greater than 0")
    .max(100000000, "Price seems too high"),
});

export type MarkerUpdateInput = z.infer<typeof markerUpdateSchema>;
