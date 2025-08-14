import { type MouseEvent, useRef } from "react";

import type { ButtonProps } from "./Button.type";
import { ButtonRipple } from "./components";

import { motion } from "motion/react";
import { twMerge } from "tailwind-merge";

const Button = ({ children, onClick, className, ...rest }: ButtonProps) => {
  const rippleRef = useRef<{
    createRipple: (event: MouseEvent<HTMLButtonElement>) => void;
  }>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    const { current } = rippleRef;

    if (current) {
      current.createRipple(event);
    }

    if (!onClick) return;
    onClick(event);
  };

  return (
    <motion.button
      className={twMerge(
        "relative text-[1.6rem] font-semibold border-2 border-none rounded-[0.6rem] py-[1rem] px-[1.2rem] overflow-hidden cursor-pointer select-none",
        className,
      )}
      onClick={handleClick}
      whileTap={{ scale: "0.98" }}
      {...rest}>
      {children}
      <ButtonRipple ref={rippleRef} />
    </motion.button>
  );
};

export default Button;
