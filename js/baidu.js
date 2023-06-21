let ghtml = document.getElementsByTagName('html')[0],
    gdiv = document.createElement('div');
gdiv.id = 'changdiv'
gdiv.style.position = 'fixed';
gdiv.style.width = '100%';
gdiv.style.height = '100%';
gdiv.style.top = '0px';
gdiv.style.left = '0px';
gdiv.style.opacity = '0.1';
gdiv.style.zIndex = '-1';
gdiv.style.backgroundColor = 'deepskyblue';

ghtml.appendChild(gdiv);
