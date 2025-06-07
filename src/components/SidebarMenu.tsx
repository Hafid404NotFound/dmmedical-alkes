import Link from "next/link";
import { IconType } from "react-icons";
import { twMerge } from "tailwind-merge";

export default function SidebarMenu(props: IProps) {
  const Icon = props.icon;
  return (
    <Link
      href={props.path || ""}
      className={twMerge(
        "rounded-md py-2 px-4 capitalize active:border-primary-main border border-transparent flex items-center gap-2 text-gray-500 hover:bg-primary-main/10 duration-200",
        props.active ? "text-primary-dark bg-primary-main/5" : ""
      )}
      onClick={props.onClick}
    >
      <Icon className="text-xl sm:text-2xl" />
      <div>{props.label}</div>
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
