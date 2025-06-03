export default function PageTitle(props: IProps) {
  return <div className="text-3xl font-semibold">{props.title}</div>;
}

interface IProps {
  title: string;
}
