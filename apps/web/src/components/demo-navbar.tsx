"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function DemoNavbar() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    if (path === "/demo") {
      return pathname === "/demo";
    }
    return pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-16 z-30 w-full border-b border-cyan-400/30 bg-gradient-to-r from-blue-950/90 to-blue-900/90 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-12 items-center justify-center gap-6 md:gap-8">
          <Link
            href="/demo"
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              isActive("/demo")
                ? "text-cyan-300 border-b-2 border-cyan-300"
                : "text-white/80 hover:text-cyan-200"
            }`}
          >
            Demo Hjem
          </Link>
          <Link
            href="/demo/blog"
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              isActive("/demo/blog")
                ? "text-cyan-300 border-b-2 border-cyan-300"
                : "text-white/80 hover:text-cyan-200"
            }`}
          >
            Blog
          </Link>
          <Link
            href="/demo-docs"
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              isActive("/demo-docs")
                ? "text-cyan-300 border-b-2 border-cyan-300"
                : "text-white/80 hover:text-cyan-200"
            }`}
          >
            Dokumentasjon
          </Link>
        </div>
      </div>
    </nav>
  );
}

