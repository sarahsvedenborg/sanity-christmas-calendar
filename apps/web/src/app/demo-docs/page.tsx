import { Snowflakes } from "@/components/Snowflakes";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demo Docs",
  description: "Documentation for the demo studio",
};

export default function DemoDocsPage() {
  return (
   
       <div className="min-h-screen bg-gradient-to-br from-green-950 via-green-900 to-green-950 dark:from-green-950 dark:via-green-900 dark:to-green-950">
      {/* Snowflake animation background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <Snowflakes />
      </div>
      <div className="relative mx-auto max-w-4xl px-4 py-16">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white">
         Dokumentasjon for Demo Studio
          </h1>
          <p className="mt-3 text-lg text-white/80">
        Dette er en ingress
          </p>
        </header>

        <div className="space-y-10">
           
            <>
              {/* 
                 <article
                  key={answer._id}
                  className="rounded-2xl border border-amber-300/60 bg-white/95 p-8 shadow-md transition backdrop-blur dark:border-amber-700/50 dark:bg-green-950/85"
                >
                  <RichText className="text-left" richText={answer.content} />
              
                </article> */}
             

            
                <section className="rounded-2xl border border-amber-300/60 bg-white/95 p-8 shadow-md backdrop-blur dark:border-amber-700/50 dark:bg-green-950/85">
                  <header className="mb-6">
                    <h2 className="text-2xl font-semibold text-green-950 dark:text-white">
                   Dokumentasjon for Demo Studio
                    </h2>
                    <p className="mt-2 text-green-900/80 dark:text-white/70">
                      Utforsk arbeid som deltakere har valgt å dele offentlig.
                    </p>
                  </header>
                 <p>dfsdf</p>
                 <p>dfsdf</p>
                </section>
               
            </>
          
        </div>
      </div>
    </div>
  );
}

