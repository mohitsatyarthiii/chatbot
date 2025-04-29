import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Menu, X } from 'lucide-react';

interface NavbarProps {
  onAiButtonClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onAiButtonClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);
  
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-black/80 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <Brain className="h-8 w-8 text-purple-500 mr-2" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              FutureAI
            </span>
          </motion.div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#about">About</NavLink>
            <NavLink href="#contact">Contact</NavLink>
            
            <motion.button
              onClick={onAiButtonClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium flex items-center"
            >
              <Brain className="mr-2 h-5 w-5" />
              AI Assistant
            </motion.button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-gray-900/90 backdrop-blur-md"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <MobileNavLink href="#features" onClick={() => setMobileMenuOpen(false)}>
              Features
            </MobileNavLink>
            <MobileNavLink href="#about" onClick={() => setMobileMenuOpen(false)}>
              About
            </MobileNavLink>
            <MobileNavLink href="#contact" onClick={() => setMobileMenuOpen(false)}>
              Contact
            </MobileNavLink>
            
            <motion.button
              onClick={() => {
                onAiButtonClick();
                setMobileMenuOpen(false);
              }}
              whileTap={{ scale: 0.95 }}
              className="w-full text-left block px-3 py-2 rounded-md text-base font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white"
            >
              <div className="flex items-center">
                <Brain className="mr-2 h-5 w-5" />
                AI Assistant
              </div>
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

const NavLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.05 }}
      className="text-gray-300 hover:text-white transition-colors duration-300"
    >
      {children}
    </motion.a>
  );
};

const MobileNavLink: React.FC<{ 
  href: string; 
  onClick: () => void; 
  children: React.ReactNode 
}> = ({ href, onClick, children }) => {
  return (
    <a
      href={href}
      onClick={onClick}
      className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
    >
      {children}
    </a>
  );
};

export default Navbar;