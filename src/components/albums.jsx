import React, { useEffect, useState } from "react";
import { getCookieConsentValue } from "react-cookie-consent";

function AlbumList({ searchValue, filterActive, showRandom, refreshRandom }) {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [randomAlbum, setRandomAlbum] = useState(null);

  const limit = 50;
  const consent = getCookieConsentValue("rbw-cookie-consent");

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

  async function fetchAlbums(accessToken, x = 0, y = 50) {
    try {
      const artistID = "3meJIgRw7YleJrmbpbJK6S";
      const res = await fetch(
        `https://api.spotify.com/v1/artists/${artistID}/albums?limit=${y}&offset=${x}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await res.json();
      return data.items || [];
    } catch (err) {
      console.error("Album-Fehler:", err);
      return [];
    }
  }

  useEffect(() => {
    if (!consent) {
      setLoading(false);
      setAlbums([]);
      return;
    }

    async function loadAll() {
      const accessToken = await fetchToken();
      if (!accessToken) return;

      let allAlbums = [];
      let offset = 0;
      let hasMore = true;

      while (hasMore) {
        const items = await fetchAlbums(accessToken, offset, limit);
        allAlbums = [...allAlbums, ...items];
        if (items.length < limit) {
          hasMore = false;
        } else {
          offset += limit;
        }
      }
      setAlbums(allAlbums);
      setLoading(false);
    }

    loadAll();
  }, [consent]);

  // Gefilterte Liste gleich oben berechnen
  const filtered = albums.filter((album) => {
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

  function pickRandomAlbum() {
    if (filtered.length === 0) {
      setRandomAlbum(null);
      return;
    }
    const randomIndex = Math.floor(Math.random() * filtered.length);
    setRandomAlbum(filtered[randomIndex]);
  }

  useEffect(() => {
    if (showRandom) {
      pickRandomAlbum();
    } else {
      setRandomAlbum(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showRandom, refreshRandom]);

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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center mb-5">
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Lade Folgen...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid">
      {!showRandom && (
        <ul className="episode-list row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 list-unstyled">
          {filtered.map((album) => (
            <li key={album.id} className="episode col mb-4">
              <div className="card h-100">
                <a
                  href={album.external_urls?.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-decoration-none"
                >
                  <img
                    src={album.images?.[0]?.url}
                    alt={album.name}
                    className="card-img-top"
                  />
                  <div className="card-body">
                    <p className="episode-title card-title">{album.name}</p>
                    <p className="card-text text-muted">{album.release_date}</p>
                  </div>
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showRandom && randomAlbum && (
        <ul className="episode-list row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 list-unstyled">
          <li key={randomAlbum.id} className="episode col mb-4">
            <div className="card h-100">
              <a
                href={randomAlbum.external_urls?.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none"
              >
                <img
                  src={randomAlbum.images?.[0]?.url}
                  alt={randomAlbum.name}
                  className="card-img-top border-random"
                />
                <div className="card-body">
                  <p className="episode-title card-title">{randomAlbum.name}</p>
                  <p className="card-text text-muted">
                    {randomAlbum.release_date}
                  </p>
                </div>
              </a>
            </div>
          </li>
        </ul>
      )}
    </div>
  );
}

export default AlbumList;