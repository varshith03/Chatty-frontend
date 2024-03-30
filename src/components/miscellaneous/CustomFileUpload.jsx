import { Box, Input, Text, Center, Icon } from "@chakra-ui/react";
import { AttachmentIcon } from "@chakra-ui/icons";

const CustomFileUpload = ({ onChange }) => {
  return (
    <Box
      width="100%"
      border="1px dashed"
      borderColor="gray.300"
      borderRadius="md"
      p={4}
      textAlign="center"
      cursor="pointer"
    >
      <Input
        type="file"
        multiple
        onChange={onChange}
        display="none"
        id="file-upload"
      />
      <label htmlFor="file-upload">
        <Center flexDirection="column">
          <Icon
            as={AttachmentIcon}
            boxSize={8}
            color="gray.500"
            mb={2}
            cursor="pointer"
          />
          <Text fontSize="sm" color="gray.500">
            Click or drop files here to upload
          </Text>
        </Center>
      </label>
    </Box>
  );
};

export default CustomFileUpload;
