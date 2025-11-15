import type { ComponentType } from "react";

import { UserRound } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";

import { TaskCompletionStatusInput } from "../../components/task-completion-status-input";

const taskCompletionStatusInput =
  TaskCompletionStatusInput as unknown as ComponentType<any>;

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
    defineField({
      name: "taskCompletionStatus",
      title: "Task completion status",
      description:
        "Keep track of each calendar task the user has completed. Toggle the switch once the day is done.",
      type: "array",
      readOnly: false,
      of: [
        defineArrayMember({
          name: "taskStatus",
          title: "Task status",
          type: "object",
          fields: [
            defineField({
              name: "calendarDay",
              title: "Calendar day",
              type: "reference",
              to: [{ type: "calendarDay" }],
              readOnly: true,
            }),
            defineField({
              name: "completed",
              title: "Completed",
              type: "boolean",
              initialValue: false,
            }),
          ],
        }),
      ],
      initialValue: async (_params, { getClient }) => {
        const client = getClient({ apiVersion: "2025-01-01" });
        const calendarDays =
          (await client.fetch<{ _id: string }[]>(
            '*[_type == "calendarDay"] | order(dayNumber asc){ _id }'
          )) ?? [];

        return calendarDays.map((day) => ({
          _type: "taskStatus",
          _key: day._id,
          calendarDay: {
            _type: "reference",
            _ref: day._id,
          },
          completed: false,
        }));
      },
      components: {
        input: taskCompletionStatusInput,
      },
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

