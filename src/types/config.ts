import { z } from 'astro/zod';

export const zSiteConfig = z.object({
  title: z.string(),
  titleTemplate: z.string().optional(),
  lang: z.string().default('en'),

  coverImageStyle: z
    .enum(['static', 'parallax', 'half-parallax'])
    .default('half-parallax'),
});

export type SiteConfig = z.infer<typeof zSiteConfig>;
export type SiteConfigInput = z.input<typeof zSiteConfig>;
export const defineSiteConfig = (config: SiteConfigInput): SiteConfig =>
  zSiteConfig.parse(config);
