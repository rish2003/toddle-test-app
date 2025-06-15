import { useDrag } from 'react-dnd';

import ModuleItem from './ModuleItem';

const DraggableItem = ({ item, index, onDelete, onRename, onMove }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'ITEM',
    item: { id: item.id, index, type: item.type, moduleId: item.moduleId },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="draggable-item"
    >
      <ModuleItem item={item} onDelete={onDelete} onRename={onRename} />
    </div>
  );
};

export default DraggableItem;
