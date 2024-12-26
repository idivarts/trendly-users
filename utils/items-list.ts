export const includeSelectedItems = (
  itemsList: string[],
  selectedItems: string[]
) => {
  return itemsList.concat(
    selectedItems.filter((item) => !itemsList.includes(item))
  );
};
