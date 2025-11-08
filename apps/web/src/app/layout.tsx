import "@workspace/ui/globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono, Inika } from "next/font/google";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity";
import { Suspense } from "react";
import { preconnect } from "react-dom";
import { CombinedJsonLd } from "@/components/json-ld";
import { Navbar } from "@/components/navbar";
import { PreviewBar } from "@/components/preview-bar";
import { Providers } from "@/components/providers";
import { SimpleFooter } from "@/components/simple-footer";
import { getNavigationData } from "@/lib/navigation";
import { SanityLive } from "@/lib/sanity/live";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const fontInika = Inika({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-inika",
});

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  preconnect("https://cdn.sanity.io");
  const nav = await getNavigationData();
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} ${fontInika.variable} font-sans antialiased`}
      >
        <Providers>
{/*           <Navbar navbarData={nav.navbarData} settingsData={nav.settingsData} />  */}
          <Navbar /> 
          {children}
          <SimpleFooter />
          <SanityLive />
          <CombinedJsonLd includeOrganization includeWebsite />
        {/*   {(await draftMode()).isEnabled && (
            <>
              <PreviewBar />
              <VisualEditing />
            </>
          )} */}
        </Providers>
      </body>
    </html>
  );
}
