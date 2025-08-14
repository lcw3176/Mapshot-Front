import { type MouseEvent } from "react";

import type { UseClickAwayModalCallback } from "./useAwayClickModal.type";

const useClickAwayModal = (onClose: UseClickAwayModalCallback) => {
  const handleCloseModal = ({ target, currentTarget }: MouseEvent) => {
    if (target !== currentTarget) {
      return;
    }

    onClose();
  };

  return handleCloseModal;
};

export default useClickAwayModal;
