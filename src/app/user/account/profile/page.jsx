"use client";

import { useState, useEffect } from 'react';

export default function Profile() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [contact_num, setPhone] = useState('');
  const [barangay, setBarangay] = useState('');
  const [street_num, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [zip_code, setZipCode] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingBarangay, setIsEditingBarangay] = useState(false);
  const [isEditingCity, setIsEditingCity] = useState(false);
  const [isEditingStreet, setIsEditingStreet] = useState(false);
  const [isEditingZipCode, setIsEditingZipCode] = useState(false);

  const [showContactNum, setShowPhone] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token'); 
        if (!token) {
          console.error('No token found');
          return;
        }

        const response = await fetch('/api/user/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();

        setEmail(userData.email || '');
        setUsername(userData.username || '');
        setName(userData.name || '');
        setPhone(userData.contact_num || '');
        setBarangay(userData.address?.barangay || '');
        setStreet(userData.address?.street_num || '');
        setCity(userData.address?.city || '');
        setZipCode(userData.address?.zip_code || '');
        
        // Improved image handling
        try {
          if (userData.name) {
            const imagePath = `/user/${encodeURIComponent(userData.name)}.jpg`;
            const timestamp = new Date().getTime();

            // Test if image exists
            const testImage = new Image();
            testImage.onload = () => {
              setImagePreview(`${imagePath}?t=${timestamp}`);
            };
            testImage.onerror = () => {
              setImagePreview('/user/default.png');
            };
            testImage.src = `${imagePath}?t=${timestamp}`;
          } else {
            setImagePreview('/user/default.png');
          }
        } catch (imgError) {
          console.error('Error checking user image:', imgError);
          setImagePreview('/public/user/default.png');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      alert('File size must be less than 1MB');
      return;
    }
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      alert('Only JPEG and PNG files are allowed');
      return;
    }

    // Make sure we have a name to use for the file
    if (!name) {
      alert('Please set your name first before uploading a profile picture');
      return;
    }

    try {
      // Use the user's name as the filename
      const filename = `${name}.jpg`;

      const response = await fetch('/api/user/upload-image', {
        method: 'POST',
        headers: {
          'x-filename': filename,
          'Content-Type': file.type,
        },
        body: await file.arrayBuffer(), // Send raw binary data
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload image');
      }
      // Add timestamp to prevent browser caching
      setImagePreview(`/user/${encodeURIComponent(name)}.jpg?t=${new Date().getTime()}`);
      alert('Profile picture updated successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(`Failed to upload image: ${error.message}`);
    }
  };

  const handleSubmit = async () => {
    const missingFields = [];
  
    if (!username) missingFields.push("Username");
    if (!name) missingFields.push("Name");
    if (!email) missingFields.push("Email Address");
    if (!barangay) missingFields.push("Barangay");
    if (!street_num) missingFields.push("Street");
    if (!city) missingFields.push("City");
    if (!zip_code) missingFields.push("ZIP Code");
    if (!contact_num) missingFields.push("Phone Number");
  
    if (missingFields.length > 0) {
      alert(`Please fill in the following fields: ${missingFields.join(", ")}`);
      return;
    };

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No authentication token found');
        return;
      }

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          name,
          email,
          contact_num,
          address: {
            street_num,
            barangay,
            city,
            zip_code,
          },
        }),
      });

      alert('Profile updated successfully!');
      window.location.reload(); 

      setIsEditing(false);
      setIsEditingUsername(false);
      setIsEditingName(false);
      setIsEditingEmail(false);
      setIsEditingBarangay(false);
      setIsEditingCity(false);
      setIsEditingStreet(false);
      setIsEditingZipCode(false);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="flex gap-6">
      <div className="w-2/3">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="flex items-center gap-2">
                {isEditingUsername ? (
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter username"
                  />
                ) : (
                  <span className="w-full p-2">{username}</span>
                )}
                
                <button
                  type="button"
                  onClick={() => setIsEditingUsername(!isEditingUsername)}
                  className="flex items-center gap-2 px-3 py-1 text-sm border rounded-md hover:bg-gray-50"
                >
                  {isEditingUsername ? 'Save' : 'Edit'}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <div className="flex items-center gap-2">
                {isEditingName ? (
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter your full name"
                  />
                ) : (
                  <span className="w-full p-2">{name}</span>
                )}

                <button
                  type="button"
                  onClick={() => setIsEditingName(!isEditingName)} 
                  className="flex items-center gap-2 px-3 py-1 text-sm border rounded-md hover:bg-gray-50"
                >
                  {isEditingName ? 'Save' : 'Edit'}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="flex items-center gap-2">
                {isEditingEmail ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter email address"
                  />
                ) : (
                  <span className="w-full p-2">{email}</span>
                )}

                <button
                  type="button"
                  onClick={() => setIsEditingEmail(!isEditingEmail)}
                  className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50"
                >
                  {isEditingEmail ? 'Save' : 'Edit'}
                </button>
              </div>
            </div>  
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Billing Address
              </label>
              <div className="flex gap-4">
                <div className="w-1/2 space-y-2">
                  <label htmlFor="barangay" className="block text-sm font-medium text-gray-700">
                    Barangay
                  </label>
                  <div className="flex items-center gap-2">
                    {isEditingBarangay ? (
                      <input
                        type="text"
                        id="barangay"
                        value={barangay}
                        onChange={(e) => setBarangay(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter barangay"
                      />
                    ) : (
                      <span className="w-full p-2">{barangay || " "}</span>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsEditingBarangay(!isEditingBarangay)}
                      className="flex items-center gap-2 px-3 py-1 text-sm border rounded-md hover:bg-gray-50"
                    >
                      {isEditingBarangay ? 'Save' : 'Edit'}
                    </button>
                  </div>
                </div>
                <div className="w-1/2 space-y-2">
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <div className="flex items-center gap-2">
                    {isEditingCity ? (
                      <input
                        type="text"
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter city"
                      />
                    ) : (
                      <span className="w-full p-2">{city || " "}</span>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsEditingCity(!isEditingCity)}
                      className="flex items-center gap-2 px-3 py-1 text-sm border rounded-md hover:bg-gray-50"
                    >
                      {isEditingCity ? 'Save' : 'Edit'}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-1/2 space-y-2">
                  <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                    Street 
                  </label>
                  <div className="flex items-center gap-2">
                    {isEditingStreet ? (
                      <input
                        type="text"
                        id="street_num"
                        value={street_num}
                        onChange={(e) => setStreet(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter street"
                      />
                    ) : (
                      <span className="w-full p-2">{street_num || " "}</span>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsEditingStreet(!isEditingStreet)}
                      className="flex items-center gap-2 px-3 py-1 text-sm border rounded-md hover:bg-gray-50"
                    >
                      {isEditingStreet ? 'Save' : 'Edit'}
                    </button>
                  </div>
                </div>
                <div className="w-1/2 space-y-2">
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                    ZIP Code
                  </label>
                  <div className="flex items-center gap-2">
                    {isEditingZipCode ? (
                      <input
                        type="text"
                        id="zip_code"
                        value={zip_code}
                        onChange={(e) => setZipCode(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter ZIP code"
                      />
                    ) : (
                      <span className="w-full p-2">{zip_code || " "}</span>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsEditingZipCode(!isEditingZipCode)}
                      className="flex items-center gap-2 px-3 py-1 text-sm border rounded-md hover:bg-gray-50"
                    >
                      {isEditingZipCode ? 'Save' : 'Edit'}
                    </button>
                  </div>
                </div>
              </div>
            </div>  
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="flex gap-2 items-center">
                {isEditing ? (
                  <input
                    type="text"
                    id="contact_num"
                    value={contact_num}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                ) : (
                  <span className="w-full p-2">
                    {contact_num ? (showContactNum ? contact_num : `********${contact_num.slice(-2)}`) : " "}
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (isEditing) {
                      setIsEditing(false);
                      setPhone(contact_num);
                      setShowPhone(false);
                    } else {
                      setIsEditing(true);
                    }
                  }}
                  className="flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-gray-50 whitespace-nowrap"
                >
                  {isEditing ? 'Save' : 'Edit'}
                </button>

                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => setShowPhone(!showContactNum)}
                    className="flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-gray-50 whitespace-nowrap"
                  >
                    {showContactNum ? 'Hide' : 'Show'}
                  </button>
                )}
              </div>
            </div>
            <div>
              <button
                type="button"
                onClick={handleSubmit}
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
                <img 
                src={imagePreview ? imagePreview.replace('/public/', '/') : '/user/default.png'} 
                alt="Profile" 
                className="w-full h-full object-cover" 
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = '/user/default.png';
                }} 
              />
              ) : (
                <div className="text-gray-400 flex items-center justify-center w-full h-full">
                  Loading...
                </div>
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
              Maximum file size: 1 megabyte<br />
              Supported formats: JPEG, PNG
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}