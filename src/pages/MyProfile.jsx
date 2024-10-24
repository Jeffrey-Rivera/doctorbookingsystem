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

  const updateUserProfileData = async () => {
    try {
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
      toast.error(error.message);
    }
  };

  return (
    userData && (
      <div className="max-w-lg mx-auto p-6 flex flex-col gap-4 bg-pink-50 rounded-lg text-sm">
        <div className="flex items-center gap-4">
          {isEdit ? (
            <label htmlFor="image">
              <div className="inline-block relative cursor-pointer">
                <img
                  className="w-36 rounded-full border-4 border-pink-200"
                  src={image ? URL.createObjectURL(image) : userData.image}
                  alt=""
                />
                <img className="w-10 absolute bottom-2 right-2" src={image ? '' : assets.upload_icon} alt="" />
              </div>
              <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
            </label>
          ) : (
            <img className="w-36 rounded-full border-4 border-pink-200" src={userData.image} alt="Profile" />
          )}

          <div>
            {isEdit ? (
              <input
                className="bg-pink-50 text-3xl font-medium max-w-60 mt-4 p-2 rounded"
                type="text"
                value={userData.name}
                onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))} />
            ) : (
              <p className="font-medium text-3xl text-neutral-800 mt-4">{userData.name}</p>
            )}
          </div>
        </div>

        <hr className="bg-pink-300 h-[1px] border-none" />

        <div className="">
          <p className="underline mt-3 font-semibold">CONTACT INFORMATION</p>
          <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3">
            <p className="font-medium">Email:</p>
            <p className="text-neutral-800 ">{userData.email}</p>

            <p className="font-medium">Phone:</p>
            {isEdit ? (
              <input
                className="bg-pink-100 max-w-52 p-2 rounded"
                type="text"
                value={userData.phone}
                onChange={(e) => setUserData((prev) => ({ ...prev, phone: e.target.value }))}
              />
            ) : (
              <p className="text-neutral-800 ">{userData.phone}</p>
            )}

            <p className="font-medium">Address:</p>
            {isEdit ? (
              <div className="flex flex-col gap-2">
                <input
                  className="bg-pink-100 p-2 rounded"
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line1: e.target.value },
                    }))
                  }
                  value={userData.address.line1}
                  type="text"
                  placeholder="Street Address" />

                <input
                  className="bg-pink-100 p-2 rounded"
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line2: e.target.value },
                    }))
                  }
                  value={userData.address.line2}
                  type="text"
                  placeholder="Additional Address"
                />
              </div>
            ) : (
              <p className="text-neutral-800 ">
                {userData.address.line1}
                <br />
                {userData.address.line2}
              </p>
            )}
          </div>
        </div>

        <div className=''>
          <p className="underline mt-3 font-semibold">BASIC INFORMATION</p>
          <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3">
            <p className="font-medium">Gender:</p>
            {isEdit ? (
              <select
                className="max-w-20 bg-pink-100 p-2 rounded"
                onChange={(e) => setUserData((prev) => ({ ...prev, gender: e.target.value }))}
                value={userData.gender}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            ) : (
              <p className="text-neutral-800 ">{userData.gender}</p>
            )}

            <p className="font-medium">Birthday:</p>
            {isEdit ? (
              <input
                className="w-36 bg-pink-100 p-2 rounded"
                type="date"
                onChange={(e) => setUserData((prev) => ({ ...prev, dob: e.target.value }))}
                value={userData.dob} />
            ) : (
              <p className="text-neutral-800 ">{userData.dob}</p>
            )}
          </div>
        </div>

        <div className="mt-10">
          {isEdit ? (
            <>
              <button
                className="bg-white border-pink-300 px-8 py-2 rounded-full hover:bg-pink-300 hover:text-white transition-all"
                onClick={updateUserProfileData}>
                Save information
              </button>
              <button
                className="bg-white border-pink-300 px-8 py-2 rounded-full hover:bg-red-400 hover:text-white transition-all ml-8"
                onClick={() => setIsEdit(false)}> {/* Adjust this to your function to go back to the profile page */}
                Cancel
              </button>
            </>
          ) : (
            <button
              className="bg-white border-pink-300 px-8 py-2 rounded-full hover:bg-pink-300 hover:text-white transition-all"
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
