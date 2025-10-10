import React, { useState } from 'react';

import { useAuth } from '../../hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { useNavigate } from 'react-router-dom';

interface FileItem {
    id: number;
    name: string;
}



const Dashboard: React.FC = () => {
    const [files, setFiles] = useState<FileItem[]>([]);
    const [newFileName, setNewFileName] = useState('');

    const handleAddFile = () => {
        if (newFileName.trim() === '') return;
        setFiles([
            ...files,
            { id: Date.now(), name: newFileName.trim() }
        ]);
        setNewFileName('');
    };

      const { user, role } = useAuth();
  const nav = useNavigate();
  async function doLogout() { await signOut(auth); nav('/login'); }
  return (
    <div style={{padding:20}}>
      <h3>Welcome {user?.email}</h3>
      <div>Role: {role}</div>
    </div>
  );

    return (

        
        <div style={{ padding: 24, maxWidth: 400, margin: '0 auto' }}>
            <h2>Dashboard</h2>
            <div style={{ marginBottom: 16 }}>
                <input
                    type="text"
                    placeholder="New file name"
                    value={newFileName}
                    onChange={e => setNewFileName(e.target.value)}
                    style={{ marginRight: 8 }}
                />
                <button onClick={handleAddFile}>Add New File</button>
            </div>
            <ul>
                {files.map(file => (
                    <li key={file.id}>{file.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;