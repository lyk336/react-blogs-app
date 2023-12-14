import { Link } from 'react-router-dom';

/* eslint-disable react/prop-types */
const BlogList = ({ blogs }) => {
  return (
    <div className='blogs__list'>
      {blogs.map((blog) => {
        // limit max count of showing text to 500
        let blogBody = blog.body;
        if (blogBody.length > 500) {
          blogBody = `${blogBody.substring(0, 500)}...`;
        }
        return (
          <article className='blog' key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>
              <h2 className='blog__title'>{blog.title}</h2>
              <p className='blog__text'>{blogBody}</p>
              <div className='blog__details'>
                <p className='blog__post-time'>{blog.postTime}</p>
                <p className='blog__author'>by: {blog.author}</p>
              </div>
            </Link>
          </article>
        );
      })}
    </div>
  );
};

export default BlogList;
