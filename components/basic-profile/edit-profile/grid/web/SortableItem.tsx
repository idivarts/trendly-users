import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DraggableItem from './DraggableItem';
import { WebAssetItem } from '@/types/Asset';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

interface SortableItemProps {
  id: string;
  asset: WebAssetItem;
  onRemove: () => void;
}

const SortableItem: React.FC<SortableItemProps> = ({
  id,
  asset,
  onRemove,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className="sortable-item">
      <DraggableItem id={id} asset={asset} listeners={listeners} attributes={attributes} />
      <button onClick={onRemove} className="remove-button">
        <FontAwesomeIcon
          icon={faClose}
          color="white"
        />
      </button>
    </div>
  );
};

export default SortableItem;
