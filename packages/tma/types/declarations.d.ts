declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module "*.svg" {
  import type { FunctionComponent, SVGProps } from "react";

  export const ReactComponent: FunctionComponent<
    SVGProps<SVGSVGElement> & { title?: string }
  >;

  const src: string;
  export default src;
}
