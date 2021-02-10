
class Visualizer {
    constructor(){
        this.update = 0;
        this.divider = 10;
        this.stroke_width = 1;
        this.padding = 10;
        this.type = 0;
        this.first = 1;
    }

    audioListener(audioArray) {
        this.lastArray = this.audioArray;
        this.audioArray = this.changeArray(audioArray);
    }

    reload() {
        this.radius = (Math.min(this.canvas.width, this.canvas.height) / 80) * this.divider;

        this.distance = this.radius + this.padding;

        this.mr = this.radius * 0.6; // Minute radius
        this.hr = this.radius * 0.4; // Hour radius
        this.cd = this.radius * 1.7; // Clock diameter
    }

    setup(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;

        this.canvas.width = this.canvas.scrollWidth;
        this.canvas.height = this.canvas.scrollHeight;

        this.cx = this.canvas.width / 2;
        this.cy = this.canvas.height / 2;

        this.reload();


        setTimeout(() => {
            this.transition();
        }, 20);

        this.loop();
    }
    loop() {
        if (this.update == 1) {
            this.reload();
            this.update = 0;
        }
        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.clock();

        if (this.first == 1) {
            this.first = 0;
        }

        if (!this.lastArray) {
            this.lastArray = [];
            let betweenArr = [];
            
            for(let i = 0; i < 128; i++){
                betweenArr.push(0.01);
            }
    
            this.lastArray = this.changeArray(betweenArr);
        }

        if (this.type == 0) {
            this.drawLines();
        } else if (this.type == 1) {
            this.drawSpikes();
        } else if (this.type == 2) {
            this.drawSmooth();
        }

    }

    clock() { // Draw complete clock
        this.ctx.beginPath();
        this.ctx.arc(this.cx, this.cy, this.radius, 0, 360);
        this.ctx.fillStyle = 'rgb(0,0,0)';
        this.ctx.strokeStyle = "rgb(68,68,68)";
        this.ctx.lineWidth = 6;
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.lineWidth = 1;

        this.mArm();
        this.hArm();
        this.cDot();
        this.drawDate();
    }
    mArm() { // Drawing the minute hand
        let time = this.time();

        let minutes = time.getMinutes();
        let seconds = time.getSeconds();
        let millis = time.getMilliseconds();

        let m = minutes + (seconds / 60) + (millis / 60000);

        let mp = m / 60 * ( 2 * Math.PI) - (Math.PI / 2);



        this.ctx.beginPath();
        this.ctx.moveTo(this.cx, this.cy);
        this.ctx.lineTo(this.cx + Math.cos(mp) * this.mr, this.cy + Math.sin(mp) * this.mr);
        this.ctx.strokeStyle = 'rgb(255,255,255)';
        this.ctx.stroke();
    }

    hArm() { // Drawing the hour hand
        let time = this.time();
        let hours = time.getHours();
        let minutes = time.getMinutes();
        let seconds = time.getSeconds();
        let millis = time.getMilliseconds();

        let h = hours + (minutes / 60) + (seconds / 3600) + (millis / 3600000);

        let hp = h / 12 * ( 2 * Math.PI) - (Math.PI / 2);

        this.ctx.beginPath();
        this.ctx.moveTo(this.cx, this.cy);
        this.ctx.lineTo(this.cx + Math.cos(hp) * this.hr, this.cy + Math.sin(hp) * this.hr);
        this.ctx.strokeStyle = 'rgb(255,0,0)';
        this.ctx.stroke();
    }

    cDot() { // Drawing the center dot
        this.ctx.beginPath();
        this.ctx.arc(this.cx, this.cy, 2, 0, 360);
        this.ctx.fillStyle = 'rgb(255,255,255)';
        this.ctx.fill();
    }

    drawDate() {
        let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let time = this.time();
        let month = months[time.getMonth()];
        let day = time.getDate();

        this.ctx.font = "13px Storopia";
        this.ctx.fillText(`${month} ${day}`, this.cx - (0.68 * this.radius), this.cy + (0.02 * this.radius));

        this.ctx.beginPath();
        this.ctx.arc(this.cx - (0.75 * this.radius), this.cy, 3, 0, 360);
        this.ctx.fillStyle = 'rgb(255,0,0)';
        this.ctx.fill();
    }

    changeArray(data) { // convert the audio array to a more usable array
        this.draw();
        let newAudioArr = [];

        for (var i = 0; i < data.length; i++) {
            if (data[i] < 0.001) {
                data[i] = 0.001;
            }
            let height, startPoint, endPoint, angle;

            height = parseInt(this.canvas.height * data[i] / 1.2);


            if (i < 64) {
                angle = (Math.PI / 64) * (i + .5) + (90 * (Math.PI/180));
            } else {
                angle = -(Math.PI / 64) * (i + .5) + (270 * (Math.PI/180));
            }

            startPoint = this.calculatePoint(this.distance, angle, this.cx, this.cy);
            endPoint = this.calculatePoint(this.distance + height, angle, this.cx, this.cy);

            newAudioArr.push({startPoint, endPoint, angle, height}) // start point, endpoint angle of the points, and the height of the frequency
        }
        return newAudioArr;
    }

    drawLines() {
        for (let i = 0; i < this.lastArray.length; i++){
            this.ctx.beginPath();
            this.ctx.moveTo(this.lastArray[i].startPoint.x, this.lastArray[i].startPoint.y);
            this.ctx.lineTo(this.lastArray[i].endPoint.x, this.lastArray[i].endPoint.y);
            this.ctx.strokeStyle = 'rgb(255,255,255)';
            this.ctx.lineWidth = this.stroke_width;
            this.ctx.stroke();
        }
    }

    drawLines() {
        for (let i = 0; i < this.lastArray.length; i++){
            this.ctx.beginPath();
            this.ctx.moveTo(this.lastArray[i].startPoint.x, this.lastArray[i].startPoint.y);
            this.ctx.lineTo(this.lastArray[i].endPoint.x, this.lastArray[i].endPoint.y);
            this.ctx.strokeStyle = 'rgb(255,255,255)';
            this.ctx.lineWidth = this.stroke_width;
            this.ctx.stroke();
        }
    }

    drawSpikes(){
        for (let i = 0; i < this.lastArray.length; i++){

            this.ctx.beginPath();
            if (i != 63) {
                if (i == 64) {
                    this.ctx.moveTo(this.lastArray[i].endPoint.x, this.lastArray[i].endPoint.y);
                    this.ctx.lineTo(this.lastArray[0].endPoint.x, this.lastArray[0].endPoint.y);
    
                    this.ctx.moveTo(this.lastArray[i].endPoint.x, this.lastArray[i].endPoint.y);
                    this.ctx.lineTo(this.lastArray[i+1].endPoint.x, this.lastArray[i+1].endPoint.y);
                } else if (i == 127) {
                    this.ctx.moveTo(this.lastArray[i].endPoint.x, this.lastArray[i].endPoint.y);
                    this.ctx.lineTo(this.lastArray[63].endPoint.x, this.lastArray[63].endPoint.y);
                } else {
                    this.ctx.moveTo(this.lastArray[i].endPoint.x, this.lastArray[i].endPoint.y);
                    this.ctx.lineTo(this.lastArray[i+1].endPoint.x, this.lastArray[i+1].endPoint.y);
                }
            }

            this.ctx.strokeStyle = 'rgb(255,255,255)';
            this.ctx.lineWidth = this.stroke_width;
            this.ctx.stroke();

        }

    }

    drawSmooth() {
        for (let i = 0; i < this.lastArray.length; i++){


            if (i != 63) {
                if (i == 64) {
                    let angle = this.lastArray[i].angle;
                    let angleNext = this.lastArray[0].angle;
                    let angleNextNext = this.lastArray[i + 1].angle;
                    let pointOneOne = this.calculatePoint(this.distance + this.lastArray[i].height, angleNext, this.cx, this.cy);
                    let pointOneTwo = this.calculatePoint(this.distance + this.lastArray[0].height, angle, this.cx, this.cy);
                    let pointTwoOne = this.calculatePoint(this.distance + this.lastArray[i].height, angleNextNext, this.cx, this.cy);
                    let pointTwoTwo = this.calculatePoint(this.distance + this.lastArray[i + 1].height, angle, this.cx, this.cy);

                    this.ctx.beginPath();
                    this.ctx.moveTo(this.lastArray[i].endPoint.x, this.lastArray[i].endPoint.y);
                    this.ctx.bezierCurveTo(pointOneOne.x, pointOneOne.y, pointOneTwo.x, pointOneTwo.y, this.lastArray[0].endPoint.x, this.lastArray[0].endPoint.y);
                    this.ctx.moveTo(this.lastArray[i].endPoint.x, this.lastArray[i].endPoint.y);
                    this.ctx.bezierCurveTo(pointTwoOne.x, pointTwoOne.y, pointTwoTwo.x, pointTwoTwo.y, this.lastArray[i + 1].endPoint.x, this.lastArray[i + 1].endPoint.y);
                } else if (i == 127) {
                    let angle = this.lastArray[i].angle;
                    let angleNext = this.lastArray[63].angle;
                    let pointOne = this.calculatePoint(this.distance + this.lastArray[i].height, angleNext, this.cx, this.cy);
                    let pointTwo = this.calculatePoint(this.distance + this.lastArray[63].height, angle, this.cx, this.cy);

                    this.ctx.beginPath();
                    this.ctx.moveTo(this.lastArray[i].endPoint.x, this.lastArray[i].endPoint.y);
                    this.ctx.bezierCurveTo(pointOne.x, pointOne.y, pointTwo.x, pointTwo.y, this.lastArray[63].endPoint.x, this.lastArray[63].endPoint.y);
                } else {
                    let angle = this.lastArray[i].angle;
                    let angleNext = this.lastArray[i + 1].angle;
                    let pointOne = this.calculatePoint(this.distance + this.lastArray[i].height, angleNext, this.cx, this.cy);
                    let pointTwo = this.calculatePoint(this.distance + this.lastArray[i + 1].height, angle, this.cx, this.cy);
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.lastArray[i].endPoint.x, this.lastArray[i].endPoint.y);
                    this.ctx.bezierCurveTo(pointOne.x, pointOne.y, pointTwo.x, pointTwo.y, this.lastArray[i + 1].endPoint.x, this.lastArray[i + 1].endPoint.y);
            
                }
            }
            this.ctx.strokeStyle = 'rgb(255,255,255)';
            this.ctx.lineWidth = this.stroke_width;
            this.ctx.stroke();
        }

    }

    async transition() {
        if (!this.lastArray) {
            for (let i = 0; i < this.lastArray.length; i++){
                while (this.lastArray[i] != this.audioArray[i]) {
                    if (this.lastArray[i].endPoint.x < this.audioArray[i].endPoint.x) {
                        this.lastArray[i] += 0.0001;
                    } else if (this.lastArray[i].endPoint.x > this.audioArray[i].endPoint.x) {
                        this.lastArray[i] -= 0.0001;
                    }
                }
            }
        }
    }

    time() {
        return new Date();
    }

    calculatePoint(radius, angle, cx, cy) { //cx = center x value, cy = center y value
        let x = Math.cos(angle) * radius + this.cx;
        let y = Math.sin(angle) * radius + this.cy;
        return {x,y};
    }

}
