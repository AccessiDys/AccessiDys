/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */
CKEDITOR.editorConfig = function (config) {

    // name pour Tableau : Table à rajouter dans la toolbar insert

    config.toolbar = [
        { name: 'styles', items: [ 'Format' ] },
        { name: 'clipboard', groups: [ 'clipboard', 'undo' ], items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
        { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ], items: [ 'BulletedList' ] },
        { name: 'insert', items: [ 'Image', 'SpecialChar',  'Link'] },
        { name: 'editing', groups: ['spellchecker' ], items: [ 'Scayt' ] },
        { name: 'insert', items: [ 'ImageCut', 'Ocerisation' ] },
        { name: 'insert', items: [ 'PageBreak' ] }
    ];

    config.toolbar_OcrVersion = [
        ['Scayt']
    ];

    config.skin = 'moono';

    config.language = 'fr';

    config.extraPlugins = 'pastebase64,sharedspace,blockquote,link,imagecut,ocerisation';

    config.format_tags = 'p;h1;h2;h3;h4;h5;h6';

    config.resize_enabled = false;

    config.removePlugins = 'elementspath,magicline';

    if (this.name === 'editorOcr') {
        config.height = '200px';
    }
    else {
        config.height = '350px';
		config.startupFocus = true;
        config.sharedSpaces = {
            top: 'editorToolbar',
            bottom: 'editorBottom'
        };
    }

    // Sets SCAYT to French.
    config.scayt_sLang = 'fr_FR';
};
