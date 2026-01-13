import { defineQuery } from "next-sanity";
import { imageFields, markDefsFragment } from "@/lib/sanity/query";
import { imageFragment } from "@/lib/sanity/query";
import { customLinkFragment } from "@/lib/sanity/query";

export const queryPersonBySlug = defineQuery(`
  *[_type == "person" && slug.current == $slug][0] {
    _id,
    firstName,
    lastName,
    shortBio,
    longBio[]{
      ...,
      _type == "block" => {
        ...,
        ${markDefsFragment}
      },
      _type == "image" => {
        ${imageFields},
        "caption": caption
      }
    },
    birthDate,
    image {
      ${imageFields}
    },
    "mother": mother-> {
      _id,
      firstName,
      lastName,
      image {
        ${imageFields}
      }
    },
    "father": father-> {
      _id,
      firstName,
      lastName,
      image {
        ${imageFields}
      }
    }
  }
`);


export const queryAllPersons = defineQuery(`
  *[_type == "person"] | order(firstName asc, lastName asc) {
    _id,
    "slug": slug.current,
    firstName,
    lastName,
    birthDate,
    image {
      ${imageFields}
    },
  }
`);