const { Base } = require('./../../browser');

window.base = new Base(window);
document.addEventListener('DOMContentLoaded', event => {
    const { body } = document;
    body.makeElement({
        element: 'div', attributes: {}, children: [
            {
                element: 'span', children: [
                    { element: 'a', text: 'How are you' }
                ]
            }
        ]
    })
});