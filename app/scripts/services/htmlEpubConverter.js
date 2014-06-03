/* File: htmlEpubConverter.js
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
/*global $:false */
/*global cnedApp:false */
'use strict';
var baseUrl = '';

function Element() {}

Element.prototype.children = [];
Element.prototype.id = '';
Element.prototype.type = 0;
Element.prototype.class = '';
Element.prototype.level = 0;


function changeRelatifLink(link) {

    if (link !== undefined) {
        if (link.length === 0) {
            return link;
        }
        if (link.indexOf('https://dl.dropboxusercontent.com') > -1) {
            if (link.indexOf('adaptation.html') > -1) {
                link = link.replace(/.*(adaptation.html)/i, baseUrl);
                if (baseUrl === link) {
                    return '';
                }
            } else {
                var lien = /([a-z]*):\/\/([a-z,0-9,\.]*)/i.exec(baseUrl);
                link = link.replace('https://dl.dropboxusercontent.com', lien[0]);
            }
        }
    }
    return link;
}

function getTextOfThis(node) {
    var returnedText = '';
    var i = 0;
    if (node.children.length !== node.childNodes.length) {
        for (i = 0; i < node.childNodes.length; i++) {
            if (node.childNodes[i].nodeType === 1) {
                if (node.childNodes[i].tagName === 'a' || node.childNodes[i].tagName === 'A') {
                    node.childNodes[i].href = changeRelatifLink(node.childNodes[i].href);
                    returnedText += node.childNodes[i].outerHTML;
                } else if (node.childNodes[i].tagName === 'img' || node.childNodes[i].tagName === 'IMG') {
                    returnedText += node.childNodes[i].outerHTML;
                } else {
                    returnedText += node.childNodes[i].outerText;
                }
            } else if (node.childNodes[i].nodeType === 3) {
                returnedText += node.childNodes[i].nodeValue;
            }

        }
    } else {
        if (node.children && node.children.length === 0) {
            returnedText = node.outerText;
        } else {
            for (i = 0; i < node.children.length; i++) {
                if (node.children[i].tagName === 'a' || node.children[i].tagName === 'A') {
                    node.children[i].href = changeRelatifLink(node.children[i].href);
                    returnedText += node.children[i].outerHTML;
                } else if (node.children[i].tagName === 'img' || node.children[i].tagName === 'IMG') {
                    returnedText += node.children[i].outerHTML;
                } else {
                    returnedText += node.children[i].outerText;
                }
            }
        }
    }


    return returnedText;
}



// Préparer la liste des Tags CNED
var listTagsCned = JSON.parse(localStorage.getItem('listTags'));

var tagTitre1Id = '',
    tagTitre2Id = '',
    tagTitre3Id = '',
    tagParagrapheId = '';

if (listTagsCned) {
    for (var i = 0; i < listTagsCned.length; i++) {
        if (listTagsCned[i].libelle.match('^Titre niveau 1')) {
            tagTitre1Id = listTagsCned[i]._id;
        } else if (listTagsCned[i].libelle.match('Titre niveau 2')) {
            tagTitre2Id = listTagsCned[i]._id;
        } else if (listTagsCned[i].libelle.match('Titre niveau 3')) {
            tagTitre3Id = listTagsCned[i]._id;
        } else if (listTagsCned[i].libelle.match('^Paragraphe')) {
            tagParagrapheId = listTagsCned[i]._id;
        }
    }
}



Element.prototype.toCnedObject = function(tags) {
    var cned = {};
    cned.id = this.id;
    cned.level = this.level;
    cned.text = this.text;
    cned.tagName = 'element';

    if (this.type === 1) {
        cned.tag = tags[this.class];
    } else {
        cned.tag = '';
    }


    // Attribuer les Tags CnedAdapt au lieu des Tags des objects extraits
    if (listTagsCned) {
        switch (cned.tag) {
            case 'Titre01':
                cned.tag = tagTitre1Id;
                break;
            case 'Titre02':
                cned.tag = tagTitre2Id;
                break;
            case 'Titre03':
                cned.tag = tagTitre3Id;
                break;
            default:
                cned.tag = tagParagrapheId;
                break;
        }
    }


    var childCned = [];
    if (this.children && this.children.length > 0) {
        for (var i = 0; i < this.children.length; i++) {
            childCned.push(this.children[i].toCnedObject(tags));
        }
    }
    cned.children = childCned;
    if (this.removeTag) {
        delete(cned.tag);
    }
    return cned;
};



/* class Title */

function Title() {
    Element.call(this);
    Title.prototype.type = 1;
}
Title.prototype = new Element();
Title.prototype.constructor = Title;
Title.prototype.text = '';



/* class texte */

function Texte() {
    Element.call(this);
    Texte.prototype.type = 2;
}
Texte.prototype = new Element();
Texte.prototype.constructor = Texte;
Texte.prototype.text = '';



/* class image */

function Img() {
    Element.call(this);
    Img.prototype.type = 3;
}
Img.prototype = new Element();
Img.prototype.constructor = Img;
Img.prototype.src = '';
Img.prototype.legend = '';
Img.prototype.toCnedObject = function(tags) {
    var cned = {};
    cned.id = this.id;
    cned.level = this.level;
    cned.source = this.src;
    cned.tag = '';
    cned.tagName = 'Img';
    cned.text = this.legend;
    var childCned = [];
    if (this.children && this.children.length > 0) {
        for (var i = 0; i < this.children.length; i++) {
            childCned.push(this.children[i].toCnedObject(tags));
        }
    }
    cned.children = childCned;
    if (this.removeTag) {
        delete(cned.tag);
    }
    return cned;
};



/* class table */

function Table() {
    Element.call(this);
    Table.prototype.type = 4;
}
Table.prototype = new Element();
Table.prototype.constructor = Table;
Table.prototype.titles = [];
Table.prototype.data = [];
Table.prototype.legend = '';
Table.prototype.toCnedObject = function(tags) {
    var cned = {};
    cned.id = this.id;
    cned.level = this.level;
    cned.tag = '';
    cned.tagName = 'Table';
    var textTableau = '';
    // TODO : form data to text.
    var i = 0;
    var j = 0;
    if (/^((?!\S).)*$/.test(this.titles[0])) {
        for (i = 0; i < this.data.length; i++) {

            for (j = 1; j < this.titles.length; j++) {
                textTableau = textTableau + '<p>Ligne ' + (i + 1) + ':' + this.data[i][0] + ',' + this.titles[j] + ':' + '<p/>';
                textTableau = textTableau + '<p>&emsp;' + this.data[i][j] + '.' + '<p/>';
            }

        }
    } else {
        for (i = 0; i < this.data.length; i++) {

            for (j = 0; j < this.titles.length; j++) {
                textTableau = textTableau + '<p>Ligne ' + (i + 1) + ',' + this.titles[j] + ':' + '<p/>';
                textTableau = textTableau + '<p>&emsp;' + this.data[i][j] + '.' + '<p/>';
            }

        }
    }
    cned.text = textTableau;
    var childCned = [];
    if (this.children && this.children.length > 0) {
        for (i = 0; i < this.children.length; i++) {
            childCned.push(this.children[i].toCnedObject(tags));
        }
    }
    cned.tag = tagParagrapheId;
    cned.children = childCned;
    if (this.removeTag) {
        delete(cned.tag);
    }
    return cned;
};



/* class List */

function List() {
    Element.call(this);
    List.prototype.type = 6;
}
List.prototype = new Element();
List.prototype.constructor = List;
List.prototype.data = [];
List.prototype.indexed = false;
List.prototype.toCnedObject = function(tags) {
    var cned = {};
    cned.id = this.id;
    cned.level = this.level;
    cned.tag = '';
    cned.tagName = 'List';
    var textList = '';
    var i = 0;
    for (i = 0; i < this.data.length; i++) {
        textList = textList + '<p>- ' + this.data[i] + '<p/>';
    }
    cned.text = textList;
    var childCned = [];

    if (this.children && this.children.length > 0) {
        for (i = 0; i < this.children.length; i++) {
            childCned.push(this.children[i].toCnedObject(tags));
        }
    }
    cned.tag = tagParagrapheId;
    cned.children = childCned;
    return cned;
};



/* class List */

function Link() {
    Element.call(this);
    List.prototype.type = 5;
}
Link.prototype = new Element();
Link.prototype.constructor = Link;
Link.prototype.text = '';
Link.prototype.href = '';
Link.prototype.toCnedObject = function(tags) {
    var cned = {};
    cned.id = this.id;
    cned.level = this.level;
    cned.tag = '';
    cned.tagName = 'link';
    cned.text = this.text;
    cned.href = this.href;
    var childCned = [];
    if (this.children && this.children.length > 0) {
        for (var i = 0; i < this.children.length; i++) {
            childCned.push(this.children[i].toCnedObject(tags));
        }
    }
    cned.tag = tagParagrapheId;
    cned.children = childCned;
    if (this.removeTag) {
        delete(cned.tag);
    }
    return cned;
};



/* class Container */

function Container() {
    Element.call(this);
    Element.prototype.type = 111;
}
Container.prototype = new Element();
Container.prototype.constructor = Container;
Container.prototype.toCnedObject = function(tags) {
    var cned = {};
    cned.id = this.id;
    cned.tag = '';
    cned.tagName = 'Container';
    if (this.text) {
        cned.text = this.text;
    }
    cned.level = this.level;
    var childCned = [];
    if (this.children && this.children.length > 0) {
        for (var i = 0; i < this.children.length; i++) {
            try {
                childCned.push(this.children[i].toCnedObject(tags));
            } catch (err) {}
        }
    }
    cned.tag = tagParagrapheId;
    cned.children = childCned;
    if (this.removeTag) {
        delete(cned.tag);
    }
    return cned;
};



/* ETL.js */

function epubHtmlTool() {}
epubHtmlTool.prototype.TITLE = 1;
epubHtmlTool.prototype.TEXT = 2;
epubHtmlTool.prototype.IMAGE = 3;
epubHtmlTool.prototype.TABLE = 4;
epubHtmlTool.prototype.LINK = 5;
epubHtmlTool.prototype.LIST = 6;

epubHtmlTool.prototype.simpleTextToNode = function(body) {
    var _body = body.replace(/^[\S\s]*<body[^>]*?>/i, '<body>').replace(/<\/body[\S\s]*$/i, '</body>');
    var $body = $(_body);
    $body.find(' *').each(function() {
        if (this.childNodes.length > 1) {
            for (var j = this.childNodes.length - 1; j >= 0; j--) {
                var childtotest = this.childNodes[j].nodeValue;
                if (!(childtotest === null || this.childNodes[j].nodeType !== 3) && (childtotest.replace(/\s/g, '')).length !== 0) {
                    this.replaceChild($('<span simpleTextToNode >' + childtotest + '</span>').get(0), this.childNodes[j]);
                }
            }
        }
    });
    return $body;
};


epubHtmlTool.prototype.setNumToThis = function(inThis, numParent) {
    var objectThis = this;
    var childs = $(inThis).find('>*');
    if (childs.length === 0) {
        $(inThis).attr('num', numParent + '>*');
    } else {
        var counter = 0;
        $(childs).each(function() {
            var valuenum = numParent + '>' + (++counter);
            $(this).attr('num', valuenum);
            objectThis.numeroterThis(this, valuenum);
        });
    }
};

epubHtmlTool.prototype.analyseThisNode = function(node) {
    if (!node.tagName) node = node.get(0);
    if (/([h,H][1-6])\b/.test(node.tagName) || /(.*[T,t]itre.*)\b/.test(node.className) || /(.*[T,t]itle.*)\b/.test(node.className) || /(.*[H,h]ead.*)\b/.test(node.className)) {
        return this.fixThisNode(node, this.TITLE);
    }
    if ((node.tagName === 'img' || node.tagName === 'IMG')) {
        return this.fixThisNode(node, this.IMAGE);
    }
    if (node.tagName === 'p' || node.tagName === 'span' || node.tagName === 'P' || node.tagName === 'SPAN') {
        return this.fixThisNode(node, this.TEXT);
    }
    if ((node.tagName === 'table' || node.tagName === 'TABLE') && (/(.*[T,t]ableau.*)\b/.test(node.className) || /(.*[T,t]ableau.*)\b/.test(node.parentElement.className))) {
        return this.fixThisNode(node, this.TABLE);
    }
    if (node.tagName === 'ul' || node.tagName === 'ol' || node.tagName === 'UL' || node.tagName === 'OL') {
        return this.fixThisNode(node, this.LIST);
    }
    if ((node.tagName === 'a' || node.tagName === 'A') && (node.href && node.href.length > 0)) {
        return this.fixThisNode(node, this.LINK);
    }

    return this.fixThisNode(node, 111);

};

epubHtmlTool.prototype.fixThisNode = function(node, type) {
    switch (type) {
        case this.TEXT:
            var textNode = new Texte();
            textNode.text = getTextOfThis(node);
            textNode.id = $(node).attr('numero');
            textNode.class = $(node).attr('class');
            textNode.childOf = $(node).parent().get(0);
            textNode.tagName = node.tagName;
            return textNode;
        case this.TITLE:
            var titleNode = new Title();
            titleNode.text = node.innerText;
            titleNode.id = $(node).attr('numero');
            titleNode.class = $(node).attr('class');
            titleNode.childOf = $(node).parent().get(0);
            titleNode.tagName = node.tagName;
            return titleNode;
        case this.IMAGE:
            var imgNode = new Img();
            imgNode.src = node.src;
            imgNode.id = node.id || '';
            imgNode.class = $(node).attr('class');
            imgNode.tagName = node.tagName;
            return imgNode;
        case this.TABLE:
            var tableNode = new Table();
            tableNode.titles = [];
            tableNode.data = [];
            if (node.getElementsByTagName('thead').length > 0) {
                ($(node).find('thead>tr>td')).each(function() {
                    tableNode.titles.push(this.innerText);
                });
                ($(node).find('tbody>tr')).each(function() {
                    var tmpRow = [];
                    $(this).find('>td').each(function() {
                        tmpRow.push(this.innerText);
                    });

                    tableNode.data.push(tmpRow);
                });
            } else {
                var flagTh = false;
                if (node.getElementsByTagName('tbody').length > 0) {
                    ($(node).find('tbody>tr')).each(function() {
                        var tmpRow = [];
                        if (this.getElementsByTagName('th').length > 0) {
                            flagTh = true;
                            $(this).find('>th').each(function() {
                                tableNode.titles.push(this.innerText);
                            });
                        } else {
                            $(this).find('>td').each(function() {
                                tmpRow.push(this.innerHTML);
                            });
                        }
                        tableNode.data.push(tmpRow);
                    });
                    if (!flagTh) {
                        tableNode.titles = tableNode.data.shift();
                    } else {
                        tableNode.data.shift();
                    }
                } else {
                    ($(node).find('tr')).each(function() {
                        var tmpRow = [];
                        if (this.getElementsByTagName('th').length > 0) {
                            flagTh = true;
                            $(this).find('>th').each(function() {
                                tableNode.titles.push(this.innerText);
                            });
                        } else {
                            $(this).find('>td').each(function() {
                                tmpRow.push(this.innerHTML);
                            });
                        }

                        tableNode.data.push(tmpRow);
                    });
                    if (!flagTh) {
                        tableNode.titles = tableNode.data.shift();
                    }
                }
            }

            tableNode.id = $(node).attr('numero');
            tableNode.class = $(node).attr('class');
            tableNode.childOf = $(node).parent().get(0);
            tableNode.tagName = node.tagName;
            return tableNode;
        case this.LIST:
            var listNode = new List();
            listNode.data = [];
            ($(node).find('li')).each(function() {
                listNode.data.push(this.innerText);
            });
            listNode.id = $(node).attr('numero');
            listNode.class = $(node).attr('class');
            listNode.childOf = $(node).parent().get(0);
            listNode.tagName = node.tagName;
            return listNode;
        case this.LINK:
            var linkNode = new Link();

            linkNode.id = $(node).attr('numero');
            linkNode.class = $(node).attr('class');
            linkNode.text = node.outerHTML;
            linkNode.href = changeRelatifLink(node.href);
            linkNode.tagName = node.tagName;
            linkNode.childOf = $(node).parent().get(0);
            return linkNode;
        default:
            var containernode = new Container();
            containernode.id = $(node).attr('numero');
            containernode.class = $(node).attr('class');
            containernode.text = getTextOfThis(node);
            containernode.tagName = node.tagName;
            return containernode;
    }
};


function isItBlock(node) {
    var deco = {
        blocks: ['p', 'hr', 'pre', 'blockquote', 'ol', 'ul', 'li', 'dl', 'dt', 'dd', 'figure', 'figcaption', 'div', 'img'],
        inline: ['a', 'em', 'strong', 'small', 's', 'cite', 'q', 'dfn', 'abbr', 'data', 'time', 'code', 'var', 'samp', 'kbd', 'sub', 'sup', 'i', 'b', 'u', 'mark', 'ruby', 'rt', 'bdi', 'bdo', 'span', 'br', 'wbr']
    };
    if (node) {
        var i = 0;
        // si le node est un block il vas sortir immédiatement de la fonction en declarant que c'est un block
        for (i = 0; i < deco.blocks.length; i++) {
            if (deco.blocks[i].toUpperCase() === node.tagName.toUpperCase()) {
                return true;
            }
        }
        if (node.children) {
            for (i = 0; i < node.children.length; i++) {
                if (isItBlock(node.children[i])) {
                    return true;
                }
            }
        }

    }
    return false;
}
// the new one

function removeContainers(childs) {
    var _childs = [];
    var lastOneIsinline = false;
    if (childs)
        for (var i = 0; i < childs.length; i++) {
            var childToPush = null;
            if ((childs[i].type === 111 || childs[i].type === 2) && isItBlock(childs[i])) { // si le child est de type containers ou text block
                if (childs[i].children) {
                    childs[i].children = removeContainers(childs[i].children);
                    if (childs[i].children) {
                        if (childs[i].children.length > 1) {
                            childToPush = childs[i];
                            lastOneIsinline = false;
                        } else if (childs[i].children.length === 1) {
                            childToPush = childs[i].children[0];
                            lastOneIsinline = false;
                        } else if (childs[i].text && childs[i].text.length > 0) {
                            childToPush = childs[i];
                            lastOneIsinline = false;
                        }
                    }
                } else {
                    if (childs[i].data || childs[i].text || childs[i].src) {
                        childToPush = childs[i];
                        lastOneIsinline = false;
                    }
                }

                if (childToPush && childToPush.text) {
                    if (!/\S/.test(childToPush.text)) {
                        childToPush = null;
                    }
                }

            } else if (childs[i].type === 111 || childs[i].type === 2) { // si le child est inline 
                if (!(childs[i].type === 111 && childs[i].tagName.toUpperCase() === 'A')) {
                    if (lastOneIsinline) {
                        _childs[_childs.length - 1].text += ' ' + childs[i].text;
                    } else {
                        childs[i].children = [];
                        childToPush = childs[i];
                        lastOneIsinline = true;
                    }
                }
                if (childToPush && childToPush.text) {
                    if (!/\S/.test(childToPush.text)) {
                        childToPush = null;
                    }
                }
            } else {
                childToPush = childs[i];
                lastOneIsinline = false;
            }

            if (childToPush !== null) {
                if (childToPush.children) {
                    if (childToPush.children.length > 0) {
                        childToPush.removeTag = true;
                    }
                }
                _childs.push(childToPush);
            }
        }
    return _childs;
}


// Returns Children of each Node

function getChildsOf(inThis) {
    var tester = new epubHtmlTool();
    var nodeChild = [];
    var childs = [];
    if (inThis.find) {
        if (inThis.find('>*')) {
            childs = inThis.find('>*');
        }
    } else {
        childs = $(inThis).find('>*');
    }

    if (childs.length === 0) {
        return null;
    } else {
        $(childs).each(function() {

            var elem = tester.analyseThisNode(this);

            if (elem.type !== tester.TITLE && elem.type !== tester.TABLE && elem.type !== tester.LIST && elem.type !== tester.IMAGE) {
                elem.children = getChildsOf(this);
            }

            if (elem.data || elem.text || elem.src || (elem.children && elem.children.length > 0)) {
                nodeChild.push(elem);
            }
        });
    }
    return nodeChild;
}

epubHtmlTool.prototype.nodeToObject = function(inThis) {
    var object = new Container();

    // return more structured HTML
    inThis = this.simpleTextToNode(inThis);

    // add All HTML nodes to container
    object.children = getChildsOf(inThis);
    object.children = removeContainers(object.children);
    return object;
};


function getClasses(container, tableOfClasses) {
    var flagTable = false;
    if (!tableOfClasses) {
        flagTable = true;
        tableOfClasses = {};
        tableOfClasses.length = function() {
            var size = 0,
                key;
            for (key in this) {
                if (this.hasOwnProperty(key)) {
                    size++;
                }
            }
            return size - 1;
        };
    }
    if (container.type === 1 && !tableOfClasses.hasOwnProperty(container.class)) {
        var number = ('' + (tableOfClasses.length() + 1)).substr(-2);
        if (number.length !== 2) {
            number = '0' + number;
        }
        tableOfClasses[container.class] = 'Titre' + number;
    }

    if (container.children && container.children.length > 0) {
        for (var i = 0; i < container.children.length; i++) {
            tableOfClasses = getClasses(container.children[i], tableOfClasses);
        }
    }
    if (flagTable) {
        delete tableOfClasses.length;
    }
    return tableOfClasses;
}

cnedApp.factory('htmlEpubTool', ['$q', 'generateUniqueId',

    function($q, generateUniqueId) {
        return {
            convertToCnedObject: function(htmlToConvert, namePage, lien) {
                var deferred = $q.defer();
                if (lien) {
                    baseUrl = lien;
                }
                var converter = new epubHtmlTool();

                // Return container with Nodes in it
                var contenu = converter.nodeToObject(htmlToConvert);

                // Recuperate all classes + their type (titre1, titre2)
                var tags = getClasses(contenu);

                // Returns Doc Object with tags
                var result = contenu.toCnedObject(tags);

                result.text = namePage;
                deferred.resolve(result);
                return deferred.promise;
            },
            setImgsIntoCnedObject: function(cnedObject, imgs) {

                if (cnedObject && imgs) {
                    if (imgs.length > 0) {
                        var i = 0;
                        if (cnedObject.source) {
                            for (i = 0; i < imgs.length; i++) {

                                if (decodeURI(cnedObject.source).indexOf(imgs[i].link) > -1) cnedObject.originalSource = 'data:image/png;base64,' + imgs[i].data;
                            }
                        }
                        for (i = 0; i < cnedObject.children.length; i++) {
                            cnedObject.children[i] = this.setImgsIntoCnedObject(cnedObject.children[i], imgs);
                        }
                    }
                }
                return cnedObject;
            },
            setIdToCnedObject: function(cnedObject) {

                if (cnedObject.children && cnedObject.children.length > 0 || (cnedObject.text || cnedObject.source)) {
                    cnedObject.id = generateUniqueId();
                    if (cnedObject.tag === 'Titre01') cnedObject.tag = '536cc98b0014983314685f13';
                    if (cnedObject.children || cnedObject.children.length > 0)
                        for (var i = 0; i < cnedObject.children.length; i++) {
                            cnedObject.children[i] = this.setIdToCnedObject(cnedObject.children[i]);
                            if (cnedObject.children[i] === undefined) {
                                cnedObject.children.splice(i, 1);
                            }
                        }

                    return cnedObject;
                } else {
                    return undefined;
                }

            },
            cleanHTML: function(htmlFile) {
                var deferred = $q.defer();
                var dictionnaireHtml = {
                    tagId: ['#ad_container', '#google_ads', '#google_flash_embed', '#adunit', '#navbar', '#sidebar'],
                    tagClass: ['.GoogleActiveViewClass', '.navbar', '.subnav', '.support', '.metabar'],
                    tag: ['objet', 'object', 'script', 'link', 'meta', 'button', 'embed', 'form', 'frame', 'iframe', 'noscript', 'nav', 'footer', 'aside', 'header']
                };
                var removeElements = function(text, selector) {
                    var wrapped = $('<div>' + text + '</div>');
                    wrapped.find(selector).remove();
                    return wrapped.html();
                };
                var i;
                var htmlFilePure;
                if (!angular.isUndefined(htmlFile)) {
                    try {
                        htmlFilePure = htmlFile.documentHtml.replace(/^[\S\s]*<body[^>]*?>/i, '<body>').replace(/<\/body[\S\s]*$/i, '</body>');
                    } catch (err) {
                        htmlFilePure = htmlFile.documentHtml.substring(htmlFile.documentHtml.indexOf('<body'), htmlFile.documentHtml.indexOf('</body>'));
                    }
                }
                htmlFile = htmlFilePure;

                // var removedSpanString = removeElements(htmlFile, 'script');
                if (htmlFile !== null && htmlFile) {
                    for (i = 0; i < dictionnaireHtml.tag.length; i++) {
                        htmlFile = removeElements(htmlFile, dictionnaireHtml.tag[i]);
                    }
                    for (i = 0; i < dictionnaireHtml.tagClass.length; i++) {
                        htmlFile = removeElements(htmlFile, dictionnaireHtml.tagClass[i]);
                    }
                    //     setTimeout(function() {
                    //     }, 5000)
                    // for (i = 0; i < dictionnaireHtml.tag.length; i++) {
                    //     pureHtml.documentHtml = $(dictionnaireHtml.tag[i], '<div>' + htmlFile + '</div>').remove();
                    // }
                    // for (i = 0; i < dictionnaireHtml.id.length; i++) {
                    //     pureHtml.documentHtml = $(htmlFile).remove('#' + dictionnaireHtml.id[i] + '');
                    //}
                    deferred.resolve(htmlFile);
                    return deferred.promise;
                }
            }

        };
    }
]);


cnedApp.filter('showText', [

    function() {
        return function(textBlock, size, removeTag) {
            if (!textBlock || textBlock.length === 0) {
                return '- Vide -';
            }
            var textToReturn = '';
            if (removeTag) {
                textToReturn = $('<div>' + textBlock + '</div>').text();
                if (textToReturn.length === 0) {
                    return '- Lien vide -';
                }
            } else {
                textToReturn = textBlock;
            }
            if (textToReturn.length > size && size > 0) {
                textToReturn = textToReturn.substring(0, size);
            }
            textToReturn = '<p>' + textToReturn.replace(/\n\n/g, '</p><p>') + '</p>';
            return textToReturn;
        };
    }
]);

cnedApp.directive('dynamic', ['$compile',
    function($compile) {
        return {
            restrict: 'A',
            replace: true,
            link: function(scope, ele, attrs) {
                scope.$watch(attrs.dynamic, function(html) {
                    ele.html(html);
                    $compile(ele.contents())(scope);
                });
            }
        };
    }
]);