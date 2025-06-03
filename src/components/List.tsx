"use client";
import * as React from "react";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { Card, CardBody } from "./Card";

export function ListGroup(props: IPropsGroup) {
  return (
    <Card>
      <CardBody className={"p-1 grid gap-1  min-w-[140px] "}>
        <div className={"cursor-pointer"}>{props.children}</div>
      </CardBody>
    </Card>
  );
}

export function ListItem(props: IPropsItem) {
  return (
    <div
      {...props}
      onClick={props.onClick && props.onClick}
      className={twMerge(
        " rounded-md py-2 px-4 capitalize active:border-primary-main/20 border border-transparent flex items-center gap-2 text-gray-500 hover:bg-primary-main/10 duration-200",
        props.active ? "text-primary-light" : "",
        props?.className
      )}
    >
      {props.icon && props.icon}
      <div>{props.label}</div>
    </div>
  );
}

interface IPropsItem {
  label: string;
  icon?: ReactNode;
  active?: boolean;
  className?: string;
  onClick?: () => void;
}

interface IPropsGroup {
  children?: React.ReactNode;
}
