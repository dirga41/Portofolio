import type { SocialLink } from "@/lib/socials";
import { waLink, waNumber } from "@/lib/utils";

export function SiteFooter({ handle, links, whatsapp }: { handle: string; links: SocialLink[]; whatsapp: string }) {
  const hasWa = Boolean(waNumber(whatsapp));
  return (
    <footer className="border-t border-line">
      <div className="container-page flex flex-col gap-3 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {handle}
        </p>
        {(links.length > 0 || hasWa) && (
          <ul className="flex flex-wrap gap-x-5">
            {hasWa && (
              <li>
                <a href={waLink(whatsapp)} target="_blank" rel="noreferrer" className="link inline-flex min-h-[44px] items-center">
                  WhatsApp<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            )}
            {links.map((l) => (
              <li key={l.key}>
                <a href={l.href} target="_blank" rel="noreferrer" className="link inline-flex min-h-[44px] items-center">
                  {l.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </footer>
  );
}
