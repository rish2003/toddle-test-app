import { useState, useRef } from 'react';
import { useDrop } from 'react-dnd';

import EmptyState from '../ui/EmptyState';
import Header from '../ui/Header';

import DraggableItem from './DraggableItem';
import DraggableModule from './DraggableModule';
import LinkModal from './LinkModal';
import ModuleModal from './ModuleModal';
import ModuleOutline from './ModuleOutline';
import UploadModal from './UploadModal';

const CourseBuilder = () => {
  const [modules, setModules] = useState([]);
  const [items, setItems] = useState([]);
  const [independentItems, setIndependentItems] = useState([]);
  const [expandedModuleId, setExpandedModuleId] = useState(null);
  const [searchValue, setSearchValue] = useState('');

  // Modal states
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Current items for editing
  const [currentModule, setCurrentModule] = useState(null);
  const [currentModuleId, setCurrentModuleId] = useState(null);
  const [isIndependentUpload, setIsIndependentUpload] = useState(false);
  const [isIndependentLink, setIsIndependentLink] = useState(false);

  // Refs for scrolling
  const moduleRefs = useRef({});

  const handleAddClick = type => {
    switch (type) {
      case 'module':
        setCurrentModule(null);
        setIsModuleModalOpen(true);
        break;
      case 'link':
        setIsIndependentLink(true);
        setCurrentModuleId(null);
        setIsLinkModalOpen(true);
        break;
      case 'upload':
        setIsIndependentUpload(true);
        setCurrentModuleId(null);
        setIsUploadModalOpen(true);
        break;
      default:
        break;
    }
  };

  const handleCloseModuleModal = () => {
    setIsModuleModalOpen(false);
    setCurrentModule(null);
  };

  const handleCloseLinkModal = () => {
    setIsLinkModalOpen(false);
    setCurrentModuleId(null);
    setIsIndependentLink(false);
  };

  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
    setCurrentModuleId(null);
    setIsIndependentUpload(false);
  };

  const handleSaveModule = module => {
    if (currentModule) {
      setModules(modules.map(m => (m.id === module.id ? module : m)));
    } else {
      setModules([...modules, module]);
    }
    setIsModuleModalOpen(false);
    setCurrentModule(null);
  };

  const handleEditModule = module => {
    setCurrentModule(module);
    setIsModuleModalOpen(true);
  };

  const handleDeleteModule = moduleId => {
    setModules(modules.filter(module => module.id !== moduleId));
    setItems(items.filter(item => item.moduleId !== moduleId));
  };

  const handleAddItem = (moduleId, type) => {
    setCurrentModuleId(moduleId);
    setIsIndependentUpload(false);
    setIsIndependentLink(false);
    if (type === 'link') {
      setIsLinkModalOpen(true);
    } else if (type === 'file') {
      setIsUploadModalOpen(true);
    }
  };

  const handleSaveLink = linkItem => {
    if (isIndependentLink) {
      setIndependentItems([...independentItems, linkItem]);
    } else {
      setItems([...items, linkItem]);
    }
    setIsLinkModalOpen(false);
    setCurrentModuleId(null);
    setIsIndependentLink(false);
  };

  const handleSaveUpload = fileItem => {
    if (isIndependentUpload) {
      setIndependentItems([...independentItems, fileItem]);
    } else {
      setItems([...items, fileItem]);
    }
    setIsUploadModalOpen(false);
    setCurrentModuleId(null);
    setIsIndependentUpload(false);
  };

  const handleDeleteItem = itemId => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const handleDeleteIndependentItem = itemId => {
    setIndependentItems(independentItems.filter(item => item.id !== itemId));
  };

  const handleRenameItem = (itemId, newTitle) => {
    setItems(
      items.map(item =>
        item.id === itemId ? { ...item, title: newTitle } : item
      )
    );
  };

  const handleRenameIndependentItem = (itemId, newTitle) => {
    setIndependentItems(
      independentItems.map(item =>
        item.id === itemId ? { ...item, title: newTitle } : item
      )
    );
  };

  const handleMoveItem = (itemId, targetModuleId) => {
    const itemToMove = [...items, ...independentItems].find(
      item => item.id === itemId
    );
    if (!itemToMove) return;
    if (itemToMove.moduleId) {
      setItems(items.filter(item => item.id !== itemId));
    } else {
      setIndependentItems(independentItems.filter(item => item.id !== itemId));
    }
    const updatedItem = {
      ...itemToMove,
      moduleId: targetModuleId,
    };
    if (targetModuleId) {
      setItems([...items, updatedItem]);
    } else {
      setIndependentItems([...independentItems, updatedItem]);
    }
  };

  const handleReorderItems = (dragIndex, hoverIndex, moduleId) => {
    const itemsToReorder = moduleId
      ? items.filter(item => item.moduleId === moduleId)
      : independentItems;
    const reorderedItems = [...itemsToReorder];
    const [draggedItem] = reorderedItems.splice(dragIndex, 1);
    reorderedItems.splice(hoverIndex, 0, draggedItem);
    if (moduleId) {
      const otherItems = items.filter(item => item.moduleId !== moduleId);
      setItems([...otherItems, ...reorderedItems]);
    } else {
      setIndependentItems(reorderedItems);
    }
  };

  const handleReorderModules = (dragIndex, hoverIndex) => {
    if (dragIndex === hoverIndex) return;
    const reorderedModules = [...modules];
    const [draggedModule] = reorderedModules.splice(dragIndex, 1);
    reorderedModules.splice(hoverIndex, 0, draggedModule);
    setModules(reorderedModules);
  };

  // Outline click handler
  const handleOutlineSelect = moduleId => {
    setExpandedModuleId(moduleId);
    if (moduleRefs.current[moduleId]) {
      moduleRefs.current[moduleId].scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const [{ isOver }, drop] = useDrop({
    accept: ['ITEM', 'MODULE'],
    drop: (item, monitor) => {
      if (!monitor.didDrop()) {
        if (item.type === 'ITEM') {
          handleMoveItem(item.id, null);
        }
      }
    },
    collect: monitor => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  });

  // --- SEARCH LOGIC ---
  const normalizedSearch = searchValue.trim().toLowerCase();
  let filteredModules = modules;
  let filteredItems = items;
  let filteredIndependentItems = independentItems;
  let showNoResults = false;

  if (normalizedSearch) {
    // 1. Find modules that match
    const moduleMatches = modules.filter(m =>
      m.name.toLowerCase().includes(normalizedSearch)
    );
    // 2. Find items that match
    const itemMatches = items.filter(item => {
      if (item.type === 'link') {
        return (
          item.title.toLowerCase().includes(normalizedSearch) ||
          (item.url && item.url.toLowerCase().includes(normalizedSearch))
        );
      } else if (item.type === 'file') {
        return (
          item.title.toLowerCase().includes(normalizedSearch) ||
          (item.fileName &&
            item.fileName.toLowerCase().includes(normalizedSearch))
        );
      }
      return false;
    });
    // 3. Find independent items that match
    const independentMatches = independentItems.filter(item => {
      if (item.type === 'link') {
        return (
          item.title.toLowerCase().includes(normalizedSearch) ||
          (item.url && item.url.toLowerCase().includes(normalizedSearch))
        );
      } else if (item.type === 'file') {
        return (
          item.title.toLowerCase().includes(normalizedSearch) ||
          (item.fileName &&
            item.fileName.toLowerCase().includes(normalizedSearch))
        );
      }
      return false;
    });

    // 4. Prepare filtered modules and items for rendering
    if (
      moduleMatches.length > 0 ||
      itemMatches.length > 0 ||
      independentMatches.length > 0
    ) {
      // Modules to show: modules that match OR modules that have matching items
      filteredModules = modules.filter(module => {
        if (moduleMatches.some(m => m.id === module.id)) return true;
        // If any item in this module matches
        return itemMatches.some(item => item.moduleId === module.id);
      });
      // Items to show: if module matches, show all its items; else, only show matching items
      filteredItems = [];
      filteredModules.forEach(module => {
        if (moduleMatches.some(m => m.id === module.id)) {
          // Show all items for this module
          filteredItems.push(
            ...items.filter(item => item.moduleId === module.id)
          );
        } else {
          // Only show matching items for this module
          filteredItems.push(
            ...itemMatches.filter(item => item.moduleId === module.id)
          );
        }
      });
      // Show only matching independent items
      filteredIndependentItems = independentMatches;
    } else {
      // No results
      filteredModules = [];
      filteredItems = [];
      filteredIndependentItems = [];
      showNoResults = true;
    }
  }

  return (
    <div className="course-builder">
      <Header
        onAddClick={handleAddClick}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />
      <div className="main-content-with-outline">
        <ModuleOutline
          modules={filteredModules}
          selectedModuleId={expandedModuleId}
          onSelect={handleOutlineSelect}
        />
        <div className="builder-content">
          {showNoResults ? (
            <div
              style={{
                padding: '48px',
                textAlign: 'center',
                color: '#888',
                fontSize: '18px',
              }}
            >
              No results found
            </div>
          ) : filteredModules.length === 0 &&
            filteredIndependentItems.length === 0 ? (
            <EmptyState />
          ) : (
            <div
              className={`module-list ${isOver ? 'is-over' : ''}`}
              ref={drop}
            >
              {filteredModules.map((module, index) => (
                <div
                  key={module.id}
                  ref={el => (moduleRefs.current[module.id] = el)}
                  id={`module-${module.id}`}
                >
                  <DraggableModule
                    module={module}
                    items={filteredItems.filter(
                      item => item.moduleId === module.id
                    )}
                    index={index}
                    onEdit={handleEditModule}
                    onDelete={handleDeleteModule}
                    onAddItem={handleAddItem}
                    onDeleteItem={handleDeleteItem}
                    onRenameItem={handleRenameItem}
                    onMoveItem={handleMoveItem}
                    onReorderModules={handleReorderModules}
                    expandedModuleId={expandedModuleId}
                    setExpandedModuleId={setExpandedModuleId}
                  />
                </div>
              ))}
              {filteredIndependentItems.length > 0 && (
                <div className="independent-items">
                  {filteredIndependentItems.map((item, index) => (
                    <DraggableItem
                      key={item.id}
                      item={item}
                      index={index}
                      onDelete={handleDeleteIndependentItem}
                      onRename={handleRenameIndependentItem}
                      onMove={handleReorderItems}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <ModuleModal
        isOpen={isModuleModalOpen}
        onClose={handleCloseModuleModal}
        onSave={handleSaveModule}
        module={currentModule}
      />
      <LinkModal
        isOpen={isLinkModalOpen}
        onClose={handleCloseLinkModal}
        onSave={handleSaveLink}
        moduleId={currentModuleId}
      />
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={handleCloseUploadModal}
        onSave={handleSaveUpload}
        moduleId={currentModuleId}
      />
    </div>
  );
};

export default CourseBuilder;
