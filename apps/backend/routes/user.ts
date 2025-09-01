import { Router } from "express";
import { client } from "db/client";
import {
  generateAccessToken,
  generateOtp,
  generateRefreshToken,
  refreshAccessToken,
  sendOtp,
  resendOtp,
} from "../helpers/auth";
import { hash, compare } from "../helpers/bcrypt";

const router = Router();

router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email && !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required!" });
    }

    const exists = await client.user.findFirst({
      where: { email: email.toLowerCase() },
    });

    if (exists) {
      return res.status(409).json({ message: "User already exists!" });
    }

    const otp = generateOtp().toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await client.otpVerification.upsert({
      where: { email },
      update: { otp, expiresAt, attempts: 0 },
      create: { email, otp, expiresAt },
    });

    await sendOtp(email, otp);

    res.status(200).json({
      message: "OTP sent successfully",
      email,
      nextStep: "/verify-otp",
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    if (!email && !otp && !password) {
      return res.status(400).json({ message: "Credentials are required!" });
    }

    const otpRecord = await client.otpVerification.findUnique({
      where: { email },
    });

    if (!otpRecord) {
      return res.status(404).json({ message: "OTP not found or expired" });
    }

    if (otpRecord.expiresAt < new Date()) {
      await client.otpVerification.delete({ where: { email } });
      return res.status(410).json({ message: "OTP expired" });
    }

    if (otpRecord.attempts >= 5) {
      await client.otpVerification.delete({ where: { email } });
      return res.status(429).json({ message: "Too many failed attempts" });
    }

    if (otpRecord.otp !== otp) {
      await client.otpVerification.update({
        where: { email },
        data: { attempts: { increment: 1 } },
      });

      const remainingAttempts = 5 - (otpRecord.attempts + 1);
      return res.status(401).json({
        message: `Invalid OTP. ${remainingAttempts} attempts remaining.`,
      });
    }

    const hashedPassword = await hash(password);

    const userData: any = {
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "User", // change -- for admin signups bhayia
    };

    const user = await client.user.create({
      data: userData,
    });

    client.otpVerification.delete({ where: { email } });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "User created successfully",
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existingUser = await client.user.findFirst({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    await resendOtp(email);

    res.status(200).json({
      message: "New OTP sent successfully",
      email,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required!" });
    }

    const user = await client.user.findFirst({
      where: { email: email.toLowerCase(), role: 'User' },
    });

    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/signout", async (req, res) => {
  const cookieOptions = [
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      path: "/",
    },
  ];
  cookieOptions.forEach((options, index) => {
    res.clearCookie("refreshToken", options);
  });
  
  res.status(200).json({ message: "Logged out successfully" });
});

// note for bhayia - common for admin and users both 
router.post("/refresh", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token missing" });
  }

  try {
    const newAccessToken = refreshAccessToken(refreshToken);
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
})

export default router;
