CKEDITOR.plugins.add( 'dyslinesright', {
    icons: 'dyslinesright',
    init: function( editor ) {
        editor.addCommand( 'insertLineRight', {
    exec: function( editor ) {
        var stateRight =  editor.ui.get( 'DysLinesRight').getState();

        var body = editor.document.getBody();

        editor.ui.get('DysLinesBoth').setState(CKEDITOR.TRISTATE_OFF);
        editor.ui.get('DysLinesLeft').setState(CKEDITOR.TRISTATE_OFF);

        if(stateRight == 2) {
            body.setAttribute('style', 'padding-right: 10px; border-right : 5px solid red;');
            editor.ui.get('DysLinesRight').setState(CKEDITOR.TRISTATE_ON);
        }
        else
        {
            body.setAttribute('style', '');
            editor.ui.get('DysLinesRight').setState(CKEDITOR.TRISTATE_OFF);
        }
    }
});
        editor.ui.addButton( 'DysLinesRight', {
    label: 'Insert Right Line',
    command: 'insertLineRight',
    toolbar: 'dyslines'
});
    }
});
