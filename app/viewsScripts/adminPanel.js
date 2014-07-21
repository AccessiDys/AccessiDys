var adminPanelHTML='<h1 id=\'titreAdmin\' class=\'animated fadeInLeft\' translate>Administration</h1>'+
'<div class="container" id="global_container">'+
'<!-- Header -->'+
'<!-- End Header -->'+
'<div data-ng-init=\'initial()\' document-methodes="">'+
  '<!-- <br>'+
  '<br>'+
  '<span style="float:right"><b>Bienvenue {{admin.local.nom }} !</b> </span>'+
  '<br>'+
  '<br> -->'+
  '<span class="label label-primary">{{listeProfils.length}}</span>'+
'  <!--   <span ng-show=\'{{versionStat}}.length > 0\' class="label label-primary">{{versionStat}}</span>'+
'  -->'+
  '<div class="msg_succes alert-dismissable" id="addPanel" ng-show=\'versionStatShow\'>'+
    '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'+
    '<strong>{{versionStat}}</strong>'+
  '</div>'+
  '<!--<div class="row">'+
    '< <div class="col-md-4 text-center"> <span>Mes comptes  :</span>  <span class="label label-primary">{{comptes.length}}</span></div>'+
    '<div class="col-md-4">'+
      '<div class="input-group">'+
        '<input type="text" class="form-control input-sm" ng-model="query">'+
        '<span class="input-group-addon">'+
        '<span class="glyphicon glyphicon-search"></span>'+
        '</span>'+
      '</div>'+
    '</div>'+
  '</div>-->'+
  '<div class="head_section">'+
    '<input type="text" class="serach_field pull-left" placeholder="Recherche un compte..." ng-change="specificFilter()" ng-model="query">'+
    '<button type="button" class="grey_btn pull-right add_document" data-toggle="modal" data-target="#openUpgradeModal" ng-click="updgradeService()" translate title="Upgrade the application\'s version">modifierVersionApplication</button>'+
  '</div>'+
  '<table class="">'+
    '<thead>'+
      '<tr>'+
        '<th ng-repeat="header in headers" class="centering">{{header}}</th>'+
      '</tr>'+
    '</thead>'+
    '<tbody>'+
      '<tr ng-repeat="compte in comptes" ng-show="compte.showed">'+
        '<td>{{ compte.local.nom }}</td>'+
        '<td>{{ compte.local.prenom }}</td>'+
        '<td>{{ compte.local.email }}</td>'+
        '<td style="width:150px; text-align:center"><button type="button" class="delete_layer" data-toggle="modal" data-target="#myModal" ng-click="preSupprimer(compte)" title="Supprimer"></button></td>'+
      '</tr>'+
    '</tbody>'+
  '</table>'+
'</div>'+
'<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
  '<div class="modal-dialog">'+
    '<div class="modal-content">'+
      '<div class="modal-header">'+
        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
        '<h4 class="modal-title" id="myModalLabel">Suppression</h4>'+
      '</div>'+
      '<div class="modal-body">'+
        'Le compte sélectionné va être définitivement supprimé du système. Confirmez-vous cette suppression?'+
      '</div>'+
      '<br/>'+
      '<p class="centering">'+
      '<button type="button" class="reset_btn ng-scope" data-dismiss="modal" title="Annuler">Annuler</button>'+
      '<button type="button" class="btn_simple light_blue editionProfil ng-scope" ng-click="deleteAccount()" data-dismiss="modal" title="Confirmer suppression">Confirmer suppression</button>'+
      '</p>'+
    '</div>'+
  '</div>'+
'</div>'+
'<div class="modal fade" id="openUpgradeModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
  '<div class="modal-dialog ">'+
    '<div class="modal-content">'+
    '<div class="modal-header">'+
        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
        '<h4 class="modal-title" id="myModalLabel" translate>modifierVersionApplication</h4>'+
    '</div>'+
      '<div class="modal-body">'+
        '<div class="form_container" >'+
          '<form id="restorePasswordForm" class="" role="form">'+
            '<div ng-show=\'failupgrade\' class="alert alert-danger animated fadeInDown"> {{failupgradeMessage}}</div>'+
            '<div ng-show=\'successUpgrade\' class="alert alert-success animated fadeInDown">L\'operation a étè effectue avec succes.</div>'+
            '<fieldset class="globalFieldStyle" submit-scope>'+
              '<p class="control_group">'+
              '<label for="versionActu" class="two_lignes">Version Actuelle</label>'+
              '<input type="text" max-length="32" class="" id="versionActu" ng-model=\'oldVersion.valeur\' disabled>'+
              '</p>'+
              '<p class="control_group">'+
              '<label for="versionDate" class="two_lignes">Date de la Version :</label>'+
              '<input type="text" class="" id="versionDate" ng-model=\'oldVersion.date\' disabled>'+
              '</p>'+
              '<p class="control_group last">'+
              '<label for="newVersion" class="two_lignes">Nouvelle Version :</label>'+
              '<input type="text" class="" id="newVersion" ng-model=\'oldVersion.newvaleur\' disabled>'+
              '</p>'+
            '</fieldset>'+
          '</form>'+
        '</div>'+
      '</div>'+
      '<br/>'+
      '<div class="controls">'+
        '<button type="button" class="reset_btn ng-scope" data-dismiss="modal" title="Annuler">Annuler</button>'+
        '<button type="button" class="btn_simple light_blue editionProfil ng-scope" ng-click="updateVersion()" data-dismiss="modal" title="Confirmer la modification de la version">Confirmer la modification de la version</button>'+
      '</div>'+
    '</div>'+
  '</div>'+
'</div>'+
'<div class="loader" ng-show="loader"></div></div>';