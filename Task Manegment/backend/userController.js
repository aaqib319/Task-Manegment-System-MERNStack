import User from './User.js';
import Task from './Task.js';
import bcrypt from 'bcrypt';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
    try {
        // Only return users with the 'employee' role for task assignment purposes
        const users = await User.find({ role: 'employee' }).select('-password');
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Create a new user
// @route   POST /api/users/create
// @access  Private/Admin
export const createUser = async (req, res) => {
    const { name, email, password, role, tasks } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, error: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        user = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'employee', // Default to 'employee' if no role is specified
        });

        await user.save();

        // If tasks are provided, create and assign them
        if (tasks && tasks.length > 0) {
            const createdTasks = await Promise.all(
                tasks.map(async (task) => {
                    const newTask = new Task({
                        ...task,
                        assignedTo: user._id,
                        createdBy: req.user._id, // Admin's ID
                    });
                    await newTask.save();
                    return newTask;
                })
            );
            // Optionally, you might want to return the created user and tasks
            res.status(201).json({ success: true, user, tasks: createdTasks });
        } else {
            res.status(201).json({ success: true, user });
        }
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
