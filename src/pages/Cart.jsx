import axios from "axios";
import { useEffect, useState } from "react";
import {currency} from '../utils/filter';


const{VITE_PATH,VITE_URL}=import.meta.env;


const Cart=()=>{
    const [cart, setCart] = useState([]);


    const getCart=async()=>{
        try{
            const res=await axios.get(`${VITE_URL}/v2/api/${VITE_PATH}/cart`);
            setCart(res.data.data);

        }catch(err){
            console.log(err.response.data);
        }
    }
    
    const deleteCart=async(id)=>{
        try{
            await axios.delete(`${VITE_URL}/v2/api/${VITE_PATH}/cart/${id}`);
            getCart();
            alert("已刪除");
        }catch(err){
            console.log(err.response.data);
        }

        
    }

    const deleteCartAll=async()=>{
        try{
            await axios.delete(`${VITE_URL}/v2/api/${VITE_PATH}/carts`);
            getCart();
            alert("已清空");
        }catch(err){
            console.log(err.response.data);
        }

    }

    const updateCart = async (id, qty = 1) => {
    try {
        const data = {
          product_id: id,
          qty,
         };
      await axios.put(`${VITE_URL}/v2/api/${VITE_PATH}/cart/${id}`, { data });
      getCart();
    } catch (error) {
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      getCart();
    }, 0);

    return () => {
      clearTimeout(timer); 
    };
  }, []);

   return (
    <div className="container mt-4">
      <div>
        <button className="btn btn-outline-danger" type="button" onClick={deleteCartAll}>
          清空購物車
        </button>
      </div>
      <table className="table align-middle">
        <thead>
          <tr>
            <th></th>
            <th>品名</th>
            <th>數量/單位</th>
            <th>單價</th>
          </tr>
        </thead>
        <tbody>
          {cart?.carts &&
            cart?.carts.map((item) => (
              <tr key={item.id}>
                <td>
                  <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => deleteCart(item.id)}>
                    <i className="bi bi-x" /> 刪除
                  </button>
                </td>
                <td>{item.product.title}</td>
                <td>
                  <div className="input-group input-group-sm">
                    <input  type="number" className="form-control" min="1" value={item.qty} onChange={(e) => updateCart(item.id, Number(e.target.value))} />
                    <div className="input-group-text">{item.product.unit}</div>
                  </div>
                </td>
                <td>
                  {/* {item.final_total !== item.total && <small className="text-success">折扣價：</small>} */}
                  {currency(item.final_total)}
                </td>
              </tr>
            ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3" className="text-end">
              總計
            </td>
            <td>{currency(cart?.total)}</td>
          </tr>
          {/* {cart?.final_total !== cart?.total ? (
            <tr>
              <td colSpan="3" className="text-end text-success">
                折扣價
              </td>
              <td className="text-end text-success">{currency(cart?.final_total)}</td>
            </tr>
          ) : (
            ""
          )} */}
        </tfoot>
      </table>
    </div>
  );
}

export default Cart