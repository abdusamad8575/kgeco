import Dashboard from "pages/Dashboard";
import Category from "pages/Category";
import Products from "pages/Products";
import Coupon from "pages/Coupon";
import Orders from "pages/Orders";
import Banner from "pages/Banner";
import Blogs from "pages/Blogs";
import Settings from "pages/Settings";
import Billing from "layouts/billing";
import Profile from "layouts/profile";
import Box from "components/Box";

const routes = [
  // {
  //   type: "route",
  //   name: "Dashboard",
  //   key: "dashboard",
  //   route: "/dashboard",
  //   icon: <Box component="i" color="primary" fontSize="14px" className="ni ni-tv-2" />,
  //   component: <Dashboard />,
  // },
  {
    type: "route",
    name: "Categories",
    key: "category",
    route: "/category",
    icon: <Box component="i" color="info" fontSize="14px" className="ni ni-single-copy-04" />,
    component: <Category />,
  },
  {
    type: "route",
    name: "Products",
    key: "products",
    route: "/products",
    icon: <Box component="i" color="primary" fontSize="14px" className="ni ni-bulb-61" />,
    component: <Products />,
  },
  {
    type: "route",
    name: "Orders",
    key: "orders",
    route: "/orders",
    icon: <Box component="i" color="warning" fontSize="14px" className="ni ni-cart" />,
    component: <Orders />,
  },
  {
    type: "route",
    name: "Banners",
    key: "banners",
    route: "/banners",
    icon: <Box component="i" color="warning" fontSize="14px" className="ni ni-album-2" />,
    component: <Banner />,
  },
  {
    type: "route",
    name: "Coupons",
    key: "coupons",
    route: "/coupons",
    icon: <Box component="i" color="warning" fontSize="14px" className="ni ni-album-2" />,
    component: <Coupon />,
  },
  // {
  //   type: "route",
  //   name: "Blogs",
  //   key: "blogs",
  //   route: "/blogs",
  //   icon: <Box component="i" color="primary" fontSize="14px" className="ni ni-book-bookmark" />,
  //   component: <Blogs />,
  // },
  // {
  //   type: "route",
  //   name: "Billing",
  //   key: "billing",
  //   route: "/billing",
  //   icon: <Box component="i" color="success" fontSize="14px" className="ni ni-credit-card" />,
  //   component: <Billing />,
  // },
  { type: "title", title: "Account Pages", key: "account-pages" },
  // {
  //   type: "route",
  //   name: "Profile",
  //   key: "profile",
  //   route: "/profile",
  //   icon: <Box component="i" color="dark" fontSize="14px" className="ni ni-single-02" />,
  //   component: <Profile />,
  // },
  {
    type: "route",
    name: "Settings",
    key: "settings",
    route: "/settings",
    icon: <Box component="i" color="dark" fontSize="14px" className="ni ni-settings-gear-65" />,
    component: <Settings />,
  },
];

export default routes;
