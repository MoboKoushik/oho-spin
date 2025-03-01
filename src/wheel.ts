import { playSound, stopSound } from "./audio";
import { getRandomInt } from "./utils";

export interface Quadrant {
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

export interface SpinConfig {
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

class SpinTheWheel {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private config: SpinConfig;
  private angle: number = 0;
  private isSpinning: boolean = false;
  private lastMouseX: number | null = null;
  private lastMouseY: number | null = null;
  private images: { [key: string]: HTMLImageElement } = {};
  private overlayImg: HTMLImageElement | null = null;
  private rotationSpeed: number = 1;
  private targetQuadrant: Quadrant | null = null;
  private winningResult: Quadrant | null = null;

  constructor(config: SpinConfig) {
    this.config = {
      spinDuration: 4000,
      soundEnabled: true,
      pointerAngle: 0,
      isInteractive: true,
      easing: "easeOut",
      resultPosition: "top", // Default position
      is3D: true,
      ...config,
    };

    const container =
      typeof this.config.container === "string"
        ? (document.querySelector(this.config.container) as HTMLElement)
        : this.config.container;
    if (!container || !(container instanceof HTMLElement))
      throw new Error("Container not found");

    this.canvas = document.createElement("canvas");
    this.canvas.width = 440;
    this.canvas.height = 440;
    container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d")!;

    this.preloadImages();

    if (this.config.isInteractive) {
      this.setupInteraction();
    }
    this.drawWheel();
  }

  private preloadImages() {
    this.config.quadrants.forEach((quadrant) => {
      if (quadrant.image) {
        const img = new Image();
        img.src = quadrant.image;
        img.onload = () => {
          // console.log(`Image preloaded: ${quadrant.image}`);
          this.images[quadrant.image!] = img;
          this.drawWheel();
        };
        img.onerror = () =>
          console.error(`Failed to preload image: ${quadrant.image}`);
      }
      if (quadrant.backgroundImage) {
        const bgImg = new Image();
        bgImg.src = quadrant.backgroundImage;
        bgImg.onload = () => {
          console.log(
            `Background image preloaded: ${quadrant.backgroundImage}`
          );
          this.images[quadrant.backgroundImage!] = bgImg;
          this.drawWheel();
        };
        bgImg.onerror = () =>
          console.error(
            `Failed to preload background image: ${quadrant.backgroundImage}`
          );
      }
    });

    if (this.config.overlayImage) {
      this.overlayImg = new Image();
      this.overlayImg.src = this.config.overlayImage;
      this.overlayImg.onload = () => {
        // console.log(`Overlay image preloaded: ${this.config.overlayImage}`);
        this.drawWheel();
      };
      this.overlayImg.onerror = () =>
        console.error(
          `Failed to preload overlay image: ${this.config.overlayImage}`
        );
    }
  }

  private drawWheel() {
    const ctx = this.ctx;
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Adjust the starting angle based on the resultPosition
    let offsetAngle = 0;
    switch (this.config.resultPosition) {
      case "right":
        offsetAngle = 0; // First quadrant starts at the right
        break;
      case "left":
        offsetAngle = Math.PI; // First quadrant starts at the left
        break;
      case "bottom":
        offsetAngle = Math.PI / 2; // First quadrant starts at the bottom
        break;
      case "top":
        offsetAngle = (3 * Math.PI) / 2; // First quadrant starts at the top
        break;
      default:
        offsetAngle = 0; // Default to top
    }

    const quadrantAngle = (2 * Math.PI) / this.config.quadrants.length;
    this.config.quadrants.forEach((quadrant, index) => {
      const startAngle = this.angle + index * quadrantAngle + offsetAngle;
      const endAngle = startAngle + quadrantAngle;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      if (this.config.is3D) {
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;
      }

      if (quadrant.backgroundImage && this.images[quadrant.backgroundImage]) {
        ctx.clip();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle);
        ctx.drawImage(
          this.images[quadrant.backgroundImage],
          -radius,
          -radius,
          radius * 2,
          radius * 2
        );
        ctx.rotate(-startAngle);
        ctx.translate(-centerX, -centerY);
      } else {
        ctx.fillStyle = quadrant.color || "#ffffff";
        ctx.fill();
      }

      ctx.restore();

      if (quadrant.image && this.images[quadrant.image]) {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + quadrantAngle / 2);
        ctx.drawImage(
          this.images[quadrant.image],
          radius / 2 - 20,
          -20,
          40,
          40
        );
        ctx.restore();
      }

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + quadrantAngle / 2);
      ctx.fillStyle = quadrant.textColor || "#000";
      ctx.font = quadrant.fontStyle || `${quadrant.fontSize || 16}px Arial`;
      ctx.textAlign = "center";

      const maxWidth = radius / 2;
      const lineHeight = (quadrant.fontSize || 16) * 1.2;
      const words = quadrant.text.split(" ");
      let line = "";
      let currentRadius = radius - 40;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;

        if (testWidth > maxWidth && n > 0) {
          ctx.save();
          ctx.translate(currentRadius, 0);
          ctx.rotate(Math.PI / 2);
          ctx.fillText(line.trim(), 0, 0);
          ctx.restore();
          line = words[n] + " ";
          currentRadius -= lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.save();
      ctx.translate(currentRadius, 0);
      ctx.rotate(Math.PI / 2);
      ctx.fillText(line.trim(), 0, 0);
      ctx.restore();

      ctx.restore();
    });

    // Draw the pointer (red triangle) and result at resultPosition
    if (this.winningResult || this.config.isInteractive) {
      let pointerX: number = 0,
        pointerY: number = 0;
      let resultX: number = 0,
        resultY: number = 0;
      const pointerSize = 20;
      const pointerOffset = radius + 10;
      const textOffset = radius + 50;

      switch (this.config.resultPosition) {
        case "top":
          pointerX = centerX;
          pointerY = centerY - pointerOffset;
          resultX = centerX;
          resultY = centerY - textOffset;
          if (this.config.isInteractive) {
            ctx.beginPath();
            ctx.moveTo(pointerX, pointerY - pointerSize / 2);
            ctx.lineTo(pointerX - pointerSize / 2, pointerY + pointerSize / 2);
            ctx.lineTo(pointerX + pointerSize / 2, pointerY + pointerSize / 2);
            ctx.fillStyle = "#ff0000";
            ctx.fill();
          }
          break;
        case "bottom":
          pointerX = centerX;
          pointerY = centerY + pointerOffset;
          resultX = centerX;
          resultY = centerY + textOffset;
          if (this.config.isInteractive) {
            ctx.beginPath();
            ctx.moveTo(pointerX, pointerY + pointerSize / 2);
            ctx.lineTo(pointerX - pointerSize / 2, pointerY - pointerSize / 2);
            ctx.lineTo(pointerX + pointerSize / 2, pointerY - pointerSize / 2);
            ctx.fillStyle = "#ff0000";
            ctx.fill();
          }
          break;
        case "left":
          pointerX = centerX - pointerOffset;
          pointerY = centerY;
          resultX = centerX - textOffset;
          resultY = centerY;
          if (this.config.isInteractive) {
            ctx.beginPath();
            ctx.moveTo(pointerX - pointerSize / 2, pointerY);
            ctx.lineTo(pointerX + pointerSize / 2, pointerY - pointerSize / 2);
            ctx.lineTo(pointerX + pointerSize / 2, pointerY + pointerSize / 2);
            ctx.fillStyle = "#ff0000";
            ctx.fill();
          }
          break;
        case "right":
          pointerX = centerX + pointerOffset;
          pointerY = centerY;
          resultX = centerX + textOffset;
          resultY = centerY;
          if (this.config.isInteractive) {
            ctx.beginPath();
            ctx.moveTo(pointerX + pointerSize / 2, pointerY);
            ctx.lineTo(pointerX - pointerSize / 2, pointerY - pointerSize / 2);
            ctx.lineTo(pointerX - pointerSize / 2, pointerY + pointerSize / 2);
            ctx.fillStyle = "#ff0000";
            ctx.fill();
          }
          break;
      }

      if (this.winningResult) {
        ctx.font = "20px Arial";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.fillText(`You won: ${this.winningResult.text}`, resultX, resultY);
      }
    }

    if (this.overlayImg) {
      ctx.drawImage(
        this.overlayImg,
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
    }
  }

  public spinToIndex(index: number, speed: number) {
    if (this.isSpinning) return;
    if (index < 0 || index >= this.config.quadrants.length) {
      console.error(
        `Invalid index: ${index}. Must be between 0 and ${
          this.config.quadrants.length - 1
        }`
      );
      return;
    }
    if (speed <= 0) {
      console.error("Speed must be positive");
      return;
    }

    this.isSpinning = true;
    this.targetQuadrant = this.config.quadrants[index];
    this.winningResult = null;
    this.rotationSpeed = speed;

    const quadrantAngle = 360 / this.config.quadrants.length;
    const targetAngle = (index * quadrantAngle + quadrantAngle / 2) % 360;
    const fullRotations = getRandomInt(5, 10) * 360;
    const finalAngle =
      fullRotations + (360 - targetAngle - this.config.pointerAngle!);
    const startTime = performance.now();

    if (this.config.soundEnabled) {
      playSound(this.config.soundFile!);
    }

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / this.config.spinDuration!, 1);
      let easeProgress: number;
      switch (this.config.easing) {
        case "linear":
          easeProgress = progress;
          break;
        case "cubicOut":
          easeProgress = 1 - Math.pow(1 - progress, 3);
          break;
        case "easeOut":
        default:
          easeProgress = 1 - Math.pow(1 - progress, 4);
      }

      this.angle = (finalAngle * easeProgress * Math.PI) / 180;
      this.drawWheel();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.isSpinning = false;
        this.winningResult = this.getWinningQuadrant();
        if (this.config.soundEnabled) {
          stopSound();
        }
        this.drawWheel();
        this.config.onSpinComplete?.(this.winningResult);
      }
    };

    requestAnimationFrame(animate);
  }

  public spin() {
    if (this.isSpinning) return;
    this.isSpinning = true;
    this.targetQuadrant = null;
    this.winningResult = null;

    const spinAngle = getRandomInt(5, 10) * 360 * this.rotationSpeed;
    const startTime = performance.now();

    if (this.config.soundEnabled) {
      playSound(this.config.soundFile!);
    }

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / this.config.spinDuration!, 1);
      let easeProgress: number;
      switch (this.config.easing) {
        case "linear":
          easeProgress = progress;
          break;
        case "cubicOut":
          easeProgress = 1 - Math.pow(1 - progress, 3);
          break;
        case "easeOut":
        default:
          easeProgress = 1 - Math.pow(1 - progress, 4);
      }

      this.angle = (spinAngle * easeProgress * Math.PI) / 180;
      this.drawWheel();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.isSpinning = false;
        this.winningResult = this.getWinningQuadrant();
        if (this.config.soundEnabled) {
          stopSound();
        }
        this.drawWheel();
        this.config.onSpinComplete?.(this.winningResult);
      }
    };

    requestAnimationFrame(animate);
  }

  public setWinningQuadrant(quadrantText: string) {
    if (this.isSpinning) return;
    this.isSpinning = true;
    const target = this.config.quadrants.find((q) => q.text === quadrantText);
    if (!target) {
      console.error(`Quadrant "${quadrantText}" not found`);
      this.isSpinning = false;
      return;
    }
    this.targetQuadrant = target;
    this.winningResult = null;

    const quadrantAngle = 360 / this.config.quadrants.length;
    const targetIndex = this.config.quadrants.indexOf(target);
    const targetAngle = (targetIndex * quadrantAngle + quadrantAngle / 2) % 360;
    const fullRotations = getRandomInt(5, 10) * 360;
    const finalAngle =
      fullRotations + (360 - targetAngle - this.config.pointerAngle!);

    const startTime = performance.now();

    if (this.config.soundEnabled) {
      playSound(this.config.soundFile!);
    }

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / this.config.spinDuration!, 1);
      let easeProgress: number;
      switch (this.config.easing) {
        case "linear":
          easeProgress = progress;
          break;
        case "cubicOut":
          easeProgress = 1 - Math.pow(1 - progress, 3);
          break;
        case "easeOut":
        default:
          easeProgress = 1 - Math.pow(1 - progress, 4);
      }

      this.angle =
        (finalAngle * easeProgress * Math.PI * this.rotationSpeed) / 180;
      this.drawWheel();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.isSpinning = false;
        this.winningResult = this.getWinningQuadrant();
        if (this.config.soundEnabled) {
          stopSound();
        }
        this.drawWheel();
        this.config.onSpinComplete?.(this.winningResult);
      }
    };

    requestAnimationFrame(animate);
  }

  public setRotationSpeed(speed: number) {
    if (speed <= 0) {
      console.error("Speed must be positive");
      return;
    }
    this.rotationSpeed = speed;
  }

  public reset() {
    this.angle = 0;
    this.isSpinning = false;
    this.rotationSpeed = 1;
    this.targetQuadrant = null;
    this.winningResult = null;
    this.drawWheel();
  }

  public getCurrentQuadrant(): Quadrant {
    return this.getWinningQuadrant();
  }

  public stopSpin() {
    if (!this.isSpinning) return;
    this.isSpinning = false;
    this.winningResult = this.getWinningQuadrant();
    if (this.config.soundEnabled) {
      stopSound();
    }
    this.drawWheel();
    this.config.onSpinComplete?.(this.winningResult);
  }

  public toggleInteractivity(enable: boolean) {
    if (enable && !this.config.isInteractive) {
      this.setupInteraction();
      this.config.isInteractive = true;
    } else if (!enable && this.config.isInteractive) {
      this.removeInteraction();
      this.config.isInteractive = false;
    }
    this.drawWheel();
  }

  private getWinningQuadrant(): Quadrant {
    const quadrantAngle = 360 / this.config.quadrants.length;
    const normalizedAngle =
      ((this.angle * 180) / Math.PI + this.config.pointerAngle!) % 360;
    const index =
      Math.floor((360 - normalizedAngle) / quadrantAngle) %
      this.config.quadrants.length;
    return this.config.quadrants[index];
  }

  private setupInteraction() {
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    this.canvas.addEventListener("mouseup", this.handleMouseUp);
    this.canvas.addEventListener("touchstart", this.handleTouchStart);
    this.canvas.addEventListener("touchmove", this.handleTouchMove);
    this.canvas.addEventListener("touchend", this.handleMouseUp);
  }

  private removeInteraction() {
    this.canvas.removeEventListener("mousedown", this.handleMouseDown);
    this.canvas.removeEventListener("mousemove", this.handleMouseMove);
    this.canvas.removeEventListener("mouseup", this.handleMouseUp);
    this.canvas.removeEventListener("touchstart", this.handleTouchStart);
    this.canvas.removeEventListener("touchmove", this.handleTouchMove);
    this.canvas.removeEventListener("touchend", this.handleMouseUp);
  }

  private handleMouseDown = (e: MouseEvent) => {
    this.lastMouseX = e.clientX;
    this.lastMouseY = e.clientY;
  };

  private handleMouseMove = (e: MouseEvent) => {
    if (this.lastMouseX === null || this.lastMouseY === null) return;
    const deltaX = e.clientX - this.lastMouseX;
    const deltaY = e.clientY - this.lastMouseY;
    this.angle += (deltaX - deltaY) * 0.01;
    this.drawWheel();
    this.lastMouseX = e.clientX;
    this.lastMouseY = e.clientY;
  };

  private handleMouseUp = () => {
    this.lastMouseX = null;
    this.lastMouseY = null;
  };

  private handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    this.lastMouseX = touch.clientX;
    this.lastMouseY = touch.clientY;
  };

  private handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    this.handleMouseMove({
      clientX: touch.clientX,
      clientY: touch.clientY,
    } as MouseEvent);
  };
}

export default SpinTheWheel;
