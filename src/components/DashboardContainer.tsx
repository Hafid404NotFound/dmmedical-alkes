import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export default function DashboardContainer(props: IProps) {
  return (
    <div
      className={twMerge(
        "lg:max-w-5xl lg:mx-auto lg:px-0 px-4 grid gap-10 w-full",
        props.className
      )}>
      {props.children}
    </div>
  );
}
interface IProps {
  children: ReactNode;
  className?: string;
}
