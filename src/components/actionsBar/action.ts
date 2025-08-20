import { IconType } from "react-icons";

export interface Action {
    name: string
    onClick: React.MouseEventHandler<HTMLButtonElement> | undefined
    icon: IconType
    hoverText?: string
}