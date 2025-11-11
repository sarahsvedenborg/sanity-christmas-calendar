import { TagIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

import { GROUP, GROUPS } from "../../utils/constant";

export const dayCategory = defineType({
  name: "dayCategory",
  title: "Kalenderkategori",
  type: "document",
  icon: TagIcon,
  groups: GROUPS,
  description:
    "Kategorier for å organisere kalenderluker (f.eks, 'Basic', 'Middels', 'Avansert')",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Tittel",
      description: "Navnet på kategorien",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required().error("A category title is required"),
    }),
     defineField({
      name: "identifier",
      type: "string",
      title: "Identifier",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required().error("A category identifier is required"),
    }),
    defineField({
      name: "description",
      title: "Beskrivelse",
      type: "text",
      rows: 3,
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

