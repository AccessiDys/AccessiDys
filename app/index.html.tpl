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

    <meta property="og:title" content="Un élément a été partagé via l'outil CnedAdapt"/>
    <meta property="og:description" content="CnedAdapt est un outil proposé par le CNED - Mentions légales - ©2014 CNED"/>
    <meta property="og:site_name" content="adapt.cned.fr" />
    <meta property="og:type" content="website">


    <!-- Place favicon.ico and apple-touch-icon.png in the root directory -->
    <link rel="stylesheet" href="<%- URL_REQUEST %>/styles/bootstrap.min.css">
    <link rel="stylesheet" href="<%- URL_REQUEST %>/bower_components/ngDialog-master/css/ngDialog.min.css">
    <!--<link rel="stylesheet" href="<%- URL_REQUEST %>/styles/font-awesome/css/font-awesome.min.css">-->
    <link rel="stylesheet" href="<%- URL_REQUEST %>/styles/treeView.min.css">
    <link rel="stylesheet" href="<%- URL_REQUEST %>/styles/animate.min.css">
    <link rel="stylesheet" href="<%- URL_REQUEST %>/styles/step.min.css">
    <link rel="stylesheet" href="<%- URL_REQUEST %>/bower_components/jcrop/css/jquery.Jcrop.min.css">
    <link rel="stylesheet" href="<%- URL_REQUEST %>/styles/main.min.css">
    <link rel="stylesheet" href="<%- URL_REQUEST %>/styles/styles.min.css">
</head>
<body key-trap class="body-home" data-ng-app="cnedApp" history-browser="">

    <div id="fb-root"></div>
    <script>
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s);
            js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&appId=657960714228766&version=v2.0";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        window.fbAsyncInit = function () {
            FB.init({
                xfbml:false  // Will stop the fb like button from rendering automatically
            });
        };
    </script>

    <script type="text/javascript">
      (function() {
          var po = document.createElement('script');
          po.type = 'text/javascript';
          po.async = true;
          po.src = 'https://apis.google.com/js/client:plusone.js';
          var s = document.getElementsByTagName('script')[0];
          s.parentNode.insertBefore(po, s);
      })();
    </script>

    <!--[if lt IE 7]>
    <![endif]-->
    <!--[if lt IE 9]>
    <script src="<%- URL_REQUEST %>/bower_components/es5-shim/es5-shim.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/json3/lib/json3.min.js"></script>
    <![endif]-->
    <!-- Add your site or application content here -->
    <div ng:include="'views/common/header.html'" data-ng-show="!apercu" class="header_zone" id="main_header"></div>
        <div class="wrapper_zone">
            <section class="first_container" id='masterContainer' style='display: none'>
            <div id="global_container" data-ng-view=""></div>
        </section>
    </div>
    <!-- Footer -->
    <div ng:include="'views/common/footer.html'"></div>
    <!-- End Footer -->
    <div class="no-show">A</div>
    <div data-ng-show='indexLoader' class="loader_cover">
        <div id="loader_container">
            <div class="loader_bar">
                <div class="progress_bar" style="width:{{loaderProgress}}%;">&nbsp;
                </div>
            </div>
            <p class="hide_if_emergency loader_txt">{{loaderMessage}} <img src="<%- URL_REQUEST %>/styles/images/loader_points.gif" alt="loader" /></p>
            <p class="emergency_message loader_txt">Une version plus récente de l'application a été détectée. Mise à jour de votre document en cours . Veuillez patienter <img src="<%- URL_REQUEST %>/styles/images/loader_points.gif" alt="loader" /></p>
        </div>
    </div>
    <div class="fixed_loader" id="upgradeLoader" style="display:none;">
        <div class="loadre_container">
            <p class="loader_txt">Une version plus récente de l'application a été détectée. Mise à jour de votre document en cours . Veuillez patienter .<img src="<%- URL_REQUEST %>/styles/images/loader_points.gif" alt="loader" /></p>
        </div>
    </div>
    <div data-appcache-updated></div>

    <!-- Google Analytics: change UA-XXXXX-X to be your site's ID -->
    <script>
    /*(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
    ga('create', 'UA-XXXXX-X');
    ga('send', 'pageview');*/
    </script>

    <script src="<%- URL_REQUEST %>/bower_components/jquery/jquery.min.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/angular/angular.min.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/underscore/underscore-min.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/ui.bootstrap/ui-bootstrap-tpls-0.9.0.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/bindonce-master/bindonce.min.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/jqueryUI/jquery-ui.min.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/jqueryUI/jquery.mjs.nestedSortable.min.js"></script>

    <!--<script src="<%- URL_REQUEST %>/bower_components/jquery-touch/jquery-touch.js"></script>-->

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
    <script src="<%- URL_REQUEST %>/bower_components/angular-resource/angular-resource.min.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/angular-cookies/angular-cookies.min.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/angular-sanitize/angular-sanitize.min.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/angular-route/angular-route.min.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/angular-gettext/dist/angular-gettext.min.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/ckeditor/ckeditor.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/jcrop/js/jquery.Jcrop.min.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/hyphenator/Hyphenator.min.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/hyphenator/patterns/fr.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/pdfjs/pdf.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/pdfjs/pdf.worker.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/sselect/jquery.customSelect.min.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/angular-md5/angular-md5.min.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/angular-audio/app/angular.audio.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/jquery/jquery.line.min.js"></script>
    <script src="<%- URL_REQUEST %>/socket.io/socket.io.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/ngDialog-master/js/ngDialog.min.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/localforage/dist/localforage.min.js"></script>
    <script src="<%- URL_REQUEST %>/bower_components/angular-localforage/dist/angular-localForage.min.js"></script>

    <script type="text/javascript">
    var memoryInitializer = "<%- URL_REQUEST %>/bower_components/tesseractJS/TesseractJS.mem";
    </script>
    <script src="<%- URL_REQUEST %>/bower_components/tesseractJS/TesseractJS.js"></script>
     <!-- <script src="<%- URL_REQUEST %>/scripts/services/serviceSocket.js"></script>  -->

    <!-- <link rel="stylesheet" href="<%- URL_REQUEST %>/bower_components/audiojs/index.css"> -->

	<!-- build:js({.tmp,app}) <%- URL_REQUEST %>/scripts/front.js -->
    <script src="<%- URL_REQUEST %>/viewsScripts/template_cache.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/app.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/translations.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/services/helpers.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/services/config.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/services/htmlEpubConverter.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/services/tagsService.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/services/fileStorageService.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/services/profilsService.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/services/workspaceService.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/services/speechService.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/services/keyboardSelectionService.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/controllers/index/main.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/controllers/common/common.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/controllers/tag/tag.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/controllers/workspace/apercu.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/controllers/workspace/print.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/controllers/profiles/profiles.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/controllers/passport/passport.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/controllers/passport/passportContinue.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/controllers/userAccount/userAccount.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/controllers/adminPanel/adminPanel.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/controllers/listDocument/listDocument.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/controllers/addDocument/addDocument.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/controllers/passwordRestore/passwordRestore.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/controllers/404/404.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/controllers/needUpdate/needUpdate.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/controllers/mentions/mentions.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/directives/imgCropped.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/directives/ckeditor.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/directives/treeView.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/directives/keyup.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/directives/showTab.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/directives/bodyClasses.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/directives/regleStyle.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/directives/actionProfil.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/directives/sselect.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/directives/documentMethodes.js"></script>
    <script src="<%- URL_REQUEST %>/scripts/directives/HistoryBrowser.js"></script>
    <!-- endbuild -->

    <script type="text/javascript">

	 function AppcacheUpdated() {
	    console.log('AppcacheUpdated');
	    var elementScope;
	    var fileCounter = 0;
	    console.log('window.applicationCache.status');
	    console.log(window.applicationCache.status);

	    return {
	        restrict: 'EA',
	        scope: {},
	        link: function(scope) {
	            elementScope = scope;
	        },
	        controller: function($scope, $rootScope, $timeout, $location) {

	            var appCache = window.applicationCache;
	            console.log(window.applicationCache.status);
	            $rootScope.indexLoader = false;
	            $rootScope.emergencyUpgrade = false;
	            $rootScope.loaderMessage = '';
	            appCache.addEventListener('cached', function(e) {
	                console.log('window.applicationCache.addEventListener cached');
	                console.log(e);
	                console.log(window.applicationCache.status);
	                console.log('timeout');
	                var tmp = window.location.href;
	                if (tmp.indexOf("<%- CATALOGUE_NAME %>") > 0 && tmp.indexOf("/listDocument") > 0) {
	                    $rootScope.loaderMessage = 'Vérification de vos documents. Veuillez patienter ';
	                } else {
	                    if (tmp.indexOf("/workspace") > 0) {
	                        $rootScope.$broadcast('showFileDownloadLoader');
	                    }
	                    if ($rootScope.emergencyUpgrade == false) {
	                        $rootScope.indexLoader = false;
	                        if (!$rootScope.$$phase) {
	                            $rootScope.$digest();
	                        }
	                    }
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
					//window.location.reload();
					localStorage.setItem('appcacheUpdated', true);
					if (localStorage.getItem('appCheck') != null) {
						localStorage.removeItem('appcacheUpdated');
						localStorage.removeItem('appCheck');

						setTimeout(function() {
							window.location.reload()
						}, 2000)
					}
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
	                    event.loaded = fileCounter;
	                    event.total = 128;
	                }
	                console.log(event.loaded + " of " + event.total);
	                if (event.loaded === event.total) {
	                    $rootScope.loaderMessage = '';
	                    if (!$rootScope.$$phase) {
	                        $rootScope.$digest();
	                    }

	                } else {
	                    var tmp = window.location.href;
                      if (tmp.indexOf("#/listDocument") > -1) {
                        $rootScope.loaderMessage = 'Chargement de la liste de vos documents en cours. Veuillez patienter ';
                      } else {
                        var urlMatch = /((\d+)(-)(\d+)(-)(\d+))/i.exec(encodeURIComponent(tmp));
                        if (urlMatch && urlMatch.length > 0) {
                          $rootScope.loaderMessage = 'Mise en cache de votre document en cours. Veuillez patienter ';
                        } else {
                          $rootScope.loaderMessage = 'Mise en cache de l\'application en cours. Veuillez patienter ';
                        }
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
	                    $rootScope.loaderMessage = 'Vérification de vos documents en cours.Veuillez patienter ';
	                } else {
	                    if (tmp.indexOf("/workspace") > 0) {
	                        $rootScope.$broadcast('showFileDownloadLoader');
	                    }
	                    if ($rootScope.emergencyUpgrade == false) {
	                        $rootScope.indexLoader = false;
	                        if (!$rootScope.$$phase) {
	                            $rootScope.$digest();
	                        }
	                    }
	                    if (!$rootScope.$$phase) {
	                        $rootScope.$digest();
	                    }
	                }
	                $timeout(function() {
	                    $rootScope.$broadcast('RefreshListDocument');
	                    $rootScope.$broadcast('UpgradeProcess');

	                    $scope.show = false;
	                }, 500, true);
	            }, false);


	            appCache.addEventListener('checking', function(event) {
	                console.log('noupdate event + affiche Loader ici');
	                $rootScope.indexLoader = true;
	            }, false);

	            if (!navigator.onLine) {
	                console.log('you are really offline');
	                $scope.show = true;
	            }
	            if (window.applicationCache.status === 4) {
	                console.log('Update Ready ==> updateready 2 ... ');
	                //window.location.reload();
	                localStorage.setItem('appcacheUpdated', true);
					if (localStorage.getItem('appCheck') != null) {
						localStorage.removeItem('appcacheUpdated');
						localStorage.removeItem('appCheck');

						setTimeout(function() {
							window.location.reload()
						}, 2000)
					}
	            }
	            if (window.applicationCache.status === 1) {
	                console.log('window.applicationCache.addEventListener noupdate');
	                console.log(window.applicationCache.status);
	                $scope.show = true;

	            }
	            $scope.$watch("show", function(value) {
	                console.log('show ==> ' + value);
                    if (value === true && ($location.absUrl().indexOf('listDocument') > 0 || $location.absUrl().indexOf('apercu')) ) {
	                    console.log('emitting event');
	                    $timeout(function() {
	                        $rootScope.$broadcast('RefreshListDocument');
                          $rootScope.$broadcast('UpgradeProcess');
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
	if (typeof PDFJS !== 'undefined') {
	    PDFJS.workerSrc = '<%- URL_REQUEST %>/bower_components/pdfjs/pdf.worker.min.js';
	}
	var finalVersion = false;
	var counter = 0;
    </script>
    <script>
      var ownerId = null;
    </script>
</body>
</html>
