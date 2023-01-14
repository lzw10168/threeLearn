import Stats from 'stats.js';

const stats = new Stats();
stats.dom.style.left = 'auto';
stats.dom.style.top = '0px';
stats.dom.style.right = '300px';
document.body.appendChild(stats.dom);

export default stats;
