import Image, { ImageProps } from "next/image"
import logoSrc from "../../../public/logo.svg"

export default function Logo(props: Partial<ImageProps>): JSX.Element {
  return <Image {...props} src={logoSrc} />
}
