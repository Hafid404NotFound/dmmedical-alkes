import Link from "next/link";
import { IconType } from "react-icons";
import { twMerge } from "tailwind-merge";

export default function SidebarMenu(props: IProps) {
  const Icon = props.icon;
  return (
    <Link
      href={props.path || ""}
      className={twMerge(
        "group relative rounded-xl py-2.5 px-4 capitalize flex items-center gap-3",
        "text-gray-500 hover:text-gray-800",
        "transition-all duration-200 ease-in-out",
        "hover:bg-primary-main/5 active:bg-primary-main/10",
        props.active && "text-primary-main bg-primary-main/10 font-medium"
      )}
      onClick={props.onClick}
    >
      {/* Highlight indicator */}
      <div
        className={twMerge(
          "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full",
          "transition-all duration-200 ease-in-out",
          "bg-primary-main opacity-0 scale-y-0",
          props.active && "opacity-100 scale-y-100"
        )}
      />

      {/* Icon with highlight effect */}
      <div
        className={twMerge(
          "relative flex items-center justify-center",
          "w-9 h-9 rounded-lg",
          "transition-all duration-200 ease-in-out",
          "group-hover:bg-primary-main/10",
          props.active && "bg-primary-main/20"
        )}
      >
        <Icon className="w-5 h-5" />
      </div>

      {/* Label */}
      <span className="text-sm">{props.label}</span>
    </Link>
  );
}

interface IProps {
  path?: string;
  icon: IconType;
  label: string;
  active?: boolean;
  onClick?: () => void;
}
