import { createCanvas } from 'canvas';

export function normalizeColor(color) {
    const canvas = createCanvas(0, 0);
    const canvasCtx = canvas.getContext('2d');

    canvasCtx.fillStyle = color;
    color = canvasCtx.fillStyle;

    return color;
};

export function colorLuminance(hex, lum) {
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    };

    lum = lum || 0;

    // convert to decimal and change luminosity
    let rgb = '#', c;
    for (let i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ('00' + c).substr(c.length);
    };

    return rgb;
};

export function imageAlpha(image, alpha) {
    const canvas = createCanvas(image.width, image.height);
    const canvasCtx = canvas.getContext('2d');

    canvasCtx.globalAlpha = alpha;
    canvasCtx.drawImage(image, 0, 0);

    return canvas;
};

export default {
    normalizeColor,
    colorLuminance,
    imageAlpha
};
