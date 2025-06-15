import { useDrop } from 'react-dnd';

import ModuleCard from './ModuleCard';

const DroppableModule = ({
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
  const [{ isOver }, drop] = useDrop({
    accept: ['ITEM', 'MODULE'],
    drop: (item, monitor) => {
      if (!monitor.didDrop()) {
        if (item.type === 'ITEM') {
          onMoveItem(item.id, module.id);
        } else if (item.type === 'MODULE' && item.index !== index) {
          onReorderModules(item.index, index);
        }
      }
    },
    collect: monitor => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  });

  return (
    <div ref={drop} className={`droppable-module ${isOver ? 'is-over' : ''}`}>
      <ModuleCard
        module={module}
        items={items}
        onEdit={onEdit}
        onDelete={onDelete}
        onAddItem={onAddItem}
        onDeleteItem={onDeleteItem}
        onRenameItem={onRenameItem}
      />
    </div>
  );
};

export default DroppableModule;
