/**
 * Planet Pulse
 * ISO Country → Google News Country Mapping
 *
 * Google News RSS:
 * https://news.google.com/rss/headlines/section/geo/COUNTRY
 * ?hl=en&gl=COUNTRY&ceid=COUNTRY:en
 *
 * All countries fallback safely to GLOBAL feed
 */

export const COUNTRY_MAP = {
  AF: "AF",
  AL: "AL",
  DZ: "DZ",
  AS: "AS",
  AD: "AD",
  AO: "AO",
  AI: "AI",
  AQ: "AQ",
  AG: "AG",
  AR: "AR",
  AM: "AM",
  AW: "AW",
  AU: "AU",
  AT: "AT",
  AZ: "AZ",

  BS: "BS",
  BH: "BH",
  BD: "BD",
  BB: "BB",
  BY: "BY",
  BE: "BE",
  BZ: "BZ",
  BJ: "BJ",
  BM: "BM",
  BT: "BT",
  BO: "BO",
  BA: "BA",
  BW: "BW",
  BR: "BR",
  BN: "BN",
  BG: "BG",
  BF: "BF",
  BI: "BI",

  CV: "CV",
  KH: "KH",
  CM: "CM",
  CA: "CA",
  KY: "KY",
  CF: "CF",
  TD: "TD",
  CL: "CL",
  CN: "CN",
  CX: "CX",
  CO: "CO",
  KM: "KM",
  CG: "CG",
  CD: "CD",
  CR: "CR",
  CI: "CI",
  HR: "HR",
  CU: "CU",
  CY: "CY",
  CZ: "CZ",

  DK: "DK",
  DJ: "DJ",
  DM: "DM",
  DO: "DO",

  EC: "EC",
  EG: "EG",
  SV: "SV",
  GQ: "GQ",
  ER: "ER",
  EE: "EE",
  SZ: "SZ",
  ET: "ET",

  FK: "FK",
  FO: "FO",
  FJ: "FJ",
  FI: "FI",
  FR: "FR",

  GF: "GF",
  PF: "PF",
  GA: "GA",
  GM: "GM",
  GE: "GE",
  DE: "DE",
  GH: "GH",
  GI: "GI",
  GR: "GR",
  GL: "GL",
  GD: "GD",
  GP: "GP",
  GU: "GU",
  GT: "GT",
  GN: "GN",
  GW: "GW",
  GY: "GY",

  HT: "HT",
  HN: "HN",
  HK: "HK",
  HU: "HU",

  IS: "IS",
  IN: "IN",
  ID: "ID",
  IR: "IR",
  IQ: "IQ",
  IE: "IE",
  IL: "IL",
  IT: "IT",

  JM: "JM",
  JP: "JP",
  JO: "JO",

  KZ: "KZ",
  KE: "KE",
  KI: "KI",
  KP: "KP",
  KR: "KR",
  KW: "KW",
  KG: "KG",

  LA: "LA",
  LV: "LV",
  LB: "LB",
  LS: "LS",
  LR: "LR",
  LY: "LY",
  LI: "LI",
  LT: "LT",
  LU: "LU",

  MO: "MO",
  MG: "MG",
  MW: "MW",
  MY: "MY",
  MV: "MV",
  ML: "ML",
  MT: "MT",
  MH: "MH",
  MQ: "MQ",
  MR: "MR",
  MU: "MU",
  MX: "MX",
  FM: "FM",
  MD: "MD",
  MC: "MC",
  MN: "MN",
  ME: "ME",
  MA: "MA",
  MZ: "MZ",
  MM: "MM",

  NA: "NA",
  NR: "NR",
  NP: "NP",
  NL: "NL",
  NC: "NC",
  NZ: "NZ",
  NI: "NI",
  NE: "NE",
  NG: "NG",
  MK: "MK",
  NO: "NO",

  OM: "OM",

  PK: "PK",
  PW: "PW",
  PA: "PA",
  PG: "PG",
  PY: "PY",
  PE: "PE",
  PH: "PH",
  PL: "PL",
  PT: "PT",
  PR: "PR",

  QA: "QA",

  RE: "RE",
  RO: "RO",
  RU: "RU",
  RW: "RW",

  KN: "KN",
  LC: "LC",
  VC: "VC",
  WS: "WS",
  SM: "SM",
  ST: "ST",
  SA: "SA",
  SN: "SN",
  RS: "RS",
  SC: "SC",
  SL: "SL",
  SG: "SG",
  SK: "SK",
  SI: "SI",
  SB: "SB",
  SO: "SO",
  ZA: "ZA",
  ES: "ES",
  LK: "LK",
  SD: "SD",
  SR: "SR",
  SE: "SE",
  CH: "CH",
  SY: "SY",

  TW: "TW",
  TJ: "TJ",
  TZ: "TZ",
  TH: "TH",
  TL: "TL",
  TG: "TG",
  TO: "TO",
  TT: "TT",
  TN: "TN",
  TR: "TR",
  TM: "TM",
  TC: "TC",
  TV: "TV",

  UG: "UG",
  UA: "UA",
  AE: "AE",
  GB: "GB",
  US: "US",
  UY: "UY",
  UZ: "UZ",

  VU: "VU",
  VA: "VA",
  VE: "VE",
  VN: "VN",
  VG: "VG",

  YE: "YE",

  ZM: "ZM",
  ZW: "ZW"
};

export const SUPPORTED_COUNTRIES =
  Object.keys(COUNTRY_MAP);

export function normalizeCountry(code) {
  if (!code) return null;

  const normalized =
    code.toString().trim().toUpperCase();

  return COUNTRY_MAP[normalized] || null;
}

export function getGoogleNewsCountry(code) {
  const normalized =
    normalizeCountry(code);

  return normalized || "US";
}

export function getGoogleNewsFeed(code) {
  const country =
    getGoogleNewsCountry(code);

  return `https://news.google.com/rss/headlines/section/geo/${country}?hl=en&gl=${country}&ceid=${country}:en`;
}
