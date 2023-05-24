const notionUrls = require("./notion-urls")();
const notionCookies = require("./notion-cookies")();
const notionPdfExporter = require("./notion-pdf-exporter");

notionPdfExporter({ notionUrls, notionCookies });
