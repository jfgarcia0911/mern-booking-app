import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { check, validationResult } from "express-validator";
import User from "../models/user";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth";
const router = express.Router();


// @route    POST api/auth
// @desc     Login user
// @access   Public
router.post(
	"/login",
	[
		check("email", "Email is required").isEmail(),
		check(
			"password",
			"Password with 6 or more characters  required"
		).isLength({ min: 6 }),
	],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ msg: errors.array() });
		}
		const { email, password } = req.body;

		try {
			let user = await User.findOne({ email: email });

			if (!user) {
				return res.status(400).json({ mgs: "Invalid Credentials" });
			}

			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				return res.status(400).json({ mgs: "Invalid Credentials" });
			}

			const token = jwt.sign(
				{ userId: user.id },
				process.env.JWT_SECRET_KEY as string,
				{ expiresIn: "1d" }
			);

            res.cookie('auth_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 86400000
            })

            res.status(200).json({userId: user.id})

		} catch (error) {
			console.log(error);
			res.status(500).json({ msg: "Something went wrong" });
		}
	}
);


// @route    GET api/auth
// @desc     Verify token
// @access   Public
router.get("/validate-token", verifyToken, (req: Request, res: Response) => {
	res.status(200).send({userId: req.userId})
})


// @route    Post api/auth
// @desc     Logout user
// @access   Public
router.post("/logout", (req: Request, res: Response) => {
	res.cookie('auth_token', "", {
		expires: new Date(0)
	})

	//since its a post request
	res.send();

})











export default router;
