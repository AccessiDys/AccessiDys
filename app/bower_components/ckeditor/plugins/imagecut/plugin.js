/*global
	CKEDITOR
	*/
(function () {
	'use strict';

	/**
	 *	constrctor
	 */
	function CroppingManager(container, document, command, editor) {
		this.container = container;
		this.editor = editor;
		this.document = document;
		this.command = command;
		this.canvas = undefined;
		this.sourceImage = undefined;
		this.rectangle = undefined;
	}


	/**
	 *	check if cropping button is active
	 */
	CroppingManager.prototype.buttonIsOn = function () {
		return this.editor.ui.get('ImageCut').getState() === CKEDITOR.TRISTATE_ON;
	};

	/**
	 *	enables or disables the button
	 */
	CroppingManager.prototype.setActive = function (aBoolean) {
		if (aBoolean) {
			this.command.enable();
		} else {
			this.command.disable();
		}
	};

	/**
	 *	sets the button ON or OFF
	 */
	CroppingManager.prototype.setOn = function (aBoolean) {
		var state = aBoolean ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF;
		this.editor.ui.get('ImageCut').setState(state);
	};

	/**
	 *	attach mousedown and mouseup listeners to the CKEDITOR document
	 */
	CroppingManager.prototype.init = function () {

		var self = this;

		this.container.on('mousedown', function (evt) {

			if (self.buttonIsOn()) {

				self.document.on('mouseup', function (evt) {
				//	self.setOn(false);
					self.onMouseUp(evt.data);
				});

				self.onMouseDown(evt.data);
			}
		});

		this.editor.on('change', function () {
			var active = self.containsImages();
			self.setActive(active);
		});

	};

	/**
	 *	checks if the document contains '<img' tags
	 */
	CroppingManager.prototype.containsImages = function () {
		var data = this.editor.getData();
		return (data.indexOf('<img') > -1);
	};

	/**
	 *	removes al listeners attached to the container
	 */
	CroppingManager.prototype.removeListeners = function () {
		//this.container.removeListener('mousedown', this.onMouseDown);
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
		var element = event.getTarget(),
			boundingBox,
			self = this;
		//if element is an image : proceed
		if (element.getName() === 'img') {

			this.image = element;
			this.sourceImage = element.$;
			//this.sourceImage.src = toBase64(this.image.$);

			this.copyImageToCanvas();
			this.canvas.setStyle('cursor', 'crosshair');

			//add a mouse move event to canvas
			//init mouse pos
			boundingBox = this.canvas.$.getBoundingClientRect();
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
			this.drawSelectionRect(true, this);

			this.document.on('mousemove', function (event) {
				self.onMouseMove(event.data, self);
			});

		} else {
			this.setOn(false);
			this.removeListeners();
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
			self.drawSelectionRect(true);
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
	 *	then recreate an <img> and insert it before the srouce <img>
	 */
	CroppingManager.prototype.copySelected = function () {
		if (this.canvas) {
			// clear the selection rect and draw a crosssed rectangle in place of

			this.drawSelectionRect(false);
			// draws cropped img to a 'virtual' canvas
			var tmpCanvas,
				ctx,
				scaleRatio,
				rectangle = this.rectangle,
				croppedImg,
				newLine,
				sel,
				range;

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
			this.removeListeners();

			var croppedImgContainer = new CKEDITOR.dom.element('p');
			croppedImg = new CKEDITOR.dom.element('img');
			try {
				croppedImg.setAttribute('src', tmpCanvas.toDataURL());
				this.image.setAttribute('src', this.canvas.$.toDataURL());
				this.image.replace(this.canvas);
				croppedImg.appendTo(croppedImgContainer);
				croppedImgContainer.insertBefore(this.image.getParent());
				newLine = new CKEDITOR.dom.element('p');
				newLine.appendHtml('<br>')
				newLine.insertAfter(croppedImg.getParent());

				//and insert a line break between

				//then force a visual selection and fire a click event on the container

				sel = this.editor.getSelection();
				range = this.editor.createRange();
				range.selectNodeContents(croppedImg);
				sel.selectRanges([range]);

				//temporary disable mouse click
				this.document.removeListener('mousedown', this.onMouseDown);

				this.container.fire('click', {
					getTarget: function () {
						return croppedImg;
					}
				});

				//then scroll up to the cropped img
				croppedImg.scrollIntoView();


				//restore functions
				this.init();


			} catch (e) {
				this.restoreOriginalImage();
				window.alert("L'image ne peut être modifiée");
			}
		}

	};


	/**
	 * copy the selected image to a canvas an replace the image by the canvas
	 */
	CroppingManager.prototype.copyImageToCanvas = function () {
		//creates the canvas with same w and h than the image
		this.canvas = new CKEDITOR.dom.element('canvas');
		this.canvas.setAttribute('width', this.sourceImage.clientWidth);
		this.canvas.setAttribute('height', this.sourceImage.clientHeight);
		//get the context
		var ctx = this.canvas.$.getContext('2d'),
			//get the image src
			image = new Image();
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

		if (rectangle.width + rectangle.x > rect.width) {
			rectangle.width = rect.width - rectangle.x;
		}

		if (rectangle.height + rectangle.y > rect.height) {
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

					if (manager.buttonIsOn()) {
						manager.setOn(false);
					} else {
						manager.setOn(true);
					}
				},
				startDisabled: true

			});


			editor.on('contentDom', function (e) {
				// add an event listener to the CKEDITOR iframe
				manager = new CroppingManager(editor.container, editor.document, editor.getCommand('imagecrop'), editor);
				manager.init();
			});


		}
	});

}());
