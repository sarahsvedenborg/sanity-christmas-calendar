import { Trophy } from "lucide-react";
import { defineField, defineType } from "sanity";

export const winnerAnimation = defineType({
  name: "winnerAnimation",
  type: "document",
  title: "Winner Animation",
  description: "Winner animation data for the drawing",
  icon: Trophy,
  fields: [
     defineField({
      name: "isActive",
      type: "boolean",
      title: "Er aktiv",
      initialValue: false,
      validation: (rule) => rule.required(),
    }),
     defineField({
      name: "title",
      type: "string",
      title: "Tittel (as slug)",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "id",
      type: "string",
      title: "id (as slug)",
      validation: (rule) => rule.required(),
    }),
      defineField({
      name: "category",
      type: "reference",
      to: [{ type: "dayCategory" }],
      title: "Gjelder kategori",
    }),
    defineField({
      name: "winnerName",
      type: "string",
      title: "Winner Name",
      description: "Name of the winner",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "time",
      type: "datetime",
      title: "Time",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "winnerName",
      time: "time",
    },
    prepare: ({ title, time }) => ({
      title: title || "Untitled Winner",
      subtitle: time ? new Date(time).toLocaleString() : "No time set",
      media: Trophy,
    }),
  },
});

