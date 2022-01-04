input.onButtonPressed(Button.A, function () {
    braingamer.Vibrate(true)
})
basic.forever(function () {
    basic.pause(500)
    braingamer.Vibrate(false)
})
