import { useState } from "react";

const LegacyHeader = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="legacy-hr">
      <ul id="menu" style={{ width: open ? "100vw" : undefined, opacity: open ? 1 : undefined }}>
        <div>
          <li className="header-nav-start">
            <a className="in-kuerze-link" href="https://www.hektor-rydzewski.de/#in-kuerze"><span>In Kürze</span></a>
          </li>

          <li className="header-nav-wir">
            <a className="wir-link" id="wirLink" href="https://www.hektor-rydzewski.de/https://www.hektor-rydzewski.de/#wir"><span>Wir</span></a>
          </li>

          <li className="header-nav-unsere-kunden">
            <a className="unsere-kunden-link" href="https://www.hektor-rydzewski.de/#unsere-kunden"><span>Unsere Kunden</span></a>
          </li>

          <li className="header-nav-leistungen">
            <a className="leistungen-link" href="https://www.hektor-rydzewski.de/#leistungen"><span>Leistungen</span></a>
          </li>

          <li className="header-nav-jobs">
            <a className="jobs-link" href="https://www.hektor-rydzewski.de/#jobs"><span>Jobs</span></a>
          </li>
          <li className="header-nav-ausbildung">
            <a className="ausbildung-link" href="https://www.hektor-rydzewski.de/#ausbildung"><span>Ausbildung</span></a>
          </li>
          <li className="header-nav-kontakt">
            <a className="kontakt-link" href="https://www.hektor-rydzewski.de/#kontakt"><span>Kontakt</span></a>
          </li>
        </div>
      </ul>
      <header>
        <div className="site-header indent">
          <div className="site-header-inner">
            <a href="">
              <img src="https://www.hektor-rydzewski.de/assets/images/hektor+rydzewski.webp" id="logo" width={120} height={30} />
            </a>
          </div>
          <div className="header-nav">
            <ul className="header-nav-list">
              <li className="header-nav-in-kuerze">
                <a className="in-kuerze-link" href="https://www.hektor-rydzewski.de/#in-kuerze"><span>In Kürze</span></a>
              </li>
              <li className="header-nav-wir">
                <a className="wir-link" id="wirLink" href="https://www.hektor-rydzewski.de/#wir"><span>Wir</span></a>
              </li>
              <li className="header-nav-unsere-kunden">
                <a className="unsere-kunden-link" href="https://www.hektor-rydzewski.de/#unsere-kunden"><span>Unsere Kunden</span></a>
              </li>
              <li className="header-nav-leistungen">
                <a className="leistungen-link" href="https://www.hektor-rydzewski.de/#leistungen"><span>Leistungen</span></a>
              </li>
              <li className="header-nav-jobs">
                <a className="jobs-link" href="https://www.hektor-rydzewski.de/#jobs"><span>Jobs</span></a>
              </li>
              <li className="header-nav-ausbildung">
                <a className="ausbildung-link" href="https://www.hektor-rydzewski.de/#ausbildung"><span>Ausbildung</span></a>
              </li>
              <li className="header-nav-kontakt">
                <a className="kontakt-link" href="https://www.hektor-rydzewski.de/#kontakt"><span>Kontakt</span></a>
              </li>
            </ul>
          </div>
          <div id="menuToggle" className={open ? "change" : undefined} onClick={() => setOpen((o) => !o)}>
            <div className="bar1"></div>
            <div className="bar2"></div>
            <div className="bar3"></div>
          </div>
        </div>
        <hr className="hr indent" />
      </header>
      {/* spacer to reserve space below fixed header */}
      <div aria-hidden style={{ height: 140 }} />
    </div>
  );
};

export default LegacyHeader;
