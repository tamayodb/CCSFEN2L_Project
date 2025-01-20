"use client";
import React, { useState } from 'react';

export default function Notification() {
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(false);

  const emailOptions = [
    { label: 'Order updates', description: 'Get notified when there are updates to your orders.' },
    { label: 'Promotions', description: 'Receive special offers and promotional content.' },
    { label: 'Customer surveys', description: 'Participate in surveys to provide feedback.' }
  ];

  const smsOptions = [
    { label: 'Promotions', description: 'Receive special offers and promotions via SMS.' }
  ];

  const [emailSettings, setEmailSettings] = useState(
    emailOptions.reduce((acc, option) => ({ ...acc, [option.label]: false }), {})
  );

  const [smsSettings, setSmsSettings] = useState(
    smsOptions.reduce((acc, option) => ({ ...acc, [option.label]: false }), {})
  );

  const handleEmailToggle = () => {
    const newState = !emailEnabled;
    setEmailEnabled(newState);
    const newSettings = { ...emailSettings };
    Object.keys(newSettings).forEach(key => {
      newSettings[key] = newState;
    });
    setEmailSettings(newSettings);
  };

  const handleSMSToggle = () => {
    const newState = !smsEnabled;
    setSmsEnabled(newState);
    const newSettings = { ...smsSettings };
    Object.keys(newSettings).forEach(key => {
      newSettings[key] = newState;
    });
    setSmsSettings(newSettings);
  };

  return (
    <div className="min-h-screen w-2/3 border-r border-gray-200">
      <div className="p-6 space-y-8">
        {/* Email Notifications Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Email Notifications</h2>
            <button
              onClick={handleEmailToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                emailEnabled ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  emailEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>            
          </div>
          {/* Section description */}
          <p className="text-sm text-gray-500">
              Manage your email notification preferences. Enable or disable updates for orders, promotions, and customer surveys.
          </p>
          <div className="space-y-2">
            {emailOptions.map((option) => (
              <div key={option.label} className="flex flex-col space-y-1 pl-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{option.label}</span>
                  <button
                    onClick={() =>
                      setEmailSettings((prev) => ({
                        ...prev,
                        [option.label]: !prev[option.label],
                      }))
                    }
                    disabled={!emailEnabled}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      emailEnabled
                        ? emailSettings[option.label]
                          ? "bg-blue-600"
                          : "bg-gray-200"
                        : "bg-gray-200 cursor-not-allowed opacity-50"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        emailSettings[option.label] ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                {/* Description always visible */}
                <p className="text-sm text-gray-500">{option.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SMS Notifications Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">SMS Notifications</h2>
            <button
              onClick={handleSMSToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                smsEnabled ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  smsEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          {/* Section description */}
          <p className="text-sm text-gray-500">
            Control your SMS notification preferences. Receive updates on promotions and special offers via text message.
          </p>
          <div className="space-y-2">
            {smsOptions.map((option) => (
              <div key={option.label} className="flex flex-col space-y-1 pl-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{option.label}</span>
                  <button
                    onClick={() =>
                      setSmsSettings((prev) => ({
                        ...prev,
                        [option.label]: !prev[option.label],
                      }))
                    }
                    disabled={!smsEnabled}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      smsEnabled
                        ? smsSettings[option.label]
                          ? "bg-blue-600"
                          : "bg-gray-200"
                        : "bg-gray-200 cursor-not-allowed opacity-50"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        smsSettings[option.label] ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                {/* Description always visible */}
                <p className="text-sm text-gray-500">{option.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
