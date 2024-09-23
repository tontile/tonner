"use client";

import { Children, type HTMLAttributes, type ReactNode } from "react";
import styles from "./section.module.css";

import { classNames } from "@/helpers";
import { isPrimitiveReactNode } from "@/helpers/react";
import { usePlatform } from "@/hooks";

import { Divider } from "@/components/misc/divider";
import { SectionFooter } from "./section-footer";
import { SectionHeader } from "./section-header";

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  /**
   * The content for the section header. If a string is passed, `Section.Header` is automatically used.
   * For more control or a large title, use `<Section.Header large>{headerText}</Section.Header>`.
   */
  header?: ReactNode;
  /**
   * The content for the section footer. If a string is passed, `Section.Footer` is automatically used.
   * For a centered footer, use `<Section.Footer centered>{footerText}</Section.Footer>`.
   */
  footer?: ReactNode;
}

/**
 * Organizes content into distinct sections with optional headers and footers. It automatically wraps
 * primitive header and footer content in the appropriate sub-components, and inserts dividers between
 * children when rendering multiple elements.
 */
export const Section = ({
  header,
  footer,
  className,
  children,
  ...restProps
}: SectionProps) => {
  const platform = usePlatform();

  const headerWithWrapper = isPrimitiveReactNode(header) ? (
    <SectionHeader>{header}</SectionHeader>
  ) : (
    header
  );
  const footerWithWrapper = isPrimitiveReactNode(footer) ? (
    <SectionFooter>{footer}</SectionFooter>
  ) : (
    footer
  );

  return (
    <section
      className={classNames(
        styles.wrapper,
        platform === "base" && styles["wrapper--base"],
        platform === "ios" && styles["wrapper--ios"],
        className,
      )}
      {...restProps}
    >
      <div className={styles.bodyWithHeader}>
        {headerWithWrapper}
        <div className={styles.body}>
          {Children.map(children, (child, index) => (
            <>
              {child}
              {index < Children.count(children) - 1 && (
                <Divider className={styles.divider} />
              )}
            </>
          ))}
        </div>
      </div>
      {footerWithWrapper}
    </section>
  );
};

Section.Header = SectionHeader;
Section.Footer = SectionFooter;
