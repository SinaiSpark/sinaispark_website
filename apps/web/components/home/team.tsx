import { LinkedInIcon } from "@/components/ui/icons"
import { SplitText } from "@/components/ui/split-text"
import { TEAM } from "@/content/team"
import { cx } from "@/lib/cx"

/**
 * "The minds behind Sinai Spark".
 *
 * Names, portraits and LinkedIn links are still pending from the client, so a
 * card falls back to the brand mark and a "pending" chip. Fill in `name`,
 * `photo` or `linkedin` in content/team.ts and that card upgrades itself.
 */
export function Team({
  className,
  spy = false,
}: {
  className?: string
  /** Registers the section with the sticky sub-nav on pages that have one. */
  spy?: boolean
} = {}) {
  return (
    <section
      className={cx("team", className)}
      id="team"
      data-surface="light"
      data-spy-section={spy ? "" : undefined}
    >
      <div className="wrap">
        <div className="team-head">
          <div>
            <p className="eyebrow" data-reveal>
              {TEAM.eyebrow}
            </p>
            <SplitText as="h2" className="h2" text={TEAM.headline} />
          </div>
          <p className="lede muted" data-reveal>
            {TEAM.lede}
          </p>
        </div>

        <div className="team-grid">
          {TEAM.members.map((member, i) => (
            <article className="member" key={member.role}>
              <div className="member-ph">
                {member.photo ? (
                  <img src={member.photo} alt={member.name ?? member.role} />
                ) : (
                  <>
                    <img className="ghost" src="/brand/mark-white.svg" alt="" />
                    <span className="pending">{TEAM.placeholderPhoto}</span>
                  </>
                )}
              </div>
              <div className="member-in">
                <h3>{member.name ?? TEAM.placeholderName}</h3>
                <p className="role">{member.role}</p>
                <p className="bio">{member.bio}</p>
                {member.linkedin ? (
                  <a
                    className="li"
                    href={member.linkedin}
                    aria-label={`LinkedIn profile${member.name ? ` for ${member.name}` : ""}`}
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    <LinkedInIcon />
                  </a>
                ) : (
                  <span className="li" aria-hidden="true" key={`li-${i}`}>
                    <LinkedInIcon />
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>

        <p className="team-note" data-reveal>
          {TEAM.note}
        </p>
      </div>
    </section>
  )
}
