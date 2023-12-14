import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import handleInputChange from './Utilits/handleInputChange';

/* eslint-disable react/prop-types */
const MyCabinet = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const [disappearing, setDisappearing] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [bio, setBio] = useState('');
  const [deleteInputValue, setDeleteInputValue] = useState('');
  const [canDelete, setCanDelete] = useState(false);

  useEffect(() => {
    // if unlogged and tries to go to "my cabinet" => redirect
    const storedUser = Cookies.get('user');
    if (!storedUser) {
      navigate('/');
      return;
    }

    setBio((user && user.bio) || 'No BIO');

    // checking delete account input value to define whether user can delete it or can't
    if (deleteInputValue.toLowerCase() === 'delete') {
      setCanDelete(true);
    } else {
      setCanDelete(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, deleteInputValue]);

  const handleEdit = (event) => {
    if (event.key && event.key !== 'Enter') {
      return;
    }
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
    setIsEditing(false);
    setIsPending(true);
    fetch(`http://localhost:8000/accounts/${user.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bio }),
    }).then(() => {
      setIsPending(false);
      const userCopy = { ...user };
      userCopy.bio = bio;
      setUser(userCopy);
      Cookies.set('user', JSON.stringify(userCopy));
    });
  };
  const handleLogOut = () => {
    Cookies.remove('user');
    setUser(null);
    navigate('/');
  };
  const handleDeleteAccount = () => {
    if (isDeleting && !timeoutId) {
      setDisappearing(true);
      clearTimeout(timeoutId);
      setTimeoutId(
        setTimeout(() => {
          setIsDeleting(false);
        }, 500)
      );
    } else {
      setIsDeleting(true);
      setDisappearing(false);
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  };
  const handleConfirmDelete = (event) => {
    if (event.key && event.key !== 'Enter') {
      return;
    }

    if (canDelete) {
      setIsPending(true);
      fetch(`http://localhost:8000/accounts/${user.id}`, {
        method: 'DELETE',
      }).then(() => {
        setIsPending(false);
        Cookies.remove('user');
        setUser(null);
        navigate('/');
      });
    }
  };

  return (
    <div className='my-cabinet'>
      <div className='user'>
        <div className='user__avatar'>
          <img src='src/images/default-avatar.png' />
        </div>
        <div className='user__info'>
          <h2 className='user__name'>{user && user.name}</h2>
          <div className='user__about'>
            <div className='user__bio'>
              {/* bio */}
              {isEditing ? (
                <textarea
                  cols='30'
                  rows='10'
                  className='user__bio-input'
                  maxLength='100'
                  value={bio}
                  onChange={(event) => {
                    handleInputChange(setBio, event);
                  }}
                  onKeyDown={(event) => {
                    handleEdit(event);
                  }}
                ></textarea>
              ) : (
                <p>{bio}</p>
              )}
              {/* --- */}
              <button className={isEditing ? 'edit-submit' : 'edit'} disabled={isPending} onClick={handleEdit}>
                {isEditing ? 'submit' : 'edit'}
              </button>
            </div>
            <p className='user__registration-date'>Date of registration: {user && user.registrationDate}</p>
          </div>
        </div>
      </div>
      <div className='my-cabinet__management'>
        <Link to='/create-blog' className='my-cabinet__button button-newblog'>
          New blog
        </Link>
        <button className='my-cabinet__button my-cabinet__logout' onClick={handleLogOut}>
          Log out
        </button>
        <button className='my-cabinet__button my-cabinet__delete-account' onClick={handleDeleteAccount}>
          {disappearing ? 'Delete accout' : 'Cancel delete'}
        </button>
        {isDeleting && (
          <div className={`my-cabinet__confirmation confirm-delete ${disappearing ? 'disapearing' : ''}`}>
            <h3 className='confirm-delete__text'>Are you sure? Type &quot;delete&quot; below to delete account</h3>
            <input
              type='text'
              placeholder='delete'
              className='confirm-delete__input'
              onChange={(event) => {
                handleInputChange(setDeleteInputValue, event);
              }}
              onKeyDown={(event) => {
                handleConfirmDelete(event);
              }}
            />
            <button
              className='confirm-delete__confirm'
              onClick={(event) => {
                handleConfirmDelete(event);
              }}
              disabled={!canDelete}
            >
              Confirm
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCabinet;
