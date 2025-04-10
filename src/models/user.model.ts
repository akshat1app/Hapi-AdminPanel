import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {type: String , unique:true},
  password: String,
  role: { type: String, enum: ['superadmin', 'subadmin'], default: 'subadmin' },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
