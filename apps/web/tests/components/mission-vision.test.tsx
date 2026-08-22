import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { MissionVision } from "@/components/home/mission-vision"
import { HOME } from "@/lib/content/home"

describe("MissionVision", () => {
  it("renders both Mission and Vision sections with their titles and bodies", () => {
    render(<MissionVision />)

    expect(
      screen.getByText(HOME.missionVision.mission.title)
    ).toBeInTheDocument()
    expect(
      screen.getByText(HOME.missionVision.mission.body)
    ).toBeInTheDocument()

    expect(
      screen.getByText(HOME.missionVision.vision.title)
    ).toBeInTheDocument()
    expect(screen.getByText(HOME.missionVision.vision.body)).toBeInTheDocument()
  })

  it("has accessible section label", () => {
    render(<MissionVision />)
    expect(
      screen.getByRole("region", { name: /mission and vision/i })
    ).toBeInTheDocument()
  })
})
