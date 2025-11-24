import "@workspace/ui/globals.css";
import "./demo-theme.css";

import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Providers } from "@/components/providers";
import { SimpleFooter } from "@/components/simple-footer";
import { getNavigationData } from "@/lib/navigation";
import { SanityLive } from "@/lib/sanity/live";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function DemoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nav = await getNavigationData();
  return (
    <div className="demo-theme">
          {children}
    {/*   <Providers>
        <Navbar />
        {children}
        <SimpleFooter />
        <SanityLive />
      </Providers> */}
    </div>
  );
}

