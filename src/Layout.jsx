import { Outlet, Link } from "react-router";

const Layout = () => {
  return (
    <div>
      <header className="d-flex">
        <nav className="m-5 ">
          <Link className="fs-2" to="/">
            首頁
          </Link>
        </nav>
        <nav className="m-5 ">
          <Link className="fs-2" to="/products">
            產品
          </Link>
        </nav>
        <nav className="m-5 ">
          <Link className="fs-2" to="/cart">
            購物車
          </Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="my-3 text-center">
        <h2>6666有限公司</h2>
      </footer>
    </div>
  );
};

export default Layout;