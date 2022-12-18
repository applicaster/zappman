import { z } from "zod";
// TODO: use native fetch instead of axios
import axios from "axios";

const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  if (issue.code === z.ZodIssueCode.invalid_type) {
    console.log(issue);
    return {
      message: `\`${issue.path.slice(-1)[0]}\` has invalid type expected \`${
        issue.expected
      }\` but received \`${issue.received}\`.`,
    };
  }
  return { message: ctx.defaultError };
};

z.setErrorMap(customErrorMap);

const fairPlayCertificateSchema = z
  .object({
    extensions: z.any(),
  })
  .refine(
    async (obj) => {
      try {
        if (obj?.extensions?.drm?.fairplay?.certificate_url) {
          await axios.get(obj?.extensions?.drm?.fairplay?.certificate_url);
        }
        return true;
      } catch (error) {
        return false;
      }
    },
    {
      message: "Certificate URL returned an error - consult your DRM provider",
      path: ["extensions", "drm", "fairplay", "certificate_url"],
    }
  );

const contentSrcEntrySchema = z
  .object({
    content: z
      .object({
        type: z.string().optional(),
        src: z.string().optional(),
      })
      .optional(),
    link: z.object({}).optional(),
  })
  .refine(
    (val) => {
      if (val?.content?.type && !val.content.src) {
        return Boolean(val.link);
      }
      return true;
    },
    {
      message: "When `content.src` is not set, the `link` object is required",
      path: ["link"],
    }
  );

export const entrySchema = z
  .object({
    title: z.string().optional(),
    summary: z.string().optional(),

    id: z.string({
      invalid_type_error: "`id` must be a string",
    }),
    link: z
      .object({
        rel: z.string(),
        href: z.string().url(),
      })
      .optional(),
    type: z.object({
      value: z.string(),
    }),
    media_group: z.array(
      z.object({
        type: z.literal("image"),
        media_item: z.array(
          z.object({
            key: z.string(),
            src: z.string().url(),
          })
        ),
      })
    ),
    content: z
      .object({
        src: z.string({}).url().optional(),
        type: z.string({
          invalid_type_error: "`type` must be a string",
        }),
      })
      .optional(),
    extensions: z.object({}).optional(),
  })
  .strict()
  .and(contentSrcEntrySchema)
  .and(fairPlayCertificateSchema);

export const jsonFeedSchema = z.object({
  type: z.object({
    value: z.string({
      invalid_type_error: "`value` must be a string",
    }),
  }),
  entry: z.array(entrySchema),
});

export const schema = z.object({
  type: z.object({
    value: z.string({
      invalid_type_error: "`value` must be a string",
    }),
  }),
  entry: z.array(entrySchema),
});
