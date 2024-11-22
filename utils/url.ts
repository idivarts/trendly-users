export const imageUrl = (image: string | NodeRequire | undefined) => {
  if (
    image &&
    typeof image === "string" &&
    (image.startsWith("http") || image.startsWith("ph://"))
  ) {
    return {
      uri: image,
    };
  } else if (image) {
    return image;
  } else {
    return require("@/assets/images/placeholder-image.jpg");
  }
};
