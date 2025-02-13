import Header from "../../components/header";
import { Outlet } from "react-router-dom";
import Footer from "../../components/footer";

function UserLayout() {
  return (
    <div className="layout">
      <Header />
      <div className="content">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default UserLayout;
