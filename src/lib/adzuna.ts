const APP_ID = process.env.ADZUNA_APP_ID!;
const APP_KEY = process.env.ADZUNA_APP_KEY!;
const BASE = "https://api.adzuna.com/v1/api/jobs";

export interface AdzunaJob {
  id: string;
  title: string;
  company: { display_name: string };
  location: { display_name: string };
  description: string;
  salary_min?: number;
  salary_max?: number;
  contract_type?: string;
  created: string;
  redirect_url: string;
  category: { label: string };
}

export async function searchJobs(params: {
  what: string;
  where?: string;
  country?: string;
  page?: number;
  results_per_page?: number;
  salary_min?: number;
  full_time?: boolean;
  part_time?: boolean;
  sort_by?: string;
}): Promise<{ results: AdzunaJob[]; count: number }> {
  const country = params.country || "us";
  const page = params.page || 1;

  const url = new URL(`${BASE}/${country}/search/${page}`);
  url.searchParams.set("app_id", APP_ID);
  url.searchParams.set("app_key", APP_KEY);
  url.searchParams.set(
    "results_per_page",
    String(params.results_per_page || 20)
  );
  url.searchParams.set("what", params.what);
  url.searchParams.set("content-type", "application/json");
  url.searchParams.set("sort_by", params.sort_by || "date");
  if (params.where) url.searchParams.set("where", params.where);
  if (params.salary_min)
    url.searchParams.set("salary_min", String(params.salary_min));
  if (params.full_time) url.searchParams.set("full_time", "1");
  if (params.part_time) url.searchParams.set("part_time", "1");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Adzuna error: ${res.status}`);
  const data = await res.json();
  return { results: data.results || [], count: data.count || 0 };
}
