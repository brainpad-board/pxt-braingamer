enum GamerRocket {
    X = 0,
    Y = 1    
}

enum GamerButton  {
    up = 0,
    down = 1,
    left = 2,
    right = 3
}


interface IGamerActionVector {
    _button: GamerButton;
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
        let item: IGamerActionVector = { _button: button, _action: handler };

        gamerButtonActionCallback.push(item);
    }

    let buttonValue: number
    let buttonScanIdx: number = 1;


    function GamerGetButtonState() : number {
        switch (buttonScanIdx) {
            case 0: buttonValue = pins.digitalReadPin(DigitalPin.P14) == 0 ? 1 : 0
            case 1: buttonValue = pins.digitalReadPin(DigitalPin.P15) == 0 ? 1 : 0
            case 2: buttonValue = pins.digitalReadPin(DigitalPin.P13) == 0 ? 1 : 0
            case 3: buttonValue = pins.digitalReadPin(DigitalPin.P16) == 0 ? 1 : 0
                
        }
        buttonScanIdx++;
        if (buttonScanIdx == 4)
            buttonScanIdx = 0

        return buttonValue;
    }

    forever(() => {
        if (gamerButtonActionCallback != null) {
            let sta = GamerGetButtonState();
            if (sta == 0) {
                for (let item of gamerButtonActionCallback) {
                    if (item._button == sta) {
                        item._action();
                    }
                }
            }
        }
        pause(40);
    })
	
	

}
