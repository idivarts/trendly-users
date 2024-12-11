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
    <div
      ref={setNodeRef}
      style={{
        position: 'relative',
        minWidth: '10rem',
        maxWidth: '10rem',
        height: '10rem',
        aspectRatio: '1',
        borderRadius: '10px',
        cursor: 'grab',
        backgroundColor: '#f5f5f5',
        ...style,
      }}
    >
      <DraggableItem id={id} asset={asset} listeners={listeners} attributes={attributes} />
      <button
        onClick={onRemove}
        style={{
          position: 'absolute',
          right: '8px',
          bottom: '8px',
          padding: '10px',
          borderRadius: '50%',
          backgroundColor: '#1e3a5f',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          zIndex: 2,
        }}
      >
        <FontAwesomeIcon
          icon={faClose}
          color="white"
        />
      </button>
    </div>
  );
};

export default SortableItem;
