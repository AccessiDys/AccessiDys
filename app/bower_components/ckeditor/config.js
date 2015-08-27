/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */
CKEDITOR.editorConfig = function( config ) {
    config.toolbarGroups = [
        { name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
        { name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
        { name: 'links', groups: [ 'links' ] },
        { name: 'tools', groups: [ 'tools' ] },
        '/',
        { name: 'styles', groups: [ 'styles' ] },
        { name: 'forms', groups: [ 'forms' ] },
        { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'bidi', 'paragraph' ] },
        { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
        { name: 'insert', groups: [ 'insert' ] },
        { name: 'colors', groups: [ 'colors' ] },
        { name: 'others', groups: [ 'others' ] },
        { name: 'dyslines', groups: [ 'dyslinesboth', 'dyslinesleft', 'dyslinesright' ] }
    ];


    config.toolbar_OcrVersion = [
        ['Scayt']
    ];

    config.removeButtons = 'ShowBlocks,BGColor,TextColor,Styles,Font,FontSize,Iframe,PageBreak,Smiley,Flash,CreateDiv,RemoveFormat,Italic,Bold,Underline,Strike,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Find,SelectAll,Templates,Source,NewPage,Print,Language,Timestamp,HorizontalRule,Indent,Outdent,Replace,BidiRtl,BidiLtr';

    // Skin office
    config.skin = 'moono';

    config.extraPlugins = 'dyslinesboth,dyslinesleft,dyslinesright,mathjax';

    config.mathJaxLib = '//cdn.mathjax.org/mathjax/2.2-latest/MathJax.js?config=TeX-AMS_HTML';
    config.language = 'fr';

    config.format_tags = 'p;h1;h2;h3;h4;h5;h6'

    // Sets SCAYT to French.
    config.scayt_sLang = 'fr_FR';
};