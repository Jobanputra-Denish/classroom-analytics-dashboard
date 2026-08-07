import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {

  const token = req
    .header("Authorization")
    ?.replace("Bearer", "")
    .trim();

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token, authorization denied",
    });
  }

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = await User.findById(decoded.user.id)
      .select("-password");

    next();

  } catch (error) {

    console.error("Auth Middleware Error:", error);

    return res.status(401).json({
      success: false,
      message: "Token is not valid",
    });
  }
};

export default protect;