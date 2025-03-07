import { WebAssetItem } from "@/types/Asset";
import { DraggableItemStyle } from "./DraggableItem.style";

interface DraggableItemProps {
  id: string;
  asset: WebAssetItem;
  listeners?: any;
  attributes?: any;
}

const DraggableItem: React.FC<DraggableItemProps> = ({
  asset,
  listeners = {},
  attributes = {},
}) => {
  return (
    <div
      style={DraggableItemStyle.card}
      {...listeners}
      {...attributes}
    >
      {
        asset.type === "video" ? (
          <video
            autoPlay={false}
            style={DraggableItemStyle.video}
          >
            <source src={
              typeof asset.url === "string" ? asset.url : URL.createObjectURL(asset.url)
            } type="video/mp4" />
          </video>
        ) : (
          <img style={DraggableItemStyle.image}
            src={
              typeof asset.url === "string" ? asset.url : URL.createObjectURL(asset.url)
            }
          />
        )
      }
    </div>
  );
};

export default DraggableItem;
