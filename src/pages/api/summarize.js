export const prerender = false;

export const POST = async ({ request, locals }) => {
  try {
    const body = await request.json();

    const title = String(body?.title || "");
    const text = String(body?.text || "");
    const language = String(
      body?.language || "en"
    ).trim();

    if (!title && !text) {
      return new Response(
        JSON.stringify({
          error: "Missing content"
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
          error: "Cloudflare AI binding missing"
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

Analyze the news article.

IMPORTANT RULES:

1. Translate EVERYTHING into the requested target language.
2. If the requested language is unclear or unsupported, use English.
3. Return ONLY valid JSON.
4. No markdown.
5. No explanations.
6. No extra keys.

Required JSON structure:

{
  "translatedTitle": "",
  "bullet1": "",
  "bullet2": "",
  "bullet3": ""
}
`;

    const userPrompt = `
Target Language:
${language}

News Title:
${title}

News Content:
${text}
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
        max_tokens: 400
      }
    );

    let output = result?.response || result;

    if (typeof output === "string") {
      try {
        output = JSON.parse(output);
      } catch {
        output = {
          translatedTitle: title,
          bullet1: "Summary unavailable.",
          bullet2: "",
          bullet3: ""
        };
      }
    }

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
    console.error(error);

    return new Response(
      JSON.stringify({
        translatedTitle: "Summary Error",
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
