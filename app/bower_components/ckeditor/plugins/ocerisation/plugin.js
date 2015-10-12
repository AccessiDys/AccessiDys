(function () {
	'use strict';

	/**
	 *	OCRManager constructor
	 */
	function OCRManager(container, editor) {
		this.container = container;
		this.editor = editor;
		this.selectedImage;
		this.disable();
		this.dialog = undefined;
	}

	/**
	*	 for now, no need to remove it
	*/
	OCRManager.prototype.attachListeners = function () {
		var self = this;

		this.container.on('click', function (evt) {
			self.onClick(evt.data);
		});
	};

	/**
	 * set the button to active state
	 */
	OCRManager.prototype.setActive = function () {
		this.editor.ui.get('Ocerisation').setState(CKEDITOR.TRISTATE_ON);
	};

	/**
	 * set the button to inactive state
	 */
	OCRManager.prototype.setInactive = function () {
		this.editor.ui.get('Ocerisation').setState(CKEDITOR.TRISTATE_OFF);
	};

	/**
	 * disable the button
	 */
	OCRManager.prototype.disable = function () {
		this.editor.ui.get('Ocerisation').setState(CKEDITOR.TRISTATE_DISABLED);
	};

	/**
	 * enable the button
	 */
	OCRManager.prototype.enable = function () {
		this.editor.ui.get('Ocerisation').setState(CKEDITOR.TRISTATE_OFF);
	};

	/**
	 *	returns true if the button is disabled
	 */
	OCRManager.prototype.isDisabled = function () {
		return this.editor.ui.get('Ocerisation').getState() === CKEDITOR.TRISTATE_DISABLED;
	};


	/**
	 * on click calback
	 *		check if click event is on an image
	 *		then check if the image is base64 encoded
	 */
	OCRManager.prototype.onClick = function (event) {
		var selectedElement = event.getTarget();
		if (selectedElement.getName() === 'img' && this.isDataUrl(selectedElement.getAttribute('src'))) {
			this.selectedImage = selectedElement;
			this.enable();
		} else {
			this.selectedImagSrc = undefined;
			this.disable();
		}


	};

	//https://gist.github.com/bgrins/6194623
	OCRManager.prototype.isDataUrl = function (str) {
		//https://gist.github.com/bgrins/6194623
		var rgx = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;
		return !!str.match(rgx);
	}


	/**
	 * ocerization entry method
	 */
	OCRManager.prototype.ocerize = function () {
		
		var self = this;
		if (this.selectedImage.getName() === 'img' && this.isDataUrl(this.selectedImage.getAttribute('src'))) {
			this.setActive();
			var dataToOcerize = this.selectedImage.getAttribute('src');

			if (!this.dialog) {
				this.dialog = this.editor.openDialog('loading');
			} else {
				//if dialog already instanciated => show and remove listeners
				this.dialog.show();
				this.dialog.removeAllListeners();
			}

			this.dialog.on('show', function (evt) {

				var params = '{"id":"' + localStorage.getItem('compteId') + '","encodedImg":"' + dataToOcerize + '"}';
				var oReq = new XMLHttpRequest();
				oReq.open('POST', '/oceriser', true);
				oReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

				oReq.onload = function () {
					// production
					//var imageOpt = oReq.response;
					//integration
					var imageOpt = JSON.parse(oReq.response);
					var ocerisedTxt;
					// l'océrisation se passe ici
					tesseractJS.FS_createDataFile('/', 'tempInput.jpg', imageOpt, true, true);
					var fnct_TESSERACT_Minimal = tesseractJS.cwrap(
						// name of C function
						'TESSERACT_Minimal',
						// return type
						'number',
						// argument types
								 ['string', 'string', 'number', 'number']
					); // arguments

					//Renvoie de l'HOCR, mettre le 3eme pram à 0 pour UTF8
					var retSTRING_Pointer = fnct_TESSERACT_Minimal('tempInput.jpg', 'fra', 0, -1);
					// Convert the resulting string to a JS string
					var retSTRING = tesseractJS.Pointer_stringify(retSTRING_Pointer);
					//Supprime le fichier temp
					try {
						tesseractJS.FS_unlink('/tempInput.jpg');
					} catch (e) {
						// catch fichier n'existe pas
						console.log(e);
					}

					// retirer popup d'attente
					self.dialog.hide();

					self.appendOcerizedText(retSTRING);
					self.setInactive();
				}

				oReq.send(params);
			});
		}
	};




	/**
	 *	adds ocerized text on top of the clicked image
	 */
	OCRManager.prototype.appendOcerizedText = function (ocerisedTxt) {
		var txtNode = new CKEDITOR.dom.element('p');
		txtNode.appendText(ocerisedTxt);
		txtNode.insertBefore(this.selectedImage);
		document.getSelection().removeAllRanges();
	};

	OCRManager.prototype.initializeTesseract = function (ocerisedTxt) {
		var oReq = new XMLHttpRequest();
		oReq.open('GET', '/bower_components/tesseractJS/tesseract-ocr/tessdata/fra.traineddata', true);
		oReq.responseType = 'blob';

		oReq.onload = function () {
			var blob = oReq.response;
			if (blob) {
				var reader = new FileReader();
				reader.onloadend = function (evt) {
					if (evt.target.readyState === FileReader.DONE) {
						var binary = '';
						var bytes = new Uint8Array(evt.target.result);
						var len = bytes.byteLength;
						for (var i = 0; i < len; i++) {
							binary += String.fromCharCode(bytes[i]);
						}

						tesseractJS.FS_createDataFile('/tesseract-ocr/tessdata/', 'fra.traineddata', binary, true, true);
					}
				};
				reader.readAsArrayBuffer(blob);
			}
		};
		oReq.send(null);
	}


	/**
	 *	Plugin initialization
	 */
	CKEDITOR.plugins.add('ocerisation', {
		icons: 'ocerisation',
		init: function (editor) {

			var dialog = CKEDITOR.dialog.add('loading', function (editor) {
				var dialogDefinition = {
					title: 'Traitement en cours...',
					minWidth: 100,
					minHeight: 60,
					resizable: CKEDITOR.DIALOG_RESIZE_NONE,
					contents: [{
						id: 'loading',
						label: 'Chargement',
						title: 'Traitement en cours...',
						elements: [
							{
								type: 'html',
								html: '<div style="text-align: center">Le traitement de reconnaissance des caractères est en cours.<br/>La durée de ce traitement peut être importante. <br/><br/>Veuillez patienter...</div>',
								align: 'center'
							}
						]
						}],
					// needs a hidden button to replace default ones
					buttons: [
						{
							type: 'button',
							id: 'hiddenBtn',
							label: 'none',
							hidden: true
						}
					]
				};
				return dialogDefinition;
			});
			var manager;

			editor.ui.addButton('Ocerisation', {
				label: 'Lancer la reconnaissance des caractères',
				command: 'ocerisation',
				toolbar: 'insert' // TODO: change

			});

			editor.addCommand('ocerisation', {
				exec: function (editor) {
					manager.ocerize();
				}
			});


			editor.on('contentDom', function (e) {
				manager = new OCRManager(this.container, editor);
				manager.attachListeners();
				manager.initializeTesseract();
			});

		}
	});


})();