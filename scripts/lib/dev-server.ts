import { spawnSync } from "node:child_process";

type DevServerCommand = {
  args: string[];
  command: string;
};

function hasWorkingBinary(command: string): boolean {
  const result = spawnSync(command, ["--version"], {
    stdio: "ignore",
  });

  return result.status === 0;
}

export function resolveDevServerCommand(port: number): DevServerCommand {
  if (process.execPath.includes("bun") || hasWorkingBinary("bun")) {
    return {
      command: process.execPath.includes("bun") ? process.execPath : "bun",
      args: ["run", "dev", "--", "--hostname", "127.0.0.1", "--port", String(port)],
    };
  }

  return {
    command: process.platform === "win32" ? "npm.cmd" : "npm",
    args: ["run", "dev", "--", "--hostname", "127.0.0.1", "--port", String(port)],
  };
}
