const Order = require('../models/order')
const User = require('../models/user');
const Product = require('../models/product');
const Address = require('../models/address');

const getOrders = async (req, res) => {
  try {
    const data = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({ data })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: err?.message ?? 'Something went wrong' })
  }
};
// const getAdminOrders = async (req, res) => {
//   try {
//     const data = await Order.find().sort({ createdAt: -1 })
//       .populate('userId', 'username email')
//       .populate('address', 'firstname lastname address_line_1 address_line_2 zip mobile city state')
//       .populate('products.item.product_id', 'name category price image');

//     res.status(200).json({ data });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: error?.message ?? 'Something went wrong' });
//   }
// };
const getAdminOrders = async (req, res) => {
  try {
    const { page = 1, perPage = 10, sortBy = 'createdAt', order = 'desc', search = '' } = req.query;

    const query = {};
    // const query = search ? { name: { $regex: search, $options: 'i' } } : {};


    const options = {
      page: parseInt(page, 10),
      limit: parseInt(perPage, 10),
      sort: { [sortBy]: order === 'desc' ? -1 : 1 },
      populate: [
        { path: 'userId', select: 'username email' },
        { path: 'address', select: 'firstname lastname address_line_1 address_line_2 zip mobile city state' },
        { path: 'products.item.product_id', select: 'name category price image' },
      ],
    };

    const result = await Order.paginate(query, options);
    // res.status(200).json(result);

    let filteredData = result.docs;

    if (search) {
      const searchLowerCase = search.toLowerCase();
      filteredData = filteredData.filter(order =>
        (order.userId.username && order.userId.username.toLowerCase().includes(searchLowerCase)) ||
        (order.userId.email && order.userId.email.toLowerCase().includes(searchLowerCase))
      );
    }

console.log(' filteredData.length',search? filteredData.length :  result.totalDocs);

    res.status(200).json({
      data: filteredData,
      totalDocs: search? filteredData.length :  result.totalDocs,
      totalResults: result.totalDocs,
      page: result.page,
      totalPages: result.totalPages,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err?.message ?? 'Something went wrong' });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const { _id } = req?.decoded
    const data = await Order.find({ userId:_id }).populate('products.item.product_id') // Populate all fields in products
    .populate('address')
    .sort({ createdAt: -1 });
    res.status(200).json({ data })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: err?.message ?? 'Something went wrong' })
  }
};

const getOrderById = async (req, res) => {
  try {
      const orderId = req.params.orderId;
      console.log(orderId);
      const data = await Order.findById(orderId)
          .populate('products.item.product_id')
        
     // console.log(data);
      res.status(200).json({ data });
  } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error?.message ?? 'Something went wrong' });
  }
};


const createOrder = async (req, res) => {
  const { _id } = req?.decoded

  const {  payment_mode, amount, address, products,couponId } = req?.body

  console.log('addrr',address)
  try {
    const data = await Order.create({ userId:_id, payment_mode, amount, address, products })
    console.log('prod qty findings ',products.item)

const user = await User.findById(_id);
user.cart.item = []; 
user.cart.totalPrice = 0; 

if (couponId) {
  if (user.coupons.includes(couponId)) {
    return res.status(400).json({ message: "Coupon already used" });
  } else {
    user.coupons.push(couponId);
  }
}
await user.save();

for (const item of products.item) {
  const product = await Product.findById(item.product_id);

  if (product) {
    product.stock -= item.qty;
    await product.save();
  }
}

    res.status(201).json({ data, message: 'Order placed successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: err?.message ?? 'Something went wrong' })
  }
}

const updateOrder = async (req, res) => {
  const { _id, status } = req?.body
  try {
    const data = await Order.updateOne({ _id },
      { $set: { status }})
    res.status(201).json({ data, message: 'Order updated successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: err?.message ?? 'Something went wrong' })
  }
}
const getReviewOrders = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    console.log(' userId, productId', userId, productId);

    const orders = await Order.find({ userId, 'products.item.product_id': productId });

    res.status(200).json({ canWriteReview: orders.length > 0 });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  const { orderId, newStatus } = req.body;
  console.log(orderId, newStatus);
  
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = newStatus;
    await order.save();

    res.status(200).json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error?.message ?? 'Something went wrong' });
  }
};
module.exports = {
    getOrders,
    getUserOrders,
    createOrder,
    updateOrder,
    getOrderById,
    getReviewOrders,
    getAdminOrders,
    updateOrderStatus
  }
