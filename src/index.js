"use strict";
const answer = [Math.floor(Math.random() * (1 << 8)), Math.floor(Math.random() * (1 << 8)), Math.floor(Math.random() * (1 << 8))];
document.body.style.backgroundColor = `rgb(${answer[0]}, ${answer[1]}, ${answer[2]})`;
// console.log(`#${('0' + answer[0].toString(16)).slice(-2)}${('0' + answer[1].toString(16)).slice(-2)}${('0' + answer[2].toString(16)).slice(-2)}`);
const input1 = document.getElementById('input1');
const input2 = document.getElementById('input2');
const canvas1 = document.getElementById('canvas1');
const canvas2 = document.getElementById('canvas2');
const canvasVis = document.getElementById('vis');
const ctx = canvasVis.getContext('2d');
function drawCircle(x, y, r, fill, stroke = 'none', lineWidth = 0) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    if (stroke != 'none')
        ctx.stroke();
    ctx.fill();
    ctx.closePath();
}
function drawLine(sx, sy, tx, ty) {
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(tx, ty);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.closePath();
}
// const color1 = [Math.floor(Math.random() * (1 << 8)), Math.floor(Math.random() * (1 << 8)), Math.floor(Math.random() * (1 << 8))];
// const color2 = [Math.floor(Math.random() * (1 << 8)), Math.floor(Math.random() * (1 << 8)), Math.floor(Math.random() * (1 << 8))];
// input1.value = `#${('0' + color1[0].toString(16)).slice(-2)}${('0' + color1[1].toString(16)).slice(-2)}${('0' + color1[2].toString(16)).slice(-2)}`
// input2.value = `#${('0' + color2[0].toString(16)).slice(-2)}${('0' + color2[1].toString(16)).slice(-2)}${('0' + color2[2].toString(16)).slice(-2)}`
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
    vis(color1, color2, answer.slice(0));
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
    for (let i = 0; i < 3; i++) {
        a[i] -= o[i];
        b[i] -= o[i];
        c[i] -= o[i];
    }
    const N = canvasVis.height / 2;
    const norm = det(a, b);
    const p = [-norm[1], norm[0], 0];
    const q = det(p, norm);
    const abs_p = abs(p);
    const abs_q = abs(q);
    for (let i = 0; i < 3; i++) {
        p[i] /= abs_p;
        q[i] /= abs_q;
    }
    // console.log(dot(p, norm));
    // console.log(dot(q, norm));
    // console.log(dot(p, q));
    // console.log(dot(c, norm));
    // console.log(N, abs(p));
    // console.log(N, abs(q));
    const sa = (a[0] * q[1] - q[0] * a[1]) / (p[0] * q[1] - q[0] * p[1]);
    const ta = (p[0] * a[1] - a[0] * p[1]) / (p[0] * q[1] - q[0] * p[1]);
    const sb = (b[0] * q[1] - q[0] * b[1]) / (p[0] * q[1] - q[0] * p[1]);
    const tb = (p[0] * b[1] - b[0] * p[1]) / (p[0] * q[1] - q[0] * p[1]);
    const sc = (c[0] * q[1] - q[0] * c[1]) / (p[0] * q[1] - q[0] * p[1]);
    const tc = (p[0] * c[1] - c[0] * p[1]) / (p[0] * q[1] - q[0] * p[1]);
    const colorA = `rgb(${a[0] + o[0]},${a[1] + o[1]},${a[2] + o[2]})`;
    const colorB = `rgb(${b[0] + o[0]},${b[1] + o[1]},${b[2] + o[2]})`;
    const colorC = `rgb(${c[0] + o[0]},${c[1] + o[1]},${c[2] + o[2]})`;
    const scale = Math.max(1.0, Math.max(Math.abs(sa), Math.abs(ta), Math.abs(sb), Math.abs(tb), Math.abs(sc), Math.abs(tc)) * 1.1 / N);
    for (let y = 0; y <= 2 * N; y += 3) {
        for (let x = 0; x <= 2 * N; x += 3) {
            const v = [0, 0, 0];
            for (let i = 0; i < 3; i++) {
                const s = (x - N) * scale;
                const t = (y - N) * scale;
                v[i] = s * p[i] + t * q[i];
            }
            const [R, G, B] = [v[0] + o[0], v[1] + o[1], v[2] + o[2]];
            drawCircle(x, y, 4, `rgb(${R}, ${G}, ${B})`);
        }
    }
    const ax = sa / scale + N;
    const ay = ta / scale + N;
    const bx = sb / scale + N;
    const by = tb / scale + N;
    const cx = sc / scale + N;
    const cy = tc / scale + N;
    drawLine(ax, ay, cx, cy);
    drawLine(bx, by, cx, cy);
    drawCircle(ax, ay, 3, colorA, 'black', 3);
    drawCircle(bx, by, 3, colorB, 'black', 3);
    drawCircle(cx, cy, 3, colorC, 'black', 3);
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
function textColor(a) {
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2] < 128 ? 'white' : 'black';
}
