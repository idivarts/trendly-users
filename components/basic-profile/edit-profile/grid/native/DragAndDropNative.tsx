import { Text } from '@/components/theme/Themed';
import { useAuthContext } from '@/contexts';
import { Attachment } from '@/shared-libs/firestore/trendly-pro/constants/attachment';
import { gridStylesFn } from '@/styles/draggable-grid/DraggableGrid.styles';
import { processRawAttachment } from '@/utils/attachments';
import { useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import { Platform, View } from 'react-native';
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
  const [myAttachments, setMyAttachments] = useState(attachments.reduce((acc: any, value, index) => {
    acc[index] = value;
    return acc;
  }, {}))
  const { user, updateUser } = useAuthContext()

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
    orderAndUpload()
  };

  const handleAssetUpdate = (id: number, asset: Attachment) => {
    const position = id;
    assets[position] = {
      id: position,
      index: assets[position].index,
      type: asset.type,
      url: (asset.type == "image" ? asset.imageUrl : (Platform.OS == "ios" ? asset.appleUrl : asset.playUrl)) || ""
    }
    setAssets([...assets])
    if (assets[position].url) {
      myAttachments[position] = asset
      setMyAttachments({ ...myAttachments })
    } else {
      delete myAttachments[position]
      setMyAttachments({ ...myAttachments })
    }
    orderAndUpload()
  }

  const orderAndUpload = () => {
    const assetOrder = assets.filter(a => !!a.url).sort((a, b) => (a.index - b.index)).map(a => a.id)
    console.log("Order and Upload", assetOrder, "\n", myAttachments);
    let newAttachments: Attachment[] = []
    for (let i = 0; i < assetOrder.length; i++) {
      const id = assetOrder[i];
      newAttachments.push(myAttachments["" + id])
    }
    console.log("New Attachments", newAttachments);
    if (user) {
      updateUser(user.id, {
        profile: {
          ...user?.profile,
          attachments: newAttachments
        }
      })
    }
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
