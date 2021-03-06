/* File: delegate-profile.modal.js
 *
 * Copyright (c) 2013-2016
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
/* jshint loopfunc:true */

angular.module('cnedApp')
    .controller('DelegateProfileModalCtrl', function ($rootScope, $scope, $uibModalInstance,
                                                      EmailService, UserService, LoaderService, ToasterService,
                                                      profilsService, $location, profile) {

        $scope.form = {
            email: ''
        };

        $scope.delegateProfile = function () {

            if (!$scope.form.email || $scope.form.email.length <= 0) {
                ToasterService.showToaster('#profile-delegate-success-toaster', 'profile.message.delegate.save.ko.email.mandatory');
            } else if (!EmailService.verifyEmail($scope.form.email)) {
                ToasterService.showToaster('#profile-delegate-success-toaster', 'profile.message.delegate.save.ko.email.invalid');
            } else if ($scope.form.email === UserService.getData().email) {
                ToasterService.showToaster('#profile-delegate-success-toaster', 'profile.message.delegate.save.ko.yourself');
            } else {
                LoaderService.showLoader('profile.message.info.delegate.inprogress', false);


                profilsService.delegateProfile(profile, $scope.form.email)
                    .then(function (delegatedProfile) {
                        var profilLink = 'https://' + window.location.host + '/#/detailProfil?idProfil=' + delegatedProfile.data._id;
                        var fullName = UserService.getData().firstName + ' ' + UserService.getData().lastName;
                        var emailParams = {
                            emailTo: $scope.form.email,
                            content: '<span> ' + fullName + ' vient d\'utiliser Accessidys pour vous déléguer son profil : <a href=' + profilLink + '>' + profile.data.nom + '</a>. </span>',
                            subject: 'Profil délégué'
                        };

                        EmailService.sendEMail(emailParams).then(function () {
                            LoaderService.hideLoader();

                            $uibModalInstance.close({
                                message: 'mail.send.ok',
                                profile: delegatedProfile
                            });
                        }, function () {
                            LoaderService.hideLoader();

                            $uibModalInstance.close({
                                message: 'mail.send.ko',
                                profile: delegatedProfile
                            });
                        });

                    }, function () {
                        LoaderService.hideLoader();

                        $uibModalInstance.close({
                            message: 'profile.message.delegate.ko'
                        });
                    });

            }

        };

        $scope.dismissModal = function () {
            $uibModalInstance.dismiss();
        };
    });