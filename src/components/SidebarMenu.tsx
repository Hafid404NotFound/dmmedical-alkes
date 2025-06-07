import Link from "next/link";
import { IconType } from "react-icons";
import { twMerge } from "tailwind-merge";

export default function SidebarMenu(props: IProps) {
  const Icon = props.icon;
  return (
    <Link
      href={props.path || ""}
      className={twMerge(
        "group relative rounded-lg py-2.5 px-3.5 flex items-center gap-3", // Adjusted padding and rounding
        "text-slate-600 dark:text-slate-300", // Base text color
        "hover:text-sky-600 dark:hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-800/60", // Hover state
        "transition-all duration-200 ease-in-out",
        props.active &&
          "text-sky-600 dark:text-sky-300 bg-sky-100 dark:bg-sky-700/50 font-semibold" // Active state with font-semibold
      )}
      onClick={props.onClick}
    >
      {/* Highlight indicator */}
      <div
        className={twMerge(
          "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-md", // Adjusted size and shape
          "transition-all duration-300 ease-in-out", // Smoother transition
          "bg-sky-500 dark:bg-sky-400", // Indicator color
          // Subtle indicator visibility on hover for non-active items
          props.active
            ? "opacity-100 scale-y-100"
            : "opacity-0 scale-y-0 group-hover:opacity-30 group-hover:scale-y-50"
        )}
      />

      {/* Icon with background effect */}
      <div
        className={twMerge(
          "relative flex items-center justify-center",
          "w-8 h-8 rounded-md", // Adjusted size and shape
          "transition-all duration-200 ease-in-out",
          "group-hover:bg-sky-100 dark:group-hover:bg-sky-700/50", // Icon background on hover
          props.active && "bg-sky-200/70 dark:bg-sky-600/60" // Icon background on active (slightly transparent)
        )}
      >
        <Icon
          className={twMerge(
            "w-5 h-5 transition-colors", // Icon size and transition
            // Explicit icon coloring for different states
            props.active
              ? "text-sky-600 dark:text-sky-300"
              : "text-slate-500 dark:text-slate-400 group-hover:text-sky-500 dark:group-hover:text-sky-400"
          )}
        />
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
