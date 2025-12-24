export const includeSelectedItems = (
    itemsList: string[],
    selectedItems: string[]
) => {
    return itemsList.concat(
        selectedItems.filter((item) => !itemsList.includes(item))
    );
};

export const includeSingleSelectedItem = (
    itemsList: string[],
    selectedItem?: string
) => {
    if (!selectedItem || itemsList.includes(selectedItem))
        return itemsList;
    return [...itemsList, selectedItem];
};
