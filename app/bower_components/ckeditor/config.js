/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function(config) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';

	//the next line add the new font to the combobox in CKEditor

	// The toolbar groups arrangement, optimized for two toolbar rows.
	config.contentsCss = '../../../app/styles/main.css';
	config.font_names = 'Dyslexic/opendyslexicregular;' + config.font_names;
	config.toolbarGroups = [
	//{ name: 'editing',     groups: [ 'spellchecker' ] },'find', 'selection', 
	//{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
	//{ name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ] },
	{
		name: 'editing',
		groups: ['spellchecker']
	}, {
		name: 'styles'
	}, {
		name: 'colors'
	}

	];

	// Remove some buttons, provided by the standard plugins, which we don't
	// need to have in the Standard(s) toolbar.
	config.removeButtons = 'Underline,Subscript,Superscript';

	// Se the most common block elements.
	config.format_tags = 'p;h1;h2;h3;pre';

	// Make dialogs simpler.
	config.removeDialogTabs = 'image:advanced;link:advanced';

};
