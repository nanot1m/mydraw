import { ReactNode } from "react";

import "./Island.css";

export function Island(props: { children: ReactNode; className?: string }) {
  return (
    <div className={"Island" + (props.className ? ` ${props.className}` : "")}>
      {props.children}
    </div>
  );
}
