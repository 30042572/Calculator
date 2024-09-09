/*
    TODO:
    trim trailing zeros from decimal numbers --> issue noticed but cannot recreate
    BUG FIX - negative signs missing from calcualtions when using keyboard entry
*/

const calculator = {

    add: function (num1, num2) {
        return num1 + num2;
    },

    subtract: function (num1, num2) {
        return num1 - num2;
    },

    multiply: function (num1, num2) {
        return num1 * num2;
    },

    divide: function (num1, num2) {
        return num1 / num2;
    },

    operate(num1, num2, operation) {
        switch (operation) {
            case "+": return this.add(num1, num2);
            case "-": return this.subtract(num1, num2);
            case "x": return this.multiply(num1, num2);
            case "÷": return this.divide(num1, num2);
        }
    }
}

// Function to track button presses and take them all in
const callStack = {
    stack: [],

    addToStack(item) {
        this.stack.push(item);
    },

    clearStack() {
        this.stack.length = 0;
    }
}

const numberKeys = [] // Used for key press detection
for (let i = 0; i < 10; i++) {
    numberKeys[i] = `${i}`;
}

document.addEventListener("DOMContentLoaded", () => {

    const numbers = document.querySelectorAll(".number");
    const operators = document.querySelectorAll(".operator");
    const text = document.getElementById("display-text");
    text.innerHTML = "";
    const delay = 300;
    const maxLength = 12;

    function addLetter(letter) {
        text.innerHTML += letter;
    }

    function removeActive() {
        for (const operator of operators) {
            if (operator.classList.contains("active")) {
                operator.classList.remove("active");
            }
        }
    }

    const welcomeMessage = "WELCOME";
    for (let i = 0; i < welcomeMessage.length; i++) {
        setTimeout(() => {
            addLetter(welcomeMessage[i]);
        }, i * delay);
    }

    setTimeout(() => {
        text.innerHTML = "";
    }, welcomeMessage.length * delay + 1000);

    for (const number of numbers) {
        number.addEventListener("click", () => {
            removeActive();
            if (text.innerHTML.length < maxLength) {
                text.innerHTML += number.textContent.trim()
            }
        });
    }

    document.getElementById("decimal").addEventListener("click", () => {

        const content = text.innerHTML;
        const check = content.includes(".");
        if (!check && content.length < maxLength - 1) {
            text.innerHTML += ".";
        }
    })

    for (const operator of operators) {
        operator.addEventListener("click", () => {
            const numberToAdd = Number(text.innerHTML);
            callStack.addToStack(numberToAdd);
            callStack.addToStack(operator.textContent.trim());
            text.innerHTML = "";
            operator.classList.add("active");

            for (const number of numbers) {
                if (number.hasAttribute("disabled")) {
                    number.removeAttribute("disabled");
                }
            }
            document.getElementById("decimal").removeAttribute("disabled");
        });
    }

    document.getElementById("equals").addEventListener("click", () => {
        callStack.addToStack(Number(text.innerHTML));
        console.log(`FIRST PRINT: CALL STACK: ${callStack.stack}`);
        console.log(`SECOND PRINT: CURRENT NUMBER: ${text.innerHTML}`);
        text.innerHTML = "";
        const ops = ["+", "-", "x", "÷"];
        let result = 0;

        if (callStack.stack.length >= 3) {

            callStack.stack.forEach(element => {

                if (ops.includes(element)) {

                    const position = callStack.stack.indexOf(element);
                    const number1 = callStack.stack[position - 1];
                    const number2 = callStack.stack[position + 1];
                    console.log(`THIRD PRINT: ${number1, number2}`);

                    const zeroDivisionCheck = (element === "÷" && (number2 === 0 || number2 === 0.0)) ? true : false;

                    if (!zeroDivisionCheck) {
                        result = calculator.operate(number1, number2, element);
                        console.log(`FOURTH PRINT: RESULT: ${result}`);
                        callStack.stack = callStack.stack.slice(position + 1);
                        console.log(`FIFTH PRINT: STACK: ${callStack.stack}`);
                        callStack.stack[0] = result;
                        console.log(`SIXTH PRINT: STACK: ${callStack.stack}`);
                    } else {
                        alert("Whoa there...maths hasn't quite sussed out dividing by zero yet!")
                        result = null;
                    }
                }
            });

            console.log(`SEVENTH PRINT: RESULT: ${result}`);

            if (result !== null) {
                const strResult = String(result);
                console.log(`EIGTH RESULT: STRING RESULT: ${strResult}`);

                if (strResult.length > maxLength) {
                    text.innerHTML = result.toPrecision(maxLength - 1);
                } else {

                    console.log(`NINTH PRINT: RESULT: ${result} : STRING RESULT: ${strResult}`);
                    text.innerHTML = result;
                    console.log(`TENTH PRINT: RESULT: ${result} : DISPLAY: ${text.innerHTML}`);
                }

                for (const number of numbers) {
                    number.setAttribute("disabled", "disabled");
                }
                document.getElementById("decimal").setAttribute("disabled", "disabled");
            }
        }

    });

    document.getElementById("clear").addEventListener("click", () => {
        text.innerHTML = "";
        callStack.stack = [];
        for (const number of numbers) {
            if (number.hasAttribute("disabled")) {
                number.removeAttribute("disabled");
            }
        }
        document.getElementById("decimal").removeAttribute("disabled");
    });

    document.getElementById("back").addEventListener("click", () => {
        const currnetContent = text.innerHTML;
        text.innerHTML = currnetContent.slice(0, currnetContent.length - 1);
    });

    document.getElementById("sign").addEventListener("click", () => {
        const currnetContent = text.innerHTML;

        if (currnetContent.charAt(0) === "-") {
            text.innerHTML = currnetContent.substring(1);
        } else {
            text.innerHTML = "-" + currnetContent;
        }
    });

    document.addEventListener("keydown", (event) => {

        const key = event.key;

        if (numberKeys.includes(key)) {
            const keyElement = document.getElementById(key);
            if (keyElement) {
                keyElement.click();
            }
        } else if (key === "Enter") {
            document.getElementById("equals").click();
        } else if (key === "Backspace") {
            document.getElementById("back").click();
        } else if (key === ".") {
            document.getElementById("decimal").click();
        } else if (key === "c") {
            document.getElementById("clear").click();
        } else if (key === "m") {
            document.getElementById("sign").click();
        } else {
            const operatorsMap = {
                "+": "+",
                "-": "-",
                "*": "x",
                "/": "÷"
            };

            if (operatorsMap[key]) {
                if (key === "/") {
                    event.preventDefault();
                }
                const operatorButton = Array.from(document.querySelectorAll(".operator")).find(op => op.textContent.trim() === operatorsMap[key]);
                operatorButton.click();
            }
        }
    });
});