import React, { useEffect, useState, useRef } from "react";
import { getCookieConsentValue } from "react-cookie-consent";

function AlbumList({ searchValue, filterActive, showRandom, refreshRandom }) {
  const [albums, setAlbums] = useState([]); // alle Metadaten
  const [displayedAlbums, setDisplayedAlbums] = useState([]); // nur gerenderte Alben
  const [loading, setLoading] = useState(true);
  const [randomAlbum, setRandomAlbum] = useState(null);

  const consent = getCookieConsentValue("rbw-cookie-consent");
  const imgRefs = useRef([]);
  const chunkSize = 20; // wie viele Alben pro Scroll geladen werden

  // --- Spotify API ---
  async function fetchToken() {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/refresh_token`);
      const data = await res.json();
      return data.access_token;
    } catch (err) {
      console.error("Token-Fehler:", err);
      return null;
    }
  }

  async function fetchAlbums(accessToken, offset = 0, limit = 50) {
    try {
      const artistID = "3meJIgRw7YleJrmbpbJK6S";
      const res = await fetch(
        `https://api.spotify.com/v1/artists/${artistID}/albums?limit=${limit}&offset=${offset}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const data = await res.json();
      return data.items || [];
    } catch (err) {
      console.error("Album-Fehler:", err);
      return [];
    }
  }

  // --- Alle Metadaten laden ---
  useEffect(() => {
    if (!consent) {
      setLoading(false);
      setAlbums([]);
      return;
    }

    async function loadAllAlbums() {
      setLoading(true);
      const accessToken = await fetchToken();
      if (!accessToken) return;

      let allAlbums = [];
      let offset = 0;
      let hasMore = true;

      while (hasMore) {
        const items = await fetchAlbums(accessToken, offset, 50);
        allAlbums = [...allAlbums, ...items];
        if (items.length < 50) hasMore = false;
        else offset += 50;
      }

      setAlbums(allAlbums);
      setLoading(false);
    }

    loadAllAlbums();
  }, [consent]);

  // --- Filter & Suche über alle Alben ---
  const getFilteredAlbums = () => {
    return albums.filter(album => {
      const name = album.name?.toLowerCase() || "";
      const matchSearch = name.includes((searchValue || "").toLowerCase());
      if (!filterActive) return matchSearch;

      const exclude =
        name.includes("liest...") ||
        name.includes("adventskalender") ||
        name.includes("sommer-fälle") ||
        name.includes("outro") ||
        name.includes("auferstehung") ||
        name.includes("brainwash") ||
        name.includes("das verfluchte schloss") ||
        name.includes("das geheimnis der geisterinsel") ||
        name.includes("hörspiel") ||
        name.includes("das dorf der teufel");

      const tooManyTracks = album.total_tracks > 50;
      return matchSearch && !exclude && !tooManyTracks;
    });
  };

  // --- Aktualisiere displayedAlbums bei Suche/Filter ---
  useEffect(() => {
    const filteredAlbums = getFilteredAlbums();
    setDisplayedAlbums(filteredAlbums.slice(0, chunkSize));
  }, [searchValue, filterActive, albums]);

  // --- Random Album ---
  function pickRandomAlbum() {
    const filteredAlbums = getFilteredAlbums();
    if (filteredAlbums.length === 0) {
      setRandomAlbum(null);
      return;
    }
    const randomIndex = Math.floor(Math.random() * filteredAlbums.length);
    setRandomAlbum(filteredAlbums[randomIndex]);
  }

  useEffect(() => {
    if (showRandom) pickRandomAlbum();
    else setRandomAlbum(null);
  }, [showRandom, refreshRandom, albums, searchValue, filterActive]);

  // --- Lazy Loading der Bilder ---
  useEffect(() => {
    if (!imgRefs.current) return;
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            io.unobserve(img);
          }
        });
      },
      { rootMargin: "100px" }
    );

    imgRefs.current.forEach(img => {
      if (img) io.observe(img);
    });

    return () => io.disconnect();
  }, [displayedAlbums, randomAlbum]);

  // --- Scroll lädt weitere Treffer aus gefilterten Alben ---
  useEffect(() => {
    const handleScroll = () => {
      const filteredAlbums = getFilteredAlbums();
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
        displayedAlbums.length < filteredAlbums.length
      ) {
        const nextChunk = filteredAlbums.slice(
          displayedAlbums.length,
          displayedAlbums.length + chunkSize
        );
        setDisplayedAlbums(prev => [...prev, ...nextChunk]);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [displayedAlbums, albums, searchValue, filterActive]);

  // --- Render Album Card ---
  const renderAlbumCard = (album, index) => (
    <li key={album.id} className="episode col mb-4">
      <div className="card h-100">
        <a
          href={album.external_urls?.spotify}
          target="_blank"
          rel="noopener noreferrer"
          className="text-decoration-none"
        >
          <img
            data-src={album.images?.[0]?.url}
            alt={album.name}
            className="card-img-top"
            ref={el => (imgRefs.current[index] = el)}
            src=""
          />
          <div className="card-body">
            <p className="episode-title card-title">{album.name}</p>
            <p className="card-text text-muted">{album.release_date}</p>
          </div>
        </a>
      </div>
    </li>
  );

  if (!consent) {
    return (
      <div className="hinweis-consent alert alert-info mt-4">
        <p>
          Um die Spotify-Alben der Drei ??? anzuzeigen, benötige ich deine
          Einwilligung zur Nutzung von Spotify (Cookies und Datenübertragung).
        </p>
        <p>Bitte triff unten im Cookie-Hinweis deine Auswahl.</p>
      </div>
    );
  }

  return (
    <div className="grid">
      {!showRandom && (
        <ul className="episode-list row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 list-unstyled">
          {displayedAlbums.map((album, idx) => renderAlbumCard(album, idx))}
        </ul>
      )}

      {showRandom && randomAlbum && (
        <ul className="episode-list row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 list-unstyled">
          {renderAlbumCard(randomAlbum, 0)}
        </ul>
      )}

      {loading && (
        <div className="d-flex justify-content-center align-items-center my-4">
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Lade Alben...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default AlbumList;
