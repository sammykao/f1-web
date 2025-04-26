import { ReactNode } from "react";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative col-span-1 h-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 px-4 pb-4 pt-4 transition-opacity ${className}`}
    >
      {children}
    </div>
  );
}

export function CardTitle({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <h2
      className={`text-xl font-bold text-zinc-100 group-hover:text-white ${className}`}
    >
      {children}
    </h2>
  );
}

export function CardDescription({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <p
      className={`mt-4 leading-relaxed text-sm duration-1000 text-zinc-400 group-hover:text-zinc-300 ${className}`}
    >
      {children}
    </p>
  );
} 