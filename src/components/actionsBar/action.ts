import { MouseEventHandler, ReactNode } from "react";

export interface Action {
    name: string
    onClick: MouseEventHandler<HTMLDivElement> | undefined
    icon: ReactNode
}