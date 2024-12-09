import { WebAssetItem } from "@/types/Asset";

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
    <div className="draggable-asset" {...listeners} {...attributes}>
      {
        asset.type === "video" ? (
          <video
            autoPlay={false}
            className="video"
          >
            <source
              src={
                typeof asset.url === "string" ? asset.url : URL.createObjectURL(asset.url)
              }
              type="video/mp4"
            />
          </video>
        ) : (
          <img
            alt=""
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
