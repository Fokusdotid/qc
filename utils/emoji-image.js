import EmojiDbLib from 'emoji-db';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';
import { writeFile, existsSync, readFileSync } from 'fs';

import loadImageFromUrl from './image-load-url.js';
import promiseAllStepN from './promise-concurrent.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const emojiJFilesDir = '../assets/emoji/';
const emojiDb = new EmojiDbLib({ useDefaultDb: true });

const brandFoledIds = {
    apple: 325,
    google: 313,
    twitter: 322,
    joypixels: 340,
    blob: 56
};

const emojiJsonByBrand = {
    apple: 'emoji-apple-image.json',
    google: 'emoji-google-image.json',
    twitter: 'emoji-twitter-image.json',
    joypixels: 'emoji-joypixels-image.json',
    blob: 'emoji-blob-image.json'
};

const emojiImageByBrand = {
    apple: [],
    google: [],
    twitter: [],
    joypixels: [],
    blob: []
};

export default async function downloadEmoji(brand) {
    console.log('emoji image load start');

    const emojiImage = emojiImageByBrand[brand];

    const emojiJsonFile = resolve(
        __dirname,
        emojiJFilesDir + emojiJsonByBrand[brand]
    );

    const dbData = emojiDb.dbData;
    const dbArray = Object.keys(dbData);
    const emojiPromiseArray = [];

    for (const key of dbArray) {
        const emoji = dbData[key];

        if (!emoji.qualified && !emojiImage[key]) {
            emojiPromiseArray.push(async() => {
                let brandFolderName = brand;
                if (brand === 'blob') brandFolderName = 'google';

                const fileUrl = `${process.env.EMOJI_DOMAIN}/thumbs/60/${brandFolderName}/${brandFoledIds[brand]}/${emoji.image.file_name}`;

                const img = await loadImageFromUrl(fileUrl, (headers) => {
                    return !headers['content-type'].match(/image/);
                });

                const base64 = img.toString('base64');

                if (base64) {
                    return {
                        key,
                        base64
                    };
                }
            });
        }
    }

    const donwloadResult = await promiseAllStepN(200)(emojiPromiseArray);

    for (const emojiData of donwloadResult) {
        if (emojiData) emojiImage[emojiData.key] = emojiData.base64;
    }

    if (Object.keys(emojiImage).length > 0) {
        const emojiJson = JSON.stringify(emojiImage, null, 2);

        writeFile(emojiJsonFile, emojiJson, (err) => {
            if (err) return console.log(err);
        });
    }

    console.log('emoji image load end');
}

for (const brand in emojiJsonByBrand) {
    const emojiJsonFile = resolve(
        __dirname,
        emojiJFilesDir + emojiJsonByBrand[brand]
    );

    try {
        if (existsSync(emojiJsonFile)) emojiImageByBrand[brand] = readFileSync(emojiJsonFile, { encoding: 'utf-8' });
    } catch (error) {
        console.log(error);
    }
    // downloadEmoji(brand)
};
