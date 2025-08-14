import "./ButtonRipple.css";

import { type MouseEvent, forwardRef, useImperativeHandle, useRef } from "react";

const Ripple = forwardRef((_, ref) => {
  const innerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    createRipple: (event: MouseEvent<HTMLButtonElement>) => {
      const button = event.currentTarget;

      const circle = document.createElement("div");
      const { width, height, left, top } = button.getBoundingClientRect();

      const dia = Math.max(width, height);

      const radius = dia / 2;

      circle.style.width = `${dia}px`;
      circle.style.height = `${dia}px`;
      circle.style.left = `${event.clientX - left - radius}px`;
      circle.style.top = `${event.clientY - top - radius}px`;

      circle.classList.add("ripple");

      const exitRipple = button.querySelector(".ripple");

      if (exitRipple) {
        exitRipple.remove();
      }

      const { current } = innerRef;
      current?.appendChild(circle);
    },
  }));

  return <div ref={innerRef} />;
});

export default Ripple;
