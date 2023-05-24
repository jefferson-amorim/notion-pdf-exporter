const puppeteer = require('puppeteer');

module.exports = async function ({ notionUrls, notionCookies}) {
    console.log('URLs to export', notionUrls.length);
    console.log('Export started');
    for (let i = 0, notionUrl; notionUrl = notionUrls[i++];) {
        try {
            console.log('Exporting', notionUrl);
            await exportPdf({ notionUrl, notionCookies });
        } catch (error) {
            console.error(`Error in: ${notionUrl}`);
            console.error(error);
        }
    }
    console.log('Export end');
}


async function waitUntilDownload(client) {
    return new Promise((resolve, reject) => {
        client.on('Browser.downloadProgress', e => {
            if (e.state === 'completed') {
                resolve(e);
            } else if (e.state === 'canceled') {
                reject(e);
            }
        });
    });
}

async function exportPdf({ notionUrl, notionCookies }) {
    const browser = await puppeteer.launch({headless: 'new', })// .launch({headless: 'new', });
    const page = await browser.newPage();
    const client = await page.target().createCDPSession();

    await page.setViewport({ width: 1080, height: 1024 });

    await client.send('Browser.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: `${process.cwd()}/bkp/teams_db`,
        eventsEnabled: true,
    });

    // Set auth and other cookies
    await page.setCookie(...notionCookies);
  
    await page.goto(notionUrl, { waitUntil: 'domcontentloaded' });

    await page.waitForSelector('.notion-topbar-more-button');

    // Open menu.
    await page.click('.notion-topbar-more-button');

    // Wait for menu.
    await page.waitForSelector('.notion-scroller.vertical > div[role=menu]');

    // Wait for connection menu items.
    await page.waitForTimeout(7000);

    // Wait for export menuitem
    await page.waitForSelector('.notion-overlay-container.notion-default-overlay-container > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > div > div > div > div > div:nth-child(1) > div:nth-child(7) > div:nth-child(2)');

    // Open export modal
    await page.click('.notion-overlay-container.notion-default-overlay-container > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > div > div > div > div > div:nth-child(1) > div:nth-child(7) > div:nth-child(2)');
    await page.waitForSelector('.notion-overlay-container.notion-default-overlay-container > div:nth-child(2) > div > div:nth-child(2) > div > div:nth-child(1) > div[role=button]');

    // Open export options
    await page.click('.notion-overlay-container.notion-default-overlay-container > div:nth-child(2) > div > div:nth-child(2) > div > div:nth-child(1) > div[role=button]')
    await page.waitForSelector('.notion-overlay-container.notion-default-overlay-container > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) div[role=menu] div[role=menuitem]:nth-child(1)');

    // Select PDF type
    // await page.click('.notion-overlay-container.notion-default-overlay-container > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) div[role=menu] div[role=menuitem]:nth-child(1)')
    // await page.waitForSelector('.notion-overlay-container.notion-default-overlay-container > div:nth-child(2) > div > div:nth-child(2) > div > div:nth-child(6) > div.pseudoHover > input[type=checkbox]')
    
    // Export subpages
    // await page.click('.notion-overlay-container.notion-default-overlay-container > div:nth-child(2) > div > div:nth-child(2) > div > div:nth-child(6) > div.pseudoHover > input[type=checkbox]')


    // Select MD type
    await page.click('.notion-overlay-container.notion-default-overlay-container > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) div[role=menu] div[role=menuitem]:nth-child(3)')
    // await page.waitForSelector('#notion-app > div > div.notion-overlay-container.notion-default-overlay-container > div:nth-child(2) > div > div:nth-child(2) > div > div:nth-child(4) > div.pseudoHover.pseudoActive > input[type=checkbox]')

    // Just wait.
    await page.waitForTimeout(1000);

    // Open Include databases options
    await page.click('.notion-overlay-container.notion-default-overlay-container > div:nth-child(2) > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2)')
    await page.waitForSelector('#notion-app > div > div.notion-overlay-container.notion-default-overlay-container > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(2) > div > div > div > div > div > div > div > div:nth-child(1)');

    // Select Current view
    await page.click('#notion-app > div > div.notion-overlay-container.notion-default-overlay-container > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(2) > div > div > div > div > div > div > div > div:nth-child(1)');
    // await page.click('.notion-overlay-container.notion-default-overlay-container > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(2) > div > div > div > div > div > div > div > div:nth-child(1)')

    // Just wait.
    await page.waitForTimeout(1000);

    // Export subpages
    await page.click('#notion-app > div > div.notion-overlay-container.notion-default-overlay-container > div:nth-child(2) > div > div:nth-child(2) > div > div:nth-child(4) > div.pseudoHover.pseudoActive > input[type=checkbox]')

    // Listen download progress event
    const downloadCompletedEvent = waitUntilDownload(client)

    // Download file as PDF
    // await page.click('.notion-overlay-container.notion-default-overlay-container > div:nth-child(2) > div > div:nth-child(2) > div > div:nth-child(8) > div[role=button]:nth-child(2)')
    
    // Download file as MD
    await page.click('.notion-overlay-container.notion-default-overlay-container > div:nth-child(2) > div > div:nth-child(2) > div > div:nth-child(6) > div[role=button]:nth-child(2)')

    // Wait download completed event
    await downloadCompletedEvent;
    browser.close();
}