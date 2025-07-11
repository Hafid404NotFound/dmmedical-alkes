"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

// Dynamically import CKEditor to avoid SSR issues
const InputEditor = dynamic(() => import("./CKeditor"), {
  ssr: false,
  loading: () => (
    <div className="border border-gray-300 rounded-lg p-4 h-32 flex items-center justify-center bg-gray-50">
      <div className="flex items-center gap-2 text-gray-500">
        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        <span>Loading editor...</span>
      </div>
    </div>
  ),
});

interface SafeCKEditorProps {
  name: string;
  onChange: (content: string) => void;
  value?: string;
}

export default function SafeCKEditor({
  name,
  onChange,
  value = "",
}: SafeCKEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="border border-gray-300 rounded-lg p-4 h-32 flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-2 text-gray-500">
          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading editor...</span>
        </div>
      </div>
    );
  }

  return (
    <InputEditor
      editorLoaded={true}
      name={name}
      onChange={onChange}
      value={value}
    />
  );
}
