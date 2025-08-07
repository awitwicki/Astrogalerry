import { Link } from "react-router-dom";
import type { AstroPhoto } from '../models/AstroPhoto.ts';

function PhotoCard({ photo }: { photo: AstroPhoto }) {
  return (
    <Link
      to={`/photo/${photo.id}`}
      className="block w-full text-center py-2 rounded-lg transition-colors"
    >
      <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <div className="relative overflow-hidden">
          <img
            src={`${import.meta.env.BASE_URL}${photo.path}`}
            alt={photo.object}
            className="object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
        </div>
      </div>
    </Link>
  );
}

export default PhotoCard;
