'use strict';

class Visualizer {
    constructor (fps = 30) {
        this.fps = fps;

        this.update = 0;

        this.lastArray;

        this.distance = 100;
    }

    showVisualizer() {
        for (const i in this.audioArray) {
            const element = this.audioArray[i];
            this.ctx.beginPath();
            this.ctx.moveTo(element[0].x, element[0].y);
            this.ctx.lineTo(element[1].x, element[1].y);
            this.ctx.strokeStyle = 'rgb(255,255,255)';
            this.ctx.lineWidth = this.stroke_width;
            this.ctx.stroke();
        }
    }

    audioListener(audioArray) {
        this.lastArray = this.audioArray;
        this.audioArray = this.changeArray(audioArray);
    }

    calculatePoint(radius, angle, cx, cy) { //cx = center x value, cy = center y value
        let x = Math.cos(angle) * radius + this.cx;
        let y = Math.sin(angle) * radius + this.cy;
        return {x,y};
    }

    changeArray (data) {
        let newAudioArr = [];
        
        for (var i = 0; i < data.length; i++) {
            if (data[i] < 0.001) {
                data[i] = 0.001;
            }
            let height, startPoint, endPoint, angle;

            height = parseInt(this.canvas.height * data[i]);


            if (i < 64) {
                angle = (Math.PI / 64) * (i + .5) + (90 * (Math.PI/180));
            } else {
                angle = -(Math.PI / 64) * (i + .5) + (270 * (Math.PI/180));
            }
            startPoint = this.calculatePoint(this.distance, angle, this.cx, this.cy);
            endPoint = this.calculatePoint(this.distance + height, angle, this.cx, this.cy);

            newAudioArr.push([startPoint, endPoint, angle, height]) // start point, endpoint angle of the points, and the height of the frequency
        }
        return newAudioArr;
    }

    updateProperties() {

    }

    calculateMillis(fps = null) {
        if (fps) {
            this.fps = fps + 30;
        }

        this.millis = this.fps;
        if (this.fps > 0) {
            this.millis = (1 / this.fps) * 1000;
        }
    }

    loop(ignoreCheck = false) {
        if (this.lastLoop && (this.lastLoop + this.millis) >= performance.now() && !ignoreCheck) {
            setTimeout(() => {
                this.loop();
            }, .1);

            return;
        }

        if (this.update == 1) {
            this.updateProperties();
            this.update = 0;
        }
        
        // Put code here
        let a = [];
        for (let i = 0; i < 128; i++) {
            const randomNumber = Math.random() - .7;
            a.push(randomNumber);
        }
        this.audioListener(a);

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.showVisualizer();


        // Put code here

        this.lastLoop = performance.now();
        this.loop();
    }

    setup(canvas, ctx) {
        console.log('setup1');
        this.canvas = canvas;
        this.ctx = ctx;

        this.canvas.width = this.canvas.scrollWidth;
        this.canvas.height = this.canvas.scrollHeight;

        this.cx = this.canvas.width / 2;
        this.cy = this.canvas.height / 2;

        console.log(this.cx,this.cy)

        this.calculateMillis();

        this.updateProperties();

        this.loop();
    }
}