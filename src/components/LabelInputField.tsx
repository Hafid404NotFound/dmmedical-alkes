import { twMerge } from "tailwind-merge";

function LabelInputField(props: IProps) {
  return (
    <label
      className={twMerge(
        "mb-1 text-sm font-medium text-gray-700",
        props.className
      )}
    >
      {props.label}
      {props.required && <span className={"text-red-700"}> *</span>}
    </label>
  );
}

export default LabelInputField;

interface IProps {
  required?: boolean;
  label: string;
  className?: string; // Added className prop
}
