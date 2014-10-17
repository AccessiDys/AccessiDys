var printHTML = '<div body-classes="" id=\'printPage\' class="doc-print"  document-methodes="" >'+
  '<div id="note_container" class="print-container">'+
    '<div bindonce ng-repeat="note in notes" id="{{note.id}}">'+
      '<table class="zoneID" bo-style="{ position:\'absolute\', left: ( note.x + \'px\' ), top: ( note.y + \'px\' ) }">'+
        '<tr>'+
          '<td regle-style="note.styleNote" class="annotation_area opened">'+
          '</td>'+
        '</tr>'+
      '</table>'+
      '<div class="has_note" id="linkID" bo-style="{ position:\'absolute\', left: ( (note.xLink) + \'px\' ), top: ( note.yLink + \'px\' ) }">'+
      '</div>'+
    '</div>'+
  '</div>'+
  '<div id="noteBlock1" style="position:absolute;"></div>'+
	'<div bindonce ng-repeat="blocks in blocksPlan" id="noteBlock2" on-finish-render>'+
        '<div ng-switch on="$index">'+
            '<div bindonce id="plan" ng-switch-when="0">'+
              '<h2 bo-if="showPlan">Plan</h2>'+
              '<ul class="plan">'+
                  '<li bindonce ng-repeat="plan in plans">'+
                    '<span class="level" regle-style="plan.style" style="display:block; margin-left: {{plan.pixelsDecalage}}px;" bo-title="plan.libelle" bo-text="plan.libelle"></span>'+
                  '</li>'+
              '</ul>'+
            '</div>'+
            '<div id="noPlanPrint{{$index}}" ng-switch-default style="padding:80px 30px 80px 17px;">'+
              '<div bindonce ng-repeat="slide in blocks" ng-if="slide.leaf || slide.root">'+
                '<div id="{{slide.id}}">'+
                  '<img class="image_type" bo-if="(slide.leaf && !slide.text) || (slide.root && slide.children.length<=0 && !slide.text)" ng-src="{{slide.originalSource || slide.source}}">'+
                  '<p data-id="{{slide.id}}" regle-style="slide.text" style="width:650px; text-align:left; margin:0; padding: 20px 0 30px 0;"></p>'+
                '</div>'+
              '</div>'+
            '</div>'+
        '</div>'+
  '</div>'+
'</div>';