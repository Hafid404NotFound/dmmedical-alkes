import React, { useEffect, useRef, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";

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
  const [ClassicEditor, setClassicEditor] = useState<any>(undefined);

  useEffect(() => {
    import("@ckeditor/ckeditor5-build-classic").then((mod) => {
      setClassicEditor(() => mod.default);
    });
  }, []);
  const editorRef: any = useRef(undefined);
  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
      ClassicEditor: require("@ckeditor/ckeditor5-build-classic"),
    };
  }, []);

  return (
    <>
      {editorLoaded && ClassicEditor ? (
        <CKEditor
          editor={ClassicEditor as any}
          data={value}
          onChange={(event: any, editor: any) => {
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
      ) : (
        <div>Editor loading</div>
      )}
    </>
  );
}
