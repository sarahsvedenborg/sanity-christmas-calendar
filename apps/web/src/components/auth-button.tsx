"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

type AuthButtonProps = {
  children: React.ReactNode;
  className?: string;
};

export function AuthButton({ children, className }: AuthButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`${className} disabled:cursor-not-allowed disabled:opacity-70`}
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Venter...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}

