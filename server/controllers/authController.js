const User = require("../models/user");
const Otp = require('../models/otp')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const fast2sms = require('fast-two-sms');
const dotenv = require('dotenv');
dotenv.config();

// module.exports.signup = async (req, res) => {
//   const { username, password, email, phone,clientOtp } = req?.body;
// console.log(req?.body)
//   let otp = await Otp.findOne({ email });
//   // console.log(otp.otp)
//   // console.log(clientOtp)
//   // console.log(otp.otp===clientOtp)
//   try {
//     if(otp.otp === clientOtp){
//       try {
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//           return res.status(401).json({ message: "Email already in use" });
//         }
    
    
//         const encryptedPassword = await bcrypt.hash(password, 10);
    
//         const newUser = new User({
//           username,
//           password: encryptedPassword,
//           phone,
//           email,
//         });
    
//         await newUser.save();
    
//         const { password: _, ...userWithoutPassword } = newUser.toObject();


//         return res.status(200).json({
//           message: "Registration successfull",
//           data: { userWithoutPassword, signupStatus: true },
//         });
//       } catch (error) {
//         console.log("err", error);
//         return res
//           .status(500)
//           .json({ message: err?.message ?? "Something went wrong" });
//       }
  
  
//     }else{
  
//       console.log('Incorrect OTP');
//       return res.status(400).json({ message: 'Incorrect OTP' });
  
//     }
//   } catch (error) {
    
//   }

 


 
// };

module.exports.signup = async (req, res) => {
  const { username, password, email, phone, clientOtp } = req?.body;
  // console.log(req?.body);

  try {
    let otp = await Otp.findOne({ email });

    if (!otp) {
      return res.status(404).json({ message: 'OTP not found' });
    }

    if (otp.otp === clientOtp) {
      try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
          return res.status(401).json({ message: 'Email already in use' });
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
          username,
          password: encryptedPassword,
          phone,
          email,
        });

        await newUser.save();

        // Delete the OTP document after successful registration
        await Otp.deleteOne({ email });

        const { password: _, ...userWithoutPassword } = newUser.toObject();

        return res.status(200).json({
          message: 'Registration successful',
          data: { userWithoutPassword, signupStatus: true },
        });
      } catch (error) {
        console.log('err', error);
        return res
          .status(500)
          .json({ message: error?.message ?? 'Something went wrong' });
      }
    } else {
      // console.log('Incorrect OTP');
      return res.status(400).json({ message: 'Incorrect OTP' });
    }
  } catch (error) {
    console.error('err', error);
    return res.status(500).json({ message: error?.message ?? 'Something went wrong' });
  }
};

module.exports.changePassword=async(req,res)=>{
  const email = req?.body.email
  const newPassword = req?.body.newPassword
console.log(email ,'',newPassword)

  const encryptedPassword = await bcrypt.hash(newPassword, 10);
try {
  const user = await User.findOne({ email });
  user.password = encryptedPassword;
  await user.save();

    res.status(200).json({ message: 'Password updated successfully' });

} catch (error) {
  console.error('Error updating password:', error);
    res.status(500).json({ message: 'Internal Server Error' });
}


}

// module.exports.signin = async (req, res) => {
//    const { email, password } = req.body;
//    console.log('req',req.body)

//    try {
//       const pipeline = [
//          {
//             $match: {
//                $or: [
//                   { username: email },
//                   { email: email },
//                   { phone: email },
//                ],
//             },
//          },
//          {
//             $project: {
//                _id: 1,
//                username: 1,
//                email: 1,
//                phone: 1,
//                password: 1,
//                is_admin: 1,
//                is_verified: 1,
//                profile: 1,
//                cart: 1,
//                wishlist: 1,
//                wallet: 1,
//             },
//          },
//       ];

//       await userSchema
//          .aggregate(pipeline)
//          .exec()
//          .then((users) => {
//             if (users.length === 0) {
//                console.log("User not found");
//                return res.status(404).json({ message: "user not found" })
//             } else {
//                const user = users[0];
//                bcrypt.compare(password, user.password, (err, result) => {
//                   if (err) {
//                      console.error("Password comparison error:", err);
//                      return res.status(500).json({ message: err?.message })
//                   } else if (result) {
//                      const accessToken = jwt.sign(
//                         { _id: user._id },
//                         process.env.JWT_ACCESS_SECRET,
//                         {
//                            expiresIn: process.env.JWT_ACCESS_EXPIRY,
//                         }
//                      );

//                      const refreshToken = jwt.sign(
//                         { _id: user._id },
//                         process.env.JWT_REFRESH_SECRET,
//                         {
//                            expiresIn: process.env.JWT_REFRESH_EXPIRY,
//                         }
//                      );
//                      delete user.password;
//                      return res.status(200).json({
//                         message: "login successfull",
//                         data: { token: { accessToken, refreshToken }, user }
//                      });
//                   } else {
//                      console.log(result);
//                      console.log("Incorrect password");
//                      return res.status(404).json({ message: "Incorrect password" })
//                   }
//                });
//             }
//          });
//    } catch (error) {
//       return res.status(500).json({ message: err?.message ?? 'Something went wrong' })
//    }
// };

module.exports.signin = async (req, res) => {
  const { password, email } = req.body;
  try {
    // Find the user by email
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({ message: "Email not found" });
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Wrong password" });
    }

    // Generate the access token
    const accessToken = jwt.sign(
      { _id: existingUser._id },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: process.env.JWT_ACCESS_EXPIRY,
      }
    );

    // Generate the refresh token
    const refreshToken = jwt.sign(
      { _id: existingUser._id },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: process.env.JWT_REFRESH_EXPIRY,
      }
    );

    // Respond with the user data and tokens
    res.status(200).json({
      proceed: true,
      data: { token: { accessToken, refreshToken }, existingUser },
      message: "Login successful",
    });
  } catch (error) {
    console.log("Error during sign-in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getCurrentUser = async (req, res) => {
  try {
    const _id = req.decoded._id;
    console.log("idd,", _id);
    const currentUser = await User.findOne({ _id });
    console.log("crnt user ", currentUser);
    if (!currentUser) {
      return res.status(400).json({ message: "user does not exists" });
    }
    return res
      .status(200)
      .json({
        data: currentUser,
        message: "user details fetched successfully",
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: err?.message ?? "Something went wrong" });
  }
};



let otpStore = {};

module.exports.sendOtp = async (req, res) => {    
  const { number } = req.body;
  console.log('number',number);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  // const otp = '123456'
  console.log('otp',otp);
  otpStore[number] = otp;    

 
  const options = {   
    authorization: process.env.FAST2SMS_API_KEY,   
    message: `Your OTP is: ${otp}`,
    numbers: [number]
  };
  console.log('options',options);    
  
  try {
    await fast2sms.sendMessage(options);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send OTP', error: error.message });
  }
};


module.exports.verifyOtp = async (req, res) => {  
  const { number, otp  } = req.body;  
  console.log('number, otp',number, otp);

  if (otpStore[number] !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  let user = await User.findOne({ phone:number });
  

  if (!user) {   
    user = new User({ phone:number });
     
    await user.save();   
  }  

  const accessToken = jwt.sign({ _id: user._id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRY,
  });

  const refreshToken = jwt.sign({ _id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRY,
  });

  res.status(200).json({
    message: 'Login successful',
    data: { token: { accessToken, refreshToken }, user }
  });
};       