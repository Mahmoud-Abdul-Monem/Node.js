import { Router } from "express";
import { validateBody } from "../middleware/validate.body.js";
import { registerSchema } from "../schema/register.schema.js";
import { loginSchema } from "../schema/login.schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createDB } from "../db.js";
export const authRouter = Router();
process.loadEnvFile()

const db = createDB();
/**
 * @swagger /auth/login
 * POST /auth/login
 *
 * @description Authenticate a user with email and password.
 *
 * @body {string} email - User's email address
 * @body {string} password - User's password
 * 
 * @success {200} { message: string }
 *   Returns a success message on successful login.
 *
 * @error {422} { errors: { [field]: { errors: string[] } } }
 *   Validation failed (missing or invalid fields).
 *   Example: { errors: { email: { errors: ["Required"] }, password: { errors: ["Required"] } } }
 *
 * @error {500} { error: string }
 *   Internal server error.
 *   Example: { error: "something went wrong" }
 */
authRouter.post("/login", validateBody(loginSchema), async (req, res) => {

  const users = await db.getAll("auth_users");
  const existingUser = users.find((el) => el.email === req.body.email)
  if (!existingUser) res.status(422).json({ error: "invalid credentails" })

  const checkHash = await bcrypt.compare(req.body.password, existingUser.password)

  if (!checkHash) res.status(422).json({ error: "email or password is incorrect" })
  const token = jwt.sign(existingUser, process.env.JWT_SECRET)

  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 1000 * 24
  })
  res.json({ message: "login successful" });
});

/**
 * @swagger /auth/register
 * POST /auth/register
 *
 * @description Register a new user account.
 *
 * @body {string} username - Desired username
 * @body {string} email - User's email address
 * @body {string} password - User's password
 * @body {string} password_confirmation - Password confirmation (must match password)
 *
 * @success {201} { message: string }
 *   Returns a success message on successful registration.
 *
 * @error {422} { errors: { [field]: { errors: string[] } } }
 *   Validation failed (missing fields or passwords don't match).
 *   Example: { errors: { email: { errors: ["Required"] }, password_confirmation: { errors: ["Passwords do not match"] } } }
 *
 * @error {500} { error: string }
 *   Internal server error.
 *   Example: { error: "something went wrong" }
 */
authRouter.post("/register", validateBody(registerSchema), async (req, res) => {

  const passwordHash = await bcrypt.hash(req.body.password, 10)

  const users = await db.getAll("auth_users");



  const existingUser = users.find((u) => u.email === req.email);
  if (existingUser) {
    return res.status(422).json({ error: "email is taken" });
  }

  await db.create("auth_users", {
    email: req.body.email,
    username: req.body.username,
    password: passwordHash,
  });
  console.log("Request Body:", req.body);
  res.status(201).json({ message: "register successful" })
});

/**
 * @swagger /auth/logout
 * POST /auth/logout
 *
 * @description Log out the current user (invalidate session/token).
 *
 * @success {200} { message: string }
 *   Returns a success message on successful logout.
 *
 * @error {500} { error: string }
 *   Internal server error.
 *   Example: { error: "something went wrong" }
 */
authRouter.post("/logout", (req, res) => {

  res.clearCookie("token")

  res.json({ message: "logout successful" });
});
