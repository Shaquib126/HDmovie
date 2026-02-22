import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("movies.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    poster_url TEXT,
    release_year INTEGER,
    quality TEXT,
    category TEXT,
    size TEXT,
    language TEXT,
    download_links TEXT,
    is_trending INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Seed data if empty
const count = db.prepare("SELECT COUNT(*) as count FROM movies").get() as { count: number };
if (count.count === 0) {
  const seedMovies = [
    {
      title: "Pathaan",
      description: "An Indian RAW agent Pathaan is assigned to take down a private terror organization that has a plan to spread a deadly virus in India.",
      poster_url: "https://picsum.photos/seed/pathaan/600/900",
      release_year: 2023,
      quality: "4K",
      category: "Bollywood",
      size: "2.4GB",
      language: "Hindi",
      download_links: JSON.stringify([{ label: "Direct Download 4K", url: "#" }, { label: "G-Drive 1080p", url: "#" }]),
      is_trending: 1
    },
    {
      title: "Oppenheimer",
      description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
      poster_url: "https://picsum.photos/seed/oppenheimer/600/900",
      release_year: 2023,
      quality: "HD",
      category: "Hollywood",
      size: "1.8GB",
      language: "English",
      download_links: JSON.stringify([{ label: "Direct Download HD", url: "#" }]),
      is_trending: 1
    },
    {
      title: "Pushpa: The Rise",
      description: "Violence erupts between red sandalwood smugglers and the police who are tasked with taking down their organization.",
      poster_url: "https://picsum.photos/seed/pushpa/600/900",
      release_year: 2021,
      quality: "720p",
      category: "South",
      size: "1.4GB",
      language: "Telugu",
      download_links: JSON.stringify([{ label: "Download 720p", url: "#" }]),
      is_trending: 1
    },
    {
      title: "Stranger Things",
      description: "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.",
      poster_url: "https://picsum.photos/seed/stranger/600/900",
      release_year: 2022,
      quality: "HD",
      category: "Web-Series",
      size: "800MB/Ep",
      language: "English",
      download_links: JSON.stringify([{ label: "Season 4 All Episodes", url: "#" }]),
      is_trending: 0
    }
  ];

  const insert = db.prepare(`
    INSERT INTO movies (title, description, poster_url, release_year, quality, category, size, language, download_links, is_trending)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const movie of seedMovies) {
    insert.run(movie.title, movie.description, movie.poster_url, movie.release_year, movie.quality, movie.category, movie.size, movie.language, movie.download_links, movie.is_trending);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/movies", (req, res) => {
    const { category, trending } = req.query;
    let query = "SELECT * FROM movies";
    const params = [];

    if (trending === "true") {
      query += " WHERE is_trending = 1";
    } else if (category) {
      query += " WHERE category = ?";
      params.push(category);
    }

    query += " ORDER BY created_at DESC";
    const movies = db.prepare(query).all(...params);
    res.json(movies);
  });

  app.get("/api/movies/search", (req, res) => {
    const { q } = req.query;
    const movies = db.prepare("SELECT * FROM movies WHERE title LIKE ?").all(`%${q}%`);
    res.json(movies);
  });

  app.get("/api/movies/:id", (req, res) => {
    const movie = db.prepare("SELECT * FROM movies WHERE id = ?").get(req.params.id);
    if (movie) {
      res.json(movie);
    } else {
      res.status(404).json({ error: "Movie not found" });
    }
  });

  app.post("/api/movies", (req, res) => {
    const { title, description, poster_url, release_year, quality, category, size, language, download_links, is_trending } = req.body;
    
    try {
      const info = db.prepare(`
        INSERT INTO movies (title, description, poster_url, release_year, quality, category, size, language, download_links, is_trending)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(title, description, poster_url, release_year, quality, category, size, language, JSON.stringify(download_links), is_trending ? 1 : 0);
      
      res.status(201).json({ id: info.lastInsertRowid });
    } catch (error) {
      res.status(500).json({ error: "Failed to add movie" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
