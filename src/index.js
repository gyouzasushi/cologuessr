"use strict";
const answer = [Math.floor(Math.random() * (1 << 8)), Math.floor(Math.random() * (1 << 8)), Math.floor(Math.random() * (1 << 8))];
document.body.style.backgroundColor = `rgb(${answer[0]}, ${answer[1]}, ${answer[2]})`;
const input1 = document.getElementById('input1');
const input2 = document.getElementById('input2');
const canvas1 = document.getElementById('canvas1');
const canvas2 = document.getElementById('canvas2');
const canvasVis = document.getElementById('vis');
const ctx = canvasVis.getContext('2d');
function drawCircle(x, y, r, fill) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.closePath();
}
/* to be deleated */
const color1 = [Math.floor(Math.random() * (1 << 8)), Math.floor(Math.random() * (1 << 8)), Math.floor(Math.random() * (1 << 8))];
const color2 = [Math.floor(Math.random() * (1 << 8)), Math.floor(Math.random() * (1 << 8)), Math.floor(Math.random() * (1 << 8))];
input1.value = `#${('0' + color1[0].toString(16)).slice(-2)}${('0' + color1[1].toString(16)).slice(-2)}${('0' + color1[2].toString(16)).slice(-2)}`;
input2.value = `#${('0' + color2[0].toString(16)).slice(-2)}${('0' + color2[1].toString(16)).slice(-2)}${('0' + color2[2].toString(16)).slice(-2)}`;
/* -------------- */
const result1 = document.getElementById('result1');
const result2 = document.getElementById('result2');
const answerForm = document.getElementById('answer');
const judgeButton = document.getElementById('judge');
judgeButton.onclick = judge;
function judge() {
    const number1 = parseInt(`0x${input1.value.slice(1)}`, 16);
    const color1 = [number1 >> 16, (number1 & (0x00ff00)) >> 8, number1 & 0x0000ff];
    const dist1 = euclideanDistance(answer, color1);
    canvas1.style.backgroundColor = `rgb(${color1[0]}, ${color1[1]}, ${color1[2]})`;
    const number2 = parseInt(`0x${input2.value.slice(1)}`, 16);
    const color2 = [number2 >> 16, (number2 & (0x00ff00)) >> 8, number2 & 0x0000ff];
    const dist2 = euclideanDistance(answer, color2);
    canvas2.style.backgroundColor = `rgb(${color2[0]}, ${color2[1]}, ${color2[2]})`;
    const textColor = 0.2126 * answer[0] + 0.7152 * answer[1] + 0.0722 * answer[2] < 128 ? 'white' : 'black';
    const crown1 = (dist1 <= dist2) ? '👑 ' : '';
    const crown2 = (dist2 <= dist1) ? '👑 ' : '';
    result1.style.color = textColor;
    result1.textContent = `${crown1}distance: ${dist1.toFixed(2)}`;
    result2.style.color = textColor;
    result2.textContent = `${crown2}distance: ${dist2.toFixed(2)}`;
    answerForm.style.color = textColor;
    answerForm.textContent = `answer: #${('0' + answer[0].toString(16)).slice(-2)}${('0' + answer[1].toString(16)).slice(-2)}${('0' + answer[2].toString(16)).slice(-2)}`;
    console.log(color1, color2);
    vis(color1, color2, answer);
}
function euclideanDistance(a, b) {
    let dist = 0;
    for (let i = 0; i < 3; i++) {
        dist += (a[i] - b[i]) * (a[i] - b[i]);
    }
    return Math.sqrt(dist);
}
input1.addEventListener('input', function () {
    const value = input1.value;
    if (!value.startsWith('#')) {
        input1.value = '#' + value;
    }
});
input2.addEventListener('input', function () {
    const value = input2.value;
    if (!value.startsWith('#')) {
        input2.value = '#' + value;
    }
});
function vis(a, b, c) {
    const o = [
        (a[0] + b[0] + c[0]) / 3,
        (a[1] + b[1] + c[1]) / 3,
        (a[2] + b[2] + c[2]) / 3,
    ];
    console.log(a, b, c);
    let max_abs = Math.max(abs(a), abs(b), abs(c));
    a = [(a[0] - o[0]) / abs(a) * max_abs, (a[1] - o[1]) / abs(a) * max_abs, (a[2] - o[2]) / abs(a) * max_abs];
    b = [(b[0] - o[0]) / abs(b) * max_abs, (b[1] - o[1]) / abs(b) * max_abs, (b[2] - o[2]) / abs(b) * max_abs];
    c = [(c[0] - o[0]) / abs(c) * max_abs, (c[1] - o[1]) / abs(c) * max_abs, (c[2] - o[2]) / abs(c) * max_abs];
    const h = canvasVis.height;
    const w = canvasVis.width;
    const norm1 = det(a, b);
    for (let s = -1.5; s <= 1.5; s += 0.05) {
        for (let t = -1.5; t <= 1.5; t += 0.05) {
            const v = [s * a[0] + t * b[0], s * a[1] + t * b[1], s * a[2] + t * b[2]];
            const r = abs(v);
            const norm2 = det([-a[0], -a[1], -a[2]], v);
            const cos = dot(v, a) / (abs(v) * abs(a));
            const sin = (dot(norm1, norm2) > 0 ? +1 : -1) * Math.sqrt(1 - cos * cos);
            const x = r * cos / 2 + w / 2;
            const y = r * sin / 2 + h / 2;
            drawCircle(x, y, 2, `rgb(${v[0] + o[0]},${v[1] + o[0]},${v[2] + o[0]})`);
        }
    }
}
function abs(a) {
    return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
}
function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
function det(a, b) {
    return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}
