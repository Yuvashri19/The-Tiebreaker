import { DecisionWorkspace } from "./types";

export const SAMPLE_DECISIONS: DecisionWorkspace[] = [
  {
    id: "sample-seattle",
    title: "Relocate from Sunny Austin to Seattle for a New Tech Job Offer",
    description: "Evaluating a career development opportunity at a major enterprise in Seattle. The offer includes a 30% salary increase, but means leaving family, sunny Texas weather, and moving to a higher living cost area.",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    options: ["Accept Seattle Offer & Relocate", "Decline Offer & Stay in Austin"],
    prosCons: [
      { id: "pc-s1", name: "Significant 30% Compensation Increase", type: "pro", weight: 5, description: "Provides stronger financial security, wealth-building, and increased monthly savings capacity." },
      { id: "pc-s2", name: "High Career Growth Prestige", type: "pro", weight: 4, description: "Working at an elite tech giant accelerates resume prestige and opens up next-stage recruitment paths." },
      { id: "pc-s3", name: "Gloomy Rainy Weather & Low Solar Days", type: "con", weight: 4, description: "Seattle averages 150+ rainy days. Risk of Seasonal Affective Disorder (SAD) and fewer outdoor options." },
      { id: "pc-s4", name: "Higher State Taxes & Real Estate", type: "con", weight: 3, description: "Seattle living cost is high, particularly rent and real estate prices compared to standard Austin suburbs." },
      { id: "pc-s5", name: "Loss of Nearby Family & Friends Support Group", type: "con", weight: 5, description: "Leaving a fully established local emotional support network; starting social circle from scratch." },
      { id: "pc-s6", name: "Vibrant Pacific Northwest Wilderness", type: "pro", weight: 3, description: "Incredible hiking, snowboarding, lakes, and nature scenery perfect during summer/spring seasons." }
    ],
    swot: [
      { id: "sw-s1", name: "Experienced Industry Skills Match", category: "strength", weight: 4, description: "The Seattle team's roadmap directly leverages my background in system engineering, ensuring fast validation." },
      { id: "sw-s2", name: "Heavy Setup Transition Friction", category: "weakness", weight: 3, description: "Selling furniture, breaking lease, moving cargo, and setting up utilities adds high upfront mental overhead." },
      { id: "sw-s3", name: "Seattle Tech Hub Ecosystem", category: "opportunity", weight: 5, description: "Enormous regional networking potential with thousands of startups, VCs, and tech professionals." },
      { id: "sw-s4", name: "Rapid Burnout Risk in High-Pressure Team", category: "threat", weight: 3, description: "The new division is notorious for demanding 60+ hour weeks, threatening current health and burnout." }
    ],
    criteria: [
      { id: "crit-s1", name: "Financial Growth", weight: 5, description: "Salary, stock options, savings potential, and relative purchasing power." },
      { id: "crit-s2", name: "Mental & Physical Health", weight: 4, description: "Work-life balance, climate comfort, stress levels, and weather impacts." },
      { id: "crit-s3", name: "Career Acceleration", weight: 4, description: "Skill expansion, resume power, networking opportunities, and job security." },
      { id: "crit-s4", name: "Social Support & Quality of Life", weight: 5, description: "Proximity to friends/family, community comfort, hobby convenience, and daily environment." }
    ],
    comparisonOptions: [
      {
        id: "opt-s1",
        name: "Accept Seattle Offer & Relocate",
        scores: {
          "crit-s1": 9,
          "crit-s2": 4,
          "crit-s3": 10,
          "crit-s4": 3
        }
      },
      {
        id: "opt-s2",
        name: "Decline Offer & Stay in Austin",
        scores: {
          "crit-s1": 6,
          "crit-s2": 8,
          "crit-s3": 5,
          "crit-s4": 9
        }
      }
    ],
    verdict: {
      winner: "Decline Offer & Stay in Austin",
      reasoning: "While the financial and career gains of relocating to Seattle are exceptionally strong (9/10 and 10/10), the calculated cost to mental health, loss of nearby family networks, and harsh climate change (3/10 social quality) creates too heavy an emotional tax. Austin serves as a highly balanced foundation right now. You should decline, but negotiate a counter-offer or seek remote assignments.",
      mitigationStrategy: "If Seattle is declined: Arrange a formal review with Austin leadership to request a 10-15% cost-of-living adjustment. Devote weekends to local networking to simulate Tech Hub opportunities inside the Austin workspace.",
      nextSteps: [
        "Formulate a friendly rejection response emphasizing family proximity constraints.",
        "Propose remote consultation or long-distance contract options to the Seattle team.",
        "Initiate a local Austin salary revision strategy using the Seattle offer details as leverage."
      ]
    }
  },
  {
    id: "sample-ev",
    title: "Buy a New All-Electric SUV vs. Keeping My Hybrid Hatchback",
    description: "Evaluating whether to upgrade to a premium All-Electric SUV. My current hybrid is fully paid-off and reliable, but the EV offers zero tailpipe emissions, ultra-modern tech, superior cargo volume, and state tax credits.",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    options: ["Buy New Electric SUV", "Keep Reliable Hybrid Hatchback"],
    prosCons: [
      { id: "pc-e1", name: "Zero Direct Gasoline & Tailpipe Emissions", type: "pro", weight: 5, description: "Dramatically reduces daily carbon footprint and aligns with environmental stewardship values." },
      { id: "pc-e2", name: "Heavy Monthly Auto Loan Payment", type: "con", weight: 5, description: "Adds a $650 per month financing commitment for 60 months, reducing overall discretionary savings." },
      { id: "pc-e3", name: "Excellent Storage space & Premium Comfort", type: "pro", weight: 4, description: "Ample cargo volume for long road-trips, pet transport, and comfortable rear seating." },
      { id: "pc-e4", name: "EV Range Anxiety & Charger Setup Costs", type: "con", weight: 3, description: "Requires installing a level 2 charger at home ($800 upfront) and planning routes carefully during winters." },
      { id: "pc-e5", name: "Instant Acceleration & Silent Fun Drive", type: "pro", weight: 3, description: "Fascinating driving performance with responsive throttle and peaceful, silent interior cabin." }
    ],
    swot: [
      { id: "sw-e1", name: "Ready Home Charging Utility", category: "strength", weight: 4, description: "Live in a single-family home with a garage, making nightly residential charging incredibly straightforward." },
      { id: "sw-e2", name: "High Upfront Insurance Premium Upgrade", category: "weakness", weight: 3, description: "EV insurance quotes are roughly 40% higher annually than current standard hybrid rates." },
      { id: "sw-e3", name: "Federal & State EV Tax Deductions", category: "opportunity", weight: 5, description: "Eligible for a $7,500 active tax credit, alongside local power utility home charger rebates." },
      { id: "sw-e4", name: "Rapid Depreciating Tech Curve", category: "threat", weight: 4, description: "Battery chemistry is advancing rapidly; active market value of custom EVs may drop fast over the next 3 years." }
    ],
    criteria: [
      { id: "crit-e1", name: "Financial Economy", weight: 5, description: "Purchase cost, financing burden, monthly fuel/electricity savings, and maintenance risks." },
      { id: "crit-e2", name: "Ecological Impact", weight: 4, description: "Carbon footprint reduction, renewable energy charging compliance, and lifecycle efficiency." },
      { id: "crit-e3", name: "Utility & Everyday Comfort", weight: 3, description: "Passenger luxury, cargo space, dynamic performance, and tech convenience." },
      { id: "crit-e4", name: "Convenience & Charging Predictability", weight: 4, description: "Charging availability, range assurance during freezing weather, and road trip setup." }
    ],
    comparisonOptions: [
      {
        id: "opt-e1",
        name: "Buy New Electric SUV",
        scores: {
          "crit-e1": 4,
          "crit-e2": 9,
          "crit-e3": 9,
          "crit-e4": 6
        }
      },
      {
        id: "opt-e2",
        name: "Keep Reliable Hybrid Hatchback",
        scores: {
          "crit-e1": 9,
          "crit-e2": 5,
          "crit-e3": 5,
          "crit-e4": 10
        }
      }
    ],
    verdict: {
      winner: "Keep Reliable Hybrid Hatchback",
      reasoning: "The absolute financial safety of having zero car payments (9/10 Economy) overrides the utility and eco benefits of the new EV (9/10 Eco, 9/10 Comfort). With high interest rates, locking yourself into a new 5-year loan is a burden. Wait another 1-2 years until your current hybrid depreciates further, and EV battery tech stabilizes.",
      mitigationStrategy: "Satisfy the desire for high-tech integration by spending ~$200 adding a post-market wireless CarPlay or Android Auto adapter to the current hybrid dashboard.",
      nextSteps: [
        "Open a dedicated 'Car Savings Fund' in a high-yield savings account and deposit $400/mo to buy the EV with larger cash share later.",
        "Request quotes for Level 2 home installation from local electricians to understand genuine setup costs before buying any EV.",
        "Perform basic detailing and scheduled service on current hybrid to keep it running smoothly."
      ]
    }
  }
];
