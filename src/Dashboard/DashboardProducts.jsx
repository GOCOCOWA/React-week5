import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import * as bootstrap from "bootstrap";
import Pagination from "../component/Pagination";
import ProductModal from "../component/ProductModal";

const{VITE_PATH,VITE_URL}=import.meta.env;


const  DashboardProducts=()=>{
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({});

    const productModalRef = useRef(null);


    const [modalType, setModalType] = useState("");
    const [templateData, setTemplateData] = useState({
    id: "",
    imageUrl: "",
    title: "",
    category: "",
    unit: "",
    origin_price: 0,
    price: 0,
    description: "",
    content: "",
    is_enabled: false,
    imagesUrl: [],
  });
  const navigate = useNavigate();

  const openModal = (product, type) => {
    setTemplateData({
      id: product.id || "",
      imageUrl: product.imageUrl || "",
      title: product.title || "",
      category: product.category || "",
      unit: product.unit || "",
      origin_price: product.origin_price || 0,
      price: product.price || 0,
      description: product.description || "",
      content: product.content || "",
      is_enabled: product.is_enabled || false,
      imagesUrl: product.imagesUrl || [],
    });
    productModalRef.current.show();
    setModalType(type);
  };

  const closeModal=()=>{
    productModalRef.current.hide();
  };

  const handleFileChange=async(e)=>{
    const file=e.target.files?.[0];
    if(!file) return;

    try{
        const formData= new FormData();
        formData.append("file-to-upload", file);

        let res=await axios.post(`${VITE_URL}/v2/api/${VITE_PATH}/admin/upload`,formData);
        const uploadedImageUrl = res.data.imageUrl;

        setTemplateData((pre)=>({
            pre,
            imagesUrl:uploadedImageUrl,
        }));
      }catch(err){
        console.error(err);
      }
  };

  const updateProductData=async(id)=>{
    let productId;
    if(modalType==="edit"){
      productId=`product/${id}`;
    }else{
      productId=`product/`;
    }

    const productData={
       data: {
        ...templateData,
        origin_price: Number(templateData.origin_price),
        price: Number(templateData.price),
        is_enabled: templateData.is_enabled ? 1 : 0,
        imageUrl: templateData.imageUrl,
      },
    };
    try {
      let res;
      if (modalType === "edit") {
        res = await axios.put(`${VITE_URL}/v2/api/${VITE_PATH}/admin/${productId}`, productData);
        console.log("更新成功", res.data);
      } else {
        res = await axios.post(`${VITE_URL}/v2/api/${VITE_PATH}/admin/${productId}`, productData);
        console.log("新增成功", res.data);
      }

      productModalRef.current.hide();
      getProductData();
    } catch (err) {
      if (modalType === "edit") {
        console.error("更新失敗", err.res.data.message);
      } else {
        console.error("新增失敗", err.res.data.message);
      }
    }

  };

  const delProductData=async(id)=>{
    try {
      const response = await axios.delete(
        `${VITE_URL}/v2/api/${VITE_PATH}/admin/product/${id}`
      );
      console.log("刪除成功", response.data);
      productModalRef.current.hide();
      getProductData();
    } catch (err) {
      console.error("刪除失敗", err.response.data.message);
    }
  };
  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setTemplateData((pre) => ({
      ...pre,
      [id]: type === "checkbox" ? checked : value,
    }))
  };
  const handleImageChange = (index, value) => {
    setTemplateData((pre) => {
      const newImages = [...pre.imagesUrl];
      newImages[index] = value;

      if (
        value !== "" &&
        index === newImages.length - 1 &&
        newImages.length < 5
      ) {
        newImages.push("");
      }

      if (newImages.length > 1 && 
          newImages[newImages.length - 1] === ""&& 
          newImages[newImages.length - 2] === "") {
        newImages.pop();
      }

      return { ...pre, imagesUrl: newImages };
    });
  };
  const handleAddImage = () => {
  if (templateData.imagesUrl.length >= 5) {
    alert("最多只能上傳 5 張圖片");
    return;
  }
  
  setTemplateData((pre) => ({
    ...pre,
    imagesUrl: [...pre.imagesUrl, ""],
  }));
  };
  const handleRemoveImage = () => {
  setTemplateData((pre) => {
    if (pre.imagesUrl.length <= 1) return pre; // 如果只剩一格，就不給刪
    const newImages = [...pre.imagesUrl];
    newImages.pop();
    return { ...pre, imagesUrl: newImages };
  });
  };
  const getProductData = async (page = 1) => {
    try {
      const res = await axios.get(
        `${VITE_URL}/v2/api/${VITE_PATH}/admin/products?page=${page}`
      );
      console.log(res);
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (err) {
      console.log(err);
    }
  };
  const toFrontpage =()=>{
    navigate("/");
  }


  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common.Authorization = token;

    const checkAdmin = async () => {
      try {
        await axios.post(`${VITE_URL}/v2/api/user/check`);
        getProductData();
      } catch (err) {
        console.log(err.response.data.message);
        navigate("/login");
      }
    };
    checkAdmin();

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
  }, [navigate]);

  


//${VITE_URL}/v2/api/${VITE_PATH}
 return(
    <>
        <div>
          <div className="container">
            <div className="d-flex justify-content-between mt-4">
              <button
                className="btn btn-primary"
                onClick={() => openModal("", "new")}
              >
                建立新的產品
              </button>
              <button
                className="btn btn-primary"
                onClick={() => toFrontpage ()}
              >
                首頁
              </button>
            </div>
            <table className="table table-hover align-middle mt-4">
  <thead className="table-light">
    <tr className="text-secondary small">
      <th width="120">分類</th>
      <th>產品名稱</th>
      <th width="120" className="text-end">原價</th>
      <th width="120" className="text-end">售價</th>
      <th width="120" className="text-center">狀態</th>
      <th width="140" className="text-center">操作</th>
    </tr>
  </thead>

  <tbody>
    {products.map((product) => (
      <tr key={product.id}>
        <td>
          <span className="badge bg-secondary bg-opacity-10 text-secondary">
            {product.category}
          </span>
        </td>

        <td className="fw-semibold">
          {product.title}
        </td>

        <td className="text-end text-muted">
          ${product.origin_price}
        </td>

        <td className="text-end fw-bold">
          ${product.price}
        </td>

        <td className="text-center">
          {product.is_enabled ? (
            <span className="badge bg-success bg-opacity-10 text-success">
              啟用
            </span>
          ) : (
            <span className="badge bg-secondary bg-opacity-10 text-secondary">
              停用
            </span>
          )}
        </td>

        <td className="text-center">
          <div className="btn-group btn-group-sm">
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => openModal(product, "edit")}
            >
              編輯
            </button>
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => openModal(product, "delete")}
            >
              刪除
            </button>
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</table>

            <Pagination pagination={pagination} changePage={getProductData} />
          </div>
        </div>
      <ProductModal
        modalType={modalType}
        templateData={templateData}
        onCloseModal={closeModal}
        onInputChange={handleInputChange}
        onFileChange={handleFileChange}
        onImageChange={handleImageChange}
        onAddImage={handleAddImage}
        onRemoveImage={handleRemoveImage}
        onUpdateProduct={updateProductData}
        onDeleteProduct={delProductData}
      />
    </>)
}
export default DashboardProducts;