const fs = require('fs');

const code = fs.readFileSync('js/translations.js', 'utf8');
const translationsCode = code.match(/const translations = ([\s\S]*?);\s*document\.addEventListener/)[1];
const translations = eval('(' + translationsCode + ')');

const html = fs.readFileSync('index.html', 'utf8');

// Match x-text="t('something')"
const regex = /t\(['"](.*?)['"]\)/g;
let match;
let missingKeys = [];

function checkKeyExists(obj, keyPath) {
    const parts = keyPath.split('.');
    let current = obj;
    for (const part of parts) {
        if (current === undefined || current === null) return false;
        current = current[part];
    }
    return current !== undefined;
}

while ((match = regex.exec(html)) !== null) {
    const key = match[1];
    if (!checkKeyExists(translations, key)) {
        missingKeys.push(key);
    }
}

// Find translations in demo/dashboard.html too
const dashHtml = fs.readFileSync('demo/dashboard.html', 'utf8');
let matchDash;
while ((matchDash = regex.exec(dashHtml)) !== null) {
    const key = matchDash[1];
    if (!checkKeyExists(translations, key)) {
        missingKeys.push(key);
    }
}


if (missingKeys.length > 0) {
    console.log("Missing keys in JS dictionary:");
    // remove duplicates
    console.log([...new Set(missingKeys)].join('\n'));
} else {
    console.log("All x-text keys found in JS dictionary.");
}
