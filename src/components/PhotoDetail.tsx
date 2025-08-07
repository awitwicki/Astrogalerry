import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { AstroPhoto } from '../models/AstroPhoto';

function PhotoDetail() {
  const { id } = useParams<{ id: string }>();
  const [photo, setPhoto] = useState<AstroPhoto|null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    const fetchPhotoDetails = async () => {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}data.json`);
        const photos = await response.json() as AstroPhoto[];
        const foundPhoto: AstroPhoto | undefined = photos.find(p => p.id === parseInt(id!));
        
        if (foundPhoto) {
          setPhoto(foundPhoto);
        } else {
          setError('Photo not found');
        }
        setIsLoading(false);
      } catch (err) {
        setError(`Error loading data ${err}`);
        setIsLoading(false);
      }
    };

    fetchPhotoDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        <p className="mt-4">Loading photo info...</p>
      </div>
    );
  }

  if (error || !photo) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">{error || 'Фото не знайдено'}</h2>
        <Link to="/" className="text-cyan-400 hover:underline">
          Return to gallery
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Return to gallery
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 bg-gray-800 rounded-xl overflow-hidden flex items-center justify-center p-2">
          <img 
            src={`${import.meta.env.BASE_URL}${photo.path}`}
            alt={photo.object}
            className="max-h-[80vh] w-auto max-w-full object-contain"
          />
        </div>

        <div className="lg:w-1/3 bg-gray-800 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-2">{photo.object}</h2>
          <h3 className="text-xl text-cyan-400 mb-6">{photo.date}</h3>
          
          <div className="space-y-4 mb-6">
            <DetailItem label="Telescope" value={photo.telescope} />
            <DetailItem label="Camera" value={photo.camera} />
            <DetailItem label="Filters" value={photo.filters} />
            <DetailItem label="Exposure time" value={photo.exposure} />
            <DetailItem label="Frame count" value={photo.frames} />
            <DetailItem label="Total integration time" value={photo.total_exposure} />
            <DetailItem label="Processing" value={photo.processing} />
            <DetailItem label="Date" value={photo.shooting_date} />
            {photo.description && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-300">{photo.description}</p>
              </div>
            )}
          </div>
          
          
        </div>
      </div>
    </div>
  );
}

type DetailItemProps = {
  label: string;
  value: string | number | null | undefined;
};

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="border-b border-gray-700 pb-3">
      <span className="text-gray-400 text-sm block">{label}:</span>
      <span className="text-lg">{value || '—'}</span>
    </div>
  );
}

export default PhotoDetail;