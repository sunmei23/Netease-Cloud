const Mock = require('mockjs');
const banners = require('../mock/banners.json');
const personalized = require('../mock/personalized')
const newsong = require('../mock/newsong')
const playList = require('../mock/playList')

Mock.mock('/api/banners','get',banners);
Mock.mock('/api/personalized','get',personalized);
Mock.mock('/api/newsong','get',newsong);
Mock.mock('/api/playList','get',playList);
Mock.setup({
  timeout: '1000-1500'
})
