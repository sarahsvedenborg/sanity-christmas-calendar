import {  UserRound } from "lucide-react";
import { defineField, defineType, SlugSourceContext } from "sanity";

export const person = defineType({
  name: "person",
  title: "Person",
  type: "document",
  icon: UserRound,
  fields: [
    defineField({
      name: "firstName",
      title: "First Name",
      type: "string",
      validation: (rule) => rule.required().error("A title is required"),
    }),
    defineField({
      name: "lastName",
      title: "Last Name",
      type: "string",
      validation: (rule) => rule.required().error("A last name is required"),
    }),
      defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: 'firstName',
        slugify: (input, schemaType, context: SlugSourceContext) => {return context.parent?.firstName?.toLowerCase() + "-" + context.parent?.lastName?.toLowerCase()},
      },
      validation: (rule) => rule.required().error("A slug is required"),
    }),
    defineField({
      name: "shortBio",
      title: "Short Bio",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "longBio",
      title: "Long Bio",
      type: "richText",
    }),
     defineField({
      name: "birthDate",
      title: "Birth Date",
      type: "date",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
    }),
      defineField({
      name: "mother",
      title: "Mother",
      type: "reference",
      to: [{ type: "person" }],
    }),
    defineField({
      name: "father",
      title: "Father",
      type: "reference",
      to: [{ type: "person" }],
    })
  ],
  preview: {
    select: {
      first: "firstName",
      last: "lastName",
      birthdate: "birthDate",
      image: "image",
    },
    prepare({ first, last, birthdate, image }) {
      return {
        title: (first && last) ? first + " " + last : "Unnamed person",
        subtitle: birthdate ? "Born " + new Date(birthdate).toLocaleDateString() : "",
        media: image, 
      };
    },
  },
});


