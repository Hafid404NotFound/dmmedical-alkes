"use client";
import { JSX, ReactNode, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";

export default function PopupModal(props: IProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && props.onClose) {
        props.onClose();
      }
    }

    if (props.open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = ""; // Ensure cleanup
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [props.open, props.onClose]);

  function handleBackdropClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget && props.onClose) {
      props.onClose();
    }
  }

  return (
    <AnimatePresence>
      {props.open && (
        <motion.div
          className="h-screen w-screen fixed top-0 left-0 flex items-center justify-center bg-black/20 backdrop-blur-[4px] z-[999]"
          onClick={handleBackdropClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {props.children || props.component || null}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface IProps {
  children?: ReactNode;
  component?: JSX.Element;
  onClose?: () => void;
  open?: boolean;
}
