
import React from 'react';
import Navbar from './Navbar';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const NavbarWrapper = () => {
  const navigate = useNavigate();
  
  return (
    <div className="w-full">
      <div className="flex items-center justify-end bg-primary/5 px-4 py-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/subscription')}
          className="text-primary hover:text-primary/80 hover:bg-primary/10"
        >
          Subscription Plans
        </Button>
      </div>
      <Navbar />
    </div>
  );
};

export default NavbarWrapper;
