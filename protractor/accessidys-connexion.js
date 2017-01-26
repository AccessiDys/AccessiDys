// spec.js

describe('Protractor Demo App', function() {
  it('Connexion et déconnexion', function() {
    browser.get('https://accessidys.org/#/');
    element(by.id('email')).sendKeys('laurent.sumera@cgi.com');
    element(by.id('mdp')).sendKeys('cgi_123');

    element(by.name('login_btn')).click();
		
	//Déconnexion
	element(by.className('actions_menu')).all(by.tagName('a')).get(0).click();
		element(by.className('drob_down')).all(by.tagName('a')).get(7).click();
	
  });
});