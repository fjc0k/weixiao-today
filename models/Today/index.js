const Model = require('../Model');
const schema = require('./schema');

module.exports = class Today extends Model {
  constructor() {
    super('today', schema);
  }
  async open(mediaId) {
    const query = { mediaId };
    let media;
    try {
      media = await this.model.findOne(query);
      media.status = 1;
    } catch (e) {
      media = new this.model(query);
    }
    await media.save();
  }
  async close(mediaId) {
    await this.model.update({ mediaId }, {
      status: 0,
      mediaInfo: {
        mediaName: '',
        schoolName: '',
        avatarImage: ''
      }
    });
  }
  async updateMediaInfo(mediaId, { mediaName, schoolName, avatarImage }) {
    avatarImage = avatarImage.replace('http:', 'https:');
    await this.model.update({ mediaId }, {
      mediaInfo: { mediaName, schoolName, avatarImage }
    });
  }
  async updateKeywords(mediaId, keywords) {
    await this.model.update({ mediaId }, { keywords });
  }
  async getConfig(mediaId) {
    return await this.model.findOne({ mediaId });
  }
  async saveConfig(mediaId, { startDate, endDate, message }) {
    await this.model.update({ mediaId }, { startDate, endDate, message });
  }
  async getConfigByToken(token) {
    return await this.model.findOne({ token });
  }
  async saveConfigByToken(token, { startDate, endDate, message }) {
    await this.model.update({ token }, { startDate, endDate, message });
  }
  async setToken(mediaId, token) {
    await this.model.update({ mediaId }, { token });
  }
};
