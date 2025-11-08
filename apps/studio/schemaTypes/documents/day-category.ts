import { TagIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

import { GROUP, GROUPS } from "../../utils/constant";

export const dayCategory = defineType({
  name: "dayCategory",
  title: "Day Category",
  type: "document",
  icon: TagIcon,
  groups: GROUPS,
  description:
    "Categories for organizing calendar days (e.g., 'Setup', 'Content', 'Advanced Features')",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "The name of this category (e.g., 'Setup', 'Content Management')",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required().error("A category title is required"),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "A brief description of what this category represents",
      group: GROUP.MAIN_CONTENT,
    }),
  ],
  preview: {
    select: {
      title: "title",
      description: "description",
    },
    prepare: ({ title, description }) => ({
      title: title || "Untitled Category",
      subtitle: description || "No description",
    }),
  },
});

