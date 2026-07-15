export type BuildInfo = {
  buildNumber: string;
};

export async function fetchBuildInfo(timeoutMs = 4000): Promise<BuildInfo> {
  const signal =
    typeof AbortSignal !== "undefined" && "timeout" in AbortSignal
      ? AbortSignal.timeout(timeoutMs)
      : undefined;

  const res = await fetch("/version.json", { cache: "no-store", signal });
  if (!res.ok) {
    throw new Error(`version.json returned ${res.status}`);
  }

  const data = (await res.json()) as Partial<BuildInfo>;
  if (!data.buildNumber) {
    throw new Error("version.json is missing buildNumber");
  }

  return { buildNumber: data.buildNumber };
}
