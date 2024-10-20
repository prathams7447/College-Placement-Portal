import React from 'react';

const Footer = () => {
  return (
    <footer className="text-center p-3 bg-dark text-white">
      <p className="mb-0">© {new Date().getFullYear()} City Engineering College</p>
    </footer>
  );
};

export default Footer;
