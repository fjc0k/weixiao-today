const { defaultMessage } = require('../../config');

module.exports = {
  mediaId: String,
  mediaInfo: {
    mediaName: {
      type: String,
      default: ''
    },
    schoolName: {
      type: String,
      default: ''
    },
    avatarImage: {
      type: String,
      default: ''
    }
  },
  status: {
    type: Number,
    default: 1
  },
  startDate: {
    type: String,
    default: ''
  },
  endDate: {
    type: String,
    default: ''
  },
  keywords: {
    type: Array,
    default: []
  },
  message: {
    type: String,
    default: defaultMessage
  },
  token: String
};
