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
  selectedItems?: string
) => {
  if (!selectedItems || itemsList.includes(selectedItems))
    return itemsList;
  return [...itemsList, selectedItems];
};
