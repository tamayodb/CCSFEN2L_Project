"use client";

import { useState } from 'react';
import { UserCircle, Plus, Edit2 } from 'lucide-react';

export default function Profile() {
  const [emails, setEmails] = useState(['']);
  const [showPhone, setShowPhone] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const isLeapYear = (year) => {
    return (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));
  };

  // Generate year options from 1900 to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);
  
  // Generate months
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (month, year) => {
    if (month === 2) {
      return isLeapYear(year) ? 29 : 28; // February logic
    }
    const monthsWith31Days = [1, 3, 5, 7, 8, 10, 12]; // January, March, May, July, August, October, December
    return monthsWith31Days.includes(month) ? 31 : 30;
  };
  
  const [days, setDays] = useState([]);
  
  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    if (selectedYear) {
      setDays(Array.from({ length: getDaysInMonth(month, selectedYear) }, (_, i) => i + 1));
    }
  };
  
  const handleYearChange = (year) => {
    setSelectedYear(year);
    if (selectedMonth) {
      setDays(Array.from({ length: getDaysInMonth(selectedMonth, year) }, (_, i) => i + 1));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert('File size must be less than 1MB');
        return;
      }
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        alert('Only JPEG and PNG files are allowed');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

   // Function to save form data to a .txt file
   const handleSaveToFile = () => {
    // Prepare the text content from form data
    const fileContent = `
      Username: ${username}
      Name: ${name}
      Email Addresses: ${emails.join(', ')}
      Phone: ${showPhone ? phone : "Hidden"}
    `;

    // Create a Blob with the content
    const blob = new Blob([fileContent], { type: 'text/plain' });

    // Create an anchor tag to trigger download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'profile_data.txt'; // Filename for download

    // Trigger the download by simulating a click
    link.click();
  };

  return (
    <div className="flex gap-6">
      {/* Left section - Forms (2/3) */}
      <div className="w-2/3">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="w-full p-2 border rounded-md"
                placeholder="Enter username"
              />
              <p className="text-sm text-gray-500">Note: Username can only be changed once</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full p-2 border rounded-md"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email section with Add button */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email Addresses
              </label>
              {emails.map((email, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      const newEmails = [...emails];
                      newEmails[index] = e.target.value;
                      setEmails(newEmails);
                    }}
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter email address"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => setEmails([...emails, ''])}
                className="flex items-center gap-2 px-3 py-1 text-sm border rounded-md hover:bg-gray-50"
              >
                <Plus className="h-4 w-4" /> Add Email
              </button>
            </div>

            {/* Phone number with masked digits */}
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  id="phone"
                  value={showPhone ? "1234567890" : "********90"}
                  readOnly={!showPhone}
                  className="w-full p-2 border rounded-md"
                />
                <button
                  type="button"
                  onClick={() => setShowPhone(!showPhone)}
                  className="flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-gray-50 whitespace-nowrap"
                >
                  <Edit2 className="h-4 w-4" />
                  {showPhone ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Gender selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select className="w-full p-2 border rounded-md">
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Date of Birth dropdowns */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <div className="flex gap-2">
                <select
                  className="w-full p-2 border rounded-md"
                  value={selectedMonth}
                  onChange={(e) => handleMonthChange(Number(e.target.value))}
                >
                  <option value="">Month</option>
                  {months.map((month, index) => (
                    <option key={month} value={index + 1}>
                      {month}
                    </option>
                  ))}
                </select>

                <select
                  className="w-full p-2 border rounded-md"
                  value={selectedYear}
                  onChange={(e) => handleYearChange(Number(e.target.value))}
                >
                  <option value="">Year</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>

                <select className="w-full p-2 border rounded-md">
                  <option value="">Day</option>
                  {days.map(day => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>

              </div>
            </div>
            {/* Submit Button */}
            <div>
              <button
                type="button"
                onClick={handleSaveToFile} // Call the handleSaveToFile function when clicked
                className="flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-gray-50 whitespace-nowrap"
              >
                Submit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right section - Image upload (1/3) */}
      <div className="w-1/3">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-48 h-48 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
              {imagePreview ? (
                <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <UserCircle className="w-32 h-32 text-gray-400" />
              )}
            </div>
            
            <div className="text-center">
              <input
                type="file"
                id="image-upload"
                className="hidden"
                accept=".jpg,.jpeg,.png"
                onChange={handleImageChange}
              />
              <label 
                htmlFor="image-upload" 
                className="cursor-pointer inline-flex items-center justify-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Upload Photo
              </label>
            </div>

            <div className="border rounded-md p-3 bg-blue-50 text-xs text-center">
              Maximum file size: 1MB<br />
              Supported formats: JPEG, PNG
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}