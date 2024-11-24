import AudioPlayer from "@/components/audio/AudioPlayer"
import { RecordList } from "@/components/audio/RecordList"
import AuthScreen from "@/components/auth/AuthScreen"
import { PermissionProvider } from "@/components/permission/PermissionProvider"
import { Button } from "@/components/reusables/Button"
import { MText } from "@/components/reusables/MText"
import MView from "@/components/reusables/MView"
import { Separator } from "@/components/reusables/Separator"
import MRootView from "@/components/ui/MRootView"
import { getRecordFile } from "@/lib/audio/file"
import { authAtom } from "@/lib/auth/state"
import { getContentUriAsync } from "expo-file-system"
import { File, Paths } from "expo-file-system/next"
import { startActivityAsync } from "expo-intent-launcher"
import { Stack, useLocalSearchParams } from "expo-router"
import { useCallback, useMemo } from "react"
import { Alert, Platform } from "react-native"
import { isAvailableAsync, shareAsync } from "expo-sharing"

export default function RecordScreen() {
  const { recordId } = useLocalSearchParams()

  const recordFile = useMemo(() => {
    if (!recordId) return null

    return getRecordFile(recordId as string)
  }, [recordId])

  const openRecordExternally = useCallback(async () => {
    if (!recordFile) return

    const available = await isAvailableAsync()
    if (!available) {
      Alert.alert("Error", "Sharing is not available.")
      return
    }

    try {
      console.log("Sharing audio file", recordFile.uri)
      await shareAsync(recordFile.uri, {
        mimeType: "audio/mpeg",
        dialogTitle: "Open audio file",
      })
    } catch (error) {
      console.error("Failed to share record", error)
      Alert.alert("Error", "Failed to share record.")
    }
  }, [recordFile])

  const hasTranscript = !!recordFile?.metadata.transcript

  return (
    <AuthScreen>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <MRootView>
        {!recordFile && (
          <MView className="flex-1">
            <MText className="text-muted-foreground">
              Record not available.
            </MText>
          </MView>
        )}
        {recordFile && (
          <MView className="mt-12 flex-1">
            <MView className="flex-1 gap-4">
              <MText className="text-4xl font-bold">{recordFile.title}</MText>
              <MText className="text-lg text-muted-foreground">
                {hasTranscript
                  ? recordFile.metadata.transcript
                  : "Click on the transcribe button to convert this audio file to text."}
              </MText>
            </MView>
            <MView className="gap-4">
              <AudioPlayer uri={recordFile.uri} />
              <Button
                variant="outline"
                size="lg"
                onPress={openRecordExternally}>
                <MText>Share</MText>
              </Button>
              {!hasTranscript && (
                <Button variant="outline" size="lg">
                  <MText>Transcribe</MText>
                </Button>
              )}
              {hasTranscript && (
                <Button variant="outline" size="lg">
                  <MText>Upload</MText>
                </Button>
              )}
              <Button variant="destructive" size="lg">
                <MText>Delete</MText>
              </Button>
            </MView>
          </MView>
        )}
      </MRootView>
    </AuthScreen>
  )
}
