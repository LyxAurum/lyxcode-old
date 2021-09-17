const { Schema, model } = require('mongoose');

module.exports = model("InfractionsData", new Schema({
    GuildID: String,
    UserID: String,
    WarnData: Array,
    BanData: Array,
    KickData: Array,
    MuteData: Array,
    ReportData: Array
}))