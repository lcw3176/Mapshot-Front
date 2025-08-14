import { CloseIcon } from "../Icon";
import type { ModalProps } from "./Modal.type";
import { ModalPortal } from "./components";
import { useClickAwayModal, useKeydownModal, useModalVariant } from "./hooks";

import { AnimatePresence, motion } from "motion/react";
import { twMerge } from "tailwind-merge";

const Modal = ({ isShow, onClose, hideCloseIcon = false, disableAwayClick = false, children }: ModalProps) => {
  useKeydownModal({ isShow, onClose, disableAwayClick });

  const awayClose = useClickAwayModal(onClose);

  const { modalVariant, backgroundVariant } = useModalVariant();

  return (
    <AnimatePresence>
      {isShow && (
        <ModalPortal isShow={isShow}>
          <motion.section
            className="w-full h-full flex items-center justify-center fixed top-0 left-0 bg-transparent_90 overflow-auto z-modal"
            onClick={e => !disableAwayClick && awayClose(e)}
            variants={backgroundVariant}
            initial="close"
            animate="show"
            exit="close">
            <motion.article
              className={twMerge(
                "min-h-[4rem] min-w-[4rem] p-[1rem] flex justify-end relative bg-white rounded-[0.8rem]",
                !hideCloseIcon && "pt-[3.2rem]",
              )}
              variants={modalVariant}
              initial="close"
              animate="show"
              exit="close">
              {!hideCloseIcon && (
                <motion.i
                  onClick={onClose}
                  className="w-[2rem] h-[2rem] absolute top-[0.6rem] cursor-pointer select-none"
                  whileTap={{
                    scale: 1.2,
                  }}
                  whileHover={{
                    opacity: 0.4,
                  }}>
                  <CloseIcon size="100%" />
                </motion.i>
              )}
              {children}
            </motion.article>
          </motion.section>
        </ModalPortal>
      )}
    </AnimatePresence>
  );
};

export default Modal;
