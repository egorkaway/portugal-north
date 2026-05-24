/** WebMCP (https://webmachinelearning.github.io/webmcp/) — browser-exposed tools for agents. */

export type JsonSchemaObject = Record<string, unknown>;

export type ModelContextTool = {
  name: string;
  title?: string;
  description: string;
  inputSchema?: JsonSchemaObject;
  execute: (input: Record<string, unknown>) => Promise<unknown> | unknown;
  annotations?: {
    readOnlyHint?: boolean;
    untrustedContentHint?: boolean;
  };
};

export type ModelContext = {
  registerTool: (
    tool: ModelContextTool,
    options?: { signal?: AbortSignal },
  ) => void;
};

export type NavigatorWithModelContext = Navigator & {
  modelContext?: ModelContext;
};
