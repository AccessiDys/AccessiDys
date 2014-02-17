# Traduction

## Comment définir des expressions à traduire :

- Tel que décrit dans [le guide du développeur](http://angular-gettext.rocketeer.be/dev-guide/annotate/), utilisez la directive `translate` autant que possible pour définir les expressions à traduire.
- Evitez de mettre une directive `translate` sur une balise incluant d'autres balises pour ne pas poluer le fichier de traduction avec du html qui compliquerait la tache aux traducteurs.
- Si nécessaire, vous pouvez utiliser le filtre `translate` pour gérer les traductions du contenu d'attributs.
- Les variables dans une chaine à traduire sont gérées comme toute données dynamiques d'une vue, entre double accolade : `<span translate>Bienvenue {{prenom}} {{nom}}.</span>`
- Consultez [le guide du développeur](http://angular-gettext.rocketeer.be/dev-guide/annotate/) pour gérer intelligemment les pluriels dans les expressions changeant en nombre dynamiquement ex : *Vous avez 15 documents*.
- **Avant de passer la main aux traducteurs,** placez vous en console à la racine du projet, lancez `grunt nggettext_extract` pour générer le fichier `po/template.pot` à fournir aux traducteurs.
- Pour gérer les `select` chargeant dynamiquement leurs options depuis des données initialisées par le controlleur, je n'ai pas trouvé de solution satisfaisante puisque les traductions correspondantes ne sont alors pas référencées dans le `template.pot` généré par le script grunt. Il faut les y incorporer autrement (manuellement à chaque fois ou via un script à concevoir et intégrer à la tache grunt). Voici cependant au travers d'un exemple extrait de `app/views/profiles.html` la façon que j'ai trouvé pour que ces chaines soient considérées comme traductibles :

```
<select class="form-control input-sm"
  ng-change="selectAction()"
  id="type"
  required
  ng-model="profil.type"
  ng-options="value for value in listTypes">
</select>
```

devient :

```
<select class="form-control input-sm"
  ng-change="selectAction()"
  id="type"
  required
  ng-model="profil.type"
  >
  <option ng-repeat="value in listTypes" value="{{$index}}">{{value|translate}}</option>
</select>
```


## Comment traduire :

### Comment traduire dans une nouvelles langue :

- ouvrez le fichier `po/template.pot` avec [Poedit ou autre logiciel](http://angular-gettext.rocketeer.be/dev-guide/translate/)
- pour chaque langue souhaitée, effectuez la traduction de toutes les chaines proposées par le fichier `po/template.pot` et enregistrez le résultat dans un fichier `.po` correspondant à la langue. `po/en_US.po` par exemple. Plusieurs déclinaisons d'une expression peuvent être proposées pour gérer correctement les pluriels.

### Comment mettre à jour une traduction :

- ouvrez le fichier `po/ma_LANG.po` avec [Poedit ou autre logiciel](http://angular-gettext.rocketeer.be/dev-guide/translate/)
- dans l'interface du logiciel, mettez à jour le fichier de traduction depuis le template de traduction `po/template.pot`
- mettez à jour les traductions manquantes ou modifiées puis sauvegardez votre fichier `po/ma_LANG.po`

## Comment incorporer les traductions à l'application :

- placez les nouveaux fichiers de traduction au format `.po` dans le dossier `po/` à la place des anciens (si la mise à jour n'a pas été faite directement sur place).
- placez vous en console à la racine du projet, lancez `grunt nggettext_compile` pour générer le fichier `app/scripts/translations.js` utilisé par `angular-gettext` pour appliquer les traductions à l'execution de l'application.

## Annexes :

### Ce que j'ai fait pour que les traductions soient prises en compte :

En me basant sur les insctructions décrites [sur le site d'angular-gettext](http://angular-gettext.rocketeer.be/dev-guide/) j'ai :

- ajouté `angular-gettext` aux dépendances bower du projet (`bower.json`)
- ajouté `grunt-angular-gettext` aux dépendances npm du projet (`package.json`)
- ajouté `gettext` aux dépendance de `cnedApp` dans le fichier `app/scripts/app.js`
- inclu `bower_components/angular-gettext/dist/angular-gettext.min.js` et `"scripts/translations.js` dans `app/index.html`
- inclu `bower_components/angular-gettext/dist/angular-gettext.min.js` dans `karma.conf.js` (pour résoudre la dépendance à angular-gettext de cnedApp)
- ajouté les taches grunt `nggettext_extract` et `nggettext_compile` à `Gruntfile.js`
- créé le dossier `po` qui stocke les fichiers de traduction. (si vous préférez mettre ce dossier ailleurs, il faudra modifier les deux taches grunt associées)
- généré le fichier `app/scripts/translations.js` en suivant les instructions indiquées plus haut dans ce document (*Comment définir des expressions à traduire*, *Comment traduire dans une novelles langue*, *Comment mettre à jour une traduction* et *Comment icorporer les traductiosn à l'application*).
- activé la langue `en_US` en dur dans le fichier `app/scripts/app.js` à l'aide de l'instruction `gettextCatalog.currentLanguage` et avec le mode debug actif pour mettre en évidence les chaines non traduites en anglais. (ce code sera à modifier pour prendre en compte ce qui est décrit dans la partie suivante.)

### Ce qu'il reste à faire pour qu'un utilisateur puisse voir l'interface dans sa langue :

- détecter la langue du navigateur et l'utiliser comme langue par défaut dans les zones non connecté et dans la page d'inscription pour le choix de langue par défaut.
- stocker la langue de l'utilisateur dans son profil et lui permettre de la modifier
- utiliser la langue du profil utilisateur pour un utilisateur connecté plutôt que la langue par défaut du navigateur.

