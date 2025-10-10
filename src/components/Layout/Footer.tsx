import React from "react";

const Footer: React.FC = () => (
  <footer className="bg-gray-800 text-gray-300 text-center py-2 text-sm">
    © {new Date().getFullYear()} Diagram Builder | Built with React + Firebase
  </footer>
);

export default Footer;
