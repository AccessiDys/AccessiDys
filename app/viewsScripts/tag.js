var tagHTML = '<h1 id=\'titreTag\' class=\'animated fadeInLeft\' translate>Les règles</h1>'+
'<div class="container" id="global_container">'+
'<div class="msg_succes alert-dismissable" id="tagSuccess" style="display:none;">' +
  '<strong>{{successMsg}}</strong>'+
'</div>' +
'<div id="tagPage" document-methodes="">'+
'<div class="tags-container">'+
  '<div class="head_section">'+
    '<button type="button" class="add_tag grey_btn pull-right" data-toggle="modal" data-target="#tagAdd" data-ng-click="preAjouterTag()" title="Ajouter une règle">Ajouter une règle</button>'+
  '</div>'+
  '<table>'+
    '<thead>'+
      '<tr>'+
        '<th>Icône</th>'+
        '<th>Position</th>'+
        '<th>Libelle</th>'+
        '<th>Niveau</th>'+
        '<th class="action_zone">action</th>'+
      '</tr>'+
    '</thead>'+
    '<tbody>'+
      '<tr data-ng-repeat="tagItem in listTags">'+
        '<td class="centering"><img data-ng-show="tagItem.picto" width="18px" height="36px" data-ng-src="{{tagItem.picto}}"/></td>'+
        '<td>{{tagItem.position}}</td>'+
        '<td>{{tagItem.libelle}}</td>'+
        '<td>{{getLibelleNiveau(tagItem.niveau)}}</td>'+
        '<td class="action_area centering">'+
          '<button type="button" class="action_btn" action-profil="" data-show="{{tagItem._id}}" data-shown="false">&nbsp;</button>'+
          '<ul class="action_list" data-show="{{tagItem._id}}">'+
            '<li class="setting_tag"><a href=""  data-toggle="modal" data-target="#tagEdit"  data-ng-click="preModifierTag(tagItem)" title="Modifier">Modifier</a></li>'+
            '<li class="removing_item"><a href="" data-ng-click="preSupprimerTag(tagItem)" title="Supprimer" >Supprimer</a></li>'+
          '</ul>'+
        '</td>'+
      '</tr>'+
    '</tbody>'+
  '</table>'+
'</div>'+
'<!-- debut modal Add -->'+
'<div class="modal fade" id="tagAdd" tabindex="-1" role="dialog" aria-labelledby="tagAddLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">'+
  '<div class="modal-dialog">'+
    '<div class="modal-content">'+
      '<div class="modal-header">'+
        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" data-ng-click="clearTag()">&times;</button>'+
        '<h3 class="modal-title" id="tagAddlLabel">Ajouter une règle</h3>'+
      '</div>'+
      '<div data-ng-show="errorMsg" class="msg_error">'+
        '{{errorMsg}}'+
      '</div>'+
      '<div class="modal-body adjust-modal-body">'+
        '<div class="row-fluid span6">'+
          '<div class="tab-content">'+
            '<div class="tab-pane active" data-ng-form="tagAddForm" >'+
              '<form class="form-horizontal" role="form" id="tagAddForm" name="tagAddForm">'+
                '<fieldset>'+
                  '<p class="controls_zone">'+
                    '<label for="tagLibelle" class=""><span>Libelle</span> <span class="required">*</span></label>'+
                    '<input type="text" id="tagLibelle"  name="libelle" placeholder="Entrez le libelle de la règle" data-ng-model="tag.libelle" required>'+
                  '</p>'+
                  '<p class="controls_zone">'+
                    '<label for="tagLibelle" class=""><span>Position</span> <span class="required">*</span></label>'+
                    '<input data-ng-init="tag.position = 1" type="number" min="1" data-ng-model="tag.position" name="position" required />'+
                  '</p>'+
                  '<p class="controls_zone checkbox_zone">'+
                    '<label for="niveauTagAdd" class=""><span>Niveau</span> <span class="required">*</span></label>'+
                    '<input type="checkbox" class="hidden" name="default_niveau" id="default_niveau" data-ng-model="showNiveauTag" data-ng-click="showDefaultNiveau(tag)"/>'+
                    '<label class="mask" for="default_niveau">&nbsp;</label>'+
                    '<label for="default_niveau">Par défaut</label>'+
                    '<input data-ng-hide="showNiveauTag" type="number" min="{{minNiveau}}" max="{{maxNiveau}}" data-ng-model="tag.niveau" name="niveau" required />'+
                  '</p>'+
                  '<p class="controls_zone">'+
                    '<label for="docUploadPdf" class="upload_msg"> Icône </label>'+
                    '<span class="file_mask">'+
                      '<label class="parcourir_label">Parcourir</label>'+
                      '<input type="text" class="filename_show" name="">'+
                      '<input type="file" data-ng-model-instant id="docUploadPdf" multiple onchange="angular.element(this).scope().setFiles(this)" class=\'btn btn-default\' />'+
                    '</span>'+
                    '<button type="button" class="clear_upoadpdf" data-ng-click="clearUploadPicto()">&nbsp;</button>'+
                  '</p>'+
                '</fieldset>'+
                '<div class="centering" id="ProfileButtons">'+
                  '<button type="button" class="reset_btn" data-ng-click="clearTag()" data-dismiss="modal" title="Annuler">Annuler</button>'+
                  '<button type="button" class="btn_simple light_blue" data-ng-click="ajouterTag()" title="Ajouter">Ajouter</button>'+
                '</div>'+
              '</form>'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</div>'+
    '</div>'+
  '</div>'+
'</div>'+
'<!-- fin modal Add -->'+
'<!-- debut modal Edition -->'+
'<div class="modal fade" id="tagEdit" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">'+
  '<div class="modal-dialog">'+
    '<div class="modal-content">'+
      '<div class="modal-header">'+
        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" data-ng-click="clearTag()">&times;</button>'+
        '<h3 class="modal-title" id="myModalLabel">Editer la règle</h3>'+
      '</div>'+
      '<div data-ng-show="errorMsg" class="msg_error">'+
        '{{errorMsg}}'+
      '</div>'+
      '<div class="modal-body adjust-modal-body">'+
        '<div class="row-fluid span6">'+
          '<div class="tab-content">'+
            '<div class="tab-pane active" data-ng-form="tagEditForm" >'+
              '<form class="form-horizontal" role="form" id="tagEditForm" name="tagEditForm">'+
                '<fieldset>'+
                  '<p class="controls_zone">'+
                    '<label for="tagLibelle" class=""><span>Libelle</span> <span class="required">*</span></label>'+
                    '<input type="text" id="tagLibelle" ng-disabled="isDisabled" placeholder="Entrez le libelle de la règle" data-ng-model="fiche.libelle" required>'+
                  '</p>'+
                  '<p class="controls_zone">'+
                    '<label for="tagLibelle" class=""><span>Position</span> <span class="required">*</span></label>'+
                    '<input type="number" min="1" data-ng-model="fiche.position" name="position" required />'+
                  '</p>'+
                  '<p class="controls_zone checkbox_zone">'+
                    '<label for="niveauTagEdit" class=""><span>Niveau</span> <span class="required">*</span></label>'+
                      '<input class="hidden" type="checkbox" name="default_niveau" id="default_niveau" data-ng-model="showNiveauTag" />'+
                      '<label class="mask" for="default_niveau">&nbsp;</label>'+
                      '<label for="default_niveau">Par défaut</label>'+
                      '<input data-ng-hide="showNiveauTag" type="number" min="{{minNiveau}}" max="{{maxNiveau}}" data-ng-model="fiche.niveau" name="niveau" required />'+
                  '</p>'+
                  '<p class="controls_zone">'+
                    '<label for="docUploadPdf" class="upload_msg"> Icône </label>'+
                    '<span class="file_mask">'+
                      '<img data-ng-show="fiche.picto" class="visu_picto" data-ng-src="{{fiche.picto}}"/>'+
                      '<label class="parcourir_label">Parcourir</label>'+
                      '<input type="text" class="filename_show" name="">'+
                      '<input type="file" data-ng-model-instant id="docUploadPdf" multiple onchange="angular.element(this).scope().setFiles(this)" class=\'btn btn-default\' />'+
                    '</span>'+
                    '<button type="button" class="clear_upoadpdf" data-ng-click="clearUploadPicto()">&nbsp;</button>'+
                  '</p>'+
                '</fieldset>'+
                '<div class="centering" id="ProfileButtons">'+
                  '<button type="button" class="reset_btn" data-ng-click="clearTag()" data-dismiss="modal" title="Annuler">Annuler</button>'+
                  '<button type="button" class="btn_simple light_blue" data-ng-click="modifierTag()" title="Modifier">Modifier</button>'+
                '</div>'+
              '</form>'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</div>'+
    '</div>'+
  '</div>'+
'</div>'+
'<!-- fin modal Edition -->'+
'<!-- debut modal Delete -->'+
'<div class="modal fade" id="tagDelete" tabindex="-1" role="dialog" aria-labelledby="tagDeleteLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">'+
  '<div class="modal-dialog">'+
    '<div class="modal-content">'+
      '<div class="modal-header">'+
        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
        '<h3 class="modal-title" id="tagDeletelLabel">Supprimer la règle</h3>'+
      '</div>'+
      '<div class="modal-body adjust-modal-body">'+
      '<div class="info_txt">'+
        '<p class="text_left ajustPadding_bottom">'+
           'La règle sélectionnée va être définitivement supprimée du système. Confirmez-vous cette suppression?'+
        '</p>'+
      '</div>'+
        '<p class="centering">'+
          '<button type="button" class="reset_btn data-ng-scope" data-dismiss="modal" translate title="Annuler">Annuler</button>'+
          '<button type="button" class="btn_simple light_blue editionProfil data-ng-scope" data-ng-click="supprimerTag()" data-dismiss="modal" translate title="Supprimer">Supprimer</button>'+
        '</p>'+
      '</div>'+
    '</div>'+
  '</div>'+
'</div>'+
'<!-- fin modal Delete -->'+
'<!-- debut modal Delete -->'+
'<div class="modal fade" id="tagDeleteDenied" tabindex="-1" role="dialog" aria-labelledby="tagDeleteLabelDenied" aria-hidden="true" data-backdrop="static" data-keyboard="false">'+
  '<div class="modal-dialog">'+
    '<div class="modal-content">'+
      '<div class="modal-header">'+
        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
        '<h3 class="modal-title" id="tagDeletelLabel">Attention</h3>'+
      '</div>'+
      '<div class="modal-body adjust-modal-body">'+
      '<div class="info_txt">'+
        '<p class="text_left ajustPadding_bottom">'+
           'La règle sélectionnée ne peut être supprimée'+
        '</p>'+
      '</div>'+
      '</div>'+
    '</div>'+
  '</div>'+
'</div>'+
'<!-- fin modal Delete Denied-->'+
'</div></div>';
