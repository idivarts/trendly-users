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
    <div
      style={{
        borderRadius: "10px",
        height: "10rem",
        maxWidth: "10rem",
        minWidth: "10rem",
        overflow: "hidden",
        width: "10rem",
      }}
      {...listeners}
      {...attributes}
    >
      {
        asset.type === "video" ? (
          <video
            autoPlay={false}
            style={{
              height: "10rem",
              maxWidth: "10rem",
              minWidth: "10rem",
              objectFit: "cover",
            }}
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
            style={{
              borderRadius: "10px",
              height: "10rem",
              maxWidth: "10rem",
              minWidth: "10rem",
              objectFit: "cover",
            }}
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
