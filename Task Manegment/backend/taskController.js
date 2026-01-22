import Task from './Task.js';

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private/Admin
export const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({}).populate('assignedTo', 'name email').populate('createdBy', 'name email').populate('deletedBy', 'name email');
        res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get tasks for a specific user
// @route   GET /api/tasks/user/:userId
// @access  Private
export const getTasksByUserId = async (req, res) => {
    try {
        const tasks = await Task.find({ assignedTo: req.params.userId }).populate('createdBy', 'name email').populate('deletedBy', 'name email');
        res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private/Admin
export const createTask = async (req, res) => {
    try {
        const { title, description, assignedTo, category, dueDate, priority } = req.body;
        const createdBy = req.user._id; // from authMiddleware

        const task = new Task({
            title,
            description,
            assignedTo,
            createdBy,
            category,
            dueDate,
            priority,
        });

        const createdTask = await task.save();
        res.status(201).json({ success: true, data: createdTask });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Update task status
// @route   PATCH /api/tasks/:id/status
// @access  Private
export const updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }

        task.status = status;
        if (status === 'deleted' && req.user) {
            task.deletedBy = req.user._id;
        }
        // Bypass validation if status is 'deleted' to allow soft delete
        const updatedTask = await task.save({ validateBeforeSave: status === 'deleted' ? false : true });
        const populated = await Task.findById(updatedTask._id).populate('assignedTo', 'name email').populate('createdBy', 'name email').populate('deletedBy', 'name email');
        res.status(200).json({ success: true, data: populated });
    } catch (error) {
        console.error('Error updating task status:', error);
        res.status(500).json({ success: false, error: 'Server Error: ' + error.message });
    }
};

// @desc    Update arbitrary task fields (e.g., priority, assignedTo, title)
// @route   PATCH /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
    try {
        const updates = req.body || {};
        const allowedFields = ['status', 'priority', 'assignedTo', 'title', 'description', 'category', 'dueDate', 'failedReason'];

        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }

        // Apply only allowed updates
        Object.keys(updates).forEach((key) => {
            if (allowedFields.includes(key)) {
                task[key] = updates[key];
            }
        });

        if (updates.status === 'deleted' && req.user) {
            task.deletedBy = req.user._id;
        }

        // Bypass validation if status is 'deleted' to allow soft delete
        const shouldValidate = updates.status !== 'deleted';
        const updatedTask = await task.save({ validateBeforeSave: shouldValidate });
        // Populate assignedTo and createdBy for consistent client shape
        const populated = await Task.findById(updatedTask._id).populate('assignedTo', 'name email').populate('createdBy', 'name email').populate('deletedBy', 'name email');
        res.status(200).json({ success: true, data: populated });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ success: false, error: 'Server Error: ' + error.message });
    }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }

        await task.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
