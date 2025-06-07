export default function PageTitle(props: IProps) {
  return (
    <div className={`text-3xl font-semibold ${props.className || ""}`}>
      {props.title}
    </div>
  );
}

interface IProps {
  title: string;
  className?: string; // Added className as an optional prop
}
