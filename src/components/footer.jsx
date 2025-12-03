import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer>
      <div className="container">
        <p>
          Inoffizielles, nicht-kommerzielles Fanprojekt zu „Die drei ???“. Ich
          stehe in keiner Verbindung zu Franckh-Kosmos, EUROPA/Sony Music oder
          Spotify.
        </p>
        <p>
          <Link to="/">Rocky Beach Welle</Link>
          &nbsp;|&nbsp;
          <Link to="/impressum">Impressum</Link>
          &nbsp;|&nbsp;
          <Link to="/datenschutz">Datenschutz</Link>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
