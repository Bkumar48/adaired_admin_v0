import axios from "axios";
import { useEffect, useState, lazy, Suspense, startTransition } from "react";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    startTransition(() => {
      setLoading(true);
      setProducts([]);
    });
    const fetchPhotos = async () => {
      try {
        const res = await axios.get(
          "https://jsonplaceholder.typicode.com/photos"
        );
        startTransition(() => {
          setProducts(res.data);
          setLoading(false);
          console.log(res.data);
        });
      } catch (error) {
        throw new Error(error);
      }
    };
    fetchPhotos();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        {products.map((product) => {
          return (
            <>
              <div key={product.id}>
                <h1>{product.title}</h1>
                <img src={product.thumbnailUrl} alt={product.title} />
              </div>
              <div><img src={product.url}/></div>
            </>
          );
        })}
      </Suspense>
    </div>
  );
};

export default AllProducts;
