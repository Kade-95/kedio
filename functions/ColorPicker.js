const Template = require('../classes/Template');

function ColorPicker(window = {}) {
    const base = new Template(window);

    this.colorIndicatorPosition = { x: 0, y: 0 };
    this.opacityIndicatorPosition = { x: 0, y: 0 };
    this.convertTo = 'RGB';

    this.init = (params = {}) => {
        this.picker = base.createElement({
            element: 'div', attributes: { class: 'color-picker' }, children: [
                {
                    element: 'span', attributes: { id: 'color-picker-setters' }, children: [
                        {
                            element: 'span', attributes: { id: 'color-picker-colors-window' }, children: [
                                { element: 'canvas', attributes: { id: 'color-picker-colors' } },
                                { element: 'span', attributes: { id: 'color-picker-color-indicator' } }
                            ]
                        },
                        {
                            element: 'span', attributes: { id: 'color-picker-opacities-window' }, children: [
                                { element: 'canvas', attributes: { id: 'color-picker-opacities' } },
                                { element: 'span', attributes: { id: 'color-picker-opacity-indicator' } }
                            ]
                        }
                    ]
                },
                {
                    element: 'div', attributes: { id: 'color-picker-result' }, children: [
                        { element: 'span', attributes: { id: 'picked-color' } },
                        {
                            element: 'span', attributes: { id: 'picked-color-window' }, children: [
                                { element: 'select', attributes: { id: 'picked-color-setter' }, options: ['RGB', 'HEX', 'HSL'] },
                                { element: 'span', attributes: { id: 'picked-color-value' } }
                            ]
                        }
                    ]
                },
                {
                    element: 'style',
                    attributes: { type: 'text/css', rel: 'stylesheet' },
                    text: `.color-picker {
                        padding: .5em;
                        display: grid;
                        z-index: 20;
                    }
                    
                    #color-picker-setters {
                        display: grid;
                        grid-template-columns: 1fr min-content;
                        gap: 1em;
                        height: inherit;
                        width: inherit;
                    }
                    
                    #color-picker-colors-window {
                        display: block;
                        border: 1px solid gray;
                        position: relative;
                        overflow: hidden;
                    }
                    
                    #color-picker-opacities-window {
                        width: 20px;
                        display: block;
                        border: 1px solid gray;
                        position: relative;
                        overflow: hidden;
                    }
                    
                    #color-picker-color-indicator {
                        position: absolute;
                        padding: .5em;
                        border: 1px solid black;
                        border-radius: 100%;
                        top: 0;
                        left: 0;
                    }
                    
                    #color-picker-opacity-indicator {
                        position: absolute;
                        padding: .2em;
                        background-color: black;
                        top: 0;
                        left: 0;
                    }
                    
                    #color-picker-result {
                        display: flex;
                        flex-direction: row;
                        justify-content: space-around;
                        align-items: center;
                        margin: .1em 0em;
                    }
                    
                    #picked-color {
                        width: 50px;
                        height: 30px;
                        border: 1px solid black;
                    }
                    
                    #picked-color-window {
                        display: grid;
                        gap: .3em;
                        grid-template-columns: max-content;
                        grid-template-rows: repeat(2, 1fr);
                        justify-items: left;
                    }
                    
                    #picked-color-value {
                        display: inline-flex;
                        flex-direction: row;
                        justify-content: space-around;
                        align-items: center;
                        color: black;
                    }`
                }
            ]
        });

        this.colorWindow = this.picker.find('#color-picker-colors-window');
        this.opacityWindow = this.picker.find('#color-picker-opacities-window');
        this.colorCanvas = this.picker.find('#color-picker-colors');
        this.opacityCanvas = this.picker.find('#color-picker-opacities');
        this.colorMarker = this.picker.find('#color-picker-color-indicator');
        this.opacityMarker = this.picker.find('#color-picker-opacity-indicator');
        this.width = params.width ? params.width : 300;
        this.height = params.height ? params.height : 300;
        this.pickedColor = params.color ? params.color : 'rgb(0, 0, 0)';
        this.colorWindow.css({ height: this.height + 'px' });
        this.colorCanvas.width = this.width;
        this.colorCanvas.height = this.height;
        this.opacityWindow.css({ height: this.height + 'px' });
        this.opacityCanvas.height = this.height;
        this.opacityCanvas.width = 20;

        //the context
        this.colorContext = this.colorCanvas.getContext('2d');
        this.opacityContext = this.opacityCanvas.getContext('2d');

        this.picker.find('#picked-color-value').innerText = this.pickedColor;
        this.picker.find('#picked-color-setter').onChanged(value => {
            this.convertTo = value;
            this.reply();
        });

        this.listen();

        return this.picker;
    }

    this.calibrateColor = () => {
        let colorGradient = this.colorContext.createLinearGradient(0, 0, this.width, 0);

        //color stops
        colorGradient.addColorStop(0, "rgb(255, 0, 0)");
        colorGradient.addColorStop(0.15, "rgb(255, 0, 255)");
        colorGradient.addColorStop(0.33, "rgb(0, 0, 255)");
        colorGradient.addColorStop(0.49, "rgb(0, 255, 255)");
        colorGradient.addColorStop(0.67, "rgb(0, 255, 0)");
        colorGradient.addColorStop(0.87, "rgb(255, 255, 0)");
        colorGradient.addColorStop(1, "rgb(255, 0, 0)");

        this.colorContext.fillStyle = colorGradient;
        this.colorContext.fillRect(0, 0, this.width, this.height);

        //add black and white stops
        colorGradient = this.colorContext.createLinearGradient(0, 0, 0, this.height);
        colorGradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        colorGradient.addColorStop(0.5, "rgba(255, 255, 255, 0)");
        colorGradient.addColorStop(0.5, "rgba(0, 0, 0, 0)");
        colorGradient.addColorStop(1, "rgba(0, 0, 0, 1)");

        this.colorContext.fillStyle = colorGradient;
        this.colorContext.fillRect(0, 0, this.width, this.height);
    }

    this.calibrateOpacity = () => {
        let rgba;

        this.opacityContext.clearRect(0, 0, this.opacityCanvas.width, this.height);
        let opacityGradient = this.opacityContext.createLinearGradient(0, 0, 0, this.opacityCanvas.height);

        for (let i = 100; i >= 0; i--) {
            rgba = this.addOpacity(this.pickedColor, i / 100);
            opacityGradient.addColorStop(i / 100, rgba);
        }

        this.opacityContext.fillStyle = opacityGradient;
        this.opacityContext.clearRect(0, 0, this.opacityCanvas.width, this.opacityCanvas.height);
        this.opacityContext.fillRect(0, 0, this.opacityCanvas.width, this.opacityCanvas.height);
    }

    this.listen = () => {
        let isColorMouseDown = false;
        let isOpacityMouseDown = false;

        this.picker.notBubbledEvent('click', event => {
            if (this.added && !isColorMouseDown && !isOpacityMouseDown) {
                this.dispose();
            }
        });

        const colorMouseDown = (event) => {
            let currentX = event.clientX - this.colorCanvas.getBoundingClientRect().left;
            let currentY = event.clientY - this.colorCanvas.getBoundingClientRect().top;

            //is mouse in color picker
            isColorMouseDown = (currentX > 0 && currentX < this.colorCanvas.getBoundingClientRect().width && currentY > 0 && currentY < this.colorCanvas.getBoundingClientRect().height);
        };

        const colorMouseMove = (event) => {
            if (isColorMouseDown) {
                this.colorIndicatorPosition.x = event.clientX - this.colorCanvas.getBoundingClientRect().left;
                this.colorIndicatorPosition.y = event.clientY - this.colorCanvas.getBoundingClientRect().top;
                this.colorMarker.css({ top: this.colorIndicatorPosition.y + 'px', left: this.colorIndicatorPosition.x + 'px' });

                let picked = this.getPickedColor();
                this.pickedColor = `rgb(${picked.r}, ${picked.g}, ${picked.b})`;
                this.reply();
            }
        };

        const colorClicked = (event) => {
            this.colorIndicatorPosition.x = event.clientX - this.colorCanvas.getBoundingClientRect().left;
            this.colorIndicatorPosition.y = event.clientY - this.colorCanvas.getBoundingClientRect().top;
            this.colorMarker.css({ top: this.colorIndicatorPosition.y + 'px', left: this.colorIndicatorPosition.x + 'px' });

            let picked = this.getPickedColor();
            this.pickedColor = `rgb(${picked.r}, ${picked.g}, ${picked.b})`;
            this.reply();
        }

        const colorMouseUp = (event) => {
            isColorMouseDown = false;
            this.calibrateOpacity();
        };

        //Register
        this.colorCanvas.addEventListener("mousedown", colorMouseDown);
        this.colorCanvas.addEventListener("mousemove", colorMouseMove);
        this.colorCanvas.addEventListener("click", colorClicked);
        this.colorCanvas.addEventListener("mouseup", colorMouseUp);

        const opacityMouseDown = (event) => {
            let currentX = event.clientX - this.opacityCanvas.getBoundingClientRect().left;
            let currentY = event.clientY - this.opacityCanvas.getBoundingClientRect().top;

            //is mouse in color picker
            isOpacityMouseDown = (currentX > 0 && currentX < this.opacityCanvas.getBoundingClientRect().width && currentY > 0 && currentY < this.opacityCanvas.getBoundingClientRect().height);
        };

        const opacityMouseMove = (event) => {
            if (isOpacityMouseDown) {
                this.opacityIndicatorPosition.x = event.clientX - this.opacityCanvas.getBoundingClientRect().left;
                this.opacityIndicatorPosition.y = event.clientY - this.opacityCanvas.getBoundingClientRect().top;
                this.opacityMarker.css({ top: this.opacityIndicatorPosition.y + 'px' });

                let picked = this.getPickedOpacity();
                this.pickedColor = `rgb(${picked.r}, ${picked.g}, ${picked.b}, ${picked.a})`;
                this.reply();
            }
        };

        const opacityClicked = (event) => {
            this.opacityIndicatorPosition.x = event.clientX - this.opacityCanvas.getBoundingClientRect().left;
            this.opacityIndicatorPosition.y = event.clientY - this.opacityCanvas.getBoundingClientRect().top;
            this.opacityMarker.css({ top: this.opacityIndicatorPosition.y + 'px' });

            let picked = this.getPickedOpacity();
            this.pickedColor = `rgb(${picked.r}, ${picked.g}, ${picked.b}, ${picked.a})`;
            this.reply();
        };

        const opacityMouseUp = (event) => {
            isOpacityMouseDown = false;
        };

        this.opacityCanvas.addEventListener("mousedown", opacityMouseDown);
        this.opacityCanvas.addEventListener("mousemove", opacityMouseMove);
        this.opacityCanvas.addEventListener("click", opacityClicked);
        this.opacityCanvas.addEventListener("mouseup", opacityMouseUp);
    }

    this.reply = () => {
        this.converColor();
        this.picker.dispatchEvent(new CustomEvent('colorChanged'));
        this.picker.find('#picked-color').css({ backgroundColor: this.convertedColor });
        this.picker.find('#picked-color-value').innerText = this.convertedColor;
    }

    this.converColor = () => {
        if (this.convertTo == 'HEX') {
            this.convertedColor = this.rgbToHex(this.pickedColor);
        }
        else if (this.convertTo == 'HSL') {
            this.convertedColor = this.rgbToHSL(this.pickedColor);
        }
        else if (this.convertTo == 'RGB') {
            this.convertedColor = this.pickedColor;
        }
    }

    this.onChanged = (callBack) => {
        this.picker.addEventListener('colorChanged', event => {
            callBack(this.convertedColor);
        });
    }

    this.getPickedColor = () => {
        let imageData = this.colorContext.getImageData(this.colorIndicatorPosition.x, this.colorIndicatorPosition.y, 1, 1);
        return { r: imageData.data[0], g: imageData.data[1], b: imageData.data[2] };
    }

    this.getPickedOpacity = () => {
        let imageData = this.opacityContext.getImageData(this.opacityIndicatorPosition.x, this.opacityIndicatorPosition.y, 1, 1);

        let alpha = Math.ceil(((imageData.data[3] / 255) * 100)) / 100;
        return { r: imageData.data[0], g: imageData.data[1], b: imageData.data[2], a: alpha };
    }

    this.draw = (params) => {
        this.init(params);
        this.calibrateColor();
        this.calibrateOpacity();

        let interval = setTimeout(() => {
            this.added = true;
            clearTimeout(interval);
        }, 2000);

        return this.picker;
    }

    this.dispose = () => {
        clearInterval(this.interval);
        this.picker.remove();
    }

    this.colorType = (color = '#ffffff') => {
        let type = 'string';
        if (color.indexOf('#') == 0 && (color.length - 1) % 3 == 0) {
            type = 'hex';
        }
        else if (color.indexOf('rgba') == 0) {
            let values = base.inBetween(color, 'rgba(', ')');
            if (values != -1 && values.split(',').length == 4) {
                type = 'rgba';
            }
        }
        else if (color.indexOf('rgb') == 0) {
            let values = base.inBetween(color, 'rgb(', ')');
            if (values != -1 && values.split(',').length == 3) {
                type = 'rgb';
            }
        }
        else if (color.indexOf('hsla') == 0) {
            let values = base.inBetween(color, 'hsla(', ')');
            if (values != -1 && values.split(',').length == 4) {
                type = 'hsla';
            }
        }
        else if (color.indexOf('hsl') == 0) {
            let values = base.inBetween(color, 'hsl(', ')');
            if (values != -1 && values.split(',').length == 3) {
                type = 'hsl';
            }
        }

        return type;
    }

    this.hexToRGB = (hex = '#ffffff', alpha = true) => {
        let r = 0, g = 0, b = 0, a = 255;
        if (hex.length == 4) {
            r = "0x" + hex[1] + hex[1];
            g = "0x" + hex[2] + hex[2];
            b = "0x" + hex[3] + hex[3];
        }
        else if (hex.length == 5) {
            r = "0x" + hex[1] + hex[1];
            g = "0x" + hex[2] + hex[2];
            b = "0x" + hex[3] + hex[3];
            a = "0x" + hex[4] + hex[4];
        }
        else if (hex.length == 7) {
            r = "0x" + hex[1] + hex[2];
            g = "0x" + hex[3] + hex[4];
            b = "0x" + hex[5] + hex[6];
        }
        else if (hex.length == 9) {
            r = "0x" + hex[1] + hex[2];
            g = "0x" + hex[3] + hex[4];
            b = "0x" + hex[5] + hex[6];
            a = "0x" + hex[7] + hex[8];
        }
        a = +(a / 255).toFixed(3);

        if (alpha == false) {
            return `rgb(${+r}, ${+g}, ${+b})`;
        }
        else {
            return `rgb(${+r}, ${+g}, ${+b}, ${a})`;
        }
    }

    this.hexToHSL = (hex = '#ffffff', alpha = true) => {
        let color = this.hexToRGB(hex, alpha);
        color = this.rgbToHSL(color, alpha);
        return color;
    }

    this.rgbToHex = (rgb = 'rgb(0, 0, 0)', alpha = true) => {
        let start = rgb.indexOf('(') + 1;
        let end = rgb.indexOf(')');
        let [r, g, b, a] = rgb.slice(start, end).split(',');

        if (!base.isset(a)) {
            a = 1;
        }

        r = (+r).toString(16);
        g = (+g).toString(16);
        b = (+b).toString(16);
        a = Math.round(a * 255).toString(16);

        if (r.length == 1) {
            r = `0${r}`;
        }

        if (g.length == 1) {
            g = `0${g}`;
        }

        if (b.length == 1) {
            b = `0${b}`;
        }
        if (a.length == 1) {
            a = `0${a}`;
        }

        let hex = '#';
        if (alpha != false) {
            hex += `${r}${g}${b}${a}`;
        }
        else {
            hex += `${r}${g}${b}`;
        }

        return hex;
    }

    this.rgbToHSL = (rgb = 'rgb(0, 0, 0)', alpha = true) => {
        let start = rgb.indexOf('(') + 1;
        let end = rgb.indexOf(')');
        let [r, g, b, a] = rgb.slice(start, end).split(',');

        if (!base.isset(a)) {
            a = 1;
        }

        r /= 225;
        g /= 225;
        b /= 225;

        let cmin = Math.min(r, g, b),
            cmax = Math.max(r, g, b),
            delta = cmax - cmin,
            h = 0,
            s = 0,
            l = 0;

        // Calculate hue
        // No difference
        if (delta == 0) {
            h = 0;
        }
        else if (cmax == r) {
            h = ((g - b) / delta) % 6;
        }
        else if (cmax == g) {
            h = (b - r) / delta + 2;
        }
        else if (cmax == g) {
            h = (r - g) / delta + 4;
        }

        h = Math.round(h * 60);
        // Make negative hues positive behind 360°
        if (h < 0) {
            h += 360;
        }

        l = (cmax + cmin) / 2;

        s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

        l = +(l * 100).toFixed(1);
        s = +(s * 100).toFixed(1);

        let hsl = `hsl`;
        if (alpha == false) {
            hsl += `(${h}, ${s}%, ${l}%)`;
        }
        else {
            hsl += `(${h}, ${s}%, ${l}%, ${a})`;
        }
        return hsl;
    }

    this.hslToRGB = (hsl = 'hsl(0, 0%, 0%)', alpha = true) => {
        let rgb = 'rgb';
        let start = hsl.indexOf('(') + 1;
        let end = hsl.indexOf(')');
        let [h, s, l, a] = hsl.slice(start, end).split(',');

        if (!base.isset(a)) {
            a = 1;
        }

        if (h.indexOf("deg") > -1)
            h = h.substr(0, h.length - 3);
        else if (h.indexOf("rad") > -1)
            h = Math.round(h.substr(0, h.length - 3) * (180 / Math.PI));
        else if (h.indexOf("turn") > -1)
            h = Math.round(h.substr(0, h.length - 4) * 360);
        // Keep hue fraction of 360 if ending up over
        if (h >= 360)
            h %= 360;

        s = s.replace('%', '') / 100;
        l = l.replace('%', '') / 100;

        let c = (1 - Math.abs(2 * l - 1)) * s,
            x = c * (1 - Math.abs((h / 60) % 2 - 1)),
            m = l - c / 2,
            r = 0,
            g = 0,
            b = 0;

        if (0 <= h && h < 60) {
            r = c; g = x; b = 0;
        } else if (60 <= h && h < 120) {
            r = x; g = c; b = 0;
        } else if (120 <= h && h < 180) {
            r = 0; g = c; b = x;
        } else if (180 <= h && h < 240) {
            r = 0; g = x; b = c;
        } else if (240 <= h && h < 300) {
            r = x; g = 0; b = c;
        } else if (300 <= h && h < 360) {
            r = c; g = 0; b = x;
        }
        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);

        if (alpha == false) {
            rgb += `(${r}, ${g}, ${b})`;
        }
        else {
            rgb += `(${r}, ${g}, ${b}, ${a})`;
        }

        return rgb;
    }

    this.hslToHex = (hsl = '', alpha = true) => {
        let color = this.hslToRGB(hsl, alpha);
        return this.rgbToHex(color, alpha);
    }

    this.addOpacity = (color = 'rgb(0, 0, 0)', opacity = 0.5) => {
        let type = this.colorType(color);
        if (type == 'hex') color = this.hexToRGB(color);
        else if (type == 'hsl' || type == 'hsla') color = this.hslToRGB(color);

        let start = color.indexOf('(') + 1;
        let end = color.indexOf(')');
        let points = color.slice(start, end).split(',');
        points[3] = opacity;

        let changedColor = `rgba(${points.join(',')})`;

        if (type == 'hex') changedColor = this.rgbToHex(changedColor);
        else if (type == 'hsl' || type == 'hsla') changedColor = this.rgbToHSL(changedColor);

        return changedColor;
    }

    this.getOpacity = (color = 'rgb(0, 0, 0)') => {
        color = base.inBetween(color, '(', ')');
        let [r, g, b, a] = color.split(',');
        return a.trim();
    }

    this.invertColor = (color = '#ffffff') => {
        let type = this.colorType(color);
        let invert;
        if (type == 'hex') {
            color = color.replace('#', '');
            invert = '#' + this.invertHex(color);
        }
        else if (type == 'rgb') {
            color = this.rgbToHex(color).replace('#', '');
            invert = this.invertHex(color);
            invert = this.hexToRGB(invert);
        }
        else if (type == 'rgba') {
            let opacity = this.getOpacity(color);
            color = this.rgbToHex(color).replace('#', '');
            invert = this.invertHex(color);
            invert = this.hexToRGB(invert);
            invert = this.addOpacity(invert, opacity);
        }
        return invert;
    }

    this.invertHex = (hex = 'ffffff') => {
        return (Number(`0x1${hex}`) ^ 0xFFFFFF).toString(16).substr(1).toUpperCase();
    }

    this.nameToHex = (color = 'white') => {
        let ctx = document.createElement('canvas').getContext('2d');
        ctx.fillStyle = color;
        return ctx.fillStyle;
    }

    this.nameToRGB = (color = 'white') => {
        return this.hexToRGB(this.nameToHex(color));
    }
}

module.exports = ColorPicker;