import React from "react";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <p>Copyright ⓒ Gianmario Iamoni {year}</p>
    </footer>
  );
}

