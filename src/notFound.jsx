import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className='not-found'>
      <h1 className='not-found__title'>404</h1>
      <p className='not-found__description'>The page you are looking for does not exist</p>
      <div className='not-found__link'>
        <Link to='/'>Back to main page</Link>
      </div>
    </div>
  );
};

export default NotFound;
