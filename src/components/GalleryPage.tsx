import React, { useState, useEffect } from 'react';
import PhotoCard from './PhotoCard.tsx';

function GalleryPage() {
  const [photos, setPhotos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data.json');
        const data = await response.json();
        setPhotos(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Errol fetch data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPhotos = photos.filter(photo => 
    photo.object.toLowerCase().includes(searchTerm.toLowerCase()) || 
    photo.object.toLowerCase().replace(/\s+/g, '').includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search (M31, NGC 6960...)"
          className="flex-grow p-3 rounded-lg bg-gray-800 border border-gray-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          <p className="mt-4">Loading...</p>
        </div>
      ) : filteredPhotos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl">Not found</p>
          <p className="text-gray-400 mt-2">Try something different</p>
        </div>
      ) : (
        <>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredPhotos.map(photo => (
            <PhotoCard key={photo.id} photo={photo} />
          ))}
        </div>
        </>

      )}
    </div>
  );
}

export default GalleryPage;