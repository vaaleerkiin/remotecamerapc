"use client";

import {
  useDisclosure,
  Button,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Modal as CreateModal,
  Portal,
  Tooltip,
} from "@chakra-ui/react";
import { ReactNode } from "react";

export const Modal = ({
  children,
  header,
  buttonText,
  disabled,
  tooltipLabel,
}: {
  children: ReactNode;
  header: ReactNode;
  buttonText: string;
  disabled: boolean;
  tooltipLabel: string;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Tooltip hasArrow label={tooltipLabel} isDisabled={!disabled}>
        <Button onClick={onOpen} colorScheme="green" isDisabled={disabled}>
          {buttonText}
        </Button>
      </Tooltip>
      <CreateModal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{header}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{children}</ModalBody>
        </ModalContent>
      </CreateModal>
    </>
  );
};
