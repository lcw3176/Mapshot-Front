import { type PropsWithChildren } from "react";

export type ModalProps = PropsWithChildren<{
  isShow: boolean;
  onClose: () => void;
  hideCloseIcon?: boolean;
  disableAwayClick?: boolean;
}>;
