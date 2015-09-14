/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */
CKEDITOR.editorConfig = function (config) {
    config.toolbarGroups = [
        {name: 'styles', groups: ['styles']},
        {name: 'clipboard', groups: ['clipboard', 'undo']},
        {name: 'paragraph', groups: ['list']},
        {name: 'insert', groups: ['insert']},
        {name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing']},
        {name: 'tools', groups: ['tools']}
    ];


    config.toolbar_OcrVersion = [
        ['Scayt']
    ];

    config.removeButtons = 'ShowBlocks,BGColor,TextColor,Styles,Font,FontSize,Iframe,PageBreak,Smiley,Flash,CreateDiv,RemoveFormat,Italic,Bold,Underline,Strike,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Find,SelectAll,Templates,Source,NewPage,Print,Language,Timestamp,HorizontalRule,Indent,Outdent,Replace,BidiRtl,BidiLtr,NumberedList,Mathjax';

    config.skin = 'moono';

    config.language = 'fr';

    config.extraPlugins = 'pastebase64';

    config.format_tags = 'p;h1;h2;h3;h4;h5;h6';

    config.removePlugins = 'elementspath,magicline';

    if (this.name === 'editorOcr') {
        config.height = '200px';
    }
    else {
        config.height = '350px';
    }

    // Sets SCAYT to French.
    config.scayt_sLang = 'fr_FR';
};