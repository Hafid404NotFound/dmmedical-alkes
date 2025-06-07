import { useEffect, useRef, useState } from "react";
import { useFormikContext } from "formik";
import { twMerge } from "tailwind-merge";
import { motion, AnimatePresence } from "framer-motion";
import { ILabelValue } from "@/types/IlabelValue";
interface IProps {
  label?: string;
  name: string;
  options?: ILabelValue<string>[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  dataCheckingDisable?: string[];
  value?: string;
  onChange?: (value?: string) => void;
  errorMessage?: string;
  labelClassName?: string; // Added prop
  inputClassName?: string; // Added prop
  containerClassName?: string; // Added prop
}

export default function InputAutocompleteOptional(props: IProps) {
  const formik = useFormikContext<any>();
  const [inputLabel, setInputLabel] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<ILabelValue<string>[]>(
    []
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const fieldValue = props.value ?? formik?.values?.[props.name] ?? "";
  const error =
    props.errorMessage ??
    (formik.touched?.[props.name] && formik.errors?.[props.name]);

  useEffect(() => {
    const matched = props.options?.find((opt) => opt.value === fieldValue);
    setInputLabel(matched?.label || fieldValue || "");
  }, [fieldValue, props.options]);

  useEffect(() => {
    if (inputLabel && props.options && props.options.length > 0) {
      const filtered = props.options.filter((opt) =>
        opt.label?.toLowerCase?.().includes(inputLabel?.toLowerCase?.() || "")
      );
      const exists = filtered.some((opt) =>
        opt.label?.toLowerCase?.().includes(inputLabel?.toLowerCase?.() || "")
      );
      if (!exists) {
        filtered.push({ label: inputLabel, value: inputLabel });
      }
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(props.options || []);
    }
  }, [inputLabel, props.options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: ILabelValue<string>) => {
    if (props.dataCheckingDisable?.includes(option.value)) return;

    props.onChange?.(option.value);
    formik?.setFieldValue?.(props.name, option.value);

    setInputLabel(option.label);
    setShowDropdown(false);
  };

  return (
    <div
      className={twMerge("w-full relative", props.containerClassName)}
      ref={containerRef}
    >
      {props.label && (
        <label
          htmlFor={props.name}
          className={twMerge(
            "block mb-1 font-medium text-sm text-gray-700",
            props.labelClassName
          )} // Apply labelClassName
        >
          {props.label}{" "}
          {props.required && <span className="text-red-600">*</span>}
        </label>
      )}
      <input
        type="text"
        name={props.name}
        value={inputLabel}
        onChange={(e) => {
          setInputLabel(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        disabled={props.disabled}
        placeholder={props.placeholder}
        className={twMerge(
          "w-full border rounded-sm px-3 py-2 text-sm outline-none",
          error ? "border-red-500 bg-red-50" : "border-gray-300 bg-white",
          props.disabled && "bg-gray-100 text-gray-400 cursor-not-allowed",
          props.inputClassName // Apply inputClassName
        )}
      />
      {error && <p className="text-xs text-red-600 mt-1">{error as string}</p>}
      <AnimatePresence>
        {showDropdown && filteredOptions.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-sm border border-gray-300 bg-white text-sm shadow-lg"
          >
            {filteredOptions.map((opt) => (
              <li
                key={opt.value}
                className={twMerge(
                  "px-3 py-2 hover:bg-gray-100 cursor-pointer",
                  props.dataCheckingDisable?.includes(opt.value) &&
                    "text-gray-400 cursor-not-allowed"
                )}
                onClick={() => handleSelect(opt)}
              >
                {opt.label}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
