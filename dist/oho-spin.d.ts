interface Quadrant {
    image?: string;
    text: string;
    color?: string;
    backgroundImage?: string;
    textColor?: string;
    fontSize?: number;
    fontStyle?: string;
    weight?: number;
    value?: string | number;
}
interface SpinConfig {
    container: string | HTMLElement;
    quadrants: Quadrant[];
    spinDuration?: number;
    soundEnabled?: boolean;
    soundFile?: string;
    pointerAngle?: number;
    isInteractive?: boolean;
    easing?: "linear" | "easeOut" | "cubicOut";
    overlayImage?: string;
    resultPosition?: "left" | "right" | "top" | "bottom";
    is3D?: boolean;
    onSpinComplete?: (result: Quadrant) => void;
}
declare class SpinTheWheel {
    private canvas;
    private ctx;
    private config;
    private angle;
    private isSpinning;
    private lastMouseX;
    private lastMouseY;
    private images;
    private overlayImg;
    private rotationSpeed;
    private targetQuadrant;
    private winningResult;
    constructor(config: SpinConfig);
    private preloadImages;
    private drawWheel;
    spinToIndex(index: number, speed: number): void;
    spin(): void;
    setWinningQuadrant(quadrantText: string): void;
    setRotationSpeed(speed: number): void;
    reset(): void;
    getCurrentQuadrant(): Quadrant;
    stopSpin(): void;
    toggleInteractivity(enable: boolean): void;
    private getWinningQuadrant;
    private setupInteraction;
    private removeInteraction;
    private handleMouseDown;
    private handleMouseMove;
    private handleMouseUp;
    private handleTouchStart;
    private handleTouchMove;
}

export { SpinTheWheel as default };
