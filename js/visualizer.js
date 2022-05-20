'use strict';

const minimalism_2_values = {
    name: "minimalism_2",
    hours: {
        name: 'hours',
        type: "arm",
        radius_multiplier: 0.4,
        width: 2,
        color: 'accent'
    },
    minutes: {
        name: 'minutes',
        type: "arm",
        radius_multiplier: 0.6,
        width: 2,
        color: "rgb(255,255,255)"
    },
    seconds: {
        name: 'seconds',
        type: "dot",
        size: 2,
        radius_multiplier: 0.9,
        color: "rgb(255,255,255)"
    },
    centerDot: {
        type: "dot",
        useSize: true,
        size: 2,
        radius_multiplier: 0,
        color: "rgb(255,255,255)"
    },
    border: {
        color: "rgb(68,68,68)",
        width: 6
    },
    background: {
        color: "rgb(0,0,0)"
    },
    clock: {
        diameter: 1.7
    },
    drawDate: true
};
const minimalism_2_z_index = [minimalism_2_values.hours, minimalism_2_values.minutes, minimalism_2_values.seconds, minimalism_2_values.centerDot];
const minimalism_2 = {};
Object.assign(minimalism_2, minimalism_2_values);
Object.assign(minimalism_2, {z_index:minimalism_2_z_index});

const minimalism_1_values = {
    name: "minimalism_1",
    hours: {
        name: 'hours',
        type: "dot",
        size: 6,
        radius_multiplier: 0.4,
        width: 2,
        color: 'accent'
    },
    minutes: {
        name: 'minutes',
        type: "arm",
        radius_multiplier: 0.6,
        width: 4,
        color: "rgb(255,255,255)",
        rounded: true
    },
    seconds: {
        name: 'seconds',
        type: "none",
        size: 2,
        radius_multiplier: 0.9,
        color: "rgb(255,255,255)"
    },
    centerDot: {
        name: 'centerDot',
        type: "dot",
        useSize: false,
        size: 20,
        radius_multiplier: 0.4,
        color: "rgb(40,40,40)"
    },
    border: {
        color: "rgb(68,68,68)",
        width: 6
    },
    background: {
        color: "rgb(0,0,0)"
    },
    clock: {
        diameter: 1.7
    },
    drawDate: false
};
const minimalism_1_z_index = [minimalism_1_values.centerDot, minimalism_1_values.hours, minimalism_1_values.minutes];
const minimalism_1 = {};
Object.assign(minimalism_1, minimalism_1_values);
Object.assign(minimalism_1, {z_index:minimalism_1_z_index});

const clockFaces = [
    minimalism_1,
    minimalism_2
];



class Visualizer {
    constructor(fps = 60) {
        this.fps = fps + 30;

        this.update = 0;
        this.divider = 8;
        this.stroke_width = 3;
        this.padding = 10;

        this.normal = 0;
        this.normal_amount = 0.3;

        this.clockOn = true;
        this.clockFace = minimalism_1;

        this.gaussianArr = [.242, .599, .242];

        this.type = 0;

        this.lastArray;

        this.peakValue = 1;

        this.accentColor = `rgba(255,0,0,1)`;
    }

    setClockFace(name) {
        for (const clockface of clockFaces) {
            if (clockface.name == name) {
                console.log(this.clockFace);
                this.clockFace = clockface;
                console.log(this.clockFace);
            }
        }
    }

    updateProperties() {
        this.radius = (Math.min(this.canvas.width, this.canvas.height) / 80) * this.divider;

        this.distance = this.radius + this.padding;

        
        this.hr = this.radius * this.clockFace.hours.radius_multiplier; // Hour radius
        this.mr = this.radius * this.clockFace.minutes.radius_multiplier;; // Minute radius
        this.sr = this.radius * this.clockFace.seconds.radius_multiplier;; // Second radius
        this.cd = this.radius * this.clockFace.clock.diameter; // Clock diameter
    }

    time() {
        return new Date(); // return time array
    }

    clock() {
        this.ctx.beginPath();
        this.ctx.arc(this.cx, this.cy, this.radius, 0, 360);
        this.ctx.fillStyle = this.clockFace.background.color;
        this.ctx.strokeStyle = this.clockFace.border.color;
        this.ctx.lineWidth = this.clockFace.border.width;
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.lineWidth = 1;

        let time = this.time();

        let hours = time.getHours();
        let minutes = time.getMinutes();
        let seconds = time.getSeconds();
        let millis = time.getMilliseconds();

        let timeArr = [hours, minutes, seconds, millis]; 

        if (this.clockFace.drawDate) {
            this.drawDate();
        }

        for (const item of this.clockFace.z_index) {
            this.armdot(timeArr, item);
        }
    }

    armdot(time, value) {
        let timeMeasurement, angleRad;

        if (value.name == 'hours') {
            timeMeasurement = time[0] + (time[1] / 60 ) + (time[2] / 3600) + (time[3] / 3600000);
            angleRad = timeMeasurement / 12 * ( 2 * Math.PI) - (Math.PI / 2);
        } else if (value.name == 'minutes') {
            timeMeasurement = time[1] + (time[2] / 60) + (time[3] / 60000);
            angleRad = timeMeasurement / 60 * ( 2 * Math.PI) - (Math.PI / 2);
        } else if (value.name == 'seconds') {
            timeMeasurement = time[2] + (time[3] / 1000);
            angleRad = timeMeasurement / 60 * ( 2 * Math.PI) - (Math.PI / 2);
        }


        if (value.type == 'arm') {

            if (value.rounded) {
                this.ctx.beginPath();
                this.ctx.arc(this.cx, this.cy, value.width / 2, 0, Math.PI * 2);
                this.ctx.fillStyle = (value.color == 'accent') ? this.accentColor : value.color;
                this.ctx.fill();
            }

            this.ctx.beginPath();
            this.ctx.moveTo(this.cx, this.cy);
            this.ctx.lineTo(this.cx + Math.cos(angleRad) * (this.radius * value.radius_multiplier), this.cy + Math.sin(angleRad) * (this.radius * value.radius_multiplier));
            this.ctx.strokeStyle = (value.color == 'accent') ? this.accentColor : value.color;
            this.ctx.lineWidth = value.width;
            this.ctx.stroke();

            if (value.rounded) {
                this.ctx.beginPath();
                this.ctx.arc(this.cx + Math.cos(angleRad) * (this.radius * value.radius_multiplier), this.cy + Math.sin(angleRad) * (this.radius * value.radius_multiplier), value.width / 2, 0, Math.PI * 2);
                this.ctx.fillStyle = (value.color == 'accent') ? this.accentColor : value.color;
                this.ctx.fill();
            }

        } else if (value.type =='dot') {
            this.ctx.beginPath();

            if (value.name == 'centerDot') {
                if (value.useSize) {
                    this.ctx.arc(this.cx, this.cy, value.size, 0, 360);
                } else {
                    this.ctx.arc(this.cx, this.cy, (this.radius * value.radius_multiplier), 0, 360);
                }
            } else {
                this.ctx.arc(this.cx + Math.cos(angleRad) * (this.radius * value.radius_multiplier), this.cy + Math.sin(angleRad) * (this.radius * value.radius_multiplier), value.size, 0, 360);
            }

            this.ctx.fillStyle = (value.color == 'accent') ? this.accentColor : value.color;
            this.ctx.fill();
        }
    }


    drawDate() {

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];
        const time = this.time();
        const month = months[time.getMonth()];
        const day = time.getDate();

        const string = `${month} ${day}`;
        
        this.ctx.font = "13px Storopia";
        this.ctx.fillStyle = 'rgb(255,255,255)';
        this.ctx.fillText(string, this.cx - this.radius * 0.725, this.cy + 5);

        this.ctx.beginPath();
        this.ctx.arc(this.cx - this.radius * 0.8, this.cy, 3, 0, 360);
        this.ctx.fillStyle = this.accentColor;

        this.ctx.fill();
    }

    calculatePoint(radius, angle, cx, cy) { //cx = center x value, cy = center y value
        let x = Math.cos(angle) * radius + this.cx;
        let y = Math.sin(angle) * radius + this.cy;
        return {x,y};
    }

    audioListener(audioArray) {
        this.audioArray = this.changeArray(audioArray);
        this.lastArray = this.audioArray;
    }

    smooth(array) {
        var smoothed = [];

        let gaussianArr = [.242, .599, .242];

        for (let i = 0; i < array.length; i++) {

        }

        return smoothed;
    }

    changeArray(data) {
        let newAudioArr = [];
        
        let pinkNoise = [1.1760367470305,0.85207379418243,0.68842437227852,0.63767902570829,0.5452348949654,0.50723325864167,0.4677726234682,0.44204182748767,0.41956517802157,0.41517375040002,0.41312118577934,0.40618363960446,0.39913707474975,0.38207008614508,0.38329789106488,0.37472136606245,0.36586428412968,0.37603017335105,0.39762590761573,0.39391828858591,0.37930603769622,0.39433365764563,0.38511504613859,0.39082579241834,0.3811852720504,0.40231453727161,0.40244151133175,0.39965366884521,0.39761103827545,0.51136400422212,0.66151212038954,0.66312205226679,0.7416276690995,0.74614971301133,0.84797007577483,0.8573583910469,0.96382997811663,0.99819377577185,1.0628692615814,1.1059083969751,1.1819808497335,1.257092297208,1.3226521464753,1.3735992532905,1.4953223705889,1.5310064942373,1.6193923584808,1.7094805527135,1.7706604552218,1.8491987941428,1.9238418849406,2.0141596921333,2.0786429508827,2.1575522518646,2.2196355526005,2.2660112509705,2.320762171749,2.3574848254513,2.3986127976537,2.4043566176474,2.4280476777842,2.3917477397336,2.4032522546622,2.3614180150678];

        for (var i = 0; i < 64; i++) {

            data[ i ] /= pinkNoise[ i ];
            data[ i + 64 ] /= pinkNoise[ i ];
            
            if (this.normal) {

                this.peakValue = this.peakValue * this.normal_amount + data[i] * (1 - this.normal_amount);
                data[i] = this.peakValue;

                this.peakValue = this.peakValue * this.normal_amount + data[i + 64] * (1 - this.normal_amount);
                data[i + 64] = this.peakValue;

            }

            if (data[i] < 0.001) {
                data[i] = 0.001;
            }

            if (data[i + 64] < 0.001) {
                data[i + 64] = 0.001;
            }


            let heightL, heightR,
                startPointL, startPointR,
                endPointL, endPointR,
                angleL, angleR;

            heightL = parseInt(this.canvas.height * data[i]);
            heightR = parseInt(this.canvas.height * data[i + 64]);
9
            angleL = (Math.PI / 64) * (i + .5) + (90 * (Math.PI/180));
            angleR = -(Math.PI / 64) * ((i + 64) + .5) + (270 * (Math.PI/180));

            startPointL = this.calculatePoint(this.distance, angleL, this.cx, this.cy);
            startPointR = this.calculatePoint(this.distance, angleR, this.cx, this.cy);

            endPointL = this.calculatePoint(this.distance + heightL, angleL, this.cx, this.cy);
            endPointR = this.calculatePoint(this.distance + heightR, angleR, this.cx, this.cy);

            newAudioArr[i] = [startPointL, endPointL, angleL, heightL];
            newAudioArr[i + 64] = [startPointR, endPointR, angleR, heightR];
        }

        return newAudioArr;
    }

    drawLines() {
        // console.log(typeof this.audioArray);
        // console.log(this.audioArray instanceof Array);
        for (const i in this.audioArray) {
            const element = this.audioArray[i];

            this.ctx.beginPath();
            this.ctx.arc(element[0].x, element[0].y, this.stroke_width / 2, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgb(255,255,255)';
            this.ctx.fill();

            this.ctx.beginPath();
            this.ctx.moveTo(element[0].x, element[0].y);
            this.ctx.lineTo(element[1].x, element[1].y);
            this.ctx.strokeStyle = 'rgb(255,255,255)';
            this.ctx.lineWidth = this.stroke_width;
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.arc(element[1].x, element[1].y, this.stroke_width / 2, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgb(255,255,255)';
            this.ctx.fill();
        }
    }

    
    drawSpikes(){
        for (let i in this.audioArray){
            i = parseInt(i);
            
            const element = this.audioArray[i];
            this.ctx.beginPath();
            if (i != 63) {
                if (i == 64) {
                    this.ctx.moveTo(element[1].x, element[1].y);
                    this.ctx.lineTo(this.audioArray[0][1].x, this.audioArray[0][1].y);
    
                    this.ctx.moveTo(element[1].x, element[1].y);
                    this.ctx.lineTo(this.audioArray[i+1][1].x, this.audioArray[i+1][1].y);
                } else if (i == 127) {
                    this.ctx.moveTo(element[1].x, element[1].y);
                    this.ctx.lineTo(this.audioArray[63][1].x, this.audioArray[63][1].y);
                } else {
                    this.ctx.moveTo(element[1].x, element[1].y);
                    this.ctx.lineTo(this.audioArray[i + 1][1].x, this.audioArray[i + 1][1].y);
                }
            }

            this.ctx.strokeStyle = 'rgb(255,255,255)';
            this.ctx.lineWidth = this.stroke_width;
            this.ctx.stroke();

        }

    }

    drawSmooth() {
        for (let i in this.audioArray){
            i = parseInt(i);
            const element = this.audioArray[i];


            if (i != 63) {
                if (i == 64) {
                    let angle = this.audioArray[i][2];
                    let angleNext = this.audioArray[0][2];
                    let angleNextNext = this.audioArray[i + 1][2];
                    let pointOneOne = this.calculatePoint(this.distance + this.audioArray[i][3], angleNext, this.cx, this.cy);
                    let pointOneTwo = this.calculatePoint(this.distance + this.audioArray[0][3], angle, this.cx, this.cy);
                    let pointTwoOne = this.calculatePoint(this.distance + this.audioArray[i][3], angleNextNext, this.cx, this.cy);
                    let pointTwoTwo = this.calculatePoint(this.distance + this.audioArray[i + 1][3], angle, this.cx, this.cy);

                    this.ctx.beginPath();
                    this.ctx.moveTo(this.audioArray[i][1].x, this.audioArray[i][1].y);
                    this.ctx.bezierCurveTo(pointOneOne.x, pointOneOne.y, pointOneTwo.x, pointOneTwo.y, this.audioArray[0][1].x, this.audioArray[0][1].y);
                    this.ctx.moveTo(this.audioArray[i][1].x, this.audioArray[i][1].y);
                    this.ctx.bezierCurveTo(pointTwoOne.x, pointTwoOne.y, pointTwoTwo.x, pointTwoTwo.y, this.audioArray[i + 1][1].x, this.audioArray[i + 1][1].y);
                } else if (i == 127) {
                    let angle = this.audioArray[i][2];
                    let angleNext = this.audioArray[63][2];
                    let pointOne = this.calculatePoint(this.distance + this.audioArray[i][3], angleNext, this.cx, this.cy);
                    let pointTwo = this.calculatePoint(this.distance + this.audioArray[63][3], angle, this.cx, this.cy);

                    this.ctx.beginPath();
                    this.ctx.moveTo(this.audioArray[i][1].x, this.audioArray[i][1].y);
                    this.ctx.bezierCurveTo(pointOne.x, pointOne.y, pointTwo.x, pointTwo.y, this.audioArray[63][1].x, this.audioArray[63][1].y);
                } else {
                    let angle = this.audioArray[i][2];
                    let angleNext = this.audioArray[i + 1][2];
                    let pointOne = this.calculatePoint(this.distance + this.audioArray[i][3], angleNext, this.cx, this.cy);
                    let pointTwo = this.calculatePoint(this.distance + this.audioArray[i + 1][3], angle, this.cx, this.cy);
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.audioArray[i][1].x, this.audioArray[i][1].y);
                    this.ctx.bezierCurveTo(pointOne.x, pointOne.y, pointTwo.x, pointTwo.y, this.audioArray[i + 1][1].x, this.audioArray[i + 1][1].y);
            
                }
            }
            this.ctx.strokeStyle = 'rgb(255,255,255)';
            this.ctx.lineWidth = this.stroke_width;
            this.ctx.stroke();
        }

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
            }, 0.1);

            return;
        }

        if (this.update == 1) {
            this.updateProperties();
            this.update = 0;
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if ( this.clockOn ) {
            this.clock();
        }
        

        if (this.type == 0) {
            this.drawLines();
        } else if (this.type == 1) {
            this.drawSpikes();
        } else if (this.type == 2) {
            this.drawSmooth();
        }

        this.lastLoop = performance.now();
        this.loop();
    }

    setup(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;

        this.canvas.width = this.canvas.scrollWidth;
        this.canvas.height = this.canvas.scrollHeight;
        this.cx = this.canvas.width / 2;
        this.cy = this.canvas.height / 2;

        this.calculateMillis();

        this.updateProperties();

        this.loop();
    }


}