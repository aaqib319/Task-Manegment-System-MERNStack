
    import axios from 'axios';
    import mongoose from 'mongoose';
    import User from './User.js';
    import Task from './Task.js';
    import dotenv from 'dotenv';
    dotenv.config();
    const API_URL = 'http://localhost:5000/api';
    const adminUser = {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
    };
    const newUser = {
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123',
        tasks: [
        { title: 'Task 1', description: 'Description for task 1' },
        { title: 'Task 2', description: 'Description for task 2' },
        ],
    };
    async function runTest() {
        try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
        // Clean up previous test data
        await User.deleteMany({ email: { $in: [adminUser.email, newUser.email] } });
        await Task.deleteMany({});
        // Create admin user directly in the database
        const admin = new User(adminUser);
        await admin.save();
        // Log in as admin to get token
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: adminUser.email,
            password: adminUser.password,
        });
        const token = loginRes.data.token;
        console.log('Admin logged in, token acquired.');
        // Create new user with tasks
        const createRes = await axios.post(`${API_URL}/users/create`, newUser, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (createRes.status === 201) {
            console.log('Test PASSED: User created successfully.');
            // Verification
            const createdUser = await User.findOne({ email: newUser.email });
            const assignedTasks = await Task.find({ assignedTo: createdUser._id });
            console.log('VERIFICATION:');
            console.log(`- User '${createdUser.name}' created with role '${createdUser.role}'.`);
            console.log(`- Found ${assignedTasks.length} tasks assigned to the new user.`);
            assignedTasks.forEach(task => {
            console.log(`  - Task '${task.title}'`);
            });
        } else {
            console.error('Test FAILED: Could not create user.');
            console.error('Response:', createRes.data);
        }
        } catch (error) {
        console.error('Test execution failed:', error.response ? error.response.data : error.message);
        } finally {
        await mongoose.disconnect();
        console.log('MongoDB disconnected.');
        }
    }
    runTest();
    