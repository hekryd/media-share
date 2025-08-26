
import { useEffect, useRef } from "react";

const Footer = () => {
  const year = new Date().getFullYear();
  const footerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const updateVar = () => {
      const h = footerRef.current?.offsetHeight ?? 0;
      document.documentElement.style.setProperty("--footer-height", `${h}px`);
    };
    updateVar();
    window.addEventListener("resize", updateVar);
    return () => window.removeEventListener("resize", updateVar);
  }, []);

  return (
    <footer ref={footerRef}>
      <div className="footer-content indent">
        <span>{year} Hektor + Rydzewski GmbH</span>
        <ul>
          <li>
            <a href="./pages/rechtliches/impressum.php">Impressum </a>
          </li>
          <li>
            <a href="./pages/rechtliches/datenschutz.php">Datenschutz </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
