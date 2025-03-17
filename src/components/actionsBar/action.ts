import { IconType } from "react-icons";

export interface Action {
    name: string
    onClick: React.MouseEventHandler<HTMLDivElement> | undefined
    icon: IconType
    hoverText?: string
}