import { Outlet, Link } from "react-router";

const Layout = () => {
  return (
    <div>
      <header className="d-flex">
        <nav className="m-5 ">
          <Link className="fs-2 text-decoration-none text-black" to="/">
            首頁
          </Link>
        </nav>
        <nav className="m-5 ">
          <Link className="fs-2 text-decoration-none text-black" to="/products">
            產品
          </Link>
        </nav>
        <nav className="m-5 ">
          <Link className="fs-2 text-decoration-none text-black" to="/cart">
            購物車
          </Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="my-3 text-center">
        <h2 className="fw-bold">Game有限公司</h2>
      </footer>
    </div>
  );
};

export default Layout;