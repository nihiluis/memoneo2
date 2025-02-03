import { input } from "@inquirer/prompts"
import { Command } from "@oclif/core"

export async function promptConfirmation(command: Command, textMessage: string = "") {
  const baseTextMessage = textMessage ?? "Are you sure?"
  const confirmAnswer = (await input({ message: baseTextMessage + " y/n" })) || "n"
  if (confirmAnswer.toLowerCase() !== "y") {
    command.exit()
  }
}
