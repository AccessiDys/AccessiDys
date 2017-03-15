CKEDITOR.plugins.add( 'dyslinesleft', {
    icons: 'dyslinesleft',
    init: function( editor ) {
        editor.addCommand( 'insertLineLeft', {
    exec: function( editor ) {
        var stateLeft =  editor.ui.get( 'DysLinesLeft').getState();

        var body = editor.document.getBody();

        editor.ui.get('DysLinesBoth').setState(CKEDITOR.TRISTATE_OFF);
        editor.ui.get('DysLinesRight').setState(CKEDITOR.TRISTATE_OFF);

        if(stateLeft == 2) {
            body.setAttribute('style', 'padding-left: 10px; border-left : 5px solid green;');
            editor.ui.get('DysLinesLeft').setState(CKEDITOR.TRISTATE_ON);
        }
        else
        {
            body.setAttribute('style', '');
            editor.ui.get('DysLinesLeft').setState(CKEDITOR.TRISTATE_OFF);
        }
    }
});
        editor.ui.addButton( 'DysLinesLeft', {
    label: 'Insert Left Line',
    command: 'insertLineLeft',
    toolbar: 'dyslines'
});
    }
});
