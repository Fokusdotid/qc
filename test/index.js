import QC from '../index.js';

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
    .then(console.log)
    .catch(console.error);
