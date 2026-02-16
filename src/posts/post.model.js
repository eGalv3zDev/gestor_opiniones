'use strict';

import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true },
  title: { 
    type: String, 
    required: true, 
    trim: true, 
    maxLength: 150 },
  category: { 
    type: String, 
    required: true, 
    trim: true, 
    maxLength: 50 },
  content: { 
    type: String, 
    required: true, 
    trim: true, 
    maxLength: 2000 },
  createdAt: { 
    type: Date, 
    default: Date.now 
},
  updatedAt: { 
    type: Date },
});

export default mongoose.model('Post', postSchema);
