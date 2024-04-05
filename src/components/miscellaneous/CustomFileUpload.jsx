import { Box, Input, Text, Center, Icon, Image } from "@chakra-ui/react";
import { AttachmentIcon } from "@chakra-ui/icons";
import { useRef, useState } from "react";

const CustomFileUpload = ({ profile_pic, onChange }) => {
  const fileInputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    const files = e.dataTransfer.files;

    if (files.length > 0) {
      const file = files[0];

      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          console.log(file);
          setImagePreview(reader.result);
          onChange(file); // Pass both e and file here
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
        onChange(file);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box
      width="100%"
      border="1px dashed"
      borderColor="gray.300"
      borderRadius="md"
      p={4}
      textAlign="center"
      style={{ cursor: "pointer" }}
      position="relative"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current.click()}
    >
      <Input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileInput}
        display="none"
        id="file-upload"
      />
      {imagePreview || profile_pic ? (
        <Image
          src={imagePreview || profile_pic}
          alt="Uploaded Image"
          maxH="200px"
          mx="auto"
        />
      ) : (
        <Center flexDirection="column">
          <Icon
            as={AttachmentIcon}
            boxSize={8}
            color="gray.500"
            mb={2}
            cursor="pointer"
          />
          <Text fontSize="sm" color="gray.500">
            {dragging
              ? "Drop files here"
              : "Click or drop files here to upload"}
          </Text>
        </Center>
      )}
    </Box>
  );
};

export default CustomFileUpload;
