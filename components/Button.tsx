import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "quiet";

const styles: Record<ButtonVariant, string> = {
  primary: "bg-accent text-white hover:bg-accentDark",
  secondary: "border border-slateLine bg-white text-ink hover:bg-slate-50",
  danger: "bg-red-700 text-white hover:bg-red-800",
  quiet: "bg-transparent text-accent hover:bg-teal-50"
};

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; variant?: ButtonVariant }) {
  return (
    <button
      className={`focus-ring rounded-xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
