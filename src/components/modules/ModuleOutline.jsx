import React from 'react';

const ModuleOutline = ({ modules, selectedModuleId, onSelect }) => {
  return (
    <div className="module-outline">
      <div className="outline-title">Outline</div>
      <ul className="outline-list">
        {modules.map(module => (
          <li
            key={module.id}
            className={`outline-item${selectedModuleId === module.id ? ' selected' : ''}`}
            onClick={() => onSelect(module.id)}
          >
            {module.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ModuleOutline;
