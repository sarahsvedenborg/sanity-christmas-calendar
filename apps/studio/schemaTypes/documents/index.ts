import { author } from "./author";
import { blog } from "./blog";
import { blogIndex } from "./blog-index";
import { calendarDay } from "./calendar-day";
import { answers } from "./answers";
import { definition } from "./definition";
import { christmasCalendar } from "./christmas-calendar";
import { dayCategory } from "./day-category";
import { faq } from "./faq";
import { footer } from "./footer";
import { homePage } from "./home-page";
import { navbar } from "./navbar";
import { page } from "./page";
import { redirect } from "./redirect";
import { settings } from "./settings";
import { user } from "./user";

export const singletons = [homePage, blogIndex, settings, footer, navbar];

export const documents = [
  blog,
  page,
  faq,
  author,
  christmasCalendar,
  calendarDay,
  dayCategory,
  definition,
  answers,
  user,
  ...singletons,
  redirect,
];
