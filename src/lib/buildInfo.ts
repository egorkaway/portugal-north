export type BuildInfo = {
  buildNumber: string;
};

export async function fetchBuildInfo(): Promise<BuildInfo> {
  const res = await fetch("/version.json", { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`version.json returned ${res.status}`);
  }

  const data = (await res.json()) as Partial<BuildInfo>;
  if (!data.buildNumber) {
    throw new Error("version.json is missing buildNumber");
  }

  return { buildNumber: data.buildNumber };
}
