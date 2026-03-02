'use strict';

import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    post: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Post', 
      required: true },
    author: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true },
    content: { 
      type: String, 
      required: true, 
      trim: true, 
      maxLength: 1000 },
    createdAt: { 
      type: Date, 
      default: Date.now },
    updatedAt: { 
      type: Date 
  },
});

export default mongoose.model('Comment', commentSchema);
