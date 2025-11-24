import "@workspace/ui/globals.css";
import "./demo-theme.css";

import type { Metadata } from "next";
import { DemoNavbar } from "@/components/demo-navbar";

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
  return (
    <div className="demo-theme">
      <DemoNavbar />
      {children}
    </div>
  );
}

