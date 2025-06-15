import { useState } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

import LinkColored from '../../assets/LinkColored.svg';
import PDFColored from '../../assets/PDFcolored.svg';

const ModuleItem = ({ item, onDelete, onRename }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(item.title);

  const handleRename = () => {
    if (newTitle.trim()) {
      onRename(item.id, newTitle.trim());
      setIsEditing(false);
    }
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setNewTitle(item.title);
    }
  };

  return (
    <div className="module-item">
      <div className="module-item-content">
        <div className="module-item-icon">
          {item.type === 'file' ? (
            <img src={PDFColored} alt="PDF" className="pdf-icon" />
          ) : (
            <img src={LinkColored} alt="Link" className="link-icon" />
          )}
        </div>
        <div className="module-item-details">
          {isEditing ? (
            <input
              type="text"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              onBlur={handleRename}
              onKeyDown={handleKeyPress}
              autoFocus
              className="rename-input"
            />
          ) : (
            <div className="module-item-title">{item.title}</div>
          )}
          {item.type === 'link' && (
            <div className="module-item-url">{item.url}</div>
          )}
        </div>
      </div>
      <div className="module-item-actions">
        <button
          className="action-button rename-button"
          onClick={() => setIsEditing(true)}
          title="Rename"
        >
          <FiEdit2 />
        </button>
        <button
          className="action-button delete-button"
          onClick={() => onDelete(item.id)}
          title="Delete"
        >
          <FiTrash2 />
        </button>
      </div>
    </div>
  );
};

export default ModuleItem;
