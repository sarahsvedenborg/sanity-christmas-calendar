import Link from "next/link";

import { SanityImage } from "@/components/elements/sanity-image";
import { RichText } from "@/components/elements/rich-text";
import { sanityFetch } from "@/lib/sanity/live";
import { queryAllPersons } from "@/lib/sanity/query";
import { handleErrors } from "@/utils";

async function fetchPersons() {
  return await handleErrors(sanityFetch({ query: queryAllPersons }));
}

type Person = {_id: string, slug: string, firstName: string, lastName: string, shortBio: string, longBio: any, image: any, mother: any, father: any, birthDate: string};

export default async function SanityDemonstrationPage() {
  const [res, err] = await fetchPersons();
  
  if (err || !res?.data) {
    return (
      <main className="container mx-auto my-16 px-4 md:px-6">
        <h1 className="mb-8 text-4xl font-bold">Sanity Demonstration</h1>
        <div className="py-12 text-center">
          <p className="text-muted-foreground">
            Error loading persons. Please try again later.
          </p>
        </div>
      </main>
    );
  }

  const persons = res.data || [];

  if (!persons.length) {
    return (
      <main className="container mx-auto my-16 px-4 md:px-6">
        <h1 className="mb-8 text-4xl font-bold">Sanity Demonstration</h1>
        <div className="py-12 text-center">
          <p className="text-muted-foreground">
            No persons available at the moment.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto my-16 px-4 md:px-6">
      <h1 className="mb-8 text-4xl font-bold">Sanity Demonstration</h1>
      <p className="mb-12 text-lg text-muted-foreground">
        List of all persons in the system
      </p>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {persons.map((person: Person) => (
          <Link
            key={person._id}
            href={`/persons/${person.slug}`}
            className="rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            {person.image?.id && (
              <div className="mb-4 aspect-square overflow-hidden rounded-lg">
                <SanityImage
                  alt={`${person.firstName || ""} ${person.lastName || ""}`.trim() || "Person image"}
                  className="h-full w-full object-cover"
                  height={400}
                  image={person.image}
                  width={400}
                />
              </div>
            )}

            <h2 className="mb-2 text-2xl font-semibold">
              {person.firstName && person.lastName
                ? `${person.firstName} ${person.lastName}`
                : person.firstName || person.lastName || "Unnamed person"}
            </h2>

            {person.birthDate && (
              <p className="mb-3 text-sm text-muted-foreground">
                Born: {new Date(person.birthDate).toLocaleDateString()}
              </p>
            )}

            {person.shortBio && (
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                {person.shortBio}
              </p>
            )}

            {person.longBio && person.longBio.length > 0 && (
              <div className="mb-4">
                <RichText richText={person.longBio} />
              </div>
            )}

            {(person.mother || person.father) && (
              <div className="mt-4 border-t pt-4">
                <p className="text-sm font-medium text-muted-foreground">Family:</p>
                <ul className="mt-2 space-y-1 text-sm">
                  {person.mother && (
                    <li>
                      Mother: {person.mother.firstName} {person.mother.lastName}
                    </li>
                  )}
                  {person.father && (
                    <li>
                      Father: {person.father.firstName} {person.father.lastName}
                    </li>
                  )}
                </ul>
              </div>
            )}
          </Link>
        ))}
      </div>
    </main>
  );
}

