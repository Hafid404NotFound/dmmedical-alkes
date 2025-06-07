import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export default function DashboardContainer(props: IProps) {
  return (
    <div className="relative">
      {/* Medical-themed decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -left-4 top-1/4 w-24 h-24 bg-blue-100/30 rounded-full blur-xl"></div>
        <div className="absolute -right-4 bottom-1/4 w-24 h-24 bg-green-100/30 rounded-full blur-xl"></div>
      </div>

      {/* Content container with medical styling */}
      <div
        className={twMerge(
          "lg:max-w-5xl lg:mx-auto lg:px-0 px-4 grid gap-10 w-full relative",
          "rounded-xl backdrop-blur-[2px]",
          "before:absolute before:inset-0 before:bg-white/40 before:rounded-xl before:-z-10",
          "after:absolute after:inset-0 after:rounded-xl after:-z-20",
          "after:bg-gradient-to-br after:from-blue-50/50 after:to-green-50/50",
          props.className
        )}
      >
        {/* Medical cross decorative pattern */}
        <div className="absolute -z-10 inset-0 overflow-hidden opacity-[0.02]">
          <div className="absolute top-4 left-8 text-2xl text-primary-main">
            +
          </div>
          <div className="absolute bottom-4 right-8 text-2xl text-secondary-main">
            +
          </div>
          <div className="absolute top-1/2 left-4 text-2xl text-primary-main">
            +
          </div>
          <div className="absolute top-1/2 right-4 text-2xl text-secondary-main">
            +
          </div>
        </div>

        {props.children}
      </div>
    </div>
  );
}
interface IProps {
  children: ReactNode;
  className?: string;
}
