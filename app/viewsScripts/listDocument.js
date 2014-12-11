var listDocumentHTML = '<h1 id=\'titreListDocument\' class=\'animated fadeInLeft\' translate>listDocument</h1>'+
'<div class="container" id="global_container">'+
'<appcache-updated></appcache-updated>'+
'<div document-methodes="" body-classes="" class="doc-General">'+
  '<div class="msg_succes" id="okEmail" data-ng-show="envoiMailOk">'+
    'Email envoyé avec succès !'+
  '</div>'+
  '<div class="head_section">'+
    '<input type="text" class="serach_field pull-left" data-ng-model="query" placeholder="Recherche un document ..." data-ng-change="specificFilter()" />'+
    '<button id="add_documentbtn" data-ng-show=\'onlineStatus\' type="button" class="grey_btn pull-right add_document" data-toggle="modal" data-target="#addDocumentModal" data-ng-click="" translate title="Ajouter un Document">Ajouter un Document</button>'+
  '</div>'+
  '<table class="" style=\'display: none\' id=\'listDocumentPage\'>'+
    '<thead>'+
      '<tr>'+
        '<th class="">TITRE</th>'+
        '<th class="">Date derniere modification</th>'+
        '<th class="action_zone">action</th>'+
      '</tr>'+
    '</thead>'+
    '<tbody>'+
      '<tr data-ng-repeat="document in listDocument | orderBy:[\'nomAffichage\']" data-ng-show="document.showed">'+
        '<td class="profil_desc">{{ document.nomAffichage }}</td>'+
        '<td class="profil_desc centering">{{ document.dateFromate }}</td>'+
        '<td class="action_area centering">'+
          '<button type="button" class="action_btn" action-profil="" data-show="{{document.rev}}" data-shown="false" name="document_action_btn">&nbsp;</button>'+
          '<ul class="action_list" data-show="{{document.rev}}">'+
            '<li class="show_item"><a href="{{document.lienApercu}}" id="show_document" data-ng-click=\'afficherDocument()\' title="Afficher">Afficher</a></li>'+
            '<li data-ng-show=\'onlineStatus\' class="setting_documentTitle"><a href="" id="edit_document"  data-toggle="modal" data-target="#EditTitreModal"  data-ng-click="openModifieTitre(document)" title="Modifier le titre">Modifier le titre</a></li>'+
            '<li data-ng-show=\'onlineStatus\' class="restructer_item"><a href="{{document.lienRestruct}}"  id="restructurer_document" title="Restructurer">Restructurer</a></li>'+
            '<li data-ng-show=\'onlineStatus\' class="share_item"><a href="" id="share_document" data-toggle="modal" data-target="#shareModal" title="Partager le document" data-ng-click="clearSocialShare(document);docPartage(document)" >Partager</a></li>'+
            '<li data-ng-show=\'onlineStatus\' class="removing_item"><a href="" id="delete_document" data-ng-click="open(document)" data-toggle="modal" data-target="#myModal" title="Supprimer" >Supprimer</a></li>'+
          '</ul>'+
        '</td>'+
      '</tr>'+
    '</tbody>'+
  '</table>'+
  '<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">'+
    '<div class="modal-dialog">'+
      '<div class="modal-content">'+
        '<div class="modal-header">'+
          '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
          '<h3 class="modal-title" id="myModalLabel">Confirmer la suppression</h3>'+
          '<div class="info_txt">'+
            '<p class="text_left ajustPadding_bottom" translate>Le document choisi va être définitivement supprimé de votre compte Dropbox. Confirmez-vous cette suppression?'+
            '</p>'+
          '</div>'+
        '</div>'+
        '<div class="modal-footer">'+
          '<div class="centering" id="ProfileButtons">'+
            '<button type="button" class="reset_btn" data-dismiss="modal" title="Annuler">Annuler</button>'+
            '<button type="button" class="btn_simple light_blue" data-dismiss="modal" data-ng-click=\'suprimeDocument()\' title="Annuler">Je confirme</button>'+
          '</div>'+
        '</div>'+
      '</div>'+
    '</div>'+
  '</div>'+
'</div>'+
'<div class="modal fade" id="shareModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">'+
  '<div class="modal-dialog">'+
    '<div class="modal-content">'+
      '<div class="modal-header">'+
        '<button type="button" class="close"  data-dismiss="modal" aria-hidden="true">&times;</button>'+
        '<h3 class="modal-title" id="myModalLabel">Partager ce document</h3>'+
      '</div>'+
      '<div class="modal-body" data-ng-hide="confirme">'+
            '<h2> Avez-vous le droit de partager ce document ?</h2>'+
            '<p class="info_txt shareConfirme">'+
            'Les droits des auteurs doivent être protégés. Ainsi, en France comme dans de nombreux pays, la loi interdit généralement de partager un document sans la permission de ses auteurs. C’est pourquoi les auteurs qui désirent autoriser voire encourager le partage le signalent généralement dans leur œuvre en précisant que celle-ci est distribuée sous une licence libre ‘Creative Commons’. Sans ces permissions ou ce type de licence, le partage est strictement interdit. C’est pourquoi nous vous demandons de vérifier précisément vos droits au partage et de renoncer à cette liberté tant que les auteurs et la loi vous en privent. Par ailleurs, les droits des personnes handicapées doivent également être protégés. Ainsi, en France comme dans de nombreux pays, la loi oblige la collectivité nationale à être solidaire avec les personnes handicapées. En particulier, la loi autorise à partager tout document avec une personne lourdement handicapée, même sans la permission des auteurs, à condition de disposer d’un agrément ministériel spécifique. Avant de partager un document, il vous faut donc vérifier minutieusement que vous avez bien le droit de le partager. Est-ce bien le cas ?'+
            '</p>'+
            '<div data-ng-if="addAnnotation" class="controls_zone checkbox_zone share_annotation">'+
                '<input type="checkbox" class="hidden ng-valid ng-dirty" name="partager_annotation" id="partager_annotation" data-ng-model="annotationOk" data-ng-change="changed(annotationOk)" >'+
                '<label class="mask" for="partager_annotation">&nbsp;</label>'+
                '<label for="partager_annotation">Partager les annotations. </label>'+
            '</div>'+
          '<div class="centering" id="ProfileButtons">'+
            '<button type="button" class="reset_btn" data-dismiss="modal" style="width: auto;padding: 8px 5px 4px;" title="Non, je n’ai pas le droit de partager">Non, je n’ai pas le droit de partager</button>'+
            '<button type="button" class="btn_simple light_blue" data-ng-click="processAnnotation()" title="Oui, j’ai le droit de partager">Oui, j’ai le droit de partager</button>'+
          '</div>'+
        '</div>'+
      '<div class="modal-body" data-ng-hide="!confirme">'+
        '<h2><span>Sélectionner un moyen pour partager ce document</span></h2>'+
        '<div class="msg_error" id="erreurEmail" style="display:none;">'+
          'Email incorrect !'+
        '</div>'+
        '<p class="centering share_btn_container">'+
        '<a href="" class="share_btn mail_share" data-ng-click="loadMail()" title="Email" id="document_share"></a>'+
        '<a class="share_link share_btn fb_share" href="https://www.facebook.com/sharer/sharer.php?u={{encodeURI}}&t=CnedAdapt"'+
        'onclick="javascript:window.open(this.href, \'\', \'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600\');return false;"'+
        'target="_blank" title="Partager sur Facebook">'+
        '</a>'+
        '<a class="share_link share_btn twitter_share" href="https://twitter.com/share?url={{encodeURI}}&via=CnedAdapt&text=Un élément a été partagé via l\'outil cnedAdapt"'+
        'onclick="javascript:window.open(this.href, \'\', \'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600\');return false;"'+
        'target="_blank" title="Partager sur Twitter">'+
        '</a>'+
        '<a class="share_link share_btn gplus_share" href="https://plus.google.com/share?url={{encodeURI}}"'+
        'onclick="javascript:window.open(this.href, \'\', \'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=350,width=480\');return false;"'+
        'target="_blank" title="Partager sur Google+">'+
        '</a>'+
        '</p>'+
        '<div class="control_group" data-ng-show="displayDestination">'+
          '<h2>adresse email <br><span>Saisissez l’adresse email du destinataire</span></h2>'+
          '<p class="mail_area">'+
          '<label for="destinataire" class="email" id="label_email_etap-one">Email</label>'+
          '<input type="email" class="" data-ng-model="destinataire" id="destinataire" placeholder="">'+
          '</p>'+
        '</div>'+
        '<div class="centering" id="ProfileButtons">'+
          '<button type="button" class="reset_btn" data-dismiss="modal" title="Annuler">Annuler</button>'+
          '<button type="button" class="btn_simple light_blue" data-ng-click="socialShare()" data-ng-show="displayDestination" title="Partager">Partager</button>'+
        '</div>'+
      '</div>'+
    '</div>'+
  '</div>'+
'</div>'+
'<div class="modal fade" id="EditTitreModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false" >'+
  '<div class="modal-dialog" id="modalContent">'+
    '<div class="modal-content">'+
      '<div class="modal-header">'+
        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
        '<h3 class="modal-title" id="myModalLabel">ENTRER LE NOUVEAU TITRE</h3>'+
      '</div>'+
      '<div class="modal-body">'+
        '<form class="globalFieldStyle" role="form">'+
          '<fieldset>'+
            '<p class="control_group clearfix" >'+
            '<div data-ng-show=\'afficheErreurModifier\' class="alert alert-danger animated fadeInRight">Ce nom existe déjà dans votre DropBox.</div>'+
            '<div data-ng-show=\'videModifier\' class="alert alert-danger animated fadeInRight">Ce champ et obligatoire. Veuillez le remplir.</div>'+
            '<div data-ng-show=\'specialCaracterModifier\' class="alert alert-danger animated fadeInRight">Veuillez ne pas utiliser les caractères spéciaux.</div>'+
            '<label for="inputEmail3" class="control-label without_icn">Nouveau Titre : </label>'+
            '<input type="text" type="text" max-length="32" data-ng-model=\'nouveauTitre\' id="inputEmail3" placeholder="Entrer un nouveau titre">'+
            '</p>'+
          '</fieldset>'+
          '<div class="centering" id="ProfileButtons">'+
            '<button id="reset_titleediting" type="button" class="reset_btn" data-dismiss="modal" title="Annuler">Annuler</button>'+
            '<button id="save_editedTitle" type="button" class="btn_simple light_blue" data-ng-click=\'modifieTitre()\' title="Enregistrer sur ma Dropbox">Enregistrer sur ma Dropbox</button>'+
          '</div>'+
        '</form>'+
      '</div>'+
    '</div>'+
  '</div>'+
'</div>'+
'</div>'+
'<div class="modal fade" id="addDocumentModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false" >'+
'<div class="modal-dialog" id="modalContent">'+
  '<div class="modal-content">'+
    '<div class="modal-header">'+
      '<button type="button" class="close" data-ng-click="" data-dismiss="modal" aria-hidden="true">&times;</button>'+
      '<h3 class="modal-title" id="myModalLabel">Ajouter un document</h3>'+
    '</div>'+
    '<div data-ng-show="errorMsg" class="msg_error">'+
      '{{errorMsg}}'+
    '</div>'+
    '<div class="modal-body adjust-modal-body">'+
      '<div class="row-fluid span6">'+
        '<div class="tab-content">'+
          '<div class="tab-pane active" id="document" data-ng-form="AjoutformValidation" >'+
            '<form class="form-horizontal" role="form" id="addDocument" name="addDocument">'+
              '<fieldset>'+
                '<p class="controls_zone">'+
                '<label for="docTitre" class=""><span>Titre</span> <span class="required">*</span></label>'+
                '<input type="text" max-length="32" class="" id="docTitre" placeholder="Entrez le titre du document" data-ng-model="doc.titre" required>'+
                '<span class="simple_txt">Veuillez ne pas utiliser les caractères spéciaux.</span>'+
                '</p>'+
                '<p class="controls_zone">'+
                '<label for="doclienPdf" class=""><span>Lien :</span> </label>'+
                '<input type="text" class="" id="doclienPdf" placeholder="Entrez le lien de votre fichier" data-ng-model="doc.lienPdf" required>'+
                '</p>'+
                '<p class="controls_zone">'+
                  '<span class="simple_txt">OU</span>'+
                  '<br/>'+
                  '<label for="docUploadPdf" class="upload_msg">Chargez un fichier depuis votre poste local :  </label>'+
                  '<span class="file_mask">'+
                    '<label class="parcourir_label">Parcourir</label>'+
                    '<input type="file" data-ng-model-instant id="docUploadPdf" multiple onchange="angular.element(this).scope().setFiles(this)" class=\'btn btn-default\' />'+
                    '<input type="text" id="filename_show" name="" readonly>'+
                  '</span>'+
                  '<button type="button" class="clear_upoadpdf" data-ng-click="clearUploadPdf()">&nbsp;</button>'+
                '</p>'+
              '</fieldset>'+
              '<div class="centering" id="ProfileButtons">'+
                '<button type="button" class="reset_btn" data-ng-click="" data-dismiss="modal" title="Annuler" name="reset">Annuler</button>'+
                '<button type="button" class="btn_simple light_blue" data-ng-click="ajouterDocument()" title="Ajouter" name="add_Document">Ajouter</button>'+
              '</div>'+
            '</form>'+
          '</div>'+
        '</div>'+
      '</div>'+
    '</div>'+
    '<!-- /.modal-content -->'+
  '</div>'+
  '<!-- /.modal-dialog -->'+
  '</div><!-- /.modal -->'+
'</div>'+
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
      '<button type="button" data-ng-click=\'dismissConfirm()\' class="reset_btn" data-ng-click="" data-dismiss="modal" title="{{\'Annuler\' | translate}}">Annuler</button>'+
      '<button type="button" class="btn_simple light_blue" data-ng-click=\'sendMail()\' title="{{\'Envoyer\' | translate}}" >Envoyer</button>'+
    '</div>'+
    '<!-- /.modal-content -->'+
  '</div>'+
  '<!-- /.modal-dialog -->'+
  '</div><!-- /.modal -->'+
'</div>'+
  '<div data-ng-show=\'showloaderProgress\' class="loader_cover">'+
    '<div id="loader_container">'+
      '<div class="loader_bar">'+
        '<div class="progress_bar" style="width:{{loaderProgress}}%;">&nbsp;'+
        '</div>'+
      '</div>'+
      '<p class="loader_txt">{{loaderMessage}} <img src="{{loaderImg}}" alt="loader" /></p>'+
    '</div>'+
  '</div>'+
  '<div id="checkUpdate" class="fixed_loader">'+
    '<div class="loadre_container">'+
      '<p class="loader_txt">{{loaderMsg}}</p>'+
    '</div>'+
  '</div>'+
'</div>'+
'</div>';
