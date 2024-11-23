import AudioPlayer from "@/components/audio/AudioPlayer"
import AudioRecorder from "@/components/audio/AudioRecorder"
import AuthScreen from "@/components/auth/AuthScreen"
import { FormInput } from "@/components/form/FormInput"
import Logo from "@/components/Logo"
import { Button } from "@/components/reusables/Button"
import { Input } from "@/components/reusables/Input"
import { MText } from "@/components/reusables/MText"
import MView from "@/components/reusables/MView"
import { FeatherIcon } from "@/components/ui/Icon"
import MRootView from "@/components/ui/MRootView"
import { audioAtom } from "@/lib/audio/state"
import { useAtomValue } from "jotai"
import { useForm } from "react-hook-form"

export default function HomeScreen() {
  const audioState = useAtomValue(audioAtom)

  return (
    <AuthScreen>
      <MRootView>
        <MView className="items-center mb-4">
          <Logo width={128} height={128} />
        </MView>
        <MView className="mb-8">
          <MText className="text-xl text-muted-foreground text-center">
            Finalize the recording.
          </MText>
        </MView>
        {!audioState.uri && <AudioRecorder />}
        {audioState.uri && (
          <MView className="">
            <MView className="flex-row justify-center gap-4 mb-8">
              <AudioPlayer />
              <Button size="iconLg">
                <FeatherIcon size={24} name="trash-2" />
              </Button>
            </MView>
            <RecordForm />
            <Button size="lg">
              <MText>Save</MText>
            </Button>
          </MView>
        )}
      </MRootView>
    </AuthScreen>
  )
}

type RecordFormData = {
  title: string
}

function RecordForm() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RecordFormData>({
    defaultValues: {
      title: "",
    },
  })

  return (
    <MView>
      <FormInput
        control={control}
        name="title"
        label="Title"
        placeholder=""
        autoCapitalize="none"
        error={errors.title?.message}
      />
    </MView>
  )
}
