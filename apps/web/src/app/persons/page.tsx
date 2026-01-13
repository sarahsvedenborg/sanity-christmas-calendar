import Link from "next/link";
import { User } from "lucide-react";

import { SanityImage } from "@/components/elements/sanity-image";
import { sanityFetch } from "@/lib/sanity/live";
import { queryAllPersons } from "./queries";
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

      <div className="space-y-4">
        {persons.map((person: Person) => {
          const fullName =
            person.firstName && person.lastName
              ? `${person.firstName} ${person.lastName}`
              : person.firstName || person.lastName || "Unnamed person";

          return (
            <Link
              key={person._id}
              href={`/persons/${person.slug}`}
              className="flex gap-4 rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              {person.image?.id ? (
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                  <SanityImage
                    alt={fullName}
                    className="h-full w-full object-cover"
                    height={80}
                    image={person.image}
                    width={80}
                  />
                </div>
              ) : (
                <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-lg bg-muted">
                  <User className="h-10 w-10 text-muted-foreground" />
                </div>
              )}

              <div className="flex flex-col justify-center">
                <h2 className="text-xl font-semibold">{fullName}</h2>
                {person.birthDate && (
                  <p className="text-sm text-muted-foreground">
                    Born: {new Date(person.birthDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}

