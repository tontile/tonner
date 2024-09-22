import { type InputHTMLAttributes, forwardRef } from "react";
import styles from "./PinInputCell.module.css";

import { classNames } from "@/helpers/classNames";
import { usePlatform } from "@/hooks/usePlatform";

import { VisuallyHidden } from "@/components/service/VisuallyHidden";

export interface PinInputCellProps
  extends InputHTMLAttributes<HTMLInputElement> {
  isTyped?: boolean;
}

export const PinInputCell = forwardRef<HTMLLabelElement, PinInputCellProps>(
  ({ isTyped, ...restProps }, ref) => {
    const platform = usePlatform();
    const isIOS = platform === "ios";

    return (
      <label
        ref={ref}
        className={classNames(
          styles.wrapper,
          isIOS && styles["wrapper--ios"],
          isTyped && styles["wrapper--typed"],
        )}
      >
        <VisuallyHidden
          Component="input"
          type="number"
          maxLength={1}
          className={styles.input}
          {...restProps}
        />
        {isTyped && !isIOS && <div className={styles.dot} />}
      </label>
    );
  },
);
