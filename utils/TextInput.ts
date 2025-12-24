export interface ModalOrPageParams {
    isWeb: boolean;
    openModal: (
        title: string,
        placeholder: string,
        value: string,
        onSubmit: (value: string) => void
    ) => void;
    router: any;
    fieldTitle: string;
    fieldValue: string;
    setFieldValue: (value: string) => void;
    pathBack: string;
}

export const handleModalOrInputPage = ({
    isWeb,
    openModal,
    router,
    fieldTitle,
    fieldValue,
    setFieldValue,
    pathBack,
}: ModalOrPageParams) => {
    if (isWeb) {
        openModal(fieldTitle, `Enter ${fieldTitle}`, fieldValue, setFieldValue);
    } else {
        router.push({
            pathname: "/(main)/(screens)/(campaigns)/textbox-page",
            params: {
                title: fieldTitle,
                value: fieldValue,
                path: pathBack,
            },
        });
    }
};
