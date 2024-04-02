const { VITE_APP_CLOUDINARY_URL, VITE_APP_CLOUD_NAME,VITE_APP_CLOUD_PRESET_NAME } = import.meta.env;

export const uploadFileToCloudinary = (file, setLoading, setUploadedFileUrl, toast) => {
    setLoading(true);
    if (!file) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setLoading(false);
      return;
    }
    if (file.type === "image/jpeg" || file.type === "image/png") {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", VITE_APP_CLOUD_PRESET_NAME);
      data.append("cloud_name", VITE_APP_CLOUD_NAME);
      fetch(VITE_APP_CLOUDINARY_URL, {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          // Assuming data.url is the URL of the uploaded image
          console.log(data.url);
          setUploadedFileUrl(data.url);
          setLoading(false);
          toast({
            title: "Photo Uploaded",
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
        })
        .catch((err) => {
          setLoading(false);
          console.error("Error uploading photo:", err);
          toast({
            title: "Error Uploading Photo",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setLoading(false);
      return;
    }
};
