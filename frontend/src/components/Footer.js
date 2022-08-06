import React from "react";

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer page__footer">
      <p className="footer__copyright">
        &#169;{currentYear}. Mesto Russia | Timofey Tarasov
      </p>
    </footer>
  );
}

export default Footer;
