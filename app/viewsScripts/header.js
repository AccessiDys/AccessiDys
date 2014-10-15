var headerHTML = '<div data-ng-controller="CommonCtrl" class="header wrapper_zone">'+
	'<ul class="main_menu" data-ng-init=\'initCommon()\'>'+
		'<li class="logo">'+
			'<a href="{{logoRedirection}}" class="text-muted" title="CNED">'+
			'<img src="{{logoUrl}}" alt="CNED">'+
			'</a>'+
		'</li>'+
		'<li class="last_document">'+
			'<a href="{{lastDoc}}" bindonce bo-show="showLastDocument()">'+
			'<span>'+
			'<img src="{{docUrl}}" alt="dérnier document ouve" />'+
			'</span>'+
			'<center>{{lastDocTitre}}</center>'+
			'</a>'+
		'</li>'+
		'<li class="current_profile">'+
			'<div data-ng-show="menueShowOffline">'+
				'<label>Profil actuel</label>'+
				'<select sselect id="headerSelect" data-ng-model="profilActuel" data-ng-change="changeProfilActuel()" required>'+
					'<option bindonce data-ng-repeat="profil in listeProfilsParUser" ng-if="profil.type == \'profile\'" bo-value="profil">{{profil.nom}}</option>'+
				'</select>'+
			'</div>'+
		'</li>'+
		'<li class="actions_menu">'+
			'<a class="menu_zone" href="" title="Menu" data-ng-click=\'showMenu()\'>Menu</a>'+
			'<ul data-ng-show=\'showMenuParam\' class="drob_down" >'+
				'<li data-ng-show=\'admin\' class="regles"><a href="{{tagLink}}" id="regles_submenu" title="Règles" translate data-ng-click="showMenuParam=false;changeStatus($event)">Règles</a></li>'+
				'<li data-ng-show=\'menueShow\'  class="my_profils"><a href="{{profilLink}}" id="profiles_submenu" title="Mes profils" translate data-ng-click="showMenuParam=false;changeStatus($event)">Profils</a></li>'+
				'<li data-ng-show=\'menueShowOffline\' class="my_docs"><a href="{{listDocumentDropBox}}" id="documents_submenu" title="Mes documents" translate data-ng-click="showMenuParam=false;changeStatus($event)">Documents</a></li>'+
				'<li data-ng-show=\'menueShow\' class="my_account"><a href="{{userAccountLink}}" id="account_submenu" title="Mon compte" translate data-ng-click="showMenuParam=false;changeStatus($event)">monCompte</a></li>'+
				'<li data-ng-show=\'admin\' class="managment"><a href="{{adminLink}}" id="administration_submenu" title="Administration" translate data-ng-click="showMenuParam=false;changeStatus($event)">Administration</a></li>'+
				'<li data-ng-show=\'menueShow\' class="bookmarklet"><a href="" title="bookmarklet" id="bookmarklet_submenu" translate data-ng-click="bookmarkletPopin()">bookmarklet</a></li>'+
				'<li data-ng-show=\'logout\' class="signout" id=\'HideIfOffLine\'><a href="" id="logout_submenu" title="Se deconnecter" translate data-ng-click="logoutFonction()">SeDeconnecter</a></li>'+
				'<li class="langue">'+
					'<select sselect data-ng-model="langue" data-ng-change=\'changerLangue()\' data-ng-options="c.name for c in languages" class="select-language"></select><br>'+
				'</li>'+
			'</ul>'+
		'</li>'+
	'</ul>'+
'<div class="modal fade animated fadeIn" id="bookmarkletGenerator" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false" >'+
	'<div class="modal-dialog" id="bookmarkletGenerator2">'+
		'<div class="modal-content">'+
			'<div class="modal-header">'+
				'<button type="button" class="close" data-ng-click="" data-dismiss="modal" aria-hidden="true">&times;</button>'+
				'<h3 class="modal-title" id="myModalLabel">Votre Bookmarklet</h3>'+
			'</div>'+
			'<div class="modal-body adjust-modal-body">'+
				'<div class="box">'+
					'<div>'+
						'<div class="info_txt">'+
							'<p class="text_left">'+
							'Glissez le bouton CnedAdapt sur la barre de favoris de votre navigateur (située en haut de l’écran) afin de faciliter …lancer automatiquement l’affichage adapté de vos documents'+
							'</p>'+
							'<div class="drag_btn">'+
								'<div class="bookmarklet_contaioner">'+
									'<p class="bookmarklet_btn">'+
									'<a href="javascript:(function(){window.location.href={{userDropBoxLink}}})();" class=\'grey_btn normal_padding normal_case\'>CnedAdapt</a>'+
									'</p>'+
									'<p class="">'+
									'<img src="{{bookmarklet_howto}}" alt="" />'+
									'</p>'+
								'</div>'+
							'</div>'+
						'</div>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<!-- /.modal-content -->'+
		'</div>'+
		'<!-- /.modal-dialog -->'+
		'</div><!-- /.modal -->'+
	'</div>'+
'</div>';