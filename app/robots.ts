import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/hmw-secure-admin-portal", "/workspace", "/dashboard", "/api"],
      },
      {
        userAgent: ["GPTBot", "ClaudeBot", "Google-Extended", "PerplexityBot", "CCBot"],
        allow: "/",
        disallow: ["/hmw-secure-admin-portal", "/workspace", "/dashboard", "/api"],
      }
    ],
    sitemap: "https://hackmywebsite.io/sitemap.xml",
  };
}
