import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export default function Button(props: IProps) {
  const baseStyle =
    "py-2 text-white rounded-md px-5 cursor-pointer duration-200";

  const variantStyle =
    props.variant === "secondary"
      ? "bg-gradient-to-b from-primary-main to-secondary-main hover:bg-secondary-dark active:bg-secondary-light"
      : "bg-primary-main hover:bg-primary-dark active:bg-primary-light";

  return (
    <button
      onClick={props.onClick}
      className={twMerge(
        baseStyle,
        variantStyle,
        props.className,
        "font-bold "
      )}
    >
      {props.loading ? "Loading" : props.children}
    </button>
  );
}

interface IProps {
  children: ReactNode;
  loading?: boolean;
  className?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
}
