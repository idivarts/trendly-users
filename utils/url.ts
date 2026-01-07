export const imageUrl = (image: string | NodeRequire | undefined) => {
    if (
        image &&
        typeof image === "string" &&
        (image.startsWith("http") || image.startsWith("ph://") || image.startsWith("file://"))
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

export const queryParams = (
    params: Partial<Record<string, string | string[]>>
) => {
    let values: string[] = [];

    Object.entries(params).forEach(([key, value]) => {
        if (key === "not-found") return;

        if (value == null) return;

        if (Array.isArray(value)) {
            value.forEach((v) => {
                if (v != null) {
                    values.push(`${encodeURIComponent(key)}=${encodeURIComponent(v)}`);
                }
            });
        } else {
            values.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
        }
    });

    return values.length === 0 ? "" : `?${values.join("&")}`;
};
