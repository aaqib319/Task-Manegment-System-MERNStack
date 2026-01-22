import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['pending', 'in-progress', 'completed', 'failed', 'new', 'accepted', 'rejected', 'ready-for-test', 'qa-failed'], default: 'new' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    category: { type: String },
    dueDate: { type: Date },
    priority: { type: String, enum: ['Low', 'Medium', 'High'] },
    failedReason: { type: String },
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
