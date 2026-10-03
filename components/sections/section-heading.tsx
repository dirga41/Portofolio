/** Judul section: header Fraunces berukuran sedang, catatan kecil di sisi kanan. */
export function SectionHeading({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-3 border-b border-line pb-5">
      <h2 className="font-display text-3xl tracking-[-0.02em] sm:text-[2.5rem] sm:leading-[1.1]">{title}</h2>
      {children && <div className="max-w-sm text-[15px] text-muted">{children}</div>}
    </div>
  );
}
