import { useState, useEffect, useRef } from "react";
//import { RotatingLines } from "react-loader-spinner";
import { useForm } from "react-hook-form";

import axios from "axios";
import * as bootstrap from "bootstrap";


import { currency } from "../utils/filter";

const{VITE_PATH,VITE_URL}=import.meta.env;


function Checkout() {
  const [loadingCartId, setLoadingCartId] = useState(null);
  const [loadingProductId, setLoadingProductId] = useState(null);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({});
  const [pagination, setPagination] = useState({});
  const [cart, setCart] = useState([]);
  const [cartQuantity, setCartQuantity] = useState(1);
  const productModalRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

 
  const getProducts = async (page = 1) => {
    try {
      const res = await axios.get( `${VITE_URL}/v2/api/${VITE_PATH}/products?page=${page}`);
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (err) {
      console.log(err.response.data);
    }
  };


  const getProduct = async (id) => {
    setLoadingProductId(id);
    try {
      const res = await axios.get(`${VITE_URL}/v2/api/${VITE_PATH}/product/${id}`);
      setProduct(res.data.product);
    } catch (err) {
      console.log(err.response.data);
    } finally {
      setLoadingProductId(null);
    }
  };

  //購物車
  const getCart = async () => {
    try {
      const res = await axios.get(`${VITE_URL}/v2/api/${VITE_PATH}/cart`);
      console.log(res)
      setCart(res.data.data);
    } catch (err) {
      console.log(err.response.data);
    }
  };

 
  const addCart = async (id, num) => {
    setLoadingCartId(id);
    const data = {
      product_id: id,
      qty: num,
    };
    try {
      const res=await axios.post( `${VITE_URL}/v2/api/${VITE_PATH}/cart`, { data });
      getCart();
    } catch (err) {
      console.log(err.response.data);
    } finally {
      setLoadingCartId(null);
      productModalRef.current.hide();
      
    }
  };

  
  const deleteCart = async (id) => {
    try {
      await axios.delete(`${VITE_URL}/v2/api/${VITE_PATH}/cart/${id}`);
      getCart();
    } catch (err) {
      console.log(err.response.data);
    }
  };

 
  const deleteCartAll = async () => {
    try {
      await axios.delete(`${VITE_URL}/v2/api/${VITE_PATH}/carts`);
      getCart();
    } catch (err) {
      console.log(err.response.data);
    }
  };

 
  const updateCart = async (cartId, productId, qty = 1) => {
    try {

      const data = {
        product_id: productId,
        qty,
      };
      await axios.put(`${VITE_URL}/v2/api/${VITE_PATH}/cart/${cartId}`, { data });
      getCart();
    } catch (err) {
      console.log(err.response.data);
    }
  };

  const onSubmit = async (data) => {
      try {
        if(!cart.carts.length) {
          alert("購物車沒有商品！");
          return;
        }
        await axios.post(`${VITE_URL}/v2/api/${VITE_PATH}/order`, { data: { user: data, message: data.message } });
        reset();
        getCart();
      } catch (err) {
        console.err(err);
      }
  };

  const openModal = async (id) => {
    productModalRef.current.show();
    setCartQuantity(1);
    getProduct(id);
  };

  const handleClick = (event, page) => {
    event.preventDefault();
    getProducts(page);
  };

  
  useEffect(() => {
    productModalRef.current = new bootstrap.Modal("#productModal", {
      keyboard: false,
    });

    document
      .querySelector("#productModal")
      .addEventListener("hide.bs.modal", () => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      });

    getProducts();
    getCart();
  }, []);

  return (
    <div className="container my-5">

  {/* Product Modal */}
  <div className="modal fade" id="productModal" ref={productModalRef}>
    <div className="modal-dialog modal-lg modal-dialog-centered">
      <div className="modal-content border-0 shadow">
        <div className="modal-header">
          <h5 className="modal-title fw-bold">
            {product.title}
          </h5>
          <button type="button" className="btn-close" data-bs-dismiss="modal" />
        </div>

        <div className="modal-body">
          <div className="row g-4">
            <div className="col-md-6">
              <img
                src={product.imageUrl}
                className="img-fluid rounded"
                alt={product.title}
              />
            </div>

            <div className="col-md-6">
              <p className="text-muted">{product.description}</p>

              <p>
                <del className="text-muted">
                  原價 {currency(product.origin_price)} 元
                </del>
              </p>

              <p className="fs-4 fw-bold text-danger">
                特價 {currency(product.price)} 元
              </p>

              <div className="d-flex align-items-center gap-2 mt-3">
                <span className="text-muted">數量</span>

                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() =>
                    setCartQuantity((q) => (q === 1 ? 1 : q - 1))
                  }
                >
                  −
                </button>

                <input
                  type="number"
                  className="form-control text-center"
                  style={{ width: 80 }}
                  value={cartQuantity}
                  min="1"
                  onChange={(e) => setCartQuantity(Number(e.target.value))}
                />

                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setCartQuantity((q) => q + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-danger px-4"
            onClick={() => addCart(product.id, cartQuantity)}
          >
            加入購物車
          </button>
        </div>
      </div>
    </div>
  </div>

  {/* 產品列表 */}
  <div className="card shadow-sm mb-5">
    <div className="card-body">
      <table className="table table-hover align-middle">
        <thead className="table-light small text-muted">
          <tr>
            <th width="200">圖片</th>
            <th>產品名稱</th>
            <th width="200">價格</th>
            <th width="180" className="text-center">操作</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <div
                  className="rounded"
                  style={{
                    height: 100,
                    backgroundImage: `url(${product.imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              </td>

              <td className="fw-semibold">{product.title}</td>

              <td>
                <small className="text-muted">
                  <del>原價 {currency(product.origin_price)}</del>
                </small>
                <div className="fw-bold text-danger">
                  特價 {currency(product.price)}
                </div>
              </td>

              <td className="text-center">
                <div className="btn-group btn-group-sm">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => openModal(product.id)}
                    disabled={loadingProductId === product.id}
                  >
                    查看
                  </button>

                  <button
                    className="btn btn-outline-danger"
                    onClick={() => addCart(product.id, 1)}
                    disabled={loadingCartId === product.id}
                  >
                    加入
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
   {/* 分頁 */}
      <nav aria-label="Page navigation example">
        <ul className="pagination">
          <li className="page-item">
            <a
              href="/"
              className={`page-link ${pagination.has_pre ? "" : "disabled"}`}
              onClick={(event) =>
                handleClick(event, pagination.current_page - 1)
              }
            >
              <span>&laquo;</span>
            </a>
          </li>
          {[...new Array(pagination.total_pages)].map((_, i) => (
            <li className="page-item" key={`${i}_page`}>
              <a
                className={`page-link ${
                  i + 1 === pagination.current_page && "active"
                }`}
                href="/"
                onClick={(event) => handleClick(event, i + 1)}
              >
                {i + 1}
              </a>
            </li>
          ))}
          <li className="page-item">
            <a
              className={`page-link ${pagination.has_next ? "" : "disabled"}`}
              onClick={(event) =>
                handleClick(event, pagination.current_page + 1)
              }
              href="/"
          
            >
              <span >&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>

  {/* 購物車 */}
  <div className="card shadow-sm mb-5">
    <div className="card-header d-flex justify-content-between align-items-center">
      <h6 className="mb-0 fw-bold">購物車</h6>
      <button className="btn btn-outline-danger btn-sm" onClick={deleteCartAll}>
        清空
      </button>
    </div>

    <div className="card-body">
      <table className="table align-middle">
        <tbody>
          {cart?.carts?.map((item) => (
            <tr key={item.id}>
              <td width="50">
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => deleteCart(item.id)}
                >
                  ✕
                </button>
              </td>

              <td>{item.product.title}</td>

              <td width="160">
                <input
                  type="number"
                  className="form-control form-control-sm"
                  min="1"
                  value={item.qty}
                  onChange={(e) =>
                    updateCart(item.id, item.product_id, Number(e.target.value))
                  }
                />
              </td>

              <td className="text-end fw-bold">
                {currency(item.final_total)}
              </td>
            </tr>
          ))}
        </tbody>

        <tfoot>
          <tr>
            <td colSpan="3" className="text-end text-muted">
              總計
            </td>
            <td className="text-end fw-bold">
              {currency(cart?.final_total)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>

  {/* 表單 */}
  <div className="card shadow-sm my-5">
  <div className="card-body">
    <h5 className="fw-bold mb-4">填寫訂單資料</h5>

    <form onSubmit={handleSubmit(onSubmit)} className="row g-3">

      {/* 收件人姓名 */}
      <div className="col-md-6">
        <label htmlFor="name" className="form-label">
          收件人姓名
        </label>
        <input
          id="name"
          type="text"
          className="form-control"
          placeholder="請輸入姓名"
          {...register("name", { required: "請輸入收件人姓名。" })}
        />
        {errors.name && (
          <small className="text-danger">{errors.name.message}</small>
        )}
      </div>

      {/* Email */}
      <div className="col-md-6">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="form-control"
          placeholder="請輸入 Email"
          {...register("email", {
            required: "請輸入 Email。",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Email 格式不正確。",
            },
          })}
        />
        {errors.email && (
          <small className="text-danger">{errors.email.message}</small>
        )}
      </div>

      {/* 電話 */}
      <div className="col-md-6">
        <label htmlFor="tel" className="form-label">
          收件人電話
        </label>
        <input
          id="tel"
          type="tel"
          className="form-control"
          placeholder="請輸入電話"
          {...register("tel", {
            required: "請輸入收件人電話。",
            minLength: {
              value: 8,
              message: "電話號碼至少 8 碼。",
            },
            pattern: {
              value: /^\d+$/,
              message: "僅能輸入數字。",
            },
          })}
        />
        {errors.tel && (
          <small className="text-danger">{errors.tel.message}</small>
        )}
      </div>

      {/* 地址 */}
      <div className="col-md-6">
        <label htmlFor="address" className="form-label">
          收件人地址
        </label>
        <input
          id="address"
          type="text"
          className="form-control"
          placeholder="請輸入地址"
          {...register("address", {
            required: "請輸入收件人地址。",
          })}
        />
        {errors.address && (
          <small className="text-danger">{errors.address.message}</small>
        )}
      </div>

      {/* 留言 */}
      <div className="col-12">
        <label htmlFor="message" className="form-label">
          留言
        </label>
        <textarea
          id="message"
          className="form-control"
          rows="3"
          placeholder="有任何備註請填寫"
          {...register("message")}
        />
      </div>

      {/* 送出 */}
      <div className="col-12 text-end">
        <button type="submit" className="btn btn-danger px-5">
          送出訂單
        </button>
      </div>

    </form>
  </div>
</div>

</div>

  )
}

export default Checkout;