import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};

export const sanitizeUser = (userDoc) => {
  const user = userDoc?.toObject ? userDoc.toObject() : userDoc;
  if (!user) return null;
  delete user.password;
  delete user.__v;
  return {
    ...user,
  };
};
