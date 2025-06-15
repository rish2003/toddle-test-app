import { useDrag } from 'react-dnd';

import DroppableModule from './DroppableModule';

const DraggableModule = ({
  module,
  items,
  index,
  onEdit,
  onDelete,
  onAddItem,
  onDeleteItem,
  onRenameItem,
  onMoveItem,
  onReorderModules,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'MODULE',
    item: { type: 'MODULE', id: module.id, index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="draggable-module"
    >
      <DroppableModule
        module={module}
        items={items}
        index={index}
        onEdit={onEdit}
        onDelete={onDelete}
        onAddItem={onAddItem}
        onDeleteItem={onDeleteItem}
        onRenameItem={onRenameItem}
        onMoveItem={onMoveItem}
        onReorderModules={onReorderModules}
      />
    </div>
  );
};

export default DraggableModule;
