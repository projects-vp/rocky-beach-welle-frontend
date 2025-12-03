import { useEffect } from "react";

export default function MatomoOptOut() {
  useEffect(() => {
    const s = document.createElement("script");
    s.src =
      "https://rocky-beach-welle.de/matomo/index.php?module=CoreAdminHome&action=optOutJS&divId=matomo-opt-out&language=auto&backgroundColor=FFFFFF&fontColor=000000&fontSize=12px&fontFamily=Arial&showIntro=1";
    s.async = true;
    document.body.appendChild(s);

    return () => document.body.removeChild(s);
  }, []);

  return <div id="matomo-opt-out"></div>;
}