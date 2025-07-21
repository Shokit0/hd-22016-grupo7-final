import { defineCollection, z } from "astro:content";

const xboxContent = defineCollection({
  schema: z.object({
    title: z.string(),
    type: z.enum(["Clave", "Cuenta", "Regalo"]),
    region: z.string(),
    price: z.number(),
    originalPrice: z.number(),
    discount: z.number(),
    image: z.string(),
    description: z.string(),
    categories: z.array(z.string()).optional().default([]),
  }),
});

export const collections = { xboxContent };