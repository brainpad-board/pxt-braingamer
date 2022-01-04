enum GamerRocket {
    X = 0,
    Y = 1    
}

enum GamerButton  {
    up = 1,
    down = 2,
    left = 3,
    right = 4    
}


interface IGamerActionVector {
    _button: number;
    _action: Action;
}

/**
 * BrainGamer
 */
//% block="BrainGamer"
//% weight=70 color="#e15f41" icon="\uf11b"
namespace braingamer {	
    /**
     * Set sound On, Off
     */
    //% blockId=braingamer_sound block="set sound %on=toggleOnOff"
    //% weight=99
    export function Sound(on: boolean): void {
        if (on) {
            pins.P0.analogWrite(512)
            pins.P0.analogSetPeriod(1000)
        }

        else
            pins.P0.analogWrite(0)
    }

    /**
     * Play short sound
     */
    //% blockId=braingamer_beep block="Beep"
    //% weight=98
    export function Beep(): void {
        pins.P0.analogWrite(512)
        pins.P0.analogSetPeriod(1000)
        pause(100);
        pins.P0.analogWrite(0)
    }
	
	/**
	 * Set vibrate
	 */
	//% blockId=braingamer_vibrate block="set vibrate %on=toggleOnOff"
	//% weight=97
    export function Vibrate(on: boolean): void {
        if (on)
			pins.P8.digitalWrite(false)
		else 
			pins.P8.digitalWrite(true)
				
    } 

    /**
     * Read rocket value in range -1024..1024
     */
    //% blockId=braingamer_rocket block="rocker %gamerrocket"
    //% weight=96
    export function Rocket(gamerrocket: GamerRocket): number {
        let value = 0;
        if (gamerrocket == GamerRocket.X) {
            value = pins.P4.analogRead();             
            value = Math.map(value, 0, 1024, 1024, -1024);
        }
        else {
            value = pins.P3.analogRead();            
            value = Math.map(value, 0, 1024, -1024, 1024);
        }

        return value | 0;
    }

    let gamerButtonActionCallback: IGamerActionVector[] = []

    /**
     * Run some code when a button is pressed or released
     */
    //% weight=95 blockGap=8 help=controller/button/on-event
    //% blockId=braingamer_keyonevent block="on button %button pressed"
    export function onEvent(button: GamerButton, handler: () => void) {
        let bt = 0;

        switch (button) {
            case GamerButton.up: 
                bt = 1 
                pins.setPull(DigitalPin.P14, PinPullMode.PullUp)
                break
            case GamerButton.down: 
                pins.setPull(DigitalPin.P15, PinPullMode.PullUp)
                bt = 2
                break
            case GamerButton.left: 
                pins.setPull(DigitalPin.P13, PinPullMode.PullUp)
                bt = 3
                break
            case GamerButton.right: 
                pins.setPull(DigitalPin.P16, PinPullMode.PullUp)
                bt = 4
                break
        }
        let item: IGamerActionVector = { _button: bt, _action: handler };

        gamerButtonActionCallback.push(item);
    }

    let buttonValue: number
    let buttonScanIdx: number = 0;

    function GamerGetButtonState() : number {
        switch (buttonScanIdx) {
            case 1:                 
                buttonValue = pins.digitalReadPin(DigitalPin.P14) == 0 ? 1 : 0
                break
            
            case 2:                 
                buttonValue = pins.digitalReadPin(DigitalPin.P15) == 0 ? 2 : 0
                break
            
            case 3:                 
                buttonValue = pins.digitalReadPin(DigitalPin.P13) == 0 ? 3 : 0
                break
            
            case 4:                 
                buttonValue = pins.digitalReadPin(DigitalPin.P16) == 0 ? 4 : 0
                break
                
        }

        buttonScanIdx++;
        if (buttonScanIdx == 5)
            buttonScanIdx = 1

        return buttonValue;
    }


    forever(function () {
        if (gamerButtonActionCallback != null) {
            let sta = GamerGetButtonState();
            if (sta != 0) {
                for (let item of gamerButtonActionCallback) {
                    if (item._button == sta) {
                        item._action();
                    }

                }
            }
        }
        pause(25);
    })
}

