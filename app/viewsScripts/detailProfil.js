var detailProfilHTML = '<h1 id=\'detailProfil\' class=\'dark_green animated fadeInLeft\' translate>detailsProfil</h1>'+
'<div class="container" id="global_container">'+
'<div document-methodes="" class="profile_details" data-ng-init="initDetailProfil()" body-classes="" class="doc-General">'+
'<div>'+
  '<div class="msg_succes" id="okEmail" style="display:none;">'+
      'Email envoyé avec succès !'+
  '</div>'+
  '<div class="msg_succes" id="favoris" style="display:none;">'+
      'Profil ajouté aux profils favoris !'+
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
    '<p ng-style="r.profStyle"  data-ng-repeat="r in regles" regle-style="r.texte"></p>'+
  '</div>'+
'</div>'+
'<div class="detail-profil-actions">'+
  '<button type="button" class="btn_simple light_blue duplicate-btn" data-ng-click="preDupliquerProfilFavorit(detailProfil)" data-ng-show=\'showDupliquer\' data-toggle="modal" data-target="#dupliqueModal" title="{{\'Dupliquer le profil\' | translate}}" >Dupliquer</button>'+
  '<button type="button" class="btn_simple light_blue edit-btn" data-toggle="modal" data-target="#editModal" data-ng-click="preModifierProfil(detailProfil)" data-ng-show=\'showEditer\' title="{{\'Modifier le profil\' | translate}}">Modifier le profil</button>'+
  '<button type="button" class="btn_simple light_blue share-btn" data-toggle="modal" data-target="#shareModal" data-ng-click="detailsProfilApartager()" data-ng-show=\'showPartager\' title="{{\'Partager le profil\' | translate}}">Partager le profil</button>'+
  '<button type="button" class="btn_simple light_blue favourite-btn" data-ng-click="ajouterAmesFavoris()" data-ng-show=\'showFavouri\' title="Ajouter à mes favoris">Ajouter à mes favoris</button>'+
  '<button type="button" class="btn_simple light_blue accepte-delegate" data-ng-click="deleguerUserProfil()" data-ng-show=\'showDeleguer\' title="{{\'AccepterDemandeDelegation\' | translate}}">Accepter la demande de délégation</button>'+
'</div>'+
  '<div class="modal fade" id="shareModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">'+
    '<div class="modal-dialog">'+
      '<div class="modal-content">'+
        '<div class="modal-header">'+
          '<button type="button" class="close" data-ng-click="clearSocialShare()"  data-dismiss="modal" aria-hidden="true">&times;</button>'+
          '<h4 class="modal-title" id="myModalLabel">Partager ce profil</h4>'+
        '</div>'+
        '<div class="modal-body">'+
          '<h2><span>Sélectionner un moyen pour partager ce profil</span></h2>'+
          '<div class="msg_error" id="erreurEmail" style="display:none;">'+
            'Email incorrect !'+
          '</div>'+
          '<p class="centering share_btn_container">'+
            '<a href="" class="share_btn mail_share" data-ng-click="loadMail()" title="Email" id="profileSecond_share"></a>'+
            '<a class="share_link share_btn fb_share" href="https://www.facebook.com/sharer/sharer.php?u={{envoiUrl}}&t=CnedAdapt"'+
              'onclick="javascript:window.open(this.href, \'\', \'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600\');return false;" target="_blank" title="Partager sur Facebook">'+
            '</a>'+
            '<a class="share_link share_btn twitter_share" href="https://twitter.com/share?url={{envoiUrl}}&via=CnedAdapt&text=Lien CnedAdapt"'+
              'onclick="javascript:window.open(this.href, \'\', \'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600\');return false;" target="_blank" title="Partager sur Twitter">'+
            '</a>'+
            '<a class="share_link share_btn gplus_share" href="https://plus.google.com/share?url={{envoiUrl}}"'+
              'onclick="javascript:window.open(this.href, \'\', \'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=350,width=480\');return false;" target="_blank" title="Partager sur Google+">'+
            '</a>'+
          '</p>'+
          '<div class="control_group" data-ng-show="displayDestination">'+
            '<h2>adresse email <br><span>Saisissez l’adresse email du destinataire</span></h2>'+
            '<p class="mail_area">'+
              '<label for="destinataire" class="email" id="label_email_etap-one">Email</label>'+
              '<input type="email" class="" data-ng-model="destinataire" id="destinataire" placeholder="" />'+
            '</p>'+
          '</div>'+
          '<div class="centering" id="ProfileButtons">'+
            '<button id="reset_shareProfile" type="button" class="reset_btn" data-ng-click="clearSocialShare()" data-dismiss="modal" title="{{\'Annuler\' | translate}}" >Annuler</button>'+
            '<button id="shareProfile" type="button" class="btn_simple light_blue" data-ng-show="displayDestination" data-ng-click="socialShare()" title="{{\'Partager\' | translate}}">Partager</button>'+
          '</div>'+
        '</div>'+
      '</div>'+
    '</div>'+
  '</div>'+
'<div class="modal fade" id="confirmModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false" >'+
  '<div class="modal-dialog" id="modalContent">'+
    '<div class="modal-content">'+
      '<div class="modal-header">'+
      '<button type="button" class="close" data-ng-click="" data-dismiss="modal" aria-hidden="true">&times;</button>'+
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
        '<button type="button" data-ng-click=\'dismissConfirm()\' class="reset_btn" data-ng-click="" data-dismiss="modal" title="Annuler">Annuler</button>'+
        '<button type="button" class="btn_simple light_blue" data-ng-click=\'sendMail()\' title="Envoyer">Envoyer</button>'+
      '</div>'+
    '<!-- /.modal-content -->'+
  '</div>'+
  '<!-- /.modal-dialog -->'+
  '</div><!-- /.modal -->'+
'</div>'+
'<!-- Duplique Favorit Profil Modal declaration !-->'+
'<div class="modal fade" id="dupliqueModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false"  >'+
  '<div class="modal-dialog adjustPadding profile_popins" id="edit-Modal" >'+
    '<div class="modal-content" >'+
      '<div class="modal-header">'+
        '<button type="button" class="close" data-ng-click="afficherProfilsClear()" data-dismiss="modal" aria-hidden="true">&times;</button>'+
        '<h4 class="modal-title" id="myModalLabel" translate>Dupliquer le profil</h4>'+
      '</div>'+
      '<div data-ng-show="affichage" class="msg_error">'+
        '<ul data-ng-repeat="error in addFieldError">'+
          '<li>Le champ <strong>{{error}}</strong> est invalide</li>'+
        '</ul>'+
      '</div>'+
        '<ul data-ng-show="erreurAfficher" class="msg_error">'+
          '<li>Vous devez saisir au moins une <strong>Règle</strong> de style </li>'+
        '</ul>'+
      '<div class="modal-body adjust-modal-body">'+
        '<div class="row-fluid span6" data-ng-form="editionFormValidation">'+
          '<form class="form-horizontal" role="form" id="editProfile" name="editProfile" novalidate>'+
            '<fieldset>'+
              '<span class="group_title">Information liées au profil <span>(obligatoire)</span></span>'+
              '<p class="controls_zone pull-left">'+
              '<label for="nom" class=""><span translate>Nom</span> <span class="required"> *</span></label>'+
              '<input type="text" class="" data-ng-model="profMod.nom" value="profMod.nom" required>'+
              '</p>'+
              '<p class="controls_zone pull-right">'+
              '<label for="descriptif" class=""><span translate>Descriptif</span> <span class="required"> *</span></label>'+
              '<input type="text" class="" data-ng-model="profMod.descriptif" value="profMod.descriptif" placeholder="Entrez le descriptif" required>'+
              '</p>'+
            '</fieldset>'+
            '<fieldset>'+
              '<span class="group_title">Paramètres principaux du profil</span>'+
              '<div class="regles_area">'+
                '<div class="regles-head_area">'+
                  '<p class="controls_zone">'+
                  '<label for="tag" class=""><span translate>Regles</span> <span class="required"> *</span></label>'+
                  '<select sselect id="selectId" class="" data-ng-model="editTag" required>'+
                    '<option data-ng-repeat="tag in listTags" value="{{tag}}" data-ng-disabled="affectDisabled(tag.disabled)">{{tag.libelle}}</option>'+
                  '</select>'+
                  '</p>'+
                  '<div data-ng-hide="hideVar" class="blocker">&nbsp;</div>'+
                '</div>'+
                '<div class="regles-body_area">'+
                  '<div class="pull-left">'+
                    '<p class="controls_zone">'+
                    '<label  for="police" class=""><span translate>Police </span><span class="required"> *</span></label>'+
                    '<select sselect class="" data-ng-model="policeList" data-ng-change="dupliqueStyleChange(\'police\', policeList)" required>'+
                      '<option data-ng-repeat="police in policeLists" value="{{police}}" > {{police}}</option>'+
                    '</select>'+
                    '</p>'+
                    '<p class="controls_zone">'+
                    '<label  for="taille" class="" ><span translate>Taille </span><span class="required"> *</span></label>'+
                    '<select sselect class="" data-ng-model="tailleList" data-ng-change="dupliqueStyleChange(\'taille\', tailleList)" required>'+
                      '<option data-ng-repeat="taille in tailleLists" value="{{taille.number}}">{{taille.number}}</option>'+
                    '</select>'+
                    '</p>'+
                    '<p class="controls_zone">'+
                    '<label  for="tag" class=""><span translate>Interligne </span><span class="required"> *</span></label>'+
                    '<select sselect class="" data-ng-model="interligneList" data-ng-change="dupliqueStyleChange(\'interligne\', interligneList)" required>'+
                      '<option data-ng-repeat="interligne in interligneLists" value="{{interligne.number}}">{{interligne.number}}</option>'+
                    '</select>'+
                    '</p>'+
                    '<p class="controls_zone">'+
                    '<label for="coloration" class=""><span translate>Coloration </span><span class="required"> *</span></label>'+
                    '<select sselect class="color-select" data-ng-model="colorList" data-ng-change="dupliqueStyleChange(\'coloration\',colorList)" required >'+
                      '<option data-ng-repeat="color in colorLists" value="{{color}}">{{color}}</option>'+
                    '</select>'+
                    '</p>'+
                    '<p class="controls_zone">'+
                    '<label for="tag" class=""><span translate>Graisse </span><span class="required"> *</span></label>'+
                    '<select sselect class="" data-ng-model="weightList" data-ng-change="dupliqueStyleChange(\'style\',weightList)" required>'+
                      '<option data-ng-repeat="weight in weightLists" value="{{weight}}">{{weight}}</option>'+
                    '</select>'+
                    '</p>'+
                    '<p class="controls_zone">'+
                  '<label  for="add_space" class=""><span translate>Espace entre les mots </span><span class="required"> *</span></label>'+
                  '<select sselect class="" data-ng-model="spaceSelected" data-ng-change="dupliqueStyleChange(\'space\', spaceSelected)" required name="space">'+
                    '<option data-ng-repeat="space in spaceLists" value="{{space.number}}">{{space.number}}</option>'+
                  '</select>'+
                  '</p>'+
                  '<p class="controls_zone">'+
                  '<label  for="add_spaceChar" class=""><span translate>Espace entre les caractères </span><span class="required"> *</span></label>'+
                  '<select sselect class="" data-ng-model="spaceCharSelected" data-ng-change="dupliqueStyleChange(\'spaceChar\', spaceCharSelected)" required name="space">'+
                    '<option data-ng-repeat="spaceChar in spaceCharLists" value="{{spaceChar.number}}">{{spaceChar.number}}</option>'+
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
                        '<li data-ng-repeat="var in tagStyles">'+
                          '<span id="{{var._id}}" class="{{label_action}}">{{var.tagLibelle}} <span translate>modifie</span></span>'+
                          '<a class="set_tag" href="" title="Editer le tag" data-ng-click="dupliqueModifierTag(var)">&nbsp;</a>'+
                          '<a class="delete_tag" href="" title="Supprimer le tag" data-ng-click="editionSupprimerTag(var)">&nbsp;</a>'+
                        '</li>'+
                      '</ul>'+
                    '</div>'+
                  '</div>'+
                '</div>'+
                '<p class="validation_regles">'+
                '<button type="button" id="dupliqueValidationButton" class="btn_simple light_blue" data-ng-click="beforeValidationModif()" translate title="Valider la règle">validerLaRegle</button>'+
                '</p>'+
              '</div>'+
            '</fieldset>'+
            '<div class="centering" id="ProfileButtons">'+
              '<button type="button" class="reset_btn" data-ng-click="afficherProfilsClear()" data-dismiss="modal" translate title="Annuler">Annuler</button>'+
              '<button type="button" class="btn_simple light_blue dupliqueProfil" data-ng-click="dupliquerFavoritProfil()" data-ng-disabled="checkStyleTag()" translate title="Enregistrer le profil">Enregistrer le profil</button>'+
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
      '<div class="modal-dialog adjustPadding profile_popins" id="edit-Modal" >'+
        '<div class="modal-content" >'+
          '<div class="modal-header">'+
            '<button type="button" class="close" data-ng-click="afficherProfilsClear()" data-dismiss="modal" aria-hidden="true">&times;</button>'+
            '<h4 class="modal-title" id="myModalLabel" translate>Modifier le profil</h4>'+
          '</div>'+
          '<div data-ng-show="affichage" class="msg_error">'+
            '<ul data-ng-repeat="error in addFieldError">'+
              '<li>Le champ <strong>{{error}}</strong> est invalide</li>'+
            '</ul>'+
          '</div>'+
          '<ul data-ng-show="erreurAfficher" class="msg_error">'+
            '<li>Vous devez saisir au moins une <strong>Règle</strong> de style </li>'+
          '</ul>'+
          '<div class="modal-body adjust-modal-body">'+
            '<div class="row-fluid span6" data-ng-form="editionFormValidation">'+
              '<form class="form-horizontal" role="form" id="editProfile" name="editProfile" novalidate>'+
                '<fieldset>'+
                  '<span class="group_title">Information liées au profil <span>(obligatoire)</span></span>'+
                  '<p class="controls_zone pull-left">'+
                  '<label for="nom" class=""><span translate>Nom</span> <span class="required"> *</span></label>'+
                  '<input type="text" class="" data-ng-model="profMod.nom" value="profMod.nom" required>'+
                  '</p>'+
                  '<p class="controls_zone pull-right">'+
                  '<label for="descriptif" class=""><span translate>Descriptif</span> <span class="required"> *</span></label>'+
                  '<input type="text" class="" data-ng-model="profMod.descriptif" value="profMod.descriptif" placeholder="Entrez le descriptif" required>'+
                  '</p>'+
                '</fieldset>'+
                '<fieldset class="noblackBorder">'+
                  '<span class="group_title">Paramètres principaux du profil</span>'+
                  '<div class="regles_area">'+
                    '<div class="regles-head_area">'+
                      '<p class="controls_zone">'+
                      '<label for="tag" class=""><span translate>Regles</span> <span class="required"> *</span></label>'+
                      '<select sselect id="selectId" class="" data-ng-model="editTag" required>'+
                        '<option data-ng-repeat="tag in listTags" value="{{tag}}" data-ng-disabled="affectDisabled(tag.disabled)">{{tag.libelle}}</option>'+
                      '</select>'+
                      '</p>'+
                      '<div data-ng-hide="hideVar" class="blocker">&nbsp;</div>'+
                    '</div>'+
                    '<div class="regles-body_area">'+
                      '<div class="pull-left">'+
                        '<p class="controls_zone">'+
                        '<label  for="police" class=""><span translate>Police </span><span class="required"> *</span></label>'+
                        '<select sselect class="" data-ng-model="policeList" data-ng-change="editStyleChange(\'police\', policeList)" required>'+
                          '<option data-ng-repeat="police in policeLists" value="{{police}}" > {{police}}</option>'+
                        '</select>'+
                        '</p>'+
                        '<p class="controls_zone">'+
                        '<label  for="taille" class="" ><span translate>Taille </span><span class="required"> *</span></label>'+
                        '<select sselect class="" data-ng-model="tailleList" data-ng-change="editStyleChange(\'taille\', tailleList)" required>'+
                          '<option data-ng-repeat="taille in tailleLists" value="{{taille.number}}">{{taille.number}}</option>'+
                        '</select>'+
                        '</p>'+
                        '<p class="controls_zone">'+
                        '<label  for="tag" class=""><span translate>Interligne </span><span class="required"> *</span></label>'+
                        '<select sselect class="" data-ng-model="interligneList" data-ng-change="editStyleChange(\'interligne\', interligneList)" required>'+
                          '<option data-ng-repeat="interligne in interligneLists" value="{{interligne.number}}">{{interligne.number}}</option>'+
                        '</select>'+
                        '</p>'+
                        '<p class="controls_zone">'+
                        '<label for="coloration" class=""><span translate>Coloration </span> <span class="required"> *</span> </label>'+
                        '<select sselect class="color-select" data-ng-model="colorList" data-ng-change="editStyleChange(\'coloration\',colorList)" required >'+
                          '<option data-ng-repeat="color in colorLists" value="{{color}}">{{color}}</option>'+
                        '</select>'+
                        '</p>'+
                        '<p class="controls_zone">'+
                        '<label for="tag" class=""><span translate>Graisse </span><span class="required"> *</span></label>'+
                        '<select sselect class="" data-ng-model="weightList" data-ng-change="editStyleChange(\'style\',weightList)" required>'+
                          '<option data-ng-repeat="weight in weightLists" value="{{weight}}">{{weight}}</option>'+
                        '</select>'+
                        '</p>'+
                        '<p class="controls_zone">'+
                        '<label  for="add_space" class=""><span translate>Espace entre les mots </span><span class="required"> *</span></label>'+
                        '<select id="add_space" sselect class="" data-ng-model="spaceSelected" data-ng-change="editStyleChange(\'space\', spaceSelected)" required name="space">'+
                          '<option data-ng-repeat="space in spaceLists" value="{{space.number}}">{{space.number}}</option>'+
                        '</select>'+
                        '</p>'+
                        '<p class="controls_zone">'+
                        '<label  for="add_spaceChar" class=""><span translate>Espace entre les caractères </span><span class="required"> *</span></label>'+
                        '<select id="add_spaceChar" sselect class="" data-ng-model="spaceCharSelected" data-ng-change="editStyleChange(\'spaceChar\', spaceSelected)" required name="space">'+
                          '<option data-ng-repeat="spaceChar in spaceCharLists" value="{{spaceChar.number}}">{{spaceChar.number}}</option>'+
                        '</select>'+
                        '</p>'+
                      '</div>'+
                      '<div class="pull-right">'+
                        '<div class="show_zone">'+
                          '<p class="text-center shown-text-edit" id="style-affected-edit-duplique" data-font="{{policeList}}" data-size="{{tailleList}}" data-lineheight="{{interligneList}}" data-weight="{{weightList}}" data-coloration="{{colorList}}" regle-style="displayText">'+
                          '</p>'+
                        '</div>'+
                        '<div class="regles_exists editing_tag">'+
                          '<ul>'+
                            '<li data-ng-repeat="var in tagStyles">'+
                              '<span id="{{var._id}}" class="{{label_action}}">{{var.tagLibelle}} <span translate>modifie</span></span>'+
                              '<a class="set_tag" href="" title="{{\'EditTag\' | translate}}" data-ng-click="editionModifierTag(var)">&nbsp;</a>'+
                              '<a class="delete_tag" href="" title="{{\'DeleteTag\' | translate}}" data-ng-click="editionSupprimerTag(var)">&nbsp;</a>'+
                            '</li>'+
                          '</ul>'+
                        '</div>'+
                      '</div>'+
                    '</div>'+
                    '<p class="validation_regles">'+
                    '<button type="button" id="editValidationButton" class="btn_simple light_blue" data-ng-click="beforeValidationModif()" translate title="{{\'validerLaRegle\' | translate}}" >validerLaRegle</button>'+
                    '</p>'+
                  '</div>'+
                '</fieldset>'+
                '<div class="centering" id="ProfileButtons">'+
                  '<button type="button" class="reset_btn" data-ng-click="afficherProfilsClear()" data-dismiss="modal" translate title="{{\'Annuler\' | translate}}" >Annuler</button>'+
                  '<button type="button" class="btn_simple light_blue editionProfil" data-ng-click="modifierProfil()" data-ng-disabled="checkStyleTag()" translate title="{{\'Enregistrer le profil\' | translate}}">Enregistrer le profil</button>'+
                '</div>'+
              '</form>'+
            '</div>'+
          '</div>'+
        '</div>'+
        '<!-- /.modal-content -->'+
        '</div><!-- /.modal-dialog -->'+
        '</div><!-- /.modal -->'+
'</div>'+
'<div class="fixed_loader" data-ng-show="loader">'+
  '<div class="loadre_container">'+
    '<!-- <p class="loader_txt">{{loaderMsg}}</p> -->'+
  '</div>'+
'</div></div>';
