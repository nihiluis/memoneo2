package expo.modules.enckey

import android.util.Log
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class EnckeyModule : Module() {

  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  override fun definition() = ModuleDefinition {
    Name(ID)

    // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
    Function("ok") {
      "ok"
    }

    // Defines a JavaScript function that always returns a Promise and whose native code
    // is by default dispatched on the different thread than the JavaScript runtime runs on.
    AsyncFunction("createAndStoreKey") { password: String, ctStr: String, ivStr: String ->
      val key = EnckeyDecryption.decryptProtectedKey(password, ctStr, ivStr)

      EnckeyStore.storeKey(key)
    }

    AsyncFunction("encryptText") { text: String ->
      val key = EnckeyStore.retrieveKey() ?: throw NoKeyStoredException()
      return@AsyncFunction try {
        EnckeyEncryption.encryptText(text, key)
      } catch (ex: Exception) {
        Log.e(ID, "Error encrypting text: ${ex.message}", ex)
        
        "error"
      }
    }
  }

  companion object {
    const val ID = "Enckey"
  }
}


class NoKeyStoredException : RuntimeException()
