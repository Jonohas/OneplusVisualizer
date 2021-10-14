'use strict';


class Visualizer {
    constructor(fps = 60) {
        this.fps = fps + 30;

        this.update = 0;
        this.divider = 2;
        this.stroke_width = 1;
        this.padding = 10;
        this.normal = 0;

        this.type = 0;

        this.lastArray;

        this.peakValue = 1;
        this.pinkNoise = [  1.1760367470305,0.85207379418243,0.68842437227852,0.63767902570829,
            0.5452348949654,0.50723325864167,0.4677726234682,0.44204182748767,0.41956517802157,
            0.41517375040002,0.41312118577934,0.40618363960446,0.39913707474975,0.38207008614508,
            0.38329789106488,0.37472136606245,0.36586428412968,0.37603017335105,0.39762590761573,
            0.39391828858591,0.37930603769622,0.39433365764563,0.38511504613859,0.39082579241834,
            0.3811852720504,0.40231453727161,0.40244151133175,0.39965366884521,0.39761103827545,
            0.51136400422212,0.66151212038954,0.66312205226679,0.7416276690995,0.74614971301133,
            0.84797007577483,0.8573583910469,0.96382997811663,0.99819377577185,1.0628692615814,
            1.1059083969751,1.1819808497335,1.257092297208,1.3226521464753,1.3735992532905,
            1.4953223705889,1.5310064942373,1.6193923584808,1.7094805527135,1.7706604552218,
            1.8491987941428,1.9238418849406,2.0141596921333,2.0786429508827,2.1575522518646,
            2.2196355526005,2.2660112509705,2.320762171749,2.3574848254513,2.3986127976537,	
            2.4043566176474,2.4280476777842,2.3917477397336,2.4032522546622,2.3614180150678];

    }

    updateProperties() {
        this.radius = (Math.min(this.canvas.width, this.canvas.height) / 80) * this.divider;

        this.distance = this.radius + this.padding;

        
        this.hr = this.radius * 0.4; // Hour radius
        this.mr = this.radius * 0.6; // Minute radius
        this.sr = this.radius * 0.9; // Second radius
        this.cd = this.radius * 1.7; // Clock diameter
    }

    time() {
        return new Date(); // return time array
    }

    clock() {
        this.ctx.beginPath();
        this.ctx.arc(this.cx, this.cy, this.radius, 0, 360);
        this.ctx.fillStyle = 'rgb(0,0,0)';
        this.ctx.strokeStyle = "rgb(68,68,68)";
        this.ctx.lineWidth = 6;
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.lineWidth = 1;

        let time = this.time();

        let hours = time.getHours();
        let minutes = time.getMinutes();
        let seconds = time.getSeconds();
        let millis = time.getMilliseconds();

        let timeArr = [hours, minutes, seconds, millis]; 

        this.hourArm(timeArr);
        this.drawDate(); // minute pointer over the text
        this.minuteArm(timeArr);
        this.secondsDot(timeArr);
        this.centerDot();
    }

    hourArm(time) {
        let hours = time[0] + (time[1] / 60 ) + (time[2] / 3600) + (time[3] / 3600000);
        let hoursAngle = hours / 12 * ( 2 * Math.PI) - (Math.PI / 2); // hours angle in radians

        this.ctx.beginPath();
        this.ctx.moveTo(this.cx, this.cy);
        this.ctx.lineTo(this.cx + Math.cos(hoursAngle) * this.hr, this.cy + Math.sin(hoursAngle) * this.hr);
        this.ctx.strokeStyle = this.accentColor;

        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }

    minuteArm(time) {
        let minutes = time[1] + (time[2] / 60) + (time[3] / 60000); 
        let minutesAngle = minutes / 60 * ( 2 * Math.PI) - (Math.PI / 2); // minutes angle in radians

        this.ctx.beginPath();
        this.ctx.moveTo(this.cx, this.cy);
        this.ctx.lineTo(this.cx + Math.cos(minutesAngle) * this.mr, this.cy + Math.sin(minutesAngle) * this.mr);
        this.ctx.strokeStyle = 'rgb(255,255,255)';
        
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }

    secondsDot(time) {
        let seconds = time[2] + (time[3] / 1000);
        let secondsAngle = seconds / 60 * ( 2 * Math.PI) - (Math.PI / 2);

        this.ctx.beginPath();
        this.ctx.arc(this.cx + Math.cos(secondsAngle) * this.sr, this.cy + Math.sin(secondsAngle) * this.sr, 2, 0, 360);
        this.ctx.fillStyle = 'rgb(255,255,255)';
        this.ctx.fill();
    }

    centerDot() {
        this.ctx.beginPath();
        this.ctx.arc(this.cx, this.cy, 2, 0, 360);
        this.ctx.fillStyle = 'rgb(255,255,255)';
        this.ctx.fill();
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

    normalize(array) {
        let newArray = array;
        let max = 0, i;

        for( i = 0; i < 128; i++ )
        {
            if( newArray[ i ] > max ) max = newArray[ i ];
        }

        this.peakValue = this.peakValue * 0.99 + max * 0.01; 

        for( i = 0; i < 128; i++ )
        {
            newArray[ i ] /= this.peakValue;
        }
        return newArray;
    }

    correctPinkNoise(data) {
        for( let i = 0; i < 64; i++ )
        {
            data[ i ] /= this.pinkNoise[ i ];
            data[ i+64 ] /= this.pinkNoise[ i ];
        }
        return data;
    }

    changeArray(data) {
        let newAudioArr = [];

        if (this.normal == true) {
            data = this.normalize(data);
        }
        
        
        data = this.correctPinkNoise(data);

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

    drawLines() {
        // console.log(typeof this.audioArray);
        // console.log(this.audioArray instanceof Array);
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

        this.clock();

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
        
        console.log(this.cx,this.cy)

        this.calculateMillis();

        this.updateProperties();

        this.loop();
    }


}