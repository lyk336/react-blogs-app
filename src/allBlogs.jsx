import BlogList from './blogList';
import useFetch from './Utilits/useFetch';

const AllBlogs = () => {
  const { data: blogs, isPending } = useFetch('http://localhost:8000/blogs');

  return (
    <div className='blogs'>
      <h1 className='blogs__title'>All Blogs</h1>
      {isPending && <div className='loading'>Loading</div>}
      {blogs && <BlogList blogs={blogs} />}
    </div>
  );
};

export default AllBlogs;
