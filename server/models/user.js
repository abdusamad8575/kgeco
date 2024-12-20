const mongoose = require("mongoose");
const Product = require("./product");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
    },
    is_admin: {
      type: Boolean,
      default: false,
      required: true,
    },
    is_verified: {
      type: Boolean,
      default: true,
      required: true,
    },
    profile: {
      type: String,
    },
    otp: {
      type: String,
    },
    cart: {
      item: [
        {
          productId: {
            type: mongoose.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          qty: {
            type: Number,
            required: true,
          },
          price: {
            type: Number,
          },
        },
      ],
      totalPrice: {
        type: Number,
        default: 0,
      },
    },
    wishlist: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    ],
    wallet: {
      type: Number,
      default: 0,
    },
    coupons: [{
      type: mongoose.Types.ObjectId,
      ref: 'Coupon'
    }]
  },
  {
    timestamps: true,
  }
);

userSchema.methods.updateCart = async function (id, qty) {
  const cart = this.cart;
  const product = await Product.findById(id);
  const index = cart.item.findIndex((objInItems) => {
    return (
      new String(objInItems.productId).trim() == new String(product._id).trim()
    );
  });
  console.log(id);
  console.log(qty);
  if (qty > cart.item[index].qty) {
    cart.item[index].qty += 1;
    cart.totalPrice += product.price;
  } else if (qty < cart.item[index].qty) {
    cart.item[index].qty -= 1;
    cart.totalPrice -= product.price;
  } else {
  } //console.log(cart.totalPrice);
  this.save();
  return cart.totalPrice;
};
userSchema.methods.addToCart = async function (product) {
  const wishlist = this.wishlist;
  const isExist = wishlist.filter((item) => item === product._id);
  if (isExist.length) {
    wishlist.filter((item) => item !== product._id);
  }
  const cart = this.cart;
  const isExisting = cart.item.findIndex((objInItems) => {
    return (
      new String(objInItems.productId).trim() == new String(product._id).trim()
    );
  });
  console.log(isExisting);
  if (isExisting >= 0) {
    cart.item[isExisting].qty += 1;
  } else {
    cart.item.push({ productId: product._id, qty: 1, price: product.price });
  }
  cart.totalPrice += product.price;
  console.log("User in schema:", this);
  return this.save();
};
// userSchema.methods.removefromCart =async function (productId){
//     console.log('rem cart',productId)
//     const cart = this.cart
//     console.log('cart',cart)
//     const isExisting = cart.item.findIndex(objInItems => new String(objInItems.productId).trim() === new String(productId).trim())
// console.log('is exis',isExisting)

//     if(isExisting >= 0){
//         const prod = await Product.findById(productId)
//         cart.totalPrice -= prod.price * cart.item[isExisting].qty
//         cart.item.splice(isExisting,1)
//         console.log("User in schema:",this);
//         return this.save()
//     }
// }
userSchema.methods.removefromCart = async function (cartItemId) {
  console.log("rem cart", cartItemId);
  const cart = this.cart;
  console.log("cart", cart);
  const isExisting = cart.item.findIndex(
    (objInItems) =>
      new String(objInItems._id).trim() === new String(cartItemId).trim()
  );
  console.log("is exis", isExisting);

  if (isExisting >= 0) {
    const prod = await Product.findById(cart.item[isExisting].productId);
    cart.totalPrice -= prod.price * cart.item[isExisting].qty;
    cart.item.splice(isExisting, 1);
    console.log("User in schema:", this);
    return this.save();
  }
};

userSchema.methods.addToWishlist = function (product) {
  console.log("add wishlist ", product);

  const wishlist = this.wishlist;

  const isExisting = wishlist.filter((x) => x == product);
  console.log("is ex", isExisting);
  if (!isExisting.length) {
    wishlist.push(product);
  }

  return this.save();
};
userSchema.methods.removefromWishlist = async function (id) {
  console.log("rem wis", id);

  const wishlist = this.wishlist;

  this.wishlist = this.wishlist.filter((x) => x.toString() !== id);

  return await this.save();
};

userSchema.statics.getWishlistWithProductsByUserId = async function (userId) {
  try {
    const user = await this.findById(userId).populate("wishlist");
    return user?.wishlist?.reverse();
  } catch (error) {
    console.error(error);
    return null;
  }
};

userSchema.statics.getCartWithProductsByUserId = async function (userId) {
  try {
    const user = await this.findById(userId).populate("cart.item.productId");

    return user?.cart;
  } catch (error) {
    console.error(error);
    return null;
  }
};

module.exports = mongoose.model("User", userSchema);
