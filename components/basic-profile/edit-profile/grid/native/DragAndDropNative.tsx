import { Text } from '@/components/theme/Themed';
import { useAuthContext } from '@/contexts';
import { Attachment } from '@/shared-libs/firestore/trendly-pro/constants/attachment';
import { gridStylesFn } from '@/styles/draggable-grid/DraggableGrid.styles';
import { processRawAttachment } from '@/utils/attachments';
import { useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
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

class DataHolder {
  constructor(public myAttachments: { [k: number]: Attachment }, public assets: AssetItem[]) {
  }
}
let myData: DataHolder
const DragAndDropNative: React.FC<DragAndDropNativeProps> = ({
  attachments,
}) => {
  const [assets, setAssets] = useState<AssetItem[]>(generateEmptyAssets(attachments));
  useEffect(() => {
    myData = new DataHolder(attachments.reduce((acc: any, value, index) => {
      acc[index] = value;
      return acc;
    }, {}), generateEmptyAssets(attachments))
    setAssets([...myData.assets])
  }, [])
  const { user, updateUser } = useAuthContext()

  const initialPositions = Object.assign({}, ...assets.map(item => item.id).map((id, index) => ({ [id]: index })));
  const positions = useSharedValue(initialPositions);

  const theme = useTheme();
  const styles = gridStylesFn(theme);

  const handlePositionsUpdate = (newPositions: Record<string, number>) => {
    // const newFinalAssets = [...assets];

    for (let key in newPositions) {
      const pos = parseInt(key)
      myData.assets[pos].index = newPositions[key]
    }
    setAssets([...myData.assets])
    orderAndUpload()
  };

  const handleAssetUpdate = (id: number, attachment: Attachment) => {
    const position = id;
    myData.assets[position] = {
      id: position,
      index: myData.assets[position].index,
      type: attachment.type,
      url: processRawAttachment(attachment).url
    }
    setAssets([...myData.assets])
    if (myData.assets[position].url) {
      myData.myAttachments[position] = attachment
      // setMyAttachments({ ...myAttachments })
    } else {
      delete myData.myAttachments[position]
      // setMyAttachments({ ...myAttachments })
    }
    orderAndUpload()
  }

  const orderAndUpload = async () => {
    const assetOrder = myData.assets.filter(a => !!a.url).sort((a, b) => (a.index - b.index)).map(a => a.id)
    console.log("Order and Upload", assetOrder, "\n", myData.myAttachments);
    let newAttachments: Attachment[] = []
    for (let i = 0; i < assetOrder.length; i++) {
      const id = assetOrder[i];
      newAttachments.push(myData.myAttachments[id])
    }
    console.log("New Attachments", newAttachments);
    if (user) {
      // EditProfileSubject.next({
      //   action: "profile",
      //   data: newAttachments
      // })
      await updateUser(user.id, {
        profile: {
          ...user?.profile,
          attachments: newAttachments
        }
      }).catch((e) => { console.error(e) })
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
