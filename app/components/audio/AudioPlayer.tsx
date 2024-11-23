import { audioAtom } from "@/lib/audio/state"
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio"
import { useAtomValue } from "jotai"
import MView from "../reusables/MView"
import { Button } from "../reusables/Button"
import { FeatherIcon } from "../ui/Icon"
import { useEffect, useState } from "react"

export default function AudioPlayer() {
  const { uri } = useAtomValue(audioAtom)
  const player = useAudioPlayer(uri)
  const playerStatus = useAudioPlayerStatus(player)

  const [playing, setPlaying] = useState(false)
  const [paused, setPaused] = useState(false)

  function startPlayback() {
    setPlaying(true)
    if (paused) {
      setPaused(false)
    } else {
      player.seekTo(0)
    }
    player.play()
  }
  function pausePlayback() {
    setPlaying(false)
    setPaused(true)
    player.pause()
  }

  useEffect(() => {
    if (playing && !playerStatus.playing) {
      setPlaying(false)
      setPaused(false)
    }
  }, [playerStatus.playing])

  if (!uri) {
    return null
  }

  return (
    <MView className="flex flex-row gap-4 justify-center">
      <Button
        size="iconLg"
        onPress={playing ? pausePlayback : startPlayback}>
        {(!playing || paused) && <FeatherIcon size={24} name="play-circle" />}
        {playing && <FeatherIcon size={24} name="pause-circle" />}
      </Button>
    </MView>
  )
}
