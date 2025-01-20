import React from 'react';
import Link from 'next/link';

const LeftNavigationBar = () => {
  return (
    <nav className="w-1/4 bg-gray-100 border-r border-gray-300 p-4">
      <h2 className="text-lg font-bold mb-4">User Settings</h2>
      <ul className="space-y-2">
        <li>
          <Link href="/user/account/profile" className="block p-2 hover:bg-gray-200 rounded">
            Profile
          </Link>
        </li>
        <li>
          <Link href="/user/account/payment" className="block p-2 hover:bg-gray-200 rounded">
            Payment
          </Link>
        </li>
        <li>
          <Link href="/user/account/address" className="block p-2 hover:bg-gray-200 rounded">
            Address
          </Link>
        </li>
        <li>
          <Link href="/user/account/changepassword" className="block p-2 hover:bg-gray-200 rounded">
            Change Password
          </Link>
        </li>
        <li>
          <Link href="/user/account/privacy" className="block p-2 hover:bg-gray-200 rounded">
            Privacy
          </Link>
        </li>
        <li>
          <Link href="/user/account/notification" className="block p-2 hover:bg-gray-200 rounded">
            Notification
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default LeftNavigationBar;
