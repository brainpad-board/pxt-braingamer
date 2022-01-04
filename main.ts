braingamer.onEvent(GamerButton.down, function () {
    braingamer.Beep()
})
braingamer.onEvent(GamerButton.up, function () {
    basic.showString("u")
})
basic.forever(function () {
    basic.showNumber(braingamer.Rocket(GamerRocket.Y))
})
