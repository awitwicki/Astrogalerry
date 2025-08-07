import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import GalleryPage from './components/GalleryPage.tsx';
import PhotoDetail from './components/PhotoDetail.tsx';

function App() {
  return (
    <Router basename="/Astrogalerry/">
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<GalleryPage />} />
            <Route path="/photo/:id" element={<PhotoDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function Navbar() {
  return (
    <nav className="bg-gray-800 py-4 px-6 flex justify-between items-center">
      <Link to="/" className="hover:text-cyan-400"> <span className="mr-2">🌌</span> Astrophoto galerry</Link>
      <a href='https://github.com/awitwicki/Astrogalerry' className="read-the-docs" target="_blank">
        Github repo
      </a>
    </nav>
  );
}

export default App
