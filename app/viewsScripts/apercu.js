var apercuHTML = '<h1 id=\'titreDocumentApercu\' class=\'dark_green animated fadeInLeft\'>{{titreDoc}}</h1>'+
'<div class="container">'+
  '<div class="doc-apercu" body-classes="" document-methodes="">'+
    '<div class="modal fade" id="duplicateDocModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false" >'+
      '<div class="modal-dialog" id="modalContent">'+
        '<div class="modal-content">'+
          '<div class="modal-header">'+
            '<button type="button" class="close" data-ng-click="clearDupliquerDocument()" data-dismiss="modal" aria-hidden="true">&times;</button>'+
            '<h3 class="modal-title" id="myModalLabel">Dupliquer le document</h3>'+
          '</div>'+
          '<div class="alert alert-success" data-ng-if="showMsgSuccess">{{msgSuccess}}</div>'+
          '<div class="msg_error" data-ng-if="showMsgError">{{msgErrorModal}}</div>'+
          '<div class="modal-body adjust-modal-body">'+
            '<div class="row-fluid span6">'+
              '<div class="tab-content">'+
                '<div class="tab-pane active" id="document" data-ng-form="AjoutformValidation" >'+
                  '<form class="form-horizontal" role="form" id="duplicateDoc" name="duplicateDoc">'+
                    '<fieldset>'+
                      '<p class="controls_zone" data-ng-if="!showMsgSuccess">'+
                      'Vous n\'êtes pas le propriétaire de ce document, voulez-vous le dupliquer dans votre Dropbox?'+
                      '</p>'+
                      '<p class="controls_zone" data-ng-if="!showMsgSuccess">'+
                      '<label for="duplDocTitre" class=""><span>Titre du document</span> <span class="required">*</span></label>'+
                      '<input type="text" max-length="32" class="" id="duplDocTitre" placeholder="Entrez le titre du document" data-ng-model="duplDocTitre" data-ng-change="ete()" required>'+
                      '</p>'+
                    '</fieldset>'+
                    '<div class="centering" id="ProfileButtons" data-ng-if="!showMsgSuccess">'+
                     ' <button type="button" class="reset_btn" data-ng-click="clearDupliquerDocument()" title="Annuler">Annuler</button>'+
                      '<button id="duplDocButton" type="button" class="btn_simple light_blue" data-ng-click="dupliquerDocument()" data-dismiss="" title="Oui">Oui</button>'+
                    '</div>'+
                    '<div class="centering" id="ProfileButtons" data-ng-if="showMsgSuccess">'+
                      '<button type="button" class="reset_btn" data-ng-click="clearDupliquerDocument()" title="Ok">Ok</button>'+
                    '</div>'+
                  '</form>'+
                '</div>'+
              '</div>'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</div>'+
    '</div>'+
    '<div class="modal fade" id="shareModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static" >'+
      '<div class="modal-dialog">'+
        '<div class="modal-content">'+
          '<div class="modal-header">'+
            '<button type="button" class="close" data-ng-click="clearSocialShare()" data-dismiss="modal" aria-hidden="true">&times;</button>'+
            '<h3 class="modal-title" id="myModalLabel">Partager ce document</h3>'+
          '</div>'+
          '<div class="modal-body" data-ng-hide="confirme">'+
            '<h2> Avez-vous le droit de partager ce document ?</h2>'+
            '<p class="info_txt shareConfirme">'+
            'Les droits des auteurs doivent être protégés. Ainsi, en France comme dans de nombreux pays, la loi interdit généralement de partager un document sans la permission de ses auteurs. C’est pourquoi les auteurs qui désirent autoriser voire encourager le partage le signalent généralement dans leur œuvre en précisant que celle-ci est distribuée sous une licence libre ‘Creative Commons’. Sans ces permissions ou ce type de licence, le partage est strictement interdit. C’est pourquoi nous vous demandons de vérifier précisément vos droits au partage et de renoncer à cette liberté tant que les auteurs et la loi vous en privent. Par ailleurs, les droits des personnes handicapées doivent également être protégés. Ainsi, en France comme dans de nombreux pays, la loi oblige la collectivité nationale à être solidaire avec les personnes handicapées. En particulier, la loi autorise à partager tout document avec une personne lourdement handicapée, même sans la permission des auteurs, à condition de disposer d’un agrément ministériel spécifique. Avant de partager un document, il vous faut donc vérifier minutieusement que vous avez bien le droit de le partager. Est-ce bien le cas ?'+
            '</p>'+
            '<div data-ng-show="addAnnotation" class="controls_zone checkbox_zone share_annotation">'+
                '<input type="checkbox" class="hidden ng-valid ng-dirty" name="partager_annotation" id="partager_annotation" data-ng-model="annotationOk">'+
                '<label class="mask" for="partager_annotation">&nbsp;</label>'+
                '<label for="partager_annotation">Partager les annotations .</label>'+
            '</div>'+
            '<div class="centering with_border" id="ProfileButtons">'+
              '<button type="button" class="reset_btn" data-dismiss="modal" style="padding: 8px 5px 4px;width: auto;" title="Non, je n’ai pas le droit de partager">Non, je n’ai pas le droit de partager</button>'+
              '<button type="button" class="btn_simple light_blue" data-ng-click="processAnnotation()" title="Oui, j’ai le droit de partager">Oui, j’ai le droit de partager</button>'+
            '</div>'+
          '</div>'+
          '<div class="modal-body" data-ng-hide="!confirme">'+
            '<h2><span>Sélectionner un moyen pour partager ce document</span></h2>'+
            '<form class="form-horizontal" role="form" id="socialShare1" name="socialShare1">'+
              '<p class="centering share_btn_container">'+
              '<a href="" data-ng-if="showEmail" class="share_btn mail_share" data-ng-click="loadMail()" title="Email" id="apercu_share"></a>'+
              '<a class="share_link share_btn fb_share" href="https://www.facebook.com/sharer/sharer.php?u={{encodeURI}}&t=CnedAdapt"'+
                'onclick="javascript:window.open(this.href, \'\', \'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600\');return false;"'+
                'target="_blank" title="Partager sur Facebook">'+
              '</a>'+
              '<a class="share_link share_btn twitter_share" href="https://twitter.com/share?url={{encodeURI}}&via=CnedAdapt&text=Un élément a été partagé via l\'outil cnedAdapt"'+
                'onclick="javascript:window.open(this.href, \'\', \'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600\');return false;"'+
                'target="_blank" title="Partager sur Twitter">'+
              '</a>'+
              '<a class="share_link share_btn gplus_share" href="https://plus.google.com/share?url={{encodeURI}}"'+
                'onclick="javascript:window.open(this.href,  \'\', \'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=350,width=480\');return false;"'+
                'target="_blank" title="Partager sur Google+">'+
              '</a>'+
              '</p>'+
              '<div class="control_group" data-ng-show="showDestination">'+
                '<div class="alert alert-success" data-ng-if="emailMsgSuccess">{{emailMsgSuccess}}</div>'+
                '<div class="msg_error" data-ng-show="emailMsgError">{{emailMsgError}}</div>'+
                '<h2>adresse email <br><span>Saisissez l’adresse email du destinataire</span></h2>'+
                '<p class="mail_area">'+
                '<label for="destinataire" class="email" id="label_email_etap-one">Email</label>'+
                '<input type="text" class="" data-ng-model="destinataire" id="destinataire"/>'+
                '</p>'+
              '</div>'+

              '<div class="centering" id="ProfileButtons">'+
                '<button type="button" class="reset_btn" data-ng-click="clearSocialShare()"data-dismiss="modal" title="Annuler">Annuler</button>'+
                '<button type="button" class="btn_simple light_blue" data-ng-click="socialShare()" data-ng-if="showDestination" title="Partager">Partager</button>'+
              '</div>'+
            '</form>'+
          '</div>'+
        '</div>'+
      '</div>'+
    '</div>'+
    '<div class="modal fade" id="AnnotationModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false" >'+
      '<div class="modal-dialog" id="modalContent">'+
        '<div class="modal-content">'+
          '<div class="modal-header">'+
            '<button type="button" class="close" data-ng-click="" data-dismiss="modal" aria-hidden="true">&times;</button>'+
            '<h3 class="modal-title" id="myModalLabel">Annotation partagée</h3>'+
          '</div>'+
          '<div class="modal-body adjust-modal-body">'+
            '<div class="info_txt">'+
              '<p class="text_left ajustPadding_bottom">'+
              'ce document a été partager avec les annotations du propriétaire voulait vous les appliquer ?'+
              '</p>'+
            '</div>'+
          '</div>'+
          '<div class="centering">'+
            '<button type="button" class="reset_btn" data-ng-click="" data-dismiss="modal" title="Annuler">Ne pas appliquer</button>'+
            '<button type="button" class="btn_simple light_blue" data-ng-click=\'applySharedAnnotation()\' title="Envoyer">Accepter</button>'+
          '</div>'+
         ' <!-- /.modal-content -->'+
        '</div>'+
        '<!-- /.modal-dialog -->'+
      '</div><!-- /.modal -->'+
    '</div>'+
    '<div class="modal fade" id="confirmModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false" >'+
      '<div class="modal-dialog" id="modalContent">'+
        '<div class="modal-content">'+
          '<div class="modal-header">'+
            '<button type="button" class="close" data-ng-click="" data-dismiss="modal" aria-hidden="true">&times;</button>'+
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
            '<button type="button" data-ng-click=\'dismissConfirm()\' class="reset_btn" data-ng-click="" data-dismiss="modal" title="Annuler">Annuler</button>'+
            '<button type="button" class="btn_simple light_blue" data-ng-click=\'sendMail()\' title="Envoyer">Envoyer</button>'+
          '</div>'+
         ' <!-- /.modal-content -->'+
        '</div>'+
        '<!-- /.modal-dialog -->'+
        '</div><!-- /.modal -->'+
      '</div>'+
      '<div class="modal fade" id="printModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static" >'+
        '<div class="modal-dialog">'+
          '<div class="modal-content">'+
            '<div class="modal-header">'+
              '<button type="button" class="close" data-ng-click="clearPrint()" data-dismiss="modal" aria-hidden="true">&times;</button>'+
              '<h3 class="modal-title" id="myModalLabel">Imprimer le document</h3>'+
            '</div>'+
            '<div class="modal-body">'+
              '<form class="form-horizontal" role="form" id="printDoc" name="printDoc">'+
                '<div class="info_txt">'+
                  '<p class="text_left">'+
                  'Sélectionner un mode d\'impression pour ce document'+
                  '</p>'+
                  '<div class="control_group">'+
                    '<div data-ng-init="printMode=0">'+
                      '<p class="controls_zone">'+
                      '<input type="radio" id="all_pages" name="select_pages" class="hidden" data-ng-model="printMode" data-ng-value="0">'+
                      '<label class="mask" for="all_pages">&nbsp;</label>'+
                      '<label for="all_pages">Toutes les pages</label>'+
                      '</p>'+
                      '<p class="controls_zone">'+
                      '<input type="radio" id="current_pages" name="select_pages" class="hidden" data-ng-model="printMode" data-ng-value="1">'+
                      '<label class="mask" for="current_pages">&nbsp;</label>'+
                      '<label for="current_pages">Page actuelle</label>'+
                      '</p>'+
                      '<p class="controls_zone">'+
                      '<input type="radio" id="specific_pages" name="select_pages" class="hidden" data-ng-model="printMode" data-ng-value="2" data-ng-click="selectionnerMultiPage()">'+
                      '<label class="mask" for="specific_pages">&nbsp;</label>'+
                      '<label for="specific_pages">Sélection</label>'+
                      '<span data-ng-if="printMode == 2" class="num_pages">'+
                      '<br/><br/>'+
                      'De'+
                      '<select sselect id="pages_start_from" data-ng-model="pageDe" data-ng-change="selectionnerPageDe()">'+
                      '<option data-ng-repeat="page in pagePrints" value="{{page}}">{{page}}</option></select>'+
                      'A'+
                      '<select sselect id="pages_end_width" data-ng-model="pageA" data-ng-change="selectionnerPageDe()">'+
                      '<option data-ng-repeat="page in pagePrints" value="{{page}}">{{page}}</option></select>'+
                      '</span>'+
                      '</p>'+
                      '<p class="controls_zone">'+
                      '<input type="checkbox" id="print_plan" name="print_plan" class="hidden" data-ng-model="printPlan">'+
                      '<label class="mask" for="print_plan">&nbsp;</label>'+
                      '<label for="print_plan">Imprimer le plan</label>'+
                      '</p>'+
                    '</div>'+
                  '</div>'+
                '</div>'+
                '<div class="centering" id="ProfileButtons">'+
                  '<button type="button" class="reset_btn" data-dismiss="modal" title="Annuler" data-ng-click="clearPrint()">Annuler</button>'+
                  '<button type="button" class="btn_simple light_blue" data-ng-click="printByMode()" title="Imprimer">Imprimer</button>'+
                '</div>'+
              '</form>'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</div>'+
      '<div>'+
        '<div class="msg_succes" id="okEmail" data-ng-if="envoiMailOk">'+
          'Email envoyé avec succès !'+
        '</div>'+
        '<carousel id="carouselid" interval="myInterval" class="slider">'+
        '<div class="fixed_menu">'+
          '<div class="menu_wrapper">'+
           ' <button data-ng-click="afficherMenu()" type="button" class="open_menu" title="Navigation documents">Navigation documents</button>'+
            '<ul>'+
              '<li>'+
                '<a href class="plan" data-ng-click="plan()" title="Plan"> Plan </a>'+
              '</li>'+
              '<li>'+
                '<a href class="annotation" data-ng-click="enableNoteAdd()" title="Ajouter annotation"> Ajouter annotation </a>'+
              '</li>'+
              '<li>'+
                '<a href class="forward" data-ng-click="suivant()" title="Suivant"> Suivant </a>'+
              '</li>'+
              '<li>'+
                '<a href class="backward" data-ng-click="precedent()" title="Précedent"> Précedent </a>'+
              '</li>'+
              '<li>'+
                '<a href class="fast-forward" data-ng-click="dernier()" title="Dernier"> Dernier </a>'+
              '</li>'+
              '<li>'+
                '<a href class="fast-backward" data-ng-click="premier()" title="Premier"> Premier </a>'+
              '</li>'+
              '<li class="devider">'+
              '</li>'+
              '<li data-ng-if="showDuplDocModal">'+
                '<a href class="upload copy" data-toggle="modal" data-target="#duplicateDocModal" title="Copier"> Copier </a>'+
              '</li>'+
              '<li data-ng-if="showRestDocModal">'+
                '<a class="edit" data-ng-click="restructurer()" title="Restructurer"> Restructurer </a>'+
              '</li>'+
              '<li data-ng-if="showPartagerModal">'+
                '<a href class="share_apercu" data-toggle="modal" data-ng-click="clearSocialShare()" data-target="#shareModal" title="partager"> partager </a>'+
              '</li>'+
              '<li>'+
                '<a href class="print_apercu" data-toggle="modal" data-target="#printModal" title="imprimer"> imprimer </a>'+
              '</li>'+
            '</ul>'+
          '</div>'+
        '</div>'+
        '<div id="note_container">'+
          '<div data-ng-repeat="note in notes" id="{{note.id}}">'+
            '<table class="zoneID" draggable data-ng-style="{ left: ( note.x + \'px\' ), top: ( note.y + \'px\' ) }">'+
              '<tr>'+
                '<td width="23" class="delete_note" data-ng-click="removeNote(note)">&nbsp;</td>'+
                '<td id="editTexteID" contenteditable="true" data-ng-paste="setPasteNote($event)" data-ng-focus="prepareNote(note, $event)" data-ng-blur="autoSaveNote(note, $event)" regle-style="note.styleNote" class="annotation_area closed locked">'+
                '</td>'+
                '<td class="collapse_btn">'+
                  '<button class="collapse_note" data-ng-click="collapse($event)" title="Réduire/Agrandir"></button>'+
                '</td>'+
                '<td draggableArea id="noteID" class="drag_note">&nbsp;</td>'+
              '</tr>'+
            '</table>'+
            '<div draggableArea class="has_note" id="linkID" draggable data-ng-style="{ left: ( (note.xLink) + \'px\' ), top: ( note.yLink + \'px\' ) }">'+
            '</div>'+
          '</div>'+
        '</div>'+
        '<div id="noteBlock1" style="position:absolute;"></div>'+
        '<slide bindonce data-ng-repeat="blocks in blocksPlan" class="slides-botstraps" active="blocks.active" id="noteBlock2" data-ng-click="addNoteOnClick($event)">'+
        '<div data-ng-switch on="$index" class="slide-element">'+
          '<div id="plan" data-ng-switch-when="0">'+
            '<h2>Plan</h2>'+
            '<ul class="plan">'+
              '<li bindonce data-ng-repeat="plan in plans" >'+
                '<a bindonce class="level level-plan" data-ng-click="setActive(plan.position, plan.block)" regle-style="plan.style" style="display:block; margin-left: {{plan.pixelsDecalage}}px;" href bo-title="plan.libelle" bo-text="plan.libelle"></a>'+
              '</li>'+
            '</ul>'+
          '</div>'+
          '<div id="noPlan" data-ng-switch-default>'+
            '<div bindonce data-ng-repeat="slide in blocks" on-finish-apercu>'+
              '<div bo-if="slide.leaf || slide.root">' +
              '<img class="image_type" bo-if="(slide.leaf && !slide.text) || (slide.root && slide.children.length<=0 && !slide.text)" data-ng-src="{{slide.originalSource || slide.source}}" style="margin:auto;">'+
              '<div class="carousel-caption">'+
                '<div id="{{slide.id}}" class="text-slides"">'+
                  '<p regle-style="slide.text" style="width:650px;text-align:left;margin:0;"> </p>'+
                '</div>'+
                '<div class="audio-player" data-ng-if="slide.synthese">'+
                  '<button class="audio_controls play_audio" data-ng-click="playSong(slide.synthese)" title="Lire">&nbsp;</button>'+
                  '<button class="audio_controls stop_audio" data-ng-if="slide.synthese" data-ng-click="pauseAudio()" title="Arrêter">&nbsp;</button>'+
                '</div>'+
              '</div>'+
              '</div>'+
            '</div>'+
          '</div>'+
        '</div>'+
        '</slide>'+
      '<audio id="player" src="" preload="auto"></audio>'+
      '</carousel>'+
    '</div>'+
  '</div>'+
  '<div data-ng-if=\'showloaderProgress\' class="loader_cover">'+
    '<div id="loader_container">'+
      '<div class="loader_bar">'+
        '<div class="progress_bar" style="width:{{loaderProgress}}%;">&nbsp;'+
        '</div>'+
      '</div>'+
      '<p class="loader_txt">{{loaderMessage}} <img src="{{loaderImg}}" alt="loader" /></p>'+
    '</div>'+
  '</div>'+
  '<div class="fixed_loader" data-ng-if="loader">'+
  '<div class="loadre_container">'+
    '<p class="loader_txt">{{loaderMsg}}</p>'+
  '</div>'+
'</div>'+
'</div>';
