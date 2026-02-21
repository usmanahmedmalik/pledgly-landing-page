const fs = require('fs');

// Read translations.js
const code = fs.readFileSync('js/translations.js', 'utf8');

// The file defines `const translations = { ... };`
// Let's parse it by extracting the object.
// A safe way is to wrap it in a function.
const translationsCode = code.match(/const translations = ([\s\S]*?);\s*document\.addEventListener/)[1];

const translations = eval('(' + translationsCode + ')');

const expectedLangs = ['en', 'nl', 'de', 'fr', 'ar'];
let missing = [];

function checkLangs(obj, path = '') {
    if (!obj || typeof obj !== 'object') return;

    // Check if it's a leaf node that contains languages
    const keys = Object.keys(obj);
    const hasLangKeys = keys.some(k => expectedLangs.includes(k));

    // Sometimes it's nested (like nav.features), but let's see.
    if (hasLangKeys || (typeof obj.en === 'string')) {
        for (let lang of expectedLangs) {
            if (!obj[lang]) {
                missing.push(`${path}.${lang}`);
            }
        }
    } else {
        // It's a nested object
        for (let key of keys) {
            checkLangs(obj[key], path ? `${path}.${key}` : key);
        }
    }
}

checkLangs(translations);

if (missing.length > 0) {
    console.log("Missing keys:");
    console.log(missing.join('\n'));
} else {
    console.log("No missing language keys found.");
}
