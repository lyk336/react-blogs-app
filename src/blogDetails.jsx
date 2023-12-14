/* eslint-disable react/prop-types */
import { useNavigate, useParams } from 'react-router-dom';
import useFetch from './Utilits/useFetch';
import { useEffect, useState } from 'react';

const BlogDetails = ({ user }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: blog, isError } = useFetch(`http://localhost:8000/blogs/${id}`);
  const [isWrittenByUser, setIsWrittenByUser] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    // if this page does not exist => redirect ro 404 page
    if (isError) {
      navigate('/404');
      return;
    }
    // author of this blog can delete it
    if (user && blog && user.id === blog.authorId) {
      setIsWrittenByUser(true);
    } else {
      setIsWrittenByUser(false);
    }
  }, [user, blog, isError, navigate]);

  const handleDelete = () => {
    setIsPending(true);
    fetch(`http://localhost:8000/blogs/${id}`, {
      method: 'DELETE',
    }).then(() => {
      setIsPending(false);
      navigate('/');
    });
  };

  return (
    <div className='blog-page'>
      {blog && (
        <div className='blog-page__blog'>
          <h1 className='blog-page__title'>{blog.title}</h1>
          <p className='blog-page__text'>{blog.body}</p>
          <div className='blog-page__info'>
            <p className='blog-page__date'>{blog.postTime}</p>
            <p className='blog-page__author'>By: {blog.author}</p>
          </div>
        </div>
      )}
      {isWrittenByUser && (
        <button className='blog-page__delete' onClick={handleDelete} disabled={isPending}>
          Delete post
        </button>
      )}
    </div>
  );
};

export default BlogDetails;
