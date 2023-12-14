/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ user }) => {
  const currentUrl = useLocation();
  const [isMenuEnabled, setIsMenuEnabled] = useState(false);

  useEffect(() => {
    if (isMenuEnabled) {
      setIsMenuEnabled(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUrl]);

  // should hide navbar on login or registration pages
  if (currentUrl.pathname === '/login' || currentUrl.pathname === '/registration') {
    return '';
  }

  const handleMenu = () => {
    isMenuEnabled ? setIsMenuEnabled(false) : setIsMenuEnabled(true);
  };

  return (
    <nav className='navbar'>
      <button className='navbar__menu' onClick={handleMenu}>
        <span className={isMenuEnabled ? 'navbar__menu-enabled' : 'navbar__menu-enabled navbar__menu-disabled'}></span>
      </button>
      <ul className={`navbar__links ${isMenuEnabled ? 'navbar__links-enabled' : 'navbar__links-diabled'}`}>
        <li className='navbar__link'>
          <Link to='/'>All blogs</Link>
        </li>
        {user && (
          <li className='navbar__link'>
            <Link to='/my-posts'>My posts</Link>
          </li>
        )}
        {user && (
          <li className='navbar__link'>
            <Link to='/create-blog'>New blog</Link>
          </li>
        )}
      </ul>
      {user ? (
        <div className='navbar__user'>
          <Link to='/my-cabinet'>{user.name}</Link>
        </div>
      ) : (
        <div className='navbar__login'>
          <Link to='/login'>Log In</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
