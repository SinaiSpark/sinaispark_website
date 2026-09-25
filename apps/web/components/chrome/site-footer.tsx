import { SmartLink } from "@/components/ui/smart-link"
import { BRAND, FOOTER } from "@/content/site"
import { visibleLinks } from "@/lib/insights-links"

/**
 * Site footer: brand blurb, three link columns and the legal line. The
 * Research links only appear once Insights is switched on; the blog is
 * always there.
 */
export function SiteFooter({ insights }: { insights: boolean }) {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="top">
          <div>
            <img src="/brand/logo-white.svg" alt={BRAND.name} />
            <p style={{ maxWidth: "34ch" }}>{BRAND.blurb}</p>
          </div>
          {FOOTER.columns.map((column) => (
            <div key={column.heading}>
              <h4>{column.heading}</h4>
              <ul>
                {visibleLinks(column.items, insights).map((item) => (
                  <li key={item.label}>
                    <SmartLink href={item.href}>{item.label}</SmartLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="bottom">
          <span>{BRAND.copyright}</span>
          <span>{BRAND.officeLine}</span>
          <span>
            {FOOTER.legal.map((item, i) => (
              <span key={item.label}>
                {i > 0 ? <>&nbsp;·&nbsp;</> : null}
                <SmartLink href={item.href}>{item.label}</SmartLink>
              </span>
            ))}
          </span>
        </div>
      </div>
    </footer>
  )
}
