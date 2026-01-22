import User from './User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(404).json({ success: false, error: "Wrong Password" });
        }

        const token = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.JWT_KEY,
            { expiresIn: "10d" }
        );

        res.status(200).json({
            success: true,
            token,
            user: { _id: user._id, name: user.name, role: user.role },
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, error: "Name is required" });
        }

        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ success: false, error: "User already exists" });
        }

        // Check if this is the first user. If so, make them an admin.
        const userCount = await User.countDocuments();
        const finalRole = userCount === 0 ? "admin" : role;

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: finalRole, // Use the determined role
        });
        await newUser.save();
        res.status(201).json({ success: true, message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

const verify = (req, res) => {
    return res.status(200).json({success: true, user: req.user})
}

export { login, register, verify };