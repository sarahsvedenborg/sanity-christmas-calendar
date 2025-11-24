import { FileTextIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

export const demoDocumentation = defineType({
  name: "demo_documentation",
  title: "Demo Documentation",
  type: "document",
  icon: FileTextIcon,
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
    }),
  ],
  preview: {
    select: {
      title: "title",
      description: "description",
    },
    prepare({ title, description }) {
      return {
        title: title || "Untitled Documentation",
        subtitle: description || "",
      };
    },
  },
});

