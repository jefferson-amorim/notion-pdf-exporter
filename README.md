# notion-pdf-exporter

This is a little workaround to automate the export of multiple Notion url's using `puppeteer.js` to emulate a user's navigation.

# How to use

Before starting to use this project, as every workaround created in a few hours, there is an effort to configure the Notion authentication token, the another cookies and map the URLs for export.

## Git clone
Run `git clone git@github.com:jefferson-amorim/notion-pdf-exporter.git` in terminal and `cd ./notion-pdf-exporter`.

## Configure the .env file

Notion's authentication token can be captured in cookies from any https://notion.so screen after a user is logged in.

The name of the cookie is "token_v2" and you will not have access through `document.cookie`, only through the devtools of a browser like Chrome.

- Open devtools, find the page cookies and search for "token_v2".
- Copy the cookie value;
- Create the `.env` file based on the `.env-sample`;
- Change token value to copied cookie value;
- Save this file.

## Configure the .notion-cookies

Taking advantage of being logged in and with devtools open and:
- Open the devtools console;
- Execute `copy(document.cookie)` to copy cookies content to clipboard;
- Create the `.notion-cookies` file based on the `.notion-cookies-sample`;
- Paste the contents of the clipboard to the file;
- Save this file.

## Configure the .notion-urls

It's not all roses and you need to list the Notion URLs you want to export to PDF. The good news is that you can only list the parent URLs, as this project exports pages and subpages.

- Create the `.notion-urls` file based on the `.notion-urls-sample`;
- List all parent URLs, one per line;
- Save this file.


## Run it!

Run `npm start` in the terminal and wait for the magic to happen.

After the "end of export" message in the terminal, the `.zip` files will be in the project's `/downloads` directory.
