"use client";

import { type InputHTMLAttributes, forwardRef } from "react";
import styles from "./input.module.css";

import { classNames } from "@/helpers";
import { usePlatform } from "@/hooks";

import { FormInput, type FormPublicProps } from "@/components/form/form-input";
import { Subheadline } from "@/components/typography/subheadline";
import { Text } from "@/components/typography/text";

export interface InputProps
  extends FormPublicProps,
    InputHTMLAttributes<HTMLInputElement> {}

/**
 * Renders a text input field with enhanced styling and integration into a form structure. Supports customization through `FormPublicProps` and standard input attributes.
 * It automatically adapts typography and layout based on the platform, ensuring a consistent user experience across devices.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "text",
      header,
      before,
      after,
      status,
      className,
      disabled,
      ...restProps
    },
    ref,
  ) => {
    const platform = usePlatform();

    const TypographyComponent = platform === "ios" ? Text : Subheadline;
    return (
      <FormInput
        header={header}
        before={before}
        after={after}
        status={status}
        disabled={disabled}
        className={classNames(
          styles.wrapper,
          platform === "ios" && styles["wrapper--ios"],
          className,
        )}
      >
        <TypographyComponent
          ref={ref}
          Component="input"
          className={styles.input}
          type={type}
          disabled={disabled}
          {...restProps}
        />
      </FormInput>
    );
  },
);
