const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");



async function getNotionPagesFromHTML() {
  const dbHtmlString = fs.readFileSync(path.resolve(`${process.cwd()}/src/notion-extract-urls/db.html`), "utf-8").toString();

  const $ = cheerio.load(dbHtmlString);

  const bodyElements = $(".cell-title");

  const texts = $.html($(".cell-title"));

  const elem = texts.split("</td>");

  const ids = elem.map((item) => getPageIdFromTdElement(item));

  console.log(`DATA: ${JSON.stringify(ids, null, 2)}`);
  console.log(`LENGTH: ${ids.length}`);
};

function getPageIdFromTdElement(input) {
  console.log(`ELEMENT: ${input}`);
  const regex = /<a\s+href="([^"]+)"[^>]*>/i;
  // const input = '<td class="cell-title"><a href="https://www.notion.so/primeira-linha-d90dca58aafe43749f42abaa302256a9">primeira linha</a></td><td class="cell-&lt;lmF"></td>';

  const match = input.match(regex);
  if (match !== null) {
    console.log(match[1]); // d90dca58aafe43749f42abaa302256a9
    return match[1];
  }
};

(async () => {
  await getNotionPagesFromHTML();
})();
