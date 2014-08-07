var apercuHTML = '<h1 id=\'titreDocumentApercu\' class=\'dark_green animated fadeInLeft\'>{{titreDoc}}</h1>'+
'<div class="container" ng-controller="ApercuCtrl" >'+
  '<div class="doc-apercu" body-classes="" document-methodes="">'+
    '<div class="modal fade" id="duplicateDocModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false" >'+
      '<div class="modal-dialog" id="modalContent">'+
        '<div class="modal-content">'+
          '<div class="modal-header">'+
            '<button type="button" class="close" ng-click="clearDupliquerDocument()" data-dismiss="modal" aria-hidden="true">&times;</button>'+
            '<h3 class="modal-title" id="myModalLabel">Dupliquer le document</h3>'+
          '</div>'+
          '<div class="alert alert-success" ng-show="showMsgSuccess">{{msgSuccess}}</div>'+
          '<div class="msg_error" ng-show="showMsgError">{{msgErrorModal}}</div>'+
          '<div class="modal-body adjust-modal-body">'+
            '<div class="row-fluid span6">'+
              '<div class="tab-content">'+
                '<div class="tab-pane active" id="document" ng-form="AjoutformValidation" >'+
                  '<form class="form-horizontal" role="form" id="duplicateDoc" name="duplicateDoc">'+
                    '<fieldset>'+
                      '<p class="controls_zone" ng-show="!showMsgSuccess">'+
                      'Vous n\'êtes pas le propriétaire de ce document, voulez-vous le dupliquer dans votre Dropbox?'+
                      '</p>'+
                      '<p class="controls_zone" ng-show="!showMsgSuccess">'+
                      '<label for="duplDocTitre" class=""><span>Titre du document</span> <span class="required">*</span></label>'+
                      '<input type="text" max-length="32" class="" id="duplDocTitre" placeholder="Entrez le titre du document" ng-model="duplDocTitre" required>'+
                      '</p>'+
                    '</fieldset>'+
                    '<div class="centering" id="ProfileButtons" ng-show="!showMsgSuccess">'+
                     ' <button type="button" class="reset_btn" ng-click="clearDupliquerDocument()" title="Annuler">Annuler</button>'+
                      '<button id="duplDocButton" type="button" class="btn_simple light_blue" ng-click="dupliquerDocument()" data-dismiss="" title="Oui">Oui</button>'+
                    '</div>'+
                    '<div class="centering" id="ProfileButtons" ng-show="showMsgSuccess">'+
                      '<button type="button" class="reset_btn" ng-click="clearDupliquerDocument()" title="Ok">Ok</button>'+
                    '</div>'+
                  '</form>'+
                '</div>'+
              '</div>'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</div>'+
    '</div>'+
    '<div class="modal fade" id="shareModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
      '<div class="modal-dialog">'+
        '<div class="modal-content">'+
          '<div class="modal-header">'+
            '<button type="button" class="close" ng-click="clearSocialShare()" data-dismiss="modal" aria-hidden="true">&times;</button>'+
            '<h3 class="modal-title" id="myModalLabel">Partager ce document</h3>'+
          '</div>'+
          '<div class="modal-body" ng-hide="confirme">'+
            '<h2> Avez-vous le droit de partager ce document ?</h2>'+
            '<p class="info_txt shareConfirme">'+
            'Les droits des auteurs doivent être protégés. Ainsi, en France comme dans de nombreux pays, la loi interdit généralement de partager un document sans la permission de ses auteurs. C’est pourquoi les auteurs qui désirent autoriser voire encourager le partage le signalent généralement dans leur œuvre en précisant que celle-ci est distribuée sous une licence libre ‘Creative Commons’. Sans ces permissions ou ce type de licence, le partage est strictement interdit. C’est pourquoi nous vous demandons de vérifier précisément vos droits au partage et de renoncer à cette liberté tant que les auteurs et la loi vous en privent. Par ailleurs, les droits des personnes handicapées doivent également être protégés. Ainsi, en France comme dans de nombreux pays, la loi oblige la collectivité nationale à être solidaire avec les personnes handicapées. En particulier, la loi autorise à partager tout document avec une personne lourdement handicapée, même sans la permission des auteurs, à condition de disposer d’un agrément ministériel spécifique. Avant de partager un document, il vous faut donc vérifier minutieusement que vous avez bien le droit de le partager. Est-ce bien le cas ?'+
            '</p>'+
            
            '<div class="centering" id="ProfileButtons">'+
              '<button type="button" class="reset_btn" data-dismiss="modal" style="padding: 8px 5px 4px;width: auto;" title="Non, je n’ai pas le droit de partager">Non, je n’ai pas le droit de partager</button>'+
              '<button type="button" class="btn_simple light_blue" ng-click="confirme=true" title="Oui, j’ai le droit de partager">Oui, j’ai le droit de partager</button>'+
            '</div>'+
          '</div>'+
          '<div class="modal-body" ng-hide="!confirme">'+
            '<h2><span>Sélectionner un moyen pour partager ce document</span></h2>'+
            '<form class="form-horizontal" role="form" id="socialShare1" name="socialShare1">'+
              '<p class="centering share_btn_container">'+
              '<button ng-show="showEmail" type="button" class="share_btn mail_share" ng-click="loadMail()" title="Email" id="apercu_share">&nbsp;</button>'+
              '<a class="share_link" href="https://www.facebook.com/sharer/sharer.php?u={{encodeURI}}&t=CnedAdapt"'+
                'onclick="javascript:window.open(this.href, \'\', \'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600\');return false;"'+
                'target="_blank" title="Partager sur Facebook">'+
                '<button type="button" class="share_btn fb_share" title="Partager sur Facebook">&nbsp;</button>'+
              '</a>'+
              '<a class="share_link" href="https://twitter.com/share?url={{encodeURI}}&via=CnedAdapt&text=Lien CnedAdapt"'+
                'onclick="javascript:window.open(this.href, \'\', \'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600\');return false;"'+
                'target="_blank" title="Partager sur Twitter">'+
                '<button type="button" class="share_btn twitter_share" title="Partager sur Twitter">&nbsp;</button>'+
              '</a>'+
              '<a class="share_link" href="https://plus.google.com/share?url={{encodeURI}}"'+
                'onclick="javascript:window.open(this.href,  \'\', \'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=350,width=480\');return false;"'+
                'target="_blank" title="Partager sur Google+">'+
                '<button type="button" class="share_btn gplus_share" title="Partager sur Google+">&nbsp;</button>'+
              '</a>'+
              '</p>'+
              '<div class="control_group" ng-show="showDestination">'+
                '<div class="alert alert-success" ng-show="emailMsgSuccess">{{emailMsgSuccess}}</div>'+
                '<div class="msg_error" ng-show="emailMsgError">{{emailMsgError}}</div>'+
                '<h2>adresse email <br><span>Saisissez l’adresse email du destinataire</span></h2>'+
                '<p class="mail_area">'+
                '<label for="destinataire" class="email" id="label_email_etap-one">Email</label>'+
                '<input type="text" class="" ng-model="destinataire" id="destinataire"/>'+
                '</p>'+
              '</div>'+
              
              '<div class="centering" id="ProfileButtons">'+
                '<button type="button" class="reset_btn" ng-click="clearSocialShare()"data-dismiss="modal" title="Annuler">Annuler</button>'+
                '<button type="button" class="btn_simple light_blue" ng-click="socialShare()" ng-show="showDestination" title="Partager">Partager</button>'+
              '</div>'+
            '</form>'+
          '</div>'+
        '</div>'+
      '</div>'+
    '</div>'+
    '<div class="modal fade" id="confirmModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false" >'+
      '<div class="modal-dialog" id="modalContent">'+
        '<div class="modal-content">'+
          '<div class="modal-header">'+
            '<button type="button" class="close" ng-click="" data-dismiss="modal" aria-hidden="true">&times;</button>'+
            '<h3 class="modal-title" id="myModalLabel">Confirmation d\'envoi</h3>'+
          '</div>'+
          '<div class="modal-body adjust-modal-body">'+
            '<div class="info_txt">'+
              '<p class="text_left ajustPadding_bottom">'+
              'Voulez-vous envoyer cet email ?'+
              '</p>'+
            '</div>'+
          '</div>'+
          '<div class="centering" id="confirmationButtons">'+
            '<button type="button" ng-click=\'dismissConfirm()\' class="reset_btn" ng-click="" data-dismiss="modal" title="Annuler">Annuler</button>'+
            '<button type="button" class="btn_simple light_blue" ng-click=\'sendMail()\' title="Envoyer">Envoyer</button>'+
          '</div>'+
         ' <!-- /.modal-content -->'+
        '</div>'+
        '<!-- /.modal-dialog -->'+
        '</div><!-- /.modal -->'+
      '</div>'+
      '<div class="modal fade" id="printModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
        '<div class="modal-dialog">'+
          '<div class="modal-content">'+
            '<div class="modal-header">'+
              '<button type="button" class="close" ng-click="clearPrint()" data-dismiss="modal" aria-hidden="true">&times;</button>'+
              '<h3 class="modal-title" id="myModalLabel">Imprimer le document</h3>'+
            '</div>'+
            '<div class="modal-body">'+
              '<form class="form-horizontal" role="form" id="printDoc" name="printDoc">'+
                '<div class="info_txt">'+
                  '<p class="text_left">'+
                  'Sélectionner un mode d\'impression pour ce document'+
                  '</p>'+
                  '<div class="control_group">'+
                    '<div ng-init="printMode=0">'+
                      '<p class="controls_zone">'+
                      '<input type="radio" id="all_pages" name="select_pages" class="hidden" ng-model="printMode" ng-value="0">'+
                      '<label class="mask" for="all_pages">&nbsp;</label>'+
                      '<label for="all_pages">Toutes les pages</label>'+
                      '</p>'+
                      '<p class="controls_zone">'+
                      '<input type="radio" id="current_pages" name="select_pages" class="hidden" ng-model="printMode" ng-value="1">'+
                      '<label class="mask" for="current_pages">&nbsp;</label>'+
                      '<label for="current_pages">Page actuelle</label>'+
                      '</p>'+
                      '<p class="controls_zone">'+
                      '<input type="radio" id="specific_pages" name="select_pages" class="hidden" ng-model="printMode" ng-value="2" ng-click="selectionnerMultiPage()">'+
                      '<label class="mask" for="specific_pages">&nbsp;</label>'+
                      '<label for="specific_pages">Sélection</label>'+
                      '<span ng-show="printMode == 2" class="num_pages">'+
                      '<br/><br/>'+
                      'De'+
                      '<select sselect id="pages_start_from" data-ng-model="pageDe" data-ng-options="page for page in pagePrints" ng-click="selectionnerPageDe()">'+
                      '</select>'+
                      'A'+
                      '<select sselect id="pages_end_width" data-ng-model="pageA" data-ng-options="page for page in pagePrints">'+
                      '</select>'+
                      '</span>'+
                      '</p>'+
                      '<p class="controls_zone">'+
                      '<input type="checkbox" id="print_plan" name="print_plan" class="hidden" ng-model="printPlan">'+
                      '<label class="mask" for="print_plan">&nbsp;</label>'+
                      '<label for="print_plan">Imprimer le plan</label>'+
                      '</p>'+
                    '</div>'+
                  '</div>'+
                '</div>'+
                '<div class="centering" id="ProfileButtons">'+
                  '<button type="button" class="reset_btn" data-dismiss="modal" title="Annuler" ng-click="clearPrint()">Annuler</button>'+
                  '<button type="button" class="btn_simple light_blue" ng-click="printByMode()" title="Imprimer">Imprimer</button>'+
                '</div>'+
              '</form>'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</div>'+
      '<!--   <div ng-repeat="blocks in blocksPlan" >'+
        '<div ng-repeat="block in blocks" class="slides-botstraps">'+
          '<p data-id="{{block.id}}" regle-style="block.text" style="width:650px;text-align:left;margin:0;"></p>'+
        '</div>'+
      '</div>  -->'+
      '<div>'+
        '<div class="msg_succes" id="okEmail" ng-show="envoiMailOk">'+
          'Email envoyé avec succès !'+
        '</div>'+
        '<carousel interval="myInterval" class="slider">'+
        '<div class="fixed_menu">'+
          '<div class="menu_wrapper">'+
           ' <button ng-click="afficherMenu()" type="button" class="open_menu" title="Navigation documents">Navigation documents</button>'+
            '<ul>'+
              '<li>'+
                '<a href class="plan" ng-click="plan()" title="Plan"> Plan </a>'+
              '</li>'+
              '<li>'+
                '<a href class="annotation" ng-click="enableNoteAdd()" title="Ajouter annotation"> Ajouter annotation </a>'+
              '</li>'+
              '<li>'+
                '<a href class="forward" ng-click="suivant()" title="Suivant"> Suivant </a>'+
              '</li>'+
              '<li>'+
                '<a href class="backward" ng-click="precedent()" title="Précedent"> Précedent </a>'+
              '</li>'+
              '<li>'+
                '<a href class="fast-forward" ng-click="dernier()" title="Dernier"> Dernier </a>'+
              '</li>'+
              '<li>'+
                '<a href class="fast-backward" ng-click="premier()" title="Premier"> Premier </a>'+
              '</li>'+
              '<li class="devider">'+
              '</li>'+
              '<li ng-show="showDuplDocModal">'+
                '<a href class="upload copy" data-toggle="modal" data-target="#duplicateDocModal" title="Copier"> Copier </a>'+
              '</li>'+
              '<li ng-show="showRestDocModal">'+
                '<a href class="edit" ng-click="restructurer()" title="Restructurer"> Restructurer </a>'+
              '</li>'+
              '<li ng-show="showPartagerModal">'+
                '<a href class="share_apercu" data-toggle="modal" ng-click="clearSocialShare()" data-target="#shareModal" title="partager"> partager </a>'+
              '</li>'+
              '<li>'+
                '<a href class="print_apercu" data-toggle="modal" data-target="#printModal" title="imprimer"> imprimer </a>'+
              '</li>'+
            '</ul>'+
          '</div>'+
        '</div>'+
        '<div id="note_container">'+
          '<div ng-repeat="note in notes" id="{{note.id}}">'+
            '<!-- <div class="zoneID" draggable ng-style="{ left: ( note.x + \'px\' ), top: ( note.y + \'px\' ) }">'+
              '<span class="delete_note">'+
              '<button type="button" ng-click="removeNote(note)">&nbsp;</button>'+
              '</span>'+
              '<div contenteditable="true" class="annotation_area" id="noteID" ng-model="note.texte" ng-change="editNote(note)">{{note.texte}}</div>'+
              '<span class="grag_note">'+
              '<button type="button" ng-click="">&nbsp;</button>'+
              '</span>'+
            '</div> -->'+
            '<table class="zoneID" draggable ng-style="{ left: ( note.x + \'px\' ), top: ( note.y + \'px\' ) }">'+
              '<tr>'+
                '<td width="23" class="delete_note" ng-click="removeNote(note)">&nbsp;</td>'+
                '<td id="editTexteID" ng-paste="setPasteNote($event)" contenteditable="false" regle-style="note.styleNote" class="annotation_area closed locked">'+
                  '<!--          <p ng-click="open_note($event)" contenteditable="true" regle-style="note.styleNote"></p>  -->'+
                '</td>'+
                '<td class="collapse_btn">'+
                  '<button class="edit_note" ng-click="saveNote(note, $event)" title="Enregistrer la note">&nbsp;</button>'+
                  '<button class="collapse_note" ng-click="collapse($event)" title="Réduire/Agrandir"></button>'+
                '</td>'+
                '<td id="noteID" class="drag_note">&nbsp;</td>'+
              '</tr>'+
            '</table>'+
            '<div class="has_note" id="linkID" draggable ng-style="{ left: ( (note.xLink) + \'px\' ), top: ( note.yLink + \'px\' ) }">'+
              '<!-- <span id="linkID2"></span> -->'+
            '</div>'+
          '</div>'+
        '</div>'+
        '<div id="noteBlock1" style="position:absolute;"></div>'+
        '<slide ng-repeat="blocks in blocksPlan" class="slides-botstraps" active="blocks.active" id="noteBlock2" ng-click="addNoteOnClick($event)" on-finish-apercu>'+
        '<div ng-switch on="$index">'+
          '<div id="plan" ng-switch-when="0">'+
            '<h2>Plan</h2>'+
            '<ul class="plan">'+
              '<li ng-repeat="plan in plans">'+
                '<a class="level" ng-click="setActive(plan.position, plan.block)" regle-style="plan.style" style="display:block; margin-left: {{calculateNiveauPlan(plan.numNiveau)}}px;" href title="{{plan.libelle}}"> {{plan.libelle}} </a>'+
              '</li>'+
            '</ul>'+
          '</div>'+
          '<div id="noPlan" ng-switch-default>'+
            '<div ng-repeat="slide in blocks" ng-show="slide.leaf || slide.root">'+
              '<img class="image_type" ng-show="(slide.leaf && !slide.text) || (slide.root && slide.children.length<=0 && !slide.text)" ng-src="{{slide.originalSource || slide.source}}" style="margin:auto;">'+
              '<div id="{{slide.id}}" class="carousel-caption">'+
                '<div class="text-slides" data-id="{{slide.id}}">'+
                  '<p data-id="{{slide.id}}" regle-style="slide.text" style="width:650px;text-align:left;margin:0;"> </p>'+
                '</div>'+
                '<div class="audio-player" ng-show="slide.synthese">'+
                  '<button class="audio_controls play_audio" ng-click="playSong(slide.synthese)" title="Lire">&nbsp;</button>'+
                  '<button class="audio_controls stop_audio" ng-show="slide.synthese" ng-click="pauseAudio()" title="Arrêter">&nbsp;</button>'+
                '</div>'+
                '<!-- <audio data-ng-init="initPlayerAudio()" preload="auto">'+
                  '<source type="audio/mp3" ng-src="{{slide.synthese}}"></source>'+
                '</audio> -->'+
              '</div>'+
            '</div>'+
          '</div>'+
        '</div>'+
        '</slide>'+
        '<!-- <audio id="player" src="" data-ng-init="initPlayerAudio()" preload="auto"></audio> -->'+
      '<audio id="player" src="" preload="auto"></audio>'+
      '</carousel>'+
    '</div>'+
  '</div>'+
  '<div ng-show=\'showloaderProgress\' class="loader_cover">'+
    '<div id="loader_container">'+
      '<div class="loader_bar">'+
        '<div class="progress_bar" style="width:{{loaderProgress}}%;">&nbsp;'+
        '</div>'+
      '</div>'+
      '<p class="loader_txt">{{loaderMessage}} <img src="{{loaderImg}}" alt="loader" /></p>'+
    '</div>'+
  '</div>'+
  '<div class="fixed_loader" ng-show="loader">'+
  '<div class="loadre_container">'+
    '<p class="loader_txt">{{loaderMsg}}</p>'+
  '</div>'+
'</div>'+
'</div>';
