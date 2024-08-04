import { Command } from "@oclif/core"
import loadPrerequisites from "../../shared/loadPrerequisites.js"
import { password as passwordInput } from "@inquirer/prompts"
import { apiChangePassword, apiLogin, apiSaveKey } from "../../lib/auth.js"
import { writeToken } from "../../lib/token.js"
import { performLogin } from "../../shared/login.js"

export default class ChangePassword extends Command {
  static description = "Delete notes"

  static examples = []

  static flags = {}

  static args = {}

  async run(): Promise<void> {
    const { args } = await this.parse(ChangePassword)

    const { config, auth, key, internalConfig, cache, gqlClient } =
      await loadPrerequisites()

    const firstPassword = await passwordInput({
      message: "Enter your new password.",
    })
    const secondPassword = await passwordInput({
      message: "Confirm the password.",
    })

    if (firstPassword !== secondPassword) {
      this.error("Passwords are not the same.")
    }

    const { token: newToken, error, errorMessage } = await apiChangePassword(
      auth.token,
      firstPassword
    )
    if (error) {
      this.log(errorMessage)
      this.error("Unable to change password on remote.")
    }

    const { token, errorMessage: loginErrorMessage } = await apiLogin(auth.mail, firstPassword)
    if (loginErrorMessage) {
      this.log(loginErrorMessage)
      this.error("Unable to login with new password.")
    }

    // What happens if the password is changed but the key cannot be saved?
    const { error: saveKeyError } = await apiSaveKey(token, firstPassword, key)
    if (saveKeyError) {
      // Would need to rollback to old password.
      this.log(saveKeyError)
      this.error("Updated key could not be saved to remote.")
    }

    await writeToken(newToken)
    this.log("Updated password and key on remote.")
  }
}
