import { BrowserRouter as Router, Routes, Route, Link, useSearchParams } from 'react-router-dom';
import { BackgroundProvider, useBackground } from './BackgroundContext';
import GalleryPage from './components/GalleryPage.tsx';
import PhotoDetail from './components/PhotoDetail.tsx';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

function AppContent() {
  const { background } = useBackground();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();


  useEffect(() => {
    const imgid = searchParams.get('imgid');
    console.log('Search params:', imgid);
    if (imgid) {
      navigate(`/photo/${imgid}`, { replace: true });
    }
  }, [searchParams]);


  return (
    <div className="min-h-screen photo-background text-white" 
    style={
      background
        ? ({ ['--bg-image' as any]: `url(${background})` } as React.CSSProperties)
        : undefined
    }
    >
      <Navbar />
      <main className="container mx-auto px-4 py-8" >
        <Routes>
          <Route path="/" element={<GalleryPage />} />
          <Route path="/photo/:id" element={<PhotoDetail />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BackgroundProvider>
      <Router basename="/Astrogalerry/">
        <AppContent />
      </Router>
    </BackgroundProvider>
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

export default App;
