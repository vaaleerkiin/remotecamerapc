"use client";

import {
  Box,
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  useDisclosure,
} from "@chakra-ui/react";
import { ReactNode, useRef } from "react";

export const ConfirmAction = ({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) => {
  return (
    <Popover closeOnBlur={false}>
      {({ onClose }) => (
        <>
          <PopoverTrigger>{children}</PopoverTrigger>
          <Portal>
            <PopoverContent w="160px">
              <PopoverArrow />
              <PopoverHeader>Confirm action?</PopoverHeader>
              <PopoverCloseButton />
              <PopoverBody
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Button
                  colorScheme="blue"
                  onClick={() => {
                    onClose();
                    onClick();
                  }}
                >
                  Confirm
                </Button>
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </>
      )}
    </Popover>
  );
};
