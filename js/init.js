const visualizer = new Visualizer();

document.addEventListener('DOMContentLoaded', (event) => {
    const
        canvas = document.getElementById('canvas'),
        context = canvas.getContext('2d');

    visualizer.setup(canvas, context);

    window.wallpaperRegisterAudioListener((audioArray) => visualizer.audioListener(audioArray));
});

window.wallpaperPropertyListener = {

    applyUserProperties: (properties) => {
        if (properties.background_type) {
            let body = document.querySelector('body');
            if (properties.background_type.value == "0") {
                body.style.backgroundImage = '';
                body.style.backgroundColor = window.color;
            } else if (properties.background_type.value == "1") {
                body.style.backgroundColor = '';
                body.style.backgroundImage = window.image;
                body.style.backgroundSize = "cover";
                body.style.backgroundRepeat = "no-repeat";
            }
        }

        if (properties.background_image) {
            const image = new Image();
            image.src = 'file:///' + properties.background_image.value;

            image.onload = () => {
                let body = document.querySelector('body');
                body.style.backgroundColor = '';
                window.image = image;
                body.style.backgroundImage = `url(${window.image.src})`;
            };
        }
        // set background
        if (properties.background_color) {
            document.querySelector('body').style.backgroundImage = '';
            let color = properties.background_color.value;
            let r,g,b;
            r = parseFloat(color.split(" ")[0] * 255);
            g = parseFloat(color.split(" ")[1] * 255);
            b = parseFloat(color.split(" ")[2] * 255);

            window.color = `rgba(${r},${g},${b},1)`;
            document.querySelector('body').style.backgroundColor = window.color;
        }

        if (properties.clock_size) {
            visualizer.divider = properties.clock_size.value;
            visualizer.update = 1;
            visualizer.updateProperties();
        }

        if (properties.stroke_width) {
            visualizer.stroke_width = properties.stroke_width.value;
            visualizer.update = 1;
        }

        if (properties.visualizer_type) {
            visualizer.type = properties.visualizer_type.value;
            visualizer.update = 1;
        }

        if (properties.normal) {
            visualizer.normal = properties.normal.value;
            visualizer.update = 1;
        }

    }
}
