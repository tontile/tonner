"use client";

import {
  type ChangeEvent,
  type InputHTMLAttributes,
  useEffect,
  useState,
} from "react";
import styles from "./color-input.module.css";

import { classNames } from "@/helpers";
import { callMultiple } from "@/helpers";
import { usePlatform } from "@/hooks";

import { FormInput, type FormPublicProps } from "@/components/form/form-input";
import { VisuallyHidden } from "@/components/service/visually-hidden";
import { Subheadline } from "@/components/typography/subheadline";
import { Text } from "@/components/typography/text";

export interface ColorInputProps
  extends Omit<FormPublicProps, "after">,
    InputHTMLAttributes<HTMLInputElement> {}

/**
 * Renders a color picker input within a form structure, displaying the selected color value.
 * It adapts the text style based on the platform and supports additional properties like header and status.
 */
export const ColorInput = ({
  header,
  before,
  status,
  value: valueProp,
  defaultValue,
  className,
  onChange: onChangeProp,
  ...restProps
}: ColorInputProps) => {
  const platform = usePlatform();
  const [value, setValue] = useState(valueProp || defaultValue || "#EFEFF4");

  useEffect(() => {
    if (!valueProp) {
      return;
    }

    setValue(valueProp);
  }, [valueProp]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const TypographyComponent = platform === "ios" ? Text : Subheadline;
  return (
    <FormInput
      header={header}
      before={before}
      after={
        <div className={styles.circle}>
          <VisuallyHidden
            Component="input"
            type="color"
            value={value}
            onChange={callMultiple(onChange, onChangeProp)}
            {...restProps}
          />
          <div
            className={styles.circleColor}
            style={{ backgroundColor: String(value) }}
          />
        </div>
      }
      status={status}
      className={classNames(
        styles.wrapper,
        platform === "ios" && styles["wrapper--ios"],
        className,
      )}
    >
      <TypographyComponent caps className={styles.text}>
        {value}
      </TypographyComponent>
    </FormInput>
  );
};
