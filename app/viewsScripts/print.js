var printHTML = '<div body-classes="" id="printPage" class="doc-print"  document-methodes="" >' +

        '<h1 id="titreDocumentApercu" ng-if="docName" class="dark_green animated fadeInLeft">{{docName}}</h1>' +

        '<div id="line-canvas"></div>' +

            '<div ng-repeat="innerContent in currentContent track by $index" id="{{ \'adaptContent-\' + $index }}" regle-style="innerContent" tags="{{listTagsByProfil}}"  class="adaptContent resetAll doc-apercu" ng-style="{{note.length > 0 ? floatLeftStyle : centeredStyle}}">' +
            '</div>' +

        '</div>' +

            // NOTE CONTAINER
        '<div id="note_container" ng-if="notes.length > 0" style="height: 100%; min-height: 630px; display: inline-block; width: 417px;">' +

            '<div data-ng-repeat="note in notes" id="{{note.id}}">' +
                // the note on the right side
                '<table class="zoneID" draggable style="z-index: 50;" data-ng-style="{ left: ( note.x + \'px\' ), top: ( note.y + \'px\' ) }">' +
                    '<tr>' +
                    '<td width="23" class="delete_note" data-ng-click="removeNote(note)">&nbsp;</td>' +
                    '<td id="editTexteID" class="annotation_area closed locked">' +
                    '<div contenteditable="true" data-ng-paste="setPasteNote($event)" data-ng-focus="prepareNote(note, $event)" data-ng-blur="autoSaveNote(note, $event)" regle-style="note.styleNote" ng-bind-html="note.texte"></div>' +
                    '</td>' +
                    '<td class="collapse_btn">' +
                    '<button class="collapse_note" data-ng-click="collapse($event)" title="Réduire/Agrandir"></button>' +
                    '</td>' +
                    '<td draggable-area id="noteID" class="drag_note">&nbsp;</td>' +
                    '</tr>' +
                '</table>' +

                    //little bubble on the left side
                '<div draggable-area class="has_note" id="linkID" draggable data-ng-style="{ left: ( (note.xLink) + \'px\' ), top: ( note.yLink + \'px\' ) }">' +
                '</div>' +
            '</div>' +
        '</div>' +

        //end note container


        '<div data-ng-if=\'showloaderProgress\' class="loader_cover">' +
            '<div id="loader_container">' +
                '<div class="loader_bar">' +
                    '<div class="progress_bar" style="width:{{loaderProgress}}%;">&nbsp;' +
                    '</div>' +
                '</div>' +
            '<p class="loader_txt">{{loaderMessage}} <img src="{{loaderImg}}" alt="loader" /></p>' +
            '</div>' +
        '</div>' +
        '<div class="fixed_loader" data-ng-if="loader">' +
            '<div class="loadre_container">' +
            '<p class="loader_txt">{{loaderMsg}}</p>' +
            '</div>' +
        '</div>' +
    '</div>';
