var adminPanelHTML='<h1 id=\'titreAdmin\' class=\'animated fadeInLeft\' translate>Administration</h1>'+
'<div class="container">'+
'<!-- Header -->'+
'<!-- End Header -->'+
'<div data-ng-init=\'initial()\' document-methodes="" body-classes="" class="doc-General">'+
  '<span class="label label-primary">{{listeProfils.length}}</span>'+
  '<div class="msg_succes alert-dismissable" id="addPanel" data-ng-show=\'versionStatShow\'>'+
    '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'+
    '<strong>{{versionStat}}</strong>'+
  '</div>'+
  '<div class="head_section">'+
    '<input type="text" class="serach_field pull-left" placeholder="Recherche un compte..." data-ng-change="specificFilter()" data-ng-model="query">'+
    //'<button type="button" class="grey_btn pull-right add_document" data-toggle="modal" data-target="#openUpgradeModal" data-ng-click="updgradeService()" translate title="Upgrade the application\'s version">modifierVersionApplication</button>'+
    /*'<span class="admin_subs pull-right">activer pour tout les utilisateur</span>'+
     '<div class="pull-right">' +
      '<button ng-click="updateAll(\'ocr\',true)">activate ocr</button>' +
      '<button ng-click="updateAll(\'ocr\',false)">deactivate ocr</button>' +
      '<button ng-click="updateAll(\'audio\',true)">activate audio</button>' +
      '<button ng-click="updateAll(\'audio\',false)">deactivate audio</button>' +
    '</div>'+
  '</div>'+*/
  '<div class="active_users">'+
  '<span class="active_user_lbl">'+
  'Activer pour tous les utilisateurs'+
  '</span>'+
  '<div class="users_dropdow">'+
  '<a class="user_lbl" ng-click="showOptions($event)">'+
  'Océrisation '+
  '<b></b>'+
  '</a>'+
  '<ul>'+
  '<li>'+
  '<a href="" ng-click="updateAll(\'ocr\',true)">Activer</a>'+
  '</li>'+
  '<li>'+
  '<a href="" ng-click="updateAll(\'ocr\',false)">Désactiver</a>'+
  '</li>'+
  '</ul>'+
  '</div>'+
  '<div class="users_dropdow">'+
  '<a class="user_lbl" ng-click="showOptions($event)">'+
  'Synthèse vocale' +
  '<b></b>'+
  '</a>'+
  '<ul>'+
  '<li>'+
  '<a href="" ng-click="updateAll(\'audio\',true)">Activer</a>'+
  '</li>'+
  '<li>'+
  '<a href="" ng-click="updateAll(\'audio\',false)">Désactiver</a>'+
  '</li>'+
  '</ul>'+
  '</div>'+
  '</div>'+
  '<table class="admin_users">'+
    '<thead>'+
      '<tr>'+
        '<th data-ng-repeat="header in headers" class="centering">{{header}}</th>'+
      '</tr>'+
    '</thead>'+
    '<tbody>'+
      '<tr data-ng-repeat="compte in comptes" data-ng-show="compte.showed">'+
        '<td>{{ compte.local.nom }}</td>'+
        '<td>{{ compte.local.prenom }}</td>'+
        '<td>{{ compte.local.email }}</td>'+
        '<td>' +
            '<div class="controls_zone checkbox_zone share_annotation">'+
              '<input type="checkbox" class="hidden" name="{{compte._id}}ocr" id="{{compte._id}}ocr"  ng-checked="compte.local.authorisations.ocr" ng-click="updateOcrAutorisation(compte)">'+
              '<label class="mask" for="{{compte._id}}ocr">&nbsp;</label>'+
              '<label for="{{compte._id}}ocr">Ocerisation .</label>'+
            '</div>'+
            '<div class="controls_zone checkbox_zone share_annotation" >'+
              '<input type="checkbox" class="hidden" name="{{compte._id}}audio" id="{{compte._id}}audio"  ng-checked="compte.local.authorisations.audio" ng-click="updateAudioAutorisation(compte)">'+
              '<label class="mask" for="{{compte._id}}audio">&nbsp;</label>'+
              '<label for="{{compte._id}}audio">Synthese Vocal .</label>'+
            '</div>'+
        '</td>'+
        '<td class="action_area centering"><button type="button" class="action_btn" action-profil="" data-show="{{compte._id}}" data-shown="false"></button>'+
        '<ul class="action_list" data-show="{{compte._id}}" data-shown="false" >'+
            '<li class="removing_item">'+
              '<a href="" data-toggle="modal" data-target="#myModal" data-ng-click="preSupprimer(compte)" title="Supprimer" name="supprimer-utilisateur">Supprimer</a>'+
            '</li></ul>'+
        '</td>'+
      '</tr>'+
    '</tbody>'+
  '</table>'+
'</div>'+
'<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
  '<div class="modal-dialog">'+
    '<div class="modal-content">'+
      '<div class="modal-header">'+
        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
        '<h3 class="modal-title" id="myModalLabel">Suppression</h3>'+
      '</div>'+
      '<div class="modal-body">'+
        'Le compte sélectionné va être définitivement supprimé du système. Confirmez-vous cette suppression?'+
      '</div>'+
      '<br/>'+
      '<p class="centering">'+
      '<button type="button" class="reset_btn data-ng-scope" data-dismiss="modal" title="Annuler">Annuler</button>'+
      '<button type="button" class="btn_simple light_blue editionProfil data-ng-scope" data-ng-click="deleteAccount()" data-dismiss="modal" title="Confirmer suppression">Confirmer suppression</button>'+
      '</p>'+
    '</div>'+
  '</div>'+
'</div>'+
//'<div class="modal fade" id="openUpgradeModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
//  '<div class="modal-dialog ">'+
//    '<div class="modal-content">'+
//      '<div class="modal-header">'+
//          '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
//          '<h3 class="modal-title" id="myModalLabel" translate>modifierVersionApplication</h3>'+
//      '</div>'+
//      '<div class="modal-body">'+
//        '<div class="form_container" >'+
//          '<form id="restorePasswordForm" class="" role="form">'+
//            '<div data-ng-show=\'failupgrade\' class="alert alert-danger animated fadeInDown"> {{failupgradeMessage}}</div>'+
//            '<div data-ng-show=\'successUpgrade\' class="alert alert-success animated fadeInDown">L\'operation a étè effectue avec succes.</div>'+
//            '<fieldset class="globalFieldStyle" submit-scope>'+
//              '<p class="control_group">'+
//              '<label for="versionActu" class="two_lignes">Version Actuelle</label>'+
//              '<input type="text" maxlength="32" class="" id="versionActu" data-ng-model=\'oldVersion.valeur\' disabled>'+
//              '</p>'+
//              '<p class="control_group">'+
//              '<label for="versionDate" class="two_lignes">Date de la Version :</label>'+
//              '<input type="text" class="" id="versionDate" data-ng-model=\'oldVersion.date\' disabled>'+
//              '</p>'+
//              '<p class="control_group">'+
//              '<label for="newVersion" class="two_lignes">Nouvelle Version :</label>'+
//              '<input type="text" class="" id="newVersion" data-ng-model=\'oldVersion.newvaleur\' disabled>'+
//              '</p>'+
//              '<p class="controls_zone"><input ng-checked="true" type="radio" id="upgrade_soft" name="select_pages" class="hidden ng-pristine ng-valid" data-ng-model="upgradeMode" value="false"><label class="mask" for="upgrade_soft">&nbsp;</label><label for="upgrade_soft">Mise à jour partielle</label></p>'+
//              '<p class="controls_zone"><input  type="radio" id="upgrade_hard" name="select_pages" class="hidden ng-pristine ng-valid" data-ng-model="upgradeMode" value="true"><label class="mask" for="upgrade_hard">&nbsp;</label><label for="upgrade_hard">Mise à jour complète</label></p>'+
//            '</fieldset>'+
//          '</form>'+
//        '</div>'+
//      '</div>'+
//      '<br/>'+
//      '<div class="controls">'+
//        '<button type="button" class="reset_btn data-ng-scope" data-dismiss="modal" title="Annuler">Annuler</button>'+
//        '<button type="button" class="btn_simple light_blue editionProfil data-ng-scope" data-ng-click="updateVersion()" data-dismiss="modal" title="Confirmer la modification de la version">Confirmer la modification de la version</button>'+
//      '</div>'+
//    '</div>'+
//  '</div>'+
//'</div>'+
'<div class="loader" data-ng-show="loader"></div></div>';
