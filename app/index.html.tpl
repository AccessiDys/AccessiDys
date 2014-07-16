<!doctype html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!-->
<html class="no-js" lang="fr" manifest=""> <!--<![endif]-->
    <head>
    <meta name="utf8beacon" content="éçñøåá—" />
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title></title>
    <meta name="description" content="">
    <meta name="viewport" content="width=1160">
    <!-- Place favicon.ico and apple-touch-icon.png in the root directory -->
    <link rel="stylesheet" href="<%- URL_REQUEST %>/styles/bootstrap.css">
    <link rel="stylesheet" href="<%- URL_REQUEST %>/styles/font-awesome/css/font-awesome.css">
    <link rel="stylesheet" href="<%- URL_REQUEST %>/styles/treeView.css">
    <link rel="stylesheet" href="<%- URL_REQUEST %>/styles/animate.css">
    <link rel="stylesheet" href="<%- URL_REQUEST %>/styles/step.css">
    <!-- <link href="<%- URL_REQUEST %>/bower_components/ui.bootstrap/bootstrap.css" rel="stylesheet"> -->
    <link rel="stylesheet" href="<%- URL_REQUEST %>/styles/main.css">
    <link rel="stylesheet" href="<%- URL_REQUEST %>/styles/styles.css">
</head>
    <body key-trap class="body-home" ng-app="cnedApp">            
        
    <!--[if lt IE 7]>
    <![endif]-->
    <!--[if lt IE 9]>
    <script src="<%- URL_REQUEST %>/bower_components/es5-shim/es5-shim.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/json3/lib/json3.min.js"></script>
    <![endif]-->
    <!-- Add your site or application content here -->
    <div ng:include="'header.html'" class="header_zone" id="main_header"></div>
        <div class="wrapper_zone">
            <div class="header_area">
            <h1 style='display: none' id='titreCompte' class='animated fadeInLeft' translate>MonCompte</h1>
            <h1 style='display: none' id='titreDocument' class='dark_green animated fadeInLeft pull-left' translate>Document</h1>
            <h1 style='display: none' id='titreProfile' class='animated fadeInLeft' translate>Profils</h1>
            <h1 style='display: none' id='titreTag' class='animated fadeInLeft' translate>Les règles</h1>
            <h1 style='display: none' id='titreAdmin' class='animated fadeInLeft' translate>Administration</h1>
            <h1 style='display: none' id='titreListDocument' class='animated fadeInLeft' translate>listDocument</h1>
            <h1 style='display: none' id='detailProfil' class='dark_green animated fadeInLeft' translate>detailsProfil</h1>
            <h1 style='display: none' id='titreDocumentApercu' class='dark_green animated fadeInLeft'>{{titreDoc}}</h1>
                <!--  <div class="breadcrumb_items">
                    <ul>
                    <li><a href="">Accueil</a></li>
                    <li><a href="">Profils</a></li>
                </ul>
            </div> -->
                <div id="submit_document" ng-show='showWorkspaceAction' class="submit_document pull-right">
                <button ng-disabled='permitSaveblocks()' data-toggle="modal" data-target="#actions-workspace" type="button" class="doc_save btn_simple light_blue pull-left">enregistrer</button>
                <button type="button" class="doc_resizing pull-left">&nbsp;</button>
            </div>
        </div>
            <section class="first_container" id='masterContainer' style='display: none'>
            <div class="container" id="global_container" ng-view=""></div>
        </section>
    </div>
    <!-- Footer -->
    <div ng:include="'footer.html'"></div>
    <!-- End Footer -->
    <div class="no-show">A</div>
    <div ng-show='indexLoader' class="loader_cover">
        <div id="loader_container">
            <div class="loader_bar">
                <div class="progress_bar" style="width:{{loaderProgress}}%;">&nbsp;
                </div>
            </div>
            <p class="loader_txt">{{loaderMessage}} <img src="<%- URL_REQUEST %>/styles/images/loader_points.gif" alt="loader" /></p>
        </div>
    </div>
    <appcache-updated></appcache-updated>

    <!-- Google Analytics: change UA-XXXXX-X to be your site's ID -->
    <script>
    /*(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
    ga('create', 'UA-XXXXX-X');
    ga('send', 'pageview');*/
    </script>

    <script src="<%- URL_REQUEST %>/scripts/viewsScripts/header.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/viewsScripts/listDocument.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/viewsScripts/main.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/viewsScripts/adminPanel.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/viewsScripts/footer.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/viewsScripts/inscriptionContinue.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/viewsScripts/passwordRestore.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/viewsScripts/detailProfil.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/viewsScripts/apercu.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/viewsScripts/images.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/viewsScripts/print.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/viewsScripts/profiles.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/viewsScripts/tag.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/viewsScripts/userAccount.js"></script>
    

    <script src="<%- URL_REQUEST %>/bower_components/jquery/jquery.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/angular/angular.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/underscore/underscore.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/ui.bootstrap/ui-bootstrap-tpls-0.9.0.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/jqueryUI/jquery-ui.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/jqueryUI/jquery.mjs.nestedSortable.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/sass-bootstrap/js/affix.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/sass-bootstrap/js/alert.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/sass-bootstrap/js/button.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/sass-bootstrap/js/carousel.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/sass-bootstrap/js/transition.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/sass-bootstrap/js/collapse.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/sass-bootstrap/js/dropdown.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/sass-bootstrap/js/modal.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/sass-bootstrap/js/scrollspy.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/sass-bootstrap/js/tab.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/sass-bootstrap/js/tooltip.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/sass-bootstrap/js/popover.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/angular-resource/angular-resource.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/angular-cookies/angular-cookies.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/angular-sanitize/angular-sanitize.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/angular-route/angular-route.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/angular-gettext/dist/angular-gettext.min.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/ckeditor/ckeditor.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/jcrop/js/jquery.Jcrop.min.js"></script>
    <link rel="stylesheet" href="<%- URL_REQUEST %>/bower_components/jcrop/css/jquery.Jcrop.min.css">
    <script src="<%- URL_REQUEST %>/bower_components/hyphenator/Hyphenator.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/hyphenator/patterns/fr.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/pdfjs/pdf.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/pdfjs/pdf.worker.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/sselect/jquery.customSelect.min.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/angular-md5/angular-md5.min.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/crypto/crypter.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/jquery/jquery.line.js"></script>
    <script src="<%- URL_REQUEST %>/socket.io/socket.io.js"></script>
     <!-- <script src="<%- URL_REQUEST %>/scripts/services/serviceSocket.js"></script>  -->

    <!-- <link rel="stylesheet" href="<%- URL_REQUEST %>/bower_components/audiojs/index.css"> -->
    <!-- build:js({.tmp,app}) <%- URL_REQUEST %>/scripts/front.js -->
    <script src="<%- URL_REQUEST %>/scripts/app.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/translations.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/services/helpers.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/services/config.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/services/htmlEpubConverter.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/controllers/index/main.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/controllers/common/common.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/controllers/workspace/images.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/controllers/tag/tag.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/controllers/workspace/apercu.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/controllers/workspace/print.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/controllers/profiles/profiles.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/controllers/passport/passport.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/controllers/passport/passportContinue.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/controllers/userAccount/userAccount.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/controllers/adminPanel/adminPanel.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/controllers/listDocument/listDocument.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/controllers/passwordRestore/passwordRestore.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/controllers/profiles/detailProfil.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/directives/imgCropped.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/directives/ckeditor.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/directives/treeView.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/directives/keyup.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/directives/showTab.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/directives/bodyClasses.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/directives/regleStyle.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/directives/regleStylePlan.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/directives/actionProfil.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/directives/sselect.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/directives/documentMethodes.js"></script>
    <!-- endbuild -->
    <script>
        var Appversion='';
    </script>
    <script type="text/javascript">

    function AppcacheUpdated() {
        console.log('AppcacheUpdated');
        var elementScope;
        var fileCounter = 0;
        console.log('window.applicationCache.status');
        console.log(window.applicationCache.status);

        return {
            restrict: 'E',
            scope: {},
            link: function(scope) {
                elementScope = scope;
            },
            controller: function($scope, $rootScope, $timeout,$location) {

                var appCache = window.applicationCache;
                console.log(window.applicationCache.status);
                $rootScope.indexLoader = false;
                $rootScope.loaderMessage='';
                appCache.addEventListener('cached', function(e) {
                    console.log('window.applicationCache.addEventListener cached');
                    console.log(e);
                    console.log(window.applicationCache.status);
                    console.log('timeout');
                    var tmp = window.location.href;
                    if (tmp.indexOf("<%- CATALOGUE_NAME %>") > 0 && tmp.indexOf("/listDocument") > 0) {
                        $rootScope.loaderMessage = 'Verification des documents dans votre DropBox.Veuillez patienter ';
                    } else {
                        if (tmp.indexOf("/workspace") > 0) {
                            $rootScope.$broadcast('showFileDownloadLoader');
                        }
                        $rootScope.indexLoader = false;
                        if (!$rootScope.$$phase) {
                            $rootScope.$digest();
                        }
                    }
                    $timeout(function() {
                        $rootScope.$broadcast('RefreshListDocument');
                        $rootScope.$broadcast('UpgradeProcess');
                        $scope.show = false;
                    });
                });

                appCache.addEventListener('updateready', function(e) {
                    console.log('Update Ready ==> updateready 1 ... ');
                    window.location.reload();
                });

                appCache.addEventListener('downloading', function(event) {
                    console.log("Started Download.");
                    $rootScope.indexLoader = true;
                    $('.loader_cover').show();
                    if (!$rootScope.$$phase) {
                        $rootScope.$digest();
                    }
                }, false);

                appCache.addEventListener('progress', function(event) {
                    $rootScope.indexLoader = true;
                    $('.loader_cover').show();
                    console.log('_________Progress______________');
                    if (!event.loaded || !event.total) {
                        fileCounter++;
                        event.loaded=fileCounter;
                        event.total= 128;
                    }
                    console.log(event.loaded + " of " + event.total);
                    if (event.loaded === event.total) {
                        $rootScope.loaderMessage = '';
                        if (!$rootScope.$$phase) {
                            $rootScope.$digest();
                        }

                    } else {
                        var tmp = window.location.href;
                        if (tmp.indexOf("<%- CATALOGUE_NAME %>") > 0  && tmp.indexOf("/listDocument") > 0) {
                            $rootScope.loaderMessage = 'Mise en cache de la liste de vos documents en cours. Veuillez patienter ';
                        } else {
                            $rootScope.loaderMessage = 'Mise en cache de votre document en cours. Veuillez patienter ';
                        }
                        $rootScope.loaderProgress = parseInt((event.loaded * 100) / event.total);
                        $rootScope.indexLoader = true;
                        if (!$rootScope.$$phase) {
                            $rootScope.$digest();
                        }
                    }
                }, false);

                appCache.addEventListener('noupdate', function(event) {
                    console.log('noupdate event');
                    var tmp = window.location.href;
                    if (tmp.indexOf("<%- CATALOGUE_NAME %>" && tmp.indexOf("/listDocument") > 0) > 0) {
                        $rootScope.loaderMessage = 'Verification des document dans votre DropBox.Veuillez patienter ';
                    } else {
                        if (tmp.indexOf("/workspace") > 0) {
                            $rootScope.$broadcast('showFileDownloadLoader');
                        }
                        $rootScope.indexLoader = false;
                        if (!$rootScope.$$phase) {
                            $rootScope.$digest();
                        }
                    }
                    $timeout(function() {
                        $rootScope.$broadcast('RefreshListDocument');
                        $rootScope.$broadcast('UpgradeProcess');
                        console.log('event sent : RefreshListDocument + UpgradeProcess')
                        $scope.show = false;
                    }, 500, true);
                }, false);


                appCache.addEventListener('checking', function(event){
                    console.log('noupdate event + affiche Loader ici');
                    $rootScope.indexLoader = true;
                }, false);

                if (!navigator.onLine) {
                    console.log('you are really offline');
                    $scope.show = true;
                }
                if (window.applicationCache.status === 4) {
                    console.log('Update Ready ==> updateready 2 ... ');
                    window.location.reload();
                }
                if (window.applicationCache.status === 1) {
                    console.log('window.applicationCache.addEventListener noupdate');
                    console.log(window.applicationCache.status);
                    $scope.show = true;

                }
                $scope.$watch("show", function(value) {
                    console.log('show ==> ' + value);
                    if (value === true && $location.absUrl().indexOf('listDocument') > 0) {
                        console.log('emitting event');
                        $timeout(function() {
                            $rootScope.$broadcast('RefreshListDocument');
                            $scope.show = false;
                        });
                    }
                });
            }

        };
    }

    angularModule = angular.module('cnedApp');
    console.log('angularModule ==> ');
    console.log(angularModule);
    angularModule.directive("appcacheUpdated", AppcacheUpdated);
    if (typeof PDFJS !== 'undefined') {
        PDFJS.workerSrc = 'https://localhost:3000/bower_components/pdfjs/pdf.worker.js';
    }
    var finalVersion = false;
    var counter = 0;
    </script>
    <script>
    var ownerId = null;
    var blocks = [];
    var listDocument= [];
    </script> 
    <script type = "text/javascript" >
        $('.doc_resizing').on('click', function() {
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
                $('.header_zone').slideDown(300, function() {
                    var body_height = $(window).outerHeight()
                    var header_height = $('#main_header').outerHeight();
                    var dif_heights = body_height - header_height;
                    dif_heights = dif_heights - 127;
                    $('.container').height(dif_heights);
                });
            } else {
                $('.header_zone').slideUp(300, function() {
                    var body_height = $(window).outerHeight()
                    var header_height = $('#main_header').outerHeight();
                    var dif_heights = body_height + header_height;
                    dif_heights = dif_heights - 164;
                    $('.container').height(dif_heights);
                });
                $(this).addClass('active');
            }

        });
    </script>
</body>
</html>