var detailProfilHTML = '<div document-methodes="" class="profile_details" data-ng-init="initDetailProfil()">'+
'<div>'+
  '<div class="msg_succes" id="okEmail" style="display:none;">'+
      '<a href="#" class="alert-link" title="Email envoyé avec succès !">Email envoyé avec succès !</a>'+
  '</div>'+
  '<div class="msg_succes" id="favoris" style="display:none;">'+
      '<a href="#" class="alert-link" title="Profil ajouté aux profils favoris !">Profil ajouté aux profils favoris !</a>'+
  '</div>'+
  '<div class="profile_infos">'+
    '<h2>Information liées au profil</h2>'+
    '<ul>'+
      '<li>'+
        '<label>Nom :</label>{{detailProfil.nom}}'+
      '</li>'+
      '<li>'+
        '<label>Descriptif :</label>{{detailProfil.descriptif}}'+
      '</li>'+
    '</ul>'+
  '</div>'+
  '<div class="profile_regles">'+
    '<h2>Règles :</h2>'+
    '<p style="margin-left: {{r.niveau}}px;" ng-repeat="r in regles" regle-style="r.texte"></p>'+
  '</div>'+
'</div>'+
'<div class="detail-profil-actions">'+
  '<button type="button" class="btn_simple light_blue duplicate-btn" ng-click="preDupliquerProfilFavorit(detailProfil)" ng-show=\'showDupliquer\' data-toggle="modal" data-target="#dupliqueModal" title="{{\'Dupliquer le profil\' | translate}}" >Dupliquer</button>'+
  '<button type="button" class="btn_simple light_blue edit-btn" data-toggle="modal" data-target="#editModal" ng-click="preModifierProfil(detailProfil)" ng-show=\'showEditer\' title="{{\'Modifier le profil\' | translate}}">Modifier le profil</button>'+
  '<button type="button" class="btn_simple light_blue share-btn" data-toggle="modal" data-target="#shareModal" ng-click="detailsProfilApartager()" ng-show=\'showPartager\' title="{{\'Partager le profil\' | translate}}">Partager le profil</button>'+
  '<button type="button" class="btn_simple light_blue favourite-btn" ng-click="ajouterAmesFavoris()" ng-show=\'showFavouri\' title="Ajouter à mes favoris">Ajouter à mes favoris</button>'+
  '<button type="button" class="btn_simple light_blue accepte-delegate" ng-click="deleguerUserProfil()" ng-show=\'showDeleguer\' title="{{\'AccepterDemandeDelegation\' | translate}}">Accepter la demande de délégation</button>'+
'</div>'+
  '<div class="modal fade" id="shareModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
    '<div class="modal-dialog">'+
      '<div class="modal-content">'+
        '<div class="modal-header">'+
          '<button type="button" class="close" ng-click="clearSocialShare()"  data-dismiss="modal" aria-hidden="true">&times;</button>'+
          '<h4 class="modal-title" id="myModalLabel">Partager ce profil</h4>'+
        '</div>'+
        '<div class="modal-body">'+
          '<h2><span>Sélectionner un moyen pour partager ce profil</span></h2>'+
          '<div class="msg_error" id="erreurEmail" style="display:none;">'+
            'Email incorrect !'+
          '</div>'+
          '<p class="centering share_btn_container">'+
            '<button class="share_btn mail_share" type="button" ng-click="loadMail()" title="Email">&nbsp;</button>'+
            '<a class="share_link" href="https://www.facebook.com/sharer/sharer.php?u={{encodeURI}}&t=CnedAdapt"'+
            'onclick="javascript:window.open(this.href, \'\', \'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600\');return false;" target="_blank" title="{{\'Partager sur Facebook\' | translate}}">'+
              '<button type="button" class="share_btn fb_share" ng-click="socialShare()" title="{{\'Partager sur Facebook\' | translate}}" >&nbsp;</button>'+
            '</a>'+
            '<a class="share_link" href="https://twitter.com/share?url={{encodeURI}}&via=CnedAdapt&text=Lien CnedAdapt"'+
            'onclick="javascript:window.open(this.href, \'\', \'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600\');return false;" target="_blank" title="{{\'Partager sur Twitter\' | translate}}">'+
              '<button type="button" class="share_btn twitter_share" ng-click="socialShare()" title="{{\'Partager sur Twitter\' | translate}}">&nbsp;</button>'+
            '</a>'+
            '<a class="share_link" href="https://plus.google.com/share?url={{encodeURI}}"'+
            'onclick="javascript:window.open(this.href, \'\', \'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=350,width=480\');return false;" target="_blank" title="{{\'Partager sur GooglePlus\' | translate}}">'+
              '<button type="button" class="share_btn gplus_share" ng-click="socialShare()" title="{{\'Partager sur GooglePlus\' | translate}}">&nbsp;</button>'+
            '</a>'+
          '</p>'+
          '<div class="control_group" ng-show="displayDestination">'+
            '<h2>adresse email <br><span>Saisissez l’adresse email du destinetaire</span></h2>'+
            '<p class="mail_area">'+
              '<label for="destinataire" class="email" id="label_email_etap-one">Email</label>'+
              '<input type="email" class="" ng-model="destinataire" id="destinataire" placeholder="" />'+
            '</p>'+
          '</div>'+
          '<div class="centering" id="ProfileButtons">'+
            '<button type="button" class="reset_btn" ng-click="clearSocialShare()" data-dismiss="modal" title="{{\'Annuler\' | translate}}" >Annuler</button>'+
            '<button type="button" class="btn_simple light_blue" ng-show="displayDestination" ng-click="socialShare()" title="{{\'Partager\' | translate}}">Partager</button>'+
          '</div>'+
        '</div>'+
      '</div>'+
    '</div>'+
  '</div>'+
'<div class="modal fade" id="confirmModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false" >'+
  '<div class="modal-dialog" id="modalContent">'+
    '<div class="modal-content">'+
      '<div class="modal-header">'+
      '<button type="button" class="close" ng-click="" data-dismiss="modal" aria-hidden="true">&times;</button>'+
      '<h4 class="modal-title" id="myModalLabel">Confirmation d\'envoi</h4>'+
    '</div>'+
      '<div class="modal-body adjust-modal-body">'+
        '<div class="info_txt">'+
          '<p class="text_left ajustPadding_bottom">'+
            'Voulez vous envoyer cet email ?'+
          '</p>'+
        '</div>'+
      '</div>'+
      '<div class="centering" id="confirmationButtons">'+
        '<button type="button" ng-click=\'dismissConfirm()\' class="reset_btn" ng-click="" data-dismiss="modal" title="Annuler">Annuler</button>'+
        '<button type="button" class="grey_btn normal_padding" ng-click=\'sendMail()\' title="Envoyer">Envoyer</button>'+
      '</div>'+
    '<!-- /.modal-content -->'+
  '</div>'+
  '<!-- /.modal-dialog -->'+
  '</div><!-- /.modal -->'+
'</div>'+
'<!-- Duplique Favorit Profil Modal declaration !-->'+
'<div class="modal fade" id="dupliqueModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false"  >'+
  '<div class="modal-dialog" id="edit-Modal" >'+
    '<div class="modal-content" >'+
      '<div class="modal-header">'+
        '<button type="button" class="close" ng-click="afficherProfilsClear()" data-dismiss="modal" aria-hidden="true">&times;</button>'+
        '<h4 class="modal-title" id="myModalLabel" translate>Dupliquer le profil</h4>'+
      '</div>'+
      '<div ng-show="affichage" class="msg_error">'+
        '<ul ng-repeat="error in addFieldError">'+
          '<li>Le champ <strong>{{error}}</strong> est invalide</li>'+
        '</ul>'+
      '</div>'+
      '<div class="modal-body adjust-modal-body">'+
        '<div class="row-fluid span6" ng-form="editionFormValidation">'+
          '<form class="form-horizontal" role="form" id="editProfile" name="editProfile" novalidate>'+
            '<fieldset>'+
              '<h5>Information liées au profil <span>(obligatoire)</span></h5>'+
              '<p class="controls_zone pull-left">'+
              '<label for="nom" class=""><span translate>Nom</span> <span class="required">*</span></label>'+
              '<input type="text" class="" ng-model="profMod.nom" value="profMod.nom" required>'+
              '</p>'+
              '<p class="controls_zone pull-right">'+
              '<label for="descriptif" class=""><span translate>Descriptif</span> <span class="required">*</span></label>'+
              '<input type="text" class="" ng-model="profMod.descriptif" value="profMod.descriptif" placeholder="Entrez le descriptif" required>'+
              '</p>'+
            '</fieldset>'+
            '<fieldset>'+
              '<h5>Paramètres principaux du profil</h5>'+
              '<div class="regles_area">'+
                '<div class="regles-head_area">'+
                  '<p class="controls_zone">'+
                  '<label for="tag" class=""><span translate>Regles</span> <span class="required">*</span></label>'+
                  '<select sselect id="selectId" class="" ng-model="editTag" required>'+
                    '<option ng-repeat="tag in listTags" value="{{tag}}" ng-disabled="affectDisabled(tag.disabled)">{{tag.libelle}}</option>'+
                  '</select>'+
                  '</p>'+
                  '<div ng-hide="hideVar" class="blocker">&nbsp;</div>'+
                '</div>'+
                '<div class="regles-body_area">'+
                  '<div class="pull-left">'+
                    '<p class="controls_zone">'+
                    '<label  for="police" class="" translate>Police</label>'+
                    '<select sselect class="" ng-model="policeList" ng-change="dupliqueStyleChange(\'police\', policeList)" required>'+
                      '<option ng-repeat="police in policeLists" value="{{police}}" > {{police}}</option>'+
                    '</select>'+
                    '</p>'+
                    '<p class="controls_zone">'+
                    '<label  for="taille" class="" translate>Taille</label>'+
                    '<select sselect class="" ng-model="tailleList" ng-change="dupliqueStyleChange(\'taille\', tailleList)" required>'+
                      '<option ng-repeat="taille in tailleLists" value="{{taille.number}}">{{taille.number}}</option>'+
                    '</select>'+
                    '</p>'+
                    '<p class="controls_zone">'+
                    '<label  for="tag" class=""><span translate>Interligne</span></label>'+
                    '<select sselect class="" ng-model="interligneList" ng-change="dupliqueStyleChange(\'interligne\', interligneList)" required>'+
                      '<option ng-repeat="interligne in interligneLists" value="{{interligne.number}}">{{interligne.number}}</option>'+
                    '</select>'+
                    '</p>'+
                    '<p class="controls_zone">'+
                    '<label for="coloration" class=""><span translate>Coloration</span> </label>'+
                    '<select sselect class="" ng-model="colorList" ng-change="dupliqueStyleChange(\'coloration\',colorList)" required >'+
                      '<option ng-repeat="color in colorLists" value="{{color}}">{{color}}</option>'+
                    '</select>'+
                    '</p>'+
                    '<p class="controls_zone">'+
                    '<label for="tag" class=""><span translate>Style</span></label>'+
                    '<select sselect class="" ng-model="weightList" ng-change="dupliqueStyleChange(\'style\',weightList)" required>'+
                      '<option ng-repeat="weight in weightLists" value="{{weight}}">{{weight}}</option>'+
                    '</select>'+
                    '</p>'+
                  '</div>'+
                  '<div class="pull-right">'+
                    '<div class="show_zone">'+
                      '<p class="text-center shown-text-duplique" id="style-affected-edit" data-font="{{policeList}}" data-size="{{tailleList}}" data-lineheight="{{interligneList}}" data-weight="{{weightList}}" data-coloration="{{colorList}}" regle-style="displayText">'+
                      '</p>'+
                    '</div>'+
                    '<div class="regles_exists editing_tag">'+
                      '<ul>'+
                        '<li ng-repeat="var in tagStyles">'+
                          '<span id="{{var._id}}" class="{{label_action}}">{{var.tagLibelle}} <span translate>modifie</span></span>'+
                          '<a class="set_tag" href="" title="Edit le tag" ng-click="dupliqueModifierTag(var)">&nbsp;</a>'+
                          '<a class="delete_tag" href="" title="Supprimer le tag" ng-click="editionSupprimerTag(var)">&nbsp;</a>'+
                        '</li>'+
                      '</ul>'+
                    '</div>'+
                  '</div>'+
                '</div>'+
                '<p class="validation_regles">'+
                '<button type="button" id="dupliqueValidationButton" class="grey_btn normal_padding" ng-click="beforeValidationModif()" translate title="Valider la règle">validerLaRegle</button>'+
                '</p>'+
              '</div>'+
            '</fieldset>'+
            '<div class="centering" id="ProfileButtons">'+
              '<button type="button" class="reset_btn" ng-click="afficherProfilsClear()" data-dismiss="modal" translate title="Annuler">Annuler</button>'+
              '<button type="button" class="grey_btn normal_padding dupliqueProfil" ng-click="dupliquerFavoritProfil()" ng-disabled="checkStyleTag()" translate title="Enregistrer le profil">Enregistrer le profil</button>'+
            '</div>'+
          '</form>'+
        '</div>'+
      '</div>'+
    '</div>'+
    '<!-- /.modal-content -->'+
    '</div><!-- /.modal-dialog -->'+
    '</div><!-- /.modal -->'+
    '<!-- Fin Duplique Favorit Profil Modal declaration !-->'+
      '<!-- Edit modal declaration !-->'+
    '<div class="modal fade" id="editModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false"  >'+
      '<div class="modal-dialog adjustPadding" id="edit-Modal" >'+
        '<div class="modal-content" >'+
          '<div class="modal-header">'+
            '<button type="button" class="close" ng-click="afficherProfilsClear()" data-dismiss="modal" aria-hidden="true">&times;</button>'+
            '<h4 class="modal-title" id="myModalLabel" translate>Modifier le profil</h4>'+
          '</div>'+
          '<div ng-show="affichage" class="msg_error">'+
            '<ul ng-repeat="error in addFieldError">'+
              '<li>Le champ <strong>{{error}}</strong> est invalide</li>'+
            '</ul>'+
          '</div>'+
          '<div class="modal-body adjust-modal-body">'+
            '<div class="row-fluid span6" ng-form="editionFormValidation">'+
              '<form class="form-horizontal" role="form" id="editProfile" name="editProfile" novalidate>'+
                '<fieldset>'+
                  '<h5>Information liées au profil <span>(obligatoire)</span></h5>'+
                  '<p class="controls_zone pull-left">'+
                  '<label for="nom" class=""><span translate>Nom</span> <span class="required">*</span></label>'+
                  '<input type="text" class="" ng-model="profMod.nom" value="profMod.nom" required>'+
                  '</p>'+
                  '<p class="controls_zone pull-right">'+
                  '<label for="descriptif" class=""><span translate>Descriptif</span> <span class="required">*</span></label>'+
                  '<input type="text" class="" ng-model="profMod.descriptif" value="profMod.descriptif" placeholder="Entrez le descriptif" required>'+
                  '</p>'+
                '</fieldset>'+
                '<fieldset class="noblackBorder">'+
                  '<h5>Paramètres principaux du profil</h5>'+
                  '<div class="regles_area">'+
                    '<div class="regles-head_area">'+
                      '<p class="controls_zone">'+
                      '<label for="tag" class=""><span translate>Regles</span> <span class="required">*</span></label>'+
                      '<select sselect id="selectId" class="" ng-model="editTag" required>'+
                        '<option ng-repeat="tag in listTags" value="{{tag}}" ng-disabled="affectDisabled(tag.disabled)">{{tag.libelle}}</option>'+
                      '</select>'+
                      '</p>'+
                      '<div ng-hide="hideVar" class="blocker">&nbsp;</div>'+
                    '</div>'+
                    '<div class="regles-body_area">'+
                      '<div class="pull-left">'+
                        '<p class="controls_zone">'+
                        '<label  for="police" class="" translate>Police</label>'+
                        '<select sselect class="" ng-model="policeList" ng-change="editStyleChange(\'police\', policeList)" required>'+
                          '<option ng-repeat="police in policeLists" value="{{police}}" > {{police}}</option>'+
                        '</select>'+
                        '</p>'+
                        '<p class="controls_zone">'+
                        '<label  for="taille" class="" translate>Taille</label>'+
                        '<select sselect class="" ng-model="tailleList" ng-change="editStyleChange(\'taille\', tailleList)" required>'+
                          '<option ng-repeat="taille in tailleLists" value="{{taille.number}}">{{taille.number}}</option>'+
                        '</select>'+
                        '</p>'+
                        '<p class="controls_zone">'+
                        '<label  for="tag" class=""><span translate>Interligne</span></label>'+
                        '<select sselect class="" ng-model="interligneList" ng-change="editStyleChange(\'interligne\', interligneList)" required>'+
                          '<option ng-repeat="interligne in interligneLists" value="{{interligne.number}}">{{interligne.number}}</option>'+
                        '</select>'+
                        '</p>'+
                        '<p class="controls_zone">'+
                        '<label for="coloration" class=""><span translate>Coloration</span> </label>'+
                        '<select sselect class="" ng-model="colorList" ng-change="editStyleChange(\'coloration\',colorList)" required >'+
                          '<option ng-repeat="color in colorLists" value="{{color}}">{{color}}</option>'+
                        '</select>'+
                        '</p>'+
                        '<p class="controls_zone">'+
                        '<label for="tag" class=""><span translate>Style</span></label>'+
                        '<select sselect class="" ng-model="weightList" ng-change="editStyleChange(\'style\',weightList)" required>'+
                          '<option ng-repeat="weight in weightLists" value="{{weight}}">{{weight}}</option>'+
                        '</select>'+
                        '</p>'+
                      '</div>'+
                      '<div class="pull-right">'+
                        '<div class="show_zone">'+
                          '<p class="text-center shown-text-edit" id="style-affected-edit" data-font="{{policeList}}" data-size="{{tailleList}}" data-lineheight="{{interligneList}}" data-weight="{{weightList}}" data-coloration="{{colorList}}" regle-style="displayText">'+
                          '</p>'+
                        '</div>'+
                        '<div class="regles_exists editing_tag">'+
                          '<ul>'+
                            '<li ng-repeat="var in tagStyles">'+
                              '<span id="{{var._id}}" class="{{label_action}}">{{var.tagLibelle}} <span translate>modifie</span></span>'+
                              '<a class="set_tag" href="" title="{{\'EditTag\' | translate}}" ng-click="editionModifierTag(var)">&nbsp;</a>'+
                              '<a class="delete_tag" href="" title="{{\'DeleteTag\' | translate}}" ng-click="editionSupprimerTag(var)">&nbsp;</a>'+
                            '</li>'+
                          '</ul>'+
                        '</div>'+
                      '</div>'+
                    '</div>'+
                    '<p class="validation_regles">'+
                    '<button type="button" id="editValidationButton" class="btn_simple light_blue" ng-click="beforeValidationModif()" translate title="{{\'validerLaRegle\' | translate}}" >validerLaRegle</button>'+
                    '</p>'+
                  '</div>'+
                '</fieldset>'+
                '<div class="centering" id="ProfileButtons">'+
                  '<button type="button" class="reset_btn" ng-click="afficherProfilsClear()" data-dismiss="modal" translate title="{{\'Annuler\' | translate}}" >Annuler</button>'+
                  '<button type="button" class="btn_simple light_blue editionProfil" ng-click="modifierProfil()" ng-disabled="checkStyleTag()" translate title="{{\'Enregistrer le profil\' | translate}}">Enregistrer le profil</button>'+
                '</div>'+
              '</form>'+
            '</div>'+
          '</div>'+
        '</div>'+
        '<!-- /.modal-content -->'+
        '</div><!-- /.modal-dialog -->'+
        '</div><!-- /.modal -->'+
'</div>'+
'<div class="fixed_loader" ng-show="loader">'+
  '<div class="loadre_container">'+
    '<!-- <p class="loader_txt">{{loaderMsg}}</p> -->'+
  '</div>'+
'</div>';