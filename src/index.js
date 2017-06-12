/* global ga */

// Import CSS
require('tachyons/css/tachyons.css');
require('normalize-css');

require('./scss/main.scss');

const Elm = require('./Main.elm');
const mountNode = document.getElementById('main');

// The third value on embed are the initial values for incomming ports into Elm
const app = Elm.Main.embed(mountNode);

app.ports.changeMetadata.subscribe(title => {
    document.title = title;
});

app.ports.scrollToTop.subscribe(() => {
    window.scrollTo(0, 0);
});

app.ports.resetBackground.subscribe(() => {
    document.body.style.backgroundColor = '#FFFFFF';
    document.body.style.overflow = '';
});

// Google Analytics

app.ports.pageView.subscribe(() => {
    ga('set', 'page', location.pathname);
    ga('send', 'pageview');
});
