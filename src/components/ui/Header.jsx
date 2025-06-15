import { useState, useRef, useEffect } from 'react';

import AddIcon from '../../assets/AddOutlined.svg?react';
import CaretDownIcon from '../../assets/CaretDownFilled.svg?react';
import SearchIcon from '../../assets/SearchOutlined.svg?react';

const Header = ({ onAddClick, searchValue, onSearchChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const handleAddClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCreateModule = () => {
    onAddClick('module');
    setIsDropdownOpen(false);
  };

  const handleAddLink = () => {
    onAddClick('link');
    setIsDropdownOpen(false);
  };

  const handleUpload = () => {
    onAddClick('upload');
    setIsDropdownOpen(false);
  };

  return (
    <div className="header px-6">
      <h1 className="header-title text-7xl font-bold">Course builder</h1>
      <div className="header-right">
        <div className="search-container">
          <span className="search-icon">
            <SearchIcon style={{ width: 20, height: 20 }} />
          </span>
          <input
            type="text"
            placeholder="Search..."
            className="search-input"
            value={searchValue}
            onChange={e => onSearchChange(e.target.value)}
          />
        </div>
        <div className="dropdown-container" ref={dropdownRef}>
          <button className="add-button flex" onClick={handleAddClick}>
            <AddIcon />
            Add
            <CaretDownIcon style={{ marginLeft: '6px', color: 'white' }} />
          </button>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={handleCreateModule}>
                <span className="item-icon">📄</span>
                Create module
              </button>
              <button className="dropdown-item" onClick={handleAddLink}>
                <span className="item-icon">🔗</span>
                Add a link
              </button>
              <button className="dropdown-item" onClick={handleUpload}>
                <span className="item-icon">⬆️</span>
                Upload
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
