enum GamerRocket {
    X = 0,
    Y = 1    
}

enum GamerButton {
    up = 0,
    down= 1,    
	left= 2,
	right= 3
}

/**
 * BrainGamer
 */
//% block="BrainGamer"
//% weight=70 color="#e15f41" icon="\uf11b"
namespace braingamer {	
	
	
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
	
	

}
