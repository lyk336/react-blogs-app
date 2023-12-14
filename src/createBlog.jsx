/* eslint-disable react/prop-types */
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import handleInputChange from './Utilits/handleInputChange';

const CreateBlog = ({ user }) => {
  const navigate = useNavigate();
  const [letterCount, setLetterCount] = useState(0);
  const [title, setTitle] = useState('');
  const [blogText, setBlogText] = useState('');
  const [canPost, setCanPost] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    // if unlogged and tries to go to this page => redirect
    const storedUser = Cookies.get('user');
    if (!storedUser) {
      navigate('/');
      return;
    }
    if (title.length < 1 || blogText.length < 1) {
      setCanPost(false);
    } else {
      setCanPost(true);
    }
    setLetterCount(blogText.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, blogText]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canPost) {
      return;
    }

    const date = new Date();
    const currentMinutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    const postTime = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${date.getHours()}:${currentMinutes}`;
    const blog = {
      title,
      body: blogText,
      author: user.name,
      authorId: user.id,
      postTime,
    };

    setIsPending(true);
    fetch('http://localhost:8000/blogs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(blog),
    }).then(() => {
      setIsPending(false);
      navigate('/');
    });
  };

  return (
    <div className='create'>
      <form className='create__form form'>
        <label htmlFor='create__title' className='input-label'>
          Title of your post
        </label>
        <input
          type='text'
          className='create__title-input'
          id='create__title'
          placeholder='Title'
          minLength='1'
          maxLength='40'
          onChange={(event) => {
            handleInputChange(setTitle, event);
          }}
        />
        <label htmlFor='create__body' className='input-label'>
          Share your feelings
        </label>
        <div className='create__body-container'>
          <textarea
            className='create__body'
            id='create__body'
            cols='30'
            rows='10'
            placeholder='I want to write about...'
            minLength='1'
            maxLength='2000'
            onChange={(event) => {
              handleInputChange(setBlogText, event);
            }}
          ></textarea>
          <div className='create__counter'>{letterCount}/2000</div>
        </div>
        <input
          type='submit'
          value='Submit'
          className='create__submit submit'
          disabled={!canPost || isPending}
          onClick={(event) => {
            handleSubmit(event);
          }}
        />
      </form>
    </div>
  );
};

export default CreateBlog;
