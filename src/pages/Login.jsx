import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";

import axios from "axios";

const{VITE_PATH,VITE_URL}=import.meta.env;

function Login() {
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm();

  const [authData, setAuthData] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (data) => {
    try {
      const response = await axios.post(`${VITE_URL}/admin/signin`, data);
      const { token, expired } = response.data;

      setAuthData({ token, expired });
    } catch (err) {
      alert(`登入失敗：${err.response.data.message}`);
    }
  };

  useEffect(() => {
    const existingToken = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );

    if (existingToken) {
      axios.defaults.headers.common.Authorization = existingToken;
      navigate("/dashboard/products");
      return;
    }

    if (authData) {
      const { token, expired } = authData;
      
      document.cookie = `hexToken=${token};expires=${new Date(expired)};path=/`;
      axios.defaults.headers.common.Authorization = token;

      alert("登入成功！");
      navigate("/dashboard/products");
    }
  }, [authData, navigate]);


  return (
    <div className="container login mt-5">
      <div className="row justify-content-center">
        <h1 className="h3 mb-3 font-weight-normal text-center">請先登入</h1>
        <div className="col-8">
          <form id="form" className="form-signin" onSubmit={handleSubmit(handleLogin)}>
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                id="username"
                {...register("username", {
                  required: "請輸入 Email 地址",
                  pattern: { value: /^\S+@\S+$/i, message: "格式不正確" },
                })}
                required
                autoFocus
              />
              <label htmlFor="username">Email address</label>
              {errors.username && <p className="text-danger mt-1">{errors.username.message}</p>}
            </div>
            <div className="form-floating">
              <input
                type="password"
                className="form-control"
                id="password"
                {...register("password", {
                  required: "請輸入 密碼",
                  minLength: { value: 10, message: "至少需 10 碼" },
                })}
                required
              />
              <label htmlFor="password">Password</label>
              {errors.password && <p className="text-danger mt-1">{errors.password.message}</p>}
            </div>
            <button className="btn btn-lg btn-primary w-100 mt-3" type="submit">
              登入
            </button>
          </form>
        </div>
      </div>
      
    </div>
  );
}

export default Login;