import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<string[]>([]);

  const fetchFiles = async () => {
    const res = await axios.get('http://localhost:3000/api/files');
    setFiles(res.data);
  };

  useEffect(() => { fetchFiles(); }, []);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    await axios.post('http://localhost:3000/api/upload', formData);
    fetchFiles();
  };

  return (
    <div className="App">
      <h1>File Upload System</h1>
      <input type="file" onChange={(e) => e.target.files && setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>

      <h2>Uploaded Files:</h2>
      <ul>
        {files.map(f => (
          <li key={f}><a href={`http://localhost:3000/uploads/${f}`} download>{f}</a></li>
        ))}
      </ul>
    </div>
  );
}

export default App;