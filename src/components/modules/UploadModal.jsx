import { useState } from 'react';

const UploadModal = ({ isOpen, onClose, onSave, moduleId }) => {
  const [fileTitle, setFileTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    const validTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
    ];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid file type (JPEG, PNG, GIF, or PDF)');
      setSelectedFile(null);
      return;
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      setError('File size should be less than 10MB');
      setSelectedFile(null);
      return;
    }

    setError('');
    setSelectedFile(file);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!selectedFile || !fileTitle.trim()) return;

    // Create a FileReader to read the file
    const reader = new FileReader();
    reader.onload = event => {
      onSave({
        id: Date.now().toString(),
        moduleId,
        type: 'file',
        title: fileTitle.trim(),
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        fileType: selectedFile.type,
        fileData: event.target.result, // Store the file data as base64
      });
      setFileTitle('');
      setSelectedFile(null);
      setError('');
    };
    reader.readAsDataURL(selectedFile);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Upload file</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="file-title">File title</label>
              <input
                id="file-title"
                type="text"
                value={fileTitle}
                onChange={e => setFileTitle(e.target.value)}
                placeholder="File title"
                className="form-input"
                autoFocus
              />
            </div>
            <div className="form-group">
              <label htmlFor="file-upload">Select file</label>
              <input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                className="file-input"
                accept=".jpg,.jpeg,.png,.gif,.pdf"
              />
              {error && <p className="error-message">{error}</p>}
              {selectedFile && (
                <div className="selected-file">
                  <div className="file-preview">
                    {selectedFile.type.startsWith('image/') ? (
                      <img
                        src={URL.createObjectURL(selectedFile)}
                        alt="Preview"
                        className="image-preview"
                      />
                    ) : (
                      <div className="pdf-preview">
                        <span className="pdf-icon">📄</span>
                        <span className="pdf-text">PDF Document</span>
                      </div>
                    )}
                  </div>
                  <div className="file-info">
                    <span className="file-name">{selectedFile.name}</span>
                    <span className="file-size">
                      ({Math.round(selectedFile.size / 1024)} KB)
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-create"
              disabled={!fileTitle.trim() || !selectedFile}
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
