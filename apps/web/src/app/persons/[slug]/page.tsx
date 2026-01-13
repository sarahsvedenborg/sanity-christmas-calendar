import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User } from "lucide-react";

import { SanityImage } from "@/components/elements/sanity-image";
import { RichText } from "@/components/elements/rich-text";
import { sanityFetch } from "@/lib/sanity/live";
import { queryPersonBySlug } from "../queries";
import { handleErrors } from "@/utils";

async function fetchPersonBySlug(slug: string) {
  return await handleErrors(
    sanityFetch({
      query: queryPersonBySlug,
      params: { slug },
    })
  );
}

export default async function PersonDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [res, err] = await fetchPersonBySlug(slug);

  if (err || !res?.data) {
    return notFound();
  }

  const person = res.data;

  const fullName =
    person.firstName && person.lastName
      ? `${person.firstName} ${person.lastName}`
      : person.firstName || person.lastName || "Unnamed person";

  return (
    <main className="container mx-auto my-16 px-4 md:px-6">
      <Link
        href="/persons"
        className="mb-8 inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to all persons
      </Link>

      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-start">
          {person.image?.id ? (
            <div className="h-48 w-48 flex-shrink-0 overflow-hidden rounded-lg md:h-64 md:w-64">
              <SanityImage
                alt={fullName}
                className="h-full w-full object-cover"
                height={256}
                image={person.image}
                width={256}
              />
            </div>
          ) : (
            <div className="flex h-48 w-48 flex-shrink-0 items-center justify-center rounded-lg bg-muted md:h-64 md:w-64">
              <User className="h-24 w-24 text-muted-foreground md:h-32 md:w-32" />
            </div>
          )}

          <header className="flex-1">
            <h1 className="mb-4 text-4xl font-bold">{fullName}</h1>
            {person.birthDate && (
              <p className="text-lg text-muted-foreground">
                Born: {new Date(person.birthDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
          </header>
        </div>

        {person.shortBio && (
          <div className="mb-8">
            <p className="text-lg leading-relaxed text-muted-foreground">
              {person.shortBio}
            </p>
          </div>
        )}

        {person.longBio && person.longBio.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold">Biography</h2>
            <RichText richText={person.longBio} />
          </div>
        )}

        {(person.mother || person.father) && (
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 text-2xl font-semibold">Family</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {person.mother && (
                <div>
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                    Mother
                  </h3>
                  <Link
                    href={`/persons/${person.mother.slug}`}
                    className="group flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    {person.mother.image?.id && (
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full">
                        <SanityImage
                          alt={`${person.mother.firstName || ""} ${person.mother.lastName || ""}`.trim() || "Mother"}
                          className="h-full w-full object-cover"
                          height={64}
                          image={person.mother.image}
                          width={64}
                        />
                      </div>
                    )}
                    <div>
                      <p className="font-medium group-hover:underline">
                        {person.mother.firstName} {person.mother.lastName}
                      </p>
                    </div>
                  </Link>
                </div>
              )}

              {person.father && (
                <div>
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                    Father
                  </h3>
                  <Link
                    href={`/persons/${person.father.slug}`}
                    className="group flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    {person.father.image?.id && (
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full">
                        <SanityImage
                          alt={`${person.father.firstName || ""} ${person.father.lastName || ""}`.trim() || "Father"}
                          className="h-full w-full object-cover"
                          height={64}
                          image={person.father.image}
                          width={64}
                        />
                      </div>
                    )}
                    <div>
                      <p className="font-medium group-hover:underline">
                        {person.father.firstName} {person.father.lastName}
                      </p>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

