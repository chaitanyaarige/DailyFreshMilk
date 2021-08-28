import './Navbar.scss';
import { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import DailyMilkFreshLogo from 'logo.png';
import settingsIcon from 'components/common/settingsIcon.svg';
import cartIcon from 'components/common/cartIcon.svg';
import usersIcon from 'components/common/users.svg';
import userBadge from 'components/common/userBadge.svg';
import cloudDownload from 'components/common/cloudDownload.svg';

export default function Navbar(props) {
  const [adminMenuOptions] = useState([
    {
      title: 'Orders',
      value: 'orders_list',
    },
    {
      title: 'Agents',
      value: 'agents_list',
    },
    {
      title: 'Users',
      value: 'users_list',
    },
    // {
    //   title: 'Statistics',
    //   value: 'production_statistics',
    // },
    { title: 'Export Data', value: 'export_data' },
    {
      value: 'settings',
      title: 'settings',
    },
  ]);
  const [agentMenuOptions] = useState([
    {
      title: 'Orders',
      value: 'orders_list',
    },
    {
      title: 'settings',
      value: 'settings',
    },
  ]);

  let history = useHistory();
  const openSidebarMenus = useRef();
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  function useOutsideAlerter(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          openSidebarMenus.current.checked = false;
        }
      }

      // Bind the event listener
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [ref]);
  }

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.clear();
    return history.push('/');
  };

  const homepage = (e) => {
    e.preventDefault();
    return history.push('/');
  };

  const changeMenu = (e, sal) => {
    e.preventDefault();
    props.currentMenuSelection(sal); // emitting data to parent
    openSidebarMenus.current.checked = false;
  };

  const menuIcon = (menuNumber) => {
    switch (menuNumber.toString()) {
      case '1':
        return cartIcon;
      case '2':
        return userBadge;
      case '3':
        return usersIcon;
      case '4':
        return cloudDownload;
      case '5':
        return settingsIcon;
      default:
        return settingsIcon;
    }
  };

  const menuitems = props.isAdmin ? adminMenuOptions : agentMenuOptions;

  return (
    <div ref={wrapperRef} className="Navbar__header">
      <div>
        <input
          type="checkbox"
          ref={openSidebarMenus}
          className="openSidebarMenu"
          id="openSidebarMenu"
        ></input>
        <label htmlFor="openSidebarMenu" className="Navbar__sidebarIconToggle">
          <div className="spinner diagonal part-1"></div>
          <div className="spinner horizontal"></div>
          <div className="spinner diagonal part-2"></div>
        </label>

        <div id="sidebarMenu" className="Navbar__sidebarMenu">
          <div className="Navbar__sidebarMenu-header">
            {props.isAdmin ? 'Admin' : 'Agent'} Dashboard <br />
            <span>Have a Happy Day </span>
          </div>

          <ul className="Navbar__sidebarMenu-inner">
            {menuitems.map((item, i) => {
              return (
                <li key={i}>
                  <div className="Navbar__sideMenu-icons">
                    <img
                      className="Navbar__sideMenu-icons-img"
                      src={menuIcon(i + 1)}
                      alt="settings"
                    ></img>
                    <span onClick={(e) => changeMenu(e, item.value)}>
                      {item.title}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div onClick={(e) => homepage(e)} className="Navbar__component-name">
        <img
          height="80px"
          width="150px"
          src={DailyMilkFreshLogo}
          alt="Daily"
        ></img>
      </div>
      <div onClick={handleLogout} className="Navbar__logout-container">
        <div className="Navbar__logout-image">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            fill="white"
            className="bi bi-person-circle"
            viewBox="0 0 16 16"
          >
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
            <path
              fillRule="evenodd"
              d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
            />
          </svg>
        </div>
        <div className="Navbar__logout-text">LOGOUT</div>
      </div>
    </div>
  );
}