import { twMerge } from "tailwind-merge";
import {
  ChangeEventHandler,
  FocusEventHandler,
  HTMLInputTypeAttribute,
  ReactNode,
} from "react";
import { useFormikContext, FormikErrors, FormikTouched } from "formik";
import LabelInputField from "./LabelInputField";

export default function InputText(props: IProps) {
  const formik = useFormikContext<any>();

  const errors = formik?.errors as FormikErrors<Record<string, any>>;
  const touched = formik?.touched as FormikTouched<Record<string, any>>;

  const errorMessage =
    props.errorMessage ??
    (errors?.[props.name] && touched?.[props.name] ? errors[props.name] : "");

  return (
    <div className={twMerge("grid gap-1", props.containerClassName)}>
      {props.label && (
        <LabelInputField
          label={props.label}
          required={props.required}
          className={props.labelClassName}
        />
      )}
      <div className={twMerge("relative flex items-center bg-white")}>
        {props.startIcon && (
          <span className="absolute left-3 flex items-center pr-3">
            {props.startIcon}
          </span>
        )}
        <input
          data-testid={props.dataTestId}
          autoComplete={props.autoComplete}
          onBlur={props.onBlur ?? formik?.handleBlur}
          onChange={props.onChange ?? formik?.handleChange}
          value={props.value ?? formik?.values?.[props.name] ?? ""}
          name={props.name}
          onKeyDown={(e) => {
            if (e.key === "Enter" && props.onEnter) {
              props.onEnter();
            }
          }}
          type={props.type || "text"}
          placeholder={props.placeholder || ""}
          className={twMerge(
            "h-field-height px-3 w-full duration-300 bg-white outline-2 outline-gray-300 rounded-sm",
            "focus:outline-primary-main focus:bg-primary-main/10 ",
            props.startIcon ? "pl-9" : "",
            props.endIcon ? "pr-9" : "",
            errorMessage ? " outline-red-500 bg-red-100" : "",
            props.inputClassName // Apply inputClassName
          )}
          id={props.id}
        />
        {props.endIcon && (
          <span className="absolute right-3 flex items-center pl-3">
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
  type?: HTMLInputTypeAttribute;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  onEnter?: () => void;
  errorMessage?: any;
  helperText?: string;
  name: string;
  value?: string;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  autoComplete?: string;
  dataTestId?: string;
  labelClassName?: string; // Added prop
  inputClassName?: string; // Added prop
  containerClassName?: string; // Added prop
}

// Also need to update LabelInputField to accept and use className
// Assuming LabelInputField.tsx is in the same directory or accessible via path
// This change is for LabelInputField.tsx
/*
import { twMerge } from "tailwind-merge";

interface LabelInputFieldProps {
  label: string;
  required?: boolean;
  className?: string; // Added className prop
}

export default function LabelInputField({
  label,
  required,
  className,
}: LabelInputFieldProps) {
  return (
    <label htmlFor={label} className={twMerge("block font-medium text-sm text-gray-700", className)}>
      {label} {required && <span className="text-red-600">*</span>}
    </label>
  );
}
*/
