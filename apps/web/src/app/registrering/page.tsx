"use client";

import { useState } from "react";
import { Snowflakes } from "@/components/Snowflakes";

export default function RegisteringPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    confirmEmail: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate emails match
    if (formData.email !== formData.confirmEmail) {
      alert("E-postadressene matcher ikke");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Vennligst skriv inn en gyldig e-postadresse");
      return;
    }

    setIsSubmitting(true);
    
    // TODO: Implement form submission logic here
    console.log("Form submitted:", formData);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    alert("Takk for registreringen!");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-green-900 to-green-950 dark:from-green-950 dark:via-green-900 dark:to-green-950">
      {/* Snowflake animation background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <Snowflakes />
      </div>
      <div className="relative mx-auto max-w-4xl px-4 py-16">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white">
            Registrering
          </h1>
          <p className="mt-3 text-lg text-white/80">
            Fyll ut skjemaet nedenfor for å registrere deg
          </p>
        </header>

        <div className="mx-auto max-w-2xl">
          <section className="rounded-2xl border border-amber-300/60 bg-white/95 p-8 shadow-md backdrop-blur dark:border-amber-700/50 dark:bg-green-950/85">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-semibold text-green-950 dark:text-white"
                >
                  Fullt navn
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full rounded-lg border-2 border-amber-300/50 bg-white px-4 py-3 text-base text-green-950 placeholder:text-green-900/50 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 dark:border-amber-700/50 dark:bg-green-950/50 dark:text-white dark:placeholder:text-white/50 dark:focus:border-amber-600"
                  placeholder="Skriv inn ditt fulle navn"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-green-950 dark:text-white"
                >
                  E-post
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border-2 border-amber-300/50 bg-white px-4 py-3 text-base text-green-950 placeholder:text-green-900/50 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 dark:border-amber-700/50 dark:bg-green-950/50 dark:text-white dark:placeholder:text-white/50 dark:focus:border-amber-600"
                  placeholder="din.epost@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmEmail"
                  className="mb-2 block text-sm font-semibold text-green-950 dark:text-white"
                >
                  Bekreft e-post
                </label>
                <input
                  type="email"
                  id="confirmEmail"
                  name="confirmEmail"
                  required
                  value={formData.confirmEmail}
                  onChange={handleChange}
                  className="w-full rounded-lg border-2 border-amber-300/50 bg-white px-4 py-3 text-base text-green-950 placeholder:text-green-900/50 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 dark:border-amber-700/50 dark:bg-green-950/50 dark:text-white dark:placeholder:text-white/50 dark:focus:border-amber-600"
                  placeholder="bekreft din e-postadresse"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-amber-500 px-6 py-3 text-lg font-semibold text-white transition-all hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-amber-600 dark:hover:bg-amber-700"
              >
                {isSubmitting ? "Sender..." : "Send inn"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

