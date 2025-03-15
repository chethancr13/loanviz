
import React from 'react';
import NavbarWrapper from '@/components/NavbarWrapper';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavbarWrapper />
      <main className="flex-1 mt-16">
        <Dashboard />
      </main>
    </div>
  );
};

export default Index;
