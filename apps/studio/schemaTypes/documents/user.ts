import { UserRound } from "lucide-react";
import { defineField, defineType } from "sanity";

export const user = defineType({
  name: "user",
  title: "User",
  type: "document",
  icon: UserRound,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) =>
        rule.required().error("Every user needs a display name."),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) =>
        rule.required().email().error("Provide a valid email address."),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "email",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Unnamed user",
        subtitle: subtitle || "No email provided",
      };
    },
  },
});

