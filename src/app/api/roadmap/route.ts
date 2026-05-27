import { NextRequest } from "next/server";
import { streamToResponse } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { currentRole, targetRole, timeline, currentSkills } = body;

    if (!targetRole?.trim()) {
      return Response.json(
        { error: "Target role is required" },
        { status: 400 }
      );
    }

    const prompt = `You are an expert career coach who has helped thousands of people transition into their dream roles. Create a highly personalized, practical career roadmap.

**Current Background:** ${currentRole || "Not specified"}
**Target Role:** ${targetRole}
**Timeline:** ${timeline} days
**Current Skills:** ${currentSkills || "Not specified"}

Create a detailed, actionable ${timeline}-day career roadmap. Use markdown formatting with clear sections.

Structure the roadmap as follows:

# ${timeline}-Day Career Roadmap: ${currentRole ? `${currentRole} → ` : ""}${targetRole}

## Overview

Brief 2-3 sentence summary of the strategy and key milestones.

---

## Skills to Develop

List the top 5-7 skills needed for ${targetRole} that they should focus on, ordered by priority:

| Skill | Priority | Estimated Time | Resources |
|-------|----------|----------------|-----------|
| ... | High/Med/Low | X weeks | Course/resource |

---

## Phase 1: Foundation (Days 1-${Math.floor(parseInt(timeline) / 3)})

### Week 1-${Math.ceil(parseInt(timeline) / (3 * 7))}

**Daily Actions:**
- [Specific daily action]
- [Specific daily action]

**This Week's Goals:**
- [Goal 1]
- [Goal 2]
- [Goal 3]

**Learning Resources:**
- [Specific course with platform and link hint, e.g., "React Fundamentals on freeCodeCamp (free)"]
- [YouTube channel or specific playlist]
- [Book or documentation]

---

## Phase 2: Building (Days ${Math.floor(parseInt(timeline) / 3) + 1}-${Math.floor(parseInt(timeline) * 2 / 3)})

### Focus: Practical Projects & Portfolio

**Projects to Build:**
1. **[Project Name]**: [Description] — demonstrates [skill]
2. **[Project Name]**: [Description] — demonstrates [skill]
3. **[Project Name]**: [Description] — demonstrates [skill]

**Learning Resources:**
- [Specific resources with platform names]

**Weekly Milestones:**
- [Milestone 1]
- [Milestone 2]

---

## Phase 3: Launch (Days ${Math.floor(parseInt(timeline) * 2 / 3) + 1}-${timeline})

### Focus: Job Search & Networking

**Job Search Actions:**
- [ ] Update resume with new skills and projects
- [ ] Optimize LinkedIn profile (include: headline, about section, featured section)
- [ ] Apply to 5-10 positions per week
- [ ] Reach out to 3 people in target role per week

**LinkedIn Strategy:**
- [Specific action for profile optimization]
- [Content strategy or networking approach]
- [Connection/outreach template idea]

**Interview Prep:**
- [Specific prep resources]
- [Topics to study for technical interviews if applicable]

---

## Recommended Resources

### Free Resources
- [Resource 1 with URL or platform]
- [Resource 2 with URL or platform]
- [Resource 3 with URL or platform]

### Paid (Worth It) Resources
- [Resource 1 with approximate cost]
- [Resource 2 with approximate cost]

### Communities to Join
- [Community 1 — Discord/Slack/Reddit]
- [Community 2]

---

## Success Metrics

How to know you're on track:

- **Day ${Math.floor(parseInt(timeline) / 4)}:** [Specific measurable milestone]
- **Day ${Math.floor(parseInt(timeline) / 2)}:** [Specific measurable milestone]
- **Day ${Math.floor(parseInt(timeline) * 3 / 4)}:** [Specific measurable milestone]
- **Day ${timeline}:** [Final milestone — applying or landing interviews]

---

## One Thing That Makes All the Difference

A final, honest piece of advice specific to transitioning into ${targetRole} that most career guides miss.`;

    const stream = await streamToResponse(prompt);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error: unknown) {
    console.error("Roadmap API error:", error);
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate roadmap",
      },
      { status: 500 }
    );
  }
}
