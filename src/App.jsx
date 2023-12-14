import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './App.css';
import Navbar from './navbar';
import AllBlogs from './allBlogs';
import RegistrationForm from './registration';
import Cookies from 'js-cookie';
import MyCabinet from './my-cabinet';
import CreateBlog from './createBlog';
import LoginForm from './Login';
import MyPosts from './my-posts';
import BlogDetails from './blogDetails';
import NotFound from './notFound';

function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = Cookies.get('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <BrowserRouter>
      <div className='wrapper'>
        <Navbar user={user} />
        <Routes>
          <Route exact path='/' element={<AllBlogs />} />
          <Route exact path='/login' element={<LoginForm setUser={setUser} />} />
          <Route exact path='/registration' element={<RegistrationForm setUser={setUser} />} />
          <Route exact path='/my-cabinet' element={<MyCabinet user={user} setUser={setUser} />} />
          <Route exact path='/create-blog' element={<CreateBlog user={user} />} />
          <Route exact path='/my-posts' element={<MyPosts user={user} />} />
          <Route exact path='/blogs/:id' element={<BlogDetails user={user} />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
