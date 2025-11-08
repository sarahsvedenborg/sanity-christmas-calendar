"use client";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import {
  PortableText,
  type PortableTextBlock,
  type PortableTextReactComponents,
} from "next-sanity";

import { parseChildrenToSlug } from "@/utils";

import { SanityImage } from "./sanity-image";

type RichTextTone = "default" | "light";

function createComponents({
  paragraphClassName,
  listClassName,
}: {
  paragraphClassName: string;
  listClassName: string;
}): Partial<PortableTextReactComponents> {
  return {
    block: {
      normal: ({ children }) => (
        <p
          className={cn(
            "mb-5 text-base leading-[1.6] md:text-lg md:leading-[1.65]",
            paragraphClassName
          )}
        >
          {children}
        </p>
      ),
      h2: ({ children, value }) => {
        const slug = parseChildrenToSlug(value.children);
        return (
          <h2
            className="scroll-m-20 border-b pb-2 font-semibold text-3xl first:mt-0"
            id={slug}
          >
            {children}
          </h2>
        );
      },
      h3: ({ children, value }) => {
        const slug = parseChildrenToSlug(value.children);
        return (
          <h3 className="scroll-m-20 font-semibold text-2xl" id={slug}>
            {children}
          </h3>
        );
      },
      h4: ({ children, value }) => {
        const slug = parseChildrenToSlug(value.children);
        return (
          <h4 className="scroll-m-20 font-semibold text-xl" id={slug}>
            {children}
          </h4>
        );
      },
      h5: ({ children, value }) => {
        const slug = parseChildrenToSlug(value.children);
        return (
          <h5 className="scroll-m-20 font-semibold text-lg" id={slug}>
            {children}
          </h5>
        );
      },
      h6: ({ children, value }) => {
        const slug = parseChildrenToSlug(value.children);
        return (
          <h6 className="scroll-m-20 font-semibold text-base" id={slug}>
            {children}
          </h6>
        );
      },
    },
    list: {
      bullet: ({ children }) => (
        <ul
          className={cn(
            "mb-5 ml-6 list-disc space-y-2 text-base leading-[1.6] md:text-lg md:leading-[1.65]",
            listClassName
          )}
        >
          {children}
        </ul>
      ),
      number: ({ children }) => (
        <ol
          className={cn(
            "mb-5 ml-6 list-decimal space-y-2 text-base leading-[1.6] md:text-lg md:leading-[1.65]",
            listClassName
          )}
        >
          {children}
        </ol>
      ),
    },
    listItem: {
      bullet: ({ children }) => <li>{children}</li>,
      number: ({ children }) => <li>{children}</li>,
    },
    marks: {
      strong: ({ children }) => <strong className="font-bold">{children}</strong>,
      em: ({ children }) => <em className="italic">{children}</em>,
      code: ({ children }) => (
        <code className="rounded-md border border-white/10 bg-opacity-5 p-1 text-sm lg:whitespace-nowrap">
          {children}
        </code>
      ),
      customLink: ({ children, value }) => {
        if (!value.href || value.href === "#") {
          return (
            <span className="underline decoration-dotted underline-offset-2">
              Link Broken
            </span>
          );
        }
        return (
          <Link
            aria-label={`Link to ${value?.href}`}
            className="underline decoration-dotted underline-offset-2"
            href={value.href}
            prefetch={false}
            target={value.openInNewTab ? "_blank" : "_self"}
          >
            {children}
          </Link>
        );
      },
    },
    types: {
      image: ({ value }) => {
        if (!value?.id) {
          return null;
        }
        return (
          <figure className="my-4">
            <SanityImage
              className="h-auto w-full rounded-lg"
              height={900}
              image={value}
              width={1600}
            />
            {value?.caption && (
              <figcaption className="mt-2 text-center text-sm text-zinc-500 dark:text-zinc-400">
                {value.caption}
              </figcaption>
            )}
          </figure>
        );
      },
    },
    hardBreak: () => <br />,
  };
}

export function RichText<T>({
  richText,
  className,
  tone = "default",
}: {
  richText?: T | null;
  className?: string;
  tone?: RichTextTone;
}) {
  if (!richText) {
    return null;
  }

  const paragraphClassName =
    tone === "light"
      ? "text-white dark:text-zinc-100"
      : "text-green-950 dark:text-zinc-100";

  const listClassName =
    tone === "light"
      ? "text-white dark:text-zinc-100"
      : "text-green-950 dark:text-zinc-100";

  const components = createComponents({
    paragraphClassName,
    listClassName,
  });

  return (
    <div
      className={cn(
        "prose prose-zinc dark:prose-invert max-w-none prose-headings:scroll-m-24 prose-h2:border-b prose-h2:pb-2 prose-h2:font-semibold prose-h2:text-3xl prose-headings:text-opacity-90 prose-ol:text-opacity-80 prose-p:text-opacity-80 prose-ul:text-opacity-80 prose-a:decoration-dotted prose-h2:first:mt-0",
        className
      )}
    >
      <PortableText
        components={components}
        onMissingComponent={(_, { nodeType, type }) => {
          console.warn(`Missing component: ${nodeType} for type: ${type}`);
        }}
        value={richText as unknown as PortableTextBlock[]}
      />
    </div>
  );
}
