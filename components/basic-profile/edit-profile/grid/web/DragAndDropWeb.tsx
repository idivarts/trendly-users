import { WebAssetItem } from '@/types/Asset';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { useState } from 'react';
import DraggableItem from './DraggableItem';
import EmptyItem from './EmptyItem';
import SortableItem from './SortableItem';

interface DragAndDropWebProps {
  items: WebAssetItem[];
  onUploadAsset: (items: WebAssetItem[]) => void;
}

const DragAndDropWeb: React.FC<DragAndDropWebProps> = ({
  onUploadAsset,
  items,
}) => {
  const [assets, setAssets] = useState<WebAssetItem[]>(items)
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setAssets((prevAssets) => {
        const oldIndex = prevAssets.findIndex((asset) => asset.id === active.id)
        const newIndex = prevAssets.findIndex((asset) => asset.id === over.id)
        const newAssets = arrayMove(prevAssets, oldIndex, newIndex)
        onUploadAsset(newAssets)
        return newAssets
      })
    }
    setActiveId(null);
  }

  const handleRemoveAsset = (id: string) => {
    setAssets((prev) => {
      const newAssets = prev.filter((asset) => asset.id !== id);
      onUploadAsset(newAssets);
      return newAssets;
    });
  }

  const handleAddAsset = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setAssets((prevAssets) => {
        const newAssets = [
          ...prevAssets, {
            id: URL.createObjectURL(file),
            url: file,
            type: file.type.includes('video') ? 'video' : 'image',
          }];
        onUploadAsset(newAssets);
        return newAssets;
      })
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        style={{
          display: 'grid',
          gap: '20px',
          gridTemplateColumns: 'repeat(3, 1fr)',
          justifyItems: 'center',
          margin: '0 auto',
          maxWidth: '900px',
          padding: '20px',
        }}
      >
        <SortableContext
          items={assets.map((asset) => asset.id as string)}
          strategy={rectSortingStrategy}
        >
          {assets.map((asset) => (
            <SortableItem
              key={asset.id}
              id={asset.id as string}
              asset={asset}
              onRemove={() => handleRemoveAsset(asset.id as string)}
            />
          ))}
          {Array.from({ length: 6 - assets.length }).map((_, index) => (
            <EmptyItem index={index} handleAddAsset={handleAddAsset} />
          ))}
        </SortableContext>

        <DragOverlay>
          {activeId ? (
            <DraggableItem
              asset={assets.find((asset) => asset.id === activeId) as WebAssetItem}
              id={activeId}
            />
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  )
}

export default DragAndDropWeb;
