import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!userData.name || !userData.phone || !userData.address.line1 || !userData.dob) {
      toast.error("Please fill in all required fields.");
      return false;
    }
    return true;
  };

  const updateUserProfileData = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const formData = new FormData();

      formData.append('name', userData.name);
      formData.append('phone', userData.phone);
      formData.append('address', JSON.stringify(userData.address));
      formData.append('gender', userData.gender);
      formData.append('dob', userData.dob);

      image && formData.append('image', image);

      const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, { headers: { token } });

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    userData && (
      <div className="max-w-lg mx-auto p-8 bg-white rounded-lg shadow-lg">
        {/* Profile Section */}
        <div className="flex flex-col items-center mb-8">
          {isEdit ? (
            <label htmlFor="image" className="cursor-pointer relative">
              <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-pink-300 mb-4 shadow-xl hover:scale-105 transition-all">
                <img
                  className="w-full h-full object-cover"
                  src={image ? URL.createObjectURL(image) : userData.image}
                  alt="Profile"
                />
              </div>
              <img className="w-10 absolute bottom-0 right-0" src={image ? '' : assets.upload_icon} alt="" />
              <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
            </label>
          ) : (
            <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-pink-300 mb-4 shadow-xl">
              <img className="w-full h-full object-cover" src={userData.image} alt="Profile" />
            </div>
          )}

          <div className="text-center">
            {isEdit ? (
              <input
                className="bg-pink-100 text-xl font-semibold p-2 rounded-lg w-full transition-all focus:ring-2 focus:ring-pink-500"
                type="text"
                value={userData.name}
                onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))} />
            ) : (
              <p className="text-2xl font-semibold text-gray-800">{userData.name}</p>
            )}
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="mb-6">
          <p className="text-lg font-semibold text-gray-700 mb-4">CONTACT INFORMATION</p>
          <div className="grid grid-cols-2 gap-y-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Email:</p>
              <p className="text-gray-800">{userData.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Phone:</p>
              {isEdit ? (
                <input
                  className="bg-pink-100 text-gray-800 p-3 rounded-lg w-full focus:ring-2 focus:ring-pink-500"
                  type="text"
                  value={userData.phone}
                  onChange={(e) => setUserData((prev) => ({ ...prev, phone: e.target.value }))} />
              ) : (
                <p className="text-gray-800">{userData.phone}</p>
              )}
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium text-gray-600">Address:</p>
              {isEdit ? (
                <div className="space-y-3">
                  <input
                    className="bg-pink-100 p-3 rounded-lg w-full focus:ring-2 focus:ring-pink-500"
                    value={userData.address.line1}
                    type="text"
                    placeholder="Street Address"
                    onChange={(e) =>
                      setUserData((prev) => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))
                    }
                  />
                  <input
                    className="bg-pink-100 p-3 rounded-lg w-full focus:ring-2 focus:ring-pink-500"
                    value={userData.address.line2}
                    type="text"
                    placeholder="Additional Address"
                    onChange={(e) =>
                      setUserData((prev) => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))
                    }
                  />
                </div>
              ) : (
                <p className="text-gray-800">{userData.address.line1}<br />{userData.address.line2}</p>
              )}
            </div>
          </div>
        </div>

        {/* Basic Information Section */}
        <div className="mb-6">
          <p className="text-lg font-semibold text-gray-700 mb-4">BASIC INFORMATION</p>
          <div className="grid grid-cols-2 gap-y-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Gender:</p>
              {isEdit ? (
                <select
                  className="bg-pink-100 text-gray-800 p-3 rounded-lg w-32 shadow-md focus:ring-2 focus:ring-pink-500"
                  value={userData.gender}
                  onChange={(e) => setUserData((prev) => ({ ...prev, gender: e.target.value }))}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              ) : (
                <p className="text-gray-800">{userData.gender}</p>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Birthday:</p>
              {isEdit ? (
                <input
                  className="bg-pink-100 text-gray-800 p-3 rounded-lg w-full focus:ring-2 focus:ring-pink-500"
                  type="date"
                  value={userData.dob}
                  onChange={(e) => setUserData((prev) => ({ ...prev, dob: e.target.value }))} />
              ) : (
                <p className="text-gray-800">{userData.dob}</p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          {isEdit ? (
            <>
              <button
                className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-all"
                onClick={updateUserProfileData}
                disabled={loading}>
                {loading ? 'Saving...' : 'Save Information'}
              </button>
              <button
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-all"
                onClick={() => setIsEdit(false)}>
                Cancel
              </button>
            </>
          ) : (
            <button
              className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-all"
              onClick={() => setIsEdit(true)}>
              Edit
            </button>
          )}
        </div>
      </div>
    )
  );
};

export default MyProfile;
