import AuthScreen from "@/components/auth/AuthScreen"
import { Button } from "@/components/reusables/Button"
import { MText } from "@/components/reusables/MText"
import MView from "@/components/reusables/MView"
import MRootView from "@/components/ui/MRootView"
import { authAtom } from "@/lib/auth/state"
import { useSetAtom } from "jotai"

export default function SettingsScreen() {
  const setAuth = useSetAtom(authAtom)

  function signOff() {
    setAuth({
      isAuthenticated: false,
      isLoading: false,
      user: { id: "", mail: "" },
      error: "",
    })
  }

  return (
    <AuthScreen>
      <MRootView>
        <MView className="items-center mb-4">
          <Button size="lg" onPress={signOff}>
            <MText>Sign off</MText>
          </Button>
        </MView>
      </MRootView>
    </AuthScreen>
  )
}
