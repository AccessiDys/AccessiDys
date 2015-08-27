CKEDITOR.plugins.add( 'dyslinesboth', {
    icons: 'dyslinesboth',
    init: function( editor ) {
        editor.addCommand( 'insertLines', {
    exec: function( editor ) {
        var stateBoth =  editor.ui.get( 'DysLinesBoth').getState();

        var body = editor.document.getBody();

        editor.ui.get('DysLinesLeft').setState(CKEDITOR.TRISTATE_OFF);
        editor.ui.get('DysLinesRight').setState(CKEDITOR.TRISTATE_OFF);

        if(stateBoth == 2) {
            body.setAttribute('style', 'padding-left: 10px; padding-right: 10px; border-left : 5px solid green; border-right : 5px solid red;');
            editor.ui.get('DysLinesBoth').setState(CKEDITOR.TRISTATE_ON);
        }
        else
        {
            body.setAttribute('style', '');
            editor.ui.get('DysLinesBoth').setState(CKEDITOR.TRISTATE_OFF);
        }
    }
});
        editor.ui.addButton( 'DysLinesBoth', {
    label: 'Insert Color Lines',
    command: 'insertLines',
    toolbar: 'dyslines'
});
    }
});
