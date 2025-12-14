import { defineQuery } from "next-sanity";

const imageFields = /* groq */ `
  "id": asset._ref,
  "preview": asset->metadata.lqip,
  hotspot {
    x,
    y
  },
  crop {
    bottom,
    left,
    right,
    top
  }
`;
// Base fragments for reusable query parts
const imageFragment = /* groq */ `
  image {
    ${imageFields}
  }
`;

const customLinkFragment = /* groq */ `
  ...customLink{
    openInNewTab,
    "href": select(
      type == "internal" => internal->slug.current,
      type == "external" => external,
      "#"
    ),
  }
`;

const markDefsFragment = /* groq */ `
  markDefs[]{
    ...,
    ${customLinkFragment},
    _type == "term" => {
      definition->{
        _id,
        title,
        description
      }
    }
  }
`;

export const queryAnswersData = defineQuery(`
  *[_type == "answers"][0] {
    _id,
    title,
    description,
    content[]{
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
    _updatedAt
  }
`);

export const queryDefinitionsData = defineQuery(`
  *[_type == "definition"] | order(lower(title) asc) {
    _id,
    title,
    shortDescription,
    description,
    content[]{
      ...,
      _type == "block" => {
        ...,
        ${markDefsFragment}
      },
      _type == "image" => {
        ${imageFields},
        "caption": caption
      }
    }
  }
`);

export const queryWinnerAnimationData = defineQuery(`
  *[_type == "winnerAnimation" && isActive == true] | order(time desc) [0] {
    _id,
    title,
    winnerName,
    time,
    id,
    isActive,
  }
`);

export const queryInactivePassedAnimations = defineQuery(`
  *[_type == "winnerAnimation" && isActive == false && time < now()] | order(time desc) {
    _id,
    time,
  }
`);

const richTextFragment = /* groq */ `
  richText[]{
    ...,
    _type == "block" => {
      ...,
      ${markDefsFragment}
    },
    _type == "image" => {
      ${imageFields},
      "caption": caption
    }
  }
`;

const blogAuthorFragment = /* groq */ `
  authors[0]->{
    _id,
    name,
    position,
    ${imageFragment}
  }
`;

const blogCardFragment = /* groq */ `
  _type,
  _id,
  title,
  description,
  "slug":slug.current,
  orderRank,
  ${imageFragment},
  publishedAt,
  ${blogAuthorFragment}
`;

const buttonsFragment = /* groq */ `
  buttons[]{
    text,
    variant,
    _key,
    _type,
    "openInNewTab": url.openInNewTab,
    "href": select(
      url.type == "internal" => url.internal->slug.current,
      url.type == "external" => url.external,
      url.href
    ),
  }
`;

// Page builder block fragments
const ctaBlock = /* groq */ `
  _type == "cta" => {
    ...,
    ${richTextFragment},
    ${buttonsFragment},
  }
`;
const imageLinkCardsBlock = /* groq */ `
  _type == "imageLinkCards" => {
    ...,
    ${richTextFragment},
    ${buttonsFragment},
    "cards": array::compact(cards[]{
      ...,
      "openInNewTab": url.openInNewTab,
      "href": select(
        url.type == "internal" => url.internal->slug.current,
        url.type == "external" => url.external,
        url.href
      ),
      ${imageFragment},
    })
  }
`;

const heroBlock = /* groq */ `
  _type == "hero" => {
    ...,
    ${imageFragment},
    ${buttonsFragment},
    ${richTextFragment}
  }
`;

const faqFragment = /* groq */ `
  "faqs": array::compact(faqs[]->{
    title,
    _id,
    _type,
    ${richTextFragment}
  })
`;

const faqAccordionBlock = /* groq */ `
  _type == "faqAccordion" => {
    ...,
    ${faqFragment},
    link{
      ...,
      "openInNewTab": url.openInNewTab,
      "href": select(
        url.type == "internal" => url.internal->slug.current,
        url.type == "external" => url.external,
        url.href
      )
    }
  }
`;

const subscribeNewsletterBlock = /* groq */ `
  _type == "subscribeNewsletter" => {
    ...,
    "subTitle": subTitle[]{
      ...,
      ${markDefsFragment}
    },
    "helperText": helperText[]{
      ...,
      ${markDefsFragment}
    }
  }
`;

const featureCardsIconBlock = /* groq */ `
  _type == "featureCardsIcon" => {
    ...,
    ${richTextFragment},
    "cards": array::compact(cards[]{
      ...,
      ${richTextFragment},
    })
  }
`;

const pageBuilderFragment = /* groq */ `
  pageBuilder[]{
    ...,
    _type,
    ${ctaBlock},
    ${heroBlock},
    ${faqAccordionBlock},
    ${featureCardsIconBlock},
    ${subscribeNewsletterBlock},
    ${imageLinkCardsBlock}
  }
`;

/**
 * Query to extract a single image from a page document
 * This is used as a type reference only and not for actual data fetching
 * Helps with TypeScript inference for image objects
 */
export const queryImageType = defineQuery(`
  *[_type == "page" && defined(image)][0]{
    ${imageFragment}
  }.image
`);

export const queryHomePageData =
  defineQuery(`*[_type == "homePage" && _id == "homePage"][0]{
    ...,
    _id,
    _type,
    "slug": slug.current,
    title,
    description,
    ${pageBuilderFragment}
  }`);

export const querySlugPageData = defineQuery(`
  *[_type == "page" && slug.current == $slug][0]{
    ...,
    "slug": slug.current,
    ${pageBuilderFragment}
  }
  `);

export const querySlugPagePaths = defineQuery(`
  *[_type == "page" && defined(slug.current)].slug.current
`);

export const queryBlogIndexPageData = defineQuery(`
  *[_type == "blogIndex"][0]{
    ...,
    _id,
    _type,
    title,
    description,
    "displayFeaturedBlogs" : displayFeaturedBlogs == "yes",
    "featuredBlogsCount" : featuredBlogsCount,
    ${pageBuilderFragment},
    "slug": slug.current,
    "blogs": *[_type == "blog" && (seoHideFromLists != true)] | order(orderRank asc){
      ${blogCardFragment}
    }
  }
`);

export const queryBlogSlugPageData = defineQuery(`
  *[_type == "blog" && slug.current == $slug][0]{
    ...,
    "slug": slug.current,
    ${blogAuthorFragment},
    ${imageFragment},
    ${richTextFragment},
    ${pageBuilderFragment}
  }
`);

export const queryBlogPaths = defineQuery(`
  *[_type == "blog" && defined(slug.current)].slug.current
`);

export const queryDemoBlogSlugPageData = defineQuery(`
  *[_type == "demo_blog" && slug.current == $slug][0]{
    ...,
    "slug": slug.current,
    ${imageFragment},
    ${richTextFragment},
    ${pageBuilderFragment}
  }
`);

export const queryDemoBlogPaths = defineQuery(`
  *[_type == "demo_blog" && defined(slug.current)].slug.current
`);

export const queryDemoBlogIndex = defineQuery(`
  *[_type == "demo_blog" && defined(slug.current)] | order(_createdAt desc) {
    _id,
    _createdAt,
    title,
    description,
    "slug": slug.current,
    ${imageFragment}
  }
`);

export const queryDemoDocumentationData = defineQuery(`
  *[_type == "demo_documentation"][0] {
    _id,
    title,
    description,
    content[]{
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
    _updatedAt
  }
`);

const ogFieldsFragment = /* groq */ `
  _id,
  _type,
  "title": select(
    defined(ogTitle) => ogTitle,
    defined(seoTitle) => seoTitle,
    title
  ),
  "description": select(
    defined(ogDescription) => ogDescription,
    defined(seoDescription) => seoDescription,
    description
  ),
  "image": image.asset->url + "?w=566&h=566&dpr=2&fit=max",
  "dominantColor": image.asset->metadata.palette.dominant.background,
  "seoImage": seoImage.asset->url + "?w=1200&h=630&dpr=2&fit=max", 
  "logo": *[_type == "settings"][0].logo.asset->url + "?w=80&h=40&dpr=3&fit=max&q=100",
  "date": coalesce(date, _createdAt)
`;

export const queryHomePageOGData = defineQuery(`
  *[_type == "homePage" && _id == $id][0]{
    ${ogFieldsFragment}
  }
  `);

export const querySlugPageOGData = defineQuery(`
  *[_type == "page" && _id == $id][0]{
    ${ogFieldsFragment}
  }
`);

export const queryBlogPageOGData = defineQuery(`
  *[_type == "blog" && _id == $id][0]{
    ${ogFieldsFragment}
  }
`);

export const queryGenericPageOGData = defineQuery(`
  *[ defined(slug.current) && _id == $id][0]{
    ${ogFieldsFragment}
  }
`);

export const queryFooterData = defineQuery(`
  *[_type == "footer" && _id == "footer"][0]{
    _id,
    subtitle,
    columns[]{
      _key,
      title,
      links[]{
        _key,
        name,
        "openInNewTab": url.openInNewTab,
        "href": select(
          url.type == "internal" => url.internal->slug.current,
          url.type == "external" => url.external,
          url.href
        ),
      }
    }
  }
`);

export const queryNavbarData = defineQuery(`
  *[_type == "navbar" && _id == "navbar"][0]{
    _id,
    columns[]{
      _key,
      _type == "navbarColumn" => {
        "type": "column",
        title,
        links[]{
          _key,
          name,
          icon,
          description,
          "openInNewTab": url.openInNewTab,
          "href": select(
            url.type == "internal" => url.internal->slug.current,
            url.type == "external" => url.external,
            url.href
          )
        }
      },
      _type == "navbarLink" => {
        "type": "link",
        name,
        description,
        "openInNewTab": url.openInNewTab,
        "href": select(
          url.type == "internal" => url.internal->slug.current,
          url.type == "external" => url.external,
          url.href
        )
      }
    },
    ${buttonsFragment},
  }
`);

export const querySitemapData = defineQuery(`{
  "slugPages": *[_type == "page" && defined(slug.current)]{
    "slug": slug.current,
    "lastModified": _updatedAt
  },
  "blogPages": *[_type == "blog" && defined(slug.current)]{
    "slug": slug.current,
    "lastModified": _updatedAt
  }
}`);
export const queryGlobalSeoSettings = defineQuery(`
  *[_type == "settings"][0]{
    _id,
    _type,
    siteTitle,
    logo {
      ${imageFields}
    },
    siteDescription,
    socialLinks{
      linkedin,
      facebook,
      twitter,
      instagram,
      youtube
    }
  }
`);

export const querySettingsData = defineQuery(`
  *[_type == "settings"][0]{
    _id,
    _type,
    siteTitle,
    siteDescription,
    "logo": logo.asset->url + "?w=80&h=40&dpr=3&fit=max",
    "socialLinks": socialLinks,
    "contactEmail": contactEmail,
    showRegistrationButton,
    registrationUrl,
  }
`);

export const queryRedirects = defineQuery(`
  *[_type == "redirect" && status == "active" && defined(source.current) && defined(destination.current)]{
    "source":source.current, 
    "destination":destination.current, 
    "permanent" : permanent == "true"
  }
`);

// Christmas Calendar queries
const calendarDayFragment = /* groq */ `
  dayNumber,
  title,
  description,
  "slug": slug.current,
  isBreak,
  breakContent[]{
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
  "category": category-> {
    _id,
    title,
    identifier,
    description
  },
  icon {
    ${imageFields}
  },
  reward,
  intro[]{
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
  techActivity {
    title,
    handInUrl,
    duration,
    difficulty,
    objectives,
    content[]{
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
    codeExamples,
    resources,
    hint,
    solution[]{
      ...,
      _type == "block" => {
        ...,
        ${markDefsFragment}
      },
    },
     handIn[]{
    ...,
    _type == "block" => {
      ...,
      ${markDefsFragment}
    },
  },
  },
  designActivity {
    title,
    duration,
    handInUrl,
    difficulty,
    objectives,
    content[]{
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
    designExamples[]{
      ...,
      ${imageFields},
      caption
    },
    resources,
    hint,
    handIn[]{
      ...,
      _type == "block" => {
        ...,
        ${markDefsFragment}
      },
    },
  },
  sharedNotes[]{
    ...,
    _type == "block" => {
      ...,
      ${markDefsFragment}
    },
  },
  conclusion[]{
    ...,
    _type == "block" => {
      ...,
      ${markDefsFragment}
    },
  }
`;

export const queryChristmasCalendarData = defineQuery(`
  *[_type == "christmasCalendar"] | order(orderRank asc)[0]{
    ...,
    title,
    description,
    "slug": slug.current,
    coverImage {
      ${imageFields}
    },
    startDate,
    introContent[]{
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
    "days": days[]-> {
      ${calendarDayFragment}
    }
  }
`);

export const queryChristmasCalendarPaths = defineQuery(`
  *[_type == "christmasCalendar" && defined(slug.current)].slug.current
`);

/* export const queryCalendarDayPaths = defineQuery(`
  *[_type == "calendarDay" && defined(slug.current)].slug.current
`); */

export const queryCalendarDayData = defineQuery(`
  *[_type == "calendarDay" && slug.current == $slug][0]{
    ...,
    ${calendarDayFragment},
    "startDate": *[_type == "christmasCalendar"][0].startDate,
    "previousDay": *[_type == "calendarDay" && dayNumber < ^.dayNumber] | order(dayNumber desc)[0] {
      dayNumber,
      title,
      "slug": slug.current
    },
    "nextDay": *[_type == "calendarDay" && dayNumber > ^.dayNumber] | order(dayNumber asc)[0] {
      dayNumber,
      title,
      "slug": slug.current
    }
  }
`);

export const queryCalendarDayPaths = defineQuery(`
  *[_type == "calendarDay" && defined(slug.current)].slug.current
`);

export const queryUserProgressByEmail = defineQuery(`
  *[_type == "user" && email == $email][0]{
    name,
    email,
    taskCompletionStatus[]{
      completed,
      calendarDay->{
        _id,
        dayNumber,
        title,
        isBreak,
        "slug": slug.current,
        "category": category->{
          _id,
          title
        }
      }
    }
  }
`);

export const queryScoreboardData = defineQuery(`
  *[_type == "user" && acceptScoreboard == true]{
    _id,
    name,
    email,
    participantType,
    taskCompletionStatus[]{
      completed,
      calendarDay->{
        _id,
        dayNumber,
        title,
        isBreak
      }
    }
  }
`);

export const queryPublicWorkUrls = defineQuery(`
  *[_type == "user" && acceptSharingWorkPublicly == true && defined(publicworkurl)]{
    _id,
    name,
    email,
    publicworkurl
  }
`);

export const queryDemoCalendarDayPaths = defineQuery(`
  *[_type == "demo_calendarDay" && defined(slug.current)].slug.current
`);

export const queryDemoCalendarDayData = defineQuery(`
  *[_type == "demo_calendarDay" && slug.current == $slug][0]{
    ...,
    ${calendarDayFragment},
    "startDate": *[_type == "christmasCalendar"][0].startDate,
    "previousDay": *[_type == "calendarDay" && dayNumber < ^.dayNumber] | order(dayNumber desc)[0] {
      dayNumber,
      title,
      "slug": slug.current
    },
    "nextDay": *[_type == "calendarDay" && dayNumber > ^.dayNumber] | order(dayNumber asc)[0] {
      dayNumber,
      title,
      "slug": slug.current
    }
  }
`);

export const queryDemoChristmasCalendarData = defineQuery(`
*[_type == "demo_calendarDay"]{
      ${calendarDayFragment}  
}
`);

export const queryDayCategoriesWithWinners = defineQuery(`
  *[_type == "dayCategory"] {
    _id,
    title,
    identifier,
    winners
  }
`);
