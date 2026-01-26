import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router"

const{VITE_PATH,VITE_URL}=import.meta.env;

const Product=()=>{
   const params=useParams()
   const{id}=params;

   const[product,setproduct]=useState([]);

   //console.log(id);

   useEffect(()=>{
    
        const getProduct=async()=>{
            
        try{
            const res=await axios.get(`${VITE_URL}/v2/api/${VITE_PATH}/product/${id}`);
            setproduct(res.data.product);

        }catch(err){
            console.log(err);
        }
        }
      getProduct()
   },[])

   const addCart= async(id, qty = 1)=>{
    try{
        const data={
            product_id: id,
            qty,
        }
        await axios.post(`${VITE_URL}/v2/api/${VITE_PATH}/cart`,{data});
        alert("已加入");


    }catch(err){
        console.log("加入購物車失敗")
    }
   }

     return (
    <div className="container mt-4">
        <div className="row">
          <div className="col-md-4"></div>
          <div className="col-md-4">
             <div className="card" >
        <img
          src={product.imageUrl}
          className="img-fluid"
          alt={product.title}
        />
        <div className="card-body">
          <h5 className="fs-1 fw-bold ">{product.title}</h5>
          <p className="fw-bold fs-5">
            {product.description}
          </p>
          <p className="fw-bold fs-3">
            分類:{product.category}
          </p>
          <p className="fw-bold fs-3">
            單位:{product.unit}
          </p>
          <p className="fw-bold fs-3">
            原價:<span className="text-decoration-line-through">{product.origin_price} </span>元
          </p>
          <p className="fw-bold fs-3">
            特價:<span className="text-danger">{product.price}</span> 元
          </p>
          <div style={{ textAlign: 'center' }}>
            <button className="btn btn-info fs-1" onClick={() => addCart(product.id)}>立即購買</button>
          </div>
          
        </div>
          </div>

          </div>
         
          <div className="col-md-4"></div>
        </div>
      
    </div>
  );
};

export default Product