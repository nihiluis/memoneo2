import {
  AudioModule,
  RecordingPresets,
  useAudioPlayer,
  useAudioRecorder,
} from "expo-audio"
import { useEffect, useState } from "react"
import { Alert } from "react-native"
import MView from "../reusables/MView"
import { Button } from "../reusables/Button"
import { MText } from "../reusables/MText"
import { atom, useAtom, useSetAtom } from "jotai"
import { FeatherIcon } from "../ui/Icon"
import { audioAtom } from "@/lib/audio/state"

export default function AudioRecorder() {
  const [permissionGranted, setPermissionGranted] = useState(false)

  useEffect(() => {
    ;(async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync()
      if (!status.granted) {
        Alert.alert("Permission to access microphone was denied")
      }
      setPermissionGranted(status.granted)
    })()
  }, [])

  if (!permissionGranted) {
    return null
  }

  return <AudioRecorderInner />
}

function AudioRecorderInner() {
  const setAudioState = useSetAtom(audioAtom)
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY)
  const [recording, setRecording] = useState(false)
  const [paused, setPaused] = useState(false)

  const record = async () => {
    // fresh
    if (!paused) {
      setAudioState({ uri: "" })
      await audioRecorder.prepareToRecordAsync()
    }
    audioRecorder.record()

    if (paused) {
      setPaused(false)
    }
    setRecording(true)
  }

  const stopRecording = async () => {
    // The recording will be available on `audioRecorder.uri`.
    await audioRecorder.stop()
    setRecording(false)
    setPaused(false)
    setAudioState({ uri: audioRecorder.uri ?? "" })
  }

  const pauseRecording = async () => {
    if (!recording) {
      return
    }

    audioRecorder.pause()
    setRecording(false)
    setPaused(true)
  }

  return (
    <MView className="flex flex-row gap-4 justify-center">
      <Button
        size="iconLg"
        onPress={recording || paused ? stopRecording : record}>
        {!recording && !paused && <FeatherIcon size={24} name="mic" />}
        {(recording || paused) && <FeatherIcon size={24} name="stop-circle" />}
      </Button>
      <Button
        size="iconLg"
        onPress={paused ? record : pauseRecording}
        disabled={!recording && !paused}>
        {!paused && <FeatherIcon size={24} name="pause-circle" />}
        {paused && <FeatherIcon size={24} name="play-circle" />}
      </Button>
    </MView>
  )
}
