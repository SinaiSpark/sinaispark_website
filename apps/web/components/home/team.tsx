import { TeamRail } from "@/components/home/team-rail"
import { LinkedInIcon } from "@/components/ui/icons"
import { SplitText } from "@/components/ui/split-text"
import { TEAM } from "@/content/team"
import { cx } from "@/lib/cx"
import type { TeamMember } from "@/lib/site-content"

/**
 * "The minds behind Sinai Spark".
 *
 * The people come from the CMS (lib/site-content.ts). A card without a
 * photo falls back to the brand mark and a "pending" chip, and one without a
 * name says so; filling either in the admin upgrades that card. More than
 * four members turn the grid into a sideways-scrolling row (TeamRail).
 */
const VISIBLE = 4

export function Team({
  members,
  className,
  spy = false,
}: {
  members: TeamMember[]
  className?: string
  /** Registers the section with the sticky sub-nav on pages that have one. */
  spy?: boolean
}) {
  if (!members.length) return null
  const pending = members.some((member) => !member.name || !member.photo)

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

        <TeamRail scroll={members.length > VISIBLE}>
          {members.map((member, i) => (
            <article className="member" key={`${i}-${member.role}`}>
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
        </TeamRail>

        {pending ? (
          <p className="team-note" data-reveal>
            {TEAM.note}
          </p>
        ) : null}
      </div>
    </section>
  )
}
