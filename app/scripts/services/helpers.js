/*File: helpers.js
 *
 * Copyright (c) 2014
 * Centre National d’Enseignement à Distance (Cned), Boulevard Nicephore Niepce, 86360 CHASSENEUIL-DU-POITOU, France
 * (direction-innovation@cned.fr)
 *
 * GNU Affero General Public License (AGPL) version 3.0 or later version
 *
 * This file is part of a program which is free software: you can
 * redistribute it and/or modify it under the terms of the
 * GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with this program.
 * If not, see <http://www.gnu.org/licenses/>.
 *
 */

'use strict';
/*jshint unused: false, undef:false */

var cnedApp = cnedApp;

// include underscore
cnedApp.factory('_', function () {
  return window._; // assumes underscore has already been loaded on the page
});

// remplacer les codes HTML des accents
cnedApp.factory('removeAccents', function () {
  return function (value) {
    return value.replace(/&acirc;/g, 'â')
      .replace(/&Acirc;/g, 'Â')
      .replace(/&agrave/g, 'à')
      .replace(/&Agrave/g, 'À')
      .replace(/&eacute;/g, 'é')
      .replace(/&Eacute;/g, 'É')
      .replace(/&ecirc;/g, 'ê')
      .replace(/&Ecirc;/g, 'Ê')
      .replace(/&egrave;/g, 'è')
      .replace(/&Egrave;/g, 'È')
      .replace(/&euml;/g, 'ë')
      .replace(/&Euml;/g, 'Ë')
      .replace(/&icirc;/g, 'î')
      .replace(/&Icirc;/g, 'Î')
      .replace(/&iuml;/g, 'ï')
      .replace(/&Iuml;/g, 'Ï')
      .replace(/&ocirc;/g, 'ô')
      .replace(/&Ocirc;/g, 'Ô')
      .replace(/&oelig;/g, 'œ')
      .replace(/&Oelig;/g, 'Œ')
      .replace(/&ucirc;/g, 'û')
      .replace(/&Ucirc;/g, 'Û')
      .replace(/&ugrave;/g, 'ù')
      .replace(/&Ugrave;/g, 'Ù')
      .replace(/&uuml;/g, 'ü')
      .replace(/&Uuml;/g, 'Ü')
      .replace(/&ccedil;/g, 'ç')
      .replace(/&Ccedil;/g, 'Ç')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
  };
});

/**
  * Supprime les accents, mets en minuscule et supprime les espaces
  * @param string
  * @method  removeStringsUppercaseSpaces
  */
cnedApp.factory('removeStringsUppercaseSpaces', function () {
  return function (string) {
    // apply toLowerCase() function
    string = string.toLowerCase();
    // specified letters for replace
    var from = 'àáäâèéëêěìíïîòóöôùúüûñçčřšýžďť';
    var to = 'aaaaeeeeeiiiioooouuuunccrsyzdt';
    // replace each special letter
    for (var i = 0; i < from.length; i++)
        string = string.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        string = string.replace(/ /g, '');
    // return clean string
    return string;
  };
});

// nettoyer le texte des tags HTML
cnedApp.factory('removeHtmlTags', function () {
  // return value.replace(/['"]/g, "");
  return function (value) {
    return value.replace(/<\/?[^>]+(>|$)/g, '');
  };
});

/*Get Plain text without html tags*/
cnedApp.factory('htmlToPlaintext', function () {
  return function (text) {
    return String(text).replace(/<(?:.|\n)*?>/gm, '');
  };
});

/* Génerer une clef unique */
cnedApp.factory('generateUniqueId', function () {
  return function () {
    var d = new Date().getTime();
    d += (parseInt(Math.random() * 1000)).toString();
    return d;
  };
});

/*regex email*/
cnedApp.factory('verifyEmail', function () {
  return function (email) {
    var reg = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return reg.test(email);
  };
});


cnedApp.factory('serviceCheck', ['$http', '$q', '$location', 'configuration', 'dropbox',
  function ($http, $q, $location, configuration, dropbox) {

    var statusInformation = {};
    return {
      getData: function () {
        statusInformation = {};
        var deferred = $q.defer();
        var data = {
          id: false
        };
        if (localStorage.getItem('compteId')) {
          data = {
            id: localStorage.getItem('compteId')
          };
          //var random = Math.random()*10000;
          //$http.get(configuration.URL_REQUEST + '/profile?id=' + data.id+'&salt='+random)
          $http.get(configuration.URL_REQUEST + '/profile?id=' + data.id)
            .success(function (data) {
              statusInformation.loged = true;
              if (data.dropbox) {
                statusInformation.dropboxWarning = true;
                statusInformation.user = data;
                if (data.local.role === 'admin') {
                  statusInformation.admin = true;
                  deferred.resolve(statusInformation);
                } else {
                  statusInformation.admin = false;
                  deferred.resolve(statusInformation);
                }
              } else {
                if ($location.path() !== '/inscriptionContinue') {
                  statusInformation.redirected = 'ok';
                  statusInformation.path = '/inscriptionContinue';
                  statusInformation.dropboxWarning = false;
                  deferred.resolve(statusInformation);

                } else {
                  statusInformation.dropboxWarning = false;
                  deferred.resolve(statusInformation);
                }
              }
              return deferred.promise;
            }).error(function (data, status, headers, config) {
              //localStorage.removeItem('compteId');
              if (data.code === 2) {
                statusInformation.inactif = true;
              }
              statusInformation.loged = false;
              statusInformation.dropboxWarning = true;
              deferred.resolve(statusInformation);
            });
        } else {
          statusInformation.loged = false;
          statusInformation.dropboxWarning = true;
          deferred.resolve(statusInformation);
        }
        return deferred.promise;
      },
      filePreview: function (fileUrl, token) {
        var deferred = $q.defer();
        var data = {
          id: false
        };
        if (localStorage.getItem('compteId')) {
          data = {
            id: localStorage.getItem('compteId'),
            lien: fileUrl
          };
          var serviceName = '';
          if (fileUrl.indexOf('https') > -1) {
            if (fileUrl.indexOf('.pdf') > -1) {
              serviceName = '/previewPdfHTTPS';
            } else if (fileUrl.indexOf('.epub') > -1) {
              serviceName = '/externalEpubPreview';
            } else {
              serviceName = '/htmlPage';
            }
          } else {
            if (fileUrl.indexOf('.pdf') > -1) {
              serviceName = '/previewPdf';
            } else if (fileUrl.indexOf('.epub') > -1) {
              serviceName = '/externalEpubPreview';
            } else {
              serviceName = '/htmlPage';
            }
          }
          $http.post(configuration.URL_REQUEST + serviceName, data)
            .success(function (data) {
              if (data && data.length > 0) {
                data = data.replace(/\/+/g, '');
                statusInformation.documentSignature = data;
                statusInformation.cryptedSign = data;
                var tmp5 = dropbox.search(statusInformation.cryptedSign, token, configuration.DROPBOX_TYPE);
                tmp5.then(function (searchResult) {
                  statusInformation.existeDeja = false;
                  if (searchResult.length > 0) {
                    var i = 0;
                    for (i = 0; i < searchResult.length; i++) {
                      if (searchResult[i].path.indexOf(statusInformation.cryptedSign) > 0 && searchResult[i].path.indexOf('.html') > -1) {
                        statusInformation.found = searchResult;
                        statusInformation.existeDeja = true;
                        break;
                      }
                    }
                  } else {
                    statusInformation.existeDeja = false;
                  }
                  statusInformation.erreurIntern = false;
                  deferred.resolve(statusInformation);
                });
              } else {
                statusInformation.erreurIntern = true;
                deferred.resolve(statusInformation);
              }
              return deferred.promise;
            }).error(function () {
              statusInformation.erreurIntern = true;
              deferred.resolve(statusInformation);
            });
        } else {
          statusInformation.loged = false;
          statusInformation.dropboxWarning = true;
          deferred.resolve(statusInformation);
        }
        return deferred.promise;
      },
      htmlPreview: function (htmlUrl, token) {
        var deferred = $q.defer();
        var data = {
          id: false
        };
        var finalData = {};
        if (localStorage.getItem('compteId')) {
          data = {
            id: localStorage.getItem('compteId'),
            lien: htmlUrl
          };
          var serviceName = '/htmlPage';
          $http.post(configuration.URL_REQUEST + serviceName, data)
            .success(function (data) {
              if (data && data.length > 0) {
                finalData.documentHtml = data;
              } else {
                finalData.erreurIntern = true;
                deferred.resolve(finalData);
              }
              deferred.resolve(finalData);
              return deferred.promise;
            }).error(function () {
              finalData.erreurIntern = true;
              deferred.reject(finalData);
            });
        } else {
          finalData.loged = false;
          finalData.dropboxWarning = true;
          deferred.resolve(finalData);
        }
        return deferred.promise;
      },
      htmlReelPreview: function (htmlUrl) {
        var deferred = $q.defer();
        var data2 = {
          id: false
        };
        var htmlplPreview = {};
        if (localStorage.getItem('compteId')) {
          data2 = {
            id: localStorage.getItem('compteId'),
            lien: htmlUrl
          };
          var serviceName = '/htmlPagePreview';
          $http.post(configuration.URL_REQUEST + serviceName, data2)
            .success(function (data2) {
              if (data2) {
                htmlplPreview.sign = data2;
              }
              deferred.resolve(htmlplPreview);
              return deferred.promise;
            }).error(function () {
              htmlplPreview.erreurIntern = true;
              deferred.resolve(htmlplPreview);
            });
        } else {
          htmlplPreview.loged = false;
          htmlplPreview.dropboxWarning = true;
          deferred.resolve(htmlplPreview);
        }
        return deferred.promise;
      },
      getSign: function (chunck) {
        var deferred = $q.defer();
        var loacalSign = {
          id: false
        };
        var localFilePreview = {};
        if (localStorage.getItem('compteId')) {
          loacalSign = {
            id: localStorage.getItem('compteId'),
            filechunck: chunck
          };
          var serviceName = '/generateSign';
          $http.post(configuration.URL_REQUEST + serviceName, loacalSign)
            .success(function (loacalSign) {
              console.log('loacalSign --> ',loacalSign);
              if (loacalSign && loacalSign.sign) {
                localFilePreview.sign = loacalSign.sign;
              }
              deferred.resolve(localFilePreview);
              return deferred.promise;
            }).error(function () {
              localFilePreview.erreurIntern = true;
              deferred.resolve(localFilePreview);
            });
        } else {
          localFilePreview.loged = false;
          localFilePreview.dropboxWarning = true;
          deferred.resolve(localFilePreview);
        }
        return deferred.promise;
      },
      htmlImage: function (htmlUrl, token) {
        var deferred = $q.defer();
        var data = {
          id: false
        };
        var finalData = {};
        if (localStorage.getItem('compteId')) {
          data = {
            id: localStorage.getItem('compteId'),
            lien: htmlUrl
          };
          var serviceName = '/htmlImage';
          $http.post(configuration.URL_REQUEST + serviceName, data)
            .success(function (data) {
              if (data && data.img.length > 0) {
                finalData.htmlImages = data.img;
              }
              deferred.resolve(finalData);
              return deferred.promise;
            }).error(function () {
              finalData.erreurIntern = true;
              deferred.resolve(finalData);
            });
        } else {
          finalData.loged = false;
          finalData.dropboxWarning = true;
          deferred.resolve(finalData);
        }
        return deferred.promise;
      },
      deconnect: function () {
        var deferred = $q.defer();
        var data = {
          id: false
        };
        if (localStorage.getItem('compteId')) {
          data = {
            id: localStorage.getItem('compteId')
          };
          $http.get(configuration.URL_REQUEST + '/logout?id=' + data.id)
            .success(function () {
              statusInformation.deconnected = true;
              deferred.resolve(statusInformation);
            }).error(function () {
              statusInformation.deconnected = false;
              deferred.resolve(statusInformation);
            });
        } else {
          statusInformation.loged = false;
          statusInformation.dropboxWarning = true;
          deferred.resolve(statusInformation);
        }
        return deferred.promise;
      },
      checkName: function (str) {
        return /^[a-zA-Z0-9 àâæçéèêëîïôœùûüÿÀÂÆÇÉÈÊËÎÏÔŒÙÛÜŸ]*$/g.test(str); // jshint ignore:line
      }
    };
  }
]);


cnedApp.factory('dropbox', ['$http', '$q', '$rootScope', 'appCrash',
  function ($http, $q, $rootScope, appCrash) {

    var retryCount = 0;

    var downloadService = function (path, access_token, dropbox_type) {
      if (typeof $rootScope.socket !== 'undefined') {
        $rootScope.socket.emit('dropBoxEvent', {
          message: '[DropBox Operation Begin] : Download [query] :' + path + ' [access_token] :' + access_token + ' [user_token] ' + localStorage.getItem('compteId')
        });
      }
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: 'https://api-content.dropbox.com/1/files/' + dropbox_type + '/' + path + '?access_token=' + access_token
      }).success(function (data) {
        if (typeof $rootScope.socket !== 'undefined') {
          $rootScope.socket.emit('dropBoxEvent', {
            message: '[DropBox Operation End-Success] : Download [query] :' + path + ' [access_token] :' + access_token + ' [user_token] ' + localStorage.getItem('compteId')
          });
        }
        retryCount = 0;
        deferred.resolve(data);
        return deferred.promise;
      }).error(function (data, status) {
        if ((status == 401 || status == 504 || status == 408) && retryCount < 3) { // jshint ignore:line
          retryCount++;
          downloadService(path, access_token, dropbox_type);
        } else {
          retryCount = 0;
          // n'affiche pas la popup car on essaye de recuperer le contenu dans le cache
          //appCrash.showPop(data);
          deferred.reject();
          if (typeof $rootScope.socket !== 'undefined') {
            $rootScope.socket.emit('dropBoxEvent', {
              message: '[DropBox Operation End-Error] : Download [query] :' + path + ' [access_token] :' + access_token + ' [user_token] ' + localStorage.getItem('compteId')
            });
          }
        }
        // deferred.resolve(null);
      });
      return deferred.promise;
    };
    var uploadService = function (filename, dataToSend, access_token, dropbox_type) {
      if (typeof $rootScope.socket !== 'undefined') {
        $rootScope.socket.emit('dropBoxEvent', {
          message: '[DropBox Operation Begin] : Upload [query] :' + filename + ' [access_token] :' + access_token + ' [user_token] ' + localStorage.getItem('compteId')
        });
      }
      var deferred = $q.defer();
      $http({
        method: 'PUT',
        url: 'https://api-content.dropbox.com/1/files_put/' + dropbox_type + '/' + filename + '?access_token=' + access_token,
        data: dataToSend
      }).success(function (data) {
        if (typeof $rootScope.socket !== 'undefined') {
          $rootScope.socket.emit('dropBoxEvent', {
            message: '[DropBox Operation End-Success] : Upload [query] :' + filename + ' [access_token] :' + access_token + ' [user_token] ' + localStorage.getItem('compteId')
          });
        }
        retryCount = 0;
        deferred.resolve(data);
        return deferred.promise;
      }).error(function (data, status) {
        if ((status == 401 || status == 504 || status == 408) && retryCount < 3) { // jshint ignore:line
          retryCount++;
          uploadService(filename, dataToSend, access_token, dropbox_type);
        } else {
          retryCount = 0;
          appCrash.showPop(data);
          if (typeof $rootScope.socket !== 'undefined') {
            $rootScope.socket.emit('dropBoxEvent', {
              message: '[DropBox Operation End-Error] : Upload [query] :' + filename + ' [access_token] :' + access_token + ' [user_token] ' + localStorage.getItem('compteId')
            });
          }
        }
        // deferred.resolve(null);
      });
      return deferred.promise;
    };
    var deleteService = function (filename, access_token, dropbox_type) {
      if (typeof $rootScope.socket !== 'undefined') {
        $rootScope.socket.emit('dropBoxEvent', {
          message: '[DropBox Operation Begin] : Delete [query] :' + filename + ' [access_token] :' + access_token + ' [user_token] ' + localStorage.getItem('compteId')
        });
      }
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: 'https://api.dropbox.com/1/fileops/delete/?access_token=' + access_token + '&path=' + filename + '&root=' + dropbox_type
      }).success(function (data) {
        if (typeof $rootScope.socket !== 'undefined') {
          $rootScope.socket.emit('dropBoxEvent', {
            message: '[DropBox Operation End-Success] : Delete [query] :' + filename + ' [access_token] :' + access_token + ' [user_token] ' + localStorage.getItem('compteId')
          });
        }
        retryCount = 0;
        deferred.resolve(data);
        return deferred.promise;
      }).error(function (data, status) {
        if ((status == 401 || status == 504 || status == 408) && retryCount < 3) { // jshint ignore:line
          retryCount++;
          deleteService(filename, access_token, dropbox_type);
        } else {
          retryCount = 0;
          appCrash.showPop(data);
          if (typeof $rootScope.socket !== 'undefined') {
            $rootScope.socket.emit('dropBoxEvent', {
              message: '[DropBox Operation End-Error] : Delete [query] :' + filename + ' [access_token] :' + access_token + ' [user_token] ' + localStorage.getItem('compteId')
            });
          }
        }
      });
      return deferred.promise;
    };
    var searchService = function (query, access_token, dropbox_type) {
      console.log('query : ',query);
      console.log('access_token',access_token);
      console.log('dropbox_type',dropbox_type);
      if (typeof $rootScope.socket !== 'undefined') {
        $rootScope.socket.emit('dropBoxEvent', {
          message: '[DropBox Operation Begin] : Search [query] :' + query + ' [access_token] :' + access_token + ' [user_token] ' + localStorage.getItem('compteId')
        });
      }
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: 'https://api.dropbox.com/1/search/?access_token=' + access_token + '&query=' + query + '&root=' + dropbox_type
      }).success(function (data, status) {
        $rootScope.ErrorModalMessage = 'le message depuis rootScope';
        $rootScope.ErrorModalTitre = 'le titre depuis rootScope';

        if (typeof $rootScope.socket !== 'undefined') {
          $rootScope.socket.emit('dropBoxEvent', {
            message: '[DropBox Operation End-Success] : Search [query] :' + query + ' [access_token] :' + access_token + ' [user_token] ' + localStorage.getItem('compteId')
          });
        }
        retryCount = 0;
        data.status = status;
        deferred.resolve(data);
        return deferred.promise;
      }).error(function (data, status) {
        if ((status == 401 || status == 504 || status == 408) && retryCount < 3) { // jshint ignore:line
          retryCount++;
          searchService(query, access_token, dropbox_type);
        } else {
          retryCount = 0;
          // n'affiche pas la popup car on essaye de recuperer le contenu dans le cache
          //appCrash.showPop(data);
          deferred.reject();
          if (typeof $rootScope.socket !== 'undefined') {
            $rootScope.socket.emit('dropBoxEvent', {
              message: '[DropBox Operation End-Error] : Search [query] :' + query + ' [access_token] :' + access_token + ' [user_token] ' + localStorage.getItem('compteId')
            });
          }
        }
      });
      return deferred.promise;
    };
    var shareLinkService = function (path, access_token, dropbox_type) {
      if (typeof $rootScope.socket !== 'undefined') {
        $rootScope.socket.emit('dropBoxEvent', {
          message: '[DropBox Operation Begin] : ShareLink [query] :' + path + ' [access_token] :' + access_token + ' [user_token] ' + localStorage.getItem('compteId')
        });
      }
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: 'https://api.dropbox.com/1/shares/?access_token=' + access_token + '&path=' + path + '&root=' + dropbox_type + '&short_url=false'
      }).success(function (data, status) {
        if (typeof $rootScope.socket !== 'undefined') {
          $rootScope.socket.emit('dropBoxEvent', {
            message: '[DropBox Operation End-Success] : ShareLink [query] :' + path + ' [access_token] :' + access_token + ' [user_token] ' + localStorage.getItem('compteId')
          });
        }
        if (data) {
          if (data.url.indexOf('.appcache') > -1) {
            var linkStart = data.url.indexOf('manifest="');
            var linkEnd = data.url.indexOf('.appcache', linkStart) + 9;
            data.url = data.url.substring(linkStart, linkEnd);
          }
          data.url = data.url.replace('https://www.dropbox.com', 'https://dl.dropboxusercontent.com');
          data.status = status;
        }
        retryCount = 0;
        deferred.resolve(data);
        return deferred.promise;
      }).error(function (data, status) {
        if ((status == 401 || status == 504 || status == 408) && retryCount < 3) { // jshint ignore:line
          retryCount++;
          shareLinkService(path, access_token, dropbox_type);
        } else {
          retryCount = 0;
          appCrash.showPop(data);
          if (typeof $rootScope.socket !== 'undefined') {
            $rootScope.socket.emit('dropBoxEvent', {
              message: '[DropBox Operation End-Error] : ShareLink [query] :' + path + ' [access_token] :' + access_token + ' [user_token] ' + localStorage.getItem('compteId')
            });
          }
        }

        // deferred.resolve(null);
        appCrash.showPop(data);
      });
      return deferred.promise;
    };
    var renameService = function (oldFilePath, newFilePath, access_token, dropbox_type) {
      if (typeof $rootScope.socket !== 'undefined') {
        $rootScope.socket.emit('dropBoxEvent', {
          message: '[DropBox Operation Begin] : Rename [query] : Old -> ' + oldFilePath + ' New -> ' + newFilePath + ' [access_token] :' + access_token + ' [user_token] ' + localStorage.getItem('compteId')
        });
      }
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: 'https://api-content.dropbox.com/1/files/' + dropbox_type + '/' + oldFilePath + '?access_token=' + access_token
      }).success(function (data) {
        var documentData = data;
        $http({
          method: 'POST',
          url: 'https://api.dropbox.com/1/fileops/delete/?access_token=' + access_token + '&path=/' + oldFilePath + '&root=' + dropbox_type
        }).success(function (data2) {
          $http({
            method: 'PUT',
            url: 'https://api-content.dropbox.com/1/files_put/' + dropbox_type + '/' + newFilePath + '?access_token=' + access_token,
            data: documentData
          }).success(function (data) {
            deferred.resolve(data);
            return deferred.promise;
          }).error(function (data) {
            // deferred.resolve(null);
            appCrash.showPop(data);
          });
        }).error(function (data) {
          // deferred.resolve(null);
          appCrash.showPop(data);
        });
      }).error(function (data) {
        // deferred.resolve(null);
        appCrash.showPop(data);
      });
      return deferred.promise;
    };
    return {
      upload: uploadService,
      delete: deleteService,
      search: searchService,
      shareLink: shareLinkService,
      download: downloadService,
      rename: renameService
    };
  }
]);

cnedApp.factory('emergencyUpgrade', ['$http', '$rootScope', '$q', '$location', 'configuration', 'dropbox', 'serviceCheck',
  function ($http, $rootScope, $q, $location, configuration, dropbox, serviceCheck) {
    return {
      starting: function () {
        var deferredUpgrade = $q.defer();
        var promiseResponce = {};
        $rootScope.emergencyUpgrade = true;
        var link2;
        var user = serviceCheck.getData();
        var isApercu2;
        var appcacheLink2;
        user.then(function (result) {
          if (result.loged) {
            var theUser = result.user;
            if (window.location.href.indexOf(configuration.CATALOGUE_NAME) > 0) {
              link2 = configuration.CATALOGUE_NAME;
              isApercu2 = false;
              appcacheLink2 = 'listDocument.appcache';
            }
            promiseResponce.action = 'redirect';
            deferredUpgrade.resolve(promiseResponce);
          }
        });
        return deferredUpgrade.promise;
      }
    };
  }
]);

cnedApp.factory('appCrash', ['$http', '$rootScope', '$q', '$location', 'configuration', 'ngDialog',
  function ($http, $rootScope, $q, $location, configuration, ngDialog) {
    return {
      showPop: function (err) {
        var modalTitle = 'INFORMATION';
        var modalMessage = 'L\'application n\'a pas pu se connecter à DropBox.';
        ngDialog.open({
          template: '<div class="modal fade" id="errModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false" ><div class="modal-dialog" id="modalContent"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true" data-ng-click="backToHome()">&times;</button><h4 class="modal-title" id="myModalLabel">' + modalTitle + '</h4></div><div class="modal-body"><p>' + modalMessage + '</p><div class="centering"><button type="button" class="btn_simple light_blue" data-ng-click="backToHome()" title="RETOUR À LA PAGE D\'ACCUEIL">RETOUR À LA PAGE D\'ACCUEIL</button></div></div></div></div></div>',
          plain: true
        });
      }
    };
  }
]);


/*
LocalStorage Operations
 */

cnedApp.factory('storageService', ['$q', 'localStorageCheck',
  function ($q, localStorageCheck) {
    var deferred = $q.defer();
    var writeStorage = function (listElement, count) {
      console.log(listElement[count]);
      localStorage.setItem(listElement[count].name, listElement[count].value);
      var tmp = localStorageCheck.checkIfExist(listElement[count].name);
      tmp.then(function (data) {
        if (data) {
          if (listElement.length - 1 == count) { // jshint ignore:line
            console.log('return promess responce');
            deferred.resolve({confirmed: true});
            return deferred.promise;
          } else {
            count++;
            console.log('next element to save');
            writeStorage(listElement, count, deferred);
          }
        }
      });
      return deferred.promise;
    };

    var readStorage = function (elementName, count) {
      if (localStorage.getItem(elementName)) {
        deferred.resolve({exist: true, value: localStorage.getItem(elementName)});
      } else {
        console.log('Element not found in localStorage');
        deferred.resolve({exist: false, value: null});
      }
      return deferred.promise;
    };

    var removeStorage = function (listElement, count) {
      localStorage.removeItem(listElement[count]);
      var tmp = localStorageCheck.checkIfRemoved(listElement[count]);
      tmp.then(function (data) {
        if (data) {
          if (listElement.length - 1 == count) { // jshint ignore:line
            console.log('return promess responce');
            deferred.resolve({confirmed: true});
          } else {
            count++;
            console.log('next element to remove');
            removeStorage(listElement, count, deferred);
          }
        }
      });
      return deferred.promise;
    };

    return {
      writeService: writeStorage,
      readService: readStorage,
      removeService: removeStorage
    };
  }
]);

cnedApp.factory('localStorageCheck', ['$q', '$timeout', function ($q, $timeout) {

  var timeIntervalInSec = 0.5;
  var deferred = $q.defer();

  function checkIfExist(itemName) {
    if (localStorage.getItem(itemName)) {
      console.log('element checked');
      deferred.resolve({confirmed: true});
    } else {
      console.log('recurcive add LocalStorage');
      $timeout(checkIfExist(itemName), 1000 * timeIntervalInSec);
    }
    return deferred.promise;
  }

  var checkIfRemoved = function (itemName) {
    if (localStorage.getItem(itemName) === null) {
      console.log('element removed');
      deferred.resolve({confirmed: true});
    } else {
      console.log('recurcive delete LocalStorage');
      $timeout(checkIfRemoved(itemName), 1000 * timeIntervalInSec);
    }
    return deferred.promise;
  };
  return {
    checkIfExist: checkIfExist,
    checkIfRemoved: checkIfRemoved
  };
}]);

// Intercepteur HTTP
cnedApp.factory('app.httpinterceptor', ['$q','_','$rootScope',
  function($q,_,$rootScope) {
    return {
      // optional method
      'request': function(config) {
        var exeptionUrl =['views/addDocument/addDocument.html', 'views/common/header.html','views/listDocument/listDocument.html','views/index/main.html','views/adminPanel/adminPanel.html','views/common/footer.html','views/passport/inscriptionContinue.html','views/passwordRestore/passwordRestore.html','views/workspace/apercu.html','views/workspace/print.html','views/profiles/profiles.html','views/tag/tag.html','views/userAccount/userAccount.html','views/profiles/detailProfil.html','views/common/errorHandling.html','views/404/404.html','needUpdate.html','mentions.html','template/carousel/slide.html','template/carousel/carousel.html','views/signup/signup.html'];
        if(config.method == 'GET') { // jshint ignore:line
          if (!_.contains(exeptionUrl, config.url)) {
            var separator = config.url.indexOf('?') === -1 ? '?' : '&';
            if($rootScope.testEnv){
              config.url = config.url;
            }else{
              config.url = config.url + separator + 't=' + Date.now();
            }
          }
        }
        return config || $q.when(config);
      },
      // optional method
      'requestError': function(rejection) {
        return $q.reject(rejection);
      },
      // optional method
      'response': function(response) {
        return response || $q.when(response);
      }
    };
  }
]);
// Define a simple audio service
/*cnedApp.factory('
 audio ', function($document) {
 var audioElement = $document[0].createElement('
 audio '); // <-- Magic trick here
 return {
 audioElement: audioElement,

 play: function(filename) {
 audioElement.src = filename;
 audioElement.play(); //  <-- Thats all you need
 }
 };
 });*/
