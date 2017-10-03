/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// DO NOT EDIT THIS GENERATED OUTPUT DIRECTLY!
// This file should be overwritten as part of your build process.
// If you need to extend the behavior of the generated service worker, the best approach is to write
// additional code and include it using the importScripts option:
//   https://github.com/GoogleChrome/sw-precache#importscripts-arraystring
//
// Alternatively, it's possible to make changes to the underlying template file and then use that as the
// new base for generating output, via the templateFilePath option:
//   https://github.com/GoogleChrome/sw-precache#templatefilepath-string
//
// If you go that route, make sure that whenever you update your sw-precache dependency, you reconcile any
// changes made to this original template file with your modified copy.

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
'use strict';

var precacheConfig = [["404.html","f7d75365986d778a6ce5d105c0ef8f0b"],["bower_components/Hyphenator/Hyphenator.js","eb9d26f023a8bf2663f4a43429b85cc2"],["bower_components/Hyphenator/patterns/fr.js","1304c305f5656bed6c27e0351135ac64"],["bower_components/angular-animate/angular-animate.js","74438d99a8a87201f038e62566a99cb2"],["bower_components/angular-audio/app/angular.audio.js","77d8b583fc0275ace4e31e68e21d2371"],["bower_components/angular-bootstrap/ui-bootstrap-tpls.js","61e731c195def9b1d3e9d6cf216761c7"],["bower_components/angular-cookie-law/dist/angular-cookie-law.min.css","743295a9c86046f4a2e6e4bc8baafde9"],["bower_components/angular-cookie-law/dist/angular-cookie-law.min.js","e7e9b69f23b632cc921300f737981083"],["bower_components/angular-cookies/angular-cookies.js","45247314caed58833d9bf4931cb19ab4"],["bower_components/angular-gettext/dist/angular-gettext.js","282c3638673fb40b129d5f4c96dbe510"],["bower_components/angular-google-analytics/dist/angular-google-analytics.min.js","c6864fe293ed75677da3865c9ae14474"],["bower_components/angular-localforage/dist/angular-localForage.js","2de9f61b63a64ce68747b711cc8d3346"],["bower_components/angular-md5/angular-md5.js","7e6a582bf9108b3ae2bf9a8abcc73f64"],["bower_components/angular-resource/angular-resource.js","4696e2ecfca106286b177f2cbacb677e"],["bower_components/angular-sanitize/angular-sanitize.js","b6244968217e29f4525eb36356184b81"],["bower_components/angular-slick/dist/slick.js","51c86e2e2be478d20ea1d70ac9dabbcf"],["bower_components/angular-socialshare/dist/angular-socialshare.min.js","989b57b08ed49901153b7b227f770d00"],["bower_components/angular-ui-router/release/angular-ui-router.js","4e2a8f871e11b164023af6bbbb6e69b7"],["bower_components/angular/angular.js","b316d701fa4be7c67adf520739451e7f"],["bower_components/bootstrap/dist/css/bootstrap.min.css","ec3bb52a00e176a7181d454dffaea219"],["bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2","448c34a56d699c29117adc64c43affeb"],["bower_components/components-font-awesome/css/font-awesome.css","b652e3b759188ceaf79182f2fe72ea64"],["bower_components/components-font-awesome/fonts/fontawesome-webfont.woff2","e6cf7c6ec7c2d6f670ae9d762604cb0b"],["bower_components/cropperjs/dist/cropper.css","b051282a6774053771f9e8fcc9653ab6"],["bower_components/cropperjs/dist/cropper.js","f4c5d1391267a7736e35a6bf3346484c"],["bower_components/docxtemplater/build/docxtemplater-latest.js","cee11a9a4a61944af9bbafb35f74e772"],["bower_components/jquery/dist/jquery.js","09dd64a64ba840c31a812a3ca25eaeee"],["bower_components/jszip/dist/jszip.js","c8afca83d7293ae175fd9495ff61cbba"],["bower_components/localforage/dist/localforage.js","567a61636f30cda113f0d07bfc139d59"],["bower_components/matchmedia/matchMedia.js","89f369588d629240d6a8d4f8788490c8"],["bower_components/ngSticky/lib/sticky.js","3b4fb63f3f86ab60a1504936e473de47"],["bower_components/pdfjs-dist/build/pdf.js","fdb15d20a3596431a8c48d1d1dbfaa64"],["bower_components/pdfjs-dist/build/pdf.worker.js","9e951764f26e1c33c21165119dd944ac"],["bower_components/rangy/rangy-classapplier.js","bd8ce9293ad7775c3fad036979f8d4d6"],["bower_components/rangy/rangy-core.js","cb6799dfcd008465f26237be80374afd"],["bower_components/rangy/rangy-highlighter.js","182fa696767f6596c9ee50cb5c322ef8"],["bower_components/rangy/rangy-selectionsaverestore.js","1794478afd743d5225ca17f01f53c9a3"],["bower_components/rangy/rangy-serializer.js","8fecad6a7343a0c6ebce534b0f657219"],["bower_components/rangy/rangy-textrange.js","9285a26252301263bd14367af903029c"],["bower_components/slick-carousel/slick/slick-theme.css","8aa2ab903843cf2a5cff1e31165d44ec"],["bower_components/slick-carousel/slick/slick.css","a232721a254de00caf73d5a16a0b78b3"],["bower_components/slick-carousel/slick/slick.min.js","ebcbc22f8c948f222c19e6bde99a776d"],["bower_components/textAngular/dist/textAngular-sanitize.js","e57c138140ffb30086834e9b607c52d1"],["bower_components/textAngular/dist/textAngular.css","5987ee6bbafddf53c0345cde3a3fb39e"],["bower_components/textAngular/dist/textAngular.js","635fc33ab6b595d3bf66df7aa0bc01d7"],["bower_components/textAngular/dist/textAngularSetup.js","c76c3e379c778137b49696a378f5bd52"],["bower_components/underscore/underscore.js","f893e294cde60c2462cb19b35aac431b"],["external_components/jQuery.line/jquery.line.js","0721bc7a02bd8f21439b6a30fc468b67"],["external_components/jQuery.line/jquery.line.min.js","0721bc7a02bd8f21439b6a30fc468b67"],["external_components/sselect/jquery.customSelect.min.js","0212de77848bab70b670586c782a2f4f"],["external_components/tesseract.js/tesseract.js","81fdbf263f09bd37cd3423b4d712ea0b"],["external_components/tesseract.js/worker.js","bdf262ccf44f5e1957b1ff0ed9936488"],["index.html","d8bb5d4406d7631f7ed71e796cc440db"],["scripts/app.js","00e1f398483eefdfbaea62f688239dfa"],["scripts/controllers/addDocument/addDocument.js","c74a4b6364b9e0db7b027fb2eaa51e6d"],["scripts/controllers/addDocument/edit-document-title.modal.js","0f4e2b229e5a867eb4de2e49b22f2ff7"],["scripts/controllers/addDocument/open-document.modal.js","0288279721d0a5e6bc95ac8656a56a4f"],["scripts/controllers/backup/my-backup.js","5ff703ea72d50cda815623f6d5cc3829"],["scripts/controllers/common/bookmarklet.modal.js","4f1499b77e54a44d937ac3e14c1ce734"],["scripts/controllers/common/common.js","8a7658e859ba8cda2c284b8d42aa25de"],["scripts/controllers/common/confirm.modal.js","e37b33b81a5193d189c9f947110f450b"],["scripts/controllers/common/information.modal.js","9b7e01162e6e5ee1641c9ff1c9b8a967"],["scripts/controllers/infoPages/vocalHelpModal.js","9ea20c9334a7cf21f39bd4af163dccd0"],["scripts/controllers/listDocument/listDocument.js","58bfdc6e3ddab065f3cdeba3697745b0"],["scripts/controllers/ocr/ocr.modal.js","f02c92bfca2fcc375971dc7c8fe682e0"],["scripts/controllers/profiles/delegate-profile.modal.js","f4ed67f04cecfec6100942b87a4aca4c"],["scripts/controllers/profiles/detailProfilModal.js","81c70831046e53b77dc4261e747e72bb"],["scripts/controllers/profiles/profiles.js","ee86f6c3cb0cca775a5ee7b1ab7667e6"],["scripts/controllers/profiles/renameProfilModal.js","0457d9c3db12a0205fc34ac5ff15b36b"],["scripts/controllers/profiles/styleEditModal.js","7b0f7cffc1efc17b4a0bb5816c23256a"],["scripts/controllers/profiles/vocal-synthesis-settings.modal.js","b4e7e8aa49e5e8bc53940c0248367fd5"],["scripts/controllers/social-share/social-share.modal.js","e4977ad5239092d64003603719a99d52"],["scripts/controllers/synchronisation/synchronisationModal.js","4e75957948e5b448cadf37a0a6dcec8b"],["scripts/controllers/tag/edit-tag.modal.js","e6f45f8bed7a32e2ee617414b47c7e70"],["scripts/controllers/tag/tag.js","c160bf67172ec9a74bf6cd0030177b3c"],["scripts/controllers/workspace/apercu.js","3edd85c3f3cfbaecbbff4f8d63e30d16"],["scripts/controllers/workspace/listDocumentModal.js","7be145074842f58694534a1f20ef1732"],["scripts/controllers/workspace/print.js","eaa443ae4788c4e830255ff61e865c44"],["scripts/controllers/workspace/print.modal.js","86c4f568f3d410ffa1fe3b6aedc94136"],["scripts/directives/bodyClasses.js","206701da9d1d6e4e58edfe78aea295af"],["scripts/directives/image-menu.directive.js","f5f8a005d410b05c87628e2ee34b11d0"],["scripts/directives/profileColoration.js","d3f8db6d752f3b600a3d4884dd47dfdf"],["scripts/directives/regleStyle.js","1a27286eedbb943d71d259abd181a8d3"],["scripts/directives/sselect.js","f167d2e84b8d3084cbc549d91a1ffcec"],["scripts/directives/textangular-profile-coloration.directive.js","da64979da2a3fe492b70fda894525223"],["scripts/directives/uploadFile.js","e3e64e3ad9a7be8e7a2e353c45649982"],["scripts/directives/vocalSynthesis.js","fb5730785b350074891762aab9c6b502"],["scripts/service-worker-registration.js","d60f01dc1393cbaaf4f7435339074d5e"],["scripts/services/config.js","f258b7435bf97cf6853d34069d8898db"],["scripts/services/documentService.js","4d65b83f1188b43c534d7a057d0dcb5c"],["scripts/services/email.service.js","f2c5c301bbe4b51f21caff3a7e6a6483"],["scripts/services/fileStorageService.js","3e4968ed606afd1bdce3555297f15bb4"],["scripts/services/helpers.js","773d5f832e07cccc7b1a2e9f5b4619db"],["scripts/services/htmlEpubConverter.js","21d3f6bd950e6a68dacfdbdbd26a7134"],["scripts/services/keyboardSelectionService.js","c9f9647e74773bfbf3cfdc4f2a181d71"],["scripts/services/loader.service.js","db9fda718ff67d891881bfea01405f1c"],["scripts/services/oauth.service.js","7e4ec516e1e709d8acb214602d3dfcf4"],["scripts/services/profilsService.js","5508958266b2dcdaff6b901eb4693f1b"],["scripts/services/providers/cache.provider.js","585bf412ca895c98a54fc3344fe77402"],["scripts/services/providers/dropbox.provider.js","7ab41889840d5172a2ce1e58a46f928f"],["scripts/services/speechService.js","2657727c0c83d6c6ca9e1f0dde0025b5"],["scripts/services/tagsService.js","51b43d462d56f0fb08b48aa2573c0d8c"],["scripts/services/toaster.service.js","35a448a98c635a6378ac8f51fdcec0a6"],["scripts/services/user.service.js","136e33b0653fe6f844e8ba3af35329bd"],["scripts/services/utils.service.js","3fd99a830cdc84fe219d52b6f6f8708d"],["scripts/services/workspaceService.js","280e5db1e5e64747a999b97dddddabee"],["scripts/translations.js","9514a32d07f04e6df161d64fad3910e6"],["styles/animate.css","4107e5f111b7c3d67098bbdc91a4bcb7"],["styles/animate.min.css","f26278a5448c4b5817629ec8de8d426c"],["styles/fonts/andika/AndikaNewBasic-Bold.eot","da903696c180aaa579efd67c1ffb5071"],["styles/fonts/andika/AndikaNewBasic-Bold.ttf","62097f2f3a4bc41a9bdc9ae59c831591"],["styles/fonts/andika/AndikaNewBasic-Bold.woff","25f55a04a8249102c0499198569ce444"],["styles/fonts/andika/AndikaNewBasic-Regular.eot","b504a1acadc7d1f06f76f87bf7dbd675"],["styles/fonts/andika/AndikaNewBasic-Regular.ttf","a98c1f1c220ec3a9d437e420fc6285e6"],["styles/fonts/andika/AndikaNewBasic-Regular.woff","964b0901705bc401ef68e2c3ff546c3b"],["styles/fonts/calibri/OpenSans-CondensedBold.eot","790124b969eecee70568d595f0ff9d35"],["styles/fonts/calibri/OpenSans-CondensedBold.ttf","c28df5d67b8e0fd14ff07235537b1c77"],["styles/fonts/calibri/OpenSans-CondensedBold.woff","16a153ac53c3586b7aba70b2b22660ad"],["styles/fonts/calibri/OpenSans-CondensedLight.eot","fa14197303c518730834928698573cee"],["styles/fonts/calibri/OpenSans-CondensedLight.ttf","78a0d7e644be8aa2110679f957a5b0db"],["styles/fonts/calibri/OpenSans-CondensedLight.woff","fd21219e026578d543dae9feee09dc7d"],["styles/fonts/century/EssenceSans.eot","241fc9b5d31b5a90e33849a5ecfa6f10"],["styles/fonts/century/EssenceSans.ttf","fa1953351efd4d820a44c9fe7aa12837"],["styles/fonts/century/EssenceSans.woff","464a4ecba9117d359104f0ef5ee5812b"],["styles/fonts/century/EssenceSansBold.eot","3c2332267dabc556ff44ba13316c986e"],["styles/fonts/century/EssenceSansBold.ttf","3b89198108985252758c28b90b65afe7"],["styles/fonts/century/EssenceSansBold.woff","d259d1025be43db18d9fed6510f42042"],["styles/fonts/comic/LDFComicSans.eot","f6fa6b1606f56566d58db4608ddbc8ca"],["styles/fonts/comic/LDFComicSans.ttf","847a306030a53f6399592d10c679b8e4"],["styles/fonts/comic/LDFComicSans.woff","445d9a949830156868ffa37b2050dfd2"],["styles/fonts/comic/LDFComicSansBold.eot","d2e70ccd54921b1f3ae72982417ff164"],["styles/fonts/comic/LDFComicSansBold.ttf","be52e4de7e5d62de5e40f5ec1e5b5922"],["styles/fonts/comic/LDFComicSansBold.woff","ced4d7f3ae504fb28ecdaeef9fb06e99"],["styles/fonts/helvetica/HalvettCondensed.eot","e15b631887832548c724c7506f65189c"],["styles/fonts/helvetica/HalvettCondensed.svg","6e52ec6f2be72e8bde7c00913e50a75b"],["styles/fonts/helvetica/HalvettCondensed.ttf","04e1488a4210a45bdf037babb582b87c"],["styles/fonts/helvetica/HalvettCondensed.woff","bc55eac5f0b2d3474622b97f65d28196"],["styles/fonts/helvetica/HelveticaNeueLTPro-BdCn.eot","e173a4d035c81cbc3ab1c771e4f0b8b5"],["styles/fonts/helvetica/HelveticaNeueLTPro-BdCn.otf","d02850ad88ddba271e921062340a80c4"],["styles/fonts/helvetica/HelveticaNeueLTPro-BdCn.svg","2d3f837d8859c5c8eea94d8f9722d8ef"],["styles/fonts/helvetica/HelveticaNeueLTPro-BdCn.ttf","f9b01d920567cdd58e4b82fb8ecf00f7"],["styles/fonts/helvetica/HelveticaNeueLTPro-BdCn.woff","27da6583465f511296d7b701675bd0d8"],["styles/fonts/helvetica/HelveticaNeueLTPro-HvCn.eot","05ac15fc8916fb57c04d9e37507d4b24"],["styles/fonts/helvetica/HelveticaNeueLTPro-HvCn.otf","d53b7ca7223f20d0b20f4c5e818bce37"],["styles/fonts/helvetica/HelveticaNeueLTPro-HvCn.svg","2a431f7f398ae5e43d30dc51ce7cb38f"],["styles/fonts/helvetica/HelveticaNeueLTPro-HvCn.ttf","87ecfa340cc420c646b20cf26c690aac"],["styles/fonts/helvetica/HelveticaNeueLTPro-HvCn.woff","89887976f8725b5765de1fbb5f7bccc3"],["styles/fonts/helvetica/HelveticaNeueLTPro-LtCn.eot","936ccb196f385841ec0cd4ef0fe01471"],["styles/fonts/helvetica/HelveticaNeueLTPro-LtCn.otf","88b7965748f0bbcbbfb650f27b36dfbd"],["styles/fonts/helvetica/HelveticaNeueLTPro-LtCn.svg","4b7cc29034f5410362a1ca8d924dbac8"],["styles/fonts/helvetica/HelveticaNeueLTPro-LtCn.ttf","7703a5d06c2cd0ed360c5e7a8b303f3d"],["styles/fonts/helvetica/HelveticaNeueLTPro-LtCn.woff","e39f6ace40e3adac22827c122760f83d"],["styles/fonts/helvetica/HelveticaNeueLTPro-ThCn.eot","19596c8a5df5c8383ff362a22f1af545"],["styles/fonts/helvetica/HelveticaNeueLTPro-ThCn.otf","6890c37fcb412a73f511c0ae1530887a"],["styles/fonts/helvetica/HelveticaNeueLTPro-ThCn.svg","99f1ef5b34f331c33ad28c50196111e2"],["styles/fonts/helvetica/HelveticaNeueLTPro-ThCn.ttf","b7f284eda6d0b5645baef13fd0974110"],["styles/fonts/helvetica/HelveticaNeueLTPro-ThCn.woff","bcff6715b6bcb84113a623af8858c452"],["styles/fonts/lexia/AnonymousPro-Bold.eot","dbbc7b4f3bd24ea09a2f6fd6352b4f2e"],["styles/fonts/lexia/AnonymousPro-Bold.ttf","1d171b5399fc5e28f3bb72d7dd959d7f"],["styles/fonts/lexia/AnonymousPro-Bold.woff","c3396be0f5d88040259ae7e4ade2c51d"],["styles/fonts/lexia/AnonymousPro.eot","90418edb99ec509a7bee1c553196cb8a"],["styles/fonts/lexia/AnonymousPro.ttf","1a728ab67ea9383bdb7ceb425d373ede"],["styles/fonts/lexia/AnonymousPro.woff","f0fb7846ad64322a0902d8f07b251609"],["styles/fonts/lucida/Code New Roman b.otf","53cf9f3345bd6d105661657c53486480"],["styles/fonts/lucida/Code New Roman b.woff","23dc6c9de9aeef54c3c932fef0a7d6b4"],["styles/fonts/lucida/Code New Roman.otf","7b686ce45581c736b00593fddd544e94"],["styles/fonts/lucida/Code New Roman.woff","73cfea40d4c1e46e0e3e7094b690d59f"],["styles/fonts/lucida/CodeNewRoman-Bold.eot","a1765cc398d693f119e29653533e5e8d"],["styles/fonts/lucida/CodeNewRoman-Bold.ttf","555ee9baca1355c311b116eee627e911"],["styles/fonts/lucida/CodeNewRoman-Bold.woff","d918e50261a16c3ef0292a3737e707af"],["styles/fonts/lucida/CodeNewRoman.eot","bf648dd303efcb27b302d216959bdad5"],["styles/fonts/lucida/CodeNewRoman.ttf","208d27993fc37c188793fb7034be7667"],["styles/fonts/lucida/CodeNewRoman.woff","eb8e5d473a2968b2817c854e660d2a56"],["styles/fonts/opendyslexic-regular-webfont.eot","38814d683430c56833dc1b3e823312bb"],["styles/fonts/opendyslexic-regular-webfont.svg","6597ead61d0d67c0a1b7823c4c504550"],["styles/fonts/opendyslexic-regular-webfont.ttf","0d814f8e09874b0bf3db68ffcaf0e582"],["styles/fonts/opendyslexic-regular-webfont.woff","af0f6faa895ee1dde89b2f1ba73a2f26"],["styles/fonts/tahoma/SignikaNegative-Bold.eot","1fa722438ed601c799328ab4e9b4c213"],["styles/fonts/tahoma/SignikaNegative-Bold.ttf","8de0d9513edec990658e47f19214ba60"],["styles/fonts/tahoma/SignikaNegative-Bold.woff","49ae35f84f7f5a96a3ce35c89015cd19"],["styles/fonts/tahoma/SignikaNegative-Regular.eot","1ceb9363c3abff3c21cf2e4c967c61aa"],["styles/fonts/tahoma/SignikaNegative-Regular.ttf","c4e2aa44f59f3392ab37e9492e57bd42"],["styles/fonts/tahoma/SignikaNegative-Regular.woff","d1c0457a792babb880f6132bf7c5f7ee"],["styles/fonts/tiresias/TiresiasInfofont.eot","81e5fdacf0d74fd2780b3e102f7bcf36"],["styles/fonts/tiresias/TiresiasInfofont.ttf","f2354560146869fddf1471617d66c0e6"],["styles/fonts/tiresias/TiresiasInfofont.woff","b3a76de30862addd71c2d12ee413b786"],["styles/fonts/tiresias/TiresiasInfofontItalic.eot","f47a019f72f1dcdded86df96804a2980"],["styles/fonts/tiresias/TiresiasInfofontItalic.ttf","738b4ab574779fda11e3d983076b4a5e"],["styles/fonts/tiresias/TiresiasInfofontItalic.woff","1131a09de5246f57383cd82386822fca"],["styles/fonts/trebuchet/FiraSansCondensed-Bold.eot","bf0ce31bace0446de3cc9cb7dd7d88cf"],["styles/fonts/trebuchet/FiraSansCondensed-Bold.ttf","f1d04b062eefe8ed1ddd53b062fc4d15"],["styles/fonts/trebuchet/FiraSansCondensed-Bold.woff","9b2ca8f195d8a2fcc778dc6502bfb294"],["styles/fonts/trebuchet/FiraSansCondensed-Regular.eot","bb884898e0d6c3a5f31586f36b9e52b8"],["styles/fonts/trebuchet/FiraSansCondensed-Regular.ttf","9db64d7a9aa424cf5dffb9716eb4e308"],["styles/fonts/trebuchet/FiraSansCondensed-Regular.woff","4e41afa6c66dacd8cac12319228fc3b2"],["styles/fonts/verdana/HKGrotesk-Bold.eot","fa31a39d25438f1b6ac2e6a4096bc06e"],["styles/fonts/verdana/HKGrotesk-Bold.ttf","77270bd40db0edeb7162fdf2e4f93698"],["styles/fonts/verdana/HKGrotesk-Bold.woff","071aa8c33cc4f9670ce53b05e06c84ba"],["styles/fonts/verdana/HKGrotesk-Regular.eot","7768afa25fc60ee4bd802633828ab471"],["styles/fonts/verdana/HKGrotesk-Regular.ttf","0b912bc6beb29980ddf1f72a31607bd7"],["styles/fonts/verdana/HKGrotesk-Regular.woff","5abd7924ff7376f5e9aef7185b8cd95c"],["styles/images/Dropbox-icon.png","67413ca5d38777b00de8bd1f27b7ecee"],["styles/images/FAQ/Actions sur les profils.png","ec865794cdf1ba58ee162b781fe851ad"],["styles/images/FAQ/Creer un profil.png","77b2829b9b07d5c23b4c197ae647c969"],["styles/images/FAQ/Editeur.png","2a94d3aa0388f4dbfb60ea801fda7f11"],["styles/images/FAQ/HomeMenu.png","4aa3fb533e351198faecc1a6fc4d0aa7"],["styles/images/FAQ/Liste de profil.png","377c4f924ee7c372a77db5d6492bb35f"],["styles/images/FAQ/Liste de profils.png","10862a8c687b4d661a18fbb3f016c440"],["styles/images/FAQ/Mes profils 1.png","fe28851cfd6517cb77983920f00d224c"],["styles/images/FAQ/Modifier le profil.png","878dc18ea9b046e0077bd0877c1686e5"],["styles/images/FAQ/Modifier un doc menu de droite.png","9fb5b1020a7c87a0bee5f0526cfbd111"],["styles/images/FAQ/Modifier un doc.png","64a7a507d0280c21b066a8bbc473d6db"],["styles/images/FAQ/Ouvrir un doc.png","a0c98295c95871bf680d0d8c97a83f86"],["styles/images/FAQ/Reconnaissance 2.png","df43e17f20a4e80f8ed4f508f5897072"],["styles/images/FAQ/Reconnaissance.png","cad39e3bf07f42cfeb4d41cc73cb59c2"],["styles/images/FAQ/Reconnaissance3.png","56eca39ce6d4e3956879334c7ebeea5b"],["styles/images/FAQ/Reconnaissance4.png","04325809b2f81b5cf8585809a6ee26bc"],["styles/images/FAQ/Reconnaissance5.png","34a2fa4e1f972ba15bb994ef3e1e2aa2"],["styles/images/FAQ/Sauvegarde1.png","72fceb0b7f514d1a64c491c31719e484"],["styles/images/FAQ/Sauvegarde2.png","5acec90253a3944e9a4f0ddbc97cb44d"],["styles/images/FAQ/Sauvegarde3.png","6d82da88ea8e066dfb280bd1ce47ad57"],["styles/images/FAQ/Sauvegarde4.png","d10e7248f2bb9b8aea4ea1ec00fc9460"],["styles/images/FAQ/Synthèse vocale.png","d59cb0dcba8c9ae563dea70f65112ebf"],["styles/images/FAQ/Web adapte.png","c2ba312db63ae70dd5d836ef77d35fe8"],["styles/images/FAQ/Web adapté 2.PNG","a1a66d3a6ebce10f41e1e6266b47e285"],["styles/images/FAQ/Web adapté.PNG","818bbb4cd252618251a80b4a8e545e61"],["styles/images/FAQ/Web-adapte-2.PNG","a1a66d3a6ebce10f41e1e6266b47e285"],["styles/images/FAQ/Web-adapte.PNG","818bbb4cd252618251a80b4a8e545e61"],["styles/images/Home/VisuelAccessiDys1200x630-2.png","bacf984bd63fce3366a568dbe4620150"],["styles/images/Home/VisuelAccessiDys1200x630-3.png","74ce0a362d80c27e24b9e9fe17473c59"],["styles/images/Home/VisuelAccessiDys1200x630-4.png","e8c38a1d78d696baf488084069e2036a"],["styles/images/Home/VisuelAccessiDys1200x630-5.png","49e06e65b357aaa99d69ef1a6ea75fa2"],["styles/images/Home/VisuelAccessiDys1200x630.png","710610129273ede1e432a0a6a7923d12"],["styles/images/Home/picto_aide.png","b16b0dae7772030f594b1da1d946bd01"],["styles/images/Web adapte.png","c2ba312db63ae70dd5d836ef77d35fe8"],["styles/images/accepte_delegate.png","92ab2371d969e6b2f5cedb9f4a9354a8"],["styles/images/action--.png","54cd565b3ec0b9fbc2ee47e9f3062612"],["styles/images/action-.png","622b86bff10635f84f33e5973421a222"],["styles/images/action.png","18a17175f3e7a899084c6ba5db22e30d"],["styles/images/action_show.png","cf5700393818f0618daabac62ef08ce6"],["styles/images/add_document.png","3cf9bf528cff635975676cb24a5823df"],["styles/images/add_profile.png","ba26b3fe6bc2718ee4ba0592f96b2feb"],["styles/images/add_tag.png","1481d54708f20fd6723c1b23d8b66797"],["styles/images/ajax-loader.gif","3c781db697b02c8ac3ac0289b752ed77"],["styles/images/annotation/collapse_note.png","49129759fb2a0c409564b68dd040884a"],["styles/images/annotation/delete_note.png","75198af7a5593ea5fb0c174b4f1b9c88"],["styles/images/annotation/drag_note.png","85239205921205c4e7cb305eb89d349c"],["styles/images/annotation/edit_save_icn.png","a902af68edce24f22f084ed68967538d"],["styles/images/annotation/has_note.png","66969f5929f7326c7e87a21055dea851"],["styles/images/apercu_sidebar/annotaion.png","89546bb02ea6af1891e991970472f005"],["styles/images/apercu_sidebar/close_apercu.png","23216cae17643c2d40b1d8d75448e7c7"],["styles/images/apercu_sidebar/copy.png","9196e1344d4e673c175a0f9460c6278a"],["styles/images/apercu_sidebar/first.png","b0280aebf911ca0f61e79f27006fe9cd"],["styles/images/apercu_sidebar/last.png","dfbc304ededec768329ae06f2fd692bd"],["styles/images/apercu_sidebar/lecture_apercu.png","b5e285d15d773588aac5f2ca3bfca0db"],["styles/images/apercu_sidebar/list-document.png","2ff09b01a909456a2251871409903bcb"],["styles/images/apercu_sidebar/next.png","40858b4777c046dcdc123afd0723d319"],["styles/images/apercu_sidebar/page_apercu.png","15b97b3fb74687f081072502f65cfe70"],["styles/images/apercu_sidebar/plan.png","cfc21c65f2ebc8fc36db1dd02e2067cf"],["styles/images/apercu_sidebar/prev.png","996cb9f5942cd7b62d5dd5116e64fb5f"],["styles/images/apercu_sidebar/print_apercu.png","ca50110a73a8426d53d02272fa75e41d"],["styles/images/apercu_sidebar/reduire_apercu.png","9f77f52ef5c43661c19769a242e5f3da"],["styles/images/apercu_sidebar/resize_apercu.png","34494772127769965425f455754b0669"],["styles/images/apercu_sidebar/restructer.png","30cd368933b03a8f019b442c36907e7e"],["styles/images/apercu_sidebar/shadow.png","e8b66b47b50d7d4cdc40f005cf10721d"],["styles/images/apercu_sidebar/share_apercu.png","2f1696707f00d06fcabd1556d4ce79eb"],["styles/images/apercu_sidebar/switch_mode.png","6ef78d71b2bdf3c0b3a63f8cd60a7b00"],["styles/images/applicated_tag.png","a65a2230c3d879df82102d26ea0d0d95"],["styles/images/audio_generate.png","edb7cd0d6683c1f8d300e82fc65c6704"],["styles/images/audio_genere.png","bd0664d9883746948d76fd75bc0d7f3e"],["styles/images/back_icn.png","83de6eedf7f50c8cc56c7271f48a33b5"],["styles/images/blocker_bg.png","c6f717964f387072863926e9e9afab80"],["styles/images/body_bg.png","3bae3565d3459477f724f9551e0d04d5"],["styles/images/bookmarklet_btn.png","4572f79416d09e59fd2294fa73ec3e78"],["styles/images/bookmarklet_howto.png","07e95bdfcc592a715cf758fc83dad64a"],["styles/images/bulb_icn.png","05430f95b49e68c03bd4a7393da8bdd0"],["styles/images/checkbox_mask.png","8c010aae937d7aae734b61f471752beb"],["styles/images/chrome_browser.png","17904f1935669ee8e7ab87ed440aa392"],["styles/images/clear_uploadpdf.png","2e1f6a15bfedde827ba40f4028c17a66"],["styles/images/close_icn.png","98e127038af46fb2871e627f94eca036"],["styles/images/close_tuto_icn.png","2ceb10c3d3f6299dee056a1ca7715b10"],["styles/images/current_doc.png","01256da1da7850fcc783bfa719c26e92"],["styles/images/decrease_speed.png","a99d257681911ad6512d037497030d58"],["styles/images/decrease_volume.png","b36bfd36c56d5cd9ddbe30f399aba504"],["styles/images/delete_layer.png","6b0efcfdeafafcd3ea62e9c98ee16245"],["styles/images/delete_tag.png","1204cd7b7b4530ea982e88eb90b63a54"],["styles/images/delete_txt.png","76a1b056a5f4d6bd627e16fd0c5fb055"],["styles/images/docs.png","ab4ffdd01f065fd9f1c2d590b0e8d935"],["styles/images/docs_link.png","44124fd0c6c1910670369984017eaece"],["styles/images/dotted-bg.jpg","0fe2a4e19e32c7859b0982ed593461f4"],["styles/images/dotted_bg.png","cc23e20edd4cc284f366b3ca5df9a251"],["styles/images/drop_down.png","795e16b6dfc1abf55902c8121e988393"],["styles/images/dropbox.png","1408a957f2797cf0165b1e492dcf895a"],["styles/images/duplicate_icn.png","318b73483eed40f193d829d411b05250"],["styles/images/duplicate_layer.png","9196e1344d4e673c175a0f9460c6278a"],["styles/images/duplicate_layer_ws.png","ce1352c2d3fbfd2834c154755cb26c4d"],["styles/images/duplicatet_txt.png","33e92ed88c3945ae6fc47c309ff7d7fb"],["styles/images/duplicating.png","ac00a7aba6ff105080417669433d21bc"],["styles/images/edit_icn.png","2bfbe69ea7099ce673c4d911acbe0f2b"],["styles/images/edit_txt.png","16b6d4977339e50e9e42679386c79330"],["styles/images/fancy-bookmarklet.png","3e6972f607a8e21ae5f316e382388aff"],["styles/images/favicon.ico","0702da18b1df17b88c9538b9cc7fb190"],["styles/images/favourit_icn.png","a989f87978e5409580eccf8f08a77000"],["styles/images/fb_share.jpg","a37e4e2104e3718c2a05ffd3aafe187f"],["styles/images/firefox_browser.png","fd7b67473017f1ded916ceaa40cb21d2"],["styles/images/gplus_share.jpg","30f6cf38413ce16ae82d98e47851b808"],["styles/images/header_bg.png","c56bfe8e1596d552baf9fe27ff2987b2"],["styles/images/header_logoCned.png","22d014f1d949e363691e1b7afeea67c7"],["styles/images/header_logoCned_Share.png","2a8e44200f6bf93788afb8d1c1b21857"],["styles/images/header_logoCned_crepenoir.png","b7314a73caf20d4ad3bd1e5a2afd5ad4"],["styles/images/hidden.png","464921d549590ed42e9cc74012cdf76b"],["styles/images/ie_browser.png","eb0362978bb0f73676eebfea15d5c11b"],["styles/images/increase_speed.png","bd1403f8a229e7ee9c0147c87f6d57a7"],["styles/images/increase_volume.png","d677d066cc9a0a0a47da14a2e2fb54b5"],["styles/images/label_txt.png","be99385aefea2664d604a685400d0c34"],["styles/images/label_vocal.png","968ebf76776dbd1310417958ef67b9c5"],["styles/images/lamp_tuto.png","ccb4b1ce524692efe05786b4b9acd1be"],["styles/images/link_bull.png","8e05500b6299f35fd3c4d0511e850e1e"],["styles/images/list_action-arrow.png","9470ef264d7c86e730ca742248a622b5"],["styles/images/loader.GIF","865b37c9ff3d6043d7f7ad85240cb8b6"],["styles/images/loaderWaite.gif","03054357d74fbe1011531ea890cb4138"],["styles/images/loader_bar.png","962fda0da9afe0a06390802592bc0c9a"],["styles/images/loader_cover.png","51a076b33d8238cdd9d58d2f741b5e3c"],["styles/images/loader_points.gif","b472263527bcfe23cd663c82f08e1635"],["styles/images/logo-accessidys-lg.png","24f4a3ca294a8734eab98dfb013ccda2"],["styles/images/mail.png","3a9b0a1021b6abad05e2b9e473aa2fad"],["styles/images/mail_share.jpg","5d9daa8877efceb14f8958330084ce3a"],["styles/images/maj-appli.png","c210f86a44f7e4600bf8e73634e7cc77"],["styles/images/maskfile.png","fe55bdd8d43bf9985eb33c4ced210eac"],["styles/images/menu_icn.png","dc7dbef15928cc23f2773e9bcb4851b7"],["styles/images/mplay.png","5af4b2d99fbaa0944f87cc6216b9a6a5"],["styles/images/msg_err_bg.png","0055ecae08c8580113f7ab800dd17993"],["styles/images/msg_succes_bg.png","3cc5434faae5d3fb3f2146f8f6c17556"],["styles/images/oopps.png","b8bbe5eb1cae721a441ecbf68f7406cd"],["styles/images/parcourir.png","bb5e29ab9abf5a37d9942ac173e290fe"],["styles/images/pause_audio.png","b98fc0ad543a9007206a363dfddef399"],["styles/images/pencil.png","74477bc5d0e528e8dab548ad431e1948"],["styles/images/percentage_box.png","daa37f5fc927d2a64761c06f3cfa4e03"],["styles/images/picto_aideintellect1.png","970a66a62a1bfdbfe30edbb4dbac225e"],["styles/images/play_sound.png","b56cba124e74a238bc51484440247f97"],["styles/images/popin_close.png","3de07e8981bb6c7cd50f7bde5119043a"],["styles/images/progress_bg.jpg","1387aeb584be51b6eb8dd8177832347f"],["styles/images/pwd_icn.png","9a4a055ea50aefeca22587862930527c"],["styles/images/radio_mask.png","46e4c196df99a0992a85602193b89754"],["styles/images/removing.png","70771b97618de7924099e38f249485a7"],["styles/images/resize_icn.png","2dbae3e88edf8ecf5e73b4a99ded8da7"],["styles/images/save_doc.png","e06ed75a9a3d8a420f18f01ad31af32d"],["styles/images/search_field.png","2f6cd352341d6a5c805405cfb19c8021"],["styles/images/select_bg.png","cc7888e315c286acc30e8a73ce63b31a"],["styles/images/set_tag.png","2bd563116eb62ab4a3a76a920fee3a4c"],["styles/images/setting.png","29b4dc53454e5b8bbead32b413e244ae"],["styles/images/share_icn.png","dd20c806976d45b8d0bb17d993f6df73"],["styles/images/sharing.png","6c5ec958ce17d29db266d5f72eefdd0a"],["styles/images/show.png","91c2bf3270a824092e2203838ec1969e"],["styles/images/slide-separator.jpg","3fbe1e349e43d783519b51f605158769"],["styles/images/split-bg.png","04c06479b4ab47819ce03b5cc903f662"],["styles/images/steps_progressmask.png","feedadf17285e0cef913f53358dc9ceb"],["styles/images/stop_sound.png","7897ed3f23d3182d79a651605e1d0c48"],["styles/images/sub_menu_icons-.png","c89307a76dc0e6ed4cb18a1381085bc3"],["styles/images/sub_menu_icons.png","f75fdc6d10d03182b88fa1cc65794f6d"],["styles/images/table_head-border.jpg","dc686ebf2723762f71264f93b6c7fb21"],["styles/images/testimage.png","2bd563116eb62ab4a3a76a920fee3a4c"],["styles/images/text_ocr.png","0751d563c8c8bbca42508f867a103fce"],["styles/images/tree_closed.png","15f8e3645966e75dc4a1626ed829df4d"],["styles/images/tree_line-horizontal.png","a7ff903364772a64d49cb2a7b39ad8b8"],["styles/images/tree_line.png","ca1bc1159849cdff33d16b41a24ba166"],["styles/images/tree_opened.png","f35be77a3fa21bb59c73d249115c6abf"],["styles/images/twitter_share.jpg","74fc629f122fbef245f4bd1eb251021f"],["styles/images/undo_suppression.png","82d733f17f6d2c272870035fc5649014"],["styles/images/url_erreur.png","2beaf5bb057a6d37593732fe746db3cf"],["styles/images/user_icn.png","abd3e0209a120952772ec771eda35577"],["styles/images/vocal-help.png","0a6b4e90346dd8b24b968bfaa74dc57a"],["styles/images/warning_msg.png","5bef763c84446e887768fa891cd00465"],["styles/main.css","75c3771a0097c2405eb10a68189114c2"],["styles/main.min.css","1bbaa1a5fc12950ed87505a6029b4de8"],["styles/step.css","ed046336cfca5508ae8e662fda19e52d"],["styles/step.min.css","6ff16d2ad5c620afe5af2b9b07b3e237"],["styles/styles.css","33ea3aa7ce32a12050d9851fd65e937d"],["styles/styles.min.css","43bba3f5618d5448e0c00524eb37c6fb"],["styles/treeView.css","64b955be56923acc948c0b4d3842f148"],["styles/treeView.min.css","f39f1c3a172b1f956c5a0d0a53c32960"],["viewsScripts/template_cache.js","4ab12caa85f84d3fffb81f96d763756f"]];
var cacheName = 'sw-precache-v3-cned-' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/v/];



var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var cleanResponse = function (originalResponse) {
    // If this is not a redirected response, then we don't have to do anything.
    if (!originalResponse.redirected) {
      return Promise.resolve(originalResponse);
    }

    // Firefox 50 and below doesn't support the Response.body stream, so we may
    // need to read the entire body to memory as a Blob.
    var bodyPromise = 'body' in originalResponse ?
      Promise.resolve(originalResponse.body) :
      originalResponse.blob();

    return bodyPromise.then(function(body) {
      // new Response() is happy when passed either a stream or a Blob.
      return new Response(body, {
        headers: originalResponse.headers,
        status: originalResponse.status,
        statusText: originalResponse.statusText
      });
    });
  };

var createCacheKey = function (originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function (whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function (originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              var request = new Request(cacheKey, {credentials: 'same-origin'});
              return fetch(request).then(function(response) {
                // Bail out of installation unless we get back a 200 OK for
                // every request.
                if (!response.ok) {
                  throw new Error('Request for ' + cacheKey + ' returned a ' +
                    'response with status ' + response.status);
                }

                return cleanResponse(response).then(function(responseToCache) {
                  return cache.put(cacheKey, responseToCache);
                });
              });
            }
          })
        );
      });
    }).then(function() {
      
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
      
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      
      return self.clients.claim();
      
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameters and hash fragment, and see if we
    // have that URL in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = '';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted([], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
            if (response) {
              return response;
            }
            throw Error('The cached response that was expected is missing.');
          });
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});







