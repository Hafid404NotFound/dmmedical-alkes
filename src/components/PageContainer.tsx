import { ReactNode } from "react";

export default function PageContainer(props: IProps) {
  return (
    <div className="lg:w-6xl lg:max-w-6xl lg:mx-auto px-3">
      {props.children}
    </div>
  );
}

interface IProps {
  children: ReactNode;
}
