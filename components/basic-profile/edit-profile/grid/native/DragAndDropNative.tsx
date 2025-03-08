import { Text } from '@/components/theme/Themed';
import { Attachment } from '@/shared-libs/firestore/trendly-pro/constants/attachment';
import { gridStylesFn } from '@/styles/draggable-grid/DraggableGrid.styles';
import { processRawAttachment } from '@/utils/attachments';
import { useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import { View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Draggable from './Draggable';
import DraggableItem, { AssetItem } from './DraggableItem';

interface DragAndDropNativeProps {
  attachments: Attachment[]
}

const generateEmptyAssets = (
  attachments: Attachment[],
): AssetItem[] => {
  if (!attachments) {
    const assets: AssetItem[] = []
    for (let i = 0; i < 6; i++) {
      assets.push({ url: "", type: "", id: i, index: i });
    }
    return assets
  }

  const assetsLength = attachments.length;

  let assets: AssetItem[] = attachments.map((attachment, index) => {
    return processRawAttachment(attachment);
  }).map((m, index) => ({
    ...m,
    id: index,
    index: index
  }));

  for (let i = assetsLength; i < 6; i++) {
    assets.push({ id: i, url: "", type: "", index: i });
  }

  return assets;
};

const DragAndDropNative: React.FC<DragAndDropNativeProps> = ({
  attachments,
}) => {
  const [assets, setAssets] = useState<AssetItem[]>(generateEmptyAssets(attachments));

  const initialPositions = Object.assign({}, ...assets.map(item => item.id).map((id, index) => ({ [id]: index })));
  const positions = useSharedValue(initialPositions);

  const theme = useTheme();
  const styles = gridStylesFn(theme);

  const handlePositionsUpdate = (newPositions: Record<string, number>) => {
    // const newFinalAssets = [...assets];

    for (let key in newPositions) {
      const pos = parseInt(key)
      assets[pos].index = newPositions[key]
    }
    setAssets([...assets])
  };

  const handleAssetUpdate = (id: string, asset: Attachment) => {
    const position = id;
    // const currentPosition = Object.keys(positions.value).find(key => Number(key) === position);

    // const newAssets = assets.map(item => {
    //   if (item.id === Number(currentPosition)) {
    //     return asset;
    //   }
    //   return item;
    // });
    // setAssets(newAssets);
  }

  // useEffect(() => {
  //   if (onItemsUpdate) {
  //     onItemsUpdate(assets);
  //   }
  // }, [assets]);

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        {assets.map((item) => (
          <Draggable
            key={item.id}
            positions={positions}
            id={item.id}
            onPositionsUpdate={handlePositionsUpdate}
          >
            <DraggableItem
              key={item.id}
              asset={item}
              onAssetUpdate={handleAssetUpdate}
            />
          </Draggable>
        ))}
      </View>
      <View
        style={styles.hintContainer}
      >
        <View
          style={styles.hintText}
        >
          <Text>Hold & drag your photos to change the order</Text>
        </View>
      </View>
    </View>
  );
};

export default DragAndDropNative;
