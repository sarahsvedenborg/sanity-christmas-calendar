import type { ComponentType } from "react";

import { UserRound, CircleX, Laptop, Palette } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";

import { TaskCompletionStatusInput } from "../../components/task-completion-status-input";
import { createRadioListLayout } from "../../utils/helper";

const taskCompletionStatusInput =
  TaskCompletionStatusInput as unknown as ComponentType<any>;

export const user = defineType({
  name: "user",
  title: "User",
  type: "document",
  icon: UserRound,
  groups: [
    {
      name: "content",
      title: "Content",
      default: true,
    },
    {
      name: "admin",
      title: "Admin",
    },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      group: "content",
      validation: (rule) =>
        rule.required().error("Every user needs a display name."),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
         group: "content",
      validation: (rule) =>
        rule.required().email().error("Provide a valid email address."),
    }),
       defineField({
      name: "receivedStickers",
      title: "Motatt klistermærker",
      type: "boolean",
         group: "admin",
      initialValue: false,
    }),
       defineField({
      name: "participantType",
      title: "participantType",
      type: "string",
         group: "content",
      options: createRadioListLayout(["tech", "design"]),
    /*   readOnly: true, */
    }),
      defineField({
      name: "acceptScoreboard",
      title: "Partake in scoreboard",
      type: "boolean",
         group: "content",
    /*   readOnly: true, */
      initialValue: false,
    }),
    defineField({
      name: "acceptSharingWorkPublicly",
      title: "Accept sharing work publicly",
      type: "boolean",
         group: "content",
    /*   readOnly: true, */
      initialValue: false,
    }),
    defineField({
      name: "publicworkurl",
      title: "Public work URL",
      type: "url",
         group: "content",
    }),
    defineField({
      name: "taskCompletionStatus",
      title: "Task completion status",
      description:
        "Keep track of each calendar task the user has completed. Toggle the switch once the day is done.",
      type: "array",
         group: "content",
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
      category: 'participantType',
    },
    prepare({ title, subtitle, category }) {
      const icon: {[key: string]: React.ReactNode} = {
        design: <Palette />,
        tech: <Laptop />,
      }
      return {
        title: `${title || "Unnamed user"} - ${category || ""}`,
        subtitle: subtitle || "No email provided",
        media: !category ? <CircleX style={{ color: "#B91C1C" }} /> : icon[category]
      };
    },
  },
});

