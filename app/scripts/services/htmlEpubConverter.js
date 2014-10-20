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
/**
 * Les fonctions déclarés directement dans le fichiers
 * @class Default
 */

var baseUrl = '';

// Préparer la liste des Tags CNED
var listTagsCned;

var tagTitre1Id = '',
    tagTitre2Id = '',
    tagTitre3Id = '',
    tagTitre4Id = '',
    tagListe1Id = '',
    tagParagrapheId = '';

/**
 * Permet d'initialiser la liste des tags
 * @method initListTags
 */

function initListTags() {
    listTagsCned = JSON.parse(localStorage.getItem('listTags'));

    if (listTagsCned) {
        for (var i = 0; i < listTagsCned.length; i++) {
            if (listTagsCned[i].libelle.match('^Titre 1')) {
                tagTitre1Id = listTagsCned[i]._id;
            } else if (listTagsCned[i].libelle.match('Titre 2')) {
                tagTitre2Id = listTagsCned[i]._id;
            } else if (listTagsCned[i].libelle.match('Titre 3')) {
                tagTitre3Id = listTagsCned[i]._id;
            } else if (listTagsCned[i].libelle.match('Titre 4')) {
                tagTitre4Id = listTagsCned[i]._id;
            } else if (listTagsCned[i].libelle.match('Liste de niveau 1')) {
                tagListe1Id = listTagsCned[i]._id;
            } else if (listTagsCned[i].libelle.match('^Paragraphe')) {
                tagParagrapheId = listTagsCned[i]._id;
            }
        }
    }
}


initListTags();

/**
 * Permet de detecter que si le node est block ou pas.
 * @method isItBlock
 * @param {HTMLObject} node
 * @return {Boolean} isBlock
 */

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


/**
 * Permet des supprimer les blocks vides et reunir les blocks inline
 * @method recastChildren
 * @param {Array[Element]} children
 * @return {Array[Element]} _children
 */

function recastChildren(children) {
    var _children = [];
    var lastOneIsinline = false;
    if (children) for (var i = 0; i < children.length; i++) {
        var childToPush = null;
        if ((children[i].type === 111 || children[i].type === 2) && isItBlock(children[i])) { // si le child est de type containers ou text block
            if (children[i].children) {
                children[i].children = recastChildren(children[i].children);
                if (children[i].children) {
                    if (children[i].children.length > 1) {
                        childToPush = children[i];
                        lastOneIsinline = false;
                    } else if (children[i].children.length === 1) {
                        childToPush = children[i].children[0];
                        lastOneIsinline = false;
                    } else if (children[i].text && children[i].text.length > 0) {
                        childToPush = children[i];
                        lastOneIsinline = false;
                    }
                }
            } else {
                if (children[i].data || children[i].text || children[i].src) {
                    childToPush = children[i];
                    lastOneIsinline = false;
                }
            }

            if (childToPush && childToPush.text) {
                if (!/\S/.test(childToPush.text)) {
                    childToPush = null;
                }
            }

        } else if (children[i].type === 111 || children[i].type === 2) { // si le child est inline 
            // if (!(children[i].type === 111 && children[i].tagName.toUpperCase() === 'A')) {
            if (lastOneIsinline) {
                _children[_children.length - 1].text += ' ' + children[i].text;
            } else {
                children[i].children = [];
                childToPush = children[i];
                lastOneIsinline = true;
            }
            // }
            if (childToPush && childToPush.text) {
                if (!/\S/.test(childToPush.text)) {
                    childToPush = null;
                    lastOneIsinline = false;
                }
            }
        } else {
            childToPush = children[i];
            lastOneIsinline = false;
        }

        if (childToPush !== null) {
            if (childToPush.children) {
                if (childToPush.children.length > 0) {
                    childToPush.removeTag = true;
                }
            }
            _children.push(childToPush);
        }
    }
    return _children;
}


/**
 * Permet de récupérer tous les fils d'un element et de les analyser.
 * @method getChildren
 * @param {String/jQuery} _this
 * @return {Array[Element]} blocks
 */

function getChildren(_this) {
    var analyzer = new EpubHtmlTool();
    var blocks = [];
    var children = [];
    if (_this.find) {
        if (_this.find('>*')) {
            children = _this.find('>*');
        }
    } else {
        children = $(_this).find('>*');
    }

    if (children.length === 0) {
        return null;
    } else {
        $(children).each(function() {

            var elem = analyzer.analyzeThisNode(this);

            if (elem.type !== analyzer.TITLE && elem.type !== analyzer.TABLE && elem.type !== analyzer.LIST && elem.type !== analyzer.IMAGE) {
                elem.children = getChildren(this);
            }

            if (elem.data || elem.text || elem.src || (elem.children && elem.children.length > 0)) {
                blocks.push(elem);
            }
        });
    }
    return blocks;
}

/**
 * Permet de récupérer tous les noms de classe des titres afin de tager les blocks aprés.
 * @method getClasses
 * @param {Element} container
 * @param {HashMap} tableOfClasses
 * @return {HashMap} tableOfClasses
 */

function getClasses(container, tableOfClasses) {
    var flagTable = false;
    if (!tableOfClasses) {
        flagTable = true;
        tableOfClasses = {
            length: function() {
                var size = 0,
                    key;
                for (key in this) {
                    if (this.hasOwnProperty(key)) {
                        size++;
                    }
                }
                return size - 1;
            }
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

/**
 * une classe abstraite pour que les autres classes s'étend.
 * @class Element
 * @constructor
 */

function Element() {}
/**
 * un attribut qui englobe tous les fils de cet element
 *
 * @attribute children
 * @default []
 * @type Array[Element]
 */
Element.prototype.children = [];
/**
 * un attribut qui identifie l'element
 *
 * @attribute id
 * @default ''
 * @type String
 */
Element.prototype.id = '';
/**
 * un attribut qui caractérise l'element soit titre, texte ...
 *
 * @attribute type
 * @default 0
 * @type Integer
 */
Element.prototype.type = 0;
/**
 * un attribut qui enregistre le nom de la classe récupéré depuis l'HTML
 *
 * @attribute class
 * @default ''
 * @type String
 */
Element.prototype.class = '';
/**
 * un attribut qui enregistre le niveau de chaque element
 *
 * @attribute level
 * @default 0
 * @type Integer
 */
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
                if (baseUrl) {
                    var domaine = /([a-z]*):\/\/([a-z,0-9,\.]*)/i.exec(baseUrl);
                    link = link.replace('https://dl.dropboxusercontent.com', domaine[0]);
                }
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
                if ((node.childNodes[i].tagName === 'a' || node.childNodes[i].tagName === 'A')) {
                    if (node.childNodes[i].href && node.childNodes[i].href.length > 0) {
                        node.childNodes[i].href = changeRelatifLink(node.childNodes[i].href);
                        returnedText += node.childNodes[i].outerHTML;
                    }

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
                    if (node.children[i].href && node.children[i].href.length > 0) {
                        node.children[i].href = changeRelatifLink(node.children[i].href);
                        returnedText += node.children[i].outerHTML;
                    }
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



/**
 * Permet de convertir un element en block qui sera utiliser dans Cned plateforme.
 * @method toCnedObject
 * @param {HashMap} tags
 * @return {Block} cned
 */
Element.prototype.toBlock = function(tags) {
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
            childCned.push(this.children[i].toBlock(tags));
        }
    }
    cned.children = childCned;
    if (this.removeTag) {
        delete(cned.tag);
    }
    return cned;
};



/**
 * @class Title
 * @constructor
 * @extends Element
 */

function Title() {
    Element.call(this);
    Title.prototype.type = 1;
}
Title.prototype = new Element();
Title.prototype.constructor = Title;
/**
 * un attribut qui represente le texte du Titre
 *
 * @attribute text
 * @default ''
 * @type String
 */
Title.prototype.text = '';



/**
 * @class Texte
 * @constructor
 * @extends Element
 */

function Texte() {
    Element.call(this);
    Texte.prototype.type = 2;
}
Texte.prototype = new Element();
Texte.prototype.constructor = Texte;
/**
 * un attribut qui represente le texte du paragraphe
 *
 * @attribute text
 * @default ''
 * @type String
 */
Texte.prototype.text = '';



/**
 * @class Img
 * @constructor
 * @extends Element
 */

function Img() {
    Element.call(this);
    Img.prototype.type = 3;
}
Img.prototype = new Element();
Img.prototype.constructor = Img;
/**
 * un attribut qui represente le lien de l'image
 *
 * @attribute src
 * @default ''
 * @type String
 */
Img.prototype.src = '';
/**
 * un attribut qui represente le texte du legend
 *
 * @attribute text
 * @default ''
 * @type String
 */
Img.prototype.legend = '';
/**
 * Permet de convertir une image en block qui sera utiliser dans Cned plateforme. Dans cette fonction le parametre tags peut être ignoré
 * @method toBlock
 * @param {HashMap} tags
 * @return {Block} cned
 */
Img.prototype.toBlock = function(tags) {
    var cned = {};
    cned.id = this.id;
    cned.level = this.level;
    cned.source = this.src;
    cned.tag = '';
    cned.tagName = 'Img';
    cned.text = this.legend;
    cned.children = [];
    return cned;
};



/**
 * @class Table
 * @constructor
 * @extends Element
 */

function Table() {
    Element.call(this);
    Table.prototype.type = 4;
}
Table.prototype = new Element();
Table.prototype.constructor = Table;
/**
 * un attribut qui represente l'ensembles des titres du tableau
 *
 * @attribute titles
 * @default []
 * @type Array[String]
 */
Table.prototype.titles = [];
/**
 * un attribut qui represente l'ensembles des données du tableau
 *
 * @attribute data
 * @default []
 * @type Array[Array[String]]
 */
Table.prototype.data = [];
/**
 * un attribut qui represente le texte du legend
 *
 * @attribute text
 * @default ''
 * @type String
 */
Table.prototype.legend = '';
/**
 * Permet de convertir un tableau en block qui sera utiliser dans Cned plateforme. Dans cette fonction le contenu du tableau (titres,data) sera exposé par paragraphe.
 * @method toBlock
 * @param {HashMap} tags
 * @return {Block} cned
 */
Table.prototype.toBlock = function(tags) {
    var cned = {};
    cned.id = this.id;
    cned.level = this.level;
    cned.tag = '';
    cned.tagName = 'Table';
    var textTableau = '';
    // TODO : form data to text.
    var i = 0;
    var j = 0;
    // Test si la case est de type titre
    if (/^((?!\S).)*$/.test(this.titles[0])) {
        for (i = 0; i < this.data.length; i++) {

            for (j = 1; j < this.titles.length; j++) {
                if (this.data[i][j]) {
                    textTableau = textTableau + '<p>Ligne ' + (i + 1) + ':' + this.data[i][0] + ',' + this.titles[j] + ':' + '<p/>\n';
                    textTableau = textTableau + '<p>&emsp;' + this.data[i][j] + '.' + '<p/>\n';
                }
            }

        }
    } else {
        for (i = 0; i < this.data.length; i++) {

            for (j = 0; j < this.titles.length; j++) {
                if (this.data[i][j]) {
                    textTableau = textTableau + '<p>Ligne ' + (i + 1) + ',' + this.titles[j] + ':' + '<p/>\n';
                    textTableau = textTableau + '<p>&emsp;' + this.data[i][j] + '.' + '<p/>\n';
                }
            }

        }
    }

    cned.text = textTableau;
    var childCned = [];
    if (this.children && this.children.length > 0) {
        for (i = 0; i < this.children.length; i++) {
            childCned.push(this.children[i].toBlock(tags));
        }
    }
    cned.tag = tagListe1Id;
    cned.children = childCned;
    if (this.removeTag) {
        delete(cned.tag);
    }

    return cned;
};



/**
 * @class List
 * @constructor
 * @extends Element
 */

function List() {
    Element.call(this);
    List.prototype.type = 6;
}
List.prototype = new Element();
List.prototype.constructor = List;
/**
 * un attribut qui represente l'ensembles des données de la liste.
 *
 * @attribute data
 * @default []
 * @type Array[Array[String]]
 */
List.prototype.data = [];
/**
 * un attribut qui represente si la liste est ordonnée ou non.
 *
 * @attribute indexed
 * @default false
 * @type Boolean
 */
List.prototype.indexed = false;
List.prototype.toBlock = function(tags) {
    var cned = {};
    cned.id = this.id;
    cned.level = this.level;
    cned.tag = '';
    cned.tagName = 'List';
    var textList = '';
    var i = 0;
    for (i = 0; i < this.data.length; i++) {
        textList = textList + '<p>- ' + this.data[i] + '<p/>\n';
    }
    cned.text = textList;
    var childCned = [];

    if (this.children && this.children.length > 0) {
        for (i = 0; i < this.children.length; i++) {
            childCned.push(this.children[i].toBlock(tags));
        }
    }
    cned.tag = tagParagrapheId;
    cned.children = childCned;
    return cned;
};



/**
 * @class Link
 * @constructor
 * @extends Element
 */

function Link() {
    Element.call(this);
    List.prototype.type = 5;
}
Link.prototype = new Element();
Link.prototype.constructor = Link;
/**
 * un attribut qui represente le texte du lien.
 *
 * @attribute text
 * @default ''
 * @type String
 */
Link.prototype.text = '';
/**
 * un attribut qui represente le lien.
 *
 * @attribute href
 * @default ''
 * @type String
 */
Link.prototype.href = '';
Link.prototype.toBlock = function(tags) {
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
            childCned.push(this.children[i].toBlock(tags));
        }
    }
    cned.tag = tagParagrapheId;
    cned.children = childCned;
    if (this.removeTag) {
        delete(cned.tag);
    }
    return cned;
};



/**
 * @class Container
 * @constructor
 * @extends Element
 */

function Container() {
    Element.call(this);
    Element.prototype.type = 111;
}
Container.prototype = new Element();
Container.prototype.constructor = Container;
/**
 * Permet de convertir un conteneur en block qui sera utiliser dans Cned plateforme.
 * @method toBlock
 * @param {HashMap} tags
 * @return {Block} cned
 */
Container.prototype.toBlock = function(tags) {
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
                childCned.push(this.children[i].toBlock(tags));
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
/**
 * @class EpubHtmlTool
 * @constructor
 */

function EpubHtmlTool() {}
/**
 * un attribut readOnly qui relie le type de Titre au nombre 1.
 *
 * @attribute TITLE
 * @readOnly
 * @default 1
 * @type Integer
 */
EpubHtmlTool.prototype.TITLE = 1;
/**
 * un attribut readOnly qui relie le type de Texte au nombre 2.
 *
 * @attribute TEXT
 * @readOnly
 * @default 2
 * @type Integer
 */
EpubHtmlTool.prototype.TEXT = 2;
/**
 * un attribut readOnly qui relie le type d'Image au nombre 3.
 *
 * @attribute IMAGE
 * @readOnly
 * @default 3
 * @type Integer
 */
EpubHtmlTool.prototype.IMAGE = 3;
/**
 * un attribut readOnly qui relie le type de tableau au nombre 4.
 *
 * @attribute TABLE
 * @readOnly
 * @default 4
 * @type Integer
 */
EpubHtmlTool.prototype.TABLE = 4;
/**
 * un attribut readOnly qui relie le type de lien au nombre 5.
 *
 * @attribute LINK
 * @readOnly
 * @default 5
 * @type Integer
 */
EpubHtmlTool.prototype.LINK = 5;
/**
 * un attribut readOnly qui relie le type de liste au nombre 6.
 *
 * @attribute LIST
 * @readOnly
 * @default 6
 * @type Integer
 */
EpubHtmlTool.prototype.LIST = 6;

/**
 * Permet d'engloger tous les textes par des balises span.
 * Par exemple : 'text<balise> </balise>' >>> '<span>text</span><balise></balise>'
 * @method textNodeToSpan
 * @param {String} body
 * @return {jQuery} $body
 */
EpubHtmlTool.prototype.textNodeToSpan = function(body) {
    var _body = body.replace(/^[\S\s]*<body[^>]*?>/i, '<body>').replace(/<\/body[\S\s]*$/i, '</body>');
    var $body = $(_body);
    $body.find(' *').each(function() {
        if (this.childNodes.length > 1) {
            for (var j = this.childNodes.length - 1; j >= 0; j--) {
                var childtotest = this.childNodes[j].nodeValue;
                if (!(childtotest === null || this.childNodes[j].nodeType !== 3) && (childtotest.replace(/\s/g, '')).length !== 0) {
                    this.replaceChild($('<span>' + childtotest + '</span>').get(0), this.childNodes[j]);
                }
            }
        }
    });
    return $body;
};

/**
 * Permet d'analyser les nodes selon la base de connaisances return une instance d'Element de type affecté.
 * Par exemple : '<h1> text</h1>' >>> '{type:1,text:'text',children:[]...}'
 * @method analyzeThisNode
 * @param {HTMLObject} node
 * @return {Element} element
 */
EpubHtmlTool.prototype.analyzeThisNode = function(node) {
    if (!node.tagName) node = node.get(0);
    if (/([h,H][1-6])\b/.test(node.tagName) || /(.*[T,t]itre.*)\b/.test(node.className) || /(.*[T,t]itle.*)\b/.test(node.className) || /(.*[H,h]ead.*)\b/.test(node.className)) {
        return this.treatThisNode(node, this.TITLE);
    }
    if ((node.tagName === 'img' || node.tagName === 'IMG')) {
        return this.treatThisNode(node, this.IMAGE);
    }
    if (node.tagName === 'p' || node.tagName === 'span' || node.tagName === 'P' || node.tagName === 'SPAN') {
        return this.treatThisNode(node, this.TEXT);
    }
    if ((node.tagName === 'table' || node.tagName === 'TABLE') && (/(.*[T,t]ableau.*)\b/.test(node.className) || /(.*[T,t]ableau.*)\b/.test(node.parentElement.className))) {
        return this.treatThisNode(node, this.TABLE);
    }
    if (node.tagName === 'ul' || node.tagName === 'ol' || node.tagName === 'UL' || node.tagName === 'OL') {
        return this.treatThisNode(node, this.LIST);
    }
    if ((node.tagName === 'a' || node.tagName === 'A') && (node.href && node.href.length > 0)) {
        return this.treatThisNode(node, this.LINK);
    }

    return this.treatThisNode(node, 111);

};
/**
 * Permet de traiter les nodes selon l'affectation.
 * Par exemple : ('<h1> text</h1>',1) >>> '{type:1,text:'text',children:[]...}'
 * @method treatThisNode
 * @param {HTMLObject} node
 * @param {Integer} type
 * @return {Element} element
 */
EpubHtmlTool.prototype.treatThisNode = function(node, type) {
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
            var pushToTitles = function() {
                tableNode.titles.push(this.innerText);
            };
            var pushToRows = function() {
                tmpRow.push(this.innerText);
            };
            var tmpRow = [];
            if (node.getElementsByTagName('thead').length > 0) {
                ($(node).find('thead>tr>td')).each(pushToTitles);
                ($(node).find('tbody>tr')).each(function() {
                    tmpRow = [];
                    $(this).find('>td').each(pushToRows);

                    tableNode.data.push(tmpRow);
                });
            } else {
                var flagTh = false;
                if (node.getElementsByTagName('tbody').length > 0) {
                    ($(node).find('tbody>tr')).each(function() {
                        tmpRow = [];
                        if (this.getElementsByTagName('th').length > 0) {
                            flagTh = true;
                            $(this).find('>th').each(pushToTitles);
                        } else {
                            $(this).find('>td').each(pushToRows);
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
                        tmpRow = [];
                        if (this.getElementsByTagName('th').length > 0) {
                            flagTh = true;
                            $(this).find('>th').each(pushToTitles);
                        } else {
                            $(this).find('>td').each(pushToRows);
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
                listNode.data.push(getTextOfThis(this));
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

/**
 * Permet de convertire une page html en block cned
 * @method nodeToElement
 * @param {String} inThis
 * @return {Element} element
 */
EpubHtmlTool.prototype.nodeToElement = function(inThis) {
    var object = new Container();

    // return more structured HTML
    inThis = this.textNodeToSpan(inThis);
    // add All HTML nodes to container
    object.children = getChildren(inThis);

    object.children = recastChildren(object.children);
    return object;
};


/**
 * ce service offre 4 principales fonctionnalités à savoir : conversion de l'html, changer les images, affecter les identifiants aux blocks, nettoyer l'html
 * @class ServiceHtmlEpubTool
 */
cnedApp.factory('htmlEpubTool', ['$q', 'generateUniqueId',

function($q, generateUniqueId) {
    return {
        convertToCnedObject: function(htmlToConvert, namePage, lien) {

            var deferred = $q.defer();
            if (lien) {
                baseUrl = lien;
            }
            var converter = new EpubHtmlTool();

            // Return container with Nodes in it
            var contenu = converter.nodeToElement(htmlToConvert);

            // Recuperate all classes + their type (titre1, titre2)
            var tags = getClasses(contenu);

            contenu.removeTag = true;

            // Returns Doc Object with tags
            var result = contenu.toBlock(tags);

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
                    if (cnedObject.children) {
                        for (i = 0; i < cnedObject.children.length; i++) {
                            cnedObject.children[i] = this.setImgsIntoCnedObject(cnedObject.children[i], imgs);
                        }
                    }
                }
            }
            return cnedObject;
        },
        setIdToCnedObject: function(cnedObject) {

            if (cnedObject.children && cnedObject.children.length > 0 || (cnedObject.text || cnedObject.source)) {
                cnedObject.id = generateUniqueId();
                // if (cnedObject.tag === 'Titre01') cnedObject.tag = '536cc98b0014983314685f13';
                if (cnedObject.children && cnedObject.children.length > 0) for (var i = 0; i < cnedObject.children.length; i++) {
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
}]);


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
}]);

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
}]);