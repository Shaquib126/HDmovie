/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Search, Film, TrendingUp, Plus, ChevronRight, Download, X, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Movie, Category } from './types';

// --- Components ---

const Navbar = ({ onSearch, onCategorySelect, onAdminOpen }: { 
  onSearch: (q: string) => void, 
  onCategorySelect: (cat: Category | null) => void,
  onAdminOpen: () => void 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black/90 backdrop-blur-md border-b border-white/10' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center gap-8">
            <h1 
              onClick={() => onCategorySelect(null)}
              className="text-2xl sm:text-3xl font-display font-extrabold text-brand cursor-pointer tracking-tighter"
            >
              JAMINDI<span className="text-white">.HD</span>
            </h1>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-white/70">
              {(['Bollywood', 'Hollywood', 'South', 'Web-Series'] as Category[]).map((cat) => (
                <button 
                  key={cat}
                  onClick={() => onCategorySelect(cat)}
                  className="hover:text-brand transition-colors"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input 
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  onSearch(e.target.value);
                }}
                className="bg-white/10 border border-white/10 rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 w-48 lg:w-64 transition-all"
              />
            </div>
            <button 
              onClick={onAdminOpen}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-brand"
            >
              <Plus className="w-5 h-5" />
            </button>
            <button className="md:hidden p-2 text-white">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const MovieCard: React.FC<{ movie: Movie; onClick: () => void }> = ({ movie, onClick }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.05, y: -5 }}
      onClick={onClick}
      className="relative aspect-[2/3] rounded-lg overflow-hidden cursor-pointer group bg-zinc-900"
    >
      <img 
        src={movie.poster_url} 
        alt={movie.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="absolute top-2 right-2">
        <span className="bg-brand text-[10px] font-bold px-2 py-0.5 rounded shadow-lg uppercase">
          {movie.quality}
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="text-sm font-bold line-clamp-1">{movie.title}</h3>
        <p className="text-[10px] text-white/60">{movie.release_year} • {movie.category}</p>
      </div>
    </motion.div>
  );
};

const MovieModal = ({ movie, onClose }: { movie: Movie, onClose: () => void }) => {
  const downloadLinks = JSON.parse(movie.download_links || '[]');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
    >
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="relative bg-zinc-900 w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl border border-white/10"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-brand rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/3 aspect-[2/3]">
            <img 
              src={movie.poster_url} 
              alt={movie.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex-1 p-6 sm:p-8 overflow-y-auto max-h-[70vh] md:max-h-none">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-brand font-bold text-xs uppercase tracking-widest">{movie.category}</span>
              <span className="text-white/40">•</span>
              <span className="text-white/60 text-xs">{movie.release_year}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold mb-4">{movie.title}</h2>
            
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="bg-white/5 border border-white/10 px-3 py-1 rounded text-xs">
                <span className="text-white/40 mr-2">Quality:</span>
                <span className="font-bold">{movie.quality}</span>
              </div>
              <div className="bg-white/5 border border-white/10 px-3 py-1 rounded text-xs">
                <span className="text-white/40 mr-2">Size:</span>
                <span className="font-bold">{movie.size}</span>
              </div>
              <div className="bg-white/5 border border-white/10 px-3 py-1 rounded text-xs">
                <span className="text-white/40 mr-2">Language:</span>
                <span className="font-bold">{movie.language}</span>
              </div>
            </div>

            <p className="text-white/70 text-sm leading-relaxed mb-8">
              {movie.description}
            </p>

            <div className="space-y-4">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <Download className="w-4 h-4 text-brand" />
                Download Links
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {downloadLinks.map((link: any, idx: number) => (
                  <a 
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between bg-brand hover:bg-brand/80 transition-colors px-4 py-3 rounded-lg font-bold text-sm"
                  >
                    <span>{link.label || `Download ${movie.quality}`}</span>
                    <ChevronRight className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const AdminDashboard = ({ onClose, onMovieAdded }: { onClose: () => void, onMovieAdded: () => void }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    poster_url: '',
    release_year: new Date().getFullYear(),
    quality: 'HD',
    category: 'Bollywood',
    size: '',
    language: 'Hindi',
    download_links: [{ label: 'Direct Download', url: '#' }],
    is_trending: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        onMovieAdded();
        onClose();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative bg-zinc-900 w-full max-w-2xl rounded-2xl p-6 sm:p-8 border border-white/10 max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
          <Plus className="text-brand" /> Add New Movie
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/40 mb-1">Title</label>
              <input 
                required
                type="text" 
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Poster URL</label>
              <input 
                required
                type="url" 
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                value={formData.poster_url}
                onChange={e => setFormData({...formData, poster_url: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-white/40 mb-1">Description</label>
            <textarea 
              required
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-white/40 mb-1">Year</label>
              <input 
                type="number" 
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                value={formData.release_year}
                onChange={e => setFormData({...formData, release_year: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Quality</label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                value={formData.quality}
                onChange={e => setFormData({...formData, quality: e.target.value})}
              >
                <option>HD</option>
                <option>4K</option>
                <option>720p</option>
                <option>CAM</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Category</label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value as Category})}
              >
                <option>Bollywood</option>
                <option>Hollywood</option>
                <option>South</option>
                <option>Web-Series</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Size</label>
              <input 
                placeholder="e.g. 1.2GB"
                type="text" 
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                value={formData.size}
                onChange={e => setFormData({...formData, size: e.target.value})}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="trending"
              checked={formData.is_trending}
              onChange={e => setFormData({...formData, is_trending: e.target.checked})}
              className="accent-brand"
            />
            <label htmlFor="trending" className="text-sm text-white/70">Mark as Trending</label>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/5 hover:bg-white/10 py-3 rounded-lg font-bold transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 bg-brand hover:bg-brand/80 py-3 rounded-lg font-bold transition-colors"
            >
              Add Movie
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMovies = async (category?: Category | null) => {
    setLoading(true);
    try {
      const url = category ? `/api/movies?category=${category}` : '/api/movies';
      const res = await fetch(url);
      const data = await res.json();
      setMovies(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrending = async () => {
    try {
      const res = await fetch('/api/movies?trending=true');
      const data = await res.json();
      setTrendingMovies(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async (q: string) => {
    if (!q) {
      fetchMovies(activeCategory);
      return;
    }
    try {
      const res = await fetch(`/api/movies/search?q=${q}`);
      const data = await res.json();
      setMovies(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMovies();
    fetchTrending();
  }, []);

  const handleCategorySelect = (cat: Category | null) => {
    setActiveCategory(cat);
    fetchMovies(cat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-transparent text-white selection:bg-brand selection:text-white">
      <Navbar 
        onSearch={handleSearch} 
        onCategorySelect={handleCategorySelect}
        onAdminOpen={() => setIsAdminOpen(true)}
      />

      <main className="pt-24 pb-12">
        {/* Hero Section (Only on Home) */}
        {!activeCategory && trendingMovies.length > 0 && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 px-4 sm:px-6 lg:px-8"
          >
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="text-brand w-5 h-5" />
              <h2 className="text-xl font-display font-bold uppercase tracking-wider">Trending Now</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
              {trendingMovies.map(movie => (
                <div key={movie.id} className="min-w-[160px] sm:min-w-[200px] lg:min-w-[240px]">
                  <MovieCard movie={movie} onClick={() => setSelectedMovie(movie)} />
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Movie Grid */}
        <section className="px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            key={activeCategory || 'all'}
            className="flex items-center justify-between mb-8"
          >
            <h2 className="text-2xl font-display font-bold">
              {activeCategory ? activeCategory : 'Latest Uploads'}
            </h2>
            <div className="text-sm text-white/40">
              {movies.length} Movies found
            </div>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="aspect-[2/3] bg-zinc-900/50 rounded-lg animate-pulse border border-white/5" />
              ))}
            </div>
          ) : movies.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6"
            >
              <AnimatePresence mode="popLayout">
                {movies.map((movie, index) => (
                  <motion.div
                    key={movie.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <MovieCard movie={movie} onClick={() => setSelectedMovie(movie)} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Film className="w-12 h-12 text-white/10 mx-auto mb-4" />
              <p className="text-white/40">No movies found in this category.</p>
            </motion.div>
          )}
        </section>
      </main>

      <footer className="border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h2 className="text-2xl font-display font-extrabold text-brand tracking-tighter mb-2">
              JAMINDI<span className="text-white">.HD</span>
            </h2>
            <p className="text-white/40 text-sm">© 2026 Jamindi.HD Movie.com. All rights reserved.</p>
          </div>
          <div className="flex gap-8 text-sm text-white/60">
            <a href="#" className="hover:text-brand transition-colors">DMCA</a>
            <a href="#" className="hover:text-brand transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-brand transition-colors">Contact Us</a>
          </div>
        </div>
      </footer>

      <AnimatePresence mode="wait">
        {selectedMovie && (
          <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
        )}
        {isAdminOpen && (
          <AdminDashboard 
            onClose={() => setIsAdminOpen(false)} 
            onMovieAdded={() => {
              fetchMovies(activeCategory);
              fetchTrending();
            }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
