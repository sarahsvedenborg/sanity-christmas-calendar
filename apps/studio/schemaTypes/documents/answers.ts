import { MessageCircle } from "lucide-react";
import { defineField, defineType } from "sanity";

export const answers = defineType({
  name: "answers",
  title: "Answers",
  type: "document",
  icon: MessageCircle,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().error("A title is required"),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "content",
      title: "Rich Text",
      type: "richText",
      validation: (rule) => rule.required().error("Content is required"),
    }),
  ],
  preview: {
    select: {
      title: "title",
      description: "description",
    },
    prepare({ title, description }) {
      return {
        title: title || "Untitled Answer",
        subtitle: description || "",
      };
    },
  },
});


