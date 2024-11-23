import { Feather } from "@expo/vector-icons"

type FeatherIconProps = {
  name: keyof typeof Feather.glyphMap
  size?: number
  color?: string
}

export function FeatherIcon({
  name,
  size = 24,
  color = "#000",
}: FeatherIconProps) {
  return <Feather name={name} size={size} color={color} />
}
