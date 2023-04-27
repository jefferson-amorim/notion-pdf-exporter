const fs = require('fs');

module.exports = function () {
    if (!fs.existsSync(`${process.cwd()}/.env`)) {
        throw new Error('.env isnt exists. Create a .env file with the notion token.');
    }
    if (!fs.existsSync(`${process.cwd()}/.notion-cookies`)) {
        throw new Error('.notion-cookies isnt exists. Create a .notion-cookies file with the notion cookies as a text.');
    }

    const env = fs.readFileSync(`${process.cwd()}/.env`, { encoding:'utf8' });
    const cookies = fs.readFileSync(`${process.cwd()}/.notion-cookies`, { encoding:'utf8' });
    const token = env.split('=')[1];
    const userCookiesAsString = `token_v2=${token}; ${cookies}`;
    const userCookies = userCookiesAsString.split(';');
    const userCookieValues = {};

    for (let i = 0, userCookie; userCookie = userCookies[i++];) {
        const nameValue = userCookie.split('=');
        const name = nameValue[0].trim();
        const value = nameValue[1].trim();
        userCookieValues[name] = value;
    }

    const notionCookies = [
        { 'domain': '.www.notion.so', 'name': 'token_v2' },
        { 'domain': '.www.notion.so', 'name': 'notion_browser_id' },
        { 'domain': '.www.notion.so', 'name': 'notion_user_id' },
        { 'domain': '.www.notion.so', 'name': 'notion_users' },
        { 'domain': '.www.notion.so', 'name': 'notion_experiment_device_id' },
        { 'domain': '.www.notion.so', 'name': 'notion_check_cookie_consent' },
        { 'domain': '.www.notion.so', 'name': 'notion_locale' },
        { 'domain': '.www.notion.so', 'name': '_mkto_trk' },
        { 'domain': '.www.notion.so', 'name': 'NEXT_LOCALE' },
        
        { 'domain': 'www.notion.so', 'name': 'g_state' },
        { 'domain': 'www.notion.so', 'name': 'tatari-cookie-test' },

        { 'domain': '.notion.so', 'name': '_ga' },
        { 'domain': '.notion.so', 'name': '_gcl_au' },
        { 'domain': '.notion.so', 'name': '_tt_enable_cookie' },
        { 'domain': '.notion.so', 'name': '_ttp' },
        { 'domain': '.notion.so', 'name': '_fbp' },
        { 'domain': '.notion.so', 'name': '_cioid' },
        { 'domain': '.notion.so', 'name': 'cb_user_id' },
        { 'domain': '.notion.so', 'name': 'cb_group_id' },
        { 'domain': '.notion.so', 'name': 'cb_anonymous_id' },
        { 'domain': '.notion.so', 'name': 'mutiny.user.token' },
        { 'domain': '.notion.so', 'name': 'mutiny.defaultOptOut' },
        { 'domain': '.notion.so', 'name': 'mutiny.optOut' },
        { 'domain': '.notion.so', 'name': 'mutiny.optIn' },
        { 'domain': '.notion.so', 'name': 'ajs_anonymous_id' },
        { 'domain': '.notion.so', 'name': 'tatari-session-cookie' },
    ];

    return notionCookies
        .map(cookie => ({
            ...cookie,
            value: userCookieValues[cookie.name],
        }))
        .filter(cookie => cookie.value !== undefined);
}
