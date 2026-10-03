export function SectionHeading({
  index,
  kicker,
  title,
  children,
}: {
  index: string;
  kicker: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="font-mono text-xs text-accent">
          {index} <span className="text-muted">/ {kicker}</span>
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}
