/** Judul section bergaya editorial: nomor italic kecil + judul serif besar, catatan di kolom kanan. */
export function SectionHeading({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-12 grid gap-5 md:grid-cols-12 md:items-end">
      <h2 className="font-display text-5xl leading-[0.95] tracking-[-0.03em] sm:text-6xl md:col-span-8">
        <span className="mr-3 align-top text-base italic tracking-normal text-accent">({index})</span>
        {title}
      </h2>
      {children && <div className="text-sm leading-relaxed text-muted md:col-span-4">{children}</div>}
    </div>
  );
}
