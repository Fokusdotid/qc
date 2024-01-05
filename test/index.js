import FormData from 'form-data';
import axios, { isAxiosError } from "axios";
import QC from '../index.js';

async function telegraph(buffer, options = {}) {
	const filename = options.filename || options.fileName || options.name || options.Name || '';
	const form = new FormData();
	form.append('file', buffer, filename || 'image.png');

	try {
		const { data } = await axios({
			url: "https://telegra.ph/upload",
			method: 'POST',
			data: form,
			headers: form.getHeaders()
		});

		if (!Array.isArray(data) || !data[0].src) throw "Failed to upload this file";
		return "https://telegra.ph" + data[0].src;
	} catch (e) {
		if (isAxiosError(e)) e = e.response.data;
		throw e;
	};
};

const data = {
    type: 'quote',
    format: 'png',
    backgroundColor: '#1b1429',
    width: 512,
    height: 768,
    scale: 2,
    messages: [
        {
            entities: [],
            media: {
                url: 'https://via.placeholder.com/1000'
            },
            avatar: true,
            from: {
                id: 1,
                name: 'Fokus ID',
                photo: {
                    url: 'https://via.placeholder.com/100'
                }
            },
            text: 'Hey',
            replyMessage: {}
        }
    ]
};

QC(data)
    .then(async({ image }) => {
    	await telegraph(Buffer.from(image, 'base64'))
    		.then(console.log)
    		.catch(console.error);
    })
    .catch(console.error);
