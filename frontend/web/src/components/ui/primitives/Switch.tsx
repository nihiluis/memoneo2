import * as SwitchPrimitive from "@radix-ui/react-switch"
import { cx } from "../../../lib/reexports"

import style from "./Switch.module.css"

interface Props extends SwitchPrimitive.SwitchProps {
  className?: string
}

export function Switch(props: Props): JSX.Element {
  const { className, ...rest } = props

  return (
    <SwitchPrimitive.Switch {...rest} className={cx(style.root, className)}>
      <SwitchPrimitive.SwitchThumb className={style.thumb} />
    </SwitchPrimitive.Switch>
  )
}
