import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";
import { CalendarDaysIcon } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";

import { GROUP, GROUPS } from "../../utils/constant";
import { seoFields } from "../../utils/seo-fields";
import { documentSlugField } from "../common";

export const calendarDay = defineType({
  name: "calendarDay",
  title: "Calendar Day",
  type: "document",
  icon: CalendarDaysIcon,
  groups: GROUPS,
  orderings: [orderRankOrdering],
  description:
    "An individual day in the Christmas calendar with both tech and design activities. Each day helps users learn something new about Sanity and Next.js!",
  fields: [
    orderRankField({ type: "calendarDay" }),
    defineField({
      name: "dayNumber",
      type: "number",
      title: "Day Number",
      description: "Which day of the calendar this is (1-24)",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => [
        Rule.required().error("Day number is required"),
        Rule.min(1).error("Day must be at least 1"),
        Rule.max(24).error("Day must be at most 24"),
        Rule.integer().error("Day must be a whole number"),
      ],
    }),
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description:
        "The headline for this day (e.g., 'Set Up Your Sanity Studio')",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required().error("A day title is required"),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
      description:
        "A brief summary of what users will learn today (appears in previews)",
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "dayCategory" }],
      description: "The category this day belongs to",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required().error("A category is required"),
    }),
    documentSlugField("calendarDay", {
      group: GROUP.MAIN_CONTENT,
    }),
 /*    defineField({
      name: "icon",
      title: "Icon",
      description: "A visual icon representing this day's theme",
      type: "image",
      group: GROUP.MAIN_CONTENT,
      options: {
        hotspot: true,
      },
    }), */
 /*    defineField({
      name: "reward",
      title: "🎁 Reward/Unlock",
      description:
        "What users unlock or earn by completing this day (can be empty for early days)",
      type: "text",
      rows: 1,
      group: GROUP.MAIN_CONTENT,
    }), */
    defineField({
      name: "intro",
      title: "Introduction",
      description:
        "Welcome message for this day explaining the learning objectives",
      type: "richText",
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "techActivity",
      title: "💻 Tech Activity",
      type: "object",
      group: GROUP.MAIN_CONTENT,
      description:
        "The technical/coding task for users working on the development side",
      fields: [
        defineField({
          name: "title",
          type: "string",
          title: "Activity Title",
          description: "Name of this tech task",
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
          title: "Learning Objectives",
          description: "What users will learn from this activity",
          type: "array",
          of: [{ type: "string" }],
        }),
        defineField({
          name: "content",
          title: "Instructions",
          description: "Step-by-step instructions for completing the tech task",
          type: "richText",
        }),
        defineField({
          name: "codeExamples",
          title: "Code Examples",
          description:
            "Optional code snippets that help users understand the concepts",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({
                  name: "language",
                  type: "string",
                  title: "Language",
                  options: {
                    list: [
                      "bash",
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
                  title: "Code",
                  rows: 10,
                }),
                defineField({
                  name: "filename",
                  type: "string",
                  title: "Filename",
                  description: "Name of the file this code belongs to",
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
      title: "Hand ins",
      type: "richText",
    }),
        defineField({
          name: "resources",
          title: "Resources",
          description: "Helpful links and documentation",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({
                  name: "title",
                  type: "string",
                  title: "Link Title",
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
      title: "🎨 Design Activity",
      type: "object",
      group: GROUP.MAIN_CONTENT,
      description:
        "The design task for users working on the visual/UX side of the project",
      fields: [
        defineField({
          name: "title",
          type: "string",
          title: "Activity Title",
          description: "Name of this design task",
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
          title: "Learning Objectives",
          description: "What users will learn from this activity",
          type: "array",
          of: [{ type: "string" }],
        }),
        defineField({
          name: "content",
          title: "Instructions",
          description:
            "Step-by-step instructions for completing the design task",
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
      title: "Hand ins",
      type: "richText",
    }),
        defineField({
          name: "resources",
          title: "Resources",
          description: "Helpful links and documentation",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({
                  name: "title",
                  type: "string",
                  title: "Link Title",
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
  /*   defineField({
      name: "conclusion",
      title: "Conclusion",
      description:
        "A summary of what was learned and how it sets up the next day",
      type: "richText",
      group: GROUP.MAIN_CONTENT,
    }), */
    ...seoFields,
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
