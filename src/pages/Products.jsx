import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const{VITE_PATH,VITE_URL}=import.meta.env;
//console.log(VITE_PATH,VITE_URL);


const Products=()=>{
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);


    const handleDetail=async(id)=>{
        try{
            const res=await axios.get(`${VITE_URL}/v2/api/${VITE_PATH}/product/${id}`);
            navigate(`/product/${id}`);

        }catch(err){
            console.log(err);
        }
    }


    useEffect(()=>{
        const getProducts=async()=>{
            try{

                const res=await axios.get(`${VITE_URL}/v2/api/${VITE_PATH}/products/all`);
                //console.log(res.data.products);
                setProducts(res.data.products);

            }catch(err){
                console.log(err);
            }
        }

         getProducts();
    },[])




    return(
       <div className="container my-4 m">
      <div className="row">
        {products.map((product) => (
          <div className="col-md-3 p-2" key={product.id}>
            <div className="card">
              <img
                src={product.imageUrl}
                className="img-fluid"
                alt={product.title}
              />
              <div className="card-body">
                <h5 className="fw-bold fs-3">{product.title}</h5>
                <p className="fs-4">
                  {product.description}
                </p>
                <p className="fw-bold">
                  <span >價格:</span>{product.price} TWD
                </p>
                <div className="d-flex justify-content-center">
                    <button
                  className="btn btn-outline-info fw-bold fs-2"
                  onClick={() => handleDetail(product.id)}
                >
                  詳細
                </button>
                </div>
                
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    )
}

export default Products