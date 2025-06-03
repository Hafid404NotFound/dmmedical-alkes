interface CKEditorPreviewProps {
  content: string;
}

const CKEditorPreview = (props: CKEditorPreviewProps) => {
  return (
    <div
      className={"ck-content"}
      dangerouslySetInnerHTML={{ __html: props.content }}
    ></div>
  );
};

export default CKEditorPreview;
