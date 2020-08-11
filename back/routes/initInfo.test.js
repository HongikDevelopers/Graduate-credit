const db = require('../models');
const axios = require('axios');
const cheerio = require('cheerio');

const getHtml = async (url) => {
  try {
    return await axios.get(url);
  } catch (error) {
    console.error(error);
  }
};
exports.initTable = (req, res, next) => {
  const info = async () => {
    let all = [];
    for (let i = 1; i <= 4; i++) {
      await getHtml(
        `http://www.hongik.ac.kr/front/boardlist.do?currentPage=${i}&menuGubun=1&siteGubun=1&bbsConfigFK=2&searchField=ALL&searchValue=&searchLowItem=ALL`
      ).then((html) => {
        let ulList = [];
        const $ = cheerio.load(html.data);
        const $bodyList = $(
          'body > div > div > div:nth-child(3) > div > table > tbody'
        ).children('tr');
        $bodyList.each(function (i, elem) {
          ulList[i] = {
            title: $(this).find('div.subject span').text(),
            url: 'www.hongik.ac.kr' + $(this).find('a').attr('href'),
            date: $(this).find('td:nth-child(5)').text(),
          };
        });
        all = all.concat(ulList);
        const data = ulList.filter((n) => n.title);
        return data;
      });
      // .then((res) => log(res));
    }
    await all.forEach((x) => {
      db.Information.findOrCreate({
        where: {
          title: x.title,
          url: x.url,
          date: x.date,
          section: 1,
        },
      });
    });
  };
  info();
  next();
};
