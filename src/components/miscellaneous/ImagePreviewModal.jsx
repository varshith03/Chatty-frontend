import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Button,
  Image,
  useDisclosure,
  Spinner,
} from "@chakra-ui/react";
import React, { useState } from "react";

const ImagePreviewModal = ({
  fileName,
  setFileName,
  fileUrl,
    setFileUrl,
  uploadImage,
}) => {
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true });
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleClose = () => {
    setFileUrl(null);
    setFileName(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{fileName}</ModalHeader>
        <ModalCloseButton onClick={handleClose} />
        <ModalBody>
          {!imageLoaded && (
            <Spinner size="xl" color="yellow.500" thickness="4px" />
          )}
          <Image
            src={fileUrl}
            alt="Preview"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(false)}
            style={{ display: imageLoaded ? "block" : "none" }}
          />
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="yellow"
            mr={3}
            onClick={() => {
              uploadImage();
              onClose();
            }}
          >
            Send
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ImagePreviewModal;
