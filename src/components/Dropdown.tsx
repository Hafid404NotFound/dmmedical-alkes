"use client";
import { ReactNode, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IProps {
  toggle: ReactNode;
  children: ReactNode;
  setOpen?: (isOpen: boolean) => void;
  position?: "top" | "bottom" | "left" | "right";
}

export default function Dropdown({
  toggle,
  children,
  position = "bottom",
  setOpen,
}: IProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (setOpen) {
      setOpen(isOpen);
    }
  }, [isOpen]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const getPositionClasses = () => {
    switch (position) {
      case "top":
        return "bottom-full mb-2 right-0";
      case "left":
        return "right-full mr-2 top-0";
      case "right":
        return "left-full ml-2 top-0";
      case "bottom":
      default:
        return "mt-2 right-0";
    }
  };

  return (
    <div className="relative z-20" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {toggle}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            onClick={() => setIsOpen(false)}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className={`absolute ${getPositionClasses()} bg-white shadow-lg rounded-md`}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
