export const prerender = false;

export const POST = async ({ request, locals }) => {
  try {
    const body = await request.json();

    const title = String(body?.title || "").trim();
    const text = String(body?.text || "").trim();
    const language = String(body?.language || "en").trim();

    if (!title && !text) {
      return new Response(
        JSON.stringify({
          translatedTitle: "",
          bullet1: "Missing content",
          bullet2: "",
          bullet3: ""
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    const ai = locals?.runtime?.env?.AI;

    if (!ai) {
      return new Response(
        JSON.stringify({
          translatedTitle: title || "Error",
          bullet1: "AI binding missing",
          bullet2: "",
          bullet3: ""
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    const systemPrompt = `
You are Planet Pulse AI.

Return ONLY valid JSON.

Rules:
- Translate everything into requested language
- If language is invalid, use English
- No markdown
- No extra keys

JSON format:
{
  "translatedTitle": "",
  "bullet1": "",
  "bullet2": "",
  "bullet3": ""
}
`;

    const userPrompt = `
Language: ${language}

Title: ${title}

Content: ${text}
`;

    const result = await ai.run(
      "@cf/meta/llama-3.2-3b-instruct",
      {
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        response_format: {
          type: "json_object"
        },
        max_tokens: 350
      }
    );

    let output = result?.response || result;

    if (typeof output === "string") {
      try {
        output = JSON.parse(output);
      } catch {
        output = {
          translatedTitle: title,
          bullet1: "Summary unavailable",
          bullet2: "",
          bullet3: ""
        };
      }
    }

    output = {
      translatedTitle:
        output?.translatedTitle || title,
      bullet1:
        output?.bullet1 || "",
      bullet2:
        output?.bullet2 || "",
      bullet3:
        output?.bullet3 || ""
    };

    return new Response(
      JSON.stringify(output),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store"
        }
      }
    );
  } catch (error) {
    console.error("AI ERROR:", error);

    return new Response(
      JSON.stringify({
        translatedTitle: "Error",
        bullet1: "Unable to generate summary.",
        bullet2: "",
        bullet3: ""
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
};
