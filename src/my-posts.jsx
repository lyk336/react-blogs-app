/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import BlogList from './blogList';
import useFetch from './Utilits/useFetch';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

// eslint-disable-next-line react/prop-types
const MyPosts = ({ user }) => {
  const navigate = useNavigate();
  const { data: blogs, isPending } = useFetch('http://localhost:8000/blogs');
  const [filteredBlogs, setFilteredBlogs] = useState(null);

  useEffect(() => {
    // if unlogged and tries to go to this page => redirect
    const storedUser = Cookies.get('user');
    if (!storedUser) {
      navigate('/');
      return;
    }
    if (!blogs) {
      return;
    }

    setFilteredBlogs(blogs.filter((blog) => blog.authorId === user.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, blogs]);
  return (
    <div className='blogs'>
      <h1 className='blogs__title'>My posts</h1>
      {isPending && <div className='loading'>Loading</div>}
      {filteredBlogs && <BlogList blogs={filteredBlogs} />}
    </div>
  );
};

export default MyPosts;
