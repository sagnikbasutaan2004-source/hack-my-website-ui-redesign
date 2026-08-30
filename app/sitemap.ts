import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://hackmywebsite.io";

  const routes: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" }[] = [
    { path: "", priority: 1.0, changeFrequency: "daily" },
    { path: "/how-it-works", priority: 0.9, changeFrequency: "weekly" },
    { path: "/sample-report", priority: 0.9, changeFrequency: "weekly" },
    { path: "/methodology", priority: 0.9, changeFrequency: "weekly" },
    { path: "/vit-launch", priority: 0.8, changeFrequency: "weekly" },
    { path: "/vit-launch/ambassador", priority: 0.7, changeFrequency: "weekly" },
    { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
    { path: "/login", priority: 0.6, changeFrequency: "monthly" },
    { path: "/signup", priority: 0.6, changeFrequency: "monthly" },
    { path: "/privacy-policy", priority: 0.5, changeFrequency: "monthly" },
    { path: "/terms-and-conditions", priority: 0.5, changeFrequency: "monthly" },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
