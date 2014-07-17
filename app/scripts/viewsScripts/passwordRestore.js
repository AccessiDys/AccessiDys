var passwordRestoreHTML='<!-- Header -->'+
'<!-- End Header -->'+
	'<div  data-ng-init=\'init()\' document-methodes="">'+
		'<div id="loginbox_second" class="mainbox animated fadeInUp">'+
		'<h2><span>Mot de passe oublié ? </span><br><span class="blue-subtitle">Veuillez saisir un nouveau mot de passe pour votre compte.</span></h2>'+
			'<div class="form_container" >'+
			'<div style="display:none" id="login-alert" class="alert alert-danger "></div>'+
				'<form id="restorePasswordForm" class="" role="form">'+
				'<div ng-show=\'failRestore\' class="alert alert-danger animated fadeInDown">{{erreurMessage}}</div>'+
					'<fieldset submit-scope>'+
					'<p class="control_group">'+
					'<label class="" for="pwd_etap-one" id="label_pwd_etap-one">Mot de passe</label>'+
					'<input id="pwd_etap-one" name="pwd_etap-one" ng-model="password" type="password" class="" placeholder="6 à 20 caractères">'+
					'</p>'+
					'<p class="control_group last">'+
					'<label class="two_lignes" for="comfpsw_etap-one" id="label_comfpsw_etap-one">Confirmer le mot de passe</label>'+
					'<input id="comfpsw_etap-one" name="comfpsw_etap-one" ng-model="passwordConfirmation" type="password" class="" placeholder="Confirmation du mot de passe">'+
						'<div class="controls">'+
						'<button type="submit" data-submit-target ng-click=\'restorePassword()\' class="btn_simple blue pull-right" title="Envoyer">envoyer</button>'+
					'</div>'+
				'</fieldset>'+
			'</form>'+
		'</div>'+
	'</div>'+
		'<div class="modal fade in" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
			'<div class="modal-dialog bigger">'+
				'<div class="modal-content">'+
					'<div class="modal-header">'+
					'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
					'<h4 class="modal-title light_bluehead" id="myModalLabel">Informations</h4>'+
				'</div>'+
					'<div class="modal-body adjust-modal-body">'+
					'<p class="modal_content-text">'+
					'Votre nouveau mot de passe a été enregistré. Vous allez être redirigé vers la page d\'accueil.'+
					'</p>'+
				'</div>'+
					'<div class="centering">'+
					'<button type="button" class="btn_simple light_blue much_padding" data-dismiss="modal" title="OK">OK</button>'+
				'</div>'+
			'</div>'+
		'</div>'+
	'</div>'+
'<div class="modal fade in" id="myModalPasswordRestore" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
		'<div class="modal-dialog bigger">'+
			'<div class="modal-content">'+
				'<div class="modal-header">'+
				'<h4 class="modal-title light_bluehead" id="myModalLabel">Informations</h4>'+
			'</div>'+
				'<div class="modal-body adjust-modal-body">'+
				'<p class="modal_content-text">'+
				'Cette clé de réinitialisation a expiré ou n\'est pas valide.'+
				'</p>'+
			'</div>'+
				'<div class="centering">'+
				'<button type="button" class="btn_simple light_blue much_padding" data-dismiss="modal" title="OK">OK</button>'+
			'</div>'+
		'</div>'+
	'</div>'+
'</div>'+
'</div>';