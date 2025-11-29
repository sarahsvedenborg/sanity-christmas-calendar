import { BookMarked } from "lucide-react";
import { defineField, defineType } from "sanity";

export const definition = defineType({
  name: "definition",
  title: "Definition",
  type: "document",
  icon: BookMarked,
  fields: [
    defineField({
      name: "title",
      title: "Begrep",
      type: "string",
      validation: (rule) => rule.required().error("En tittel er nødvendig"),
    }),
    defineField({
      name: "shortDescription",
      title: "Kort beskrivelse",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "description",
      title: "Definisjon",
      type: "text",
      rows: 6,
    }),
  /*   defineField({
      name: "content",
      title: "Definition Content",
      description: "Detaljert forklaring på begrepet.",
      type: "richText",
      validation: (rule) =>
        rule.required().error("Definisjonen må inneholde innhold."),
    }), */
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Uten tittel",
        subtitle: subtitle || "Ingen beskrivelse",
      };
    },
  },
});


