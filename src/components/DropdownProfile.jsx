import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Transition from '../utils/Transition';
import authService from '../Services/authService';
import axios from 'axios';
import UserAvatar from '../images/user-avatar-32.png';


function DropdownProfile({ align }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  const navigate = useNavigate();
  const trigger = useRef(null);
  const dropdown = useRef(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const info = await authService.getUserInfo();
        setUserInfo(info);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    fetchUserInfo();
  }, []);



  const handleLogout = () => {
    authService.logout().then(() => {
      setDropdownOpen(false);
      navigate('/login');
    });
  };


  const handleViewProfile = () => {
    setDropdownOpen(false);
    navigate('/profile');
  };

  const getNamePrefix = () => {
    const pastorNames = ['Name1', 'Name2', /* ... add all 12 names */];
    if (pastorNames.includes(userInfo.first_name)) return 'Pastor';
    return userInfo.gender === 'Male' ? 'Bro' : 'Sis';
  };

  const displayName = `${getNamePrefix()} ${userInfo.first_name || ''}`;

  // Fetch profile data on "View Profile" click
  // const handleViewProfile = async () => {
  //   try {
  //     const response = await axios.get(`https://tlbc-platform-api.onrender.com/api/user/`, {
  //       headers: { Authorization: `Bearer ${accessToken}` },
  //     });
  //     const profileData = response.data;

      // Pass the profile data to the UserProfile page using state
  //     navigate('/profile', { state: { profileData } });
  //   } catch (error) {
  //     console.error('Error fetching profile data:', error);
  //   }
  // };


  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (!dropdownOpen || dropdown.current.contains(target) || trigger.current.contains(target)) return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        className="inline-flex justify-center items-center group"
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
          <svg
          className="w-8 h-8 rounded-full fill-current text-gray-600 dark:text-gray-100"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
        <div className="flex items-center truncate">
          {/* <span className="truncate ml-2 text-sm font-medium text-gray-600 dark:text-gray-100 group-hover:text-gray-800 dark:group-hover:text-white">
            My Profile
          </span> */}
          <svg
            className="w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500"
            viewBox="0 0 12 12"
          >
            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
          </svg>
        </div>
      </button>

      <Transition
        className={`origin-top-right z-10 absolute top-full min-w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 py-1.5 rounded-lg shadow-lg overflow-hidden mt-1 ${align === 'right' ? 'right-0' : 'left-0'}`}
        show={dropdownOpen}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div
          ref={dropdown}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
        >
          <div className="pt-0.5 pb-2 px-3 mb-1 border-b border-gray-200 dark:border-gray-700/60">
            <div className="font-medium text-gray-800 dark:text-gray-100">{displayName}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 italic">{userInfo.role}</div>
          </div>
          <ul>
          <li>
              <Link
                className="font-medium text-sm text-violet-500 hover:text-violet-600 dark:hover:text-violet-400 flex items-center py-1 px-3"
                to="/profile"
                onClick={handleViewProfile}
              >
                View Profile
              </Link>
            </li>
            <li>
              <Link
                className="font-medium text-sm text-violet-500 hover:text-violet-600 dark:hover:text-violet-400 flex items-center py-1 px-3"
                to="/dashboard"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                Settings
              </Link>
            </li>
            <li>
              <Link
                className="font-medium text-sm text-violet-500 hover:text-violet-600 dark:hover:text-violet-400 flex items-center py-1 px-3"
                // to="/logout"
                // onClick={() => setDropdownOpen(!dropdownOpen)}
                onClick={handleLogout}
              >
                Log out
              </Link>
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  )
}

export default DropdownProfile;