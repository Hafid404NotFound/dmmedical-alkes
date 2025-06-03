import { twMerge } from "tailwind-merge";
import { ChangeEventHandler, FocusEventHandler, ReactNode } from "react";
import { useFormikContext, FormikErrors, FormikTouched } from "formik";
import LabelInputField from "./LabelInputField";

export default function InputTextarea(props: IProps) {
  const formik = useFormikContext<any>();

  const errors = formik?.errors as FormikErrors<Record<string, any>>;
  const touched = formik?.touched as FormikTouched<Record<string, any>>;

  const errorMessage =
    props.errorMessage ??
    (errors?.[props.name] && touched?.[props.name] ? errors[props.name] : "");

  return (
    <div className="grid gap-1">
      {props.label && (
        <LabelInputField label={props.label} required={props.required} />
      )}
      <div className={twMerge("relative flex bg-white")}>
        {props.startIcon && (
          <span className="absolute left-3 top-3 flex items-start pr-3">
            {props.startIcon}
          </span>
        )}
        <textarea
          data-testid={props.dataTestId}
          autoComplete={props.autoComplete}
          onBlur={props.onBlur ?? formik?.handleBlur}
          onChange={props.onChange ?? formik?.handleChange}
          value={props.value ?? formik?.values?.[props.name] ?? ""}
          name={props.name}
          placeholder={props.placeholder || ""}
          className={twMerge(
            "w-full min-h-[100px] resize-y p-3 duration-300 bg-white outline-2 outline-gray-300 rounded-sm",
            "focus:outline-primary-main focus:bg-primary-main/10",
            props.startIcon ? "pl-9" : "",
            props.endIcon ? "pr-9" : "",
            errorMessage ? "outline-red-500 bg-red-100" : ""
          )}
          id={props.id}
        />
        {props.endIcon && (
          <span className="absolute right-3 top-3 flex items-start pl-3">
            {props.endIcon}
          </span>
        )}
      </div>
      {(errorMessage || props.helperText) && (
        <p
          className={twMerge(
            "text-xs mt-1",
            errorMessage ? "text-red-500" : "text-gray-500"
          )}
        >
          {errorMessage || props.helperText}
        </p>
      )}
    </div>
  );
}

interface IProps {
  id: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  errorMessage?: any;
  helperText?: string;
  name: string;
  value?: string;
  onBlur?: FocusEventHandler<HTMLTextAreaElement>;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  autoComplete?: string;
  dataTestId?: string;
}
