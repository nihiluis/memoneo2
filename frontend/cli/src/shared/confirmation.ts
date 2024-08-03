import { input } from "@inquirer/prompts"
import { Command } from "@oclif/core"

export async function promptConfirmation(command: Command) {
  const confirmAnswer = (await input({ message: "Are you sure? y/n" })) || "n"
  if (confirmAnswer.toLowerCase() !== "y") {
    command.exit()
  }
}
