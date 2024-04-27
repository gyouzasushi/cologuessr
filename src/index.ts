const answer = [Math.floor(Math.random() * (1 << 8)), Math.floor(Math.random() * (1 << 8)), Math.floor(Math.random() * (1 << 8))];
document.body.style.backgroundColor = `rgb(${answer[0]}, ${answer[1]}, ${answer[2]})`;

const input1 = <HTMLInputElement>document.getElementById('input1')!;
const input2 = <HTMLInputElement>document.getElementById('input2')!;


const canvas1 = <HTMLCanvasElement>document.getElementById('canvas1')!;
const canvas2 = <HTMLCanvasElement>document.getElementById('canvas2')!;


const result1 = document.getElementById('result1')!;
const result2 = document.getElementById('result2')!;
const answerForm = document.getElementById('answer')!;

const judgeButton = document.getElementById('judge')!;
judgeButton.onclick = judge;

function judge() {
    const number1 = parseInt(`0x${input1.value}`, 16);
    const color1 = [number1 >> 16, (number1 & (0x00ff00)) >> 8, number1 & 0x0000ff]
    const dist1 = euclideanDistance(answer, color1);
    canvas1.style.backgroundColor = `rgb(${color1[0]}, ${color1[1]}, ${color1[2]})`;

    const number2 = parseInt(`0x${input2.value}`, 16);
    const color2 = [number2 >> 16, (number2 & (0x00ff00)) >> 8, number2 & 0x0000ff]
    const dist2 = euclideanDistance(answer, color2);
    canvas2.style.backgroundColor = `rgb(${color2[0]}, ${color2[1]}, ${color2[2]})`;

    const textColor = 0.2126 * answer[0] + 0.7152 * answer[1] + 0.0722 * answer[2] < 128 ? 'white' : 'black';

    result1.style.color = textColor;
    result1.textContent = `distance: ${dist1}`;
    result2.style.color = textColor;
    result2.textContent = `distance: ${dist2}`;

    answerForm.style.color = textColor;
    answerForm.textContent = `answer: #${('0' + answer[0].toString(16)).slice(-2)}${('0' + answer[1].toString(16)).slice(-2)}${('0' + answer[2].toString(16)).slice(-2)}`;
}

function euclideanDistance(a: number[], b: number[]) {
    let dist = 0;
    for (let i = 0; i < 3; i++) {
        dist += (a[i] - b[i]) * (a[i] - b[i]);
    }
    return Math.sqrt(dist).toFixed(2);
}