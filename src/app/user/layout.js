import React from 'react';
import LeftNavigationBar from '@/components/user/account/LeftNavigationBar';

const InnerLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      {/* Left Navigation Bar */}
      <LeftNavigationBar />

      {/* Main Content */}
      <div className="w-3/4 p-6">{children}</div>
    </div>
  );
};

export default InnerLayout;
