import { type ButtonHTMLAttributes, type DetailedHTMLProps } from "react";

import { type MotionProps } from "motion/react";

export type ButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & MotionProps;
