const { Base } = require('./../../browser');

window.base = new Base(window);
document.addEventListener('DOMContentLoaded', event => {
    const { body } = document;
    body.makeElement({
        element: 'div', attributes: { style: { background: 'red', padding: '1em' } }, children: [
            {
                element: 'span', attributes: { style: { background: 'blue', padding: '1em' } }, children: [
                    { element: 'a', attributes: { style: { background: 'green', padding: '1em' } }, text: 'How are you' }
                ]
            }
        ]
    });

    document.body.addChildEventListener('click', { nodeName: 'div' }, (e) => { console.log(e) })
});