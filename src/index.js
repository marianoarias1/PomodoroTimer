const softPomodoro = document.getElementById("soft")
const mediumPomodoro = document.getElementById("medium")
const hardPomodoro = document.getElementById("hard")
const countDownElement = document.getElementById('timer')
const puaseButton = document.getElementById('pause-btn')
const reStartButton = document.getElementById('restart-btn')
const resetTimeButton = document.getElementById('reset-time-button')
const textButton= document.getElementById('text-btn')


countDownElement.innerHTML = `0:00`
const sound = new Audio("./sounds/videoplayback.m4a")

let pause = false
let resetTimeToZero = false

let reStartMainTask = 0
let reStartScondaryTask = 0

function enableReStartTimeIcon() {
    reStartButton.removeAttribute('disabled')
    reStartButton.removeAttribute("class")
}

function disableReStartTimeIcon() {
    reStartButton.setAttribute('disabled', 'true')
    reStartButton.setAttribute("class", "disabled-icon")
}

function enablePauseIcon() {
    puaseButton.removeAttribute('disabled')
    puaseButton.removeAttribute("class")
}

function disablePauseIcon() {
    puaseButton.setAttribute('disabled', 'true')
    puaseButton.setAttribute("class", "disabled-icon")
}


function enableResetTimeIcon() {
    resetTimeButton.removeAttribute('disabled')
    resetTimeButton.removeAttribute("class")
}

function disableResetTimeIcon() {
    resetTimeButton.setAttribute('disabled', 'true')
    resetTimeButton.setAttribute("class", "disabled-icon")
}


function disbleButtons() {
    //deshabilitamos los botones para que los tiempos no se superpongan
    softPomodoro.setAttribute('disabled', 'true')
    mediumPomodoro.setAttribute('disabled', 'true')
    hardPomodoro.setAttribute('disabled', 'true')

    //Agregamos una clase para darle un aspecto visual que el usuario pueda comprender
    softPomodoro.setAttribute("class", "disabled")
    mediumPomodoro.setAttribute("class", "disabled")
    hardPomodoro.setAttribute("class", "disabled")
    textButton.setAttribute("class", "hide-text-btn")
}

function enableButtons() {
    //habilitamos los botones nuevamente
    softPomodoro.removeAttribute('disabled')
    mediumPomodoro.removeAttribute('disabled')
    hardPomodoro.removeAttribute('disabled')

    //Agregamos una clase para darle un aspecto visual que el usuario pueda comprender
    softPomodoro.removeAttribute("class")
    mediumPomodoro.removeAttribute("class")
    hardPomodoro.removeAttribute("class")
    textButton.classList.remove("hide-text-btn")
    textButton.classList.add("text-btn-container")
}


function pauseCountdown(mainTask, secondaryTask, idInterval) {
    reStartMainTask = mainTask;
    reStartScondaryTask = secondaryTask;
    if (pause) {
        clearInterval(idInterval)
        enableReStartTimeIcon()
        return (reStartMainTask, reStartScondaryTask)
    }

}

function restartCountdown(mainTask, secondaryTask) {
    const newMainTask = mainTask / 60;
    const newSecondaryTask = secondaryTask / 60;
    if (!pause) {
        return startCountdown(newMainTask, newSecondaryTask)
    }
}

function resetTime(idInterval) {
    if (resetTimeToZero) {
        pause = false
        enableButtons()
        disablePauseIcon()
        disableResetTimeIcon()
        disableReStartTimeIcon()
        clearInterval(idInterval)
        return startCountdown(0,0)
    }
}

function startCountdown(mainTask, secondaryTask,) {
    //Seteamos los timepos de las distintas etapas, una etapa de tarea principal y una etapa de tarea secundaria
    let timeMainTask = mainTask * 60;
    let timeSecondaryTask = secondaryTask * 60

    //obtenemos los minutos y segundos para que el temporizador no arranque un segundo atrasado
    const minutes = Math.floor(timeMainTask / 60);
    let seconds = timeMainTask % 60;
    seconds = seconds < 10 ? '0' + seconds : seconds

    if (timeMainTask) {
        countDownElement.innerHTML = `${minutes}:${seconds}`
        //seteamos el id del intervalo para posteriormente utilizarlo
        const idInterval = setInterval(() => {
            //Establecemos como condicion que si el timepo de la tarea principal es mayo a cero ejecute este bloque
            if (timeMainTask > 0) {
                timeMainTask--
                countDownElement.innerHTML = `${Math.floor(timeMainTask / 60)}:${timeMainTask % 60 < 10 ? '0' + timeMainTask % 60 : timeMainTask % 60}`

                pauseCountdown(timeMainTask, timeSecondaryTask, idInterval)
                resetTime(idInterval)
                timeMainTask === 0 ? sound.play() : null

            }
            //Si la condicion anterior no se cumple, evalua que el tiempo de la tarea secundaria sea distinto de cero, pero que también el tiempo de la principal se haya acabdo
            else if (timeMainTask === 0 && timeSecondaryTask !== 0) {
                setTimeout(() => {
                    timeSecondaryTask--
                    countDownElement.innerHTML = `${Math.floor(timeSecondaryTask / 60)}:${timeSecondaryTask % 60 < 10 ? '0' + timeSecondaryTask % 60 : timeSecondaryTask % 60}`
                }, 500)
                resetTime(idInterval)
                pauseCountdown(timeMainTask, timeSecondaryTask, idInterval)

            }
            //En caso de que ambas condiciones resulten falsas, significa que el tiempo de ambas tareas terminó y por tanto también la ejecución del programa
            else {
                //removemos la clase de los botones, habilitamos los mismos, y borramos el intervalo con el ID

                enableButtons()
                sound.play()
                return clearInterval(idInterval)
            }
        }, 1000)
    }
    else {
        countDownElement.innerHTML = `0:00`
    }

}

puaseButton.addEventListener("click", () => {
    pause = true
    disablePauseIcon()
})

reStartButton.addEventListener("click", () => {
    pause = false
    disableReStartTimeIcon()
    enablePauseIcon()
    restartCountdown(reStartMainTask, reStartScondaryTask)
})

resetTimeButton.addEventListener("click", () => {
    resetTimeToZero = true
    resetTime()
})

softPomodoro.addEventListener("click", () => {
    resetTimeToZero = false
    startCountdown(25, 5)
    disbleButtons()
    enablePauseIcon()
    enableResetTimeIcon()
})

mediumPomodoro.addEventListener("click", () => {
    resetTimeToZero = false
    startCountdown(40, 20)
    disbleButtons()
    enablePauseIcon()
    enableResetTimeIcon()
})

hardPomodoro.addEventListener("click", () => {
    resetTimeToZero = false
    startCountdown(60, 30)
    disbleButtons()
    enablePauseIcon()
    enableResetTimeIcon()
})