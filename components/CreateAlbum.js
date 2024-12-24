// components/CreateAlbum.js

import { useState } from 'react';

export default function CreateAlbum({ onCreate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    onCreate({ title, description });
    setTitle('');
    setDescription('');
  };

  return (
    <div className="create-album">
      <h2>Create New Album</h2>
      <form onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="Album Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Album Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
        <button type="submit">Create Album</button>
      </form>
    </div>
  );
}
