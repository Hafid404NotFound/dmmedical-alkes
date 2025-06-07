"use client";

import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

interface CKeditorProps {
  onChange: (data: string) => void;
  editorLoaded: boolean;
  name: string;
  value: string;
}

export default function InputEditor({
  onChange,
  editorLoaded,
  value,
}: CKeditorProps) {
  if (!editorLoaded) {
    return <div>Editor loading</div>;
  }

  return (
    <CKEditor
      editor={ClassicEditor as any}
      data={value}
      onChange={(_event: any, editor: any) => {
        const data = editor.getData();
        onChange(data);
      }}
      config={{
        toolbar: [
          "heading",
          "|",
          "bold",
          "italic",
          "link",
          "bulletedList",
          "numberedList",
          "blockQuote",
        ],
      }}
    />
  );
}
