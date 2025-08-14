import { useCallback, useEffect, useState } from "react";

import type { UseModalParams } from "./useModal.type";

const useModal = ({ initialIsOpen = false, disabledEscapeKey = false, onOpen, onClose }: UseModalParams = {}) => {
  const [isOpen, setIsOpen] = useState(initialIsOpen);

  const openModal = useCallback(() => {
    setIsOpen(true);

    if (onOpen) {
      onOpen();
    }
  }, [onOpen]);

  const closeModal = useCallback(() => {
    setIsOpen(false);

    if (onClose) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (!isOpen || disabledEscapeKey) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, disabledEscapeKey, closeModal]);

  return [isOpen, openModal, closeModal] as const;
};

export default useModal;
