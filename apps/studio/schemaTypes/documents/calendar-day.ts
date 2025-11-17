import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";
import { CalendarDaysIcon, Code2, Palette } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";

import { GROUP, GROUPS } from "../../utils/constant";
import { seoFields } from "../../utils/seo-fields";
import { documentSlugField } from "../common";

export const calendarDay = defineType({
  name: "calendarDay",
  title: "Kalenderluke",
  type: "document",
  icon: CalendarDaysIcon,
  groups: [
      {
      name: 'tech',
      icon: Code2,
      title: "Tech",
    },
    {
      name: 'design',
      icon: Palette,
      title: "Design",
    },
  ],
  orderings: [orderRankOrdering],
  description:
    "An individual day in the Christmas calendar with both tech and design activities. Each day helps users learn something new about Sanity and Next.js!",
  fields: [
    orderRankField({ type: "calendarDay" }),
    defineField({
      name: "dayNumber",
      type: "number",
      title: "Nummer på dag",
      description: "Hvilken luke i kalenderen dette er (1-24)",
      // group: GROUP.MAIN_CONTENT,
      validation: (Rule) => [
        Rule.required().error("Dagnummer er påkrevd"),
        Rule.min(1).error("Dagnummeret må være minst 1"),
        Rule.max(24).error("Dagnummeret kan ikke være større enn 24"),
        Rule.integer().error("Dagnummeret må være et heltall"),
      ],
    }),
    defineField({
      name: "title",
      type: "string",
      title: "Tittel",
      description:
        "Overskriven for dagens oppgave (e.g., 'Set Up Your Sanity Studio')",
      // group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required().error("A day title is required"),
    }),
    defineField({
      name: "description",
      title: "Beskrivelse",
      type: "text",
      rows: 2,
      description:
        "Et kort sammendrag av hva deltakeren kan forvente å lære av dagens luke",
      // group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "category",
      title: "Kategori",
      type: "reference",
      to: [{ type: "dayCategory" }],
      // group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required().error("A category is required"),
    }),
    defineField({
      name: "isBreak",
      title: "Er pause-dag?",
      type: "boolean",
      description: "Skru på denne hvis denne dagen er en pausedag (har ingen oppgaver)",
      // group: GROUP.MAIN_CONTENT,
      initialValue: false,
    }),
    defineField({
      name: "breakContent",
      title: "Pause-dag innhold",
      type: "richText",
      // group: GROUP.MAIN_CONTENT,
      hidden: ({ parent }) => !parent?.isBreak,
    }),
    documentSlugField("calendarDay", {
      title: 'Slug',
      description: '',      
      // group: GROUP.MAIN_CONTENT,
    }),

     defineField({
      name: "reward",
      title: "🎁 Reward/Unlock",
      description:
        "What users unlock or earn by completing this day (can be empty for early days)",
      type: "text",
      rows: 1,
      //group: GROUP.MAIN_CONTENT,
    }), 
    defineField({
      name: "intro",
      title: "Felles intro",
      type: "richText",
      // group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "techActivity",
      title: "💻 Tech-oppgave",
      type: "object",
      group: 'tech',
      fields: [
        defineField({
          name: "title",
          type: "string",
          title: "Tittel på tech-oppgave",
          validation: (Rule) => Rule.required(),
        }),
      /*   defineField({
          name: "duration",
          type: "string",
          title: "Estimated Duration",
          description:
            "How long this task typically takes (e.g., '45 minutes')",
        }), */
    /*     defineField({
          name: "difficulty",
          type: "string",
          title: "Difficulty Level",
          options: {
            list: [
              { title: "Beginner", value: "beginner" },
              { title: "Intermediate", value: "intermediate" },
              { title: "Advanced", value: "advanced" },
            ],
            layout: "radio",
          },
          initialValue: "beginner",
        }), */
        defineField({
          name: "objectives",
          title: "Lærningsmål",
          type: "array",
          of: [{ type: "string" }],
        }),
        defineField({
          name: "content",
          title: "Instruksjoner",
          description: "Steg-for-steg instruksjoner for å gjennomføre oppgaven",
          type: "richText",
        }),
        defineField({
          name: "codeExamples",
          title: "Kodeeksempler",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({
                  name: "language",
                  type: "string",
                  title: "Språk",
                  options: {
                    list: [
                      "bash",
                      "groq",
                      "typescript",
                      "javascript",
                      "json",
                      "jsx",
                      "tsx",
                      "css",
                      "html",
                    ],
                  },
                  initialValue: "typescript",
                }),
                defineField({
                  name: "code",
                  type: "text",
                  title: "Kode",
                  rows: 10,
                }),
                defineField({
                  name: "filename",
                  type: "string",
                  title: "Filnavn",
                  description: "Navnet på filen denne koden tilhører",
                }),
              ],
              preview: {
                select: {
                  filename: "filename",
                  language: "language",
                },
                prepare: ({ filename, language }) => ({
                  title: filename || "Code Example",
                  subtitle: language || "Code",
                }),
              },
            }),
          ],
        }),
         defineField({
      name: "handIn",
      title: "Innlevering",
      type: "richText",
    }),
        defineField({
          name: "resources",
          title: "Ressurser",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({
                  name: "title",
                  type: "string",
                  title: "Tittel på lenke",
                }),
                defineField({
                  name: "url",
                  type: "url",
                  title: "URL",
                }),
              ],
              preview: {
                select: {
                  title: "title",
                  url: "url",
                },
                prepare: ({ title, url }) => ({
                  title: title || "Resource",
                  subtitle: url,
                }),
              },
            }),
          ],
        }),
      /*   defineField({
          name: "hint",
          title: "💡 Hint",
          type: "text",
          description: "Optional hint if users get stuck",
          rows: 2,
        }), */
      /*   defineField({
          name: "solution",
          title: "✅ Solution",
          description:
            "The complete solution (hidden by default, shown when users need help)",
          type: "richText",
        }), */
      ],
      preview: {
        select: {
          title: "title",
          difficulty: "difficulty",
          duration: "duration",
        },
        prepare: ({ title, difficulty, duration }) => ({
          title: title || "Tech Activity",
          subtitle: `${difficulty || "N/A"} • ${duration || "N/A"}`,
        }),
      },
    }),
    defineField({
      name: "designActivity",
      title: "🎨 Designoppgave",
      type: "object",
      group: 'design',
      fields: [
        defineField({
          name: "title",
          type: "string",
          title: "Tittle på designoppgave",
          validation: (Rule) => Rule.required(),
        }),
      /*   defineField({
          name: "duration",
          type: "string",
          title: "Estimated Duration",
          description: "How long this task typically takes",
        }), */
      /*   defineField({
          name: "difficulty",
          type: "string",
          title: "Difficulty Level",
          options: {
            list: [
              { title: "Beginner", value: "beginner" },
              { title: "Intermediate", value: "intermediate" },
              { title: "Advanced", value: "advanced" },
            ],
            layout: "radio",
          },
          initialValue: "beginner",
        }), */
        defineField({
          name: "objectives",
          title: "Læringsmål",
          type: "array",
          of: [{ type: "string" }],
        }),
        defineField({
          name: "content",
          title: "Instruksjoner",
          description:
            "Steg-for-steg instruksjoner for å fullføre designoppgaven",
          type: "richText",
        }),
      /*   defineField({
          name: "designExamples",
          title: "Design Examples",
          description: "Images showing examples or inspiration",
          type: "array",
          of: [
            defineArrayMember({
              type: "image",
              options: {
                hotspot: true,
              },
              fields: [
                defineField({
                  name: "caption",
                  type: "string",
                  title: "Caption",
                  description: "What this example shows",
                }),
              ],
            }),
          ],
        }), */
         defineField({
      name: "handIn",
      title: "Innlevering",
      type: "richText",
    }),
        defineField({
          name: "resources",
          title: "Ressurser",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({
                  name: "title",
                  type: "string",
                  title: "tittel på lenke",
                }),
                defineField({
                  name: "url",
                  type: "url",
                  title: "URL",
                }),
              ],
              preview: {
                select: {
                  title: "title",
                  url: "url",
                },
                prepare: ({ title, url }) => ({
                  title: title || "Resource",
                  subtitle: url,
                }),
              },
            }),
          ],
        }),
     /*    defineField({
          name: "hint",
          title: "💡 Hint",
          type: "text",
          description: "Optional hint if users get stuck",
          rows: 2,
        }), */
      ],
      preview: {
        select: {
          title: "title",
          difficulty: "difficulty",
          duration: "duration",
        },
        prepare: ({ title, difficulty, duration }) => ({
          title: title || "Design Activity",
          subtitle: `${difficulty || "N/A"} • ${duration || "N/A"}`,
        }),
      },
    }),
 /*    defineField({
      name: "sharedNotes",
      title: "📝 Shared Notes",
      description: "Important information for both tech and design tracks",
      type: "richText",
      group: GROUP.MAIN_CONTENT,
    }), */
    defineField({
      name: "conclusion",
      title: "Conclusion",
      description:
        "A summary of what was learned and how it sets up the next day",
      type: "richText",
      // group: GROUP.MAIN_CONTENT,
    }), 
    // ...seoFields,
  ],
  preview: {
    select: {
      dayNumber: "dayNumber",
      title: "title",
      media: "icon",
    },
    prepare: ({ dayNumber, title, media }) => {
      const dayEmoji = "🎄";
      return {
        title: dayNumber
          ? `Day ${dayNumber} - ${title || "Untitled Day"}`
          : title || "Untitled Day",
        media: media || undefined,
        subtitle: dayNumber ? `${dayEmoji} December ${dayNumber}` : undefined,
      };
    },
  },
});
