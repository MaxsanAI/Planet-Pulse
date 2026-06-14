const GOOGLE_NEWS_BASE =
  "https://news.google.com/rss/headlines/section/geo";

const GLOBAL_FEED =
  "https://feeds.bbci.co.uk/news/world/rss.xml";

function stripHtml(html = "") {
  return html
    .replace(/<!\[CDATA\[(.*?)\]\]>/gis, "$1")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function safeString(text = "") {
  return text
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'")
    .trim();
}

function decodeEntities(text = "") {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function extractTag(item, tag) {
  const regex = new RegExp(
    `<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`,
    "i"
  );

  const match = item.match(regex);

  if (!match) return "";

  return decodeEntities(
    stripHtml(match[1])
  );
}

export async function parseRss(
  countryCode = "global"
) {
  const code = String(countryCode || "global")
    .toLowerCase()
    .trim();

  let feedUrl;

  if (code === "global") {
    feedUrl = GLOBAL_FEED;
  } else {
    const upper =
      getGoogleNewsCountry(code);

    feedUrl =
      `${GOOGLE_NEWS_BASE}/${upper}` +
      `?hl=en&gl=${upper}&ceid=${upper}:en`;
  }

  try {
    const controller =
      new AbortController();

    const timeout = setTimeout(
      () => controller.abort(),
      8000
    );

    const response = await fetch(
      feedUrl,
      {
        headers: {
          "User-Agent":
            "PlanetPulse/1.0",
          Accept:
            "application/rss+xml, application/xml, text/xml"
        },
        signal: controller.signal
      }
    );

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(
        `RSS fetch failed (${response.status})`
      );
    }

    const xml = await response.text();

    const items =
      xml.match(
        /<item[\s\S]*?<\/item>/gi
      ) || [];

    const articles = items.map(
      (item) => {
        const title = extractTag(
          item,
          "title"
        );

        const link = extractTag(
          item,
          "link"
        );

        const description =
          (
            extractTag(
              item,
              "description"
            ) ||
            extractTag(
              item,
              "content:encoded"
            ) ||
            ""
          ).substring(0, 400);

        const pubDate =
          extractTag(
            item,
            "pubDate"
          ) ||
          extractTag(
            item,
            "published"
          ) ||
          new Date().toUTCString();

        return {
          title,
          link,
          description,
          date: pubDate,
          timestamp:
            new Date(pubDate).getTime() ||
            Date.now(),
          safeTitle:
            safeString(title),
          safeDescription:
            safeString(description)
        };
      }
    );

    const result = articles
      .filter(
        (a) =>
          a.title && a.link
      )
      .sort(
        (a, b) =>
          b.timestamp -
          a.timestamp
      )
      .slice(0, 20);

    if (
      result.length === 0 &&
      code !== "global"
    ) {
      return parseRss("global");
    }

    return result;
  } catch (error) {
    console.error(
      "RSS Parser Error:",
      error
    );

    if (countryCode !== "global") {
      return parseRss("global");
    }

    return [];
  }
}
