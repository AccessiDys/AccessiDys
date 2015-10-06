var addDocumentHTML = '<h1 id=\'titreAddDocument\' class=\'animated fadeInLeft\' translate>{{pageTitre | translate}}</h1>' +
    '<!-- Header -->' +
    '<!-- End Header -->' +
    '<div class="container">' +
    '<appcache-updated></appcache-updated>'+
    '<div document-methodes="" body-classes="" class="doc-General">'+
    '    <div class="head_section">'+
    ''+
	  '        <input style="margin-top: 15px" type="text" class="input_simple pull-left" placeholder="Entrez le titre du document" data-ng-model="docTitre" data-ng-disabled="existingFile" required></p>'+
    '        <!-- <div class="col-md-4 text-center"> <span translate>Mes profils  :</span>  <span class="label label-primary">{{listeProfils.length}}</span></div> -->'+
    ''+
    '        <a href="#/listDocument" style="text-decoration: none; color: white;" role="button" type="button"'+
    '           class="grey_btn pull-right btn_annuler" data-ng-click="" title="{{\'Fermer\' | translate}}">Fermer</a>'+
    '        <button id="save_document" data-ng-click="showSaveDialog()"'+
    '                type="button" class="grey_btn pull-right btn_annuler" title="{{\'Enregistrer\' | translate}}">Enregistrer'+
    '        </button>'+
    '        <button type="button" class="grey_btn pull-right btn_annuler" data-ng-click="openApercu()"'+
    '                title="{{\'Apercu\' | translate}}">Aperçu'+
    '        </button>'+
    '        <button id="add_documentbtn" type="button" class="grey_btn pull-right add_document"'+
    '                style="margin-top: 5px; margin-right: 5px;" data-toggle="modal"'+
    '                data-ng-click="openDocument()" title="{{\'Ouvrir un document\' | translate}}">Ouvrir un'+
    '            Document'+
    '        </button>'+
    ''+
    ''+
    '    </div>'+
    ''+
    '   <div id="editorContainer"  style="border: 1px solid rgb(203,203,203)">'+
    '       <div id="editorToolbar"></div>'+
'               <div id="editorAdd" class="resetAll adaptContent" contentEditable="true" style="height:350px; overflow:scroll;">'+
'               </div>'+
    '       <div id="editorBottom"></div>'+
    '   </div>'+
    //'    <div ck-editor ng-model="content" id="editorAdd" ng-change="initCkEditorChange()"></div>'+
    ''+
    '    <div class="loader_cover">'+
    '        <div id="loader_container">'+
    '            <div class="loader_bar">'+
    '                <div class="progress_bar" style="width:{{loaderProgress}}%;"> '+
    '                </div>'+
    '            </div>'+
    '            <p class="loader_txt">{{loaderMessage}} <img src="{{loaderImg}}" alt="loader"/></p>'+
    '        </div>'+
    '    </div>'+
    ''+
    ''+
    '    <!-- debut modal Add -->'+
    '    <div class="modal fade" id="save-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"'+
    '         aria-hidden="true" data-backdrop="static" data-keyboard="false">'+
    '        <div class="modal-dialog" style="width: 900px;">'+
    '            <div class="modal-content">'+
    '                <div class="modal-header">'+
    '                    <button type="button" class="close" data-dismiss="modal" ng-click="errorMsg = false" aria-hidden="true">×</button>'+
    '                    <h4 class="modal-title">Enregistrer le document</h4>'+
    '                </div>'+
    '                <div ng-show="errorMsg" class="msg_error">{{msgErrorModal}}</div>'+
    '                <div class="modal-body adjust-modal-body">'+
    ''+
    '                    <div class="row-fluid span6">'+
    '                        <div class="tab-content">'+
    '                            <form id="show_document" name="show_document" class="" role="form" style="overflow:hidden;">'+
    '                                <fieldset>'+
    '                                    <p class="controls_zone">'+
    '                                        <label for="docTitre" class="simple_label"><span>Titre </span> <span'+
    '                                                class="required">*</span></label>'+
    '                                        <input type="text" max-length="32" ng-disabled="existingFile" class=""'+
    '                                               id="docTitre"'+
    '                                               placeholder="Entrez le titre du document" ng-model="docTitre" required>'+
    '                                    </p>'+
    '                                </fieldset>'+
    '                                <div class="centering" id="ProfileButtons">'+
    '                                    <button type="button" class="reset_btn" data-dismiss="modal"'+
    '                                            ng-click="cancelSave()"'+
    '                                            title="{{\'Annuler\' | translate}}">Annuler'+
    '                                    </button>'+
    '                                    <button type="button" class="btn_simple light_blue"'+
    '                                            ng-disabled="!show_document.$valid"'+
    '                                            ng-click="save()"'+
    '                                            title="{{\'Enregistrer\' | translate}}">Enregistrer'+
    '                                    </button>'+
    '                                </div>'+
    '                            </form>'+
    '                        </div>'+
    '                    </div>'+
    '                </div>'+
    '            </div>'+
    '        </div>'+
    '    </div>'+
    ''+
    ''+
    '    <!-- debut modal save ? -->'+
    '    <div class="modal fade" id="save-new-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"'+
    '         aria-hidden="true" data-backdrop="static" data-keyboard="false">'+
    '        <div class="modal-dialog" style="width: 900px;">'+
    '            <div class="modal-content">'+
    '                <div class="modal-header">'+
    '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>'+
    '                    <h4 class="modal-title">Information</h4>'+
    '                </div>'+
    '                <div ng-show="errorMsg" class="msg_error">{{msgErrorModal}}</div>'+
    '                <div class="modal-body adjust-modal-body">'+
    '                    <div style="margin-bottom: 15px;">'+
    '                        Vous êtes sur le point d\'ouvrir un nouveau document, toute modification non enregistrée sera'+
    '                        perdue.'+
    '                    </div>'+
    ''+
    '                    <div class="row-fluid span6">'+
    '                        <div class="tab-content">'+
    '                            <form id="show_document" name="show_document" class="" role="form" style="overflow:hidden;">'+
    ''+
    '                                <div class="centering" id="ProfileButtons">'+
    '                                    <button type="button" class="reset_btn" data-dismiss="modal"'+
    '                                            title="{{\'Annuler\' | translate}}">Annuler'+
    '                                    </button>'+
    '                                    <button type="button" class="btn_simple light_blue"'+
    '                                            ng-disabled="!show_document.$valid"'+
    '                                            data-ng-click="openDocumentEditorWithData()" data-dismiss="modal"'+
    '                                            title="{{\'Enregistrer\' | translate}}">Continuer'+
    '                                    </button>'+
    '                                </div>'+
    '                            </form>'+
    '                        </div>'+
    '                    </div>'+
    '                </div>'+
    '            </div>'+
    '        </div>'+
    '    </div>'+
    ''+
    ''+
    '    <div class="modal fade" id="addDocumentModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"'+
    '         aria-hidden="true" data-backdrop="static" data-keyboard="false">'+
    '        <div class="modal-dialog" id="modalContent">'+
    '            <div class="modal-content">'+
    '                <div class="modal-header">'+
    '                    <button type="button" class="close" ng-click="errorMsg = false; clearUploadFile()" data-dismiss="modal"'+
    '                            aria-hidden="true">×</button>'+
    '                    <h3 class="modal-title" id="myModalLabel">Ouvrir un document</h3>'+
    '                </div>'+
    '                <div data-ng-show="errorMsg" class="msg_error">{{msgErrorModal}}</div>'+
    '                <div class="modal-body adjust-modal-body">'+
    '                    <div class="row-fluid span6">'+
    '                        <div class="tab-content">'+
    '                            <div class="tab-pane active" id="document" data-ng-form="AjoutformValidation">'+
    '                                <form class="form-horizontal" role="form" id="addDocument" name="addDocument">'+
    '                                    <fieldset>'+
    '                                        <p class="controls_zone">'+
    '                                            <label for="docTitre" class=""><span>Titre</span> <span'+
    '                                                    class="required">*</span></label>'+
    '                                            <input type="text" max-length="200" class="" id="docTitre"'+
    '                                                   placeholder="Entrez le titre du document" data-ng-model="doc.titre"'+
    '                                                   required>'+
    '                                            <span class="simple_txt">Veuillez ne pas utiliser les caractères spéciaux.</span>'+
    '                                        </p>'+
    ''+
    '                                        <p class="controls_zone">'+
    '                                            <label for="lien" class=""><span>Lien web : </span> </label>'+
    '                                            <input type="text" class="" id="lien"'+
    '                                                   placeholder="Entrez le lien de votre fichier"'+
    '                                                   data-ng-model="lien"'+
    '                                                   required>'+
    '                                        </p>'+
    ''+
    '                                        <p class="controls_zone">'+
    '                                            <span class="simple_txt">OU</span>'+
    '                                            <br/>'+
    '                                            <label for="docUploadPdf" class="upload_msg">Chargez un fichier depuis votre'+
    '                                                poste local (PDF/epub/png/jpg) : </label>'+
    '                                        <span class="file_mask">'+
    '                                        <label class="parcourir_label">Parcourir</label>'+
    '                                        <input type="file" data-ng-model-instant id="docUploadPdf" '+
    '                                               onchange="angular.element(this).scope().setFiles(this)" class="btn'+
    '                                               btn-default"/>'+
    '                                        <input type="text" id="filename_show" name="" readonly>'+
    '                                        </span>'+
    '                                            <button type="button" class="clear_upoadpdf"'+
    '                                                    data-ng-click="clearUploadFile()">'+
    '                                                 </button>'+
    '                                        </p>'+
    '                                    </fieldset>'+
    '                                    <div class="centering" id="ProfileButtons">'+
    '                                        <button type="button" class="reset_btn" ng-click="errorMsg = false; clearUploadFile()" data-dismiss="modal"'+
    '                                                title="{{\'Annuler\' | translate}}" name="reset">Annuler'+
    '                                        </button>'+
    '                                        <button type="button" class="btn_simple light_blue"'+
    '                                                data-ng-click="ajouterDocument()" title="{{\'Ouvrir\' | translate}}"'+
    '                                                name="add_Document">'+
    '                                            Ouvrir'+
    '                                        </button>'+
    '                                    </div>'+
    '                                </form>'+
    '                            </div>'+
    '                        </div>'+
    '                    </div>'+
    '                </div>'+
    '                <!-- /.modal-content -->'+
    '            </div>'+
    '            <!-- /.modal-dialog -->'+
    '        </div>'+
    '        <!-- /.modal -->'+
    '    </div>'+
    ''+
    ''+
    '    <div class="modal fade in" id="myModalWorkSpaceBig" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"'+
    '         aria-hidden="true">'+
    '        <div class="modal-dialog bigger">'+
    '            <div class="modal-content">'+
    '                <div class="modal-header">'+
    '                    <h3 class="modal-title light_bluehead" id="myModalLabel">information</h3>'+
    '                </div>'+
    '                <div class="modal-body adjust-modal-body">'+
    '                    <p class="modal_content-text">'+
    '                        L?application ne pourra pas traiter votre document de façon optimale en raison du poids du'+
    '                        fichier et/ou de son contenu. Aussi, nous vous invitons à réessayer avec une autre version de'+
    '                        votre document.'+
    '                    </p>'+
    '                </div>'+
    '                <div class="centering">'+
    '                    <button type="button" class="btn_simple light_blue much_padding"'+
    '                            data-ng-click="modalError(\'myModalWorkSpaceBig\')">OK'+
    '                    </button>'+
    '                </div>'+
    '            </div>'+
    '        </div>'+
    '    </div>'+
    ''+
    '    <div class="modal fade in" id="myModalWorkSpaceTooMany" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"'+
    '         aria-hidden="true">'+
    '        <div class="modal-dialog bigger">'+
    '            <div class="modal-content">'+
    '                <div class="modal-header">'+
    '                    <h3 class="modal-title light_bluehead" id="myModalLabel">information</h3>'+
    '                </div>'+
    '                <div class="modal-body adjust-modal-body">'+
    '                    <p class="modal_content-text">'+
    '                        La taille de l\'ePub est supérieur à la taille limite supportée par l\'application.'+
    '                    </p>'+
    '                </div>'+
    '                <div class="centering">'+
    '                    <button type="button" class="btn_simple light_blue much_padding"'+
    '                            data-ng-click="modalError(\'myModalWorkSpaceTooMany\')">OK'+
    '                    </button>'+
    '                </div>'+
    '            </div>'+
    '        </div>'+
    '    </div>'+
    ''+
    ''+
    '    <!-- modal en cas derreur -->'+
    '    <div class="modal fade in" id="myModalWorkSpace" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
    '        <div class="modal-dialog bigger">'+
    '            <div class="modal-content">'+
    '                <div class="modal-header">'+
    '                    <!-- <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button> -->'+
    '                    <h4 class="modal-title light_bluehead" id="myModalLabel">lien non valide</h4>'+
    '                </div>'+
    '                <div class="modal-body adjust-modal-body">'+
    '                    <p class="modal_content-text">'+
    '                        L\'import du document a échoué.'+
    '                    </p>'+
    '                </div>'+
    '                <div class="centering">'+
    '                    <button type="button" class="btn_simple light_blue much_padding" data-dismiss="modal">OK</button>'+
    '                </div>'+
    '            </div>'+
    '        </div>'+
    '    </div>'+
    ''+
    '</div>'+


'</div>';
