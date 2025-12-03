import AlbumList from "./components/albums";
import Search from "./components/search";
import React, { useEffect, useState } from "react";
import ScrollButton from "./components/scrollbutton";
import { Tooltip } from "bootstrap";
import { Routes, Route, Link } from "react-router-dom";
import Impressum from "./pages/Impressum";
import Datenschutz from "./pages/Datenschutz";
import CookieConsent from "react-cookie-consent";
import Footer from "./components/footer";

function HomeLayout() {
  const [searchValue, setSearchValue] = useState("");
  const [filterActive, setFilterActive] = useState(false);

  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll(
      "[data-bs-toggle='tooltip']"
    );
    [...tooltipTriggerList].forEach(
      (tooltipTriggerEl) => new Tooltip(tooltipTriggerEl)
    );
  }, []);

  return (
    <>
      <div className="container mt-4 background">
        <header>
          <h1>Rocky Beach Welle</h1>
          <p className="subtitle">
            Fanprojekt zu „Die drei ???“ – alle Alben auf Spotify
          </p>
          <div className="d-flex mt-4 mb-4 gap-3 filters">
            <Search searchValue={searchValue} setSearchValue={setSearchValue} />
            <button
              type="button"
              className={`btn btn-primary ${!filterActive ? "" : "inactive"}`}
              onClick={() => setFilterActive((prev) => !prev)}
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              data-bs-title="Blendet Folgen mit Überlänge, Playlists und vorgelesene Folgen aus."
            >
              {filterActive
                ? "Sonderfolgen ausgeblendet"
                : "Sonderfolgen eingeblendet"}
            </button>
          </div>
        </header>
        <main>
          <AlbumList searchValue={searchValue} filterActive={filterActive} />
        </main>
      </div>
    </>
  );
}

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomeLayout />} />
        <Route path="/impressum" element={<Impressum />} />
        <Route path="/datenschutz" element={<Datenschutz />} />
      </Routes>
      <Footer />
      <ScrollButton />
      <CookieConsent
        location="bottom"
        buttonText="Einverstanden"
        declineButtonText="Ablehnen"
        enableDeclineButton
        cookieName="rbw-cookie-consent"
        onAccept={() => {
          window.location.reload();
        }}
      >
        Diese Website bindet Inhalte von Spotify ein. Dabei können Cookies von
        Spotify gesetzt und Daten an Spotify übertragen werden. Bitte stimme der
        Nutzung zu, um die Inhalte zu laden. Weitere Informationen findest du im{" "}
        <Link to="/impressum" className="text-decoration-underline">
          Impressum
        </Link>{" "}
        und in der{" "}
        <Link to="/datenschutz" className="text-decoration-underline">
          Datenschutzerklärung
        </Link>
        .
      </CookieConsent>
    </>
  );
}

export default App;
