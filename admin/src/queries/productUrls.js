import request from "utils/request";

const addCategory = async (data) => request(`/category`, 'POST', data)
const editCategory = async (data) => request(`/category`, 'PATCH', data)
const deleteCategory = async (data) => request(`/category/${data?._id}`, 'DELETE', data)
const getCategoryById = async (data) => request(`/category/${data?.id}`, 'GET', data)
const addProduct = async (data) => request(`/products`, 'POST', data)
const updateProduct = async (data) => request(`/products`, 'PATCH', data)
const deleteProduct = async (data) => request(`/products/${data?._id}`, 'DELETE', data)
const getCategory = async (data) => request(`/category?page=${data?.pageNo}&perpageitems=${data?.pageCount}`, 'GET', data)
const getProductById = async (data) => request(`/products/${data?.id}`, 'GET', data)

const getCoupon = async (data) => request(`/coupons?page=${data?.pageNo}&perpageitems=${data?.pageCount}`, 'GET', data)
const addCoupon = async (data) => request(`/coupons`, 'POST', data)
const deletecoupons = async (data) => request(`/coupons/${data?._id}`, 'DELETE', data)
const couponStatus = async (data) => request(`/coupons/status/${data?._id}`, 'PATCH', data)
const updateCoupon = async (data) => request(`/coupons`, 'PATCH', data)
const getCouponById = async (data) => request(`/coupons/${data?.id}`, 'GET', data)

const getProducts = async ({ page, perPage, sortBy, order, search }) => {
  const queryParams = new URLSearchParams({
    page,
    perPage,
    sortBy,
    order,
    search,
  }).toString();

  const response = await request(`/products/adminProducts?${queryParams}`, 'GET');
  return response;
};
const getFilterCategory = async ({ page, perPage, sortBy, order, search }) => {
  const queryParams = new URLSearchParams({
    page,
    perPage,
    sortBy,
    order,
    search,
  }).toString();

  const response = await request(`/category/adminCategory?${queryParams}`, 'GET');
  return response;
};

export {
  addCategory,
  addProduct,
  updateProduct,
  deleteProduct,
  getCategory,
  getProducts,
  getProductById,
  getCategoryById,
  editCategory,
  deleteCategory,
  getFilterCategory,
  getCoupon,
  addCoupon,
  couponStatus,
  updateCoupon,
  getCouponById,
  deletecoupons,
};
