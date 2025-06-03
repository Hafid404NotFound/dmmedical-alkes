import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import Divider from "./Divider";

export function Card(props: IProps) {
  return (
    <div className={twMerge("border-2  bg-white rounded-lg", props.className)}>
      {props.children}
    </div>
  );
}

export function CardBody(props: IProps) {
  return (
    <div className={twMerge("p-4 w-full", props.className)}>
      {props.children}
    </div>
  );
}

export function CardTitle(props: IPropsTitle) {
  return (
    <>
      <CardBody>
        <div
          className={twMerge(
            "text-lg capitalize font-semibold",
            props.className
          )}
        >
          {props.title}
        </div>
        {props?.description && (
          <p className={"italic text-gray-600 text-sm"}>{props.description}</p>
        )}
      </CardBody>
      <Divider />
    </>
  );
}

export function CardFooter(props: IPropsFooter) {
  return (
    <>
      <Divider />
      <CardBody>{props.children}</CardBody>
    </>
  );
}
interface IPropsFooter {
  children: ReactNode;
}
interface IPropsTitle {
  title: string;
  description?: string;
  className?: string;
}
interface IProps {
  children: ReactNode;
  className?: string;
}
