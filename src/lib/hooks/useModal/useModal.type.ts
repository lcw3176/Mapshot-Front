export interface UseModalParams {
  initialIsOpen?: boolean;
  disabledEscapeKey?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}
