var imagesHTML = '<div class="header_area">'+
		'<h1 id=\'titreDocument\' class=\'dark_green animated fadeInLeft pull-left\' translate>Document</h1>'+
		'<div id="submit_document" data-ng-show=\'showWorkspaceAction\' class="submit_document pull-right">'+
			'<button id="save_document" data-ng-disabled=\'permitSaveblocks()\' data-toggle="modal" data-target="#actions-workspace" type="button" class="doc_save btn_simple light_blue pull-left">enregistrer</button>'+
            '<button type="button" data-ng-click=\'resiseWorkspace($event)\' class="doc_resizing pull-left">&nbsp;</button>'+
        '</div>'+
    '</div>'+
'<div class="container workspace_area" id="global_container">'+
'<div id=\'imagePage\'  document-methodes="">'+
	'<div class="row marketing workspace_wrapper" id=\'imagePageHidden\' style=\'display: none\' data-ng-init=\'initImage()\'>'+
		'<div class="parent-container-images">'+
			'<div class="workspace_tools text_setting" id="text_setting">'+
				'<button id="edit_text" data-ng-click="modifierTexte()"  type="button" class="set_txtbtn btn_simple light_blue pull-left with_icnleft" title="{{\'Editer le texte\' | translate}}" >editer le texte</button>'+
				'<button data-ng-show="(currentImage.source===undefined)" data-ng-click="duplicateBlock2()" type="button" class="duplicate_txtbtn btn_simple light_blue pull-left with_icnleft" title="{{\'Dupliquer le bloc\' | translate}}">Dupliquer le bloc</button>'+
				'<button data-ng-click="remove2()"  type="button" class="delete_txtbtn btn_simple light_blue pull-left with_icnleft" title="{{\'Supprimer le bloc\' | translate}}">Supprimer le bloc</button>'+
			'</div>'+
			'<div class="workspace_tools audio_synth" id="audio_synth">'+
				'<p class="controls_zone pull-left">'+
				'<label for="type_text" class="">Type de texte</label>'+
				'<select sselect class="" id="select-tag" data-ng-init="tagSelected = listTags[0]" data-ng-model="tagSelected" data-ng-change="updateBlockType()">'+
					'<option data-ng-repeat="tag in listTags" value="{{tag._id}}">{{tag.libelle}}</option>'+
				'</select>'+
				'</p>'+
				'<ul class="audio_player-zone pull-left audio_reader" data-ng-show="showSynthese">'+
					'<li>'+
						'<label>Synthèse vocale'+
						'</label>'+
					'</li>'+
					'<li>'+
						'<button data-ng-click="textToSpeech()" type="button" class="btn_simple light_blue generate_vocale">génerer</button>'+
					'</li>'+
					'<li>'+
						'<button type="button" class="btn_simple light_blue play_vocale" data-ng-click="playSong()">&nbsp;</button>'+
						'<audio id="player" src="" preload="auto"></audio>'+
					'</li>'+
				'</ul>'+
				'<button type="button" class="btn_simple light_blue pull-right" data-ng-click="textToSpeech()" data-ng-show="!showSynthese" title="{{\'synthese vocale\' | translate}}" >synthèse vocale</button>'+
			'</div>'+
			'<div class="images-container">'+
				'<span data-ng-show="currentImage.text && !showEditor">'+
					'<div dynamic="currentImage.text"></div>'+
				'</span>'+
				'<div data-ng-show="showEditor" class="text-oceriser">'+
					'<textarea ck-editor data-ng-model="textes.text" id="editorOcr" data-barre="OcrVersion" data-ng-change ="initCkEditorChange()"></textarea>'+
				'</div>'+
				'<span data-ng-show="currentImage.source || currentImage.original">'+
					'<div class="zones" data-ng-repeat="zone in zones">'+
						'<div style="width:{{zone.w}}px;height:{{zone.h}}px;top:{{zone.y}}px;left:{{zone.x}}px;">'+
							'<button data-ng-click="removeZone(zone._id)"  class="label label-default">'+
							'<span class="glyphicon glyphicon-remove-circle"></span>'+
							'</button>'+
						'</div>'+
					'</div>'+
					'<img-cropped src=\'{{currentImage.source}}\' selected=\'selected(cords)\' class="img-crop" style=\'background-color: white;width: 50%;\'/>'+
				'</span>'+
			'</div>'+
		'</div>'+
		'<div class="tree-images" style="float:left;">'+
				'<ol ui-nested-sortable="{'+
				'listType: \'ol\','+
				'items: \'li\','+
				'doNotClear: true,'+
				'placeholder: \'ui-state-highlight\','+
				'forcePlaceholderSize: true,'+
				'toleranceElement: \'> div\''+
				'}" ui-nested-sortable-stop="updateDragDrop($event, $ui)">'+
				'<li ez-tree="child in blocks.children at ol" data-ng-class="{minimized:child.minimized}" >'+
					'<div class="layer_container" data-ng-click="setActive($event)" >'+
						'<span class="image_container">'+
							'<button class="toggle" data-ng-click="toggleMinimized(child)" data-ng-switch on="child.minimized">'+
								'<span data-ng-show="child.children.length>0" data-ng-switch-when="true" class="tree_closed">'+
								'</span>'+
								'<span data-ng-show="child.children.length>0" data-ng-switch-default class="tree_opened">'+
								'</span>'+
							'</button>'+
							'<button class="delete_layer" data-ng-click="remove(child)" title="{{\'Supprimer calque\' | translate}}" >&nbsp;</button>'+
							'<img class="cut_piece"  data-ng-click="workspace(child, $event)" data-ng-show="(child.source!==undefined)" data-ng-src="{{child.originalSource || child.source}}" width="142px" alt=""/>'+
							'<span data-ng-show="(child.source===undefined)" data-ng-click="workspace(child,$event)" style="width:142px;height:50px;background-color:white;display: inline-block;" dynamic="child.text | showText:30:true" class="cut_piece" ></span>'+
							'<button data-ng-show="(child.source===undefined)" class="duplicate_layer" data-ng-click="duplicateBlock(child)" title="{{\'Dupliquer calque\' | translate}}" >&nbsp;</button>'+
						'</span>'+
						'<span class="options_label">'+
							'<span class="label_txt" data-ng-show="ocerised(child.text)" title="{{\'Type de calque\' | translate}}">&nbsp;</span>'+
							'<span class="label_vocal" data-ng-show="vocalised(child.synthese)" title="{{\'Dupliquer calque\' | translate}}">&nbsp;</span>'+
							'<span data-ng-show="getPictoTag(child)" class="label_type">'+
								'<img data-ng-src="{{getPictoTag(child)}}" alt="" />'+
							'</span>'+
						'</span>'+
					'</div>'+
					'<ol data-ng-class="{pregnant:child.children.length}"></ol>'+
				'</li>'+
			'</ol>'+
		'</div>'+
	'</div>'+
	'<div class="actions">'+
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
'</div>'+
'<!-- debut modal Add -->'+
'<div class="modal fade" id="actions-workspace" tabindex="-1" role="dialog" aria-labelledby="tagAddLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">'+
	'<div class="modal-dialog">'+
		'<div class="modal-content">'+
			'<div class="modal-header">'+
				'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
				'<h3 data-ng-show="!editBlocks" class="modal-title">Enregistrer document</h3>'+
				'<h3 data-ng-show="editBlocks" class="modal-title">Modifier document</h3>'+
			'</div>'+
			'<div data-ng-show="errorMsg" class="msg_error">{{msgErrorModal}}</div>'+
			'<div class="modal-body adjust-modal-body">'+
				'<form id="show_document" name="show_document" class="" role="form" style="overflow:hidden;">'+
					'<fieldset class="padding_large">'+
						'<p class="controls_zone">'+
						'<label for="docTitre" class="simple_label"><span>Titre du document</span> <span class="required">*</span></label>'+
						'<input type="text" max-length="32" data-ng-disabled="editBlocks" class="" id="docTitre" placeholder="Entrez le titre du document" data-ng-model="docTitre" required>'+
						'</p>'+
					'</fieldset>'+
					'<div class="centering" id="ProfileButtons">'+
						'<button id="reset_save_inDropbox" type="button" class="reset_btn" data-dismiss="modal" title="{{\'Annuler\' | translate}}">Annuler</button>'+
						'<button id="save_inDropbox" data-ng-show="!editBlocks" type="button" class="btn_simple light_blue" data-ng-disabled="!show_document.$valid" data-ng-click="showlocks()" data-dismiss="modal" title="{{\'Enregistrer sur ma Dropbox\' | translate}}">Enregistrer sur ma Dropbox</button>'+
						'<button id="saveEdited_inDropbox"  data-ng-show="editBlocks" type="button" class="btn_simple light_blue" data-ng-disabled="!show_document.$valid" data-ng-click="saveRestBlocks()" data-dismiss="modal" title="{{\'Modifier sur ma Dropbox\' | translate}}">Modifier sur ma Dropbox</button>'+
					'</div>'+
				'</form>'+
			'</div>'+
		'</div>'+
	'</div>'+
'</div>'+
'<!-- modal enc as derreur -->'+
'<div class="modal fade in" id="myModalWorkSpace" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
	'<div class="modal-dialog bigger">'+
		'<div class="modal-content">'+
			'<div class="modal-header">'+
				'<h3 class="modal-title light_bluehead" id="myModalLabel">lien non valide</h3>'+
			'</div>'+
			'<div class="modal-body adjust-modal-body">'+
				'<p class="modal_content-text">'+
				'Veuillez utiliser la Bookmarklet CnedAdapt avec l\'URL d\'un fichier PDF.'+
				'</p>'+
			'</div>'+
			'<div class="centering">'+
				'<button type="button" class="btn_simple light_blue much_padding" data-dismiss="modal">OK</button>'+
			'</div>'+
		'</div>'+
	'</div>'+
'</div>'+
'<div class="modal fade in" id="myModalWorkSpaceBig" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
	'<div class="modal-dialog bigger">'+
		'<div class="modal-content">'+
			'<div class="modal-header">'+
				'<h3 class="modal-title light_bluehead" id="myModalLabel">information</h3>'+
			'</div>'+
			'<div class="modal-body adjust-modal-body">'+
				'<p class="modal_content-text">'+
				'L\’application ne pourra pas traiter votre document de façon optimale en raison du poids du fichier et/ou de son contenu. Aussi, nous vous invitons à réessayer avec une autre version de votre document.'+
				'</p>'+
			'</div>'+
			'<div class="centering">'+
				'<button type="button" class="btn_simple light_blue much_padding" data-ng-click="modalError(\'myModalWorkSpaceBig\')">OK</button>'+
			'</div>'+
		'</div>'+
	'</div>'+
'</div>'+
'<div class="modal fade in" id="myModalWorkSpaceTooMany" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
	'<div class="modal-dialog bigger">'+
		'<div class="modal-content">'+
			'<div class="modal-header">'+
				'<h3 class="modal-title light_bluehead" id="myModalLabel">information</h3>'+
			'</div>'+
			'<div class="modal-body adjust-modal-body">'+
				'<p class="modal_content-text">'+
				'La taille de l\'ePub est supérieur à la taille limite supportée par l\'application.'+
				'</p>'+
			'</div>'+
			'<div class="centering">'+
				'<button type="button" class="btn_simple light_blue much_padding" data-ng-click="modalError(\'myModalWorkSpaceTooMany\')">OK</button>'+
			'</div>'+
		'</div>'+
	'</div>'+
'</div>'+
'<div class="modal fade in" id="myModalWorkSpaceRedirection" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
	'<div class="modal-dialog bigger">'+
		'<div class="modal-content">'+
			'<div class="modal-header">'+
				'<h3 class="modal-title light_bluehead" id="myModalWorkSpaceRe">INFORMATION</h3>'+
			'</div>'+
			'<div class="modal-body adjust-modal-body">'+
				'<p class="modal_content-text">'+
				'Pour structurer le document vous devez être authentifié. Veuillez-vous authentifier avant de poursuivre la structuration.'+
				'</p>'+
			'</div>'+
			'<div class="centering">'+
				'<button type="button" class="btn_simple light_blue much_padding" data-dismiss="modal">OK</button>'+
			'</div>'+
		'</div>'+
	'</div>'+
'</div>'+
'<div class="modal fade in" id="documentExist" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
	'<div class="modal-dialog biggest">'+
		'<div class="modal-content">'+
			'<div class="modal-header">'+
				'<h3 class="modal-title light_bluehead" id="mydocumentExist">INFORMATION</h3>'+
			'</div>'+
			'<div class="modal-body adjust-modal-body">'+
				'<p class="modal_content-text">'+
				'Le document choisi a deja été structuré,voulez-vous ?'+
				'</p>'+
			'</div>'+
			'<div class="centering choiceWorkSpace">'+
				'<button type="button" data-ng-click=\'resumeWorking()\' class="btn_simple light_blue much_padding" data-dismiss="modal">Continuer la structuration</button>'+
				'<button type="button" data-ng-click=\'createNew()\' class="btn_simple light_blue much_padding" data-dismiss="modal">Structurer à nouveau</button>'+
				'<button type="button" data-ng-click=\'openApercu()\' class="btn_simple light_blue much_padding" data-dismiss="modal">Afficher le document</button>'+
			'</div>'+
		'</div>'+
	'</div>'+
'</div>'+
'<!-- fin modal Add -->'+
'<div class="fixed_loader" data-ng-show="showLoaderOcr">'+
    '<div class="loadre_container">'+
		'<p class="loader_txt">{{loaderMessage}}</p>'+
    '</div>'+
'</div>'+
'</div>';
