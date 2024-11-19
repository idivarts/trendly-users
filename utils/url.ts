export const imageUrl = (image: string | NodeRequire | undefined) => {
  if (image && typeof image === "string" && image.includes("http")) {
    return {
      uri: image,
    };
  } else if (image) {
    return image;
  } else {
    return require("@/assets/images/placeholder-image.jpg");
  }
};
