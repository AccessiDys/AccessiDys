/* File: helpers.js
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

var cnedApp = cnedApp;

// include underscore
cnedApp.factory('_', function() {
    return window._; // assumes underscore has already been loaded on the page
});

// remplacer les codes HTML des accents
cnedApp.factory('removeAccents', function() {
    return function(value) {
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

// nettoyer le texte des tags HTML
cnedApp.factory('removeHtmlTags', function() {
    // return value.replace(/['"]/g, "");
    return function(value) {
        return value.replace(/<\/?[^>]+(>|$)/g, '');
    };
});

/*Get Plain text without html tags*/
cnedApp.factory('htmlToPlaintext', function() {
    return function(text) {
        return String(text).replace(/<(?:.|\n)*?>/gm, '');
    };
});

/* Génerer une clef unique */
cnedApp.factory('generateUniqueId', function() {
    return function() {
        var d = new Date().getTime();
        d += (parseInt(Math.random() * 1000)).toString();
        return d;
    };
});

/*regex email*/
cnedApp.factory('verifyEmail', function() {
    return function(email) {
        var reg = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (reg.test(email)) {
            return true;
        } else {
            return false;
        }
    };
});

cnedApp.factory('serviceCheck', ['$http', '$q', '$location', 'configuration', 'dropbox', 'ngDialog',
    function($http, $q, $location, configuration, dropbox, ngDialog) {

        var statusInformation = {};
        return {
            getData: function() {
                var deferred = $q.defer();
                var data = {
                    id: false
                };
                if (localStorage.getItem('compteId')) {
                    data = {
                        id: localStorage.getItem('compteId')
                    };
                    $http.get(configuration.URL_REQUEST + '/profile?id=' + data.id)
                        .success(function(data) {
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
                        }).error(function(data, status, headers, config) {
                            //localStorage.removeItem('compteId');
                            console.log(data);
                            if (data.code === 2) {
                                statusInformation.inactif = true;
                            }
                            console.log(status);
                            console.log('helpers token not error');
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
            filePreview: function(fileUrl, token) {
                var deferred = $q.defer();
                var data = {
                    id: false
                };
                if (localStorage.getItem('compteId')) {
                    data = {
                        id: localStorage.getItem('compteId'),
                        lien: fileUrl
                    };
                    console.log('data to send');
                    console.log(data);
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
                    console.log('retrieving file preview service :' + serviceName);
                    console.log('retrieving file preview starting');
                    $http.post(configuration.URL_REQUEST + serviceName, data)
                        .success(function(data) {
                            console.log('retrieving file preview finished');
                            if (data && data.length > 0) {
                                data = data.replace(/\/+/g, '');
                                // console.log('data helpers ==> ');
                                // console.log(data);
                                statusInformation.documentSignature = data;
                                data = CryptoJS.SHA256(data);
                                statusInformation.cryptedSign = data;
                                console.log('starting dropbox search service');
                                var tmp5 = dropbox.search(data, token, configuration.DROPBOX_TYPE);
                                tmp5.then(function(searchResult) {
                                    console.log('search finished');
                                    console.log(searchResult);
                                    if (searchResult.length > 0) {
                                        statusInformation.found = searchResult;
                                        statusInformation.existeDeja = true;
                                    } else {
                                        statusInformation.existeDeja = false;
                                    }
                                    statusInformation.erreurIntern = false;
                                    deferred.resolve(statusInformation);

                                });
                            } else {
                                console.log('retrieving data preview failed');
                                statusInformation.erreurIntern = true;
                                deferred.resolve(statusInformation);
                            }
                            return deferred.promise;
                        }).error(function() {
                            console.log('retrieving file preview internal error');
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
            htmlPreview: function(htmlUrl, token) {
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
                    console.log('data to send');
                    console.log(data);
                    var serviceName = '/htmlPage';
                    console.log('retrieving file preview service :' + serviceName);
                    console.log('retrieving file preview starting');
                    $http.post(configuration.URL_REQUEST + serviceName, data)
                        .success(function(data) {
                            console.log('retrieving file preview finished');
                            if (data && data.length > 0) {
                                finalData.documentHtml = data;
                            }
                            deferred.resolve(finalData);
                            return deferred.promise;
                        }).error(function() {
                            console.log('retrieving file preview internal error');
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
            htmlImage: function(htmlUrl, token) {
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
                    console.log('data to send');
                    console.log(data);
                    var serviceName = '/htmlImage';
                    console.log('retrieving file preview service :' + serviceName);
                    console.log('retrieving file preview starting');
                    $http.post(configuration.URL_REQUEST + serviceName, data)
                        .success(function(data) {
                            console.log('retrieving file preview finished');
                            if (data && data.img.length > 0) {
                                finalData.htmlImages = data.img;
                            }
                            deferred.resolve(finalData);
                            return deferred.promise;
                        }).error(function() {
                            console.log('retrieving file preview internal error');
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
            deconnect: function() {
                var deferred = $q.defer();
                var data = {
                    id: false
                };
                if (localStorage.getItem('compteId')) {
                    data = {
                        id: localStorage.getItem('compteId')
                    };
                    $http.get(configuration.URL_REQUEST + '/logout?id=' + data.id)
                        .success(function() {
                            statusInformation.deconnected = true;
                            deferred.resolve(statusInformation);
                            return deferred.promise;
                        }).error(function() {
                            console.log('retrieving file preview internal error');
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
            checkName: function(str) {
                console.log(/^[a-zA-Z0-9 éàéçù]*$/.test(str));
                return /^[a-zA-Z0-9 àâæçéèêëîïôœùûüÿÀÂÆÇÉÈÊËÎÏÔŒÙÛÜŸ]*$/g.test(str);
            }
        };
    }
]);


cnedApp.factory('dropbox', ['$http', '$q', '$rootScope', 'ngDialog',

    function($http, $q, $rootScope, ngDialog) {

        return {
            upload: function(filename, dataToSend, access_token, dropbox_type) {
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
                }).success(function(data) {
                    if (typeof $rootScope.socket !== 'undefined') {
                        $rootScope.socket.emit('dropBoxEvent', {
                            message: '[DropBox Operation End-Success] : Upload [query] :' + filename + ' [access_token] :' + access_token + ' [user_token] ' + localStorage.getItem('compteId')
                        });
                    }
                    deferred.resolve(data);
                    return deferred.promise;
                }).error(function() {
                    if (typeof $rootScope.socket !== 'undefined') {
                        $rootScope.socket.emit('dropBoxEvent', {
                            message: '[DropBox Operation End-Error] : Upload [query] :' + filename + ' [access_token] :' + access_token + ' [user_token] ' + localStorage.getItem('compteId')
                        });
                    }
                    deferred.resolve(null);
                });
                return deferred.promise;
            },
            delete: function(filename, access_token, dropbox_type) {
                if (typeof $rootScope.socket !== 'undefined') {
                    $rootScope.socket.emit('dropBoxEvent', {
                        message: '[DropBox Operation Begin] : Delete [query] :' + filename + ' [access_token] :' + access_token + ' [user_token] ' + localStorage.getItem('compteId')
                    });
                }
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: 'https://api.dropbox.com/1/fileops/delete/?access_token=' + access_token + '&path=' + filename + '&root=' + dropbox_type
                }).success(function(data) {
                    if (typeof $rootScope.socket !== 'undefined') {
                        $rootScope.socket.emit('dropBoxEvent', {
                            message: '[DropBox Operation End-Success] : Delete [query] :' + filename + ' [access_token] :' + access_token + ' [user_token] ' + localStorage.getItem('compteId')
                        });
                    }
                    deferred.resolve(data);
                    return deferred.promise;
                }).error(function() {
                    if (typeof $rootScope.socket !== 'undefined') {
                        $rootScope.socket.emit('dropBoxEvent', {
                            message: '[DropBox Operation End-Error] : Delete [query] :' + filename + ' [access_token] :' + access_token + ' [user_token] ' + localStorage.getItem('compteId')
                        });
                    }
                    deferred.resolve(null);
                });
                return deferred.promise;
            },
            search: function(query, access_token, dropbox_type) {
                if (typeof $rootScope.socket !== 'undefined') {
                    $rootScope.socket.emit('dropBoxEvent', {
                        message: '[DropBox Operation Begin] : Search [query] :' + query + ' [access_token] :' + access_token + ' [user_token] ' + localStorage.getItem('compteId')
                    });
                }
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: 'https://api.dropbox.com/1/search/?access_token=' + access_token + '&query=' + query + '&root=' + dropbox_type
                }).success(function(data, status) {
                    $rootScope.ErrorModalMessage = 'le message depuis rootScope';
                    $rootScope.ErrorModalTitre = 'le titre depuis rootScope';
                    // ngDialog.open({
                    //     template: 'errorHandling.html',
                    //     scope: $rootScope
                    // });
                    if (typeof $rootScope.socket !== 'undefined') {
                        $rootScope.socket.emit('dropBoxEvent', {
                            message: '[DropBox Operation End-Success] : Search [query] :' + query + ' [access_token] :' + access_token + ' [user_token] ' + localStorage.getItem('compteId')
                        });
                    }
                    data.status = status;
                    deferred.resolve(data);
                    return deferred.promise;
                }).error(function() {
                    if (typeof $rootScope.socket !== 'undefined') {
                        $rootScope.socket.emit('dropBoxEvent', {
                            message: '[DropBox Operation End-Error] : Search [query] :' + query + ' [access_token] :' + access_token + ' [user_token] ' + localStorage.getItem('compteId')
                        });
                    }
                    deferred.resolve(null);
                });
                return deferred.promise;
            },
            shareLink: function(path, access_token, dropbox_type) {
                if (typeof $rootScope.socket !== 'undefined') {
                    $rootScope.socket.emit('dropBoxEvent', {
                        message: '[DropBox Operation Begin] : ShareLink [query] :' + path + ' [access_token] :' + access_token + ' [user_token] ' + localStorage.getItem('compteId')
                    });
                }
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: 'https://api.dropbox.com/1/shares/?access_token=' + access_token + '&path=' + path + '&root=' + dropbox_type + '&short_url=false'
                }).success(function(data, status) {
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
                    deferred.resolve(data);
                    return deferred.promise;
                }).error(function() {
                    if (typeof $rootScope.socket !== 'undefined') {
                        $rootScope.socket.emit('dropBoxEvent', {
                            message: '[DropBox Operation End-Error] : ShareLink [query] :' + path + ' [access_token] :' + access_token + ' [user_token] ' + localStorage.getItem('compteId')
                        });
                    }
                    deferred.resolve(null);
                });
                return deferred.promise;
            },
            download: function(path, access_token, dropbox_type) {
                if (typeof $rootScope.socket !== 'undefined') {
                    $rootScope.socket.emit('dropBoxEvent', {
                        message: '[DropBox Operation Begin] : Download [query] :' + path + ' [access_token] :' + access_token + ' [user_token] ' + localStorage.getItem('compteId')
                    });
                }
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: 'https://api-content.dropbox.com/1/files/' + dropbox_type + '/' + path + '?access_token=' + access_token
                }).success(function(data) {
                    if (typeof $rootScope.socket !== 'undefined') {
                        $rootScope.socket.emit('dropBoxEvent', {
                            message: '[DropBox Operation End-Success] : Download [query] :' + path + ' [access_token] :' + access_token + ' [user_token] ' + localStorage.getItem('compteId')
                        });
                    }
                    deferred.resolve(data);
                    return deferred.promise;
                }).error(function() {
                    if (typeof $rootScope.socket !== 'undefined') {
                        $rootScope.socket.emit('dropBoxEvent', {
                            message: '[DropBox Operation End-Error] : Download [query] :' + path + ' [access_token] :' + access_token + ' [user_token] ' + localStorage.getItem('compteId')
                        });
                    }
                    deferred.resolve(null);
                });
                return deferred.promise;
            },
            rename: function(oldFilePath, newFilePath, access_token, dropbox_type) {
                if (typeof $rootScope.socket !== 'undefined') {
                    $rootScope.socket.emit('dropBoxEvent', {
                        message: '[DropBox Operation Begin] : Rename [query] : Old -> ' + oldFilePath + ' New -> ' + newFilePath + ' [access_token] :' + access_token + ' [user_token] ' + localStorage.getItem('compteId')
                    });
                }
                var deferred = $q.defer();
                console.log('in service ==> ');
                console.log('https://api.dropbox.com/1/fileops/copy?root=' + dropbox_type + '&from_path=' + oldFilePath + '&to_path=' + newFilePath + '&access_token=' + access_token);
                $http({
                    method: 'POST',
                    url: 'https://api.dropbox.com/1/fileops/copy?root=' + dropbox_type + '&from_path=' + oldFilePath + '&to_path=' + newFilePath + '&access_token=' + access_token
                }).success(function(data) {
                    if (typeof $rootScope.socket !== 'undefined') {
                        $rootScope.socket.emit('dropBoxEvent', {
                            message: '[DropBox Operation End-Success] : Rename [query] : Old -> ' + oldFilePath + ' New -> ' + newFilePath + ' [access_token] :' + access_token + ' [user_token] ' + localStorage.getItem('compteId')
                        });
                    }
                    deferred.resolve(data);
                    return deferred.promise;
                }).error(function() {
                    if (typeof $rootScope.socket !== 'undefined') {
                        $rootScope.socket.emit('dropBoxEvent', {
                            message: '[DropBox Operation End-Error] : Rename [query] : Old -> ' + oldFilePath + ' New -> ' + newFilePath + ' [access_token] :' + access_token + ' [user_token] ' + localStorage.getItem('compteId')
                        });
                    }
                    deferred.resolve(null);
                });
                return deferred.promise;
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