export default class Draw {
	constructor(canvas) {
		this.canvas = canvas;

		const context = canvas.getContext('2d');
		this.context = context;
	}

	convertPoint(x, y) {
		x = this.canvas.width / 2 + x;
		y = this.canvas.height / 2 - y - 1;

		if (x < 0 || x > this.canvas.width || y < 0 || y > this.canvas.height) {
			return null;
		}

		console.groupEnd();
		return [x, y];
	}

	ln(x1, y1, x2, y2, color = '#000') {
		const ret1 = this.convertPoint(x1, y1);
		const ret2 = this.convertPoint(x2, y2);
		if (!ret1 || !ret2) {
			return;
		}

		[x1, y1] = ret1;
		[x2, y2] = ret2;

		const prevStrokeStyle = this.context.strokeStyle;

		this.context.strokeStyle = color;
		this.context.beginPath();
		this.context.moveTo(x1, y1);
		this.context.lineTo(x2, y2);
		this.context.stroke();
		this.context.strokeStyle = prevStrokeStyle;
	}

	// x,y is the top right of the box
	box(x, y, width = 10, height = 10, color = '#000') {
		this.ln(x, y, x, y - height, color);
		this.ln(x, y, x - width, y, color);
		this.ln(x - width, y, x - width, y - height, color);
		this.ln(x - width, y - height, x, y - height, color);
	}

	clearBox(x, y, width = 10, height = 10) {
		this.box(x, y, width, height, '#fff');
	}

	px(x, y, color = '#000') {
		const ret = convertPoint(x, y);
		if (!ret) {
			return;
		}

		[x, y] = ret;

		const prevFillStyle = this.context.fillStyle;

		this.context.fillStyle = color;
		this.context.fillRect(x, y, 3, 3);
		this.context.fillStyle = prevFillStyle;
	};
};