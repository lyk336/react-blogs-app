import { useEffect, useState } from 'react';

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw Error('could not fetch the data');
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
        setIsPending(false);
      })
      .catch((error) => {
        console.log(error);
        setIsError(true);
        setIsPending(false);
      });
  }, [url]);
  return { data, isPending, setIsPending, isError };
};

export default useFetch;
