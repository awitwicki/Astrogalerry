import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import type { AstroPhoto } from "../models/AstroPhoto";
import { useBackground } from "../BackgroundContext";

function PhotoDetail() {
  const { id } = useParams<{ id: string }>();
  const [photo, setPhoto] = useState<AstroPhoto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { setBackground } = useBackground();

  useEffect(() => {
    const fetchPhotoDetails = async () => {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}data.json`);
        const photos = (await response.json()) as AstroPhoto[];
        const foundPhoto: AstroPhoto | undefined = photos.find(
          (p) => p.id === parseInt(id!)
        );

        if (foundPhoto) {
          setBackground(
            `${import.meta.env.BASE_URL}images/thumbnails/${
              foundPhoto.fileName
            }`
          );
          setPhoto(foundPhoto);
        } else {
          setError("Photo not found");
        }
        setIsLoading(false);
      } catch (err) {
        setError(`Error loading data ${err}`);
        setIsLoading(false);
      }
    };

    fetchPhotoDetails();

    return () => {
      setBackground(null);
    };
  }, [id, setBackground]);

  const handleWheel = (e: React.WheelEvent) => {
    if (!isFullscreen) return;

    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.2 : 0.2;
    const newZoom = Math.max(0.5, Math.min(5, zoomLevel + delta));
    setZoomLevel(newZoom);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isFullscreen || zoomLevel <= 1) return;

    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !isFullscreen || zoomLevel <= 1) return;

    e.preventDefault();
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      setZoomLevel(1);
      setPosition({ x: 0, y: 0 });
    }
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
        setZoomLevel(1);
        setPosition({ x: 0, y: 0 });
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

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
        <h2 className="text-2xl font-bold mb-4">
          {error || "Фото не знайдено"}
        </h2>
        <Link to="/" className="text-cyan-400 hover:underline">
          Return to gallery
        </Link>
      </div>
    );
  }

  return (
    <>
      <Link
        to="/"
        className="inline-flex items-center hover:text-cyan-300 mb-6"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Return to gallery
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        <div
          className="lg:w-2/3rounded-xl overflow-hidden flex items-center justify-center p-2 cursor-zoom-in"
          onClick={toggleFullscreen}
          ref={containerRef}
        >
          <div className="flex flex-col items-left">
            <span className="mb-2 text-sm text-gray-400">click to zoom</span>

            <img
              ref={imageRef}
              src={`${import.meta.env.BASE_URL}images/originals/${
                photo.fileName
              }`}
              alt={photo.object}
              className="max-h-[80vh] w-auto max-w-full object-contain"
            />
          </div>
        </div>

        <div className="lg:w-1/3 bg-gray-800/70  p-6 rounded-xl ">
          <h2 className="text-2xl font-bold mb-2">{photo.object}</h2>
          <h3 className="text-xl text-cyan-200 mb-6">{photo.date}</h3>

          <div className="space-y-4 mb-6">
            <DetailItem label="Telescope" value={photo.telescope} />
            <DetailItem label="Camera" value={photo.camera} />
            <DetailItem label="Filters" value={photo.filters} />
            <DetailItem label="Exposure time" value={photo.exposure} />
            <DetailItem label="Frame count" value={photo.frames} />
            <DetailItem
              label="Total integration time"
              value={photo.totalExposure}
            />
            <DetailItem label="Processing" value={photo.processing} />
            <DetailItem label="Date" value={photo.date} />
            {photo.description && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-200">{photo.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {isFullscreen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
          onClick={() => setIsFullscreen(false)}
          onWheel={handleWheel}
        >
          <div className="absolute top-4 right-4 z-60 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full p-2">
            <button
              className="text-white p-2 rounded-full hover:bg-white/20 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setZoomLevel(Math.max(0.5, zoomLevel - 0.2));
              }}
              title="Zoom out"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 12h14"
                />
              </svg>
            </button>

            <span className="text-white text-sm mx-1">
              {Math.round(zoomLevel * 100)}%
            </span>

            <button
              className="text-white p-2 rounded-full hover:bg-white/20 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setZoomLevel(Math.min(5, zoomLevel + 0.2));
              }}
              title="Zoom in"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v14M5 12h14"
                />
              </svg>
            </button>

            <button
              className="text-white p-2 rounded-full hover:bg-white/20 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setZoomLevel(1);
                setPosition({ x: 0, y: 0 });
              }}
              title="Reset zoom"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>

            <div className="h-6 w-px bg-white/30 mx-1"></div>

            <button
              className="text-white p-2 rounded-full hover:bg-red-500/50 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setIsFullscreen(false);
              }}
              title="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <img
            src={`${import.meta.env.BASE_URL}images/originals/${
              photo.fileName
            }`}
            alt={photo.object}
            className="max-w-full max-h-full object-contain"
            style={{
              transform: `scale(${zoomLevel}) translate(${position.x}px, ${position.y}px)`,
              cursor:
                zoomLevel > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-out",
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

type DetailItemProps = {
  label: string;
  value: string | number | null | undefined;
};

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="border-b border-white/10 pb-3">
      <span className="text-cyan-200 text-sm block">{label}:</span>
      <span className="text-lg">{value || "—"}</span>
    </div>
  );
}

export default PhotoDetail;
