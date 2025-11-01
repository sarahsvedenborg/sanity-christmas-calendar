import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";
import { CalendarIcon } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";

import { GROUP, GROUPS } from "../../utils/constant";
import { seoFields } from "../../utils/seo-fields";
import { documentSlugField } from "../common";

export const christmasCalendar = defineType({
  name: "christmasCalendar",
  title: "Christmas Calendar",
  type: "document",
  icon: CalendarIcon,
  groups: GROUPS,
  orderings: [orderRankOrdering],
  description:
    "The main Christmas calendar container that holds all 24 days of tasks. This is like the cover of your advent calendar!",
  fields: [
    orderRankField({ type: "christmasCalendar" }),
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description:
        "The name of your Christmas calendar (e.g., 'Learn Sanity 2024 Calendar')",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) =>
        Rule.required().error("A calendar title is required"),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description:
        "A brief overview of what this calendar teaches and what users will learn",
      group: GROUP.MAIN_CONTENT,
    }),
    documentSlugField("christmasCalendar", {
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      description:
        "The main image that represents your calendar (e.g., a festive calendar design)",
      type: "image",
      group: GROUP.MAIN_CONTENT,
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "startDate",
      title: "Start Date",
      type: "date",
      description: "When the calendar begins (typically December 1st)",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "introContent",
      title: "Introduction Content",
      description:
        "Welcome message and instructions for participants at the start of the calendar",
      type: "richText",
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "days",
      title: "Calendar Days",
      description: "The 24 days of tasks (should ideally be 24 days)",
      type: "array",
      group: GROUP.MAIN_CONTENT,
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "calendarDay" }],
          options: {
            disableNew: true,
          },
        }),
      ],
      validation: (Rule) => [
        Rule.min(1).error("At least one day is required"),
        Rule.max(24).warning("Calendar typically has 24 days"),
      ],
    }),
    ...seoFields,
  ],
  preview: {
    select: {
      title: "title",
      media: "coverImage",
      startDate: "startDate",
      dayCount: "days",
    },
    prepare: ({ title, media, startDate, dayCount }) => {
      const dateInfo = startDate
        ? `📅 Starts ${new Date(startDate).toLocaleDateString()}`
        : "📅 Date TBD";
      const daysInfo = dayCount
        ? `📆 ${dayCount.length} day${dayCount.length !== 1 ? "s" : ""}`
        : "📆 0 days";

      return {
        title: title || "Untitled Calendar",
        media,
        subtitle: `${dateInfo} | ${daysInfo}`,
      };
    },
  },
});
