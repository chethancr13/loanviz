
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out py-4 px-6 md:px-10",
        isScrolled ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-display font-semibold text-primary">
              LoanViz<span className="text-gray-800 dark:text-gray-100">.</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink href="/">Dashboard</NavLink>
            <NavLink href="/#calculator">Calculator</NavLink>
            <NavLink href="/#comparison">Comparison</NavLink>
            <NavLink href="/#about">About</NavLink>
            <Button variant="default" className="ml-2 font-medium">
              Get Started
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-800 dark:text-gray-200" />
            ) : (
              <Menu className="h-6 w-6 text-gray-800 dark:text-gray-200" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={cn(
          "fixed inset-0 bg-white dark:bg-gray-900 z-40 pt-20 px-6 md:hidden transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <nav className="flex flex-col space-y-6 items-center">
          <MobileNavLink 
            href="/" 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Dashboard
          </MobileNavLink>
          <MobileNavLink 
            href="/#calculator" 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Calculator
          </MobileNavLink>
          <MobileNavLink 
            href="/#comparison" 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Comparison
          </MobileNavLink>
          <MobileNavLink 
            href="/#about" 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About
          </MobileNavLink>
          <Button 
            variant="default" 
            className="w-full mt-4"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Get Started
          </Button>
        </nav>
      </div>
    </header>
  );
};

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <Link
      to={href}
      className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors duration-200"
    >
      {children}
    </Link>
  );
};

const MobileNavLink = ({ 
  href, 
  onClick, 
  children 
}: { 
  href: string; 
  onClick: () => void;
  children: React.ReactNode 
}) => {
  return (
    <Link
      to={href}
      className="text-xl font-medium text-gray-800 dark:text-gray-200 w-full text-center py-3"
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default Navbar;
