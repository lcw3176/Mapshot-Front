import { useMemo } from "react";

const useModalVariant = () => {
  const backgroundVariant = useMemo(
    () => ({
      close: {
        opacity: 0,
      },
      show: {
        opacity: 1,
      },
    }),
    [],
  );

  const modalVariant = useMemo(
    () => ({
      close: {
        opacity: 0,
        scale: 0,
      },
      show: {
        opacity: 1,
        scale: 1,
      },
    }),
    [],
  );

  return {
    backgroundVariant,
    modalVariant,
  };
};

export default useModalVariant;
