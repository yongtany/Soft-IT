const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requestSchema = new Schema({
  projectAddress: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  reqeust_image: {
    type: String,
  },
  publishedDate: {
    type: Date,
    default: new Date() // 현재 날짜를 기본값으로
  },
});

const projectSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  tags: [String],
  publishedDate: {
    type: Date,
    default: new Date() // 현재 날짜를 기본값으로
  },
  project_image: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  favoriteCount: {
    type: Number,
    default: 0,
  },
  requests: [requestSchema],

  investors: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

projectSchema.methods = {
  toJSON() {
    return {
      _id: this._id,
      title: this.title,
      body: this.body,
      tags: this.tags,
      project_image: this.project_image,
      address: this.address,
      publishedDate: this.publishedDate,
      user: this.user,
      favoriteCount: this.favoriteCount,
      investors: this.investors
    };
  },
};

projectSchema.statics = {
  createProject(args, user, project_image) {
    return this.create({
      ...args,
      user,
      project_image
    });
  },
};


module.exports = mongoose.model('Project', projectSchema);
