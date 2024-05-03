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
const INF = 1e9;
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
    const p = [0, 0, 0];
    const N = canvasVis.height / 2;
    if (a[2] == 0) {
        p[0] = a[0];
        p[1] = a[1];
    }
    else {
        p[0] = b[0] - a[0] * b[2] / a[2];
        p[1] = b[1] - a[1] * b[2] / a[2];
        for (let i = 0; i < 3; i++) {
            p[i] *= N / abs(p);
        }
    }
    const norm = det(a, b);
    const q = det(p, norm);
    for (let i = 0; i < 3; i++) {
        q[i] *= N / abs(q);
    }
    let minDistA = INF;
    let minDistB = INF;
    let minDistC = INF;
    let ax = 0, ay = 0;
    let bx = 0, by = 0;
    let cx = 0, cy = 0;
    let colorA = '', colorB = '', colorC = '';
    let textColorA = 'black', textColorB = 'black', textColorC = 'black';
    for (let y = -N; y <= N; y += 4) {
        for (let x = -N; x <= N; x += 4) {
            const v = [0, 0, 0];
            for (let i = 0; i < 3; i++) {
                const s = x / N;
                const t = y / N;
                v[i] = s * p[i] + t * q[i];
            }
            const [R, G, B] = [v[0] + o[0], v[1] + o[1], v[2] + o[2]];
            drawCircle(x + N, y + N, 4, `rgb(${R}, ${G}, ${B})`);
            const distA = euclideanDistance(v, a);
            const distB = euclideanDistance(v, b);
            const distC = euclideanDistance(v, c);
            if (distA < minDistA) {
                minDistA = distA;
                ax = x, ay = y;
                colorA = `rgb(${R}, ${G}, ${B})`;
                // textColorA = textColor([R, G, B]);
            }
            if (distB < minDistB) {
                minDistB = distB;
                bx = x, by = y;
                colorB = `rgb(${R}, ${G}, ${B})`;
                // textColorB = textColor([R, G, B]);
            }
            if (distC < minDistC) {
                minDistC = distC;
                cx = x, cy = y;
                colorC = `rgb(${R}, ${G}, ${B})`;
                // textColorC = textColor([R, G, B]);
            }
        }
    }
    // console.log(ax + N, ay + N);
    // console.log(bx + N, by + N);
    // console.log(cx + N, cy + N);
    drawLine(ax + N, ay + N, cx + N, cy + N);
    drawLine(bx + N, by + N, cx + N, cy + N);
    drawCircle(ax + N, ay + N, 3, colorA, textColorA, 3);
    drawCircle(bx + N, by + N, 3, colorB, textColorB, 3);
    drawCircle(cx + N, cy + N, 3, colorC, textColorC, 3);
    // const distAC = Math.sqrt((ax - cx) * (ax - cx) + (ay - cy) * (ay - cy));
    // const distBC = Math.sqrt((bx - cx) * (bx - cx) + (by - cy) * (by - cy));
    // console.log(minDistA, minDistB, minDistC);
    // console.log('vis:', distAC / distBC);
    // console.log("judge:", euclideanDistance(a, c) / euclideanDistance(b, c));
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
