(function () {
	'use strict';

	/**
	 *	constrctor
	 */
	function CroppingManager(container, document, editor) {
		this.container = container;
		this.editor = editor;
		this.document = document;
		this.canvas;
		this.sourceImage;
		this.rectangle;
	}


	/**
	 *	check if cropping button is active
	 */
	CroppingManager.prototype.buttonIsActive = function () {
		return this.editor.ui.get('ImageCut').getState() == CKEDITOR.TRISTATE_ON;
	};

	/**
	 *	attach mousedown and mouseup listeners to the CKEDITOR document
	 */
	CroppingManager.prototype.attachListeners = function () {
		var self = this;
		this.container.on('mousedown', function (evt) {
			if (self.buttonIsActive()) {
				self.onMouseDown(evt.data);
			}
		});

		this.document.on('mouseup', function (evt) {
			if (self.buttonIsActive()) {
				self.editor.ui.get('ImageCut').setState(CKEDITOR.TRISTATE_OFF);
				self.onMouseUp(evt.data);
			}
		});
	};

	/**
	 *	removes al listeners attached to the container
	 */
	CroppingManager.prototype.removeListeners = function () {
		this.container.removeListener('mousedown', this.onMouseDown);
		this.document.removeListener('mouseup', this.onMouseUp);
	};

	/**
	 *	mousedown callback
	 *	if the event's target is an image :
	 *		copy the image to a canvas
	 *		replace the image by the canvas
	 *		attach a mouse move listener to the canvas for the rectangle selector drawing
	 */
	CroppingManager.prototype.onMouseDown = function (event) {
		//on mouse down check if the target is an img tag
		var element = event.getTarget();
		//if element is an image : proceed
		if (element.getName() === 'img') {

			this.image = element;
			this.sourceImage = element.$;
			//this.sourceImage.src = toBase64(this.image.$);
			var boundingBox,
				rectangle;
			this.copyImageToCanvas();
			this.canvas.setStyle('cursor', 'crosshair');

			//add a mouse move event to canvas
			//init mouse pos
			var boundingBox = this.canvas.$.getBoundingClientRect();
			this.rectangle = {
				x: 0,
				y: 0,
				width: 0,
				height: 0,
				origin: {
					x: 0,
					y: 0
				}
			};

			this.rectangle.x = this.rectangle.origin.x = event.$.clientX - boundingBox.left;
			this.rectangle.y = this.rectangle.origin.y = event.$.clientY - boundingBox.top;
			this.drawSelectionRect(true, self);

			var self = this;
			this.document.on('mousemove', function (event) {
				self.onMouseMove(event.data, self);
			});

		} else {
			this.removeListeners();
			this.editor.ui.get('ImageCut').setState(CKEDITOR.TRISTATE_OFF);
		}

	};

	/**
	 *	mousemove event callback:
	 *		update the rectangle selector's x, y, width, height
	 */

	CroppingManager.prototype.onMouseMove = function (event, self) {
		event.preventDefault();
		self.updateRectData(event);
		window.requestAnimationFrame(function () {
			self.drawSelectionRect(true)
		});

	};

	/**
	 *	mouseup calback
	 *		if a rectangle is drawn => copy the selected zone to a new image
	 */
	CroppingManager.prototype.onMouseUp = function (event) {
		if (this.rectangle) {
			if (this.rectangle.width <= 0 || this.rectangle.height <= 0) {
				this.restoreOriginalImage();
			} else {
				this.copySelected();
			}
			this.removeListeners();
		}

	};

	/**
	 *	restores the original image
	 *	used in case of not drawing a rectangle
	 */
	CroppingManager.prototype.restoreOriginalImage = function () {
		this.document.removeAllListeners();
		this.drawSelectionRect(false, this);
		this.image.replace(this.canvas);
	};


	/*
	 *	copy the cropped selection to a tmp canvas
	 * 	then recreate an <img> and insert it before the srouce <img>
	 */
	CroppingManager.prototype.copySelected = function () {
		if (this.canvas) {
			// clear the selection rect and draw a crosssed rectangle in place of

			this.drawSelectionRect(false);
			// draws cropped img to a 'virtual' canvas
			var tmpCanvas,
				ctx,
				scaleRatio,
				rectangle = this.rectangle;

			tmpCanvas = document.createElement('canvas');
			tmpCanvas.width = rectangle.width;
			tmpCanvas.height = rectangle.height;
			ctx = tmpCanvas.getContext('2d');


			// we need to take into account a scale ratio if the <img> was scaled before cropping it
			scaleRatio = {
				x: 1, /// this.image.$.stretchedWidth,
				y: 1 // / this.image.$.stretchedHeight
			};

			ctx.drawImage(this.sourceImage, rectangle.x * scaleRatio.x,
				rectangle.y * scaleRatio.y,
				tmpCanvas.width * scaleRatio.x,
				tmpCanvas.height * scaleRatio.y,

				0, 0, tmpCanvas.width, tmpCanvas.height);

			//remove all selections
			document.getSelection().removeAllRanges();

			//draw cropped img and replace the canvas
			this.document.removeListener('mousemove', this.onMouseMove);

			var croppedImg = new CKEDITOR.dom.element('img');
			try {
				croppedImg.setAttribute('src', tmpCanvas.toDataURL());
				this.image.setAttribute('src', this.canvas.$.toDataURL());
				this.image.replace(this.canvas);
				croppedImg.insertBefore(this.image);
				var newLine = new CKEDITOR.dom.element('br');
				newLine.insertBefore(this.image);

				//then force a visual selection and fire a click event on the container

				var sel = this.editor.getSelection(),
					range = this.editor.createRange();
				range.selectNodeContents(croppedImg);
				sel.selectRanges([range]);
				this.container.fire('click', {
					getTarget: function () {
						return croppedImg;
					}
				});


			} catch (e) {
				this.restoreOriginalImage();
				window.alert("L'image ne peut être modifiée");
			}
		}

	}


	/**
	 * copy the selected image to a canvas an replace the image by the canvas
	 */
	CroppingManager.prototype.copyImageToCanvas = function () {
		//creates the canvas with same w and h than the image
		this.canvas = new CKEDITOR.dom.element('canvas');
		this.canvas.setAttribute('width', this.sourceImage.clientWidth);
		this.canvas.setAttribute('height', this.sourceImage.clientHeight);
		//get the context
		var ctx = this.canvas.$.getContext('2d');
		//get the image src
		var image = new Image();
		image.src = this.sourceImage.src;
		//draw the image
		ctx.drawImage(image, 0, 0, this.canvas.$.width, this.canvas.$.height);
		this.canvas.replace(this.image);
	};

	/**
	 *	updates the rectangle x, y, width and height
	 */
	CroppingManager.prototype.updateRectData = function (evt) {
		var rect = this.canvas.$.getBoundingClientRect(),
			rectangle = this.rectangle,
			event = evt.$;
		rectangle.width = (event.clientX - rect.left) - rectangle.origin.x;
		rectangle.height = (event.clientY - rect.top) - rectangle.origin.y;
		
		if(rectangle.width + rectangle.x > rect.width){
			rectangle.width = rect.width - rectangle.x;
		}
		
		if(rectangle.height + rectangle.y > rect.height){
			rectangle.height = rect.height - rectangle.y;
		}

		//avoid negative width / height
		if (rectangle.width < 0) {
			rectangle.x = (event.clientX - rect.left);
			rectangle.width = rectangle.origin.x - rectangle.x;
		}

		if (rectangle.height < 0) {
			rectangle.y = (event.clientY - rect.top);
			rectangle.height = rectangle.origin.y - rectangle.y;
		}
	};

	/**
	 *	draw the selection rectangle
	 *	tackes a boolean shouldDraw
	 *		true: draw the selection rectangle
	 *		false: draw the cropped rectngle
	 */
	CroppingManager.prototype.drawSelectionRect = function (shouldDraw) {

		var ctx = this.canvas.$.getContext('2d'),
			canvas = this.canvas.$,
			rectangle = this.rectangle;

		ctx.drawImage(this.sourceImage, 0, 0, canvas.width, canvas.height);

		//draw the selection rect
		if (shouldDraw) {
			ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
			// TODO: fix later

			//top darkening
			ctx.fillRect(0, 0, rectangle.x, rectangle.y);
			ctx.fillRect(rectangle.x, 0, canvas.width, rectangle.y);
			//left darkening
			ctx.fillRect(0, rectangle.y, rectangle.x, canvas.height);
			//right darkening
			ctx.fillRect(rectangle.x + rectangle.width, rectangle.y, canvas.width - (rectangle.x + rectangle.width), canvas.height);
			//bottom darkening
			ctx.fillRect(rectangle.x, rectangle.y + rectangle.height, rectangle.width, canvas.height - (rectangle.y - rectangle.height));

			//else replace the cropped part by a crossed rectangle
		} else if (rectangle.width >= 0 && rectangle.height >= 0) {
			//clear the cropped zone
			ctx.clearRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
			// draw draw draw


			//background color
			ctx.fillStyle = 'white';
			ctx.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);

			//draw the rectangle plus the 'cross'
			ctx.beginPath();

			/**
				
						---------------
					*/
			ctx.moveTo(rectangle.x, rectangle.y);
			ctx.lineTo(rectangle.x + rectangle.width, rectangle.y);

			/**
				---------------------
									|
									|
									|
									|
			*/
			ctx.lineTo(rectangle.x + rectangle.width, rectangle.y + rectangle.height);
			ctx.moveTo(rectangle.x + rectangle.width, rectangle.y);

			/**
				-------------------------
										|
										|
										|
										|
				-------------------------
			*/

			ctx.moveTo(rectangle.x + rectangle.width, rectangle.y + rectangle.height);
			ctx.lineTo(rectangle.x, rectangle.y + rectangle.height);


			/**
				
						------------------------------
						|							  |
						|							  |
						|							  |
						|							  |
						|							  |
						------------------------------
				
					*/

			ctx.moveTo(rectangle.x, rectangle.y + rectangle.height);
			ctx.lineTo(rectangle.x, rectangle.y);

			/**
			next: the cross, won't do ASCII art
			*/

			ctx.lineTo(rectangle.x + rectangle.width, rectangle.y + rectangle.height);
			ctx.moveTo(rectangle.x + rectangle.width, rectangle.y);
			ctx.lineTo(rectangle.x, rectangle.y + rectangle.height);

			ctx.lineWidth = 1;
			ctx.stroke();
			ctx.closePath();
		}
	};

	/**
	 *	Plugin initialization
	 */

	CKEDITOR.plugins.add('imagecut', {
		icons: 'imagecut',
		init: function (editor) {
			var manager;

			editor.ui.addButton('ImageCut', {
				label: 'Découper l\'image',
				command: 'imagecrop',
				toolbar: 'insert'
			});

			editor.addCommand('imagecrop', {
				exec: function (editor) {
					// add an event listener to the CKEDITOR iframe
					editor.ui.get('ImageCut').setState(CKEDITOR.TRISTATE_ON);
					manager = new CroppingManager(editor.container, editor.document, editor);
					manager.attachListeners();
				}
			});
		}
	});

})();