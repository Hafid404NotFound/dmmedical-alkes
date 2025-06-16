import { twMerge } from "tailwind-merge";

function Skeleton(props: IProps) {
  return (
    <div
      className={twMerge(
        "bg-slate-200 animate-pulse rounded-lg",
        props.className
      )}
    ></div>
  );
}

interface IProps {
  className?: string;
}

export default Skeleton;
