#!/usr/bin/env node

import { program } from "commander";
import { initCommand } from "./commands/init";
import { syncCommand } from "./commands/sync";
import { scopeCommand } from "./commands/scope";
import { statusCommand } from "./commands/status";
import { exportCommand } from "./commands/export";

program
  .name("cliper")
  .description("AI context doc generator for developers")
  .version("1.1.0");

program
  .command("init")
  .description("Scan project and generate context document")
  .option("-p, --path <path>", "Project root path", process.cwd())
  .action(initCommand);

program
  .command("sync")
  .description("Refresh stale sections of the context document")
  .option("--watch", "Auto-refresh on git events")
  .action(syncCommand);

program
  .command("scope")
  .description("Manage active scope")
  .argument("<action>", "add | remove | watch | list")
  .argument("[path]", "File or directory path")
  .action(scopeCommand);

program
  .command("status")
  .description("Show what is fresh, stale, and in scope")
  .action(statusCommand);

program
  .command("export")
  .description("Print context doc to stdout")
  .option("--format <format>", "Output format: md or txt", "md")
  .action(exportCommand);

program.parse(process.argv);
