import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Google GenAI client
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

app.use(express.json());

// API route for decision analysis
app.post("/api/decision/analyze", async (req, res) => {
  const { decision, options: userOptions } = req.body;

  if (!decision || typeof decision !== "string" || decision.trim() === "") {
    return res.status(400).json({ error: "The decision text is required." });
  }

  if (!apiKey) {
    return res.status(500).json({
      error: "Gemini API key is not configured. Please set GEMINI_API_KEY in your Secrets block."
    });
  }

  try {
    const userOptionsList = userOptions && typeof userOptions === "string" && userOptions.trim() !== ""
      ? userOptions.split(",").map((o: string) => o.trim()).filter((o: string) => o.length > 0)
      : null;

    const providedOptionsText = userOptionsList
      ? userOptionsList.map(o => `"${o}"`).join(", ")
      : "";

    const systemInstruction = 
      "You are 'The Tiebreaker', an elite decision consultant and expert analytical system. " +
      "Your goal is to parse hard decisions and break them down into highly structured, realistic, and objective " +
      "analytical components: Pros/Cons, SWOT, Multi-Option Comparison matrix, and a robust Verdict.";

    const prompt = `
Analyze the following decision or dilemma described by the user:
"${decision}"

${providedOptionsText ? `Strictly use these provided option alternatives: ${providedOptionsText}` : `Identify the 2 or 3 most logical, realistic, and mutually exclusive option paths (alternatives) available to resolve this dilemma.`}

Provide a comprehensive, high-quality, objective analysis formatted matching the requested responseSchema:
1. Clean user's decision into an elegant question 'title' and provide a descriptive background summary in 'description'.
2. List 6-10 highly relevant 'prosCons' items. Each item must have a specific name, type ('pro' or 'con'), descriptive sentence, and default importance weight (1 to 5).
3. List 4-8 distinct entries for the 'swot' list (at least one of each category: strength, weakness, opportunity, threat). Assign each a name, category, explanation, and default importance weight (1 to 5).
4. List 4-6 evaluation 'criteria' for comparison (e.g., Cost, Long-term growth, Joy & alignment, Stress level, Tech difficulty). Assign each a default importance weight (1 to 5) and explanatory description.
5. List 'comparisonOptions' containing scores for each of your brainstormed options. For each option, assign a rating (integer 1 to 10) for ALL criteria identified in step 4.
6. Formulate a decisive 'verdict' object containing a recommended 'winner' option, clear 'reasoning', a 'mitigationStrategy' for risks associated with the winner, and exactly 3 clear action steps 'nextSteps' (as an array) the user should take.
`;

    // Generate content using the recommended gemini-3.5-flash model
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.2, // slightly lower temperature for more objective analysis
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "The cleaned-up primary decision question title.",
            },
            description: {
              type: Type.STRING,
              description: "A professional background description of the dilemma.",
            },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "The list of standard alternatives or choices.",
            },
            prosCons: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "A clear label summarizing the pro or con." },
                  type: { type: Type.STRING, enum: ["pro", "con"] },
                  description: { type: Type.STRING, description: "The strategic explanation or details." },
                  weight: { type: Type.INTEGER, description: "Importance weight on a scale from 1 (low) to 5 (critical)." }
                },
                required: ["name", "type", "description", "weight"]
              }
            },
            swot: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "A summary label for this SWOT category factor." },
                  category: { type: Type.STRING, enum: ["strength", "weakness", "opportunity", "threat"] },
                  description: { type: Type.STRING, description: "Why this factor exists and why it matters." },
                  weight: { type: Type.INTEGER, description: "Dynamic relevance score on a scale from 1 to 5." }
                },
                required: ["name", "category", "description", "weight"]
              }
            },
            criteria: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Name of the comparison factor (e.g., Financial Cost, Fulfillment)." },
                  weight: { type: Type.INTEGER, description: "Importance score for this criteria from 1 to 5." },
                  description: { type: Type.STRING, description: "Clear definition of how this criterion is scored." }
                },
                required: ["name", "weight", "description"]
              }
            },
            comparisonOptions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "The name of the option pathway. Must match one of the options elements exactly." },
                  scores: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        criterionName: { type: Type.STRING, description: "The name of the evaluation criteria modeled above." },
                        rating: { type: Type.INTEGER, description: "Rating score of this option from 1 (worst) to 10 (perfect)." }
                      },
                      required: ["criterionName", "rating"]
                    }
                  }
                },
                required: ["name", "scores"]
              }
            },
            verdict: {
              type: Type.OBJECT,
              properties: {
                winner: { type: Type.STRING, description: "The standard option recommended as the outright winner." },
                reasoning: { type: Type.STRING, description: "Highly compelling multi-factor summary guiding this choice." },
                mitigationStrategy: { type: Type.STRING, description: "Tactical guidelines to cover any downsides of this winner choice." },
                nextSteps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "List of exactly 3 tactical actions to execute next."
                }
              },
              required: ["winner", "reasoning", "mitigationStrategy", "nextSteps"]
            }
          },
          required: [
            "title",
            "description",
            "options",
            "prosCons",
            "swot",
            "criteria",
            "comparisonOptions",
            "verdict"
          ]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response generated by Gemini model.");
    }

    const rawData = JSON.parse(text);

    // Let's refine and index the parsed elements so they have stable keys (UUIDs) for our React key bindings
    // we also map criteria and score maps cleanly.
    const criteriaWithIds = rawData.criteria.map((c: any, index: number) => ({
      id: `crit-${index}`,
      name: c.name,
      weight: Math.min(5, Math.max(1, Number(c.weight) || 3)),
      description: c.description
    }));

    const prosConsWithIds = rawData.prosCons.map((pc: any, index: number) => ({
      id: `pc-${index}`,
      name: pc.name,
      type: pc.type === 'pro' || pc.type === 'con' ? pc.type : 'pro',
      weight: Math.min(5, Math.max(1, Number(pc.weight) || 3)),
      description: pc.description
    }));

    const swotWithIds = rawData.swot.map((sw: any, index: number) => ({
      id: `sw-${index}`,
      name: sw.name,
      category: sw.category,
      weight: Math.min(5, Math.max(1, Number(sw.weight) || 3)),
      description: sw.description
    }));

    // Convert comparison options scores to Map of criteriaId -> rating format
    const optionsWithScores = rawData.comparisonOptions.map((opt: any, optIndex: number) => {
      const scoresRecord: Record<string, number> = {};
      
      // Initialize with average 5
      criteriaWithIds.forEach((crit: any) => {
        scoresRecord[crit.id] = 5;
      });

      // Override with ratings matching the criterionName
      if (Array.isArray(opt.scores)) {
        opt.scores.forEach((scr: any) => {
          const matchedCrit = criteriaWithIds.find((c: any) => c.name.toLowerCase() === scr.criterionName.toLowerCase());
          if (matchedCrit) {
            scoresRecord[matchedCrit.id] = Math.min(10, Math.max(1, Number(scr.rating) || 5));
          }
        });
      }

      return {
        id: `opt-${optIndex}`,
        name: opt.name,
        scores: scoresRecord
      };
    });

    const refinedWorkspace = {
      id: `decision-${Date.now()}`,
      title: rawData.title,
      description: rawData.description,
      createdAt: new Date().toISOString(),
      options: rawData.options || refinedOptionsFromScores(optionsWithScores),
      prosCons: prosConsWithIds,
      swot: swotWithIds,
      criteria: criteriaWithIds,
      comparisonOptions: optionsWithScores,
      verdict: {
        winner: rawData.verdict.winner,
        reasoning: rawData.verdict.reasoning,
        mitigationStrategy: rawData.verdict.mitigationStrategy,
        nextSteps: rawData.verdict.nextSteps || []
      }
    };

    res.json(refinedWorkspace);

  } catch (error: any) {
    console.error("Gemini analysis error:", error);
    res.status(500).json({
      error: "Failed to perform AI decision analysis.",
      details: error.message || error
    });
  }
});

function refinedOptionsFromScores(options: any[]): string[] {
  return options.map(o => o.name);
}

// Vite and build path handlers
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
