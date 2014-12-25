var footerHTML= '<div class="footer">'+
	'<p>CnedAdapt est un outil proposé par le CNED - Mentions légales - ©2014 CNED</p>'+
  '<table class="zoneID" draggable data-ng-style="{ left: ( note.x + \'px\' ), top: ( note.y + \'px\' ) }">'+
  '<tr>'+
  '<td width="23" class="delete_note" data-ng-click="removeNote(note)">&nbsp;</td>'+
  '<td id="editTexteID" contenteditable="true" class="annotation_area closed locked">anootation'+
  '</td>'+
  '<td class="collapse_btn">'+
  '<button class="collapse_note" data-ng-click="collapse($event)" title="Réduire/Agrandir"></button>'+
  '</td>'+
  '<td draggableArea id="noteID" class="drag_note">&nbsp;</td>'+
  '</tr>'+
  '</table>'+
'</div>';
