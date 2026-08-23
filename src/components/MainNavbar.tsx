import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '@/assets/GrafenbergLogo.png';

const MainNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { path: '/', label: 'Accueil' },
    { path: '/album/the-error-gospel', label: 'The Error Gospel' },
    { path: '/album/no-saints-no-proof', label: 'No Saints, No Proof' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50">
        <div 
          className="h-full bg-gradient-to-r from-neon-orange via-neon-cyan to-neon-magenta transition-all duration-300"
          style={{
            width: `${Math.min(100, (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100)}%`
          }}
        />
      </div>

      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled ? 'glass py-2 xs:py-3 md:py-4' : 'py-3 xs:py-4 md:py-6'
      }`}>
        <div className="container mx-auto px-4 xs:px-6 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            to="/"
            className="hover:scale-105 transition-transform duration-300 z-50 relative"
          >
            <img 
              src={logo}
              alt="GRAFENBERG Logo"
              className="h-8 xs:h-10 md:h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors duration-300 font-medium text-sm lg:text-base ${
                  isActive(link.path) 
                    ? 'text-neon-cyan' 
                    : 'text-foreground hover:text-neon-cyan'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden relative z-50 p-2 text-foreground hover:text-neon-cyan transition-colors duration-300"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-30 bg-deep/95 backdrop-blur-xl">
            <div className="flex flex-col items-center justify-center min-h-screen space-y-8 px-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={closeMobileMenu}
                  className={`transition-colors duration-300 font-orbitron font-bold text-2xl xs:text-3xl ${
                    isActive(link.path) 
                      ? 'text-neon-cyan' 
                      : 'text-foreground hover:text-neon-cyan'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Decorative Elements */}
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-neon-cyan rounded-full animate-pulse opacity-60" />
              <div className="absolute bottom-1/4 right-1/4 w-1.5 h-1.5 bg-neon-magenta rounded-full animate-pulse opacity-40" style={{ animationDelay: '0.5s' }} />
              <div className="absolute top-1/2 left-1/6 w-1 h-1 bg-neon-orange rounded-full animate-pulse opacity-50" style={{ animationDelay: '1s' }} />
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default MainNavbar;
