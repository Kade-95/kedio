(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
},{"./../../browser":2}],2:[function(require,module,exports){
const Base = require('./classes/Base');
const Components = require('./classes/Components');
const Func = require('./classes/Func');
const JSElements = require('./classes/JSElements');
const Matrix = require('./classes/Matrix');
const NeuralNetwork = require('./classes/NeuralNetwork');
const Period = require('./classes/Period');
const Template = require('./classes/Template');
const Tree = require('./classes/Tree');
const AppLibrary = require('./functions/AppLibrary');
const AnalysisLibrary = require('./functions/AnalysisLibrary');
const ArrayLibrary = require('./functions/ArrayLibrary');
const Compression = require('./functions/Compression');
const MathsLibrary = require('./functions/MathsLibrary');
const Shadow = require('./functions/Shadow');
const ObjectsLibrary = require('./functions/ObjectsLibrary');
const IndexedLibrary = require('./functions/IndexedLibrary');
const ColorPicker = require('./functions/ColorPicker');

module.exports = {
    Base,
    Func,
    NeuralNetwork,
    Matrix,
    Template,
    Components,
    Compression,
    ColorPicker,
    IndexedLibrary,
    AppLibrary,
    ArrayLibrary,
    AnalysisLibrary,
    ObjectsLibrary,
    MathsLibrary,
    Shadow,
    Tree,
    Period,
    JSElements,
}

},{"./classes/Base":3,"./classes/Components":4,"./classes/Func":5,"./classes/JSElements":6,"./classes/Matrix":7,"./classes/NeuralNetwork":8,"./classes/Period":9,"./classes/Template":10,"./classes/Tree":11,"./functions/AnalysisLibrary":13,"./functions/AppLibrary":14,"./functions/ArrayLibrary":15,"./functions/ColorPicker":16,"./functions/Compression":17,"./functions/IndexedLibrary":18,"./functions/MathsLibrary":19,"./functions/ObjectsLibrary":20,"./functions/Shadow":21}],3:[function(require,module,exports){
const Components = require('./Components');
const ColorPicker = require('../functions/ColorPicker');
const ArrayLibrary = require('./../functions/ArrayLibrary');
const ObjectsLibrary = require('./../functions/ObjectsLibrary');

class Empty {
}

class Base extends Components {
    constructor(theWindow = Empty) {
        super(theWindow);
        this.colorHandler = new ColorPicker();
        this.array =  new ArrayLibrary();
        this.object = new ObjectsLibrary();
    }
}

module.exports = Base;

},{"../functions/ColorPicker":16,"./../functions/ArrayLibrary":15,"./../functions/ObjectsLibrary":20,"./Components":4}],4:[function(require,module,exports){
const Template = require('./Template');
class Empty {
}

class Components extends Template {
    constructor(theWindow = Empty) {
        super(theWindow);
    }

    createTab(params = { titles: [] }) {
        var tabTitle = this.createElement({ element: 'ul', attributes: { class: 'tab' } });
        params.view.append(tabTitle);

        for (var i of params.titles) {
            tabTitle.append(
                this.createElement({ element: 'li', attributes: { class: 'tab-title' }, text: i })
            )
        }

        tabTitle.findAll('li').forEach(node => {
            node.addEventListener('click', event => {
                var url = this.urlSplitter(location.href);
                url.vars.tab = node.textContent.toLowerCase();
                router.render({ url: '?' + this.urlSplitter(this.urlMerger(url, 'tab')).queries });
            })
        })
    }

    cell(params = { element: 'input', attributes: {}, name: '', dataAttributes: {}, value: '', text: '', html: '', edit: '' }) {
        //set the cell-data id
        var id = this.stringReplace(params.name, ' ', '-') + '-cell';

        //create the cell label
        var label = this.createElement({ element: 'label', attributes: { class: 'cell-label' }, text: params.name });

        //cell attributes
        params.attributes = (this.isset(params.attributes)) ? params.attributes : {};

        //cell data attributes
        params.dataAttributes = (this.isset(params.dataAttributes)) ? params.dataAttributes : {};
        params.dataAttributes.id = id;

        var components;

        //set the properties of cell data
        if (params.element == 'select') {//check if cell data is in select element
            components = {
                element: params.element, attributes: params.dataAttributes, children: [
                    { element: 'option', attributes: { disabled: '', selected: '' }, text: `Select ${params.name}`, value: '' }//set the default option
                ]
            };
        }
        else {
            components = { element: params.element, attributes: params.dataAttributes, text: params.value };
        }

        if (this.isset(params.value)) components.attributes.value = params.value;
        if (this.isset(params.options)) components.options = params.options;

        let data;
        if (params.element instanceof Element) {
            data = params.element;
        }
        else {
            data = this.createElement(components);//create the cell-data
        }

        data.classList.add('cell-data');

        if (this.isset(params.value)) data.value = params.value;

        //create cell element
        let cell = this.createElement({ element: 'div', attributes: params.attributes, children: [label, data] });

        cell.classList.add('cell');

        if (this.isset(params.text)) data.textContent = params.text;

        if (this.isset(params.html)) data.innerHTML = params.html;


        if (this.isset(params.list)) {
            cell.makeElement({
                element: 'datalist', attributes: { id: `${id}-list` }, options: params.list.sort()
            });

            data.setAttribute('list', `${id}-list`);
        }

        let edit;
        if (this.isset(params.edit)) {
            edit = cell.makeElement({
                element: 'i', attributes: {
                    class: `${params.edit}`, 'data-icon': 'fas, fa-pen', style: { cursor: 'pointer', backgroundColor: 'var(--primary-color)', width: '1em', height: 'auto', position: 'absolute', top: '0px', right: '0px', padding: '.15em' }
                }
            });
            cell.css({ position: 'relative' });
        }

        cell.makeElement({
            element: 'style', text: `
        .cell {
            display: inline-grid;
            margin: .5em;
            font-size: 1em;
            letter-spacing: .1em;
            font-weight: 300;
            border: 1px solid gray;
            border-radius: 10px;
            overflow: auto;
            text-align: center;
            min-width: 100px;
            overflow-y: hidden;
        }
        
        .cell:hover, .cell:focus {
            border-radius: unset;
            box-shadow: var(--primary-shadow);
            transition-duration: .2s;
        }
        
        .cell-label {
            text-transform: uppercase;
            background-color: var(--secondary-color);
            color: var(--primary-color);
            padding: 0.3em;
            text-align: center;
            font-weight: 400;
        }
        
        .cell-data{
            padding: 0.3em;
            outline: none;
            border: none;
            color: var(--secondary-color);
            min-height: 30px;
            text-align: center;
            justify-self: center;
            max-width: 300px;
            max-height: 100px;
            overflow: auto;
        }
        
        .cell-data:hover, .cell-data:focus {
            cursor: text;
            transition-duration: 1s;
        }`})
        return cell;
    }

    message(params = { link: '', text: '', temp: 0 }) {
        var me = this.createElement({
            element: 'span', attributes: { class: 'alert' }, children: [
                this.createElement({ element: 'a', text: params.text, attributes: { class: 'text', href: params.link } }),
                this.createElement({ element: 'span', attributes: { class: 'close' } })
            ]
        });

        if (this.isset(params.temp)) {
            var time = setTimeout(() => {
                me.remove();
                clearTimeout(time);
            }, (params.temp != '') ? params.time * 1000 : 5000);
        }

        me.find('.close').addEventListener('click', event => {
            me.remove();
        });

        body.find('#notification-block').append(me);
    }

    createTable(params = { title: '', contents: {}, projection: {}, rename: {}, sort: false, search: false, filter: [] }) {
        //create the table element   
        let headers = [],//the headers
            columns = {},
            columnCount = 0,
            i,
            table = this.createElement(
                { element: 'div', attributes: params.attributes }
            );//create the table 

        table.classList.add('kedio-table');//add table to the class

        for (let content of params.contents) {//loop through the json array
            i = params.contents.indexOf(content);//get the position of the row
            for (let name in content) {//loop through the row
                if (headers.indexOf(name) == -1) {//add to headers
                    headers.push(name);
                    columns[name] = table.makeElement({
                        element: 'column', attributes: { class: 'kedio-table-column', 'data-name': name }, children: [
                            {
                                element: 'span', attributes: { class: 'kedio-table-column-title', 'data-name': name }, children: [
                                    { element: 'p', attributes: { class: 'kedio-table-column-title-text' }, text: name }
                                ]
                            },
                            { element: 'div', attributes: { class: 'kedio-table-column-contents' } }
                        ]
                    });

                    if (this.isset(params.sort)) {//make sortable if needed
                        columns[name].find('.kedio-table-column-title').makeElement({ element: 'i', attributes: { class: 'kedio-table-column-title-sort', 'data-icon': 'fas, fa-arrow-down' } });
                    }
                }
            }
        }

        params.projection = params.projection || {};

        let hide = Object.values(params.projection).includes(1);


        for (let name of headers) {//loop through the headers and add the contents 
            for (let content of params.contents) {
                i = params.contents.indexOf(content);
                columns[name].find('.kedio-table-column-contents').makeElement({ element: 'span', attributes: { class: 'kedio-table-column-cell', 'data-name': name, 'data-value': content[name] || '', 'data-row': i }, html: content[name] || '' });
            }

            if (params.projection[name] == -1 || (hide && !this.isset(params.projection[name]))) {
                columns[name].css({ display: 'none' });
                continue;
            }

            columnCount++;//count the column length
        }

        table.css({ gridTemplateColumns: `repeat(${columnCount}, 1fr)` });

        let tableContainer = this.createElement({//create table container and title
            element: 'div', attributes: { class: 'kedio-table-container' }, children: [
                {
                    element: 'span', attributes: { class: 'kedio-table-titleandsearch' }
                },
                table
            ]
        });

        let titleCount = 0;

        if (this.isset(params.title)) {// create the title text if needed
            tableContainer.find('.kedio-table-titleandsearch').makeElement({ element: 'h5', attributes: { class: 'kedio-table-title' }, text: params.title });
            titleCount++;
        }

        if (this.isset(params.sort)) {// set the data for sorting
            table.dataset.sort = true;
        }

        if (this.isset(params.search)) {// create the search area
            tableContainer.find('.kedio-table-titleandsearch').makeElement({ element: 'input', attributes: { class: 'kedio-table-search', placeHolder: 'Search table...' } });
            titleCount++;
        }

        if (this.isset(params.filter)) {//create the filter area
            tableContainer.find('.kedio-table-titleandsearch').makeElement({ element: 'select', attributes: { class: 'kedio-table-filter' }, options: params.filter });
            titleCount++;
        }

        if (params.contents.length == 0) {// Notify if table is empty
            table.textContent = 'Empty Table';
        }

        tableContainer.makeElement(
            [{// arrange the table title
                element: 'style', text: `
            @media(min-width: 700px) {
                .kedio-table-titleandsearch {
                  grid-template-columns: repeat(${titleCount}, 1fr);
                }
              }
        `},
            {
                element: 'style', text: `.kedio-table-container {
            width: var(--match-parent);
            padding: 0em 1em;
            height: var(--fill-parent);
            overflow: hidden;
            display: grid;
            grid-template-rows: max-content 1fr;
          }
          
          .kedio-table-titleandsearch {
            margin-bottom: 1em;
            display: grid;
            grid-gap: 1em;
            padding: .5em;
            align-items: center;
            border-bottom: 1px solid lightgray;
            background-color: var(--primary-color);
          }
          
          .kedio-table-title {
            font-weight: 1000;
            font-size: 1.5em;
            text-transform: capitalize;
          }
          
          .kedio-table-search {
            justify-self: flex-end;
            border-radius: 10px;
            border: 1px solid var(--secondary-color);
            outline: none;
            padding: 1em;
            width: var(--match-parent);
          }
          
          .kedio-table-filter {
            justify-self: flex-end;
            border-radius: 10px;
            border: 1px solid var(--secondary-color);
            outline: none;
            padding: 1em;
            width: var(--match-parent);
          }
          
          .kedio-table {
            text-align: center;
            font-size: 1em;
            font-weight: 300;
            width: var(--match-parent);
            grid-template-rows: 1fr;
            overflow: auto;
            display: grid;
            border: 1px solid var(--secondary-color);
          }
          
          .kedio-table .kedio-table-column{
            height: var(--fill-parent);
          }
          
          .kedio-table .kedio-table-column-title {
            position: sticky;
            top: 0;
            text-transform: uppercase;
            background-color: var(--secondary-color);
            color: var(--primary-color);
            width: var(--match-parent);
            display: grid;
            grid-template-columns: repeat(2, max-content);
            gap: .5em;
            justify-content: center;
            align-items: center;
            padding: .5em;
            z-index: 1;
          }
          
          .kedio-table .kedio-table-column-title-text{
            color: inherit;
            background-color: transparent;
            font-size: inherit;
          }
          
          .kedio-table .kedio-table-column-title-sort{
            color: inherit;
            background-color: transparent;
            font-size: inherit;
            cursor: pointer;
            display: none;
          }
          
          .kedio-table .kedio-table-column-contents{
            display: grid;
            gap: .2em;
            width: var(--match-parent);
          }
          
          .kedio-table .kedio-table-column-cell{
            min-width: max-content;
            width: var(--match-parent);
            padding: .5em;
            min-height: 20px;
          }
          
          .kedio-table .kedio-table-column-cell:nth-child(odd) {
            background-color: var(--primary-color);
          }
          
          .kedio-table .kedio-table-column-cell:nth-child(even) {
            background-color: var(--lighter-secondary-color);
          }
          
          .kedio-table input {
            width: inherit;
            height: inherit;
            text-transform: inherit;
            font-size: inherit;
          }
          
          .kedio-table img {
            width: 20px;
            height: auto;
          }
          
          .kedio-table a:visited {
            color: var(--accient-color);
          }
          
          .kedio-table-cell a {
            display: block;
            width: var(--fill-parent);
            height: var(--fill-parent);
            text-decoration: none;
            color: var(--accient-color);
            font-size: 1em;
          }
          
          .kedio-table-cell a:hover {
            background-color: var(--light-primary-color);
            color: var(--light-secondary-color);
            transition-duration: .4s;
          }
          
          .kedio-table .kedio-table-column-cell.kedio-table-selected-row {
            color: var(--accient-color);
          }
          
          .kedio-table-options {
            display: flex;
            justify-content: space-around;
            align-items: center;
            background-color: var(--accient-color);
            color: var(--secondary-color);
            position: absolute;
            left: 0;
            top: 0;
          }
          
          .kedio-table-options .kedio-table-option {
            padding: .5em;
            color: inherit;
            cursor: pointer;
            height: 20px;
            width: 20px;
          }
          
          .kedio-table-option:hover {
            color: var(--primary-color);
          }
          `}]);

        return tableContainer;
    }

    getTableData(table) {
        let data = [];
        let cells = table.findAll('.kedio-table-column-cell');

        for (let i = 0; i < cells.length; i++) {
            let { name, value, row } = cells[i].dataset;
            data[row] = data[row] || {};
            data[row][name] = value;
        }

        return data;
    }

    sortTable(table, by = '', direction = 1) {
        let data = this.getTableData(table);

        data.sort((a, b) => {
            a = a[by];
            b = b[by];

            if (this.isNumber(a) && this.isNumber(b)) {
                a = a / 1;
                b = b / 1;
            }

            if (direction > -1) {
                return a > b ? 1 : -1;
            }
            else {
                return a > b ? -1 : 1;
            }
        });
        return data;
    }

    listenTable(params = { table: {}, options: [] }, callbacks = { click: () => { }, filter: () => { } }) {
        params.options = params.options || [];
        callbacks = callbacks || [];
        let table = params.table.find('.kedio-table');

        let options = this.createElement({
            element: 'span', attributes: { class: 'kedio-table-options' }
        });

        let list = {
            view: 'fas fa-eye',
            delete: 'fas fa-trash',
            edit: 'fas fa-pen',
            revert: 'fas fa-history'
        }

        let optionClass;
        for (let option of params.options) {
            optionClass = list[option] || `fas fa-${option}`;
            let anOption = options.makeElement({
                element: 'i', attributes: { class: optionClass + ' kedio-table-option', id: 'kedio-table-option-' + option }
            });
        }

        let tableTitles = table.findAll('.kedio-table-column-title');
        let tableColumns = table.findAll('.kedio-table-column');
        let rows = [];
        let firstColumn = tableColumns[0];
        let firstVisibleColumn;

        if (this.isnull(firstColumn)) {
            return;
        }

        for (let i = 0; i < tableColumns.length; i++) {
            if (tableColumns[i].css().display != 'none') {
                firstVisibleColumn = tableColumns[i];
                break;
            }
        }

        let firstCells = firstColumn.findAll('.kedio-table-column-cell');
        let firstVisibleCells = firstVisibleColumn.findAll('.kedio-table-column-cell');

        let tableRow;

        for (let i = 0; i < firstCells.length; i++) {
            rows.push(firstCells[i].dataset.row);
        }

        if (params.table.find('.kedio-table').dataset.sort == 'true') {
            for (let i = 0; i < tableTitles.length; i++) {
                tableTitles[i].addEventListener('mouseenter', event => {
                    tableTitles[i].find('.kedio-table-column-title-sort').css({ display: 'unset' });
                });

                tableTitles[i].addEventListener('mouseleave', event => {
                    tableTitles[i].find('.kedio-table-column-title-sort').css({ display: 'none' });
                });

                tableTitles[i].find('.kedio-table-column-title-sort').addEventListener('click', event => {
                    let direction;
                    tableTitles[i].find('.kedio-table-column-title-sort').toggleClasses('fas, fa-arrow-up');
                    tableTitles[i].find('.kedio-table-column-title-sort').toggleClasses('fas, fa-arrow-down');
                    if (tableTitles[i].find('.kedio-table-column-title-sort').dataset.direction == 'up') {
                        tableTitles[i].find('.kedio-table-column-title-sort').dataset.direction = 'down';
                        direction = 1;
                    }
                    else {
                        tableTitles[i].find('.kedio-table-column-title-sort').dataset.direction = 'up';
                        direction = -1;
                    }

                    let text = tableTitles[i].find('.kedio-table-column-title-text').textContent;

                    let data = this.sortTable(params.table.find('.kedio-table'), text, direction);
                    let newTable = this.createTable({ contents: data });

                    let newTableColumns = newTable.findAll('.kedio-table-column');
                    for (let j = 0; j < newTableColumns.length; j++) {
                        tableColumns[j].find('.kedio-table-column-contents').innerHTML = newTableColumns[j].find('.kedio-table-column-contents').innerHTML;
                    }

                    tableColumns = table.findAll('.kedio-table-column');
                    filter();
                });
            }
        }

        if (!this.isnull(params.table.find('.kedio-table-search'))) {
            params.table.find('.kedio-table-search').onChanged(value => {
                filter();
            });
        }

        if (!this.isnull(params.table.find('.kedio-table-filter'))) {
            params.table.find('.kedio-table-filter').onChanged(value => {
                filter();
            });
        }

        let searchValue, filterValue;

        let filter = () => {
            if (!this.isnull(params.table.find('.kedio-table-search'))) {
                searchValue = params.table.find('.kedio-table-search').value;
            }

            if (!this.isnull(params.table.find('.kedio-table-filter'))) {
                filterValue = params.table.find('.kedio-table-filter').value;
            }

            for (let i = 0; i < rows.length; i++) {
                let hide = false;
                tableRow = table.findAll(`.kedio-table-column-cell[data-row="${i}"]`);

                for (let j = 0; j < tableRow.length; j++) {
                    tableRow[j].cssRemove(['display']);
                }

                if (this.isset(filterValue) && hide == false && this.isset(callbacks.filter)) {
                    hide = callbacks.filter(filterValue, tableRow);
                }

                if (this.isset(searchValue) && hide == false) {
                    hide = true;
                    for (let j = 0; j < tableRow.length; j++) {
                        if (tableRow[j].textContent.toLowerCase().includes(searchValue.toLowerCase())) {
                            hide = false;
                            break;
                        }
                    }
                }

                if (hide) {
                    for (let j = 0; j < tableRow.length; j++) {
                        tableRow[j].css({ display: 'none' });
                    }
                }
            }
        }

        if (this.isset(callbacks.click)) {
            table.addMultipleEventListener('mousedown, touchstart', event => {
                let target = event.target;
                if (target.classList.contains('kedio-table-option')) {
                    if (this.isset(callbacks.click)) {
                        callbacks.click(event);
                    }
                }
                else if (target.classList.contains('kedio-table-column-cell') || !this.isnull(target.getParents('.kedio-table-column-cell'))) {
                    if (!target.classList.contains('kedio-table-column-cell')) {
                        target = target.getParents('.kedio-table-column-cell');
                    }
                    let position = target.dataset.row;

                    options.remove();
                    firstVisibleCells[position].css({ position: 'relative' });
                    firstVisibleCells[position].append(options);

                    if (params.table.classList.contains('kedio-selectable')) {
                        let row = table.findAll(`.kedio-table-column-cell[data-row="${position}"]`);
                        for (let i = 0; i < row.length; i++) {
                            row[i].classList.toggle('kedio-table-selected-row');
                        }
                        options.remove();

                        if (!target.classList.contains('kedio-table-selected-row')) {
                            if (firstColumn.findAll('.kedio-table-selected-row').length == 0) {
                                params.table.classList.remove('kedio-selectable');
                            }
                        }
                    }
                }
            });

            table.pressed(event => {
                let target = event.target;
                if (event.duration > 300) {
                    if (target.classList.contains('kedio-table-column-cell') || !this.isnull(target.getParents('.kedio-table-column-cell'))) {
                        if (!target.classList.contains('kedio-table-column-cell')) {
                            target = target.getParents('.kedio-table-column-cell');
                        }
                        let position = target.dataset.row;

                        if (firstColumn.findAll('.kedio-table-selected-row').length == 0 && !params.table.classList.contains('kedio-selectable')) {
                            params.table.classList.add('kedio-selectable');
                            let row = table.findAll(`.kedio-table-column-cell[data-row="${position}"]`);
                            for (let i = 0; i < row.length; i++) {
                                row[i].classList.add('kedio-table-selected-row');
                            }
                            options.remove();
                        }
                    }
                }
            });
        }
    }

    createForm(params = { element: '', title: '', columns: 1, contents: {}, required: [], buttons: {} }) {
        let form = this.createElement({
            element: params.element || 'form', attributes: params.attributes, children: [
                { element: 'h3', attributes: { class: 'kedio-form-title' }, text: params.title },
                { element: 'section', attributes: { class: 'kedio-form-contents', style: { gridTemplateColumns: `repeat(${params.columns}, 1fr)` } } },
                { element: 'section', attributes: { class: 'kedio-form-buttons' } },
                {
                    element: 'style', text: `.kedio-form {
                    text-align: center;
                    justify-self: center;
                    align-self: center;
                    display: grid;
                    grid-row-gap: 1em;
                    grid-template-rows: repeat(4, min-content);
                    width: var(--match-parent);
                    max-width: 700px;
                    margin: 2em;
                    box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
                    border: 1px solid var(--secondary-color);
                }
                
                .kedio-form-title {
                    font-weight: 300;
                    letter-spacing: .05em;
                    font-size: 1.2em;
                    text-align: center;
                    background-color: var(--secondary-color);
                    color: var(--primary-color);
                    text-transform: uppercase;
                    text-decoration: none;
                    padding: 1em;
                }
                
                .kedio-form-contents{
                    display: grid;
                    grid-gap: 1em;
                    padding: 1em;
                    align-items: start;
                }
                
                .kedio-form-buttons{
                    display: grid;
                    grid-template-columns: 1fr;
                    justify-content: center;
                    align-content: center;
                    padding: 1em;
                }
                
                .kedio-form-buttons button{
                    width: var(--fill-parent);
                    border-radius: 20px;
                    padding: 1em;
                    border: 1px solid var(--secondary-color);
                    cursor: pointer;
                    background-color: var(--secondary-color);
                    color: var(--primary-color);
                }
                
                .kedio-form-single-content{
                    display: grid;
                    padding: .5em;
                }
                
                .kedio-form-label {
                    color: #666666;
                    text-transform: capitalize;
                    text-align: justify;
                    display: flex;
                    justify-content: space-between;
                }
                
                .kedio-form-note{
                    color: #999999;
                    font-size: .7em;
                }
                
                .kedio-form-data{
                    border: 1px solid var(--secondary-color);
                    padding: .7em .3em;
                    text-align: justify;
                    min-width: unset;
                    border-radius: 20px;
                    outline: none;
                }
                
                .kedio-form-data:focus {
                    border-color: var(--secondary-color);
                }
                
                .kedio-form-row{
                    position: relative;
                    display: grid;
                    border: 1px solid var(--secondary-color);
                    grid-gap: .5em;
                }
                
                .kedio-form-row-contents{
                    display: grid;
                    grid-gap: .5em;
                }
                
                .kedio-form .cell-label{
                    font-size: .9em;
                }
                
                .kedio-form .cell-data{
                    outline: none;
                    border: none;
                    min-height: 20px;
                }
                
                .kedio-form-error{
                    display: none;
                    background-color: var(--accient-color);
                    color: var(--secondary-color);
                    font-size: .8em;
                    padding: .5em;
                }
                
                @media(min-width: 700px) {
                    .kedio-form #remember-me {
                        width: 20px;
                        height: 20px;
                    }
                }`}
            ]
        });

        form.classList.add('kedio-form');

        if (this.isset(params.parent)) params.parent.append(form);
        let note;
        let formContents = form.find('.kedio-form-contents');

        for (let key in params.contents) {
            note = (this.isset(params.contents[key].note)) ? `(${params.contents[key].note})` : '';
            let lableText = params.contents[key].label || this.camelCasedToText(key).toLowerCase();
            let block = formContents.makeElement({
                element: 'div', attributes: { class: 'kedio-form-single-content' }, children: [
                    { element: 'label', html: lableText, attributes: { class: 'kedio-form-label', for: key.toLowerCase() } }
                ]
            });

            let data = block.makeElement(params.contents[key]);
            data.classList.add('kedio-form-data');
            if (this.isset(params.contents[key].note)) block.makeElement({ element: 'span', text: params.contents[key].note, attributes: { class: 'kedio-form-note' } });

            if (this.isset(params.required) && params.required.includes(key)) {
                data.required = true;
            }
        }

        for (let key in params.buttons) {
            form.find('.kedio-form-buttons').makeElement(params.buttons[key]);
        }

        form.makeElement({ element: 'span', attributes: { class: 'kedio-form-error' }, state: { name: 'error', owner: `#${form.id}` } });

        return form;
    }

    picker(params = { title: '', contents: [] }, callback = (event) => { }) {
        let picker = this.createElement({
            element: 'div', attributes: { class: 'kedio-picker' }, children: [
                { element: 'h3', attributes: { class: 'kedio-picker-title' }, text: params.title || '' },
                { element: 'div', attributes: { class: 'kedio-picker-contents' } },
                {
                    element: 'style', text: `.kedio-picker {
                    display: grid;
                    height: var(--fill-parent);
                    width: var(--fill-parent);
                    grid-template-rows: max-content 1fr;
                }
                
                .kedio-picker-contents {
                    display: block;
                    height: var(--fill-parent);
                    width: var(--fill-parent);
                }
                
                .kedio-picker-single {
                    padding: 2em;
                    display: inline-block;
                    margin: 1em;
                    border: 1px solid var(--secondary-color);
                    margin: 1em;
                }`}
            ]
        });

        for (let content of params.contents) {
            picker.find('.kedio-picker-contents').makeElement({ element: 'span', attributes: { class: 'kedio-picker-single', 'data-name': content }, text: content });
        }

        picker.addEventListener('dblclick', event => {
            if (event.target.classList.contains('kedio-picker-single')) {
                callback(event.target.dataset.name);
            }
        });

        return picker;
    }

    popUp(content, params = { title: '', attributes: {} }) {
        let container = params.container || document.body;
        let title = params.title || '';

        params.attributes = params.attributes || {};
        params.attributes.style = params.attributes.style || {};
        params.attributes.style.width = params.attributes.style.width || '50vw';
        params.attributes.style.height = params.attributes.style.height || '50vh';

        let popUp = this.createElement({
            element: 'div', attributes: { class: 'kedio-pop-up' }, children: [
                {
                    element: 'div', attributes: { id: 'pop-up-window', class: 'kedio-pop-up-window' }, children: [
                        {
                            element: 'div', attributes: { id: 'pop-up-menu', class: 'kedio-pop-up-menu' }, children: [
                                { element: 'p', attributes: { id: '', style: { color: 'inherit', padding: '1em' } }, text: title },
                                { element: 'i', attributes: { id: 'toggle-window', class: 'kedio-pop-up-control fas fa-expand-alt' } },
                                { element: 'i', attributes: { id: 'close-window', class: 'kedio-pop-up-control fas fa-times' } }
                            ]
                        },
                        {
                            element: 'div', attributes: { id: 'pop-up-content', class: 'kedio-pop-up-content' }, children: [
                                content
                            ]
                        }
                    ]
                },
                {
                    element: 'style', text: `.kedio-pop-up {
                    position: fixed;
                    top: 0;
                    left: 0;
                    bottom: 0;
                    right: 0;
                    background-color: var(--light-secondary-color);
                    display: grid;
                    width: var(--fill-parent);
                    height: var(--fill-parent);
                    justify-items: center;
                    align-items: center;
                    z-index: 1000;
                }
                
                .kedio-pop-up-window {
                    background-color: var(--primary-color);
                    display: grid;
                    grid-gap: 1em;
                    justify-items: center;
                    align-items: start;
                    grid-template-columns: 1fr;
                    grid-template-rows: max-content 1fr;
                    overflow: hidden;
                }
                
                .kedio-pop-up-menu {
                    background-color: var(--secondary-color);
                    color: var(--primary-color);
                    display: grid;
                    grid-gap: .5em;
                    grid-template-columns: 1fr repeat(2, min-content);
                    width: 100%;
                    justify-items: flex-end;
                    align-items: center
                }
                
                .kedio-pop-up-control {
                    color: var(--primary-color);
                    height: 20px;
                    width: 20px;
                    padding: 1em
                }
                
                .kedio-pop-up-content {
                    display: block;
                    overflow: auto;
                    height: 100%;
                    width: 100%;
                }`}
            ]
        });

        popUp.find('#pop-up-window').setAttributes(params.attributes);

        popUp.find('#toggle-window').addEventListener('click', event => {
            popUp.find('#toggle-window').classList.toggle('fa-expand-alt');
            popUp.find('#toggle-window').classList.toggle('fa-compress-alt');

            if (popUp.find('#toggle-window').classList.contains('fa-expand-alt')) {
                popUp.find('#pop-up-window').css({ height: params.attributes.style.height, width: params.attributes.style.width });
            }
            else {
                popUp.find('#pop-up-window').css({ height: 'var(--fill-parent)', width: 'var(--fill-parent)' });
            }
        });

        popUp.find('#close-window').addEventListener('click', event => {
            popUp.remove();
        });

        container.append(popUp);
        return popUp;
    }

    createSelect(params = { value: '', contents: {}, multiple: false }) {
        let selected = [],
            allowNavigate = false,
            scrollPosition = -1,
            active;

        //create the element
        let select = this.createElement({
            element: 'div', attributes: params.attributes, children: [
                {
                    element: 'span', attributes: { class: 'kedio-select-control', }, children: [
                        { element: 'input', attributes: { class: 'kedio-select-input', value: params.value || '', ignore: true } },
                        {
                            element: 'span', attributes: { class: 'kedio-select-toggle' }
                        }
                    ]
                },
                { element: 'input', attributes: { class: 'kedio-select-search', placeHolder: 'Search me...', ignore: true } },
                {
                    element: 'span', attributes: { class: 'kedio-select-contents' }
                },
                {
                    element: 'style', text: `.kedio-select {
                    display: grid;
                    max-height: 250px;
                    height: max-content;
                    grid-template-rows: max-content 1fr;
                    position: relative;
                    z-index: 0;
                }
                
                .kedio-select-control {
                    display: grid;
                    grid-template-columns: 1fr max-content;
                    align-items: centers;
                }
                
                .kedio-select-input {
                    border: none;
                    background: transparent;
                    color: var(--secondary-color);
                }
                
                .kedio-select-search {
                    background: var(--primary-color);
                    color: var(--secondary-color);
                    width: var(--match-parent);
                    padding: .3em;
                    justify-self: center;
                    display: none;
                    border: none;
                }
                
                .kedio-select-toggle {
                    border-left: 2px solid var(--secondary-color);
                    border-top: 2px solid var(--secondary-color);
                    transform: rotate(225deg);
                    width: .5em;
                    height: .5em;
                    margin: .3em;
                    cursor: pointer
                }
                
                .kedio-select-contents {
                    width: var(--fill-parent);
                    position: absolute;
                    display: none;
                    justify-items: center;
                    align-items: flex-start;
                    flex-direction: column;
                    overflow: auto;
                    z-index: 1000;
                    min-height: 50px;
                    height: max-content;
                    max-height: 250px;
                    border: 1px solid;
                    background-color: var(--primary-color);
                }
                
                .kedio-select-option {
                    display: flex;
                    place-items: center;
                    width: var(--match-parent);
                    padding: .5em;
                    cursor: pointer;
                }
                
                .kedio-select-option:hover, .kedio-select-active-option{
                    background-color: var(--secondary-color);
                    color: var(--primary-color);
                }`}
            ]
        });
        select.classList.add('kedio-select');
        let setValue = select.getAttribute('value');
        select.value = [];
        if (!this.isnull(setValue)) {
            select.value = this.array.findAll(setValue.split(','), v => {
                return v.trim() != '';
            });//remove all empty strings
        }

        select.dataset.active = 'false';
        //get the contents
        let contents = select.find('.kedio-select-contents');
        let input = select.find('.kedio-select-input');
        let search = select.find('.kedio-select-search');
        let toggle = select.find('.kedio-select-toggle');
        params.contents = params.contents || {};
        //populate the element contents
        if (Array.isArray(params.contents)) {//Turn contents to object if its array
            let items = params.contents;
            params.contents = {};
            for (let i = 0; i < items.length; i++) {
                params.contents[items[i]] = items[i];
            }
        }

        for (let i in params.contents) {
            let option = contents.makeElement({ element: 'span', attributes: { class: 'kedio-select-option', value: i } });
            option.innerHTML = params.contents[i];
            option.value = i;
        }

        for (let v of select.value) {
            input.value += params.contents[v];
            input.dispatchEvent(new CustomEvent('change'));
        }

        //enable multiple values
        let single = (!this.isset(params.multiple) || params.multiple == false);

        let options = select.findAll('.kedio-select-option');

        //search the contents
        search.onChanged(value => {
            for (let i = 0; i < options.length; i++) {
                if (!options[i].textContent.toLowerCase().includes(value.toLowerCase())) {
                    options[i].css({ display: 'none' });
                }
                else {
                    options[i].cssRemove(['display']);
                }
            }
        });

        //navigate the contents
        let navigate = event => {
            allowNavigate = false;
            if (event.key == 'ArrowDown' && scrollPosition < options.length - 1) {
                scrollPosition++;
                allowNavigate = true;
            }
            else if (event.key == 'ArrowUp' && scrollPosition > 0) {
                scrollPosition--;
                allowNavigate = true;
            }
            else if (event.key == 'Enter') {

            }

            if (allowNavigate) {
                active = contents.find('.kedio-select-active-option');
                if (!this.isnull(active)) {
                    active.classList.remove('kedio-select-active-option');
                }

                options[scrollPosition].classList.add('kedio-select-active-option');
            }
        }

        //toggle the contents
        toggle.addEventListener('click', event => {
            let active = select.dataset.active == 'true';
            if (active) {
                deactivate(active);
            }
            else {
                activate(active);
            }
        });

        //show the contents
        let inView, top, bottom;
        document.body.css({ overflow: 'auto' })

        let placeContents = () => {
            top = select.position().top;
            bottom = document.body.clientHeight - select.position().top;

            if (top > bottom) {
                contents.css({ top: -contents.position().height + 'px' });
            }
            else {
                contents.css({ top: select.position().height + 'px' });
            }
        }

        //show contents
        let activate = () => {
            if (select.inView('body')) {
                input.addEventListener('keydown', navigate, false);
                search.css({ display: 'flex' });
                contents.css({ display: 'flex' });
                placeContents();
                select.dataset.active = 'true';
            }
        }

        //hide the contents
        let deactivate = () => {
            input.removeEventListener('keydown', navigate, false);
            search.cssRemove(['display']);
            contents.cssRemove(['display']);
            select.dataset.active = 'false';
        }

        //update the selected
        let update = (values) => {
            selected = [];
            values = values.split(',');
            for (let value of values) {
                value = value.trim();
                for (let i in params.contents) {
                    if (params.contents[i] == value) {
                        value = i;
                    }
                }

                selected.push(value);
            }

            select.value = selected;
            input.value = values;
        }

        //check when activated
        select.bubbledEvent('click', event => {
            if (event.target != toggle && select.dataset.active == 'false') {
                activate();
            }

            if (event.target.classList.contains('kedio-select-option')) {
                let text = params.contents[event.target.value];
                if (params.multiple == 'single') {
                    if (input.value.includes(text)) {
                        input.value = input.value.replace(text, '');
                    }
                    else {
                        input.value += `, ${text}`;
                    }
                }
                else {
                    input.value += `, ${text}`;
                }

                input.dispatchEvent(new CustomEvent('change'));

                if (single) {
                    deactivate();
                }
            }
        });

        //check when deactivated
        select.notBubbledEvent('click', event => {
            if (select.dataset.active == 'true') {
                deactivate();
            }
        });

        //when input value changes
        input.addEventListener('change', event => {
            let values = input.value.split(',');

            values = this.array.findAll(values, value => {
                return value.trim() != '';
            });

            values = this.array.each(values, value => {
                return value.trim();
            });

            if (!single) {
                if (params.multiple == 'single') {
                    values = this.array.toSet(values);
                }
            }

            values = values.join(', ');
            update(values);
        });

        //align contents on scroll
        window.addEventListener('scroll', event => {
            if (select.inView('body')) {
                placeContents();
            }
        });

        return select;
    }

    choose(params = { note: '', options: [] }) {
        let chooseWindow = this.createElement({
            element: 'span', attributes: { class: 'crater-choose' }, children: [
                { element: 'p', attributes: { class: 'crater-choose-note' }, text: params.note },
                { element: 'span', attributes: { class: 'crater-choose-control' } },
                { element: 'button', attributes: { id: 'crater-choose-close', class: 'btn' }, text: 'Close' }
            ]
        });

        let chooseControl = chooseWindow.querySelector('.crater-choose-control');

        chooseWindow.querySelector('#crater-choose-close').addEventListener('click', event => {
            chooseWindow.remove();
        });

        for (let option of params.options) {
            chooseControl.makeElement({
                element: 'button', attributes: { class: 'btn choose-option' }, text: option
            });
        }

        return {
            display: chooseWindow, choice: new Promise((resolve, reject) => {
                chooseControl.addEventListener('click', event => {
                    if (event.target.classList.contains('choose-option')) {
                        resolve(event.target.textContent);
                        chooseWindow.remove();
                    }
                });
            })
        };
    }

    textEditor(params = { id: '', width: 'max-width' }) {
        params = params || {};
        params.id = params.id || 'text-editor';
        let textEditor = this.createElement({
            element: 'div', attributes: {
                id: params.id
            }, children: [
                {
                    element: 'style', text: `

                    div#crater-text-editor{
                        margin: 0 auto;
                        display: grid;
                        width: ${params.width || 'max-content'};
                        height: max-content;
                        border: 2px solid rgb(40, 110, 89);
                        border-radius: 8px 8px 0px 0px;
                        background-color: var(--primary-color);
                    }
                    
                    div#crater-rich-text-area{
                        height: 100%;
                        width: 100%;
                    }

                    div#crater-the-ribbon{
                        border-bottom: none;
                        width: 100%;
                        padding: .5em 0;
                        display: grid;
                        grid-template-rows: max-content max-content;
                        background-color: rgb(40, 110, 89);
                        color: var(--primary-color);
                        text-align: left;
                    }

                    iframe#crater-the-WYSIWYG{
                        height: 100%;
                        width: 100%;
                    }

                    div#crater-the-ribbon button{
                        color: var(--primary-color);
                        border: none;
                        outline: none;
                        background-color: transparent;
                        cursor: pointer;
                        padding: .3em;
                        margin: .5em;
                    }

                    div#crater-the-ribbon button:hover{
                        background-color: rgb(20, 90, 70);
                        transition: all 0.3s linear 0s;
                    }

                    div#crater-the-ribbon input,  div#crater-the-ribbon select{
                        margin: .5em;
                    }

                    div#crater-the-ribbon input[type="color"]{
                        border: none;
                        outline: none;
                        background-color: transparent;
                    }
                `},
                {
                    element: 'div', attributes: {
                        id: 'crater-the-ribbon'
                    }, children: [
                        {
                            element: 'span', children: [
                                { element: 'button', attributes: { id: 'undoButton', title: 'Undo' }, text: '&larr;' },
                                { element: 'button', attributes: { id: 'redoButton', title: 'Redo' }, text: '&rarr;' },
                                { element: 'select', attributes: { id: 'fontChanger' }, options: this.fontStyles },
                                { element: 'select', attributes: { id: 'fontSizeChanger' }, options: this.range(1, 20) },
                                { element: 'button', attributes: { id: 'orderedListButton', title: 'Numbered List' }, text: '(i)' },
                                { element: 'button', attributes: { id: 'unorderedListButton', title: 'Bulletted List' }, text: '&bull;' },
                                { element: 'button', attributes: { id: 'linkButton', title: 'Create Link' }, text: 'Link' },
                                { element: 'button', attributes: { id: 'unLinkButton', title: 'Remove Link' }, text: 'Unlink' }
                            ]
                        },
                        {
                            element: 'span', children: [
                                { element: 'button', attributes: { id: 'boldButton', title: 'Bold' }, children: [{ element: 'b', text: 'B' }] },
                                { element: 'button', attributes: { id: 'italicButton', title: 'Italic' }, children: [{ element: 'em', text: 'I' }] },
                                { element: 'button', attributes: { id: 'underlineButton', title: 'Underline' }, children: [{ element: 'u', text: 'U' }] },
                                { element: 'button', attributes: { id: 'supButton', title: 'Superscript' }, children: [{ element: 'sup', text: '2' }] },
                                { element: 'button', attributes: { id: 'subButton', title: 'Subscript' }, children: [{ element: 'sub', text: '2' }] },
                                { element: 'button', attributes: { id: 'strikeButton', title: 'Strikethrough' }, children: [{ element: 's', text: 'abc' }] },
                                { element: 'input', attributes: { type: 'color', id: 'fontColorButton', title: 'Change Font Color', value: '#000000' } },
                                { element: 'input', attributes: { type: 'color', id: 'highlightButton', title: 'Hightlight Text', value: '#ffffff' } },
                                { element: 'input', attributes: { type: 'color', id: 'backgroundButton', title: 'Change Background', value: '#ffffff' } },
                                { element: 'button', attributes: { id: 'alignLeftButton', title: 'Align Left' }, children: [{ element: 'a', text: 'L' }] },
                                { element: 'button', attributes: { id: 'alignCenterButton', title: 'Align Center' }, children: [{ element: 'a', text: 'C' }] },
                                { element: 'button', attributes: { id: 'alignJustifyButton', title: 'Align Justify' }, children: [{ element: 'a', text: 'J' }] },
                                { element: 'button', attributes: { id: 'alignRightButton', title: 'Align Right' }, children: [{ element: 'a', text: 'R' }] }
                            ]
                        }
                    ]
                },
                {
                    element: 'div', attributes: {
                        id: 'crater-rich-text-area'
                    }, children: [
                        {
                            element: 'iframe', attributes: {
                                id: 'crater-the-WYSIWYG', frameBorder: 0, name: 'theWYSIWYG'
                            }
                        }
                    ]
                }
            ]
        });

        let fonts = textEditor.findAll('select#font-changer > option');
        fonts.forEach(font => {
            font.css({ fontFamily: font.value });
        });

        textEditor.find('#unorderedListButton').innerHTML = '&bull;';
        textEditor.find('#redoButton').innerHTML = '&rarr;';
        textEditor.find('#undoButton').innerHTML = '&larr;';

        let self = this;
        let editorWindow = textEditor.find('#crater-the-WYSIWYG');
        editorWindow.onAdded(() => {
            let editor = editorWindow.contentWindow.document;

            editor.body.innerHTML = '';
            if (self.isset(params.content)) {
                editor.body.innerHTML = params.content.innerHTML;
            }

            editor.designMode = 'on';

            textEditor.find('#boldButton').addEventListener('click', () => {
                editor.execCommand('Bold', false, null);
            }, false);

            textEditor.find('#italicButton').addEventListener('click', () => {
                editor.execCommand('Italic', false, null);
            }, false);

            textEditor.find('#underlineButton').addEventListener('click', () => {
                editor.execCommand('Underline', false, null);
            }, false);

            textEditor.find('#supButton').addEventListener('click', () => {
                editor.execCommand('Superscript', false, null);
            }, false);

            textEditor.find('#subButton').addEventListener('click', () => {
                editor.execCommand('Subscript', false, null);
            }, false);

            textEditor.find('#strikeButton').addEventListener('click', () => {
                editor.execCommand('Strikethrough', false, null);
            }, false);

            textEditor.find('#orderedListButton').addEventListener('click', () => {
                editor.execCommand('InsertOrderedList', false, `newOL${self.random()}`);
            }, false);

            textEditor.find('#unorderedListButton').addEventListener('click', () => {
                editor.execCommand('InsertUnorderedList', false, `newUL${self.random()}`);
            }, false);

            textEditor.find('#fontColorButton').onChanged(value => {
                editor.execCommand('ForeColor', false, value);
            });

            textEditor.find('#highlightButton').onChanged(value => {
                editor.execCommand('BackColor', false, value);
            });

            textEditor.find('#backgroundButton').onChanged(value => {
                editor.body.style.background = value;
            });

            textEditor.find('#fontChanger').onChanged(value => {
                editor.execCommand('FontName', false, value);
            });

            textEditor.find('#fontSizeChanger').onChanged(value => {
                editor.execCommand('FontSize', false, value);
            });

            textEditor.find('#linkButton').addEventListener('click', () => {
                let url = prompt('Enter a URL', 'http://');

                if (self.isnull(url)) return;
                editor.execCommand('CreateLink', false, url);
            }, false);

            textEditor.find('#unLinkButton').addEventListener('click', () => {
                editor.execCommand('UnLink', false, null);
            }, false);

            textEditor.find('#undoButton').addEventListener('click', () => {
                editor.execCommand('Undo', false, null);
            }, false);

            textEditor.find('#redoButton').addEventListener('click', () => {
                editor.execCommand('redo', false, null);
            }, false);

            textEditor.find('#alignLeftButton').addEventListener('click', () => {
                editor.execCommand('justifyLeft', false, null);
            });

            textEditor.find('#alignCenterButton').addEventListener('click', () => {
                editor.execCommand('justifyCenter', false, null);
            });

            textEditor.find('#alignJustifyButton').addEventListener('click', () => {
                editor.execCommand('justifyFull', false, null);
            });

            textEditor.find('#alignRightButton').addEventListener('click', () => {
                editor.execCommand('justifyRight', false, null);
            });
        }, false);

        return textEditor;
    }

    displayData(data = {}, container) {
        let lineNumbers = [];
        let displayString = (value) => {
            return this.createElement({ element: 'span', attributes: { class: 'kedio-data-str' }, text: `"${value}"` });
        }

        let displayLiteral = (value) => {
            return this.createElement({ element: 'span', attributes: { class: 'kedio-data-lit' }, text: `${value}` });
        }

        let displayPunctuation = (value) => {
            return this.createElement({ element: 'span', attributes: { class: 'kedio-data-pun' }, text: `${value}` });
        }

        let displayNewLine = () => {
            increment++;
            return this.createElement({ element: 'span', attributes: { class: 'kedio-data-pln' } });
        }

        let displayItem = (value, params) => {
            params = params || {};
            let item = this.createElement({ element: 'span', attributes: { class: 'kedio-data-item' } });
            lineNumbers.push(item);
            if (this.isset(params.key)) {
                item.makeElement([
                    displayString(params.key),
                    displayPunctuation(' : '),
                    chooseDisplay(value),
                ]);
            }
            else {
                item.makeElement([
                    chooseDisplay(value),
                ]);
            }
            return item;
        }

        let displayArray = (value) => {
            let array = this.createElement({ element: 'span', attributes: { class: 'kedio-data-block' } });
            lineNumbers.push(array);

            array.makeElement(displayPunctuation('['));
            let item;
            for (let i = 0; i < value.length; i++) {
                item = array.makeElement(displayItem(value[i]));

                if (i != value.length - 1) {
                    item.makeElement(displayPunctuation(','));
                }
            }
            array.makeElement(displayPunctuation(']'));
            return array;
        }

        let displayObject = (value) => {
            let object = this.createElement({ element: 'span', attributes: { class: 'kedio-data-block' } });
            lineNumbers.push(object);

            object.makeElement(displayPunctuation('{'));
            let item;
            let i = 0;
            for (let key in value) {
                item = object.makeElement(displayItem(value[key], { key }));
                if (i != Object.keys(value).length - 1) {
                    item.makeElement(displayPunctuation(','));
                }
                i++;
            }
            object.makeElement(displayPunctuation('}'));
            return object;
        }

        let chooseDisplay = (value) => {
            if (typeof value == "string") {
                return displayString(value);
            }
            else if (Array.isArray(value)) {
                return displayArray(value);
            }
            else if (typeof value == 'object') {
                return displayObject(value);
            }
            else {
                return displayLiteral(value);
            }
        }
        let lineHeight = '25px';
        let displayed = this.createElement({
            element: 'pre', attributes: { class: 'kedio-data-window' }, children: [
                {
                    element: 'span', attributes: { class: 'kedio-data-line', style: { lineHeight } }
                },
                {
                    element: 'span', attributes: { class: 'kedio-data-toggles' }
                },
                {
                    element: 'code', attributes: { class: 'kedio-data-code', style: { lineHeight } }, children: [
                        chooseDisplay(data)
                    ]
                },
                {
                    element: 'style', text: `.kedio-data-window {
                    color: inherit;
                    display: grid;
                    grid-template-columns: max-content max-content 1fr;
                    gap: 1em;
                }
                
                .kedio-data-line {
                    color: inherit;
                    display: grid;
                }
                
                .kedio-data-toggles {
                    color: inherit;
                    display: grid;
                    position: relative;
                }
                
                .kedio-data-line-number {
                    color: inherit;
                    /* display: flex; */
                }
                
                .kedio-data-toggles .kedio-data-toggles-button {
                    color: inherit;
                    display: flex;
                    align-items: center;
                    font-size: .8em;
                    cursor: pointer;
                    position: absolute;
                }
                
                .kedio-data-code {
                    color: inherit;
                    position: relative;
                }
                
                .kedio-data-pun {
                    color: inherit;
                }
                
                .kedio-data-lit {
                    color: inherit;
                }
                
                .kedio-data-block {
                    color: inherit;
                }
                
                .kedio-data-str {
                    color: inherit;
                }
                
                .kedio-data-pln {
                    display: block;
                    width: 100%;
                }
                
                .kedio-data-item {
                    margin-left: 20px;
                    display: block;
                    color: inherit;
                }`}
            ]
        });

        if (this.isset(container)) {
            container.append(displayed);
        }

        let code = displayed.find('.kedio-data-code'),
            numbers,
            toggleButtons,
            height = code.position().height,
            lines = displayed.find('.kedio-data-line'),
            toggles = displayed.find('.kedio-data-toggles'),
            count = height / parseInt(lineHeight),
            items = code.findAll('.kedio-data-item'),
            blocks = code.findAll('.kedio-data-block');

        let setRange = (block) => {
            let start = Math.floor((block.position().top - code.position().top) / parseInt(lineHeight)) + 1;
            let end = Math.floor((block.position().bottom - code.position().top) / parseInt(lineHeight)) + 1;
            block.range = this.range(end, start);
        }

        let setNumbers = () => {
            for (let i = 0; i < lineNumbers.length; i++) {
                lines.makeElement([
                    { element: 'a', html: `${i / 1 + 1}`, attributes: { class: 'kedio-data-line-number' } }
                ]);
            }
        }

        let setToggles = () => {
            for (let i = 0; i < blocks.length; i++) {
                let top = blocks[i].position().top - code.position().top + 6 + 'px'
                let toggle = toggles.makeElement({ element: 'i', attributes: { class: 'kedio-data-toggles-button fas fa-arrow-down', style: { top } } });

                toggle.block = blocks[i];
                blocks[i].toggle = toggle;
            }
        }

        let alignToggles = () => {
            for (let i = 0; i < toggleButtons.length; i++) {
                toggleButtons[i].css({
                    top: toggleButtons[i].block.position().top - code.position().top + 6 + 'px'
                });
            }
        }

        let hideNumbers = (block) => {
            for (let i = 0; i < block.range.length; i++) {
                if (!this.isset(numbers[block.range[i]].controller)) {
                    numbers[block.range[i]].css({ display: 'none' });
                    numbers[block.range[i]].controller = block;
                }
            }
        }

        let hideBlock = (block) => {
            let blockContent = block.children;
            for (let i = 0; i < blockContent.length; i++) {
                if (blockContent[i].classList.contains('kedio-data-item')) {
                    blockContent[i].css({ display: 'none' });

                    blockContent[i].findAll('.kedio-data-block').forEach(b => {
                        if (!this.isset(b.toggle.controller)) {
                            b.toggle.controller = block;
                            b.toggle.css({ display: 'none' });
                        }
                    });
                }
            }
        }

        let showNumbers = (block) => {
            for (let i = 0; i < block.range.length; i++) {
                if (numbers[block.range[i]].controller == block) {
                    numbers[block.range[i]].cssRemove(['display']);
                    delete numbers[block.range[i]].controller;
                }
            }
        }

        let showBlock = (block) => {
            let blockContent = block.children;
            for (let i = 0; i < blockContent.length; i++) {
                if (blockContent[i].classList.contains('kedio-data-item')) {
                    blockContent[i].cssRemove(['display']);

                    blockContent[i].findAll('.kedio-data-block').forEach(b => {
                        if (b.toggle.controller == block) {
                            delete b.toggle.controller;
                            b.toggle.cssRemove(['display']);
                        }
                    });
                }
            }
        }

        lineNumbers.push(undefined)

        displayed.onAdded(event => {
            setNumbers();
            setToggles();

            numbers = lines.findAll('.kedio-data-line-number');
            toggleButtons = toggles.findAll('.kedio-data-toggles-button');

            let blockContent, start, end;
            displayed.addEventListener('click', event => {
                let target = event.target;
                if (target.classList.contains('kedio-data-toggles-button')) {//if toggled
                    if (!this.isset(target.block.range)) {
                        setRange(target.block);
                    }

                    if (target.classList.contains('fa-arrow-down')) {//if toggle to show
                        hideNumbers(target.block);
                        hideBlock(target.block);
                    }
                    else {
                        showNumbers(target.block);
                        showBlock(target.block);
                    }

                    target.classList.toggle('fa-arrow-up');
                    target.classList.toggle('fa-arrow-down');
                    alignToggles();
                }
            });
        });

        return displayed;
    }
}

module.exports = Components;
},{"./Template":10}],5:[function(require,module,exports){
class Func {

    constructor() {
        this.capitals = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        this.smalls = "abcdefghijklmnopqrstuvwxyz";
        this.digits = "1234567890";
        this.symbols = ",./?'!@#$%^&*()-_+=`~\\| ";
        this.months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        this.days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        this.genders = ['Male', 'Female', 'Do not disclose'];
        this.maritals = ['Married', 'Single', 'Divorced', 'Widowed'];
        this.religions = ['Christainity', 'Islam', 'Judaism', 'Paganism', 'Budism'];
        this.userTypes = ['student', 'staff', 'admin', 'ceo'];
        this.staffRequests = ['leave', 'allowance'];
        this.studentsRequests = ['absence', 'academic'];
        this.subjectList = ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'Agriculture', 'Literature', 'History'].sort();
        this.subjectLevels = ['General', 'Senior', 'Science', 'Arts', 'Junior'];
        this.fontStyles = ['Arial', 'Times New Roman', 'Helvetica', 'Times', 'Courier New', 'Verdana', 'Courier', 'Arial Narrow', 'Candara', 'Geneva', 'Calibri', 'Optima', 'Cambria', 'Garamond', 'Perpetua', 'Monaco', 'Didot', 'Brush Script MT', 'Lucida Bright', 'Copperplate', 'Serif', 'San-Serif', 'Georgia', 'Segoe UI'];
        this.pixelSizes = ['0px', '1px', '2px', '3px', '4px', '5px', '6px', '7px', '8px', '9px', '10px', '20px', '30px', '40px', '50px', '60px', '70px', '80px', '90px', '100px', 'None', 'Unset', 'auto', '-webkit-fill-available'];
        this.colors = ['Red', 'Green', 'Blue', 'Yellow', 'Black', 'White', 'Purple', 'Violet', 'Indigo', 'Orange', 'Transparent', 'None', 'Unset'];
        this.boldness = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 'lighter', 'bold', 'bolder', 'normal', 'unset'];
        this.borderTypes = ['Solid', 'Dotted', 'Double', 'Groove', 'Dashed', 'Inset', 'None', 'Unset', 'Outset', 'Rigged', 'Inherit', 'Initial'];
        this.shadows = ['2px 2px 5px 2px red', '2px 2px 5px green', '2px 2px yellow', '2px black', 'None', 'Unset'];
        this.borders = ['1px solid black', '2px dotted green', '3px dashed yellow', '1px double red', 'None', 'Unset'];
        this.alignment = ['Left', 'Justified', 'Right', 'Center'];
    }

    extractSource(source) {
        let value = this.inBetween(source, '$#&{', '}&#$');
        try {
            value = JSON.parse(value);
        } catch (error) {
            value = {};
        }
        return value;
    }

    indexAt(haystack = '', needle = '', pos = 0) {
        pos = pos || 0;
        if (haystack.indexOf(needle) == -1) {
            return -1;
        }

        haystack = haystack.split(needle);
        if (pos >= haystack.length) {
            return -1;
        }

        let index = 0;
        for (let i = 0; i < haystack.length; i++) {
            if (i <= pos) {
                index += haystack[i].length;
            }
        }
        index += needle.length * pos;

        return index;
    }

    combine(haystack = '', first = '', second = '', pos = 0) {
        pos = pos || 0;//initialize position if not set
        let at1 = pos,
            at2 = first === second ? pos + 1 : pos; //check if it is the same and change position
        let start = this.indexAt(haystack, first, at1);//get the start
        let end = this.indexAt(haystack, second, at2);//get the end

        if (start == -1 || start + first.length >= haystack.length || end == -1) {//null if one is not found
            return -1;
        }

        return haystack.slice(start, end + second.length);
    }

    allCombine(haystack = '', first = '', second = '') {
        let pos = 0;
        let all = [];
        let found;
        while (found != -1) {
            found = this.combine(haystack, first, second, pos);
            pos++;
            if (found != -1) {
                all.push(found);
            }
        }

        return all;
    }

    inBetween(haystack = '', first = '', second = '', pos = 0) {
        pos = pos || 0;//initialize position if not set
        let at1 = pos,
            at2 = first === second ? pos + 1 : pos; //check if it is the same and change position
        let start = this.indexAt(haystack, first, at1);//get the start
        let end = this.indexAt(haystack, second, at2);//get the end

        if (start == -1 || start + first.length >= haystack.length || end == -1) {//-1 if one is not found or inbetween
            return -1;
        }

        return haystack.slice(start + first.length, end);
    }

    allInBetween(haystack = '', first = '', second = '') {
        let pos = 0;
        let all = [];
        let found;
        while (found != -1) {
            found = this.inBetween(haystack, first, second, pos);
            pos++;
            if (found != -1) {
                all.push(found);
            }
        }

        return all;
    }

    extractCSS(element) {
        let css = element.style.cssText,
            style = {},
            key,
            value;

        if (css != '') {
            css = css.split('; ');
            let pair;
            for (let i of css) {
                pair = this.trem(i);
                key = this.jsStyleName(pair.split(':')[0]);
                value = this.stringReplace(pair.split(':').pop(), ';', '');
                if (key != '') {
                    style[key] = this.trem(value);
                }
            }
        }

        return style;
    }

    trimMonthArray() {
        let months = [];
        for (let i = 0; i < this.months.length; i++) {
            months.push(this.months[i].slice(0, 3));
        }
        return months;
    }

    jsStyleName(name = '') {
        let newName = '';
        for (let i = 0; i < name.length; i++) {
            if (name[i] == '-') {
                i++;
                newName += name[i].toUpperCase();
            }
            else newName += name[i].toLowerCase();
        }
        return newName;
    }

    cssStyleName(name = '') {
        let newName = '';
        for (let i = 0; i < name.length; i++) {
            if (this.isCapital(name[i])) newName += '-';
            newName += name[i].toLowerCase();
        }

        return newName;
    }

    textToCamelCased(text = '') {
        let value = '';
        for (let i in text) {
            if (text[i] == ' ') continue;
            else if (i == 0) value += text[i].toLowerCase();
            else if (this.isset(text[i - 1]) && text[i - 1] == ' ') value += text[i].toUpperCase();
            else value += text[i];
        }
        return value;
    }

    camelCasedToText(camelCase = '') {
        let value = '';
        for (let i in camelCase) {
            if (i != 0 && this.isCapital(camelCase[i])) value += ` ${camelCase[i].toLowerCase()}`;
            else value += camelCase[i];
        }
        return value;
    }

    emptyObject(obj) {
        return JSON.stringify(obj) == JSON.stringify({});
    }

    random(params = { limit: 1, range: 1 }) {
        let random;
        if (this.emptyObject(params)) {
            random = Math.random() * 2 - 1;
        }
        else if (this.isset(params.limit)) {
            random = Math.random() * params.limit;
        }
        else if (this.isset(params.range)) {

        }
        return random;
    }

    range(end = 1, start = 1) {
        let value = [];
        for (let i = start || 0; i < end; i++) {
            value.push(i);
        }

        return value;
    }

    generateRandom(length = 5, type = 'alphanum') {
        let string;
        if (type == 'number') {
            string = this.digits;
        }
        else if (type == 'alpha') {
            string = this.capitals + this.smalls;
        }
        else if (type == 'alphanum') {
            string = this.capitals + this.smalls + this.digits;
        }
        else if (type == 'alphanumsym') {
            string = this.capitals + this.smalls + this.digits + this.symbols;
        }

        let random = '';
        for (let i = 0; i < length; i++) {
            random += string[Math.floor(Math.random() * string.length)];
        }
        return random;
    }

    generateRandomHex(length = 5) {
        var string = this.capitals.slice(0, 3) + this.smalls.slice(0, 3) + this.digits;
        var alphanumeric = '';
        for (var i = 0; i < length; i++) {
            alphanumeric += string[Math.floor(Math.random() * string.length)];
        }
        return alphanumeric;
    }

    generateKey(length = 5) {
        let key = Date.now().toString(length) + Math.random().toString(length).slice(2);//generate the key
        return key;
    }

    edittedUrl(params) {
        var url = this.urlSplitter(params.url);
        url.vars[params.toAdd] = params.addValue.toLowerCase();
        return this.urlMerger(url, params.toAdd);
    }

    addCommaToMoney(money = '') {
        var inverse = '';
        for (var i = money.length - 1; i >= 0; i--) {
            inverse += money[i];
        }
        money = "";
        for (var i = 0; i < inverse.length; i++) {
            let position = (i + 1) % 3;
            money += inverse[i];
            if (position == 0) {
                if (i != inverse.length - 1) {
                    money += ',';
                }
            }
        }
        inverse = '';
        for (var i = money.length - 1; i >= 0; i--) {
            inverse += money[i];
        }
        return inverse;
    }

    isCapital(value = '') {
        if (value.length == 1) {
            return this.capitals.includes(value);
        }
    }

    capitalize(value = '') {
        if (!this.isCapital(value[0])) {
            value = value.split('');
            value[0] = this.capitals[this.smalls.indexOf(value[0])];
            return this.stringReplace(value.toString(), ',', '');
        }
        return value;
    }

    flip(haystack = '') {
        return haystack.split('').reverse().join('');
    }

    isSmall(value = '') {
        if (value.length == 1) {
            return this.smalls.includes(value);
        }
    }

    isSymbol(value = '') {
        if (value.length == 1) {
            return this.symbols.includes(value);
        }
    }

    isName(value = '') {
        for (var x in value) {
            if (this.isDigit(value[x])) {
                return false;
            }
        }
        return true;
    }

    isPasswordValid(value = '') {
        var len = value.length;
        if (len > 7) {
            for (var a in value) {
                if (this.isCapital(value[a])) {
                    for (var b in value) {
                        if (this.isSmall(value[b])) {
                            for (var c in value) {
                                if (this.isDigit(value[c])) {
                                    for (var d in value) {
                                        if (this.isSymbol(value[d])) {
                                            return true;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return false;
    }

    isSubString(haystack = '', value = '') {
        if (haystack.indexOf(value) != -1) return true;
        return false;
    }

    isDigit(value = '') {
        value = new String(value)
        if (value.length == 1) {
            return this.digits.includes(value);
        }
        return false;
    }

    isEmail(value = '') {
        var email_parts = value.split('@');
        if (email_parts.length != 2) {
            return false;
        } else {
            if (this.isSpaceString(email_parts[0])) {
                return false;
            }
            var dot_parts = email_parts[1].split('.');
            if (dot_parts.length != 2) {
                return false;
            } else {
                if (this.isSpaceString(dot_parts[0])) {
                    return false;
                }
                if (this.isSpaceString(dot_parts[1])) {
                    return false;
                }
            }
        }
        return true;
    }

    isTruthy(value) {
        let truthy;
        if (typeof value == 'boolean') {
            truthy = value;
        }
        else if (typeof value == 'string') {
            truthy = (value.toLocaleLowerCase() == 'true' || value.toLocaleLowerCase() == '1');
        }
        else if (typeof value == 'number') {
            truthy = (value == 1);
        }
        return truthy;
    }

    isFalsy(value) {
        let falsy;
        if (typeof value == 'boolean') {
            falsy = value;
        }
        else if (typeof value == 'string') {
            falsy = (value.toLocaleLowerCase() == 'false' || value.toLocaleLowerCase() == '0');
        }
        else if (typeof value == 'number') {
            falsy = (value == 0);
        }
        return falsy;
    }

    objectLength(object = {}) {
        return Object.keys(object).length;
    }

    isSpaceString(value = '') {
        if (value == '') {
            return true;
        } else {
            for (var x in value) {
                if (value[x] != ' ') {
                    return false;
                }
            }
        }
        return true;
    }

    hasString(haystack = '', needle = '') {
        for (var x in haystack) {
            if (needle == haystack[x]) {
                return true;
            }
        }
        return false;
    }

    trem(needle = '') {
        //remove the prepended spaces
        if (needle[0] == ' ') {
            var new_needle = '';
            for (var i = 0; i < needle.length; i++) {
                if (i != 0) {
                    new_needle += needle[i];
                }
            }
            needle = this.trem(new_needle);
        }

        //remove the appended spaces
        if (needle[needle.length - 1] == ' ') {
            var new_needle = '';
            for (var i = 0; i < needle.length; i++) {
                if (i != needle.length - 1) {
                    new_needle += needle[i];
                }
            }
            needle = this.trem(new_needle);
        }
        return needle;
    }

    stringReplace(word = '', from = '', to = '') {
        var value = '';
        for (let i = 0; i < word.length; i++) {
            if (word[i] == from) {
                value += to;
            }
            else {
                value += word[i];
            }
        }
        return value;
    }

    converToRealPath(path = '') {
        if (path[path.length - 1] != '/') {
            path += '/';
        }
        return path;
    }

    isSpacialCharacter(char = '') {
        var specialcharacters = "'\\/:?*<>|!.";
        for (var i = 0; i < specialcharacters.length; i++) {
            if (specialcharacters[i] == char) {
                return true;
            }
        }
        return false;
    }

    countChar(haystack = '', needle = '') {
        var j = 0;
        for (var i = 0; i < haystack.length; i++) {
            if (haystack[i] == needle) {
                j++;
            }
        }
        return j;
    }

    occurancesOf(haystack = '', needle = '') {
        let occurances = [];
        for (let i = 0; i < haystack.length; i++) {
            if (haystack[i] === needle) {
                occurances.push(i);
            }
        }

        return occurances;
    }

    isset(variable) {
        return (typeof variable !== 'undefined');
    }

    isnull(variable) {
        return variable == null;
    }

    notNull(variable) {
        return this.isset(variable) && !this.isnull(variable);
    }

    isArray(variable) {
        let flag = false;
        if (typeof variable == 'object') {
            flag = variable.constructor === Array;
        }
        return flag;
    }

    isObject(variable) {
        let flag = false;
        if (typeof variable == 'object') {
            flag = variable.constructor === Object;
        }
        return flag;
    }

    isString(variable) {
        let flag = false;
        if (typeof variable == 'string') {
            flag = variable.constructor === String;
        }
        return flag;
    }

    isNumber(variable) {
        let flag = false;
        if (typeof variable == 'number') {
            flag = variable.constructor === Number;
        }
        return flag;
    }

    isBool(variable) {
        let flag = false;
        if (typeof variable == 'boolean') {
            flag = variable.constructor === Boolean;
        }
        return flag;
    }

    isfunction(variable) {
        return (typeof variable === 'function');
    }

    async runParallel(functions = [], callBack = () => { }) {
        let results = {};
        for (let f in functions) {
            results[f] = await functions[f];
        }
        callBack(results);
    }

    isMobile() {
        return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    }

    urlMerger(splitUrl = '', lastQuery = '') {
        var hostType = (this.isset(splitUrl.hostType)) ? splitUrl.hostType : 'http';
        var hostName = (this.isset(splitUrl.hostName)) ? splitUrl.hostName : '';
        var port = (this.isset(splitUrl.host)) ? splitUrl.port : '';
        var pathName = (this.isset(splitUrl.pathName)) ? splitUrl.pathName : '';
        var queries = '?';
        var keepMapping = true;
        (this.isset(splitUrl.vars)) ?
            Object.keys(splitUrl.vars).map(key => {
                if (keepMapping) queries += key + '=' + splitUrl.vars[key] + '&';
                if (key == lastQuery) keepMapping = false;
            }) : '';
        var location = hostType + '::/' + hostName + ':' + port + '/' + pathName + queries;
        location = (location.lastIndexOf('&') == location.length - 1) ? location.slice(0, location.length - 1) : location;
        location = (location.lastIndexOf('=') == location.length - 1) ? location.slice(0, location.length - 1) : location;
        return location;
    }

    urlSplitter(location = '') {
        if (this.isset(location)) {
            location = location.toString();
            let protocol = (location.indexOf('://') === -1) ? undefined : location.split('://')[0];
            let fullPath = location.split('://')[1];
            let host = fullPath.split('/')[0];
            let hostName = host.split(':')[0];
            let port = host.split(':')[1];
            let path = fullPath.slice(fullPath.indexOf('/'));
            let pathName = path.split('?')[0].split('#')[0];
            let hash = path.slice(path.indexOf('#'));
            let queries = (path.indexOf('#') > path.indexOf('?')) ? path.slice(path.indexOf('?')) : null;
            let vars = {};
            if (!this.isnull(queries)) {
                queries = queries.slice(0, queries.indexOf('#'));
                let query = queries.slice(queries.indexOf('?') + 1).split('&');
                for (let x in query) {
                    let parts = query[x].split('=');
                    if (parts[1]) {
                        vars[this.stringReplace(parts[0], '-', ' ')] = this.stringReplace(parts[1], '-', ' ');
                    } else {
                        vars[this.stringReplace(parts[0], '-', ' ')] = '';
                    }
                }
            }
            let httphost = protocol + '://' + host;

            let splitHost = host.split('.');
            let domain = host;

            if (isNaN(this.stringReplace(hostName, '.', ''))) {
                if (splitHost.length > 2) splitHost.shift();
                domain = splitHost.join('.');
            }

            return { location, protocol, fullPath, host, httphost, hostName, port, path, pathName, queries, vars, hash, domain };
        }
    }

    getUrlVars(location = '') {
        location = location.toString();
        var queries = (location.indexOf('?') === -1) ? null : location.split('?').pop(0);
        var vars = {};

        if (queries != null) {
            var query = queries.split('&');
            for (var x in query) {
                var parts = query[x].split('=');
                if (parts[1]) {
                    vars[this.stringReplace(parts[0], '-', ' ')] = this.stringReplace(parts[1], '-', ' ');
                } else {
                    vars[this.stringReplace(parts[0], '-', ' ')] = '';
                }
            }
        }
        return vars;
    }

    varSize(value) {
        let objectList = [];

        let recurse = (object) => {
            let bytes = 0;
            if (typeof object == 'string') {
                bytes += object.length * 2;
            }
            else if (typeof object == 'number') {
                bytes += 8;
            }
            else if (typeof object == 'boolean') {
                bytes += 4;
            }
            else if (typeof object == 'object' && objectList.indexOf(object) == -1) {
                objectList.push(object);

                for (let i in object) {
                    bytes += recurse(i);
                    bytes += recurse(object[i]);
                }
            }

            return bytes;
        }

        return recurse(value);
    }
}

module.exports = Func;
},{}],6:[function(require,module,exports){
const Period = require('./Period');
class Empty {
}

class JSElements extends Period {
    constructor(theWindow = Empty) {
        super();
        this.Element = theWindow.Element;
        this.document = theWindow.document;
    }

    loadCss(href = '') {
        let element = this.createElement({ element: 'link', attributes: { rel: 'stylesheet', type: 'text/css', href } });
        if (this.document !== undefined) {
            if (this.document['head'] !== undefined) {
                this.document['head'].append(element);
            }
        }
    }

    jsonForm(form) {
        let json = {};
        let perform = (element) => {
            let children = element.children;
            for (let i = 0; i < children.length; i++) {
                perform(children[i]);
            }
            if (element.hasAttribute('name')) {
                if (element.type == 'file') {
                    if (element.hasAttribute('multiple')) {
                        json[element.getAttribute('name')] = element.files;
                    }
                    else {
                        json[element.getAttribute('name')] = element.files[0];
                    }
                }
                else {
                    json[element.getAttribute('name')] = element.value;
                }
            }
        }

        perform(form);
        return json;
    }

    jsonElement(_element_) {
        let element = _element_.nodeName.toLowerCase();
        let attributes = _element_.getAttributes();
        attributes.style = _element_.css();
        let children = [];
        for (let i = 0; i < _element_.children.length; i++) {
            children.push(_element_.children[i].toJson());
        }
        return { element, attributes, children }
    }

    isElement(object) {
        return object instanceof this.Element;
    }

    createFromObject(object = {}, singleParent) {
        let created, name;

        if (this.isElement(object)) {
            created = object;
            name = created.nodeName;
        }
        else if (this.isElement(object.element)) {
            created = object.element;
            name = created.nodeName;
        }
        else {
            name = object.element.toLowerCase();
            created = document.createElement(object.element);//generate the element
        }


        if (this.isset(object.attributes) && !this.isElement(object)) {//set the attributes
            for (var attr in object.attributes) {
                if (attr == 'style') {//set the styles
                    created.css(object.attributes[attr]);
                }
                else created.setAttribute(attr, object.attributes[attr]);
            }
        }

        if (this.isset(object.text)) {
            created.textContent = object.text;//set the innerText
        }

        if (this.isset(object.html)) {
            created.innerHTML = object.html;//set the innerHTML
        }

        if (this.isset(object.value)) {
            created.value = object.value;//set the value
        }

        if (name.includes('-')) {
            created = this.createFromHTML(created.outerHTML);
        }

        if (this.isset(singleParent)) {
            singleParent.attachElement(created, object.attachment);
        }

        if (this.isset(object.children)) {
            created.makeElement(object.children);
        }

        if (this.isset(object.options) && Array.isArray(object.options)) {//add options if isset           
            for (var i of object.options) {
                let option = created.makeElement({ element: 'option', value: i, text: i, attachment: 'append' });
                if (this.isset(object.selected) && object.selected == i) {
                    option.setAttribute('selected', true);
                }
                if (i.toString().toLowerCase() == 'null') {
                    option.setAttribute('disabled', true);
                }
            }
        }

        if (this.isset(created.dataset.icon)) {
            created.addClasses(created.dataset.icon);
        }

        return created;
    }

    createFromHTML(htmlString = '', singleParent) {
        let parser = new DOMParser();
        let html = parser.parseFromString(htmlString, 'text/html');

        let created = html.body.firstChild;

        if (htmlString.indexOf('html') == 1) {
            created = html;
        }
        else if (htmlString.indexOf('body') == 1) {
            created = html.body;
        }

        if (this.isset(singleParent)) singleParent.attachElement(created, singleParent.attachment);
        return created;
    }

    createPerceptorElement(object, singleParent) {
        let created = this[object.perceptorElement](object.params);
        if (this.isset(singleParent)) {
            singleParent.attachElement(created, object.attachment);
        }
        return created;
    }

    getElement(singleParam = { element: '', attributes: {} }, singleParent) {
        var element;
        //if params is a HTML String
        if (typeof singleParam == 'string') {
            element = this.createFromHTML(singleParam, singleParent);
        }
        else if (this.isElement(singleParam)) {
            element = singleParam;
            if (this.isset(singleParent)) singleParent.attachElement(element, singleParam.attachment);
        }
        //if params is object
        else if (singleParam.constructor == Object) {
            if (singleParam.perceptorElement) {
                element = this.createPerceptorElement(singleParam, singleParent);
            }
            else {
                element = this.createFromObject(singleParam, singleParent);
            }
        }

        if (this.isset(element.setKey) && !this.isset(element.dataset.domKey)) {
            element.setKey();
        }

        if (this.isset(singleParam.list)) {
            let list = element.makeElement({ element: 'datalist', options: singleParam.list });
            element.setAttribute('list', element.dataset.domKey);
            list.setAttribute('id', element.dataset.domKey);
        }

        if (this.isset(singleParam.state)) {
            let owner = element.getParents(singleParam.state.owner, singleParam.state.value);
            if (!this.isnull(owner)) {
                owner.addState({ name: singleParam.state.name, state: element });
                element.dataset.stateStatus = 'set';
            } else {
                element.dataset.stateStatus = 'pending';
            }
        }

        return element;
    };

    createElement(params = { element: '', attributes: {} }, parent) {
        if (Array.isArray(params)) {
            let elements = [];
            for (let param of params) {
                elements.push(this.getElement(param, parent));
            }
            return elements;
        } else {
            let element = this.getElement(params, parent);
            return element;
        }
    }

    validateFormTextarea(element) {
        if (element.value == '') {
            return false;
        }
        return true;
    }

    validateFormInput(element) {
        var type = element.getAttribute('type');
        var value = element.value;

        if (this.isnull(type)) {
            return !this.isSpaceString(value);
        }

        type = type.toLowerCase();
        if (type == 'file') {
            return value != '';
        }
        else if (type == 'text') {
            return !this.isSpaceString(value);
        }
        else if (type == 'date') {
            if (this.hasString(element.className, 'future')) {
                return this.isDate(value);
            } else {
                return this.isDateValid(value);
            }
        }
        else if (type == 'email') {
            return this.isEmail(value);
        }
        else if (type == 'number') {
            return this.isNumber(value);
        }
        else if (type == 'password') {
            return this.isPasswordValid(value);
        }
        else {
            return !this.isSpaceString(value);
        }
    }

    validateFormSelect(element) {
        if (element.value == 0 || element.value.toLowerCase() == 'null') {
            return false;
        }

        return true;
    }

    validateForm(form, options) {
        options = options || {};
        options.nodeNames = options.nodeNames || 'INPUT, SELECT, TEXTAREA';
        let flag = true,
            nodeName,
            elementName,
            elements = form.findAll(options.nodeNames);

        let validateMe = me => {
            let value;
            if (nodeName == 'INPUT') {
                value = this.validateFormInput(me);
            }
            else if (nodeName == 'SELECT') {
                value = this.validateFormSelect(me);
            }
            else if (nodeName == 'TEXTAREA') {
                value = this.validateFormTextarea(me);
            }
            else {
                value = this.validateOtherElements(me);
            }

            return value;
        }

        for (let i = 0; i < elements.length; i++) {
            nodeName = elements[i].nodeName;
            elementName = elements[i].getAttribute('name');

            if (elements[i].getAttribute('ignore') == 'true') {
                continue;
            }

            if (this.isset(options.names)) {
                if (options.names.includes(elementName)) {
                    flag = validateMe(elements[i]);
                }
                else {
                    continue;
                }
            }
            else {
                flag = validateMe(elements[i]);
            }

            if (!flag) {
                break;
            }
        }

        return { flag, elementName };
    }

    validateOtherElements(element) {
        let value = false;
        if (this.isset(element.value) && element.value != '') value = true;
        return value;
    }

    ValidateFormImages(form) {
        return (type == 'file' && !self.isImageValid(value));
    }

    isImageValid(input) {
        var ext = input.substring(input.lastIndexOf('.') + 1).toLowerCase();
        if (ext == "png" || ext == "gif" || ext == "jpeg" || ext == "jpg") {
            return true;
        } else {
            return false;
        }
    }

    imageToJson(file, callBack = () => { }) {
        let fileReader = new FileReader();
        let myfile = {};
        fileReader.onload = (event) => {
            myfile.src = event.target.result;
            callBack(myfile);
        };

        myfile.size = file.size;
        myfile.type = file.type;
        fileReader.readAsDataURL(file);
    }
}

module.exports = JSElements;
},{"./Period":9}],7:[function(require,module,exports){
const Func = require('./Func');
let func = new Func()

class Matrix {
    constructor(params = { rows: 2, cols: 2, contents: [] }) {
        Object.keys(params).map(key => {
            this[key] = params[key];
        });

        this.rows = this.rows || 2;
        this.cols = this.cols || 2;
        this.contents = this.contents || [];
        this.setData(this.contents);
    }

    setData(contents = []) {
        this.contents = contents;
        this.data = [];
        for (let i = 0; i < this.rows; i++) {
            this.data[i] = [];
            for (let j = 0; j < this.rows; j++) {
                this.data[i][j] = contents.shift();
            }
        }
    }

    get structure() {
        let { rows, cols } = this;
        return { rows, cols };
    }

    add(n = 0) {
        if (n instanceof Matrix) {
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    this.data[i][j] += n.data[i][j];
                }
            }
        } else if (n instanceof Array) {
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    this.data[i][j] += n[i][j];
                }
            }
        }
        else {
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    this.data[i][j] += n;
                }
            }
        }
    }

    subtract(n = 0) {
        if (n instanceof Matrix) {
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    this.data[i][j] -= n.data[i][j];
                }
            }
        } else if (n instanceof Array) {
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    this.data[i][j] -= n[i][j];
                }
            }
        }
        else {
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    this.data[i][j] -= n;
                }
            }
        }
    }

    multiply(n = 1) {
        if (n instanceof Matrix) {
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < n.cols; j++) {
                    this.data[i][j] *= n.data[i][j];
                }
            }
        } else if (n instanceof Array) {
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    this.data[i][j] *= n[i][j];
                }
            }
        }
        else {
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    this.data[i][j] *= n;
                }
            }
        }
    }

    randomize() {
        this.map(value => {
            return func.random();
        });
    }

    transpose() {
        let newMatrix = new Matrix({ rows: this.cols, cols: this.rows });
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                newMatrix.data[j][i] = this.data[i][j];
            }
        }
        Object.keys(newMatrix).map(key => {
            this[key] = newMatrix[key];
        });
    }

    map(callback = (value, ...pos) => { }) {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                let value = this.data[i][j];
                this.data[i][j] = callback(value, i, j);
            }
        }
    }

    print() {
        console.table(this.data);
    }

    say() {
        console.log(this.toArray())
    }

    toArray() {
        this.contents = []
        Matrix.map(this, value => {
            this.contents.push(value);
        });
        return this.contents;
    }

    reshape(params = { rows: 2, cols: 2 }) {
        this.toArray();
        this.rows = params.rows;
        this.cols = params.cols;
        this.setData(this.contents);
    }

    getColumns(...cols) {
        let value = [];

        for (let i in cols) {
            value.push(Array.each(this.data, row => {
                return row[cols[i]];
            }));
        }

        return value;
    }

    getRows(...rows) {
        let value = [];

        for (let r = 0; r < this.rows; r++) {
            if (rows.includes(r)) {
                value.push(this.data[r]);
            }
        }

        return value;
    }

    static toArray(matrix) {
        let array = []
        Matrix.map(matrix, value => {
            array.push(value);
        });
        return array;
    }

    static subtract(a = new Matrix(), b) {
        let contents = [], rows = a.rows, cols = a.cols;

        if (b instanceof Matrix) {
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    contents.push(a.data[i][j] - b.data[i][j]);
                }
            }
        }
        else if (b instanceof Array) {
            for (let i = 0; i < a.rows; i++) {
                for (let j = 0; j < a.cols; j++) {
                    contents.push(a.data[i][j] - b[i][j]);
                }
            }
        }
        else {
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    contents.push(a.data[i][j] - b);
                }
            }
        }

        return new Matrix({ rows, cols, contents });
    }

    static add(a = new Matrix(), b) {
        let contents = [], rows = a.rows, cols = a.cols;

        if (b instanceof Matrix) {
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    contents.push(a.data[i][j] + b.data[i][j]);
                }
            }
        }
        else if (b instanceof Array) {
            for (let i = 0; i < a.rows; i++) {
                for (let j = 0; j < a.cols; j++) {
                    contents.push(a.data[i][j] + b[i][j]);
                }
            }
        }
        else {
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    contents.push(a.data[i][j] + b);
                }
            }
        }

        return new Matrix({ rows, cols, contents });
    }

    static multiply(a = new Matrix(), b) {
        let contents = [], rows, cols;

        if (b instanceof Matrix) {

            if (a.cols !== b.rows) {
                console.log('Columns of A must equal rows of B');
                return;
            }

            rows = a.rows;
            cols = b.cols;

            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    let sum = 0;
                    for (let k = 0; k < a.cols; k++) {
                        sum += a.data[i][k] * b.data[k][j];
                    }
                    contents.push(sum);
                }
            }
        }
        else if (b instanceof Array) {

            rows = a.rows;
            cols = a.cols;

            for (let i = 0; i < a.rows; i++) {
                for (let j = 0; j < a.cols; j++) {
                    contents.push(a.data[i][j] * b[i][j]);
                }
            }
        }
        else {
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    contents.push(a.data[i][j] * b);
                }
            }
        }

        return new Matrix({ rows, cols, contents });
    }

    static divide(a = new Matrix(), b) {
        let contents = [], rows, cols;

        if (b instanceof Matrix) {

            if (a.cols !== b.rows) {
                console.log('Columns of A must equal rows of B');
                return;
            }

            rows = a.rows;
            cols = b.cols;

            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    let sum = 0;
                    for (let k = 0; k < a.cols; k++) {
                        sum += (a.data[i][k] / b.data[k][j]) || 0;
                    }
                    contents.push(sum);
                }
            }
        }
        else if (b instanceof Array) {

            rows = a.rows;
            cols = a.cols;

            for (let i = 0; i < a.rows; i++) {
                for (let j = 0; j < a.cols; j++) {
                    contents.push((a.data[i][j] / b[i][j]) || 0);
                }
            }
        }
        else {
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    contents.push((a.data[i][j] / b) || 0);
                }
            }
        }

        return new Matrix({ rows, cols, contents });
    }

    static randomize(matrix = new Matrix()) {
        return Matrix.map(matrix, (value => {
            return func.random();
        }));
    }

    static transpose(matrix = new Matrix()) {
        let newMatrix = new Matrix({ rows: matrix.cols, cols: matrix.rows });
        for (let i = 0; i < matrix.rows; i++) {
            for (let j = 0; j < matrix.cols; j++) {
                newMatrix.data[j][i] = matrix.data[i][j];
            }
        }
        return newMatrix;
    }

    static map(matrix = new Matrix(), callback = () => { }) {
        let newMatrix = new Matrix({ rows: matrix.rows, cols: matrix.cols });
        for (let i = 0; i < matrix.rows; i++) {
            for (let j = 0; j < matrix.cols; j++) {
                let value = matrix.data[i][j];
                newMatrix.data[i][j] = callback(value, i, j);
            }
        }
        return newMatrix;
    }

    static fromArray(contents = []) {
        return new Matrix({ rows: contents.length, cols: 1, contents });
    }

    static reshape(params = { rows: 2, cols: 2, matrix: new Matrix }) {
        params.contents = Matrix.toArray(params.matrix);
        delete params.matrix;
        return new Matrix(params);
    }

    static normalize(matrix = new Matrix()) {
        let contents = Math.normalize(Matrix.toArray(matrix));
        return new Matrix({ rows: matrix.rows, cols: matrix.cols, contents });
    }

    static diagonal(array = []) {
        let matrix = Matrix.square(array.length);
        for (let i in matrix.data) {
            for (let j in matrix.data[i]) {
                if (i == j) {
                    matrix.data[i][j] = array[i];
                }
            }
        }
        matrix.toArray();
        return matrix;
    }

    static unit(size = 2) {
        let matrix = Matrix.square(size);
        for (let i in matrix.data) {
            for (let j in matrix.data[i]) {
                if (i == j) {
                    matrix.data[i][j] = 1;
                }
            }
        }
        matrix.toArray();
        return matrix;
    }

    static square(size = 2) {
        return new Matrix({ rows: size, cols: size });
    }

    static fromMatrixCols(matrix = new Matrix(), ...cols) {
        let value = matrix.getColumns(...cols);
        let contents = Array.flatten(value);
        let newMatrix = new Matrix({ rows: value.length, cols: matrix.cols, contents });
        newMatrix.transpose();
        return newMatrix;
    }

    static deepMatrix(dimensions = [], contents = []) {
        //split the dimensions into an array of arrays of length 2
        let matrixDimensions = [];
        for (let i = 0; i < dimensions.length; i++) {
            matrixDimensions.push({ rows: dimensions[i], cols: dimensions[++i] || 1 });
        }

        let makeMatrix = (layer) => {
            let matrix = new Matrix(matrixDimensions[layer]);

            if (layer + 1 == matrixDimensions.length) {
                matrix.map(value => {
                    return contents.shift() || 0;
                });
            } else {
                matrix.map(value => {
                    return makeMatrix(layer + 1);
                });
            }
            return matrix;
        }

        return makeMatrix(0);
    }
}

module.exports = Matrix;
},{"./Func":5}],8:[function(require,module,exports){
const Func = require('./Func');
const Matrix = require('./Matrix');
const ArrayLibrary = require('./../functions/ArrayLibrary');

let func = new Func();
let arrayLibrary = new ArrayLibrary();

class NeuralNetwork {
    constructor(params) {
        func.object.copy(params, this);
        this.ihWeights = new Matrix({ rows: this.hNodes, cols: this.iNodes });
        this.ihWeights.randomize();

        this.ihBias = new Matrix({ rows: this.hNodes, cols: 1 });
        this.ihBias.randomize();

        this.hoWeights = new Matrix({ rows: this.oNodes, cols: this.hNodes });
        this.hoWeights.randomize();

        this.hoBias = new Matrix({ rows: this.oNodes, cols: 1 });
        this.hoBias.randomize();

        this.lr = this.lr || 0.1;
    }

    feedFoward(inputArray = []) {
        let inputs = inputArray instanceof Matrix ? inputArray : this.prepareInputs(inputArray);

        let hiddens = Matrix.multiply(this.ihWeights, inputs);
        hiddens.add(this.ihBias);
        hiddens.map(sigmoid);

        let outputs = Matrix.multiply(this.hoWeights, hiddens);
        outputs.add(this.hoBias);
        outputs.map(sigmoid);

        return { inputs, hiddens, outputs };
    }

    queryBack(targetArray = []) {

    }

    predict(inputArray = []) {
        return this.feedFoward(inputArray).outputs;
    }

    getWeightsUpdate(inputs = new Matrix(), outputs = new Matrix(), errors = 1) {
        let gradients = Matrix.map(outputs, dSigmoid);
        gradients.multiply(errors);
        gradients.multiply(this.lr);

        let inputsTransposed = Matrix.transpose(inputs);
        let change = Matrix.multiply(gradients, inputsTransposed);

        return { change, gradients };
    }

    backpropagate(inputs = [], targets = new Matrix()) {
        let { hiddens, outputs } = this.feedFoward(inputs);

        let hoErrors = Matrix.subtract(targets, outputs);
        let hoUpdates = this.getWeightsUpdate(hiddens, outputs, hoErrors);
        this.hoWeights.add(hoUpdates.change);
        this.hoBias.add(hoUpdates.gradients);

        let hoWeightsTransposed = Matrix.transpose(this.hoWeights);
        let ihErrors = Matrix.multiply(hoWeightsTransposed, hoErrors);
        let ihUpdates = this.getWeightsUpdate(inputs, hiddens, ihErrors);
        this.ihWeights.add(ihUpdates.change);
        this.ihBias.add(ihUpdates.gradients);
    }

    train(params = { trainingData: [], period: 1, epoch: 1 }) {
        let inputArray = [], targetArray = [];
        for (let data of params.trainingData) {
            inputArray.push(data.inputs);
            targetArray.push(data.targets);
        }

        let inputs = arrayLibrary.each(inputArray, value => {
            return this.prepareInputs(value);
        });

        let targets = arrayLibrary.each(targetArray, value => {
            return this.prepareTargets(value);
        });

        let run = () => {
            for (let i = 0; i < params.period; i++) {
                for (let j in inputs) {
                    this.backpropagate(inputs[j], targets[j]);
                }
            }
        }

        if (func.isset(params.epoch)) {
            for (let p = 0; p < params.epoch; p++) {
                run();
            }
        } else {
            run();
        }
    }

    setLearningRate(lr = 0.1) {
        this.lr = lr;
    }

    prepareInputs(inputArray = []) {
        let inputs = Matrix.fromArray(Math.normalize(inputArray));
        inputs.multiply(0.99);
        inputs.add(0.01);
        return inputs;
    }

    prepareTargets(targetArray = []) {
        let targets = Matrix.fromArray(targetArray);
        targets.add(0.01);
        targets.multiply(0.99);
        return targets;
    }
}

module.exports = NeuralNetwork;
},{"./../functions/ArrayLibrary":15,"./Func":5,"./Matrix":7}],9:[function(require,module,exports){
const Func = require('./Func');

class Period extends Func {

    constructor() {
        super();
    }

    trimMonthArray() {
        let months = [];
        for (let i = 0; i < this.months.length; i++) {
            months.push(this.months[i].slice(0, 3));
        }
        return months;
    }

    getYears(count = 5) {
        let year = new Date().getYear() + 1900;
        let fetched = [];
        for (let i = 0; i < count; i++) {
            fetched.push(`${year - 1}-${year}`);
            year++;
        }
        return fetched;
    }

    isTimeValid(time) {
        time = time.split(':');
        if (time.length == 2 || time.length == 3) {
            var hour = new Number(time[0]);
            var minutes = new Number(time[1]);
            var seconds = 0;
            var total = 0;

            if (time.length == 3) {
                seconds = new Number(time[2]);
                if (hour > 23 || hour < 0 || minutes > 59 || minutes < 0 || seconds > 59 || seconds < 0) {
                    return false;
                }
            } else {
                if (hour > 23 || hour < 0 || minutes > 59 || minutes < 0) {
                    return false;
                }
            }

            var total = (hour * 60 * 60) + (minutes * 60) + seconds;
            return total;
        }
        return false;
    }

    time(time) {
        let date = (this.isset(time)) ? new Date(Math.floor(time)) : new Date();
        let hour = date.getHours().toString();
        let minutes = date.getMinutes().toString();
        let seconds = date.getSeconds().toString();

        hour = (hour.length > 1) ? hour : `0${hour}`;
        minutes = (minutes.length > 1) ? minutes : `0${minutes}`;
        seconds = (seconds.length > 1) ? seconds : `0${seconds}`;

        return `${hour}:${minutes}:${seconds}`;
    }

    date(time) {
        let date = (this.isset(time)) ? new Date(Math.floor(time)) : new Date();
        let day = date.getDate().toString();
        let month = (date.getMonth() + 1).toString();
        let year = date.getFullYear().toString();

        day = (day.length > 1) ? day : `0${day}`;
        month = (month.length > 1) ? month : `0${month}`;

        return `${year}-${month}-${day}`;
    }

    time_date(time) {
        return `${this.time(time)}, ${this.date(time)}`;
    }

    timeToday() {
        let date = new Date();
        let hour = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();

        let time = this.isTimeValid(`${hour}:${minutes}:${seconds}`);
        return time ? time : -1;
    }

    isDateValid(value) {
        if (this.isDate(value)) {
            if (this.isYearValid(value)) {
                if (this.isMonthValid(value)) {
                    if (this.isDayValid(value)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    isDayValid(value) {
        var v_day = "";
        for (var i = 0; i < 2; i++) {
            v_day += value[i + 8];
        }
        var limit = 0;
        var month = this.isMonthValid(value);

        if (month == '01') {
            limit = 31;
        } else if (month == '02') {
            if (this.isLeapYear(this.isYearValid(value))) {
                limit = 29;
            } else {
                limit = 28;
            }
        } else if (month == '03') {
            limit = 31;
        } else if (month == '04') {
            limit = 30;
        } else if (month == '05') {
            limit = 31;
        } else if (month == '06') {
            limit = 30;
        } else if (month == '07') {
            limit = 31;
        } else if (month == '08') {
            limit = 31;
        } else if (month == '09') {
            limit = 30;
        } else if (month == '10') {
            limit = 31;
        } else if (month == '11') {
            limit = 30;
        } else if (month == '12') {
            limit = 31;
        }

        if (limit < v_day) {
            return 0;
        }
        return v_day;
    }

    isDate(value) {
        var len = value.length;
        if (len == 10) {
            for (var x in value) {
                if (this.isDigit(value[x])) {
                    continue;
                } else {
                    if (x == 4 || x == 7) {
                        if (value[x] == '-') {
                            continue;
                        } else {
                            return false;
                        }
                    } else {
                        return false;
                    }
                }
            }
        } else {
            return false;
        }
        return true;
    }

    isMonthValid(value) {
        var v_month = "";
        for (var i = 0; i < 2; i++) {
            v_month += value[i + 5];
        }
        if (v_month > 12 || v_month < 1) {
            return 0;
        }
        return v_month;
    }

    isYearValid(value) {
        var year = new Date().getFullYear('Y');
        var v_year = "";
        for (var i = 0; i < 4; i++) {
            v_year += value[i + 0];
        }
        if (v_year > year) {
            return 0;
        }
        return v_year;
    }

    getYear(value) {
        var v_year = "";
        for (var i = 0; i < 4; i++) {
            v_year += value[i + 0];
        }
        return v_year;
    }

    isLeapYear(value) {
        if (value % 4 == 0) {
            if ((value % 100 == 0) && (value % 400 != 0)) {
                return false;
            }
            return true;
        }
        return false;
    }

    daysInMonth(month, year) {
        var days = 0;
        if (month == '01') {
            days = 31;
        } else if (month == '02') {
            if (this.isLeapYear(year)) {
                days = 29;
            } else {
                days = 28;
            }
        } else if (month == '03') {
            days = 31;
        } else if (month == '04') {
            days = 30;
        } else if (month == '05') {
            days = 31;
        } else if (month == '06') {
            days = 30;
        } else if (month == '07') {
            days = 31;
        } else if (month == '08') {
            days = 31;
        } else if (month == '09') {
            days = 30;
        } else if (month == '10') {
            days = 31;
        } else if (month == '11') {
            days = 30;
        } else if (month == '12') {
            days = 31;
        }
        return days;
    }

    dateValue(date) {
        var value = 0;
        var year = this.getYear(date) * 365;
        var month = 0;
        for (var i = 1; i < this.isMonthValid(date); i++) {
            month = this.daysInMonth(i, this.getYear(date)) / 1 + month / 1;
        }
        var day = this.isDayValid(date);
        value = (year / 1) + (month / 1) + (day / 1);

        return value;
    }

    today() {
        let today = new Date;
        let month = today.getMonth() / 1 + 1;
        month = (month.length > 1) ? month : `0${month}`;

        today = (today.getFullYear()) + '-' + month + '-' + today.getDate();
        return today;
    }

    getDateObject(value) {
        let days = Math.floor(value / this.secondsInDays(1));

        value -= this.secondsInDays(days);

        let hours = Math.floor(value / this.secondsInHours(1));
        value -= this.secondsInHours(hours);

        let minutes = Math.floor(value / this.secondsInMinutes(1));
        value -= this.secondsInMinutes(minutes);

        let seconds = value;

        return { days, hours, minutes, seconds };
    }

    dateWithToday(date) {
        var today = Math.floor(this.dateValue(this.today()));
        let dateValue = Math.floor(this.dateValue(date));

        var value = { diff: (dateValue - today), when: '' };
        if (dateValue > today) {
            value.when = 'future';
        }
        else if (dateValue == today) {
            value.when = 'today';
        }
        else {
            value.when = 'past';
        }
        return value;
    }

    dateString(date) {
        let year = new Number(this.getYear(date));
        let month = new Number(this.isMonthValid(date));
        let day = new Number(this.isDayValid(date));

        return day + ' ' + this.months[month - 1] + ', ' + year;
    }

    secondsInDays(days) {
        let value = Math.floor(days * 24 * 60 * 60);
        return value;
    }

    secondsInHours(hours) {
        return Math.floor(hours * 60 * 60);
    }

    secondsInMinutes(minutes) {
        return Math.floor(minutes * 60);
    }

    secondsTillDate(date) {
        return this.secondsInDays(Math.floor(this.dateValue(date)));
    }

    secondsTillToday() {
        return this.secondsTillDate(this.today());
    }

    secondsTillNow() {
        return this.secondsTillDate(this.today()) + this.timeToday();
    }

    secondsTillMoment(moment) {
        return this.secondsTillDate(this.date(moment)) + this.isTimeValid(this.time(moment));
    }

    log(...data) {
        let time = `[${this.time()}]:`;
        console.log(time, ...data);
    }
}

module.exports = Period;
},{"./Func":5}],10:[function(require,module,exports){
const JSElements = require('./JSElements');

class Empty {
}

class Template extends JSElements {
    constructor(theWindow = Empty) {
        super(theWindow);
        this.virtual = {};
        this.elementLibrary(theWindow.Element);
        this.htmlCollectionLibrary(theWindow.HTMLCollection);
        this.nodeLibrary(theWindow.Node);
        this.nodeListLibrary(theWindow.NodeList);
    }

    elementLibrary(Element = Empty) {
        //Framework with jsdom
        let self = this;
        Element.prototype.changeNodeName = function (name) {
            let structure = this.toJson();
            structure.element = name;
            let element = self.createElement(structure);
            return element;
        };

        Element.prototype.toJson = function () {
            let element = this.nodeName.toLowerCase();
            let attributes = this.getAttributes();
            attributes.style = this.css();
            let children = [];
            for (let i = 0; i < this.children.length; i++) {
                children.push(this.children[i].toJson());
            }
            return { element, attributes, children }
        }

        Element.prototype.setOptions = function (options = [], params = { selected: '' }) {
            params = params || {};
            if (self.isset(params.flag)) {
                this.innerHTML = '';
            }

            for (let i = 0; i < options.length; i++) {
                let text = options[i].text || options[i];
                let value = options[i].value || options[i];

                let option = this.makeElement({ element: 'option', attributes: { value }, text });

                if (value.toString().toLowerCase() == 'null') {
                    option.setAttribute('disabled', true);
                }

                if (self.isset(params.selected) && value == params.selected) {
                    option.setAttribute('selected', true);
                }
            }
        };

        Element.prototype.commonAncestor = function (elementA, elementB) {
            for (let ancestorA of elementA.parents()) {
                for (let ancestorB of elementB.parents()) {
                    if (ancestorA == ancestorB) return ancestorA;
                }
            }

            return null;
        }

        Element.prototype.onAdded = function (callback = () => { }) {
            this.addEventListener('DOMNodeInsertedIntoDocument', event => {
                callback();
            });
        }
        //Store the states of an element here
        Element.prototype.states = {};

        //This is a temporary storage for elements attributes
        Element.prototype.temp = {};

        //This listens and handles for multiple bubbled events
        Element.prototype.manyBubbledEvents = function (events, callback = () => { }) {
            events = events.split(',');
            for (let event of events) {
                this.bubbledEvent(event.trim(), callback);
            }
        }

        //This listens and handles for multiple bubbled events that did not bubble
        Element.prototype.manyNotBubbledEvents = function (events, callback = () => { }) {
            events = events.split(',');
            for (let event of events) {
                this.notBubbledEvent(event.trim(), callback);
            }
        }

        //This handles all events that are bubbled within an element and it's children
        Element.prototype.bubbledEvent = function (event, callback = () => { }) {
            //Listen for this event on the entire document
            document.addEventListener(event, event => {
                //if the event bubbles up the element fire the callback
                if (event.target == this || this.isAncestor(event.target)) {
                    callback(event);
                }
            });
        }

        Element.prototype.addChildEventListener = function (name = '', child = { id: '', classes: [], nodeName: '' }, callBack = () => { }) {
            let target, parent, identifier, flag;
            if (child.constructor != Object) child = {};
            this.addEventListener(name, e => {
                target = e.target;
                identifier = '';
                flag = true;

                if (child.id != undefined && child.id.constructor == String) {
                    identifier += `#${child.id}`;
                    if (flag) flag = event.target.id == child.id;
                }
                if (child.nodeName != undefined && child.nodeName.constructor == String) {
                    identifier += child.nodeName;
                    if (flag) flag = event.target.nodeName.toLowerCase() == child.nodeName;
                }
                if (child.classes != undefined && Array.isArray(child.classes) && child.classes.length) {
                    identifier += `.${child.classes.join('.')}`;
                    if (flag) flag = event.target.hasClasses(child.classes);
                }

                if ((flag != undefined && flag)) {
                    e.bubbledTo = target;
                    callBack(e);
                }
                else {
                    parent = target.getParents(identifier);
                    if (parent != null) {
                        e.bubbledTo = parent;
                        callBack(e);
                    }
                }
            });
        }

        //This handles all events that are not bubbled within an element and it's children
        Element.prototype.notBubbledEvent = function (event, callback = () => { }) {
            document.addEventListener(event, event => {
                if (!(event.target == this || this.isAncestor(event.target))) {
                    callback(event);
                }
            });
        }

        //Listen to multiple events at time with a single callback function
        Element.prototype.addMultipleEventListener = function (events, callback = () => { }) {
            events = events.split(',');
            for (let event of events) {
                this.addEventListener(event.trim(), e => {
                    callback(e);
                });
            }
        }

        //perform actions on mouseenter and mouseleave
        Element.prototype.hover = function (movein = () => { }, moveout = () => { }) {
            this.addEventListener('mouseenter', event => {
                if (typeof movein === 'function')
                    movein(event);
            });

            this.addEventListener('mouseleave', event => {
                if (typeof moveout === 'function')
                    moveout(event);
            });
        }

        //a shorter name for querySelector
        Element.prototype.find = function (name = '', position = 0) {
            let element = null;
            if (self.isset(position)) {//get the all the elements found and return the one at this particular position
                this.querySelectorAll(name).forEach((e, p) => {
                    if (position == p) element = e;
                });
            }
            else {
                element = this.querySelector(name);
            }
            return element;
        };

        //a shorter name for querySelectorAll
        Element.prototype.findAll = function (name = '') {
            return this.querySelectorAll(name);
        }

        //perform an extended querySelection on this element
        Element.prototype.search = function (name = '', options = { attributes: {}, id: '', nodeName: '', class: '', classes: '' }, position = 0) {
            let element = null;
            let foundElements = [];//all the elements meeting the requirements

            if (self.isset(options)) {//if the options to check is set
                let allElements = this.querySelectorAll(name);//get all the possible elements

                //loop through them and check if the match the options
                for (let i = 0; i < allElements.length; i++) {
                    element = allElements[i];

                    //check for the attributes
                    if (self.isset(options.attributes)) {
                        for (let attr in options.attributes) {
                            // check all the attributes one after the other
                            if (element.getAttribute(attr) != options.attributes[attr]) {
                                element = null;
                                continue;
                            }
                        }
                        //if this element is no long valid skip it
                        if (self.isnull(element)) continue;
                    }

                    //check for the ID
                    if (self.isset(options.id) && options.id != element.id) {
                        element = null;
                        continue;
                    }

                    //check for the class
                    if (self.isset(options.class) && !element.classList.contains(options.class)) {
                        element = null;
                        continue;
                    }

                    //check for the classes
                    if (self.isset(options.classes) && !element.hasClasses(options.classes)) {
                        element = null;
                        continue;
                    }

                    //check for the nodename
                    if (self.isset(options.nodeName) && element.nodeName.toLowerCase() != options.nodeName) {
                        element = null;
                        continue;
                    }

                    //check if to return for a particular position
                    if (position <= 0) return element;
                    foundElements.push(element);
                }
                //get the element at the specified position
                if (foundElements.length && self.isset(foundElements[position])) {
                    element = foundElements[position];
                }
                else {
                    element = null;
                }
            }
            else {
                element = this.find(name);
            }

            return element;
        };

        //perform search for all the elements that meet a requirement
        Element.prototype.searchAll = function (name = '', options = { attributes: {}, id: '', nodeName: '', class: '', classes: '' }) {
            if (self.isset(options)) {
                let allElements = this.querySelectorAll(name);
                let elements = [];
                for (let i = 0; i < allElements.length; i++) {
                    let element = allElements[i];
                    if (self.isset(options.attributes)) {
                        for (let attr in options.attributes) {
                            if (element.getAttribute(attr) != options.attributes[attr]) {
                                element = null;
                                continue;
                            }
                        }
                    }

                    if (self.isset(options.id) && options.id != element.id) {
                        element = null;
                        continue;
                    }

                    if (self.isset(options.class) && !element.classList.contains(options.class)) {
                        element = null;
                        continue;
                    }

                    if (self.isset(options.classes) && !element.hasClasses(options.classes)) {
                        element = null;
                        continue;
                    }

                    if (self.isset(options.nodeName) && element.nodeName.toLowerCase() != options.nodeName) {
                        element = null;
                        continue;
                    }

                    if (!self.isnull(element)) {
                        elements.push(element);
                    }
                }
                return elements;
            }
            return this.querySelectorAll(name);
        }

        //look for multiple single elements at a time
        Element.prototype.fetch = function (names = [], position = 0) {
            let elements = {};
            for (let name of names) {
                elements[name] = this.find(name, position);
            }

            return elements;
        }

        //look for multiple nodelists at a time
        Element.prototype.fetchAll = function (names = []) {
            let elements = {};
            for (let name of names) {
                elements[name] = this.findAll(name);
            }

            return elements;
        }

        //Get the nodes between two child elements
        Element.prototype.nodesBetween = function (elementA, elementB) {
            let inBetweenNodes = [];
            for (let child of Array.from(this.children)) {//get all the children
                //check if the two elements are children of this element
                if (child == elementA || child == elementB || child.isAncestor(elementA) || child.isAncestor(elementB)) {
                    inBetweenNodes.push(child);
                }
            }

            return inBetweenNodes;
        }

        //Get if element is child of an element
        Element.prototype.isAncestor = function (child) {
            let parents = child.parents();//Get all the parents of child
            return parents.includes(this);
        };

        //Get all the parents of an element until document
        Element.prototype.parents = function () {
            let parents = [];
            let currentParent = this.parentNode;
            while (currentParent != null) {
                parents.push(currentParent);
                currentParent = currentParent.parentNode;
            }

            return parents;
        };

        Element.prototype.customParents = function () {
            let parents = this.parents();
            let customParents = [];
            for (let i = 0; i < parents.length; i++) {
                if (parents[i].nodeName.includes('-')) {
                    customParents.push(parents[i]);
                }
            }
            return customParents;
        }

        //Remove a state from an element
        Element.prototype.removeState = function (params = { name: '' }) {
            let state = this.getState(params);//get the state (element)
            if (self.isset(state) && self.isset(params.force)) {//if state exists and should be deleted
                if (self.isset(state.dataset.domKey)) {
                    delete self.virtual[state.dataset.domKey];//delete the element from virtual dom
                }
                state.remove();//remove the element from dom
            }
            this.removeAttribute(`data-${params.name}`);//remove the state from element
        }

        //Get an element's state 
        Element.prototype.getState = function (params = { name: '' }) {
            let state = null;
            let stateName;

            //get the state name
            if (typeof params == 'string') {
                stateName = params;
            }
            else if (self.isset(this.dataset[`${params.name}`])) {
                stateName = params.name;
            }

            if (self.isset(stateName)) {//get the state
                state = self.virtual[this.dataset[stateName]];
                // let state = self.objectToArray(this.states[stateName]).pop();
            }

            return state;
        };

        //add a state to an element
        Element.prototype.addState = function (params = { name: '' }) {
            //make sure the state has a domkey
            if (!self.isset(params.state.dataset.domKey)) {
                params.state.setKey();
            }

            //add the state to the elements dataset
            this.dataset[params.name] = params.state.dataset.domKey;
            this.states[params.name] = {}//initialize the state
            return this;
        };

        //set the state of an element
        Element.prototype.setState = function (params = { name: '', attributes: {}, render: {}, children: [], text: '', html: '', value: '', options: [] }) {
            let state = this.getState(params);

            // let found = this.states[params.name][JSON.stringify(params)];
            // if (self.isset(found)) {
            //     state.innerHTML = found.innerHTML;
            //     state.setAttributes(found.getAttributes());
            // }
            // else {
            //     state.setAttributes(params.attributes);
            //     if (self.isset(params.children)) {//add the children if set
            //         state.makeElement(params.children);
            //     }
            //     if (self.isset(params.render)) {//add the children if set
            //         state.render(params.render);
            //     }
            //     if (self.isset(params.text)) state.textContent = params.text;//set the innerText
            //     if (self.isset(params.value)) state.value = params.value;//set the value
            //     if (self.isset(params.options)) {//add options if isset
            //         for (var i of params.options) {
            //             state.makeElement({ element: 'option', value: i, text: i, attachment: 'append' });
            //         }
            //     }

            //     this.states[params.name][JSON.stringify(params)] = state.cloneNode(true);
            // }

            state.setAttributes(params.attributes);
            if (self.isset(params.children)) {//add the children if set
                state.makeElement(params.children);
            }
            if (self.isset(params.render)) {//add the children if set
                state.render(params.render);
            }
            if (self.isset(params.text)) state.textContent = params.text;//set the innerText
            if (self.isset(params.html)) state.innerHTML = params.html;//set the innerText
            if (self.isset(params.value)) state.value = params.value;//set the value
            if (self.isset(params.options)) {//add options if isset
                for (var i of params.options) {
                    state.makeElement({ element: 'option', value: i, text: i, attachment: 'append' });
                }
            }

            this.states[params.name][JSON.stringify(params)] = state.cloneNode(true);

            return state;
        };

        //async version of setstate
        Element.prototype.setKeyAsync = async function () {
            return await this.setKey();
        };

        //set element's dom key for the virtual dom
        Element.prototype.setKey = function () {
            let key = Date.now().toString(36) + Math.random().toString(36).slice(2);//generate the key
            if (!self.isset(this.dataset.domKey)) {//does this element have a key
                this.dataset.domKey = key;
            } else {
                key = this.dataset.domKey;
            }
            self.virtual[key] = this;//add it to the virtual dom
            return key;
        };

        //drop down a child
        Element.prototype.dropDown = function (element) {
            let parentContent = this.cloneNode(true);
            this.innerHTML = '';
            this.append(parentContent);
            parentContent.css({ boxShadow: '1px 1px 1px 1px #aaaaaa' });
            this.css({ boxShadow: '0.5px 0.5px 0.5px 0.5px #cccccc' });

            let dropContainer = this.makeElement({
                element: 'div', attributes: { class: 'drop-down' }
            });
            dropContainer.append(element);

            this.removeDropDown = () => {
                dropContainer.remove();
                parentContent.css({ boxShadow: 'unset' });
                this.innerHTML = parentContent.innerHTML;
            }

            return this;
        };

        //stop monitoring this element for changes
        Element.prototype.stopMonitor = function () {
            if (this.observe) this.observer.disconnect();//disconnect observer
            return this;
        }

        //Check if an attribute has changed in this element
        Element.prototype.onAttributeChange = function (attribute = '', callback = () => { }) {
            this.addEventListener('attributesChanged', event => {
                if (event.detail.attributeName == attribute) {
                    callback(event);
                }
            });
        }

        // monitor this element for changes
        Element.prototype.monitor = function (config = { attributes: true, childList: true, subtree: true }) {
            this.observer = new MutationObserver((mutationList, observer) => {
                if (mutationList.length) this.dispatchEvent(new CustomEvent('mutated'));//fire mutated event for it
                for (let mutation of mutationList) {
                    if (mutation.type == 'childList') {//if the change was a child fire childlistchanged event
                        this.dispatchEvent(new CustomEvent('childListchanged', { detail: mutation }));
                    }
                    else if (mutation.type == 'attributes') {//if the change was a child fire childlistchanged event
                        this.dispatchEvent(new CustomEvent('attributesChanged', { detail: mutation }));
                    }
                    else if (mutation.type == 'characterData') {//if the change was a child fire childlistchanged event
                        this.dispatchEvent(new CustomEvent('characterDataChanged', { detail: mutation }));
                    }
                }
            });

            this.observer.observe(this, config);
            return this;
        }

        Element.prototype['checkChanges'] = function (callback = () => { }) {
            this.monitor();
            this.addEventListener('mutated', event => {
                callback(event);
            });
        };

        // check when the value of an element is changed
        Element.prototype.onChanged = function (callBack = () => { }) {
            let value = this.getAttribute('value');
            let updateMe = (event) => {
                // if element is input element
                if (event.target.nodeName == 'INPUT') {
                    if (event.target.type == 'date') {// if the type is date, check if the date is valid then update the attribute
                        if (this.isDate(this.value)) this.setAttribute('value', this.value);
                    }
                    else if (event.target.type == 'time') {// if the type is time, check if the time is valid then update the attribute
                        if (this.isTimeValid(this.value)) this.setAttribute('value', this.value);
                    }
                    else if (event.target.type == 'file') {
                        let fileName = event.target.value;
                        let file = event.target.files[0];
                        if (file.type.indexOf('image') == 0) {
                            self.imageToJson(file, callBack);
                        }
                    }
                    else {
                        this.setAttribute('value', this.value);//update the attribute
                    }
                }
                else if (event.target.nodeName == 'SELECT') {// if the element is select
                    for (let i = 0; i < event.target.options.length; i++) {//update the selected option using the selected index
                        if (i == event.target.selectedIndex) {
                            event.target.options[i].setAttribute('selected', true);
                        } else {
                            event.target.options[i].removeAttribute('selected');
                        }
                    }
                }
                else if (event.target.nodeName == 'DATA-ELEMENT') {
                    this.setAttribute('value', this.value);
                }
                else if (event.target.nodeName == 'SELECT-ELEMENT') {
                    this.setAttribute('value', this.value);
                }
                else {
                    this.value = this.textContent;
                }

                if (self.isset(callBack) && event.target.type != 'file') {
                    callBack(this.value, event);//fire the callback function
                }
            };

            // if change is caused by keyboard
            this.addEventListener('keyup', (event) => {
                updateMe(event);
            });

            // if change is caused programatically
            this.addEventListener('change', (event) => {
                updateMe(event);
            });
        };

        //render the contents of an element
        Element.prototype.render = function (params = { element: '', attributes: {} }, except) {
            if (self.isset(except)) this.removeChildren(except);//remove the contents of the element with exceptions
            else this.removeChildren();
            this.makeElement(params);//append the new contents of the element
        }

        //Get all the styles for the ID, the classes and the element
        Element.prototype.getAllCssProperties = function () {
            let styleSheets = Array.from(document.styleSheets),//get all the css styles files and rules
                cssRules,
                id = this.id,
                nodeName = this.nodeName,
                classList = Array.from(this.classList),
                properties = {},
                selectorText;

            for (var i in classList) classList[i] = `.${classList[i]}`;//turn each class to css class format [.class]

            for (var i = 0; i < styleSheets.length; i++) {//loop through all the css rules in document/app
                cssRules = styleSheets[i].cssRules;
                for (var j = 0; j < cssRules.length; j++) {
                    selectorText = cssRules[j].selectorText; //for each selector text check if element has it as a css property
                    if (selectorText == `#${id}` || selectorText == nodeName || classList.indexOf(selectorText) != -1) {
                        properties[selectorText] = {};
                        let style = cssRules[j].style;
                        for (let n in style) {
                            if (style[n] !== '') [
                                properties[selectorText][n] = style[n]
                            ]
                        }
                    }
                }
            }

            //if element has property add it to css property
            properties['style'] = this.css();
            return properties;
        }

        //Get the values of property 
        Element.prototype.getCssProperties = function (property = '') {
            let allProperties = this.getAllCssProperties();
            let properties = {};
            for (let name in allProperties) {
                properties[name] = {};
                for (let p in allProperties[name]) {
                    if (property == p) properties[name][p] = allProperties[name][p];
                }
            }

            return properties;
        }

        // Check if this element has this property
        Element.prototype.hasCssProperty = function (property = '') {
            var properties = this.getCssProperties(property); //get elements css properties
            for (var i in properties) {//loop through json object
                if (self.isset(properties[i]) && properties[i] != '') {
                    return true;// if property is found return true
                }
            }
            return false;
        }

        //Get the most relavant value for the property
        Element.prototype.cssPropertyValue = function (property = '') {
            //check for the value of a property of an element
            var properties = this.getCssProperties(property),
                id = this.id,
                classList = Array.from(this.classList);

            if (self.isset(properties['style']) && properties['style'] != '') return properties['style'];//check if style rule has the propert and return it's value
            if (self.isset(id) && self.isset(properties[`#${id}`]) && properties[`#${id}`] != '') return properties[`#${id}`];//check if element id rule has the propert and return it's value
            for (var i of classList) {//check if any class rule has the propert and return it's value
                if (self.isset(properties[`.${i}`]) && properties[`.${i}`] != '') return properties[`.${i}`];
            }
            //check if node rule has the propert and return it's value
            if (self.isset(properties[this.nodeName]) && properties[this.nodeName] != '') return properties[this.nodeName];
            return '';
        }

        // Get and Set the css values
        Element.prototype.css = function (styles = {}) {
            // set css style of element using json
            if (self.isset(styles)) {
                Object.keys(styles).map((key) => {
                    this.style[key] = styles[key];
                });
            }

            return self.extractCSS(this);
        }

        // Remove a css property
        Element.prototype.cssRemove = function (styles = []) {
            //remove a group of properties from elements style
            if (Array.isArray(styles)) {
                for (var i of styles) {
                    this.style.removeProperty(i);
                }
            }
            else {
                this.style.removeProperty(styles);
            }
            return this.css();
        }

        // Toggle a child element
        Element.prototype.toggleChild = function (child) {
            //Add child if element does not have a child else remove the child form the element
            var name, _classes, id, found = false;

            this.children.forEach(node => {
                name = node.nodeName;
                _classes = node.classList;
                id = node.id;
                if (name == child.nodeName && id == child.id && _classes.toString() == child.classList.toString()) {
                    node.remove();
                    found = true;
                }
            });
            if (!found) this.append(child);
        }

        //remove all classes except some
        Element.prototype.clearClasses = function (except = '') {
            except = except.split(',');
            for (let j in except) {
                except[j] = except[j].trim();
            }
            for (let i of this.classList) {
                if (self.isset(except) && except.includes(i)) continue;
                this.classList.remove(i);
            }
        };

        //remove classes
        Element.prototype.removeClasses = function (classes = '') {
            classes = classes.split(',');
            for (let i of classes) {
                i = i.trim();
                if (i != '') {
                    this.classList.remove(i);
                }
            }
        };

        //add classes
        Element.prototype.addClasses = function (classes = '') {
            classes = classes.split(',');
            for (let i of classes) {
                i = i.trim();
                if (i != '') {
                    this.classList.add(i);
                }
            }
        };

        //toggle classes
        Element.prototype.toggleClasses = function (classes = '') {
            classes = classes.split(',');
            for (let i of classes) {
                i = i.trim();
                if (i != '') {
                    this.classList.toggle(i);
                }
            }
        };

        // Remove a class from element classlist
        Element.prototype.removeClass = function (_class = '') {
            this.classList.remove(_class);
            return this;
        }

        // Check if element classlist contains a group of classes
        Element.prototype.hasClasses = function (classList = []) {
            for (let mClass of classList) {
                if (!this.classList.contains(mClass)) return false;
            }
            return true;
        }

        // add a class to element classlist
        Element.prototype.addClass = function (_class = '') {
            this.classList.add(_class);
            return this;
        }

        // toggle a class in element classlist
        Element.prototype.toggleClass = function (_class = '') {
            // (this.classList.contains(_class)) ? this.classList.remove(_class) : this.classList.add(_class);
            this.classList.toggle(_class);
            return this;
        }

        //Get the position of element in dom
        Element.prototype.position = function (params = {}) {
            if (self.isset(params)) {
                Object.keys(params).map(key => {
                    params[key] = (new String(params[key]).slice(params[key].length - 2) == 'px') ? params[key] : `${params[key]}px`;
                });
                this.css(params);
            }
            let position = this.getBoundingClientRect();

            return position;
        }

        //check if element is within container
        Element.prototype.inView = function (parentIdentifier = '') {
            let parent = this.getParents(parentIdentifier);
            let top = this.position().top;
            let flag = false;

            if (!self.isnull(parent)) {
                flag = top >= 0 && top <= parent.clientHeight;
            }
            return flag;
        }

        //Check if a class exists in element's classlist
        Element.prototype.hasClass = function (_class = '') {
            return this.classList.contains(_class);
        }

        // Set a list of properties for an element
        Element.prototype.setProperties = function (properties = {}) {
            for (let i in properties) {
                this[i] = properties[i];
            }
        };

        // Set a list of attributes for an element
        Element.prototype.setAttributes = function (attributes = {}) {
            for (let i in attributes) {
                if (i == 'style') {
                    this.css(attributes[i]);
                }
                else {
                    this.setAttribute(i, attributes[i]);
                }
            }
        };

        // Get the values of a list of attributes
        Element.prototype.getAttributes = function (names = []) {
            if (names.length == 0) names = this.getAttributeNames();
            let attributes = {};

            for (let name of names) {
                attributes[name] = this.getAttribute(name);
            }
            return attributes;
        }

        //Create and attatch an element in an element
        Element.prototype.makeElement = function (params = { element: '', attributes: {} }) {
            this.setKeyAsync();

            let element = self.createElement(params, this);
            return element;
        }

        // Get an elements ancestor with a specific attribute
        Element.prototype.getParents = function (name = '', value = '') {
            var attribute = name.slice(0, 1);
            var parent = this.parentNode;
            if (attribute == '.') {
                while (parent) {
                    if (self.isset(parent.classList) && parent.classList.contains(name.slice(1))) {
                        break;
                    }
                    parent = parent.parentNode;
                }
            }
            else if (attribute == '#') {
                while (parent) {
                    if (self.isset(parent.id) && parent.id == name.slice(1)) {
                        break;
                    }
                    parent = parent.parentNode;
                }
            }
            else {
                while (parent) {
                    if (self.isset(parent.nodeName) && parent.nodeName.toLowerCase() == name.toLowerCase()) {
                        break;
                    }
                    else if (self.isset(parent.hasAttribute) && parent.hasAttribute(name)) {
                        if (self.isset(value) && parent.getAttribute(name) == value) {
                            break;
                        }
                        else break;
                    }
                    parent = parent.parentNode;
                }
            }
            return parent;
        }

        // Toggle the display of an element
        Element.prototype.toggle = function () {
            if (this.style.display == 'none' || this.style.visibility == 'hidden') this.show();
            else this.hide();
        }

        //Hide an element in dom
        Element.prototype.hide = function () {
            // if (self.isset(this.style.display)) this.temp.display = this.style.display;
            // if (self.isset(this.style.visibility)) this.temp.visibility = this.style.visibility;

            this.style.display = 'none';
            // this.style.visibility = 'hidden';
            return this;
        }

        //Show an element in dom
        Element.prototype.show = function () {
            // if (this.style.display == 'none') {
            //     // if (self.isset(this.temp.display)) {
            //     //     this.css({ display: this.temp.display });
            //     // }
            //     // else this.cssRemove(['display']);
            // }
            this.cssRemove(['display']);
            return this;
        }

        //Remove all the children of an element with exceptions of some
        Element.prototype.removeChildren = function (params = { except: [] }) {
            let exceptions = [];
            params = params || {};
            params.except = params.except || [];
            let except = params.except;
            for (let i = 0; i < except.length; i++) {
                let all = this.findAll(except[i]);
                for (let j = 0; j < all.length; j++) {
                    if (!exceptions.includes(all[j])) exceptions.push(all[j]);
                }
            }

            this.children.forEach(node => {
                if (!exceptions.includes(node)) node.remove();
            });

            return this;
        }

        //Delete an element from the dom and virtual dom
        Element.prototype.delete = function () {
            if (self.isset(this.dataset.domKey)) {
                delete self.virtual[this.dataset.domKey];
            }
            this.remove();
        }

        //Delete an elements child from the dom and the virtual dom
        Element.prototype.deleteChild = function (child) {
            child.delete();
            return this;
        }

        // Toggle a list of children of an element
        Element.prototype.toggleChildren = function (params = { name: '', class: '', id: '' }) {
            Array.from(this.children).forEach(node => {
                if (!((self.isset(params.name) && params.name == node.nodeName) || self.isset(params.class) && self.hasArrayElement(Array.from(node.classList), params.class.split(' ')) || (self.isset(params.id) && params.id == node.id))) {
                    node.toggle();

                } else {
                    node.toggle();
                }
            });
        }

        // Attatch an element to another element [append or prepend]
        Element.prototype.attachElement = function (element, attachment = 'append') {
            this[attachment](element);
        }

        Element.prototype.pressed = function (callback = () => { }) {
            let startTime = 0, endTime = 0;
            this.addMultipleEventListener('mousedown, touchstart', event => {
                startTime = event.timeStamp;
            });

            this.addMultipleEventListener('mouseup, touchend', event => {
                endTime = event.timeStamp;
                event.duration = endTime - startTime;

                callback(event);
            });
        }
    }

    htmlCollectionLibrary(HTMLCollection = Empty) {
        let self = this;

        HTMLCollection.prototype.popIndex = function (position = 0) {
            let collection = self.createElement({ element: 'sample' }).children;

            let list = Array.from(this);

            for (let i = 0; i < list.length; i++) {
                if (i == position) continue;
                collection[i] = this.item(i);
            }

            return collection;
        }

        HTMLCollection.prototype.forEach = function (callback = () => { }) {
            let list = Array.from(this);
            for (let i = 0; i < list.length; i++) {
                callback(list[i], i)
            }
        };

        HTMLCollection.prototype.each = function (callback = () => { }) {
            let list = Array.from(this);
            for (let i = 0; i < list.length; i++) {
                callback(list[i], i)
            }
        }


        HTMLCollection.prototype['indexOf'] = function (element) {
            let list = Array.from(this);
            for (let i in list) {
                if (list == element) return i;
            }
            return -1;
        };

        HTMLCollection.prototype['includes'] = function (element) {
            return this.indexOf(element) != -1;
        };

        HTMLCollection.prototype['nodesBetween'] = function (elementA, elementB) {
            let inBetweenNodes = [];
            let list = Array.from(this);

            for (let aParent of list) {
                if (aParent == elementA || aParent == elementB || aParent.isAncestor(elementA) || aParent.isAncestor(elementB)) {
                    inBetweenNodes.push(aParent);
                }
            }

            return inBetweenNodes;
        };
    }

    nodeLibrary(Node = Empty) {
        let self = this;

        Node.prototype.states = {};
    }

    nodeListLibrary(NodeList = Empty) {
        let self = this;

        NodeList.prototype['each'] = function (callback = () => { }) {
            for (let i = 0; i < this.length; i++) {
                callback(this[i], i)
            }
        }

        NodeList.prototype['indexOf'] = function (element) {
            for (let i in this) {
                if (this[i] == element) return i;
            }
            return -1;
        };

        NodeList.prototype['includes'] = function (element) {
            return this.indexOf(element) != -1;
        };

        NodeList.prototype['nodesBetween'] = function (elementA, elementB) {
            let inBetweenNodes = [];
            for (let aParent of this) {
                if (aParent == elementA || aParent == elementB || aParent.isAncestor(elementA) || aParent.isAncestor(elementB)) {
                    inBetweenNodes.push(aParent);
                }
            }

            return inBetweenNodes;
        };
    }
}

module.exports = Template;
},{"./JSElements":6}],11:[function(require,module,exports){
const TreeEvent = require('./TreeEvent');

class Tree {
    #children = [];
    #parent = null;
    #root = null;
    #attributes = {};
    #eventsList = [];

    get height() {
        let height = 1, branchHeights = [];
        for (let branch of this.#children) {
            if (branch instanceof Tree) {
                branchHeights.push(branch.height);
            }
        }
        if (branchHeights.length > 0) {
            height += Math.max(...branchHeights);
        }
        return height;
    }

    get length() {
        return this.#children.length;
    }

    get parentTree() {
        return this.#parent;
    }

    get rootTree() {
        return this.#root;
    }

    get values() {
        return Array.from(this.#children);
    }

    set length(size) {
        let newChildren = [];
        for (let i = 0; i < size; i++) {
            newChildren.push(this.#children[i]);
        }
        this.#children = newChildren;
    }

    constructor(items, parent, root) {
        if (Array.isArray(items)) {
            this.push(...items);
        }

        if (parent != undefined && parent.constructor == Tree) {
            this.#parent = parent;
        }

        if (root != undefined && root.constructor == Tree) {
            this.#root = root;
        }
    }

    createItems(items) {
        let root = (this.#parent != null) ? this.#root : this;
        for (let i = 0; i < items.length; i++) {
            if (Array.isArray(items[i])) {
                items[i] = new Tree(items[i], this, root);
            }
        }
        return items;
    }

    copyWithin(target, start = 0, end = 1) {
        return this.#children.copyWithin(target, start, end)
    }

    concat(tree) {
        let newTree = new Tree(this.values, this.#parent, this.#root);
        if (tree.constructor == Tree) {
            newTree.push(...tree.values);
        }
        else if (Array.isArray(tree)) {
            newTree.push(...tree);
        }
        else {
            newTree.push(tree);
        }
        return newTree;
    }

    combine(first, second, position) {//used to get what is between two items at a particular occurrance in an Array and the items combined
        position = position || 0;//initialize position if not set
        let at1 = position,
            at2 = first === second ? position + 1 : position; //check if it is the same and change position
        let start = this.indexAt(first, at1);//get the start
        let end = this.indexAt(second, at2) + 1;//get the end

        if (start == -1 || end == 0) {//null if one is not found
            return null;
        }

        return this.slice(start, end);
    }

    entries() {
        return this.values.entries();
    }

    empty() {
        this.#children.length = 0;
    }

    every(callback = (value, index) => { }) {
        if (typeof callback == 'function') {
            let values = this.values;
            for (let i in values) {
                this.#children[i] = callback(values[i], i);
            }
        }
    }

    find(callback = (value, index) => { }) {
        let value, found = false;
        if (typeof callback == 'function') {
            let values = this.values;

            for (let i in values) {
                if (callback(values[i], i)) {
                    value = this.#children[i];
                    found
                    break;
                }
            }
        }
        return value;
    }

    findLast(callback = (value, index) => { }) {
        let value;
        if (typeof callback == 'function') {
            let values = this.values.reverse();
            for (let i in values) {
                if (callback(values[i], i)) {
                    value = this.#children[i];
                    break;
                }
            }
        }
        return value;
    }

    findIndex(callback = (value, index) => { }) {
        let value;
        if (typeof callback == 'function') {
            let values = this.values;
            for (let i in values) {
                if (callback(values[i], i)) {
                    value = i;
                    break;
                }
            }
        }
        return value;
    }

    findLastIndex(callback = (value, index) => { }) {
        let value;
        if (typeof callback == 'function') {
            let values = this.values.reverse();
            for (let i in values) {
                if (callback(values[i], i)) {
                    value = i;
                    break;
                }
            }
        }
        return value;
    }

    findAll(callback = (value, index) => { }) {
        let newTree = new Tree();
        if (typeof callback == 'function') {
            let values = this.values;
            for (let i in values) {
                if (callback(values[i], i)) {
                    newTree.push(this.#children[i]);
                }
            }
        }
        return newTree;
    }

    findAllIndex(callback = (value, index) => { }) {
        let newArray = [];
        if (typeof callback == 'function') {
            let values = this.values;
            for (let i in values) {
                if (callback(values[i], i)) {
                    newArray.push(i);
                }
            }
        }
        return newArray;
    }

    forEach(callback = (value, index) => { }) {
        if (typeof callback == 'function') {
            let values = this.values;
            for (let i in values) {
                callback(values[i], i);
            }
        }
    }

    fill(item) {
        for (let i in this.#children) {
            if (this.#children[i].constructor == Tree) {
                this.#children[i].fill(item);
            }
            else {
                this.#children[i] = item;
            }
        }
    }

    filter(callback = (value, index) => { }) {
        let newTree = new Tree();
        if (typeof callback == 'function') {
            let values = this.values;
            for (let i in values) {
                if (callback(values[i], i)) {
                    newTree.push(this.#children[i])
                }
            }
        }
        return newTree;
    }

    flatMap(callback = (value, index) => { }) {
        let newTree = new Tree();
        if (typeof callback == 'function') {
            let values = this.flat();
            for (let i in values) {
                newTree.push(callback(values[i], i));
            }
        }
        return newTree;
    }

    flat() {
        let flattened = [];
        let values = this.values;
        for (let v of values) {
            if (v.constructor == Tree) {
                flattened.push(v.flat());
            }
            else {
                flattened.push(v);
            }
        }
        return flattened.flat();
    }

    flatTree() {
        return new Tree(this.flat());
    }

    getAttribute(name) {
        return this.#attributes[name];
    }

    getAttributes(attributes) {
        let found = [];
        for (let name of attributes) {
            found.push(this.#attributes[name]);
        }

        return found;
    }

    hasAttribute(name) {
        return this.#attributes != undefined;
    }

    includes(value) {
        return this.#children.includes(value);
    }

    indexOf(value) {
        return this.#children.indexOf(value);
    }

    isBranch() {
        return this.#parent != null;
    }

    inBetween(first, second, position) {//used to get what is between two items at a particular occurrance in an Array
        position = position || 0;//initialize position if not set
        let at1 = position,
            at2 = first === second ? position + 1 : position; //check if it is the same and change position

        let start = this.indexAt(first, at1) + 1;//get the start
        let end = this.indexAt(second, at2);//get the end

        if (start == 0 || end == -1) {//null if one is not found
            return null;
        }

        return this.slice(start, end);
    }

    indexAt(item, position = 0) {//used to get the index of an item at a particular occurrance
        position = position || 0;
        let count = -1;
        let values = this.values;
        for (let i = 0; i < values.length; i++) {
            if (values[i] == item) {
                count++;
                if (count == position) {
                    return i;
                }
            }
        }

        return -1;
    }

    join(at) {
        return this.toArray().join(at);
    }

    lastIndexOf(value) {
        return this.#children.lastIndexOf(value);
    }

    map(callback = (value, index) => { }) {
        let newTree = new Tree();
        if (typeof callback == 'function') {
            let values = this.values;
            for (let i in values) {
                newTree.push(callback(values[i], i));
            }
        }
        return newTree;
    }

    push(...items) {
        this.#children.push(...this.createItems(items));
    }

    pop() {
        return this.#children.pop();
    }
    
    remove(){
        this.dispatchEvent('remove');
        if(this.isBranch()){
            this.#parent.removeChild(this);
            this.dispatchEvent('removed');
        }
    }

    removeChild(child){
        let index = this.indexOf(child);
        let newChildren = [];
        for(let i in this.#children){
            if(i != index){
                newChildren.push(this.#children[i]);
            }
        }
        this.#children = newChildren;
    }

    reverse() {
        this.#children.reverse();
    }

    reduce(callback, reducer = 0) {
        return this.values.reduce(callback, reducer);
    }

    reduceRight(callback) {
        return this.values.reduceRight(callback);
    }

    removeAttribute(name) {
        delete this.#attributes[name];
    }

    removeAttributes(attributes) {
        for (let name of attributes) {
            delete this.#attributes[name];
        }
    }

    search(callback = (value, index) => { }, depth = 0) {
        let value;
        let path = [];//init path
        if (typeof callback == 'function') {
            let values = this.values;
            for (let i in values) {
                if (callback(values[i], i)) {//set path
                    value = values[i];
                    path.push(i);
                    break;
                }
            }
            if (typeof depth != 'number') depth = 0;
            if (path.length == 0 && depth > 0) {
                depth--;
                for (let i in values) {
                    if (values[i].constructor == Tree) {
                        let sub = values[i].search(callback, depth, path);
                        if (sub.path.length != 0) {
                            sub.path.unshift(i);
                            path = sub.path;
                            value = sub.value;
                            break;
                        }
                    }
                }
            }
        }
        return { path, value };
    }

    setAttribute(name, value) {
        if (typeof name == 'string') {
            this.#attributes[name] = value;
        }
    }

    setAttributes(attributes) {
        for (let name in attributes) {
            this.setAttribute(name, attributes[name]);
        }
    }

    shift() {
        return this.#children.shift();
    }

    slice(start, end) {
        let values = this.values;
        if (end == undefined) end = values.length;

        return values.slice(start, end);
    }

    sliceAsTree(start, end) {
        return new Tree(this.slice(start, end));
    }

    some(callback = (value, index) => { }) {
        if (typeof callback == 'function') {
            let values = this.flat();
            for (let i in values) {
                if (callback(values[i], i)) return true;
            }
        }
        return false;
    }

    sort(callback, depth = 0) {
        if (typeof callback !== 'function') {
            callback = (a, b) => a > b;
        }

        for (let i = 0; i < this.#children.length; i++) {
            for (let j = i + 1; j < this.#children.length; j++) {
                let temp;
                if (callback(this.#children[i], this.#children[j]) == true) {
                    temp = this.#children[i];
                    this.#children[i] = this.#children[j];
                    this.#children[j] = temp;
                }
            }
        }

        if (typeof depth != 'number') depth = 0;
        if (depth > 0) {
            depth--;
            for (let i in this.#children) {
                if (this.#children[i].constructor == Tree) {
                    this.#children[i].sort(callback, depth);
                }
            }
        }
    }

    splice(start, deleteCount, ...items) {
        if (deleteCount == undefined) deleteCount = this.#children.length - start;
        let newTree = new Tree(this.#children.splice(start, deleteCount, ...items));
        return newTree;
    }

    toArray() {
        let array = [];
        for (let item of this.#children) {
            if (item.constructor == Tree) {
                array.push(item.toArray());
            }
            else {
                array.push(item);
            }
        }

        return array;
    }

    toString() {
        return this.flat().toString();
    }

    toLocaleString() {
        return this.flat().toLocaleString();
    }

    trace(path = []) {
        path = Array.from(path);
        let i = path.shift();
        let found = false;
        let value;
        let child = this.values[i];

        if (child == undefined) {
            value = this;
            found = true;
        }
        else if (path.length == 0 && child != undefined) {
            value = child;
            found = true;
        }
        else if (child != undefined && child.constructor == Tree) {
            return child.trace(path);
        }


        return { found, value };
    }

    unshift(...items) {
        this.#children.unshift(...this.createItems(items));
    }

    dispatchEvent(name, attributes, bubble) {
        let treeEvent = new TreeEvent(name, attributes, bubble);
        if (treeEvent.bubble == true && this.isBranch()) {
            this.#parent.dispatchEvent(name, attributes, bubble);
        }

        for (let event of this.#eventsList) {
            if (event.name == name) {
                if (typeof event.callback === 'function') {
                    event.callback(treeEvent.attributes);
                }
            }
        }
    }

    addEventListener(name, callback, id) {
        this.#eventsList.push({ name, callback, id });
    }

    removeEventListener(name, callback, id) {
        let newList = [];
        for (let event of this.#eventsList) {
            if (event.name == name && event.id == id) {
                if (typeof callback === 'function') {
                    callback();
                }
            }
            else {
                newList.push(event);
            }
        }

        this.#eventsList = newList;
    }

    static isTree(tree) {
        return tree.constructor == Tree;
    }

    static from(items) {
        let newTree = new Tree(items);
        return newTree;
    }
}

module.exports = Tree;
},{"./TreeEvent":12}],12:[function(require,module,exports){
class TreeEvent {
    name = '';
    attributes = {};

    constructor(name, attributes, bubble) {
        this.name = name;
        this.setAttributes = attributes;
        this.setBubble = bubble;
        
    }

    set setBubble(bubble){
        if(typeof bubble === 'boolean'){
            this.attributes.bubble = bubble;
        }
    }

    set setAttributes(attributes) {
        if (TreeEvent.events[this.name] == undefined) {
            TreeEvent.events[this.name] = attributes;
        }
        else {
            for (let i in TreeEvent.events[this.name]) {
                this.attributes[i] = TreeEvent.events[this.name][i];
            }
        }

        if (typeof attributes == 'object') {
            for (let i in attributes) {
                this.attributes[i] = attributes[i];
            }
        }
    }

    static events = {
        click: { name: 'Click', duration: '1sec', bubble: true },
        hover: { name: 'Hover', duration: 'Infinity', bubble: true },
        remove: { name: 'Remove', bubble: false },
        created: {name: 'Created', bubble: false, duration: '0sec'}
    };
}

module.exports = TreeEvent;
},{}],13:[function(require,module,exports){
const MathsLibrary = require('./MathsLibrary');
const ObjectsLibrary = require('./ObjectsLibrary');

let mathLibrary = new MathsLibrary();
let objectLibrary = new ObjectsLibrary();

function AnalysisLibrary() {
    this.entropy = (data) => {
        let entropy = 0;//initialize entropy
        let values = Object.values(data);//get the values of the object variable
        let sum = mathLibrary.sum(values);//get the sum of the Values
        for (let value of values) {
            entropy -= value / sum * Math.log2(value / sum); //use the formular on each item
        }
        return entropy;
    }

    this.informationGain = (targetNode, variableData) => {
        let arrangeData = (list) => {//arrange the list into an object of counts
            let data = {};
            for (let item of list) {
                data[item] = data[item] || 0;
                data[item]++;
            }

            return data;
        };

        let targetData = arrangeData(targetNode);

        let targetEntropy = this.entropy(targetData);//get the entropy of the target node
        let sumOfInformation = 0;//initialize sum of information gain

        let variableValues = Object.values(variableData);//get the values of this variable
        let variableLength = 0;

        for (let i = 0; i < variableValues.length; i++) {//get the length of the variable by the adding the values
            variableLength += variableValues[i].length;
            variableValues[i] = arrangeData(variableValues[i]);
        }

        for (let v of variableValues) {//get the entropy of each and multiply by the probability
            sumOfInformation += (mathLibrary.sum(Object.values(v)) / variableLength) * this.entropy(v);
        }

        let informationGain = targetEntropy - sumOfInformation;
        return informationGain;
    }

    this.highestInformationGainNode = (data, nodes) => {
        let gainedInformation = {};

        for (let i in nodes) {
            gainedInformation[i] = this.informationGain(data, nodes[i]);
        }

        return objectLibrary.max(gainedInformation);
    }

    this.quartileRange = (data) => {

        let middle = (_dt) => {//get the middle position of a list of numbers
            let middle;
            if ((_dt.length) % 2 == 0) {//if the list count is not even
                middle = [Math.ceil(_dt.length / 2) - 1, Math.ceil(_dt.length / 2)];//get the two in the middle
            }
            else {
                middle = [Math.ceil(_dt.length / 2) - 1];
            }

            return middle;
        }

        let getMiddle = (_dt) => {// get the items in the middle of a list
            let [middle1, middle2] = middle(_dt);
            let middles = [];
            middles.push(_dt[middle1]);
            if (middle2 != undefined) middles.push(_dt[middle2]);

            return middles;
        }

        let halfs = (_dt) => {//divide a list into two equal halfs
            let [middle1, middle2] = middle(_dt);
            if (middle2 == undefined) middle2 = middle1;
            let half1 = _dt.slice(0, middle1);
            let half2 = _dt.slice(middle2 + 1);
            return [half1, half2];
        }

        let layers = halfs(data);//get the halfs of the list
        let [layer1, layer2] = halfs(layers[0]);//divide each half into halfs
        let [layer3, layer4] = halfs(layers[1]);

        let middle1 = getMiddle(layers[0]);//get the middle of the first layers
        let middle3 = getMiddle(layers[1]);

        let q1 = mathLibrary.median(middle1);//get the median of the first and last layers
        let q3 = mathLibrary.median(middle3);

        return q3 - q1;//find the range
    }

    this.normalizeData = (data) => {
        data.sort((a, b) => { return a - b });
        var max = data[data.length - 1];
        var min = data[0];
        var normalized = [];
        for (var i = 0; i < data.length; i++) {
            normalized.push((data[i] - min) / (max - min));
        }
        return normalized;
    }
}

module.exports = AnalysisLibrary;
},{"./MathsLibrary":19,"./ObjectsLibrary":20}],14:[function(require,module,exports){
const Func = require('./../classes/Func');
let func = new Func();

function AppLibrary() {
    this.makeWebapp = (callback = () => { }) => {
        document.addEventListener('click', event => {
            let anchor = event.target;
            let parentAnchor = event.target.getParents('a');
            let url = anchor.getAttribute('href');//check when a url is about to be open

            if (anchor.nodeName.toLowerCase() != 'a' && !func.isnull(parentAnchor)) {
                anchor = parentAnchor;
            }

            if (func.isnull(url) && !func.isnull(parentAnchor)) {
                anchor = parentAnchor;
            }
            //get the anchor element
            url = anchor.getAttribute('href');
            let target = anchor.getAttribute('target');

            if (target == '_blank') {//check if it is for new page
                window.open(this.prepareUrl(url));
            }
            else if (!func.isnull(url)) {
                event.preventDefault();//block and open inside as webapp
                if (this.prepareUrl(url) != location.href) window.history.pushState('page', 'title', url);
                callback();
            }
        });

        window.onpopstate = callback;
    }

    this.prepareUrl = (url = '') => {
        if (!url.includes(location.origin)) {
            let splitUrl = func.urlSplitter(url);
            if (splitUrl.location == location.origin) {
                url = location.origin + '/' + url;
            }
        }
        else if (!url.includes(location.protocol)) {
            url = location.protocol + '//' + url;
        }

        return url;
    }

    this.ajax = (params = { async: true, data: {}, url: '', method: '', secured: false }) => {
        params.async = params.async || true;
        params.data = params.data || {};
        params.url = params.url || './';
        params.method = params.method || 'POST';
        params.secured = params.secured || false;

        if (params.secured) {
            params.url = 'https://cors-anywhere.herokuapp.com/' + params.url;
        }

        let data = new FormData();
        if (params.data instanceof FormData) {
            data = params.data;
        }
        else {
            for (let i in params.data) {
                data.append(i, params.data[i]);
            }
        }

        return new Promise((resolve, reject) => {
            var request = new XMLHttpRequest();

            request.onreadystatechange = function (event) {
                if (this.readyState == 4 && this.status == 200) {
                    resolve(request.responseText);
                }
            };

            if (func.isset(params.onprogress)) {
                request.upload.onprogress = (event) => {
                    params.onprogress((event.loaded / event.total) * 50);
                }

                request.onprogress = (event) => {
                    params.onprogress((event.loaded / event.total) * 100);
                }
            }

            request.onerror = (error) => {
                reject(error);
            };

            request.open(params.method, params.url, params.async);
            request.send(data);
        });
    }
}

module.exports = AppLibrary;
},{"./../classes/Func":5}],15:[function(require,module,exports){
function ArrayLibrary() {

    this.combine = (haystack, first, second, pos) => {//used to get what is between two items at a particular occurrance in an Array and the items combined
        pos = pos || 0;//initialize position if not set
        let at1 = pos,
            at2 = first === second ? pos + 1 : pos; //check if it is the same and change position
        let start = this.indexAt(haystack, first, at1);//get the start
        let end = this.indexAt(haystack, second, at2) + 1;//get the end

        if (start == -1 || end == 0) {//null if one is not found
            return null;
        }

        return haystack.slice(start, end);
    }

    this.inBetween = (haystack, first, second, pos) => {//used to get what is between two items at a particular occurrance in an Array
        pos = pos || 0;//initialize position if not set
        let at1 = pos,
            at2 = first === second ? pos + 1 : pos; //check if it is the same and change position
        let start = this.indexAt(haystack, first, at1) + 1;//get the start
        let end = this.indexAt(haystack, second, at2);//get the end

        if (start == 0 || end == -1) {//null if one is not found
            return null;
        }

        return haystack.slice(start, end);
    }

    this.contains = (haystack, needle) => {//used to check if an Array has an item
        let flag = false;//set flag to false
        for (let i in haystack) {
            if (haystack[i] == needle) {//if found breakout
                return true;
            }
        }
        return flag;
    }

    this.indexAt = (haystack, needle, pos) => {//used to get the index of an item at a particular occurrance
        pos = pos || 0;
        let count = -1;
        for (let i = 0; i < haystack.length; i++) {
            if (haystack[i] == needle) {
                count++;

                if (count == pos) {
                    return i;
                }
            }
        }

        return -1;
    }

    this.find = (haystack, callback) => {//used as a higher order function to get an items that match the conditions
        for (let i in haystack) {
            if (callback(haystack[i]) == true) {
                return haystack[i];
            }
        }
    }

    this.findAll = (haystack, callback) => {//used as a higher order function to get all the items that match the conditions
        let values = [];
        for (let i in haystack) {
            if (callback(haystack[i]) == true) {
                values.push(haystack[i]);
            }
        }

        return values;
    }

    this.getObject = (haystack, key, value) => {//used to get an Object with an Item in a JsonArray
        let object;
        for (let i in haystack) {
            if (haystack[i][key] == value) object = haystack[i];
        }
        return object;
    }

    this.getAllObjects = (haystack, key, value) => {//used to get all occurrances of an Object with an Item in a JsonArray
        let newArray = [];
        for (let i in haystack) {
            if (haystack[i][key] == value) {
                newArray.push(haystack[i]);
            }
        }
        return newArray;
    }

    this.getAll = (haystack, needle) => {//used to all occurrances of an item in an Array
        let newArray = [];
        for (let i in haystack) {
            if (haystack[i] == needle) newArray.push(i);
        }
        return newArray;
    }

    this.removeAll = (haystack, needle) => {//used to remove instances of an item
        let newArray = [];
        for (let i of haystack) {
            if (i != needle) {
                newArray.push(i);
            }
        }
        return newArray;
    }

    this.putAt = (haystack = [], value, key = 0) => {//used to push an item into an index in Array
        let newArray = [];//storage
        for (let i in haystack) {
            if (i == key) {//matched
                newArray[i] = value;//push in the value
                let next = Math.floor(key);//check if it's a number

                if (isNaN(next)) {
                    next = key + 1;
                }
                else {
                    next++;
                }
                newArray[next] = haystack[i];//add the previous value
            }
            else {
                newArray[i] = haystack[i];
            }
        }

        return newArray;
    }

    this.pushArray = (haystack = [], needle, insert) => {//used to push in an item before another existing item in an Array
        let position = this.arrayIndex(haystack, needle);//get the existing item position
        let newArray = this.putAt(haystack, insert, position);//push in new item
        return newArray;
    }

    this.arrayIndex = (haystack = [], needle = []) => {//used to get position of an item in an Array
        for (let i in haystack) {
            if (JSON.stringify(haystack[i]) == JSON.stringify(needle)) {
                return i;
            }
        }
        return -1;
    }

    this.hasArray = (haystack = [], needle = []) => {//used to check if an Array is a sub-Array to another Array
        haystack = JSON.stringify(haystack);
        needle = JSON.stringify(needle);

        return haystack.indexOf(needle) != -1;
    }

    this.toObject = (array = [], key) => {//used to turn an JsonArray to an Object literal
        let object = {};//storage
        for (let i in array) {
            object[array[i][key]] = array[i];//store the intended [key, value]
            delete object[array[i][key]][key];//remove the key in the value
        }
        return object;
    }

    this.reshape = (params) => {//used to change the shape of an Array
        // Pending
    }

    this.randomPick = (array) => {//used to pick a random item from an Array
        return array[Math.floor(Math.random() * array.length)];
    };

    this.removeEmpty = (array = []) => {//used to truncate an Array
        let newArray = [];//storage
        for (let i in array) {
            if (Array.isArray(array[i]) && array[i].length > 0) {//if array go deep
                newArray.push(this.removeEmpty(array[i]));
            }
            else if (array[i] != undefined && array[i] != null && array[i] != 0 && array[i] != '') {//skip [undefined, null, 0, '']
                newArray.push(array[i]);
            }
        }
        return newArray;
    }

    this.each = (array = [], callback = () => { }) => {//used as a higher order Array function
        let newArray = [];//storage
        for (let i in array) {
            newArray.push(callback(array[i], i));//make changes to the item and store it.
        }
        return newArray;
    }

    this.hasArrayElement = (haystack = [], needle = []) => {//used to check if two arrays has an item in common
        let flag = false;
        for (let i in needle) {
            if (haystack.indexOf(needle[i]) != -1) {
                return true;
            }
        }
        return flag;
    }

    this.toSet = (haystack = []) => {//used to turn an Array into a set(Make sure there a no duplicates)
        let single = [];//storage
        for (let i in haystack) {//skip if already stored
            if (single.indexOf(haystack[i]) == -1) {
                single.push(haystack[i]);
            }
        }
        return single;
    }

    this.popIndex = (array = [], index) => {//used to remove an item at a position in an Array
        let newArray = [];//storage Array
        for (let i in array) {
            if (i != index) {//skip the position
                newArray.push(array[i]);
            }
        }
        return newArray;
    }

    this.dataType = (array = []) => {//used to get the datatypes inside an Array
        let type = typeof array[0];//get the indext type
        for (let i in array) {
            if (typeof array[i] != type) {//if two types do not match return mixed
                return 'mixed';
            }
        }
        return type;
    }

}

module.exports = ArrayLibrary;
},{}],16:[function(require,module,exports){
const Template = require('../classes/Template');

function ColorPicker(window = {}) {
    const base = new Template(window);

    this.colorIndicatorPosition = { x: 0, y: 0 };
    this.opacityIndicatorPosition = { x: 0, y: 0 };
    this.convertTo = 'RGB';

    this.init = (params = {}) => {
        this.picker = base.createElement({
            element: 'div', attributes: { class: 'color-picker' }, children: [
                {
                    element: 'span', attributes: { id: 'color-picker-setters' }, children: [
                        {
                            element: 'span', attributes: { id: 'color-picker-colors-window' }, children: [
                                { element: 'canvas', attributes: { id: 'color-picker-colors' } },
                                { element: 'span', attributes: { id: 'color-picker-color-indicator' } }
                            ]
                        },
                        {
                            element: 'span', attributes: { id: 'color-picker-opacities-window' }, children: [
                                { element: 'canvas', attributes: { id: 'color-picker-opacities' } },
                                { element: 'span', attributes: { id: 'color-picker-opacity-indicator' } }
                            ]
                        }
                    ]
                },
                {
                    element: 'div', attributes: { id: 'color-picker-result' }, children: [
                        { element: 'span', attributes: { id: 'picked-color' } },
                        {
                            element: 'span', attributes: { id: 'picked-color-window' }, children: [
                                { element: 'select', attributes: { id: 'picked-color-setter' }, options: ['RGB', 'HEX', 'HSL'] },
                                { element: 'span', attributes: { id: 'picked-color-value' } }
                            ]
                        }
                    ]
                },
                {
                    element: 'style',
                    attributes: { type: 'text/css', rel: 'stylesheet' },
                    text: `.color-picker {
                        padding: .5em;
                        display: grid;
                        z-index: 20;
                    }
                    
                    #color-picker-setters {
                        display: grid;
                        grid-template-columns: 1fr min-content;
                        gap: 1em;
                        height: inherit;
                        width: inherit;
                    }
                    
                    #color-picker-colors-window {
                        display: block;
                        border: 1px solid gray;
                        position: relative;
                        overflow: hidden;
                    }
                    
                    #color-picker-opacities-window {
                        width: 20px;
                        display: block;
                        border: 1px solid gray;
                        position: relative;
                        overflow: hidden;
                    }
                    
                    #color-picker-color-indicator {
                        position: absolute;
                        padding: .5em;
                        border: 1px solid black;
                        border-radius: 100%;
                        top: 0;
                        left: 0;
                    }
                    
                    #color-picker-opacity-indicator {
                        position: absolute;
                        padding: .2em;
                        background-color: black;
                        top: 0;
                        left: 0;
                    }
                    
                    #color-picker-result {
                        display: flex;
                        flex-direction: row;
                        justify-content: space-around;
                        align-items: center;
                        margin: .1em 0em;
                    }
                    
                    #picked-color {
                        width: 50px;
                        height: 30px;
                        border: 1px solid black;
                    }
                    
                    #picked-color-window {
                        display: grid;
                        gap: .3em;
                        grid-template-columns: max-content;
                        grid-template-rows: repeat(2, 1fr);
                        justify-items: left;
                    }
                    
                    #picked-color-value {
                        display: inline-flex;
                        flex-direction: row;
                        justify-content: space-around;
                        align-items: center;
                        color: black;
                    }`
                }
            ]
        });

        this.colorWindow = this.picker.find('#color-picker-colors-window');
        this.opacityWindow = this.picker.find('#color-picker-opacities-window');
        this.colorCanvas = this.picker.find('#color-picker-colors');
        this.opacityCanvas = this.picker.find('#color-picker-opacities');
        this.colorMarker = this.picker.find('#color-picker-color-indicator');
        this.opacityMarker = this.picker.find('#color-picker-opacity-indicator');
        this.width = params.width ? params.width : 300;
        this.height = params.height ? params.height : 300;
        this.pickedColor = params.color ? params.color : 'rgb(0, 0, 0)';
        this.colorWindow.css({ height: this.height + 'px' });
        this.colorCanvas.width = this.width;
        this.colorCanvas.height = this.height;
        this.opacityWindow.css({ height: this.height + 'px' });
        this.opacityCanvas.height = this.height;
        this.opacityCanvas.width = 20;

        //the context
        this.colorContext = this.colorCanvas.getContext('2d');
        this.opacityContext = this.opacityCanvas.getContext('2d');

        this.picker.find('#picked-color-value').innerText = this.pickedColor;
        this.picker.find('#picked-color-setter').onChanged(value => {
            this.convertTo = value;
            this.reply();
        });

        this.listen();

        return this.picker;
    }

    this.calibrateColor = () => {
        let colorGradient = this.colorContext.createLinearGradient(0, 0, this.width, 0);

        //color stops
        colorGradient.addColorStop(0, "rgb(255, 0, 0)");
        colorGradient.addColorStop(0.15, "rgb(255, 0, 255)");
        colorGradient.addColorStop(0.33, "rgb(0, 0, 255)");
        colorGradient.addColorStop(0.49, "rgb(0, 255, 255)");
        colorGradient.addColorStop(0.67, "rgb(0, 255, 0)");
        colorGradient.addColorStop(0.87, "rgb(255, 255, 0)");
        colorGradient.addColorStop(1, "rgb(255, 0, 0)");

        this.colorContext.fillStyle = colorGradient;
        this.colorContext.fillRect(0, 0, this.width, this.height);

        //add black and white stops
        colorGradient = this.colorContext.createLinearGradient(0, 0, 0, this.height);
        colorGradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        colorGradient.addColorStop(0.5, "rgba(255, 255, 255, 0)");
        colorGradient.addColorStop(0.5, "rgba(0, 0, 0, 0)");
        colorGradient.addColorStop(1, "rgba(0, 0, 0, 1)");

        this.colorContext.fillStyle = colorGradient;
        this.colorContext.fillRect(0, 0, this.width, this.height);
    }

    this.calibrateOpacity = () => {
        let rgba;

        this.opacityContext.clearRect(0, 0, this.opacityCanvas.width, this.height);
        let opacityGradient = this.opacityContext.createLinearGradient(0, 0, 0, this.opacityCanvas.height);

        for (let i = 100; i >= 0; i--) {
            rgba = this.addOpacity(this.pickedColor, i / 100);
            opacityGradient.addColorStop(i / 100, rgba);
        }

        this.opacityContext.fillStyle = opacityGradient;
        this.opacityContext.clearRect(0, 0, this.opacityCanvas.width, this.opacityCanvas.height);
        this.opacityContext.fillRect(0, 0, this.opacityCanvas.width, this.opacityCanvas.height);
    }

    this.listen = () => {
        let isColorMouseDown = false;
        let isOpacityMouseDown = false;

        this.picker.notBubbledEvent('click', event => {
            if (this.added && !isColorMouseDown && !isOpacityMouseDown) {
                this.dispose();
            }
        });

        const colorMouseDown = (event) => {
            let currentX = event.clientX - this.colorCanvas.getBoundingClientRect().left;
            let currentY = event.clientY - this.colorCanvas.getBoundingClientRect().top;

            //is mouse in color picker
            isColorMouseDown = (currentX > 0 && currentX < this.colorCanvas.getBoundingClientRect().width && currentY > 0 && currentY < this.colorCanvas.getBoundingClientRect().height);
        };

        const colorMouseMove = (event) => {
            if (isColorMouseDown) {
                this.colorIndicatorPosition.x = event.clientX - this.colorCanvas.getBoundingClientRect().left;
                this.colorIndicatorPosition.y = event.clientY - this.colorCanvas.getBoundingClientRect().top;
                this.colorMarker.css({ top: this.colorIndicatorPosition.y + 'px', left: this.colorIndicatorPosition.x + 'px' });

                let picked = this.getPickedColor();
                this.pickedColor = `rgb(${picked.r}, ${picked.g}, ${picked.b})`;
                this.reply();
            }
        };

        const colorClicked = (event) => {
            this.colorIndicatorPosition.x = event.clientX - this.colorCanvas.getBoundingClientRect().left;
            this.colorIndicatorPosition.y = event.clientY - this.colorCanvas.getBoundingClientRect().top;
            this.colorMarker.css({ top: this.colorIndicatorPosition.y + 'px', left: this.colorIndicatorPosition.x + 'px' });

            let picked = this.getPickedColor();
            this.pickedColor = `rgb(${picked.r}, ${picked.g}, ${picked.b})`;
            this.reply();
        }

        const colorMouseUp = (event) => {
            isColorMouseDown = false;
            this.calibrateOpacity();
        };

        //Register
        this.colorCanvas.addEventListener("mousedown", colorMouseDown);
        this.colorCanvas.addEventListener("mousemove", colorMouseMove);
        this.colorCanvas.addEventListener("click", colorClicked);
        this.colorCanvas.addEventListener("mouseup", colorMouseUp);

        const opacityMouseDown = (event) => {
            let currentX = event.clientX - this.opacityCanvas.getBoundingClientRect().left;
            let currentY = event.clientY - this.opacityCanvas.getBoundingClientRect().top;

            //is mouse in color picker
            isOpacityMouseDown = (currentX > 0 && currentX < this.opacityCanvas.getBoundingClientRect().width && currentY > 0 && currentY < this.opacityCanvas.getBoundingClientRect().height);
        };

        const opacityMouseMove = (event) => {
            if (isOpacityMouseDown) {
                this.opacityIndicatorPosition.x = event.clientX - this.opacityCanvas.getBoundingClientRect().left;
                this.opacityIndicatorPosition.y = event.clientY - this.opacityCanvas.getBoundingClientRect().top;
                this.opacityMarker.css({ top: this.opacityIndicatorPosition.y + 'px' });

                let picked = this.getPickedOpacity();
                this.pickedColor = `rgb(${picked.r}, ${picked.g}, ${picked.b}, ${picked.a})`;
                this.reply();
            }
        };

        const opacityClicked = (event) => {
            this.opacityIndicatorPosition.x = event.clientX - this.opacityCanvas.getBoundingClientRect().left;
            this.opacityIndicatorPosition.y = event.clientY - this.opacityCanvas.getBoundingClientRect().top;
            this.opacityMarker.css({ top: this.opacityIndicatorPosition.y + 'px' });

            let picked = this.getPickedOpacity();
            this.pickedColor = `rgb(${picked.r}, ${picked.g}, ${picked.b}, ${picked.a})`;
            this.reply();
        };

        const opacityMouseUp = (event) => {
            isOpacityMouseDown = false;
        };

        this.opacityCanvas.addEventListener("mousedown", opacityMouseDown);
        this.opacityCanvas.addEventListener("mousemove", opacityMouseMove);
        this.opacityCanvas.addEventListener("click", opacityClicked);
        this.opacityCanvas.addEventListener("mouseup", opacityMouseUp);
    }

    this.reply = () => {
        this.converColor();
        this.picker.dispatchEvent(new CustomEvent('colorChanged'));
        this.picker.find('#picked-color').css({ backgroundColor: this.convertedColor });
        this.picker.find('#picked-color-value').innerText = this.convertedColor;
    }

    this.converColor = () => {
        if (this.convertTo == 'HEX') {
            this.convertedColor = this.rgbToHex(this.pickedColor);
        }
        else if (this.convertTo == 'HSL') {
            this.convertedColor = this.rgbToHSL(this.pickedColor);
        }
        else if (this.convertTo == 'RGB') {
            this.convertedColor = this.pickedColor;
        }
    }

    this.onChanged = (callBack) => {
        this.picker.addEventListener('colorChanged', event => {
            callBack(this.convertedColor);
        });
    }

    this.getPickedColor = () => {
        let imageData = this.colorContext.getImageData(this.colorIndicatorPosition.x, this.colorIndicatorPosition.y, 1, 1);
        return { r: imageData.data[0], g: imageData.data[1], b: imageData.data[2] };
    }

    this.getPickedOpacity = () => {
        let imageData = this.opacityContext.getImageData(this.opacityIndicatorPosition.x, this.opacityIndicatorPosition.y, 1, 1);

        let alpha = Math.ceil(((imageData.data[3] / 255) * 100)) / 100;
        return { r: imageData.data[0], g: imageData.data[1], b: imageData.data[2], a: alpha };
    }

    this.draw = (params) => {
        this.init(params);
        this.calibrateColor();
        this.calibrateOpacity();

        let interval = setTimeout(() => {
            this.added = true;
            clearTimeout(interval);
        }, 2000);

        return this.picker;
    }

    this.dispose = () => {
        clearInterval(this.interval);
        this.picker.remove();
    }

    this.colorType = (color = '#ffffff') => {
        let type = 'string';
        if (color.indexOf('#') == 0 && (color.length - 1) % 3 == 0) {
            type = 'hex';
        }
        else if (color.indexOf('rgba') == 0) {
            let values = base.inBetween(color, 'rgba(', ')');
            if (values != -1 && values.split(',').length == 4) {
                type = 'rgba';
            }
        }
        else if (color.indexOf('rgb') == 0) {
            let values = base.inBetween(color, 'rgb(', ')');
            if (values != -1 && values.split(',').length == 3) {
                type = 'rgb';
            }
        }
        else if (color.indexOf('hsla') == 0) {
            let values = base.inBetween(color, 'hsla(', ')');
            if (values != -1 && values.split(',').length == 4) {
                type = 'hsla';
            }
        }
        else if (color.indexOf('hsl') == 0) {
            let values = base.inBetween(color, 'hsl(', ')');
            if (values != -1 && values.split(',').length == 3) {
                type = 'hsl';
            }
        }

        return type;
    }

    this.hexToRGB = (hex = '#ffffff', alpha = true) => {
        let r = 0, g = 0, b = 0, a = 255;
        if (hex.length == 4) {
            r = "0x" + hex[1] + hex[1];
            g = "0x" + hex[2] + hex[2];
            b = "0x" + hex[3] + hex[3];
        }
        else if (hex.length == 5) {
            r = "0x" + hex[1] + hex[1];
            g = "0x" + hex[2] + hex[2];
            b = "0x" + hex[3] + hex[3];
            a = "0x" + hex[4] + hex[4];
        }
        else if (hex.length == 7) {
            r = "0x" + hex[1] + hex[2];
            g = "0x" + hex[3] + hex[4];
            b = "0x" + hex[5] + hex[6];
        }
        else if (hex.length == 9) {
            r = "0x" + hex[1] + hex[2];
            g = "0x" + hex[3] + hex[4];
            b = "0x" + hex[5] + hex[6];
            a = "0x" + hex[7] + hex[8];
        }
        a = +(a / 255).toFixed(3);

        if (alpha == false) {
            return `rgb(${+r}, ${+g}, ${+b})`;
        }
        else {
            return `rgb(${+r}, ${+g}, ${+b}, ${a})`;
        }
    }

    this.hexToHSL = (hex = '#ffffff', alpha = true) => {
        let color = this.hexToRGB(hex, alpha);
        color = this.rgbToHSL(color, alpha);
        return color;
    }

    this.rgbToHex = (rgb = 'rgb(0, 0, 0)', alpha = true) => {
        let start = rgb.indexOf('(') + 1;
        let end = rgb.indexOf(')');
        let [r, g, b, a] = rgb.slice(start, end).split(',');

        if (!base.isset(a)) {
            a = 1;
        }

        r = (+r).toString(16);
        g = (+g).toString(16);
        b = (+b).toString(16);
        a = Math.round(a * 255).toString(16);

        if (r.length == 1) {
            r = `0${r}`;
        }

        if (g.length == 1) {
            g = `0${g}`;
        }

        if (b.length == 1) {
            b = `0${b}`;
        }
        if (a.length == 1) {
            a = `0${a}`;
        }

        let hex = '#';
        if (alpha != false) {
            hex += `${r}${g}${b}${a}`;
        }
        else {
            hex += `${r}${g}${b}`;
        }

        return hex;
    }

    this.rgbToHSL = (rgb = 'rgb(0, 0, 0)', alpha = true) => {
        let start = rgb.indexOf('(') + 1;
        let end = rgb.indexOf(')');
        let [r, g, b, a] = rgb.slice(start, end).split(',');

        if (!base.isset(a)) {
            a = 1;
        }

        r /= 225;
        g /= 225;
        b /= 225;

        let cmin = Math.min(r, g, b),
            cmax = Math.max(r, g, b),
            delta = cmax - cmin,
            h = 0,
            s = 0,
            l = 0;

        // Calculate hue
        // No difference
        if (delta == 0) {
            h = 0;
        }
        else if (cmax == r) {
            h = ((g - b) / delta) % 6;
        }
        else if (cmax == g) {
            h = (b - r) / delta + 2;
        }
        else if (cmax == g) {
            h = (r - g) / delta + 4;
        }

        h = Math.round(h * 60);
        // Make negative hues positive behind 360°
        if (h < 0) {
            h += 360;
        }

        l = (cmax + cmin) / 2;

        s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

        l = +(l * 100).toFixed(1);
        s = +(s * 100).toFixed(1);

        let hsl = `hsl`;
        if (alpha == false) {
            hsl += `(${h}, ${s}%, ${l}%)`;
        }
        else {
            hsl += `(${h}, ${s}%, ${l}%, ${a})`;
        }
        return hsl;
    }

    this.hslToRGB = (hsl = 'hsl(0, 0%, 0%)', alpha = true) => {
        let rgb = 'rgb';
        let start = hsl.indexOf('(') + 1;
        let end = hsl.indexOf(')');
        let [h, s, l, a] = hsl.slice(start, end).split(',');

        if (!base.isset(a)) {
            a = 1;
        }

        if (h.indexOf("deg") > -1)
            h = h.substr(0, h.length - 3);
        else if (h.indexOf("rad") > -1)
            h = Math.round(h.substr(0, h.length - 3) * (180 / Math.PI));
        else if (h.indexOf("turn") > -1)
            h = Math.round(h.substr(0, h.length - 4) * 360);
        // Keep hue fraction of 360 if ending up over
        if (h >= 360)
            h %= 360;

        s = s.replace('%', '') / 100;
        l = l.replace('%', '') / 100;

        let c = (1 - Math.abs(2 * l - 1)) * s,
            x = c * (1 - Math.abs((h / 60) % 2 - 1)),
            m = l - c / 2,
            r = 0,
            g = 0,
            b = 0;

        if (0 <= h && h < 60) {
            r = c; g = x; b = 0;
        } else if (60 <= h && h < 120) {
            r = x; g = c; b = 0;
        } else if (120 <= h && h < 180) {
            r = 0; g = c; b = x;
        } else if (180 <= h && h < 240) {
            r = 0; g = x; b = c;
        } else if (240 <= h && h < 300) {
            r = x; g = 0; b = c;
        } else if (300 <= h && h < 360) {
            r = c; g = 0; b = x;
        }
        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);

        if (alpha == false) {
            rgb += `(${r}, ${g}, ${b})`;
        }
        else {
            rgb += `(${r}, ${g}, ${b}, ${a})`;
        }

        return rgb;
    }

    this.hslToHex = (hsl = '', alpha = true) => {
        let color = this.hslToRGB(hsl, alpha);
        return this.rgbToHex(color, alpha);
    }

    this.addOpacity = (color = 'rgb(0, 0, 0)', opacity = 0.5) => {
        let type = this.colorType(color);
        if (type == 'hex') color = this.hexToRGB(color);
        else if (type == 'hsl' || type == 'hsla') color = this.hslToRGB(color);

        let start = color.indexOf('(') + 1;
        let end = color.indexOf(')');
        let points = color.slice(start, end).split(',');
        points[3] = opacity;

        let changedColor = `rgba(${points.join(',')})`;

        if (type == 'hex') changedColor = this.rgbToHex(changedColor);
        else if (type == 'hsl' || type == 'hsla') changedColor = this.rgbToHSL(changedColor);

        return changedColor;
    }

    this.getOpacity = (color = 'rgb(0, 0, 0)') => {
        color = base.inBetween(color, '(', ')');
        let [r, g, b, a] = color.split(',');
        return a.trim();
    }

    this.invertColor = (color = '#ffffff') => {
        let type = this.colorType(color);
        let invert;
        if (type == 'hex') {
            color = color.replace('#', '');
            invert = '#' + this.invertHex(color);
        }
        else if (type == 'rgb') {
            color = this.rgbToHex(color).replace('#', '');
            invert = this.invertHex(color);
            invert = this.hexToRGB(invert);
        }
        else if (type == 'rgba') {
            let opacity = this.getOpacity(color);
            color = this.rgbToHex(color).replace('#', '');
            invert = this.invertHex(color);
            invert = this.hexToRGB(invert);
            invert = this.addOpacity(invert, opacity);
        }
        return invert;
    }

    this.invertHex = (hex = 'ffffff') => {
        return (Number(`0x1${hex}`) ^ 0xFFFFFF).toString(16).substr(1).toUpperCase();
    }

    this.nameToHex = (color = 'white') => {
        let ctx = document.createElement('canvas').getContext('2d');
        ctx.fillStyle = color;
        return ctx.fillStyle;
    }

    this.nameToRGB = (color = 'white') => {
        return this.hexToRGB(this.nameToHex(color));
    }
}

module.exports = ColorPicker;
},{"../classes/Template":10}],17:[function(require,module,exports){
const MathsLibrary = require('./MathsLibrary');
const ObjectsLibrary = require('./ObjectsLibrary');
const ArrayLibrary = require('./ArrayLibrary');
const Tree = require('./../classes/Tree');

let mathLibrary = new MathsLibrary();
let objectLibrary = new ObjectsLibrary();
let arrayLibrary = new ArrayLibrary();

function Compression() {
    this.getFrequency = (data = []) => {//get the occurrance of symbols in a list
        const frequency = {};
        for (let d in data) {
            if (frequency[data[d]] == undefined) {
                frequency[data[d]] = 1;
            }
            else {
                frequency[data[d]]++;
            }
        }

        return frequency;
    }

    this.getProbabilities = (data = []) => {//get the probabilities of all symbols in a list
        let probs = this.getFrequency(data);

        for (let i in probs) {
            probs[i] = probs[i] / data.length;
        }
        return probs;
    }

    this.entropy = (data = []) => {//this shows the shortest possible average length of a lossless compression
        let sum = 0;
        let dataType = arrayLibrary.dataType(data);//get the datatype of the list
        let probabilities;
        if (dataType == 'number') {
            probabilities = data;
        }
        else if (dataType == 'string') {//get the symbols probabilities
            probabilities = Object.values(this.getProbabilities(data));
        }

        //Sum of (-p log base 2 of p)
        for (let prob of probabilities) {
            sum += (-prob * Math.log2(prob));
        }

        return sum;
    }

    this.isUDC = (data = []) => {//check if a list is uniquely decodable code
        let flag = true, noPrefix, keepRunning = true;

        let addSurfix = (str) => {
            //check if suffix is in list already then stop running
            if (data.includes(str)) {
                flag = false;
                keepRunning = false;
                return;
            }

            data.push(str);
        }

        let checkPrefix = (pos) => {//check for prefix
            noPrefix = true;
            for (let i = 0; i < data.length; i++) {
                if (i == pos) {
                    //skip the current position
                    continue;
                }
                else if (data[i] == data[pos]) {
                    //double found in the list
                    flag = false;
                    keepRunning = false;
                }
                else if (data[i].indexOf(data[pos]) == 0) {
                    //add suffix found to the list
                    addSurfix(data[i].replace(data[pos], ''));
                }

                //stop checking for prefix
                if (!keepRunning) break;
            }
        }

        while (keepRunning) {
            for (let i = 0; i < data.length; i++) {
                checkPrefix(i);
                if (keepRunning == false) break;//stop running
            }

            if (noPrefix == true) {
                //if no prefix is found stop it is UDC
                keepRunning = false;
            }
        }

        return flag;
    }

    this.sfAlgorithm = (data = []) => {
        let frequency = this.getFrequency(data);//get the frequecies of the symbols
        let sorted = objectLibrary.sort(frequency, { value: true });//sort the symbols based on frequecy of occurrance
        let codeWord = '';

        let tree = { path: '', size: mathLibrary.sum(Object.values(sorted)), value: JSON.parse(JSON.stringify(sorted)) };//set a copy of the sorted data as a tree
        let table = JSON.parse(JSON.stringify(sorted));//set the sorted as table

        for (let i in table) {
            table[i] = { frequency: table[i] };
        }

        let trySwitching = (node) => {//switch nodes if the left size is bigger than the right side
            if (node[0].size > node[1].size) {
                let temp = node[0];
                node[0] = node[1];
                node[1] = temp;

                temp = node[0].path;
                node[0].path = node[1].path
                node[1].path = temp;
            }
            return node;
        }

        let splitData = (comingNode) => {//split a tree
            let node = [{ path: comingNode.path + '0', size: 0, value: [] }, { path: comingNode.path + '1', size: 0, value: [] }];//into two almost equal length
            for (let i in comingNode.value) {
                if (node[0].size < node[1].size) {//split into 2 almost equal nodes
                    node[0].value[i] = comingNode.value[i];
                    node[0].size += comingNode.value[i];
                }
                else {
                    node[1].value[i] = comingNode.value[i];
                    node[1].size += comingNode.value[i];
                }
            }

            node = trySwitching(node);

            for (let i in node) {
                if (Object.values(node[i].value).length > 1) {//if it has more than 1 symbol it's a node then split it again
                    node[i].value = splitData(node[i]);
                }
                else {//it is a leaf, add it to the table and get the properties
                    let key = Object.keys(node[i].value)[0];
                    table[key].code = node[i].path;
                    table[key].length = node[i].path.length;
                    table[key].probability = node[i].size / data.length;
                    table[key].log = Math.log2(1 / table[key].probability);
                }
            }
            return node;
        }

        tree = splitData(tree);

        for (let d of data) {
            codeWord += table[d].code;
        }

        return { codeWord, table, data, tree };
    }

    this.huffmanCoding = (data = []) => {
        let frequency = this.getProbabilities(data);//get the frequecies of the symbols
        let sorted = objectLibrary.sort(frequency, { value: true });//sort the symbols based on frequecy of occurrance

        let tree = [];
        let table = {};

        for (let i in sorted) {//init the table and the tree
            table[i] = { probability: sorted[i], path: '', length: 0, prod: 0 };
            tree.push({ value: sorted[i], origins: i });
        }

        let dig = (coming = []) => {//run the algorithm loop until one node is remaining with value of '1'
            let length = coming.length;//size of list 
            let node = [];//init node
            if (length > 1) {// list has more than one node?
                let down = length - 1;//index of last two items in list
                let up = length - 2;
                let sum = coming[up].value + coming[down].value;
                let added = false;
                for (let i = 0; i < coming.length; i++) {
                    if (i == up || i == down) {//sum last 2 items and skip adding them
                        if (length == 2) {//if last 2 sum them and exist digging
                            let newLeaf = { value: sum, origins: [coming[up].origins, coming[down].origins] };
                            node.push(newLeaf);
                            break;
                        }
                        continue;
                    }
                    else if (coming[i].value <= sum && !added) {//add sum if it has not been added
                        let newLeaf = { value: sum, origins: [coming[up].origins, coming[down].origins] };
                        node.push(newLeaf);
                        added = true;
                    }

                    node.push(coming[i]);
                }

                if (length > 2) {
                    node = dig(node);
                }
            }

            return node;
        }

        tree = dig(tree);

        //get the path/codeword foreach symbol
        let nameItems = (origins, path) => {
            for (let i in origins) {
                if (Array.isArray(origins[i])) {
                    nameItems(origins[i], path + i)
                }
                else {
                    table[origins[i]].path = path + i;
                    table[origins[i]].length = path.length;
                    table[origins[i]].prod = path.length * table[origins[i]].probability;
                }
            }
        }

        nameItems(tree[0].origins, '');

        //calculate the avevage length of the codes
        let avgLength = mathLibrary.sum(objectLibrary.valueOfObjectArray(table, 'prod'));

        frequency = sorted = undefined;
        return { table, data, avgLength, tree };
    }

    this.encodeHuffman = (data, dictionary = []) => {
        let dictionaryLength = dictionary.length;
        let codeWord = '', nytCode, code;

        //get the e and r parameters
        let { e, r } = (() => {
            let ok = false;
            let e = 0, r;
            while (!ok) {
                e++;
                r = dictionaryLength - 2 ** e;
                ok = r < 2 ** e;
            }
            return { e, r };
        })();

        let fixedCode = (symbol) => {//get the fixed code
            let k = dictionary.indexOf(symbol) + 1;
            let code;
            if (k <= 2 * r) { // 1 <= k <= 2r
                code = (k - 1).toString(2);
                code = Array((e + 1) - code.length).fill(0).join('') + code; // e + 1 representation of k - 1
            }
            else if (k > 2 * r) {//k > 2r
                code = (k - r - 1).toString(2);
                code = Array((e) - code.length).fill(0).join('') + code;// e representation of k - r - 1
            }
            return code;
        }

        let updateCount = (t) => {//set the count of a node and switch if left is greater than right
            let count = t.getAttribute('count');
            count++;
            t.setAttributes({ count });
            let p = t.parentTree;
            if (p != null) {
                trySwitching(p);
                updateCount(p);
            }
        }

        let trySwitching = (node) => {//switch if left is greater than right
            if (node.values[0].getAttribute('count') > node.values[1].getAttribute('count')) {
                node.reverse();
            }
        };

        let tree = new Tree();
        tree.setAttribute('count', 0);
        let NYT = tree;

        let readSymbol = (symbol) => {
            let s = tree.search((v, i) => {//search and get symbol node if added already
                return v.getAttribute('id') == symbol;
            }, tree.height);

            let v = s.value;
            nytCode = tree.search((v, i) => {//get the nyt node
                return v.getAttribute('id') == 'nyt';
            }, tree.height).path.join('');

            if (v == undefined) {//has not been added
                NYT.removeAttribute('id');//remove the current NYT tag
                NYT.push([], []);//add the 2 nodes
                let temp = NYT.values[0];
                v = NYT.values[1];

                temp.setAttributes({ id: 'nyt', count: 0 });//set new nyt
                v.setAttributes({ id: symbol, count: 0 });
                NYT = temp;
                code = nytCode + fixedCode(symbol);//nyt + fixedCode
            }
            else {
                code = s.path.join('');//get path
            }

            codeWord += code;//concat the code

            updateCount(v);//update the count starting from this node to the root
        }

        for (let symbol of data) {
            readSymbol(symbol);
        }

        return { codeWord, tree, data };
    }

    this.decodeHuffman = (codeWord, dictionary = []) => {
        let dictionaryLength = dictionary.length;
        let data = '', nytCode, code, path = [];
        let tree = new Tree();
        tree.setAttributes({ count: 0, id: 'nyt' });
        let NYT = tree;
        let i;
        let { e, r } = (() => {
            let ok = false;
            let e = 0, r;
            while (!ok) {
                e++;
                r = dictionaryLength - 2 ** e;
                ok = r < 2 ** e;
            }
            return { e, r };
        })();

        let trySwitching = (node) => {//switch nodes if left side is greater than right side
            if (node.values[0].getAttribute('count') > node.values[1].getAttribute('count')) {
                node.reverse();
            }
        };

        let updateCount = (t) => {//update the size of the current node and it's next parent
            let count = t.getAttribute('count');
            count++;
            t.setAttributes({ count });
            let p = t.parentTree;
            if (p != null) {
                trySwitching(p);
                updateCount(p);
            }
        }

        let readSymbol = (symbol) => {
            let s = tree.search((v) => {
                return v.getAttribute('id') == symbol;//search and get symbol if exists already
            }, tree.height);

            let v = s.value;
            nytCode = tree.search((v, i) => {
                return v.getAttribute('id') == 'nyt';//get the NYT code
            }, tree.height).path.join('');

            if (v == undefined) {//new symbol? add it to the tree with new NYT
                NYT.removeAttribute('id');
                NYT.push([], []);
                let temp = NYT.values[0];
                v = NYT.values[1];

                temp.setAttributes({ id: 'nyt', count: 0 });
                v.setAttributes({ id: symbol, count: 0 });
                NYT = temp;
            }

            updateCount(v);
        }

        let interprete = (node) => {
            let code;
            if (node == NYT) {//is node NYT
                for (let j = 0; j < e; j++) {//read next 4 codes
                    path.push(codeWord[++i]);
                }
                let p = parseInt(path.join(''), 2);
                if (p < r) {//p is more than r, read 1 more
                    path.push(codeWord[++i]);
                    p = parseInt(path.join(''), 2);
                }
                else {
                    p += r;//add r to p
                }
                code = dictionary[p];//get symbol from dictionary
                readSymbol(code);//add this symbol to tree
            }
            else {
                code = node.getAttribute('id');//get the symbol from the tree
                readSymbol(code);//update the symbol
            }
            return code;
        }

        for (i = -1; i < codeWord.length; i++) {//start with empty NYT
            let code = codeWord[i];
            if (code != undefined) {//when not empty
                path.push(code);
            }
            let node = tree.trace(path).value;
            if (node.getAttribute('id') != undefined) {//is node labelled
                path = [item];
                data += interprete(node);//what is this node
                path = [];
            }
        }

        return { data, tree, codeWord };
    }

    this.golomb = (n, m) => {
        let q = Math.floor(n / m);//step 1
        let unary = Array(q).fill(1).join('') + '0';//unary of q

        let k = Math.ceil(Math.log2(m));
        let c = 2 ** k - m;
        let r = n % m;
        let rC = (() => {//r`
            let value = r.toString();
            if (r < c) {
                value = r.toString();
                value = Array((k - 1) - value.length).fill(0).join('') + value;//k-1 bits rep of r
            }
            else {
                value = (r + c).toString();
                value = Array(k - value.length).fill(0).join('') + value;//k bits rep of r+c
            }
            return value;
        })();

        let code = unary + rC;//concat unary and r'
        return code;
    }

    this.encodeArithmetic = (data, probabilities) => {
        let getX = (n) => {//f(x(n))= sum of x(1) .... x(n)
            let value = 0;
            for (let i in probabilities) {
                if (n == i) break;
                value = (value / 10 + probabilities[i] / 10) * 100 / 10;//handle the JS decimal problem
            }
            return value;
        }

        // l(0) = 0, u(0) = 0, fx(0) = 0
        let bounds = [{ l: 0, u: 1 }];

        let lowerN = (n) => {//lower limit of n l(n) = l(n-1) + (u(n-1) - l(n-1)) * f(x(n-1))
            let bound = bounds[n];
            let l = bound.l + ((bound.u - bound.l) * getX(data[n] - 1));
            return l;
        }

        let upperN = (n) => {//lower limit of n u(n) = l(n-1) + (u(n-1) - l(n-1)) * f(x(n))
            let bound = bounds[n];
            let u = bound.l + ((bound.u - bound.l) * getX(data[n]));
            return u;
        }

        for (let i = 0; i < data.length; i++) {
            bounds.push({ l: lowerN(i), u: upperN(i) });
        }

        let n = bounds.pop();
        return (n.l + n.u) / 2;
    }

    this.decodeArithmetic = (tag = 0, probabilities) => {
        let data = '';
        let getX = (n) => {//f(x(n))= sum of x(1) .... x(n)
            let value = 0;
            for (let i in probabilities) {
                if (n == i) break;
                value = (value / 10 + probabilities[i] / 10) * 100 / 10;//handle the JS decimal problem
            }
            return value;
        }

        // l(0) = 0, u(0) = 0, fx(0) = 0
        let bounds = [{ l: 0, u: 1 }];

        let lowerN = (n) => {//lower limit of n l(n) = l(n-1) + (u(n-1) - l(n-1)) * f(x(n-1))
            let bound = bounds[n];
            let l = bound.l + ((bound.u - bound.l) * getX(data[n] - 1));
            return l;
        }

        let upperN = (n) => {//lower limit of n u(n) = l(n-1) + (u(n-1) - l(n-1)) * f(x(n))
            let bound = bounds[n];
            let u = bound.l + ((bound.u - bound.l) * getX(data[n]));
            return u;
        }

        let count = 0, complete = false;

        while (!complete) {//run until all the codes are found
            let found = false, x = 1, n = {};

            while (!found) {// for each new code
                let l = lowerN(count, x);
                let u = upperN(count, x);

                complete = (l >= tag && tag <= u);
                if (complete) break;//if all is found stop running

                found = (l < tag && tag < u);//check if it sactisfies the conditions
                n = { l, u, x };
                x++;
            }
            if (complete) break;
            count++;

            bounds.push(n);//add code
            data += n.x;
        }
        return data;
    }

    this.encodeDiagram = (data = '', dictionary = {}) => {//daigram coding
        let i;
        let codeWord = '';
        let encode = () => {
            let first = data[i];//take two at a time
            let second = data[i + 1];
            let symbol = first + second;

            let code;
            if (dictionary[symbol] != undefined) {//is symbol in dictionary
                code = dictionary[symbol];
                i++;//set count to know it read two
            }
            else {
                code = dictionary[first];
            }

            return code;
        }

        for (i = 0; i < data.length; i++) {
            codeWord += encode();
        }

        return codeWord;
    }

    this.encodeLZ1 = (data = '', params = { windowSize: 0, searchSize: 0, lookAheadSize: 0 }) => {//LZ7//LZ1//Sliding window
        if (params.windowSize == undefined) params.windowSize = params.searchSize + params.lookAheadSize;//init the window, search and lookahead sizes
        if (params.searchSize == undefined) params.searchSize = params.windowSize - params.lookAheadSize;
        if (params.lookAheadSize == undefined) params.lookAheadSize = params.windowSize - params.searchSize;


        let i = 0, lookAheadStop, searchStop, lookAheadBuffer, searchBuffer;//init the buffers and locations

        let getTriplet = () => {
            let x = lookAheadBuffer[0];
            let picked = { o: 0, l: 0, c: x };//set the triplet <o, l, c(n)>

            if (searchBuffer.includes(x)) {
                let foundMatches = [];//storage for the matches
                for (let i in searchBuffer) {//find all the matches in search buffer
                    if (searchBuffer[i] == picked.c) {

                        let indexInData = +searchStop + +i,//this is the joint of the search and lookAhead buffers
                            indexInLookAhead = 0,
                            count = 0,
                            matching = true,
                            matched = [];
                        while (matching) {//keep getting the matches
                            matched.push(data[indexInData]);
                            count++;
                            matching = lookAheadBuffer[indexInLookAhead + count] === data[indexInData + count];
                        }
                        foundMatches.push({ o: searchBuffer.length - i, l: matched.length, c: lookAheadBuffer[matched.length] });//save matches
                    }
                }

                picked = foundMatches[0];
                for (let y of foundMatches) {//get the match with most size and closest to the lookAhead buffer
                    if (picked.l < y.l) {
                        picked = y;
                    }
                    else if (picked.l == y.l && picked.o > y.o) {
                        picked = y;
                    }
                }
            }

            i += picked.l;
            return picked;
        }

        let list = [];
        for (i = 0; i < data.length; i++) {
            searchStop = i - params.searchSize;
            if (searchStop < 0) searchStop = 0;
            lookAheadStop = i + params.lookAheadSize;
            searchBuffer = data.slice(searchStop, i).split('');
            lookAheadBuffer = data.slice(i, lookAheadStop).split('');
            list.push(getTriplet());
        }

        return list;
    }

    this.decodeLZ1 = (triplets = [{ o: 0, l: 0, c: '' }], params = { windowSize: 0, searchSize: 0, lookAheadSize: 0 }) => {
        let word = '';

        if (params.windowSize == undefined) params.windowSize = params.searchSize + params.lookAheadSize;//init the window, search and lookahead sizes
        if (params.searchSize == undefined) params.searchSize = params.windowSize - params.lookAheadSize;
        if (params.lookAheadSize == undefined) params.lookAheadSize = params.windowSize - params.searchSize;

        for (let t of triplets) {//decode each triplet
            for (let i = 0; i < t.l; i++) {
                word += (word[word.length - t.o]);
            }
            word += (t.c);
        }

        return word;
    }

    this.encodeLZ2 = (data = '') => {//LZ8//LZ2
        let duplets = [];//init duplet list
        let entries = [];//init dictionary
        let i, lastIndex;

        let getRange = (range) => {//get the symbols within the range
            let value = '';
            for (let r of range) {
                value += data[r];
            }
            return value;
        }

        let encode = (range) => {
            let e = getRange(range);//get the value of the range
            let index = entries.indexOf(e);

            let d = { i: lastIndex, c: e[e.length - 1] };//create duplet
            if (index == -1) {//current group of symbols is in not in the dictionary
                entries.push(e);
            }
            else {
                range.push(++i);
                lastIndex = index + 1;
                d = encode(range);
            }

            return d;
        }

        for (i = 0; i < data.length; i++) {
            lastIndex = 0;
            duplets.push(encode([i]));
        }

        return duplets;
    }

    this.decodeLZ2 = (duplets = [{ i: 0, c: '' }]) => {
        let entries = [];//init dictionary
        let c;

        for (let d of duplets) {//decode each duplet
            c = '';
            if (d.i != 0) {
                c = entries[d.i - 1];//get the code from the dictionary
            }
            c += d.c;
            entries.push(c);
        }

        return entries.join('');
    }

    this.encodeLZW = (data = '', initDictionary = []) => {
        let codeWord = [], lastIndex, i;
        let entries = Array.from(initDictionary);

        let getRange = (range) => {// get the values within the range
            let value = '';
            for (let r of range) {
                value += data[r];
            }
            return value;
        }

        let encode = (range) => {
            let e = getRange(range);
            let index = entries.indexOf(e);
            if (index == -1) {//is value not in dictionary?
                entries.push(e);//add it and set the counter to the last read symbol
                index = 0;
                i--;
            }
            else {
                i++;//set the counter to the next symbol and try encoding the range
                range.push(i);
                lastIndex = index += 1;//set the last read index, this is the code
                e = encode(range);
            }
            return lastIndex;
        }

        for (i = 0; i < data.length; i++) {
            lastIndex = 0;
            let code = encode([i]);
            if (code != undefined) {//code was created
                codeWord.push(code);
            }
        }

        return codeWord;
    }

    this.decodeLZW = (singleton = [], initDictionary = []) => {
        let word = '', codeWord = [], state, count = 0, rebuild = false, buildWith = '', i, start = 0;
        let entries = Array.from(initDictionary);

        let getCode = (range) => {//get the code within the range
            let value = '';
            count = 0;
            buildWith = '';
            for (let r of range) {
                if (word[r] == undefined) {//it is not complete
                    count++;
                    rebuild = true;//set to rebuild
                }
                else {
                    buildWith += word[r];//set to rebuild with incase of not complete
                }
                value += word[r];
            }
            return value;
        }

        let decode = (range = []) => {
            let e = getCode(range);
            let index = entries.indexOf(e);
            if (index == -1) {//is not in dictionary?
                entries.push(e);
                i--;//set the counter to the last symbol read
            }
            else {
                ++i;
                range.push(i);
                decode(range);//add next symbol and decode again
            }
            return e;
        }

        let build = (state) => {//build up the dictionary from the decoded values
            for (i = start; i < word.length; i++) {
                let e = decode([i]);
                if (entries.length == state) {//stop at the current decoding point
                    start = i + 1 - count;//set next starting point at the current stop
                    break;
                }
            }
        }

        for (let s of singleton) {
            let e = entries[s - 1];
            if (e == undefined) {
                build(s);//build the dictionary
                e = entries[s - 1];
            }

            codeWord.push(e);
            word = codeWord.join('');

            if (rebuild) {//rebuild the last entry in the dictionary 
                rebuild = false;
                for (let i = 0; i < count; i++) {//keep add items to the buildwith to the buildwith until it is complete
                    buildWith += buildWith[i];
                }
                codeWord.pop();//set last built and last decoded to the new build
                codeWord.push(buildWith);
                entries.pop();
                entries.push(buildWith);
                start += count;//set the next build starting point
            }
        }

        return word;
    }
}

module.exports = Compression;

},{"./../classes/Tree":11,"./ArrayLibrary":15,"./MathsLibrary":19,"./ObjectsLibrary":20}],18:[function(require,module,exports){
const ObjectsLibrary = require('./ObjectsLibrary');
let objectLibrary = new ObjectsLibrary();

function IndexedLibrary(name, version) {
    this.name = name;
    this.version = version;
    this.initialized = false;
    this.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    this.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
    this.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

    this.init = function (callback) {//initialize db by setting the current version
        const request = this.indexedDB.open(this.name);
        request.onupgradeneeded = (event) => {
            if (typeof callback == 'function') {
                (callback(event.target.result));
            }
        }

        request.onsuccess = (event) => {
            this.version = Math.floor(request.result.version) || Math.floor(this.version);
            this.initialized = true;
        }

        request.onerror = (event) => {
            console.log(event.target.error);
        }
    }

    this.getVersion = function () {
        return new Promise((resolve, reject) => {
            const request = this.indexedDB.open(this.name);
            request.onsuccess = (event) => {
                if (this.version == undefined || this.version < request.result.version) {
                    this.version = request.result.version;
                }
                request.result.close();
                resolve(this.version);
            }

            request.onerror = (event) => {
                reject(event.target.error);
            }
        })
    }

    this.open = async function (callback) {
        if (this.version == undefined) {
            await this.getVersion();//set the version if not set
        }
        return new Promise((resolve, reject) => {
            const request = this.indexedDB.open(this.name, this.version);//open db
            request.onupgradeneeded = (event) => {
                this.version = request.result.version;//update version after upgrade

                if (typeof callback == 'function') {//run the callback if set
                    let workedDb = callback(event.target.result);
                    workedDb.onerror = workedEvent => {
                        reject(workedEvent.target.error);
                    }
                }
            }

            request.onsuccess = (event) => {
                resolve(event.target.result);
            }

            request.onerror = (event) => {
                reject(event.target.error);
            }
        });
    }

    this.collectionExists = function (collection) {
        return this.open().then(db => {
            let exists = db.objectStoreNames.contains(collection);//check if db has this collection in objectstore
            return exists;
        });
    }

    this.createCollection = async function (...collections) {
        let version = await this.getVersion();//upgrade collection
        this.version = version + 1;
        return this.open(db => {
            for (let collection of collections) {
                if (!db.objectStoreNames.contains(collection)) {//create new collection and set _id as the keypath
                    db.createObjectStore(collection, { keyPath: '_id' });
                }
            }
            return db;
        });
    }

    this.find = function (params) {
        return new Promise((resolve, reject) => {
            this.open().then(db => {
                let documents = [];

                if (db.objectStoreNames.contains(params.collection)) {//collection exists
                    let transaction = db.transaction(params.collection, 'readonly');

                    transaction.onerror = event => {
                        db.close();
                        reject(event.target.error);
                    }

                    transaction.oncomplete = event => {
                        if (params.many == true) {//many 
                            db.close();
                            resolve(documents);
                        }
                        else {
                            db.close();
                            resolve(documents[0]);//single
                        }
                    }

                    let store = transaction.objectStore(params.collection);
                    let request = store.openCursor();
                    let cursor;

                    request.onerror = (event) => {
                        db.close();
                        reject(event.target.error);
                    }

                    request.onsuccess = (event) => {
                        cursor = event.target.result;
                        if (cursor) {
                            if (params.query == undefined) {//find any
                                documents.push(cursor.value);
                            }
                            else if (objectLibrary.isSubObject(cursor.value, params.query)) {//find specific
                                documents.push(cursor.value);
                            }
                            cursor.continue();
                        }
                    };
                }
                else {
                    if (params.many == true) {//many 
                        db.close();
                        resolve(documents);
                    }
                    else {
                        db.close();
                        resolve(documents[0]);//single
                    }
                }
            }).catch(error => {
                db.close();
                reject(error);
            });
        });
    }

    this.emptyCollection = function (collection) {
        let removedCount = 0, foundCount = 0;//set the counters
        return new Promise((resolve, reject) => {
            this.find({ collection, query: {}, many: true }).then(found => {//find all documents
                this.open().then(db => {
                    if (db.objectStoreNames.contains(collection)) {//handle collection non-existence error
                        let transaction = db.transaction(collection, 'readwrite');
                        let store = transaction.objectStore(collection);

                        transaction.onerror = event => {
                            db.close();
                            reject(event.target.error);
                        }

                        transaction.oncomplete = event => {
                            db.close();
                            resolve({ action: 'emptycollection', removedCount, ok: removedCount == foundCount });
                        }
                        foundCount = found.length;
                        for (let data of found) {
                            let request = store.delete(data._id);//delete each document
                            request.onerror = event => {
                                console.log(`Error while deleting documents => ${event.target.error}`);
                            }

                            request.onsuccess = event => {
                                removedCount++;
                            }
                        }
                    }
                    else {
                        db.close();
                        resolve({ removedCount, ok: removedCount == foundCount });
                    }
                }).catch(error => {
                    db.close();
                    reject(error);
                });
            }).catch(error => {
                db.close();
                reject(error);
            })
        });
    }

    this.documentExists = function (params) {
        delete params.many;//check for only one
        return this.find(params).then(res => {//
            return res != undefined;
        });
    }

    this.generateId = function () {
        let id = Date.now().toString(36) + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);//generate the id using time
        return id;
    }

    this.checkId = function (request, _id, callback) {
        if (typeof _id != 'string') {
            _id = this.generateId();//get new _id if not set
        }
        let get = request.get(_id);//check if existing
        get.onsuccess = event => {
            if (event.target.result != undefined) {
                this.checkId(request, _id, callback);
            }
            else {
                callback(_id);//use the _id
            }
        }

        get.onerror = event => {
            console.log(`Error checking ID => ${event.target.error}`);
        }
    }

    this.add = function (params, db) {
        return new Promise((resolve, reject) => {
            let transaction = db.transaction(params.collection, 'readwrite');
            transaction.onerror = (event) => {
                db.close();
                reject(event.target.error)
            };

            transaction.oncomplete = (event) => {
                db.close();
                resolve({ action: 'insert', documents: params.query });
            }

            let request = transaction.objectStore(params.collection);

            if (params.many == true && Array.isArray(params.query)) {// for many
                for (let query of params.query) {
                    this.checkId(request, query._id, _id => {//validate _id
                        query._id = _id;
                        request.add(query);//add
                    });
                }
            }
            else {
                this.checkId(request, params.query._id, _id => {//validate _id
                    params.query._id = _id;
                    request.add(params.query);//add
                });
            }
        });
    }

    this.insert = async function (params) {
        let isCollection = await this.collectionExists(params.collection);
        if (isCollection) {//collection is existing
            return this.open()
                .then(db => {
                    return this.add(params, db);//add to collection
                })
                .catch(error => {
                    return error;
                });
        }
        else {
            return this.createCollection(params.collection)//create collection
                .then(db => {
                    return this.add(params, db);//add to new Collection
                })
                .catch(error => {
                    return error;
                });
        }
    }

    this.update = function (params) {
        return new Promise((resolve, reject) => {
            this.open().then(db => {
                if (!db.objectStoreNames.contains(params.collection)) {
                    db.close();
                    reject('Collection not found');
                }

                let transaction = db.transaction(params.collection, 'readwrite');

                transaction.onerror = event => {
                    db.close();
                    reject(event.target.error);
                }

                transaction.oncomplete = event => {
                    db.close();
                    resolve({ action: 'update', documents });
                }

                let store = transaction.objectStore(params.collection);
                let request = store.openCursor();
                let documents = {};

                request.onerror = (event) => {
                    db.close();
                    reject(event.target.error);
                }

                request.onsuccess = (event) => {
                    let cursor = event.target.result;
                    let found = false;
                    if (cursor) {
                        if (objectLibrary.isSubObject(cursor.value, params.check)) {//retrieve the matched documents
                            found = true;
                            for (let i in params.query) {
                                cursor.value[i] = params.query[i];
                            }

                            try {
                                let res = cursor.update(cursor.value);//update

                                res.onerror = (rEvent) => {
                                    documents[rEvent.target.result] = { value: cursor.value, status: false };
                                }

                                res.onsuccess = (rEvent) => {
                                    documents[rEvent.target.result] = { value: cursor.value, status: true };
                                }
                            } catch (error) {
                                db.close();
                                reject(error);
                            }
                        }

                        if (params.many == true || found == false) {
                            cursor.continue();
                        }
                    }
                };
            }).catch(error => {
                db.close();
                reject(error);
            });
        });
    }

    this.save = function (params = { collection: '', query: {}, check: {} }) {
        //check existence of document
        return this.documentExists({ collection: params.collection, query: params.check }).then(exists => {
            if (exists == false) {
                return this.insert(params);//insert if not found
            }
            else {
                return this.update(params);// update if found
            }
        });
    }

    this.delete = function (params) {
        let foundCount = 0, removedCount = 0;//set the counters
        return new Promise((resolve, reject) => {
            this.find(params).then(found => {
                this.open().then(db => {
                    let transaction = db.transaction(params.collection, 'readwrite');
                    let store = transaction.objectStore(params.collection);

                    transaction.onerror = event => {
                        db.close();
                        reject(event.target.error);
                    }

                    transaction.oncomplete = event => {
                        db.close();
                        resolve({ action: 'delete', removedCount, ok: removedCount == foundCount });
                    }

                    if (Array.isArray(found)) {//if many
                        foundCount = found.length;
                        for (let data of found) {
                            let request = store.delete(data._id);//delete each
                            request.onerror = event => {
                                console.log(`Error while deleting documents => ${event.target.error}`);
                            }

                            request.onsuccess = event => {
                                removedCount++;
                            }
                        }
                    }
                    else if (found) {
                        foundCount = 1;
                        let request = store.delete(found._id);//delete document
                        request.onerror = event => {
                            console.log(`Error while deleting documents => ${event.target.error}`);
                        }

                        request.onsuccess = event => {
                            removedCount++;
                        }
                    }
                }).catch(error => {
                    db.close();
                    reject(error);
                });
            }).catch(error => {
                db.close();
                reject(error);
            });
        });
    }
}

module.exports = IndexedLibrary;

},{"./ObjectsLibrary":20}],19:[function(require,module,exports){
const ArrayLibrary = require('./ArrayLibrary');
let arrayLibrary = new ArrayLibrary();

function MathsLibrary() {

    this.placeUnit = (num, value, count) => {
        num = Math.floor(num).toString();
        value = value || num[0];
        count = count || 0;

        let pos = -1;
        for (let i = 0; i < num.length; i++) {
            if (num[i] == value) {
                if (count == 0) {
                    pos = i;
                }
                count--;
            }
        }


        if (pos != -1) pos = 10 ** (num.length - pos - 1);
        return pos;
    }

    this.round = (params) => {
        params.dir = params.dir || 'round';
        params.to = params.to || 1;

        let value = Math[params.dir](params.num / params.to) * params.to;
        return value;
    }

    this.variance = (data) => {
        let mean = this.mean(data);
        let variance = 0;
        for (let i = 0; i < data.length; i++) {
            variance += (data[i] - mean) ** 2;
        }
        return variance / data.length;
    }

    this.standardDeviation = (data) => {
        let variance = this.variance(data);
        let std = Math.sqrt(variance);
        return std;
    }

    this.range = (data) => {
        let min = Math.min(...data);
        let max = Math.max(...data);

        let range = max - min;
        return range;
    }

    this.mean = (data) => {
        let sum = this.sum(data);

        let mean = sum / data.length;
        return mean;
    }

    this.median = (data) => {
        let length = data.length;
        let median;
        if (length % 2 == 0) {
            median = (data[(length / 2) - 1] + data[length / 2]) / 2;
        } else {
            median = data[Math.floor(length / 2)];
        }

        return median;
    }

    this.mode = (data) => {
        let record = {};
        for (let i = 0; i < data.length; i++) {
            if (record[data[i]] != undefined) record[data[i]]++;
            else record[data[i]] = i;
        }

        let max = Math.max(...Object.value(record));
        let mode;
        for (let i in record) {
            if (record[i] == max) {
                mode = i;
                break;
            }
        }

        return mode;
    }

    this.normalizeData = (data) => {
        data.sort((a, b) => { return a - b });
        var max = data[data.length - 1];
        var min = data[0];
        var normalized = [];
        for (var i = 0; i < data.length; i++) {
            normalized.push((data[i] - min) / (max - min));
        }
        return normalized;
    }

    this.minimuimSwaps = (arr, order) => {
        var swap = 0;
        var checked = [];
        var counter = 0;
        var final = [...arr].sort((a, b) => { return a - b });
        if (order == -1) final = final.reverse();

        for (var i = 0; i < arr.length; i++) {
            var element = arr[i];
            if (i == element || checked[i]) continue;

            counter = 0;

            if (arr[0] == 0) element = i;

            while (!checked[i]) {
                checked[i] = true;
                i = final.indexOf(element);
                element = arr[i];
                counter++;
            }
            if (counter != 0) {
                swap += counter - 1;
            }
        }
        return swap;
    }

    this.primeFactorize = (number) => {
        if (typeof number != "number") return [];
        number = Math.abs(parseInt(number));
        if (number == 1 || number == 0) return []//1 and 0 has no primes
        var divider = 2;
        var dividend;
        var factors = [];
        while (number != 1) {
            dividend = number / divider;
            if (dividend.toString().indexOf('.') != -1) {
                divider++
                continue;
            }
            number = dividend;
            factors.push(divider);
        }
        return factors;
    }

    this.lcf = (numbers) => {
        if (!Array.isArray(numbers)) return [];
        var factors = [];
        var commonFactors = [];
        var value = 1;
        for (var number of numbers) {
            if (typeof number != "number") return [];
            factors.push(this.primeFactorize(number))
        }

        main:
        for (var factor of factors[0]) {
            if (commonFactors.indexOf(factor) == -1) {
                for (var i of factors) {
                    if (i.indexOf(factor) == -1) continue main;
                }
                commonFactors.push(factor);
                value *= factor;
            }
        }
        return value;
    }

    this.stripInteger = (number) => {
        number = number.toString();
        number = (number.indexOf('.') == -1) ? number : number.slice(0, number.indexOf('.'));
        return number;
    }

    this.stripFraction = (number) => {
        number = number.toString();
        number = (number.indexOf('.') == -1) ? '0' : number.slice(number.indexOf('.') + 1);
        return number;
    }

    this.changeBase = (number, from, to) => {
        return parseFloat(number, from).toString(to);
    }

    this.max = (array) => {
        var max = array[0];
        arrayLibrary.each(array, value => {
            if (max < value) max = value;
        });
        return max;
    }

    this.min = (array) => {
        var max = array[0];
        arrayLibrary.each(array, value => {
            if (max > value) max = value;
        });
        return max;
    }

    this.sum = (array) => {
        //for finding the sum of one layer array
        let sum = 0;
        for (let i = 0; i < array.length; i++) {
            if (isNaN(Math.floor(array[i]))) {
                sum = false;
                break;
            }
            sum += array[i] / 1;
        }

        return sum;
    }

    this.product = (array) => {
        //for finding the sum of one layer array
        let product = 1;
        for (let i = 0; i < array.length; i++) {
            if (isNaN(Math.floor(array[i]))) {
                product = false;
                break;
            }
            product *= array[i];
        }

        return product;
    }

    this.add = (...arrays) => {
        let newArray = [];
        arrays[0].forEach((value, position) => {
            arrays.forEach((array, location) => {
                if (location != 0) {
                    let element = Array.isArray(array) ? array[position] : array;
                    value += isNaN(element) == true ? 0 : element;
                }
            })
            newArray.push(value);
        });
        return newArray;
    }

    this.sub = (...arrays) => {
        let newArray = [];
        arrays[0].forEach((value, position) => {
            arrays.forEach((array, location) => {
                if (location != 0) {
                    let element = Array.isArray(array) ? array[position] : array;
                    value -= isNaN(element) == true ? 0 : element;
                }
            })
            newArray.push(value);
        });
        return newArray;
    }

    this.mul = (...arrays) => {
        let newArray = [];
        arrays[0].forEach((value, position) => {
            arrays.forEach((array, location) => {
                if (location != 0) {
                    let element = Array.isArray(array) ? array[position] : array;
                    value *= isNaN(element) == true ? 0 : element;
                }
            })
            newArray.push(value);
        });
        return newArray;
    }

    this.divide = (...arrays) => {
        let newArray = [];
        arrays[0].forEach((value, position) => {
            arrays.forEach((array, location) => {
                if (location != 0) {
                    let element = Array.isArray(array) ? array[position] : array;
                    value /= isNaN(element) == true ? 0 : element;
                }
            })
            newArray.push(value);
        });
        return newArray;
    }

    this.abs = (array) => {
        return arrayLibrary.each(array, value => {
            value = isNaN(value) == true ? 0 : value;
            return Math.abs(value);
        });
    }
}

module.exports = MathsLibrary;
},{"./ArrayLibrary":15}],20:[function(require,module,exports){
const ArrayLibrary = require('./ArrayLibrary');
let arrayLibrary = new ArrayLibrary();

function ObjectsLibrary() {

    this.extractFromJsonArray = (meta, source) => {//extract a blueprint of data from a JsonArray
        let keys = Object.keys(meta);//get the keys
        let values = Object.values(meta);//get the values

        let eSource = [];
        if (source != undefined) {
            for (let obj of source) {//each item in source
                let object = {};
                for (let i in keys) {//each blueprint key
                    if (arrayLibrary.contains(Object.keys(obj), values[i])) {//source item has blueprint value
                        object[keys[i]] = obj[values[i]];//store according to blueprint
                    }
                }
                eSource.push(object);
            }
        }
        return eSource;
    }

    this.find = (obj, callback) => {//higher order Object function for the first item in an Object that match
        for (let i in obj) {
            if (callback(obj[i]) == true) {
                return obj[i];
            }
        }
    }

    this.findAll = (obj, callback) => {//higher order Object function for all items in an Object that match
        let values = {};
        for (let i in obj) {
            if (callback(obj[i]) == true)
                values[i] = obj[i];
        }

        return values;
    }

    this.makeIterable = (obj) => {//make an object to use 'for in'
        obj[Symbol.iterator] = function* () {
            let properties = Object.keys(obj);
            for (let p of properties) {
                yield this[p];
            }
        }
        return obj;
    }

    this.max = (object) => {
        object = this.sort(object, { value: true });
        return this.getIndex(object);
    }

    this.min = (object) => {//get the mininum in item in an Object
        object = this.sort(object, { value: false });
        return this.getIndex(object);
    }

    this.onChanged = (obj, callback) => {//make an object listen to changes of it's items
        const handler = {
            get(target, property, receiver) {//when an Item is fetched
                try {
                    return new Proxy(target[property], handler);
                } catch (err) {
                    return Reflect.get(target, property, receiver);
                }
            },
            defineProperty(target, property, descriptor) {//when an Item is added
                callback(target, property);
                return Reflect.defineProperty(target, property, descriptor);
            },
            deleteProperty(target, property) {//when an Item is removed
                callback(target, property);
                return Reflect.deleteProperty(target, property);
            }
        };

        return new Proxy(obj, handler);
    }

    this.toArray = (object, named) => {//turn an Object into an Array
        var array = [];
        Object.keys(object).map((key) => {
            if (named == true) {//make it named
                array[key] = object[key];
            }
            else {
                array.push(object[key]);
            }
        });
        return array;
    }

    this.valueOfObjectArray = (array, name) => {//get all the keys in a JsonArray of item name
        var newArray = [];
        for (let i in array) {
            newArray.push(array[i][name]);
        }
        return newArray;
    }

    this.keysOfObjectArray = (array = []) => {//get all the keys in a JsonArray
        var newArray = [];
        for (let i in array) {
            newArray = newArray.concat(Object.keys(array[i]));
        }
        return arrayLibrary.toSet(newArray);//remove duplicates
    }

    this.objectOfObjectArray = (array = [], id, name) => {//strip [key value] from a JsonArray
        var object = {};
        for (let i in array) {
            object[array[i][id]] = array[i][name];
        }
        return object;
    }

    this.copy = (from, to) => {//clone an Object
        Object.keys(from).map(key => {
            to[key] = from[key];
        });
    }

    this.forEach = (object, callback) => {//higher order function for Object literal
        for (let key in object) {
            callback(object[key], key);
        }
    }

    this.each = function (object, callback) {//higher order function for Object literal
        let newObject = {};
        for (let key in object) {
            newObject[key] = callback(object[key], key);
        }
        return newObject;
    }

    this.isSubObject = (data, sample) => {//check if an object is a sub-Object of another Object
        let flag;
        for (let name in sample) {
            flag = JSON.stringify(sample[name]) == JSON.stringify(data[name]);//convert to string and compare
            if (!flag) break;
        }

        return flag;
    }

    this.getSubObject = (data = [], sample = {}) => {//get matched items in Object
        let matched = [], flag = true;
        for (let i in data) {
            flag = this.isSubObject(data[i], sample);//check each object
            if (!flag) continue;
            matched.push(data[i]);
        }

        return matched
    }

    this.sort = (data = {}, params = { items: [], descend: false, key: false, value: false }) => {//sort an Object based on[key, value or items]
        params.item = params.item || '';
        params.descend = params.descend || false;

        let sorted = [], nData = {};
        for (let [key, value] of Object.entries(data)) {
            sorted.push({ key, value });
        }

        if (params.key != undefined) {//sort with key
            console.log('Hello');
            sorted.sort((a, b) => {
                let value = (a.key >= b.key);
                if (params.key == true) value = !value;//descend
                return value;
            });
        }

        if (params.value != undefined) {//sort with value
            sorted.sort((a, b) => {
                let value = (a.value >= b.value);
                if (params.value == true) value = !value;//descend
                return value;
            });
        }

        if (params.items != undefined) {//sort with items
            sorted.sort((a, b) => {
                let greater = 0, lesser = 0;
                for (let item of params.items) {
                    if (a.value[item] >= b.value[item]) greater++
                    else lesser++;
                }
                let value = greater >= lesser;
                if (params.descend == true) value = !value;//descend items
                return value;
            });
        }

        for (let { key, value } of sorted) {
            nData[key] = value;
        }

        return nData;
    }

    this.reverse = (data = {}) => {//reverse an Object
        let keys = Object.keys(data).reverse();
        let newObject = {};
        for (let i of keys) {
            newObject[i] = data[i];
        }
        return newObject;
    }

    this.getIndex = (data = {}) => {//get the first item in the Object
        let key = Object.keys(data).shift();
        let value = data[key];
        return { key, value };
    }

    this.getLast = (data = {}) => {//get the last item in the Object
        let key = Object.keys(data).pop();
        let value = data[key];
        return { key, value };
    }

    this.getAt = (data = {}, index) => {//get the item of index in the Object
        let key = Object.keys(data)[index];
        let value = data[key];
        return { key, value };
    }

    this.keyOf = (data = {}, item) => {//get the first occurrance of an item in an Object
        let index = -1;
        for (let i in data) {
            if (JSON.stringify(data[i]) == JSON.stringify(item)) {
                return i;
            }
        }

        return index;
    }

    this.lastKeyOf = (data = {}, item) => {//get the last occurrance of an item in an object
        let index = -1;
        for (let i in data) {
            if (JSON.stringify(data[i]) == JSON.stringify(item)) {
                index = i;
            }
        }

        return index;
    }

    this.includes = (data = {}, item) => {//check if an Object has an item
        return this.keyOf(data, item) != -1;
    }

    this.aggregate = (data = {}, groups = {}) => {
        let funcs = {
            $sum: (...a) => { return a.reduce((i, j) => i + j) },
            $dif: (...a) => { return a[0] - a[1] ? a[1] : 0 },
            $mul: (...a) => { return a.reduce((i, j) => i * j) },
            $dif: (...a) => { return a[0] - a[1] ? a[1] : 1 },
            cast: (a, to) => {
                if (to == 'int') a = parseInt(a);
                else if (to == 'float') a = parseFloat(a);
                else if (to == 'string') a = a.toString();
                else if (to == 'date') a = new Date(a);
                return a;
            },
        }

        let agg = Object.assign({}, data);
        let x, list, l;
        for (x in groups) {
            list = [];
            for (l of groups[x].list) list.push(agg[l]);
            agg[x] = funcs[groups[x].action](...list);
        }

        return agg;
    }
}

module.exports = ObjectsLibrary;
},{"./ArrayLibrary":15}],21:[function(require,module,exports){
const Func = require('./../classes/Func');
let func = new Func();

function Shadow(element) {
    this.element = element.cloneNode(true);
    this.properties = {};
    this.childProperties = {};

    this.updateNewElementChildProperties = function (element, propertyCollection = {}) {
        let children, positions;
        for (let identifier in propertyCollection) {
            for (let childProperties of propertyCollection[identifier]) {
                positions = this.setPositions(childProperties.positions);
                children = this.getChildren(identifier, element, positions);
                for (let j = 0; j < children.length; j++) {
                    children[j].setProperties(childProperties.properties);
                }
            }
        }
    }

    this.updateNewElementChildAttributes = function (element, attributeCollection = {}) {
        let children, positions;
        for (let identifier in attributeCollection) {
            for (let childAtrributes of attributeCollection[identifier]) {
                positions = this.setPositions(childAtrributes.positions);
                children = this.getChildren(identifier, element, positions);
                for (let j = 0; j < children.length; j++) {
                    children[j].setAttributes(childAtrributes.attributes);
                }
            }
        }
    }

    this.setPositions = function (positions = 1) {
        if (!Array.isArray(positions)) {
            positions = func.range(positions);
        }

        return positions;
    }

    this.createElement = function (params = { childDetails: { attributes: {}, properties: {} }, details: { attributes: {}, properties: {} } }) {
        let element = this.element.cloneNode(true);
        this.children.push(element);

        this.prepareElement(element, params);
        return element;
    }

    this.prepareElement = function (element, params = { childDetails: { attributes: {}, properties: {} }, details: { attributes: {}, properties: {} } }) {
        if (params.childDetails != undefined) {
            if (params.childDetails.attributes != undefined) {
                this.updateNewElementChildAttributes(element, params.childDetails.attributes);
            }

            if (params.childDetails.properties != undefined) {
                this.updateNewElementChildProperties(element, params.childDetails.properties);
            }
        }

        if (params.details != undefined) {
            if (params.details.attributes != undefined) {
                element.setAttributes(params.details.attributes);
            }

            if (params.details.properties != undefined) {
                element.setProperties(params.details.properties);
            }
        }

        this.updateNewElementChildProperties(element, this.childProperties);
        element.setProperties(this.properties);

        this.makeCloneable(element);
    }

    this.removeElement = function (element) {
        let children = [];
        let position = this.children.indexOf(element);
        for (let i = 0; i < this.children.lengt; i++) {
            if (position != i) {
                children.push(this.children[i]);
            }
        }
        this.children = children;
    }

    this.cloneElement = function (position, params = { childDetails: { attributes: {}, properties: {} }, details: { attributes: {}, properties: {} } }) {
        let element = this.children[position].cloneNode(true);
        this.children.push(element);

        this.prepareElement(element, params);
        return element;
    }

    this.makeCloneable = function (element) {
        let position = this.children.indexOf(element);
        if (position == -1) {
            return;
        }

        element.unitClone = (params) => {
            return this.cloneElement(position, params)
        }
    }

    this.length = function () {
        return this.children.length;
    }

    this.setProperties = function (properties = {}) {
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].setProperties(properties);
        }
        this.element.setProperties(properties);
        for (let i in properties) {
            this.properties[i] = properties[i];
        }
    }

    this.css = function (style = {}) {
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].css(style);
        }
        this.element.css(style);
    }

    this.setAttributes = function (attributes = {}) {
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].setAttributes(attributes);
        }
        this.element.setAttributes(attributes);
    }

    this.addClasses = function (classes = '') {
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].addClasses(classes);
        }
        this.element.addClasses(classes);
    }

    this.removeClasses = function (classes = '') {
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].removeClasses(classes);
        }
        this.element.removeClasses(classes);
    }

    this.getChildren = function (identifier = '', element, positions = []) {
        let collection = [];
        let children = element.findAll(identifier);//get the children matching identifier in each element
        if (children.length > 0) {//if not empty
            for (let j = 0; j < positions.length; j++) {
                if (children[positions[j]] != undefined) {//if available
                    collection.push(children[positions[j]]);
                }
            }
        }
        return collection;
    }

    this.childCss = function (identifier = '', style = {}, positions = []) {
        positions = this.setPositions(positions);

        let children;
        for (let i = 0; i < this.children.length; i++) {
            children = this.getChildren(identifier, this.children[i], positions);

            for (let j = 0; j < children.length; j++) {
                children[j].css(style);
            }
        }

        children = this.getChildren(identifier, this.element, positions);

        for (let j = 0; j < children.length; j++) {
            children[j].css(style);
        }
    }

    this.setChildProperties = function (identifier = '', properties = {}, positions = []) {
        positions = this.setPositions(positions);

        let children;
        for (let i = 0; i < this.children.length; i++) {
            children = this.getChildren(identifier, this.children[i], positions);

            for (let j = 0; j < children.length; j++) {
                children[j].setProperties(properties);
            }
        }

        children = this.getChildren(identifier, this.element, positions);
        for (let j = 0; j < children.length; j++) {
            children[j].setProperties(properties);
        }

        this.childProperties[identifier] = this.childProperties[identifier] || [];
        this.childProperties[identifier].push({ properties, positions });
    }

    this.setChildAttributes = function (identifier = '', attributes = {}, positions = '') {
        positions = this.setPositions(positions);

        let children;
        for (let i = 0; i < this.children.length; i++) {
            children = this.getChildren(identifier, this.children[i], positions);

            for (let j = 0; j < children.length; j++) {
                children[j].setAttributes(attributes);
            }
        }

        children = this.getChildren(identifier, this.element, positions);

        for (let j = 0; j < children.length; j++) {
            children[j].setAttributes(attributes);
        }
    }

    this.addClassesToChild = function (identifier = '', classes = '', positions = []) {
        positions = this.setPositions(positions);

        let children;
        for (let i = 0; i < this.children.length; i++) {
            children = this.getChildren(identifier, this.children[i], positions);

            for (let j = 0; j < children.length; j++) {
                children[j].addClasses(classes);
            }
        }

        children = this.getChildren(identifier, this.element, positions);

        for (let j = 0; j < children.length; j++) {
            children[j].addClasses(classes);
        }
    }

    this.removeClassesFromChild = function (identifier = '', classes = '', positions = []) {
        positions = this.setPositions(positions);

        let children;
        for (let i = 0; i < this.children.length; i++) {
            children = this.getChildren(identifier, this.children[i], positions);

            for (let j = 0; j < children.length; j++) {
                children[j].removeClasses(classes);
            }
        }

        children = this.getChildren(identifier, this.element, positions);

        for (let j = 0; j < children.length; j++) {
            children[j].removeClasses(classes);
        }
    }
}

module.exports = Shadow;
},{"./../classes/Func":5}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL1VzZXJzLzIzNDgxL0FwcERhdGEvUm9hbWluZy9udm0vdjEyLjE5LjAvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvc3JjL21haW4uanMiLCJicm93c2VyLmpzIiwiY2xhc3Nlcy9CYXNlLmpzIiwiY2xhc3Nlcy9Db21wb25lbnRzLmpzIiwiY2xhc3Nlcy9GdW5jLmpzIiwiY2xhc3Nlcy9KU0VsZW1lbnRzLmpzIiwiY2xhc3Nlcy9NYXRyaXguanMiLCJjbGFzc2VzL05ldXJhbE5ldHdvcmsuanMiLCJjbGFzc2VzL1BlcmlvZC5qcyIsImNsYXNzZXMvVGVtcGxhdGUuanMiLCJjbGFzc2VzL1RyZWUuanMiLCJjbGFzc2VzL1RyZWVFdmVudC5qcyIsImZ1bmN0aW9ucy9BbmFseXNpc0xpYnJhcnkuanMiLCJmdW5jdGlvbnMvQXBwTGlicmFyeS5qcyIsImZ1bmN0aW9ucy9BcnJheUxpYnJhcnkuanMiLCJmdW5jdGlvbnMvQ29sb3JQaWNrZXIuanMiLCJmdW5jdGlvbnMvQ29tcHJlc3Npb24uanMiLCJmdW5jdGlvbnMvSW5kZXhlZExpYnJhcnkuanMiLCJmdW5jdGlvbnMvTWF0aHNMaWJyYXJ5LmpzIiwiZnVuY3Rpb25zL09iamVjdHNMaWJyYXJ5LmpzIiwiZnVuY3Rpb25zL1NoYWRvdy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3Z6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNXFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbGJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4VkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RrQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNWtCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMW5CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNweUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BhQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM1NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjb25zdCB7IEJhc2UgfSA9IHJlcXVpcmUoJy4vLi4vLi4vYnJvd3NlcicpO1xyXG5cclxud2luZG93LmJhc2UgPSBuZXcgQmFzZSh3aW5kb3cpO1xyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZXZlbnQgPT4ge1xyXG4gICAgY29uc3QgeyBib2R5IH0gPSBkb2N1bWVudDtcclxuICAgIGJvZHkubWFrZUVsZW1lbnQoe1xyXG4gICAgICAgIGVsZW1lbnQ6ICdkaXYnLCBhdHRyaWJ1dGVzOiB7IHN0eWxlOiB7IGJhY2tncm91bmQ6ICdyZWQnLCBwYWRkaW5nOiAnMWVtJyB9IH0sIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQ6ICdzcGFuJywgYXR0cmlidXRlczogeyBzdHlsZTogeyBiYWNrZ3JvdW5kOiAnYmx1ZScsIHBhZGRpbmc6ICcxZW0nIH0gfSwgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgICAgICAgICB7IGVsZW1lbnQ6ICdhJywgYXR0cmlidXRlczogeyBzdHlsZTogeyBiYWNrZ3JvdW5kOiAnZ3JlZW4nLCBwYWRkaW5nOiAnMWVtJyB9IH0sIHRleHQ6ICdIb3cgYXJlIHlvdScgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXVxyXG4gICAgfSk7XHJcblxyXG4gICAgZG9jdW1lbnQuYm9keS5hZGRDaGlsZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgeyBub2RlTmFtZTogJ2RpdicgfSwgKGUpID0+IHsgY29uc29sZS5sb2coZSkgfSlcclxufSk7IiwiY29uc3QgQmFzZSA9IHJlcXVpcmUoJy4vY2xhc3Nlcy9CYXNlJyk7XHJcbmNvbnN0IENvbXBvbmVudHMgPSByZXF1aXJlKCcuL2NsYXNzZXMvQ29tcG9uZW50cycpO1xyXG5jb25zdCBGdW5jID0gcmVxdWlyZSgnLi9jbGFzc2VzL0Z1bmMnKTtcclxuY29uc3QgSlNFbGVtZW50cyA9IHJlcXVpcmUoJy4vY2xhc3Nlcy9KU0VsZW1lbnRzJyk7XHJcbmNvbnN0IE1hdHJpeCA9IHJlcXVpcmUoJy4vY2xhc3Nlcy9NYXRyaXgnKTtcclxuY29uc3QgTmV1cmFsTmV0d29yayA9IHJlcXVpcmUoJy4vY2xhc3Nlcy9OZXVyYWxOZXR3b3JrJyk7XHJcbmNvbnN0IFBlcmlvZCA9IHJlcXVpcmUoJy4vY2xhc3Nlcy9QZXJpb2QnKTtcclxuY29uc3QgVGVtcGxhdGUgPSByZXF1aXJlKCcuL2NsYXNzZXMvVGVtcGxhdGUnKTtcclxuY29uc3QgVHJlZSA9IHJlcXVpcmUoJy4vY2xhc3Nlcy9UcmVlJyk7XHJcbmNvbnN0IEFwcExpYnJhcnkgPSByZXF1aXJlKCcuL2Z1bmN0aW9ucy9BcHBMaWJyYXJ5Jyk7XHJcbmNvbnN0IEFuYWx5c2lzTGlicmFyeSA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zL0FuYWx5c2lzTGlicmFyeScpO1xyXG5jb25zdCBBcnJheUxpYnJhcnkgPSByZXF1aXJlKCcuL2Z1bmN0aW9ucy9BcnJheUxpYnJhcnknKTtcclxuY29uc3QgQ29tcHJlc3Npb24gPSByZXF1aXJlKCcuL2Z1bmN0aW9ucy9Db21wcmVzc2lvbicpO1xyXG5jb25zdCBNYXRoc0xpYnJhcnkgPSByZXF1aXJlKCcuL2Z1bmN0aW9ucy9NYXRoc0xpYnJhcnknKTtcclxuY29uc3QgU2hhZG93ID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMvU2hhZG93Jyk7XHJcbmNvbnN0IE9iamVjdHNMaWJyYXJ5ID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMvT2JqZWN0c0xpYnJhcnknKTtcclxuY29uc3QgSW5kZXhlZExpYnJhcnkgPSByZXF1aXJlKCcuL2Z1bmN0aW9ucy9JbmRleGVkTGlicmFyeScpO1xyXG5jb25zdCBDb2xvclBpY2tlciA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zL0NvbG9yUGlja2VyJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIEJhc2UsXHJcbiAgICBGdW5jLFxyXG4gICAgTmV1cmFsTmV0d29yayxcclxuICAgIE1hdHJpeCxcclxuICAgIFRlbXBsYXRlLFxyXG4gICAgQ29tcG9uZW50cyxcclxuICAgIENvbXByZXNzaW9uLFxyXG4gICAgQ29sb3JQaWNrZXIsXHJcbiAgICBJbmRleGVkTGlicmFyeSxcclxuICAgIEFwcExpYnJhcnksXHJcbiAgICBBcnJheUxpYnJhcnksXHJcbiAgICBBbmFseXNpc0xpYnJhcnksXHJcbiAgICBPYmplY3RzTGlicmFyeSxcclxuICAgIE1hdGhzTGlicmFyeSxcclxuICAgIFNoYWRvdyxcclxuICAgIFRyZWUsXHJcbiAgICBQZXJpb2QsXHJcbiAgICBKU0VsZW1lbnRzLFxyXG59XHJcbiIsImNvbnN0IENvbXBvbmVudHMgPSByZXF1aXJlKCcuL0NvbXBvbmVudHMnKTtcclxuY29uc3QgQ29sb3JQaWNrZXIgPSByZXF1aXJlKCcuLi9mdW5jdGlvbnMvQ29sb3JQaWNrZXInKTtcclxuY29uc3QgQXJyYXlMaWJyYXJ5ID0gcmVxdWlyZSgnLi8uLi9mdW5jdGlvbnMvQXJyYXlMaWJyYXJ5Jyk7XHJcbmNvbnN0IE9iamVjdHNMaWJyYXJ5ID0gcmVxdWlyZSgnLi8uLi9mdW5jdGlvbnMvT2JqZWN0c0xpYnJhcnknKTtcclxuXHJcbmNsYXNzIEVtcHR5IHtcclxufVxyXG5cclxuY2xhc3MgQmFzZSBleHRlbmRzIENvbXBvbmVudHMge1xyXG4gICAgY29uc3RydWN0b3IodGhlV2luZG93ID0gRW1wdHkpIHtcclxuICAgICAgICBzdXBlcih0aGVXaW5kb3cpO1xyXG4gICAgICAgIHRoaXMuY29sb3JIYW5kbGVyID0gbmV3IENvbG9yUGlja2VyKCk7XHJcbiAgICAgICAgdGhpcy5hcnJheSA9ICBuZXcgQXJyYXlMaWJyYXJ5KCk7XHJcbiAgICAgICAgdGhpcy5vYmplY3QgPSBuZXcgT2JqZWN0c0xpYnJhcnkoKTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCYXNlO1xyXG4iLCJjb25zdCBUZW1wbGF0ZSA9IHJlcXVpcmUoJy4vVGVtcGxhdGUnKTtcclxuY2xhc3MgRW1wdHkge1xyXG59XHJcblxyXG5jbGFzcyBDb21wb25lbnRzIGV4dGVuZHMgVGVtcGxhdGUge1xyXG4gICAgY29uc3RydWN0b3IodGhlV2luZG93ID0gRW1wdHkpIHtcclxuICAgICAgICBzdXBlcih0aGVXaW5kb3cpO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZVRhYihwYXJhbXMgPSB7IHRpdGxlczogW10gfSkge1xyXG4gICAgICAgIHZhciB0YWJUaXRsZSA9IHRoaXMuY3JlYXRlRWxlbWVudCh7IGVsZW1lbnQ6ICd1bCcsIGF0dHJpYnV0ZXM6IHsgY2xhc3M6ICd0YWInIH0gfSk7XHJcbiAgICAgICAgcGFyYW1zLnZpZXcuYXBwZW5kKHRhYlRpdGxlKTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSBvZiBwYXJhbXMudGl0bGVzKSB7XHJcbiAgICAgICAgICAgIHRhYlRpdGxlLmFwcGVuZChcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlRWxlbWVudCh7IGVsZW1lbnQ6ICdsaScsIGF0dHJpYnV0ZXM6IHsgY2xhc3M6ICd0YWItdGl0bGUnIH0sIHRleHQ6IGkgfSlcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGFiVGl0bGUuZmluZEFsbCgnbGknKS5mb3JFYWNoKG5vZGUgPT4ge1xyXG4gICAgICAgICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIHVybCA9IHRoaXMudXJsU3BsaXR0ZXIobG9jYXRpb24uaHJlZik7XHJcbiAgICAgICAgICAgICAgICB1cmwudmFycy50YWIgPSBub2RlLnRleHRDb250ZW50LnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgICAgICByb3V0ZXIucmVuZGVyKHsgdXJsOiAnPycgKyB0aGlzLnVybFNwbGl0dGVyKHRoaXMudXJsTWVyZ2VyKHVybCwgJ3RhYicpKS5xdWVyaWVzIH0pO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgY2VsbChwYXJhbXMgPSB7IGVsZW1lbnQ6ICdpbnB1dCcsIGF0dHJpYnV0ZXM6IHt9LCBuYW1lOiAnJywgZGF0YUF0dHJpYnV0ZXM6IHt9LCB2YWx1ZTogJycsIHRleHQ6ICcnLCBodG1sOiAnJywgZWRpdDogJycgfSkge1xyXG4gICAgICAgIC8vc2V0IHRoZSBjZWxsLWRhdGEgaWRcclxuICAgICAgICB2YXIgaWQgPSB0aGlzLnN0cmluZ1JlcGxhY2UocGFyYW1zLm5hbWUsICcgJywgJy0nKSArICctY2VsbCc7XHJcblxyXG4gICAgICAgIC8vY3JlYXRlIHRoZSBjZWxsIGxhYmVsXHJcbiAgICAgICAgdmFyIGxhYmVsID0gdGhpcy5jcmVhdGVFbGVtZW50KHsgZWxlbWVudDogJ2xhYmVsJywgYXR0cmlidXRlczogeyBjbGFzczogJ2NlbGwtbGFiZWwnIH0sIHRleHQ6IHBhcmFtcy5uYW1lIH0pO1xyXG5cclxuICAgICAgICAvL2NlbGwgYXR0cmlidXRlc1xyXG4gICAgICAgIHBhcmFtcy5hdHRyaWJ1dGVzID0gKHRoaXMuaXNzZXQocGFyYW1zLmF0dHJpYnV0ZXMpKSA/IHBhcmFtcy5hdHRyaWJ1dGVzIDoge307XHJcblxyXG4gICAgICAgIC8vY2VsbCBkYXRhIGF0dHJpYnV0ZXNcclxuICAgICAgICBwYXJhbXMuZGF0YUF0dHJpYnV0ZXMgPSAodGhpcy5pc3NldChwYXJhbXMuZGF0YUF0dHJpYnV0ZXMpKSA/IHBhcmFtcy5kYXRhQXR0cmlidXRlcyA6IHt9O1xyXG4gICAgICAgIHBhcmFtcy5kYXRhQXR0cmlidXRlcy5pZCA9IGlkO1xyXG5cclxuICAgICAgICB2YXIgY29tcG9uZW50cztcclxuXHJcbiAgICAgICAgLy9zZXQgdGhlIHByb3BlcnRpZXMgb2YgY2VsbCBkYXRhXHJcbiAgICAgICAgaWYgKHBhcmFtcy5lbGVtZW50ID09ICdzZWxlY3QnKSB7Ly9jaGVjayBpZiBjZWxsIGRhdGEgaXMgaW4gc2VsZWN0IGVsZW1lbnRcclxuICAgICAgICAgICAgY29tcG9uZW50cyA9IHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQ6IHBhcmFtcy5lbGVtZW50LCBhdHRyaWJ1dGVzOiBwYXJhbXMuZGF0YUF0dHJpYnV0ZXMsIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgeyBlbGVtZW50OiAnb3B0aW9uJywgYXR0cmlidXRlczogeyBkaXNhYmxlZDogJycsIHNlbGVjdGVkOiAnJyB9LCB0ZXh0OiBgU2VsZWN0ICR7cGFyYW1zLm5hbWV9YCwgdmFsdWU6ICcnIH0vL3NldCB0aGUgZGVmYXVsdCBvcHRpb25cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbXBvbmVudHMgPSB7IGVsZW1lbnQ6IHBhcmFtcy5lbGVtZW50LCBhdHRyaWJ1dGVzOiBwYXJhbXMuZGF0YUF0dHJpYnV0ZXMsIHRleHQ6IHBhcmFtcy52YWx1ZSB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNzZXQocGFyYW1zLnZhbHVlKSkgY29tcG9uZW50cy5hdHRyaWJ1dGVzLnZhbHVlID0gcGFyYW1zLnZhbHVlO1xyXG4gICAgICAgIGlmICh0aGlzLmlzc2V0KHBhcmFtcy5vcHRpb25zKSkgY29tcG9uZW50cy5vcHRpb25zID0gcGFyYW1zLm9wdGlvbnM7XHJcblxyXG4gICAgICAgIGxldCBkYXRhO1xyXG4gICAgICAgIGlmIChwYXJhbXMuZWxlbWVudCBpbnN0YW5jZW9mIEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgZGF0YSA9IHBhcmFtcy5lbGVtZW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgZGF0YSA9IHRoaXMuY3JlYXRlRWxlbWVudChjb21wb25lbnRzKTsvL2NyZWF0ZSB0aGUgY2VsbC1kYXRhXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkYXRhLmNsYXNzTGlzdC5hZGQoJ2NlbGwtZGF0YScpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pc3NldChwYXJhbXMudmFsdWUpKSBkYXRhLnZhbHVlID0gcGFyYW1zLnZhbHVlO1xyXG5cclxuICAgICAgICAvL2NyZWF0ZSBjZWxsIGVsZW1lbnRcclxuICAgICAgICBsZXQgY2VsbCA9IHRoaXMuY3JlYXRlRWxlbWVudCh7IGVsZW1lbnQ6ICdkaXYnLCBhdHRyaWJ1dGVzOiBwYXJhbXMuYXR0cmlidXRlcywgY2hpbGRyZW46IFtsYWJlbCwgZGF0YV0gfSk7XHJcblxyXG4gICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZCgnY2VsbCcpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pc3NldChwYXJhbXMudGV4dCkpIGRhdGEudGV4dENvbnRlbnQgPSBwYXJhbXMudGV4dDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNzZXQocGFyYW1zLmh0bWwpKSBkYXRhLmlubmVySFRNTCA9IHBhcmFtcy5odG1sO1xyXG5cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNzZXQocGFyYW1zLmxpc3QpKSB7XHJcbiAgICAgICAgICAgIGNlbGwubWFrZUVsZW1lbnQoe1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudDogJ2RhdGFsaXN0JywgYXR0cmlidXRlczogeyBpZDogYCR7aWR9LWxpc3RgIH0sIG9wdGlvbnM6IHBhcmFtcy5saXN0LnNvcnQoKVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGRhdGEuc2V0QXR0cmlidXRlKCdsaXN0JywgYCR7aWR9LWxpc3RgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBlZGl0O1xyXG4gICAgICAgIGlmICh0aGlzLmlzc2V0KHBhcmFtcy5lZGl0KSkge1xyXG4gICAgICAgICAgICBlZGl0ID0gY2VsbC5tYWtlRWxlbWVudCh7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50OiAnaScsIGF0dHJpYnV0ZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBjbGFzczogYCR7cGFyYW1zLmVkaXR9YCwgJ2RhdGEtaWNvbic6ICdmYXMsIGZhLXBlbicsIHN0eWxlOiB7IGN1cnNvcjogJ3BvaW50ZXInLCBiYWNrZ3JvdW5kQ29sb3I6ICd2YXIoLS1wcmltYXJ5LWNvbG9yKScsIHdpZHRoOiAnMWVtJywgaGVpZ2h0OiAnYXV0bycsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCB0b3A6ICcwcHgnLCByaWdodDogJzBweCcsIHBhZGRpbmc6ICcuMTVlbScgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY2VsbC5jc3MoeyBwb3NpdGlvbjogJ3JlbGF0aXZlJyB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNlbGwubWFrZUVsZW1lbnQoe1xyXG4gICAgICAgICAgICBlbGVtZW50OiAnc3R5bGUnLCB0ZXh0OiBgXHJcbiAgICAgICAgLmNlbGwge1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtZ3JpZDtcclxuICAgICAgICAgICAgbWFyZ2luOiAuNWVtO1xyXG4gICAgICAgICAgICBmb250LXNpemU6IDFlbTtcclxuICAgICAgICAgICAgbGV0dGVyLXNwYWNpbmc6IC4xZW07XHJcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiAzMDA7XHJcbiAgICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIGdyYXk7XHJcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDEwcHg7XHJcbiAgICAgICAgICAgIG92ZXJmbG93OiBhdXRvO1xyXG4gICAgICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICAgICAgICAgIG1pbi13aWR0aDogMTAwcHg7XHJcbiAgICAgICAgICAgIG92ZXJmbG93LXk6IGhpZGRlbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgLmNlbGw6aG92ZXIsIC5jZWxsOmZvY3VzIHtcclxuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogdW5zZXQ7XHJcbiAgICAgICAgICAgIGJveC1zaGFkb3c6IHZhcigtLXByaW1hcnktc2hhZG93KTtcclxuICAgICAgICAgICAgdHJhbnNpdGlvbi1kdXJhdGlvbjogLjJzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAuY2VsbC1sYWJlbCB7XHJcbiAgICAgICAgICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXNlY29uZGFyeS1jb2xvcik7XHJcbiAgICAgICAgICAgIGNvbG9yOiB2YXIoLS1wcmltYXJ5LWNvbG9yKTtcclxuICAgICAgICAgICAgcGFkZGluZzogMC4zZW07XHJcbiAgICAgICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDQwMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgLmNlbGwtZGF0YXtcclxuICAgICAgICAgICAgcGFkZGluZzogMC4zZW07XHJcbiAgICAgICAgICAgIG91dGxpbmU6IG5vbmU7XHJcbiAgICAgICAgICAgIGJvcmRlcjogbm9uZTtcclxuICAgICAgICAgICAgY29sb3I6IHZhcigtLXNlY29uZGFyeS1jb2xvcik7XHJcbiAgICAgICAgICAgIG1pbi1oZWlnaHQ6IDMwcHg7XHJcbiAgICAgICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgICAgICAgICAganVzdGlmeS1zZWxmOiBjZW50ZXI7XHJcbiAgICAgICAgICAgIG1heC13aWR0aDogMzAwcHg7XHJcbiAgICAgICAgICAgIG1heC1oZWlnaHQ6IDEwMHB4O1xyXG4gICAgICAgICAgICBvdmVyZmxvdzogYXV0bztcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgLmNlbGwtZGF0YTpob3ZlciwgLmNlbGwtZGF0YTpmb2N1cyB7XHJcbiAgICAgICAgICAgIGN1cnNvcjogdGV4dDtcclxuICAgICAgICAgICAgdHJhbnNpdGlvbi1kdXJhdGlvbjogMXM7XHJcbiAgICAgICAgfWB9KVxyXG4gICAgICAgIHJldHVybiBjZWxsO1xyXG4gICAgfVxyXG5cclxuICAgIG1lc3NhZ2UocGFyYW1zID0geyBsaW5rOiAnJywgdGV4dDogJycsIHRlbXA6IDAgfSkge1xyXG4gICAgICAgIHZhciBtZSA9IHRoaXMuY3JlYXRlRWxlbWVudCh7XHJcbiAgICAgICAgICAgIGVsZW1lbnQ6ICdzcGFuJywgYXR0cmlidXRlczogeyBjbGFzczogJ2FsZXJ0JyB9LCBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVFbGVtZW50KHsgZWxlbWVudDogJ2EnLCB0ZXh0OiBwYXJhbXMudGV4dCwgYXR0cmlidXRlczogeyBjbGFzczogJ3RleHQnLCBocmVmOiBwYXJhbXMubGluayB9IH0pLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVFbGVtZW50KHsgZWxlbWVudDogJ3NwYW4nLCBhdHRyaWJ1dGVzOiB7IGNsYXNzOiAnY2xvc2UnIH0gfSlcclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pc3NldChwYXJhbXMudGVtcCkpIHtcclxuICAgICAgICAgICAgdmFyIHRpbWUgPSBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIG1lLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWUpO1xyXG4gICAgICAgICAgICB9LCAocGFyYW1zLnRlbXAgIT0gJycpID8gcGFyYW1zLnRpbWUgKiAxMDAwIDogNTAwMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBtZS5maW5kKCcuY2xvc2UnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgbWUucmVtb3ZlKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGJvZHkuZmluZCgnI25vdGlmaWNhdGlvbi1ibG9jaycpLmFwcGVuZChtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlVGFibGUocGFyYW1zID0geyB0aXRsZTogJycsIGNvbnRlbnRzOiB7fSwgcHJvamVjdGlvbjoge30sIHJlbmFtZToge30sIHNvcnQ6IGZhbHNlLCBzZWFyY2g6IGZhbHNlLCBmaWx0ZXI6IFtdIH0pIHtcclxuICAgICAgICAvL2NyZWF0ZSB0aGUgdGFibGUgZWxlbWVudCAgIFxyXG4gICAgICAgIGxldCBoZWFkZXJzID0gW10sLy90aGUgaGVhZGVyc1xyXG4gICAgICAgICAgICBjb2x1bW5zID0ge30sXHJcbiAgICAgICAgICAgIGNvbHVtbkNvdW50ID0gMCxcclxuICAgICAgICAgICAgaSxcclxuICAgICAgICAgICAgdGFibGUgPSB0aGlzLmNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgICAgICAgICB7IGVsZW1lbnQ6ICdkaXYnLCBhdHRyaWJ1dGVzOiBwYXJhbXMuYXR0cmlidXRlcyB9XHJcbiAgICAgICAgICAgICk7Ly9jcmVhdGUgdGhlIHRhYmxlIFxyXG5cclxuICAgICAgICB0YWJsZS5jbGFzc0xpc3QuYWRkKCdrZWRpby10YWJsZScpOy8vYWRkIHRhYmxlIHRvIHRoZSBjbGFzc1xyXG5cclxuICAgICAgICBmb3IgKGxldCBjb250ZW50IG9mIHBhcmFtcy5jb250ZW50cykgey8vbG9vcCB0aHJvdWdoIHRoZSBqc29uIGFycmF5XHJcbiAgICAgICAgICAgIGkgPSBwYXJhbXMuY29udGVudHMuaW5kZXhPZihjb250ZW50KTsvL2dldCB0aGUgcG9zaXRpb24gb2YgdGhlIHJvd1xyXG4gICAgICAgICAgICBmb3IgKGxldCBuYW1lIGluIGNvbnRlbnQpIHsvL2xvb3AgdGhyb3VnaCB0aGUgcm93XHJcbiAgICAgICAgICAgICAgICBpZiAoaGVhZGVycy5pbmRleE9mKG5hbWUpID09IC0xKSB7Ly9hZGQgdG8gaGVhZGVyc1xyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnMucHVzaChuYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICBjb2x1bW5zW25hbWVdID0gdGFibGUubWFrZUVsZW1lbnQoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50OiAnY29sdW1uJywgYXR0cmlidXRlczogeyBjbGFzczogJ2tlZGlvLXRhYmxlLWNvbHVtbicsICdkYXRhLW5hbWUnOiBuYW1lIH0sIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudDogJ3NwYW4nLCBhdHRyaWJ1dGVzOiB7IGNsYXNzOiAna2VkaW8tdGFibGUtY29sdW1uLXRpdGxlJywgJ2RhdGEtbmFtZSc6IG5hbWUgfSwgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBlbGVtZW50OiAncCcsIGF0dHJpYnV0ZXM6IHsgY2xhc3M6ICdrZWRpby10YWJsZS1jb2x1bW4tdGl0bGUtdGV4dCcgfSwgdGV4dDogbmFtZSB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgZWxlbWVudDogJ2RpdicsIGF0dHJpYnV0ZXM6IHsgY2xhc3M6ICdrZWRpby10YWJsZS1jb2x1bW4tY29udGVudHMnIH0gfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzc2V0KHBhcmFtcy5zb3J0KSkgey8vbWFrZSBzb3J0YWJsZSBpZiBuZWVkZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uc1tuYW1lXS5maW5kKCcua2VkaW8tdGFibGUtY29sdW1uLXRpdGxlJykubWFrZUVsZW1lbnQoeyBlbGVtZW50OiAnaScsIGF0dHJpYnV0ZXM6IHsgY2xhc3M6ICdrZWRpby10YWJsZS1jb2x1bW4tdGl0bGUtc29ydCcsICdkYXRhLWljb24nOiAnZmFzLCBmYS1hcnJvdy1kb3duJyB9IH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcGFyYW1zLnByb2plY3Rpb24gPSBwYXJhbXMucHJvamVjdGlvbiB8fCB7fTtcclxuXHJcbiAgICAgICAgbGV0IGhpZGUgPSBPYmplY3QudmFsdWVzKHBhcmFtcy5wcm9qZWN0aW9uKS5pbmNsdWRlcygxKTtcclxuXHJcblxyXG4gICAgICAgIGZvciAobGV0IG5hbWUgb2YgaGVhZGVycykgey8vbG9vcCB0aHJvdWdoIHRoZSBoZWFkZXJzIGFuZCBhZGQgdGhlIGNvbnRlbnRzIFxyXG4gICAgICAgICAgICBmb3IgKGxldCBjb250ZW50IG9mIHBhcmFtcy5jb250ZW50cykge1xyXG4gICAgICAgICAgICAgICAgaSA9IHBhcmFtcy5jb250ZW50cy5pbmRleE9mKGNvbnRlbnQpO1xyXG4gICAgICAgICAgICAgICAgY29sdW1uc1tuYW1lXS5maW5kKCcua2VkaW8tdGFibGUtY29sdW1uLWNvbnRlbnRzJykubWFrZUVsZW1lbnQoeyBlbGVtZW50OiAnc3BhbicsIGF0dHJpYnV0ZXM6IHsgY2xhc3M6ICdrZWRpby10YWJsZS1jb2x1bW4tY2VsbCcsICdkYXRhLW5hbWUnOiBuYW1lLCAnZGF0YS12YWx1ZSc6IGNvbnRlbnRbbmFtZV0gfHwgJycsICdkYXRhLXJvdyc6IGkgfSwgaHRtbDogY29udGVudFtuYW1lXSB8fCAnJyB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHBhcmFtcy5wcm9qZWN0aW9uW25hbWVdID09IC0xIHx8IChoaWRlICYmICF0aGlzLmlzc2V0KHBhcmFtcy5wcm9qZWN0aW9uW25hbWVdKSkpIHtcclxuICAgICAgICAgICAgICAgIGNvbHVtbnNbbmFtZV0uY3NzKHsgZGlzcGxheTogJ25vbmUnIH0pO1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbHVtbkNvdW50Kys7Ly9jb3VudCB0aGUgY29sdW1uIGxlbmd0aFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGFibGUuY3NzKHsgZ3JpZFRlbXBsYXRlQ29sdW1uczogYHJlcGVhdCgke2NvbHVtbkNvdW50fSwgMWZyKWAgfSk7XHJcblxyXG4gICAgICAgIGxldCB0YWJsZUNvbnRhaW5lciA9IHRoaXMuY3JlYXRlRWxlbWVudCh7Ly9jcmVhdGUgdGFibGUgY29udGFpbmVyIGFuZCB0aXRsZVxyXG4gICAgICAgICAgICBlbGVtZW50OiAnZGl2JywgYXR0cmlidXRlczogeyBjbGFzczogJ2tlZGlvLXRhYmxlLWNvbnRhaW5lcicgfSwgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50OiAnc3BhbicsIGF0dHJpYnV0ZXM6IHsgY2xhc3M6ICdrZWRpby10YWJsZS10aXRsZWFuZHNlYXJjaCcgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHRhYmxlXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgbGV0IHRpdGxlQ291bnQgPSAwO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pc3NldChwYXJhbXMudGl0bGUpKSB7Ly8gY3JlYXRlIHRoZSB0aXRsZSB0ZXh0IGlmIG5lZWRlZFxyXG4gICAgICAgICAgICB0YWJsZUNvbnRhaW5lci5maW5kKCcua2VkaW8tdGFibGUtdGl0bGVhbmRzZWFyY2gnKS5tYWtlRWxlbWVudCh7IGVsZW1lbnQ6ICdoNScsIGF0dHJpYnV0ZXM6IHsgY2xhc3M6ICdrZWRpby10YWJsZS10aXRsZScgfSwgdGV4dDogcGFyYW1zLnRpdGxlIH0pO1xyXG4gICAgICAgICAgICB0aXRsZUNvdW50Kys7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5pc3NldChwYXJhbXMuc29ydCkpIHsvLyBzZXQgdGhlIGRhdGEgZm9yIHNvcnRpbmdcclxuICAgICAgICAgICAgdGFibGUuZGF0YXNldC5zb3J0ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzc2V0KHBhcmFtcy5zZWFyY2gpKSB7Ly8gY3JlYXRlIHRoZSBzZWFyY2ggYXJlYVxyXG4gICAgICAgICAgICB0YWJsZUNvbnRhaW5lci5maW5kKCcua2VkaW8tdGFibGUtdGl0bGVhbmRzZWFyY2gnKS5tYWtlRWxlbWVudCh7IGVsZW1lbnQ6ICdpbnB1dCcsIGF0dHJpYnV0ZXM6IHsgY2xhc3M6ICdrZWRpby10YWJsZS1zZWFyY2gnLCBwbGFjZUhvbGRlcjogJ1NlYXJjaCB0YWJsZS4uLicgfSB9KTtcclxuICAgICAgICAgICAgdGl0bGVDb3VudCsrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNzZXQocGFyYW1zLmZpbHRlcikpIHsvL2NyZWF0ZSB0aGUgZmlsdGVyIGFyZWFcclxuICAgICAgICAgICAgdGFibGVDb250YWluZXIuZmluZCgnLmtlZGlvLXRhYmxlLXRpdGxlYW5kc2VhcmNoJykubWFrZUVsZW1lbnQoeyBlbGVtZW50OiAnc2VsZWN0JywgYXR0cmlidXRlczogeyBjbGFzczogJ2tlZGlvLXRhYmxlLWZpbHRlcicgfSwgb3B0aW9uczogcGFyYW1zLmZpbHRlciB9KTtcclxuICAgICAgICAgICAgdGl0bGVDb3VudCsrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBhcmFtcy5jb250ZW50cy5sZW5ndGggPT0gMCkgey8vIE5vdGlmeSBpZiB0YWJsZSBpcyBlbXB0eVxyXG4gICAgICAgICAgICB0YWJsZS50ZXh0Q29udGVudCA9ICdFbXB0eSBUYWJsZSc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0YWJsZUNvbnRhaW5lci5tYWtlRWxlbWVudChcclxuICAgICAgICAgICAgW3svLyBhcnJhbmdlIHRoZSB0YWJsZSB0aXRsZVxyXG4gICAgICAgICAgICAgICAgZWxlbWVudDogJ3N0eWxlJywgdGV4dDogYFxyXG4gICAgICAgICAgICBAbWVkaWEobWluLXdpZHRoOiA3MDBweCkge1xyXG4gICAgICAgICAgICAgICAgLmtlZGlvLXRhYmxlLXRpdGxlYW5kc2VhcmNoIHtcclxuICAgICAgICAgICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoJHt0aXRsZUNvdW50fSwgMWZyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgYH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQ6ICdzdHlsZScsIHRleHQ6IGAua2VkaW8tdGFibGUtY29udGFpbmVyIHtcclxuICAgICAgICAgICAgd2lkdGg6IHZhcigtLW1hdGNoLXBhcmVudCk7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDBlbSAxZW07XHJcbiAgICAgICAgICAgIGhlaWdodDogdmFyKC0tZmlsbC1wYXJlbnQpO1xyXG4gICAgICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBncmlkO1xyXG4gICAgICAgICAgICBncmlkLXRlbXBsYXRlLXJvd3M6IG1heC1jb250ZW50IDFmcjtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIFxyXG4gICAgICAgICAgLmtlZGlvLXRhYmxlLXRpdGxlYW5kc2VhcmNoIHtcclxuICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMWVtO1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBncmlkO1xyXG4gICAgICAgICAgICBncmlkLWdhcDogMWVtO1xyXG4gICAgICAgICAgICBwYWRkaW5nOiAuNWVtO1xyXG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgICAgICAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgbGlnaHRncmF5O1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1wcmltYXJ5LWNvbG9yKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIFxyXG4gICAgICAgICAgLmtlZGlvLXRhYmxlLXRpdGxlIHtcclxuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDEwMDA7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMS41ZW07XHJcbiAgICAgICAgICAgIHRleHQtdHJhbnNmb3JtOiBjYXBpdGFsaXplO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAua2VkaW8tdGFibGUtc2VhcmNoIHtcclxuICAgICAgICAgICAganVzdGlmeS1zZWxmOiBmbGV4LWVuZDtcclxuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMTBweDtcclxuICAgICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tc2Vjb25kYXJ5LWNvbG9yKTtcclxuICAgICAgICAgICAgb3V0bGluZTogbm9uZTtcclxuICAgICAgICAgICAgcGFkZGluZzogMWVtO1xyXG4gICAgICAgICAgICB3aWR0aDogdmFyKC0tbWF0Y2gtcGFyZW50KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIFxyXG4gICAgICAgICAgLmtlZGlvLXRhYmxlLWZpbHRlciB7XHJcbiAgICAgICAgICAgIGp1c3RpZnktc2VsZjogZmxleC1lbmQ7XHJcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDEwcHg7XHJcbiAgICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLXNlY29uZGFyeS1jb2xvcik7XHJcbiAgICAgICAgICAgIG91dGxpbmU6IG5vbmU7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDFlbTtcclxuICAgICAgICAgICAgd2lkdGg6IHZhcigtLW1hdGNoLXBhcmVudCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIC5rZWRpby10YWJsZSB7XHJcbiAgICAgICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgICAgICAgICAgZm9udC1zaXplOiAxZW07XHJcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiAzMDA7XHJcbiAgICAgICAgICAgIHdpZHRoOiB2YXIoLS1tYXRjaC1wYXJlbnQpO1xyXG4gICAgICAgICAgICBncmlkLXRlbXBsYXRlLXJvd3M6IDFmcjtcclxuICAgICAgICAgICAgb3ZlcmZsb3c6IGF1dG87XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGdyaWQ7XHJcbiAgICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLXNlY29uZGFyeS1jb2xvcik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIC5rZWRpby10YWJsZSAua2VkaW8tdGFibGUtY29sdW1ue1xyXG4gICAgICAgICAgICBoZWlnaHQ6IHZhcigtLWZpbGwtcGFyZW50KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIFxyXG4gICAgICAgICAgLmtlZGlvLXRhYmxlIC5rZWRpby10YWJsZS1jb2x1bW4tdGl0bGUge1xyXG4gICAgICAgICAgICBwb3NpdGlvbjogc3RpY2t5O1xyXG4gICAgICAgICAgICB0b3A6IDA7XHJcbiAgICAgICAgICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXNlY29uZGFyeS1jb2xvcik7XHJcbiAgICAgICAgICAgIGNvbG9yOiB2YXIoLS1wcmltYXJ5LWNvbG9yKTtcclxuICAgICAgICAgICAgd2lkdGg6IHZhcigtLW1hdGNoLXBhcmVudCk7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGdyaWQ7XHJcbiAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDIsIG1heC1jb250ZW50KTtcclxuICAgICAgICAgICAgZ2FwOiAuNWVtO1xyXG4gICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgICAgICAgICAgcGFkZGluZzogLjVlbTtcclxuICAgICAgICAgICAgei1pbmRleDogMTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIFxyXG4gICAgICAgICAgLmtlZGlvLXRhYmxlIC5rZWRpby10YWJsZS1jb2x1bW4tdGl0bGUtdGV4dHtcclxuICAgICAgICAgICAgY29sb3I6IGluaGVyaXQ7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xyXG4gICAgICAgICAgICBmb250LXNpemU6IGluaGVyaXQ7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIC5rZWRpby10YWJsZSAua2VkaW8tdGFibGUtY29sdW1uLXRpdGxlLXNvcnR7XHJcbiAgICAgICAgICAgIGNvbG9yOiBpbmhlcml0O1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcclxuICAgICAgICAgICAgZm9udC1zaXplOiBpbmhlcml0O1xyXG4gICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IG5vbmU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIC5rZWRpby10YWJsZSAua2VkaW8tdGFibGUtY29sdW1uLWNvbnRlbnRze1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBncmlkO1xyXG4gICAgICAgICAgICBnYXA6IC4yZW07XHJcbiAgICAgICAgICAgIHdpZHRoOiB2YXIoLS1tYXRjaC1wYXJlbnQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAua2VkaW8tdGFibGUgLmtlZGlvLXRhYmxlLWNvbHVtbi1jZWxse1xyXG4gICAgICAgICAgICBtaW4td2lkdGg6IG1heC1jb250ZW50O1xyXG4gICAgICAgICAgICB3aWR0aDogdmFyKC0tbWF0Y2gtcGFyZW50KTtcclxuICAgICAgICAgICAgcGFkZGluZzogLjVlbTtcclxuICAgICAgICAgICAgbWluLWhlaWdodDogMjBweDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIFxyXG4gICAgICAgICAgLmtlZGlvLXRhYmxlIC5rZWRpby10YWJsZS1jb2x1bW4tY2VsbDpudGgtY2hpbGQob2RkKSB7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXByaW1hcnktY29sb3IpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAua2VkaW8tdGFibGUgLmtlZGlvLXRhYmxlLWNvbHVtbi1jZWxsOm50aC1jaGlsZChldmVuKSB7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWxpZ2h0ZXItc2Vjb25kYXJ5LWNvbG9yKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIFxyXG4gICAgICAgICAgLmtlZGlvLXRhYmxlIGlucHV0IHtcclxuICAgICAgICAgICAgd2lkdGg6IGluaGVyaXQ7XHJcbiAgICAgICAgICAgIGhlaWdodDogaW5oZXJpdDtcclxuICAgICAgICAgICAgdGV4dC10cmFuc2Zvcm06IGluaGVyaXQ7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogaW5oZXJpdDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIFxyXG4gICAgICAgICAgLmtlZGlvLXRhYmxlIGltZyB7XHJcbiAgICAgICAgICAgIHdpZHRoOiAyMHB4O1xyXG4gICAgICAgICAgICBoZWlnaHQ6IGF1dG87XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIC5rZWRpby10YWJsZSBhOnZpc2l0ZWQge1xyXG4gICAgICAgICAgICBjb2xvcjogdmFyKC0tYWNjaWVudC1jb2xvcik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIC5rZWRpby10YWJsZS1jZWxsIGEge1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBibG9jaztcclxuICAgICAgICAgICAgd2lkdGg6IHZhcigtLWZpbGwtcGFyZW50KTtcclxuICAgICAgICAgICAgaGVpZ2h0OiB2YXIoLS1maWxsLXBhcmVudCk7XHJcbiAgICAgICAgICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcclxuICAgICAgICAgICAgY29sb3I6IHZhcigtLWFjY2llbnQtY29sb3IpO1xyXG4gICAgICAgICAgICBmb250LXNpemU6IDFlbTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIFxyXG4gICAgICAgICAgLmtlZGlvLXRhYmxlLWNlbGwgYTpob3ZlciB7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWxpZ2h0LXByaW1hcnktY29sb3IpO1xyXG4gICAgICAgICAgICBjb2xvcjogdmFyKC0tbGlnaHQtc2Vjb25kYXJ5LWNvbG9yKTtcclxuICAgICAgICAgICAgdHJhbnNpdGlvbi1kdXJhdGlvbjogLjRzO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAua2VkaW8tdGFibGUgLmtlZGlvLXRhYmxlLWNvbHVtbi1jZWxsLmtlZGlvLXRhYmxlLXNlbGVjdGVkLXJvdyB7XHJcbiAgICAgICAgICAgIGNvbG9yOiB2YXIoLS1hY2NpZW50LWNvbG9yKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIFxyXG4gICAgICAgICAgLmtlZGlvLXRhYmxlLW9wdGlvbnMge1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcclxuICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYWNjaWVudC1jb2xvcik7XHJcbiAgICAgICAgICAgIGNvbG9yOiB2YXIoLS1zZWNvbmRhcnktY29sb3IpO1xyXG4gICAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICAgICAgICAgIGxlZnQ6IDA7XHJcbiAgICAgICAgICAgIHRvcDogMDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIFxyXG4gICAgICAgICAgLmtlZGlvLXRhYmxlLW9wdGlvbnMgLmtlZGlvLXRhYmxlLW9wdGlvbiB7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IC41ZW07XHJcbiAgICAgICAgICAgIGNvbG9yOiBpbmhlcml0O1xyXG4gICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAgICAgICAgIGhlaWdodDogMjBweDtcclxuICAgICAgICAgICAgd2lkdGg6IDIwcHg7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIC5rZWRpby10YWJsZS1vcHRpb246aG92ZXIge1xyXG4gICAgICAgICAgICBjb2xvcjogdmFyKC0tcHJpbWFyeS1jb2xvcik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBgfV0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdGFibGVDb250YWluZXI7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VGFibGVEYXRhKHRhYmxlKSB7XHJcbiAgICAgICAgbGV0IGRhdGEgPSBbXTtcclxuICAgICAgICBsZXQgY2VsbHMgPSB0YWJsZS5maW5kQWxsKCcua2VkaW8tdGFibGUtY29sdW1uLWNlbGwnKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjZWxscy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgeyBuYW1lLCB2YWx1ZSwgcm93IH0gPSBjZWxsc1tpXS5kYXRhc2V0O1xyXG4gICAgICAgICAgICBkYXRhW3Jvd10gPSBkYXRhW3Jvd10gfHwge307XHJcbiAgICAgICAgICAgIGRhdGFbcm93XVtuYW1lXSA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgc29ydFRhYmxlKHRhYmxlLCBieSA9ICcnLCBkaXJlY3Rpb24gPSAxKSB7XHJcbiAgICAgICAgbGV0IGRhdGEgPSB0aGlzLmdldFRhYmxlRGF0YSh0YWJsZSk7XHJcblxyXG4gICAgICAgIGRhdGEuc29ydCgoYSwgYikgPT4ge1xyXG4gICAgICAgICAgICBhID0gYVtieV07XHJcbiAgICAgICAgICAgIGIgPSBiW2J5XTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzTnVtYmVyKGEpICYmIHRoaXMuaXNOdW1iZXIoYikpIHtcclxuICAgICAgICAgICAgICAgIGEgPSBhIC8gMTtcclxuICAgICAgICAgICAgICAgIGIgPSBiIC8gMTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGRpcmVjdGlvbiA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYSA+IGIgPyAxIDogLTE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYSA+IGIgPyAtMSA6IDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBsaXN0ZW5UYWJsZShwYXJhbXMgPSB7IHRhYmxlOiB7fSwgb3B0aW9uczogW10gfSwgY2FsbGJhY2tzID0geyBjbGljazogKCkgPT4geyB9LCBmaWx0ZXI6ICgpID0+IHsgfSB9KSB7XHJcbiAgICAgICAgcGFyYW1zLm9wdGlvbnMgPSBwYXJhbXMub3B0aW9ucyB8fCBbXTtcclxuICAgICAgICBjYWxsYmFja3MgPSBjYWxsYmFja3MgfHwgW107XHJcbiAgICAgICAgbGV0IHRhYmxlID0gcGFyYW1zLnRhYmxlLmZpbmQoJy5rZWRpby10YWJsZScpO1xyXG5cclxuICAgICAgICBsZXQgb3B0aW9ucyA9IHRoaXMuY3JlYXRlRWxlbWVudCh7XHJcbiAgICAgICAgICAgIGVsZW1lbnQ6ICdzcGFuJywgYXR0cmlidXRlczogeyBjbGFzczogJ2tlZGlvLXRhYmxlLW9wdGlvbnMnIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgbGV0IGxpc3QgPSB7XHJcbiAgICAgICAgICAgIHZpZXc6ICdmYXMgZmEtZXllJyxcclxuICAgICAgICAgICAgZGVsZXRlOiAnZmFzIGZhLXRyYXNoJyxcclxuICAgICAgICAgICAgZWRpdDogJ2ZhcyBmYS1wZW4nLFxyXG4gICAgICAgICAgICByZXZlcnQ6ICdmYXMgZmEtaGlzdG9yeSdcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBvcHRpb25DbGFzcztcclxuICAgICAgICBmb3IgKGxldCBvcHRpb24gb2YgcGFyYW1zLm9wdGlvbnMpIHtcclxuICAgICAgICAgICAgb3B0aW9uQ2xhc3MgPSBsaXN0W29wdGlvbl0gfHwgYGZhcyBmYS0ke29wdGlvbn1gO1xyXG4gICAgICAgICAgICBsZXQgYW5PcHRpb24gPSBvcHRpb25zLm1ha2VFbGVtZW50KHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQ6ICdpJywgYXR0cmlidXRlczogeyBjbGFzczogb3B0aW9uQ2xhc3MgKyAnIGtlZGlvLXRhYmxlLW9wdGlvbicsIGlkOiAna2VkaW8tdGFibGUtb3B0aW9uLScgKyBvcHRpb24gfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCB0YWJsZVRpdGxlcyA9IHRhYmxlLmZpbmRBbGwoJy5rZWRpby10YWJsZS1jb2x1bW4tdGl0bGUnKTtcclxuICAgICAgICBsZXQgdGFibGVDb2x1bW5zID0gdGFibGUuZmluZEFsbCgnLmtlZGlvLXRhYmxlLWNvbHVtbicpO1xyXG4gICAgICAgIGxldCByb3dzID0gW107XHJcbiAgICAgICAgbGV0IGZpcnN0Q29sdW1uID0gdGFibGVDb2x1bW5zWzBdO1xyXG4gICAgICAgIGxldCBmaXJzdFZpc2libGVDb2x1bW47XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzbnVsbChmaXJzdENvbHVtbikpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YWJsZUNvbHVtbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHRhYmxlQ29sdW1uc1tpXS5jc3MoKS5kaXNwbGF5ICE9ICdub25lJykge1xyXG4gICAgICAgICAgICAgICAgZmlyc3RWaXNpYmxlQ29sdW1uID0gdGFibGVDb2x1bW5zW2ldO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBmaXJzdENlbGxzID0gZmlyc3RDb2x1bW4uZmluZEFsbCgnLmtlZGlvLXRhYmxlLWNvbHVtbi1jZWxsJyk7XHJcbiAgICAgICAgbGV0IGZpcnN0VmlzaWJsZUNlbGxzID0gZmlyc3RWaXNpYmxlQ29sdW1uLmZpbmRBbGwoJy5rZWRpby10YWJsZS1jb2x1bW4tY2VsbCcpO1xyXG5cclxuICAgICAgICBsZXQgdGFibGVSb3c7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmlyc3RDZWxscy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICByb3dzLnB1c2goZmlyc3RDZWxsc1tpXS5kYXRhc2V0LnJvdyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocGFyYW1zLnRhYmxlLmZpbmQoJy5rZWRpby10YWJsZScpLmRhdGFzZXQuc29ydCA9PSAndHJ1ZScpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YWJsZVRpdGxlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGFibGVUaXRsZXNbaV0uYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0YWJsZVRpdGxlc1tpXS5maW5kKCcua2VkaW8tdGFibGUtY29sdW1uLXRpdGxlLXNvcnQnKS5jc3MoeyBkaXNwbGF5OiAndW5zZXQnIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGFibGVUaXRsZXNbaV0uYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0YWJsZVRpdGxlc1tpXS5maW5kKCcua2VkaW8tdGFibGUtY29sdW1uLXRpdGxlLXNvcnQnKS5jc3MoeyBkaXNwbGF5OiAnbm9uZScgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICB0YWJsZVRpdGxlc1tpXS5maW5kKCcua2VkaW8tdGFibGUtY29sdW1uLXRpdGxlLXNvcnQnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZGlyZWN0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIHRhYmxlVGl0bGVzW2ldLmZpbmQoJy5rZWRpby10YWJsZS1jb2x1bW4tdGl0bGUtc29ydCcpLnRvZ2dsZUNsYXNzZXMoJ2ZhcywgZmEtYXJyb3ctdXAnKTtcclxuICAgICAgICAgICAgICAgICAgICB0YWJsZVRpdGxlc1tpXS5maW5kKCcua2VkaW8tdGFibGUtY29sdW1uLXRpdGxlLXNvcnQnKS50b2dnbGVDbGFzc2VzKCdmYXMsIGZhLWFycm93LWRvd24nKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGFibGVUaXRsZXNbaV0uZmluZCgnLmtlZGlvLXRhYmxlLWNvbHVtbi10aXRsZS1zb3J0JykuZGF0YXNldC5kaXJlY3Rpb24gPT0gJ3VwJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YWJsZVRpdGxlc1tpXS5maW5kKCcua2VkaW8tdGFibGUtY29sdW1uLXRpdGxlLXNvcnQnKS5kYXRhc2V0LmRpcmVjdGlvbiA9ICdkb3duJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uID0gMTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhYmxlVGl0bGVzW2ldLmZpbmQoJy5rZWRpby10YWJsZS1jb2x1bW4tdGl0bGUtc29ydCcpLmRhdGFzZXQuZGlyZWN0aW9uID0gJ3VwJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uID0gLTE7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgdGV4dCA9IHRhYmxlVGl0bGVzW2ldLmZpbmQoJy5rZWRpby10YWJsZS1jb2x1bW4tdGl0bGUtdGV4dCcpLnRleHRDb250ZW50O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgZGF0YSA9IHRoaXMuc29ydFRhYmxlKHBhcmFtcy50YWJsZS5maW5kKCcua2VkaW8tdGFibGUnKSwgdGV4dCwgZGlyZWN0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbmV3VGFibGUgPSB0aGlzLmNyZWF0ZVRhYmxlKHsgY29udGVudHM6IGRhdGEgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBuZXdUYWJsZUNvbHVtbnMgPSBuZXdUYWJsZS5maW5kQWxsKCcua2VkaW8tdGFibGUtY29sdW1uJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBuZXdUYWJsZUNvbHVtbnMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFibGVDb2x1bW5zW2pdLmZpbmQoJy5rZWRpby10YWJsZS1jb2x1bW4tY29udGVudHMnKS5pbm5lckhUTUwgPSBuZXdUYWJsZUNvbHVtbnNbal0uZmluZCgnLmtlZGlvLXRhYmxlLWNvbHVtbi1jb250ZW50cycpLmlubmVySFRNTDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRhYmxlQ29sdW1ucyA9IHRhYmxlLmZpbmRBbGwoJy5rZWRpby10YWJsZS1jb2x1bW4nKTtcclxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXIoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXRoaXMuaXNudWxsKHBhcmFtcy50YWJsZS5maW5kKCcua2VkaW8tdGFibGUtc2VhcmNoJykpKSB7XHJcbiAgICAgICAgICAgIHBhcmFtcy50YWJsZS5maW5kKCcua2VkaW8tdGFibGUtc2VhcmNoJykub25DaGFuZ2VkKHZhbHVlID0+IHtcclxuICAgICAgICAgICAgICAgIGZpbHRlcigpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5pc251bGwocGFyYW1zLnRhYmxlLmZpbmQoJy5rZWRpby10YWJsZS1maWx0ZXInKSkpIHtcclxuICAgICAgICAgICAgcGFyYW1zLnRhYmxlLmZpbmQoJy5rZWRpby10YWJsZS1maWx0ZXInKS5vbkNoYW5nZWQodmFsdWUgPT4ge1xyXG4gICAgICAgICAgICAgICAgZmlsdGVyKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHNlYXJjaFZhbHVlLCBmaWx0ZXJWYWx1ZTtcclxuXHJcbiAgICAgICAgbGV0IGZpbHRlciA9ICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmlzbnVsbChwYXJhbXMudGFibGUuZmluZCgnLmtlZGlvLXRhYmxlLXNlYXJjaCcpKSkge1xyXG4gICAgICAgICAgICAgICAgc2VhcmNoVmFsdWUgPSBwYXJhbXMudGFibGUuZmluZCgnLmtlZGlvLXRhYmxlLXNlYXJjaCcpLnZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNudWxsKHBhcmFtcy50YWJsZS5maW5kKCcua2VkaW8tdGFibGUtZmlsdGVyJykpKSB7XHJcbiAgICAgICAgICAgICAgICBmaWx0ZXJWYWx1ZSA9IHBhcmFtcy50YWJsZS5maW5kKCcua2VkaW8tdGFibGUtZmlsdGVyJykudmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm93cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IGhpZGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRhYmxlUm93ID0gdGFibGUuZmluZEFsbChgLmtlZGlvLXRhYmxlLWNvbHVtbi1jZWxsW2RhdGEtcm93PVwiJHtpfVwiXWApO1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGFibGVSb3cubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB0YWJsZVJvd1tqXS5jc3NSZW1vdmUoWydkaXNwbGF5J10pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzc2V0KGZpbHRlclZhbHVlKSAmJiBoaWRlID09IGZhbHNlICYmIHRoaXMuaXNzZXQoY2FsbGJhY2tzLmZpbHRlcikpIHtcclxuICAgICAgICAgICAgICAgICAgICBoaWRlID0gY2FsbGJhY2tzLmZpbHRlcihmaWx0ZXJWYWx1ZSwgdGFibGVSb3cpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzc2V0KHNlYXJjaFZhbHVlKSAmJiBoaWRlID09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaGlkZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0YWJsZVJvdy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFibGVSb3dbal0udGV4dENvbnRlbnQudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhzZWFyY2hWYWx1ZS50b0xvd2VyQ2FzZSgpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGlkZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGhpZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRhYmxlUm93Lmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhYmxlUm93W2pdLmNzcyh7IGRpc3BsYXk6ICdub25lJyB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzc2V0KGNhbGxiYWNrcy5jbGljaykpIHtcclxuICAgICAgICAgICAgdGFibGUuYWRkTXVsdGlwbGVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24sIHRvdWNoc3RhcnQnLCBldmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgICAgICAgICAgICAgaWYgKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2tlZGlvLXRhYmxlLW9wdGlvbicpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNzZXQoY2FsbGJhY2tzLmNsaWNrKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3MuY2xpY2soZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2tlZGlvLXRhYmxlLWNvbHVtbi1jZWxsJykgfHwgIXRoaXMuaXNudWxsKHRhcmdldC5nZXRQYXJlbnRzKCcua2VkaW8tdGFibGUtY29sdW1uLWNlbGwnKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2tlZGlvLXRhYmxlLWNvbHVtbi1jZWxsJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0LmdldFBhcmVudHMoJy5rZWRpby10YWJsZS1jb2x1bW4tY2VsbCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBsZXQgcG9zaXRpb24gPSB0YXJnZXQuZGF0YXNldC5yb3c7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlyc3RWaXNpYmxlQ2VsbHNbcG9zaXRpb25dLmNzcyh7IHBvc2l0aW9uOiAncmVsYXRpdmUnIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGZpcnN0VmlzaWJsZUNlbGxzW3Bvc2l0aW9uXS5hcHBlbmQob3B0aW9ucyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJhbXMudGFibGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdrZWRpby1zZWxlY3RhYmxlJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJvdyA9IHRhYmxlLmZpbmRBbGwoYC5rZWRpby10YWJsZS1jb2x1bW4tY2VsbFtkYXRhLXJvdz1cIiR7cG9zaXRpb259XCJdYCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm93Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dbaV0uY2xhc3NMaXN0LnRvZ2dsZSgna2VkaW8tdGFibGUtc2VsZWN0ZWQtcm93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5yZW1vdmUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygna2VkaW8tdGFibGUtc2VsZWN0ZWQtcm93JykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaXJzdENvbHVtbi5maW5kQWxsKCcua2VkaW8tdGFibGUtc2VsZWN0ZWQtcm93JykubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXMudGFibGUuY2xhc3NMaXN0LnJlbW92ZSgna2VkaW8tc2VsZWN0YWJsZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRhYmxlLnByZXNzZWQoZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRhcmdldCA9IGV2ZW50LnRhcmdldDtcclxuICAgICAgICAgICAgICAgIGlmIChldmVudC5kdXJhdGlvbiA+IDMwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdrZWRpby10YWJsZS1jb2x1bW4tY2VsbCcpIHx8ICF0aGlzLmlzbnVsbCh0YXJnZXQuZ2V0UGFyZW50cygnLmtlZGlvLXRhYmxlLWNvbHVtbi1jZWxsJykpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygna2VkaW8tdGFibGUtY29sdW1uLWNlbGwnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0LmdldFBhcmVudHMoJy5rZWRpby10YWJsZS1jb2x1bW4tY2VsbCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwb3NpdGlvbiA9IHRhcmdldC5kYXRhc2V0LnJvdztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaXJzdENvbHVtbi5maW5kQWxsKCcua2VkaW8tdGFibGUtc2VsZWN0ZWQtcm93JykubGVuZ3RoID09IDAgJiYgIXBhcmFtcy50YWJsZS5jbGFzc0xpc3QuY29udGFpbnMoJ2tlZGlvLXNlbGVjdGFibGUnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zLnRhYmxlLmNsYXNzTGlzdC5hZGQoJ2tlZGlvLXNlbGVjdGFibGUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByb3cgPSB0YWJsZS5maW5kQWxsKGAua2VkaW8tdGFibGUtY29sdW1uLWNlbGxbZGF0YS1yb3c9XCIke3Bvc2l0aW9ufVwiXWApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3cubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dbaV0uY2xhc3NMaXN0LmFkZCgna2VkaW8tdGFibGUtc2VsZWN0ZWQtcm93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlRm9ybShwYXJhbXMgPSB7IGVsZW1lbnQ6ICcnLCB0aXRsZTogJycsIGNvbHVtbnM6IDEsIGNvbnRlbnRzOiB7fSwgcmVxdWlyZWQ6IFtdLCBidXR0b25zOiB7fSB9KSB7XHJcbiAgICAgICAgbGV0IGZvcm0gPSB0aGlzLmNyZWF0ZUVsZW1lbnQoe1xyXG4gICAgICAgICAgICBlbGVtZW50OiBwYXJhbXMuZWxlbWVudCB8fCAnZm9ybScsIGF0dHJpYnV0ZXM6IHBhcmFtcy5hdHRyaWJ1dGVzLCBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgICAgeyBlbGVtZW50OiAnaDMnLCBhdHRyaWJ1dGVzOiB7IGNsYXNzOiAna2VkaW8tZm9ybS10aXRsZScgfSwgdGV4dDogcGFyYW1zLnRpdGxlIH0sXHJcbiAgICAgICAgICAgICAgICB7IGVsZW1lbnQ6ICdzZWN0aW9uJywgYXR0cmlidXRlczogeyBjbGFzczogJ2tlZGlvLWZvcm0tY29udGVudHMnLCBzdHlsZTogeyBncmlkVGVtcGxhdGVDb2x1bW5zOiBgcmVwZWF0KCR7cGFyYW1zLmNvbHVtbnN9LCAxZnIpYCB9IH0gfSxcclxuICAgICAgICAgICAgICAgIHsgZWxlbWVudDogJ3NlY3Rpb24nLCBhdHRyaWJ1dGVzOiB7IGNsYXNzOiAna2VkaW8tZm9ybS1idXR0b25zJyB9IH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudDogJ3N0eWxlJywgdGV4dDogYC5rZWRpby1mb3JtIHtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICAgICAgICAgICAgICAgICAganVzdGlmeS1zZWxmOiBjZW50ZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxpZ24tc2VsZjogY2VudGVyO1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGdyaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3JpZC1yb3ctZ2FwOiAxZW07XHJcbiAgICAgICAgICAgICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiByZXBlYXQoNCwgbWluLWNvbnRlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiB2YXIoLS1tYXRjaC1wYXJlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIG1heC13aWR0aDogNzAwcHg7XHJcbiAgICAgICAgICAgICAgICAgICAgbWFyZ2luOiAyZW07XHJcbiAgICAgICAgICAgICAgICAgICAgYm94LXNoYWRvdzogMCAxNHB4IDI4cHggcmdiYSgwLDAsMCwwLjI1KSwgMCAxMHB4IDEwcHggcmdiYSgwLDAsMCwwLjIyKTtcclxuICAgICAgICAgICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1zZWNvbmRhcnktY29sb3IpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAua2VkaW8tZm9ybS10aXRsZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDMwMDtcclxuICAgICAgICAgICAgICAgICAgICBsZXR0ZXItc3BhY2luZzogLjA1ZW07XHJcbiAgICAgICAgICAgICAgICAgICAgZm9udC1zaXplOiAxLjJlbTtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tc2Vjb25kYXJ5LWNvbG9yKTtcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogdmFyKC0tcHJpbWFyeS1jb2xvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogMWVtO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAua2VkaW8tZm9ybS1jb250ZW50c3tcclxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBncmlkO1xyXG4gICAgICAgICAgICAgICAgICAgIGdyaWQtZ2FwOiAxZW07XHJcbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogMWVtO1xyXG4gICAgICAgICAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBzdGFydDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLmtlZGlvLWZvcm0tYnV0dG9uc3tcclxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBncmlkO1xyXG4gICAgICAgICAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyO1xyXG4gICAgICAgICAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gICAgICAgICAgICAgICAgICAgIGFsaWduLWNvbnRlbnQ6IGNlbnRlcjtcclxuICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAxZW07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC5rZWRpby1mb3JtLWJ1dHRvbnMgYnV0dG9ue1xyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiB2YXIoLS1maWxsLXBhcmVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMjBweDtcclxuICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAxZW07XHJcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tc2Vjb25kYXJ5LWNvbG9yKTtcclxuICAgICAgICAgICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tc2Vjb25kYXJ5LWNvbG9yKTtcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogdmFyKC0tcHJpbWFyeS1jb2xvcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC5rZWRpby1mb3JtLXNpbmdsZS1jb250ZW50e1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGdyaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogLjVlbTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLmtlZGlvLWZvcm0tbGFiZWwge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAjNjY2NjY2O1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQtdHJhbnNmb3JtOiBjYXBpdGFsaXplO1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQtYWxpZ246IGp1c3RpZnk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC5rZWRpby1mb3JtLW5vdGV7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICM5OTk5OTk7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9udC1zaXplOiAuN2VtO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAua2VkaW8tZm9ybS1kYXRhe1xyXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLXNlY29uZGFyeS1jb2xvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogLjdlbSAuM2VtO1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQtYWxpZ246IGp1c3RpZnk7XHJcbiAgICAgICAgICAgICAgICAgICAgbWluLXdpZHRoOiB1bnNldDtcclxuICAgICAgICAgICAgICAgICAgICBib3JkZXItcmFkaXVzOiAyMHB4O1xyXG4gICAgICAgICAgICAgICAgICAgIG91dGxpbmU6IG5vbmU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC5rZWRpby1mb3JtLWRhdGE6Zm9jdXMge1xyXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlci1jb2xvcjogdmFyKC0tc2Vjb25kYXJ5LWNvbG9yKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLmtlZGlvLWZvcm0tcm93e1xyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBncmlkO1xyXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLXNlY29uZGFyeS1jb2xvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3JpZC1nYXA6IC41ZW07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC5rZWRpby1mb3JtLXJvdy1jb250ZW50c3tcclxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBncmlkO1xyXG4gICAgICAgICAgICAgICAgICAgIGdyaWQtZ2FwOiAuNWVtO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAua2VkaW8tZm9ybSAuY2VsbC1sYWJlbHtcclxuICAgICAgICAgICAgICAgICAgICBmb250LXNpemU6IC45ZW07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC5rZWRpby1mb3JtIC5jZWxsLWRhdGF7XHJcbiAgICAgICAgICAgICAgICAgICAgb3V0bGluZTogbm9uZTtcclxuICAgICAgICAgICAgICAgICAgICBib3JkZXI6IG5vbmU7XHJcbiAgICAgICAgICAgICAgICAgICAgbWluLWhlaWdodDogMjBweDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLmtlZGlvLWZvcm0tZXJyb3J7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogbm9uZTtcclxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1hY2NpZW50LWNvbG9yKTtcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogdmFyKC0tc2Vjb25kYXJ5LWNvbG9yKTtcclxuICAgICAgICAgICAgICAgICAgICBmb250LXNpemU6IC44ZW07XHJcbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogLjVlbTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgQG1lZGlhKG1pbi13aWR0aDogNzAwcHgpIHtcclxuICAgICAgICAgICAgICAgICAgICAua2VkaW8tZm9ybSAjcmVtZW1iZXItbWUge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogMjBweDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAyMHB4O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1gfVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGZvcm0uY2xhc3NMaXN0LmFkZCgna2VkaW8tZm9ybScpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pc3NldChwYXJhbXMucGFyZW50KSkgcGFyYW1zLnBhcmVudC5hcHBlbmQoZm9ybSk7XHJcbiAgICAgICAgbGV0IG5vdGU7XHJcbiAgICAgICAgbGV0IGZvcm1Db250ZW50cyA9IGZvcm0uZmluZCgnLmtlZGlvLWZvcm0tY29udGVudHMnKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQga2V5IGluIHBhcmFtcy5jb250ZW50cykge1xyXG4gICAgICAgICAgICBub3RlID0gKHRoaXMuaXNzZXQocGFyYW1zLmNvbnRlbnRzW2tleV0ubm90ZSkpID8gYCgke3BhcmFtcy5jb250ZW50c1trZXldLm5vdGV9KWAgOiAnJztcclxuICAgICAgICAgICAgbGV0IGxhYmxlVGV4dCA9IHBhcmFtcy5jb250ZW50c1trZXldLmxhYmVsIHx8IHRoaXMuY2FtZWxDYXNlZFRvVGV4dChrZXkpLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgIGxldCBibG9jayA9IGZvcm1Db250ZW50cy5tYWtlRWxlbWVudCh7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50OiAnZGl2JywgYXR0cmlidXRlczogeyBjbGFzczogJ2tlZGlvLWZvcm0tc2luZ2xlLWNvbnRlbnQnIH0sIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgeyBlbGVtZW50OiAnbGFiZWwnLCBodG1sOiBsYWJsZVRleHQsIGF0dHJpYnV0ZXM6IHsgY2xhc3M6ICdrZWRpby1mb3JtLWxhYmVsJywgZm9yOiBrZXkudG9Mb3dlckNhc2UoKSB9IH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgZGF0YSA9IGJsb2NrLm1ha2VFbGVtZW50KHBhcmFtcy5jb250ZW50c1trZXldKTtcclxuICAgICAgICAgICAgZGF0YS5jbGFzc0xpc3QuYWRkKCdrZWRpby1mb3JtLWRhdGEnKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNzZXQocGFyYW1zLmNvbnRlbnRzW2tleV0ubm90ZSkpIGJsb2NrLm1ha2VFbGVtZW50KHsgZWxlbWVudDogJ3NwYW4nLCB0ZXh0OiBwYXJhbXMuY29udGVudHNba2V5XS5ub3RlLCBhdHRyaWJ1dGVzOiB7IGNsYXNzOiAna2VkaW8tZm9ybS1ub3RlJyB9IH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNzZXQocGFyYW1zLnJlcXVpcmVkKSAmJiBwYXJhbXMucmVxdWlyZWQuaW5jbHVkZXMoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgZGF0YS5yZXF1aXJlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IGtleSBpbiBwYXJhbXMuYnV0dG9ucykge1xyXG4gICAgICAgICAgICBmb3JtLmZpbmQoJy5rZWRpby1mb3JtLWJ1dHRvbnMnKS5tYWtlRWxlbWVudChwYXJhbXMuYnV0dG9uc1trZXldKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvcm0ubWFrZUVsZW1lbnQoeyBlbGVtZW50OiAnc3BhbicsIGF0dHJpYnV0ZXM6IHsgY2xhc3M6ICdrZWRpby1mb3JtLWVycm9yJyB9LCBzdGF0ZTogeyBuYW1lOiAnZXJyb3InLCBvd25lcjogYCMke2Zvcm0uaWR9YCB9IH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gZm9ybTtcclxuICAgIH1cclxuXHJcbiAgICBwaWNrZXIocGFyYW1zID0geyB0aXRsZTogJycsIGNvbnRlbnRzOiBbXSB9LCBjYWxsYmFjayA9IChldmVudCkgPT4geyB9KSB7XHJcbiAgICAgICAgbGV0IHBpY2tlciA9IHRoaXMuY3JlYXRlRWxlbWVudCh7XHJcbiAgICAgICAgICAgIGVsZW1lbnQ6ICdkaXYnLCBhdHRyaWJ1dGVzOiB7IGNsYXNzOiAna2VkaW8tcGlja2VyJyB9LCBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgICAgeyBlbGVtZW50OiAnaDMnLCBhdHRyaWJ1dGVzOiB7IGNsYXNzOiAna2VkaW8tcGlja2VyLXRpdGxlJyB9LCB0ZXh0OiBwYXJhbXMudGl0bGUgfHwgJycgfSxcclxuICAgICAgICAgICAgICAgIHsgZWxlbWVudDogJ2RpdicsIGF0dHJpYnV0ZXM6IHsgY2xhc3M6ICdrZWRpby1waWNrZXItY29udGVudHMnIH0gfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50OiAnc3R5bGUnLCB0ZXh0OiBgLmtlZGlvLXBpY2tlciB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogZ3JpZDtcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHZhcigtLWZpbGwtcGFyZW50KTtcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogdmFyKC0tZmlsbC1wYXJlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtcm93czogbWF4LWNvbnRlbnQgMWZyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAua2VkaW8tcGlja2VyLWNvbnRlbnRzIHtcclxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBibG9jaztcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHZhcigtLWZpbGwtcGFyZW50KTtcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogdmFyKC0tZmlsbC1wYXJlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAua2VkaW8tcGlja2VyLXNpbmdsZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogMmVtO1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICAgICAgICAgICAgICAgICAgICBtYXJnaW46IDFlbTtcclxuICAgICAgICAgICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1zZWNvbmRhcnktY29sb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIG1hcmdpbjogMWVtO1xyXG4gICAgICAgICAgICAgICAgfWB9XHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgY29udGVudCBvZiBwYXJhbXMuY29udGVudHMpIHtcclxuICAgICAgICAgICAgcGlja2VyLmZpbmQoJy5rZWRpby1waWNrZXItY29udGVudHMnKS5tYWtlRWxlbWVudCh7IGVsZW1lbnQ6ICdzcGFuJywgYXR0cmlidXRlczogeyBjbGFzczogJ2tlZGlvLXBpY2tlci1zaW5nbGUnLCAnZGF0YS1uYW1lJzogY29udGVudCB9LCB0ZXh0OiBjb250ZW50IH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcGlja2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2RibGNsaWNrJywgZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygna2VkaW8tcGlja2VyLXNpbmdsZScpKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhldmVudC50YXJnZXQuZGF0YXNldC5uYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gcGlja2VyO1xyXG4gICAgfVxyXG5cclxuICAgIHBvcFVwKGNvbnRlbnQsIHBhcmFtcyA9IHsgdGl0bGU6ICcnLCBhdHRyaWJ1dGVzOiB7fSB9KSB7XHJcbiAgICAgICAgbGV0IGNvbnRhaW5lciA9IHBhcmFtcy5jb250YWluZXIgfHwgZG9jdW1lbnQuYm9keTtcclxuICAgICAgICBsZXQgdGl0bGUgPSBwYXJhbXMudGl0bGUgfHwgJyc7XHJcblxyXG4gICAgICAgIHBhcmFtcy5hdHRyaWJ1dGVzID0gcGFyYW1zLmF0dHJpYnV0ZXMgfHwge307XHJcbiAgICAgICAgcGFyYW1zLmF0dHJpYnV0ZXMuc3R5bGUgPSBwYXJhbXMuYXR0cmlidXRlcy5zdHlsZSB8fCB7fTtcclxuICAgICAgICBwYXJhbXMuYXR0cmlidXRlcy5zdHlsZS53aWR0aCA9IHBhcmFtcy5hdHRyaWJ1dGVzLnN0eWxlLndpZHRoIHx8ICc1MHZ3JztcclxuICAgICAgICBwYXJhbXMuYXR0cmlidXRlcy5zdHlsZS5oZWlnaHQgPSBwYXJhbXMuYXR0cmlidXRlcy5zdHlsZS5oZWlnaHQgfHwgJzUwdmgnO1xyXG5cclxuICAgICAgICBsZXQgcG9wVXAgPSB0aGlzLmNyZWF0ZUVsZW1lbnQoe1xyXG4gICAgICAgICAgICBlbGVtZW50OiAnZGl2JywgYXR0cmlidXRlczogeyBjbGFzczogJ2tlZGlvLXBvcC11cCcgfSwgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50OiAnZGl2JywgYXR0cmlidXRlczogeyBpZDogJ3BvcC11cC13aW5kb3cnLCBjbGFzczogJ2tlZGlvLXBvcC11cC13aW5kb3cnIH0sIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQ6ICdkaXYnLCBhdHRyaWJ1dGVzOiB7IGlkOiAncG9wLXVwLW1lbnUnLCBjbGFzczogJ2tlZGlvLXBvcC11cC1tZW51JyB9LCBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgZWxlbWVudDogJ3AnLCBhdHRyaWJ1dGVzOiB7IGlkOiAnJywgc3R5bGU6IHsgY29sb3I6ICdpbmhlcml0JywgcGFkZGluZzogJzFlbScgfSB9LCB0ZXh0OiB0aXRsZSB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgZWxlbWVudDogJ2knLCBhdHRyaWJ1dGVzOiB7IGlkOiAndG9nZ2xlLXdpbmRvdycsIGNsYXNzOiAna2VkaW8tcG9wLXVwLWNvbnRyb2wgZmFzIGZhLWV4cGFuZC1hbHQnIH0gfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGVsZW1lbnQ6ICdpJywgYXR0cmlidXRlczogeyBpZDogJ2Nsb3NlLXdpbmRvdycsIGNsYXNzOiAna2VkaW8tcG9wLXVwLWNvbnRyb2wgZmFzIGZhLXRpbWVzJyB9IH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudDogJ2RpdicsIGF0dHJpYnV0ZXM6IHsgaWQ6ICdwb3AtdXAtY29udGVudCcsIGNsYXNzOiAna2VkaW8tcG9wLXVwLWNvbnRlbnQnIH0sIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50OiAnc3R5bGUnLCB0ZXh0OiBgLmtlZGlvLXBvcC11cCB7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IGZpeGVkO1xyXG4gICAgICAgICAgICAgICAgICAgIHRvcDogMDtcclxuICAgICAgICAgICAgICAgICAgICBsZWZ0OiAwO1xyXG4gICAgICAgICAgICAgICAgICAgIGJvdHRvbTogMDtcclxuICAgICAgICAgICAgICAgICAgICByaWdodDogMDtcclxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1saWdodC1zZWNvbmRhcnktY29sb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGdyaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHZhcigtLWZpbGwtcGFyZW50KTtcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHZhcigtLWZpbGwtcGFyZW50KTtcclxuICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5LWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgICAgICAgICAgICAgICAgICB6LWluZGV4OiAxMDAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAua2VkaW8tcG9wLXVwLXdpbmRvdyB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tcHJpbWFyeS1jb2xvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogZ3JpZDtcclxuICAgICAgICAgICAgICAgICAgICBncmlkLWdhcDogMWVtO1xyXG4gICAgICAgICAgICAgICAgICAgIGp1c3RpZnktaXRlbXM6IGNlbnRlcjtcclxuICAgICAgICAgICAgICAgICAgICBhbGlnbi1pdGVtczogc3RhcnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnI7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiBtYXgtY29udGVudCAxZnI7XHJcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLmtlZGlvLXBvcC11cC1tZW51IHtcclxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1zZWNvbmRhcnktY29sb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiB2YXIoLS1wcmltYXJ5LWNvbG9yKTtcclxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBncmlkO1xyXG4gICAgICAgICAgICAgICAgICAgIGdyaWQtZ2FwOiAuNWVtO1xyXG4gICAgICAgICAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyIHJlcGVhdCgyLCBtaW4tY29udGVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICAgICAgICAgICAgICAgICAganVzdGlmeS1pdGVtczogZmxleC1lbmQ7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlclxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAua2VkaW8tcG9wLXVwLWNvbnRyb2wge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiB2YXIoLS1wcmltYXJ5LWNvbG9yKTtcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDIwcHg7XHJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDIwcHg7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogMWVtXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC5rZWRpby1wb3AtdXAtY29udGVudCB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmZsb3c6IGF1dG87XHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICAgICAgICAgICAgfWB9XHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcG9wVXAuZmluZCgnI3BvcC11cC13aW5kb3cnKS5zZXRBdHRyaWJ1dGVzKHBhcmFtcy5hdHRyaWJ1dGVzKTtcclxuXHJcbiAgICAgICAgcG9wVXAuZmluZCgnI3RvZ2dsZS13aW5kb3cnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgcG9wVXAuZmluZCgnI3RvZ2dsZS13aW5kb3cnKS5jbGFzc0xpc3QudG9nZ2xlKCdmYS1leHBhbmQtYWx0Jyk7XHJcbiAgICAgICAgICAgIHBvcFVwLmZpbmQoJyN0b2dnbGUtd2luZG93JykuY2xhc3NMaXN0LnRvZ2dsZSgnZmEtY29tcHJlc3MtYWx0Jyk7XHJcblxyXG4gICAgICAgICAgICBpZiAocG9wVXAuZmluZCgnI3RvZ2dsZS13aW5kb3cnKS5jbGFzc0xpc3QuY29udGFpbnMoJ2ZhLWV4cGFuZC1hbHQnKSkge1xyXG4gICAgICAgICAgICAgICAgcG9wVXAuZmluZCgnI3BvcC11cC13aW5kb3cnKS5jc3MoeyBoZWlnaHQ6IHBhcmFtcy5hdHRyaWJ1dGVzLnN0eWxlLmhlaWdodCwgd2lkdGg6IHBhcmFtcy5hdHRyaWJ1dGVzLnN0eWxlLndpZHRoIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcG9wVXAuZmluZCgnI3BvcC11cC13aW5kb3cnKS5jc3MoeyBoZWlnaHQ6ICd2YXIoLS1maWxsLXBhcmVudCknLCB3aWR0aDogJ3ZhcigtLWZpbGwtcGFyZW50KScgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcG9wVXAuZmluZCgnI2Nsb3NlLXdpbmRvdycpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICBwb3BVcC5yZW1vdmUoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZChwb3BVcCk7XHJcbiAgICAgICAgcmV0dXJuIHBvcFVwO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZVNlbGVjdChwYXJhbXMgPSB7IHZhbHVlOiAnJywgY29udGVudHM6IHt9LCBtdWx0aXBsZTogZmFsc2UgfSkge1xyXG4gICAgICAgIGxldCBzZWxlY3RlZCA9IFtdLFxyXG4gICAgICAgICAgICBhbGxvd05hdmlnYXRlID0gZmFsc2UsXHJcbiAgICAgICAgICAgIHNjcm9sbFBvc2l0aW9uID0gLTEsXHJcbiAgICAgICAgICAgIGFjdGl2ZTtcclxuXHJcbiAgICAgICAgLy9jcmVhdGUgdGhlIGVsZW1lbnRcclxuICAgICAgICBsZXQgc2VsZWN0ID0gdGhpcy5jcmVhdGVFbGVtZW50KHtcclxuICAgICAgICAgICAgZWxlbWVudDogJ2RpdicsIGF0dHJpYnV0ZXM6IHBhcmFtcy5hdHRyaWJ1dGVzLCBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQ6ICdzcGFuJywgYXR0cmlidXRlczogeyBjbGFzczogJ2tlZGlvLXNlbGVjdC1jb250cm9sJywgfSwgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgeyBlbGVtZW50OiAnaW5wdXQnLCBhdHRyaWJ1dGVzOiB7IGNsYXNzOiAna2VkaW8tc2VsZWN0LWlucHV0JywgdmFsdWU6IHBhcmFtcy52YWx1ZSB8fCAnJywgaWdub3JlOiB0cnVlIH0gfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudDogJ3NwYW4nLCBhdHRyaWJ1dGVzOiB7IGNsYXNzOiAna2VkaW8tc2VsZWN0LXRvZ2dsZScgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHsgZWxlbWVudDogJ2lucHV0JywgYXR0cmlidXRlczogeyBjbGFzczogJ2tlZGlvLXNlbGVjdC1zZWFyY2gnLCBwbGFjZUhvbGRlcjogJ1NlYXJjaCBtZS4uLicsIGlnbm9yZTogdHJ1ZSB9IH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudDogJ3NwYW4nLCBhdHRyaWJ1dGVzOiB7IGNsYXNzOiAna2VkaW8tc2VsZWN0LWNvbnRlbnRzJyB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQ6ICdzdHlsZScsIHRleHQ6IGAua2VkaW8tc2VsZWN0IHtcclxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBncmlkO1xyXG4gICAgICAgICAgICAgICAgICAgIG1heC1oZWlnaHQ6IDI1MHB4O1xyXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogbWF4LWNvbnRlbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiBtYXgtY29udGVudCAxZnI7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgICAgICAgICAgICAgICAgIHotaW5kZXg6IDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC5rZWRpby1zZWxlY3QtY29udHJvbCB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogZ3JpZDtcclxuICAgICAgICAgICAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciBtYXgtY29udGVudDtcclxuICAgICAgICAgICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVycztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLmtlZGlvLXNlbGVjdC1pbnB1dCB7XHJcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiBub25lO1xyXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiB2YXIoLS1zZWNvbmRhcnktY29sb3IpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAua2VkaW8tc2VsZWN0LXNlYXJjaCB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogdmFyKC0tcHJpbWFyeS1jb2xvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IHZhcigtLXNlY29uZGFyeS1jb2xvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHZhcigtLW1hdGNoLXBhcmVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogLjNlbTtcclxuICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5LXNlbGY6IGNlbnRlcjtcclxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBub25lO1xyXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlcjogbm9uZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLmtlZGlvLXNlbGVjdC10b2dnbGUge1xyXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlci1sZWZ0OiAycHggc29saWQgdmFyKC0tc2Vjb25kYXJ5LWNvbG9yKTtcclxuICAgICAgICAgICAgICAgICAgICBib3JkZXItdG9wOiAycHggc29saWQgdmFyKC0tc2Vjb25kYXJ5LWNvbG9yKTtcclxuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IHJvdGF0ZSgyMjVkZWcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAuNWVtO1xyXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogLjVlbTtcclxuICAgICAgICAgICAgICAgICAgICBtYXJnaW46IC4zZW07XHJcbiAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiBwb2ludGVyXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC5rZWRpby1zZWxlY3QtY29udGVudHMge1xyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiB2YXIoLS1maWxsLXBhcmVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IG5vbmU7XHJcbiAgICAgICAgICAgICAgICAgICAganVzdGlmeS1pdGVtczogY2VudGVyO1xyXG4gICAgICAgICAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xyXG4gICAgICAgICAgICAgICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmZsb3c6IGF1dG87XHJcbiAgICAgICAgICAgICAgICAgICAgei1pbmRleDogMTAwMDtcclxuICAgICAgICAgICAgICAgICAgICBtaW4taGVpZ2h0OiA1MHB4O1xyXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogbWF4LWNvbnRlbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgbWF4LWhlaWdodDogMjUwcHg7XHJcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiAxcHggc29saWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tcHJpbWFyeS1jb2xvcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC5rZWRpby1zZWxlY3Qtb3B0aW9uIHtcclxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgICAgICAgICAgICAgIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHZhcigtLW1hdGNoLXBhcmVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogLjVlbTtcclxuICAgICAgICAgICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC5rZWRpby1zZWxlY3Qtb3B0aW9uOmhvdmVyLCAua2VkaW8tc2VsZWN0LWFjdGl2ZS1vcHRpb257XHJcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tc2Vjb25kYXJ5LWNvbG9yKTtcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogdmFyKC0tcHJpbWFyeS1jb2xvcik7XHJcbiAgICAgICAgICAgICAgICB9YH1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHNlbGVjdC5jbGFzc0xpc3QuYWRkKCdrZWRpby1zZWxlY3QnKTtcclxuICAgICAgICBsZXQgc2V0VmFsdWUgPSBzZWxlY3QuZ2V0QXR0cmlidXRlKCd2YWx1ZScpO1xyXG4gICAgICAgIHNlbGVjdC52YWx1ZSA9IFtdO1xyXG4gICAgICAgIGlmICghdGhpcy5pc251bGwoc2V0VmFsdWUpKSB7XHJcbiAgICAgICAgICAgIHNlbGVjdC52YWx1ZSA9IHRoaXMuYXJyYXkuZmluZEFsbChzZXRWYWx1ZS5zcGxpdCgnLCcpLCB2ID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2LnRyaW0oKSAhPSAnJztcclxuICAgICAgICAgICAgfSk7Ly9yZW1vdmUgYWxsIGVtcHR5IHN0cmluZ3NcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNlbGVjdC5kYXRhc2V0LmFjdGl2ZSA9ICdmYWxzZSc7XHJcbiAgICAgICAgLy9nZXQgdGhlIGNvbnRlbnRzXHJcbiAgICAgICAgbGV0IGNvbnRlbnRzID0gc2VsZWN0LmZpbmQoJy5rZWRpby1zZWxlY3QtY29udGVudHMnKTtcclxuICAgICAgICBsZXQgaW5wdXQgPSBzZWxlY3QuZmluZCgnLmtlZGlvLXNlbGVjdC1pbnB1dCcpO1xyXG4gICAgICAgIGxldCBzZWFyY2ggPSBzZWxlY3QuZmluZCgnLmtlZGlvLXNlbGVjdC1zZWFyY2gnKTtcclxuICAgICAgICBsZXQgdG9nZ2xlID0gc2VsZWN0LmZpbmQoJy5rZWRpby1zZWxlY3QtdG9nZ2xlJyk7XHJcbiAgICAgICAgcGFyYW1zLmNvbnRlbnRzID0gcGFyYW1zLmNvbnRlbnRzIHx8IHt9O1xyXG4gICAgICAgIC8vcG9wdWxhdGUgdGhlIGVsZW1lbnQgY29udGVudHNcclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShwYXJhbXMuY29udGVudHMpKSB7Ly9UdXJuIGNvbnRlbnRzIHRvIG9iamVjdCBpZiBpdHMgYXJyYXlcclxuICAgICAgICAgICAgbGV0IGl0ZW1zID0gcGFyYW1zLmNvbnRlbnRzO1xyXG4gICAgICAgICAgICBwYXJhbXMuY29udGVudHMgPSB7fTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zLmNvbnRlbnRzW2l0ZW1zW2ldXSA9IGl0ZW1zW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGxldCBpIGluIHBhcmFtcy5jb250ZW50cykge1xyXG4gICAgICAgICAgICBsZXQgb3B0aW9uID0gY29udGVudHMubWFrZUVsZW1lbnQoeyBlbGVtZW50OiAnc3BhbicsIGF0dHJpYnV0ZXM6IHsgY2xhc3M6ICdrZWRpby1zZWxlY3Qtb3B0aW9uJywgdmFsdWU6IGkgfSB9KTtcclxuICAgICAgICAgICAgb3B0aW9uLmlubmVySFRNTCA9IHBhcmFtcy5jb250ZW50c1tpXTtcclxuICAgICAgICAgICAgb3B0aW9uLnZhbHVlID0gaTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IHYgb2Ygc2VsZWN0LnZhbHVlKSB7XHJcbiAgICAgICAgICAgIGlucHV0LnZhbHVlICs9IHBhcmFtcy5jb250ZW50c1t2XTtcclxuICAgICAgICAgICAgaW5wdXQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2NoYW5nZScpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vZW5hYmxlIG11bHRpcGxlIHZhbHVlc1xyXG4gICAgICAgIGxldCBzaW5nbGUgPSAoIXRoaXMuaXNzZXQocGFyYW1zLm11bHRpcGxlKSB8fCBwYXJhbXMubXVsdGlwbGUgPT0gZmFsc2UpO1xyXG5cclxuICAgICAgICBsZXQgb3B0aW9ucyA9IHNlbGVjdC5maW5kQWxsKCcua2VkaW8tc2VsZWN0LW9wdGlvbicpO1xyXG5cclxuICAgICAgICAvL3NlYXJjaCB0aGUgY29udGVudHNcclxuICAgICAgICBzZWFyY2gub25DaGFuZ2VkKHZhbHVlID0+IHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcHRpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIW9wdGlvbnNbaV0udGV4dENvbnRlbnQudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyh2YWx1ZS50b0xvd2VyQ2FzZSgpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnNbaV0uY3NzKHsgZGlzcGxheTogJ25vbmUnIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uc1tpXS5jc3NSZW1vdmUoWydkaXNwbGF5J10pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vbmF2aWdhdGUgdGhlIGNvbnRlbnRzXHJcbiAgICAgICAgbGV0IG5hdmlnYXRlID0gZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICBhbGxvd05hdmlnYXRlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGlmIChldmVudC5rZXkgPT0gJ0Fycm93RG93bicgJiYgc2Nyb2xsUG9zaXRpb24gPCBvcHRpb25zLmxlbmd0aCAtIDEpIHtcclxuICAgICAgICAgICAgICAgIHNjcm9sbFBvc2l0aW9uKys7XHJcbiAgICAgICAgICAgICAgICBhbGxvd05hdmlnYXRlID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChldmVudC5rZXkgPT0gJ0Fycm93VXAnICYmIHNjcm9sbFBvc2l0aW9uID4gMCkge1xyXG4gICAgICAgICAgICAgICAgc2Nyb2xsUG9zaXRpb24tLTtcclxuICAgICAgICAgICAgICAgIGFsbG93TmF2aWdhdGUgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGV2ZW50LmtleSA9PSAnRW50ZXInKSB7XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoYWxsb3dOYXZpZ2F0ZSkge1xyXG4gICAgICAgICAgICAgICAgYWN0aXZlID0gY29udGVudHMuZmluZCgnLmtlZGlvLXNlbGVjdC1hY3RpdmUtb3B0aW9uJyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaXNudWxsKGFjdGl2ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBhY3RpdmUuY2xhc3NMaXN0LnJlbW92ZSgna2VkaW8tc2VsZWN0LWFjdGl2ZS1vcHRpb24nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBvcHRpb25zW3Njcm9sbFBvc2l0aW9uXS5jbGFzc0xpc3QuYWRkKCdrZWRpby1zZWxlY3QtYWN0aXZlLW9wdGlvbicpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL3RvZ2dsZSB0aGUgY29udGVudHNcclxuICAgICAgICB0b2dnbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XHJcbiAgICAgICAgICAgIGxldCBhY3RpdmUgPSBzZWxlY3QuZGF0YXNldC5hY3RpdmUgPT0gJ3RydWUnO1xyXG4gICAgICAgICAgICBpZiAoYWN0aXZlKSB7XHJcbiAgICAgICAgICAgICAgICBkZWFjdGl2YXRlKGFjdGl2ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhY3RpdmF0ZShhY3RpdmUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vc2hvdyB0aGUgY29udGVudHNcclxuICAgICAgICBsZXQgaW5WaWV3LCB0b3AsIGJvdHRvbTtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmNzcyh7IG92ZXJmbG93OiAnYXV0bycgfSlcclxuXHJcbiAgICAgICAgbGV0IHBsYWNlQ29udGVudHMgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRvcCA9IHNlbGVjdC5wb3NpdGlvbigpLnRvcDtcclxuICAgICAgICAgICAgYm90dG9tID0gZG9jdW1lbnQuYm9keS5jbGllbnRIZWlnaHQgLSBzZWxlY3QucG9zaXRpb24oKS50b3A7XHJcblxyXG4gICAgICAgICAgICBpZiAodG9wID4gYm90dG9tKSB7XHJcbiAgICAgICAgICAgICAgICBjb250ZW50cy5jc3MoeyB0b3A6IC1jb250ZW50cy5wb3NpdGlvbigpLmhlaWdodCArICdweCcgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb250ZW50cy5jc3MoeyB0b3A6IHNlbGVjdC5wb3NpdGlvbigpLmhlaWdodCArICdweCcgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vc2hvdyBjb250ZW50c1xyXG4gICAgICAgIGxldCBhY3RpdmF0ZSA9ICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKHNlbGVjdC5pblZpZXcoJ2JvZHknKSkge1xyXG4gICAgICAgICAgICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG5hdmlnYXRlLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICBzZWFyY2guY3NzKHsgZGlzcGxheTogJ2ZsZXgnIH0pO1xyXG4gICAgICAgICAgICAgICAgY29udGVudHMuY3NzKHsgZGlzcGxheTogJ2ZsZXgnIH0pO1xyXG4gICAgICAgICAgICAgICAgcGxhY2VDb250ZW50cygpO1xyXG4gICAgICAgICAgICAgICAgc2VsZWN0LmRhdGFzZXQuYWN0aXZlID0gJ3RydWUnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL2hpZGUgdGhlIGNvbnRlbnRzXHJcbiAgICAgICAgbGV0IGRlYWN0aXZhdGUgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlucHV0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBuYXZpZ2F0ZSwgZmFsc2UpO1xyXG4gICAgICAgICAgICBzZWFyY2guY3NzUmVtb3ZlKFsnZGlzcGxheSddKTtcclxuICAgICAgICAgICAgY29udGVudHMuY3NzUmVtb3ZlKFsnZGlzcGxheSddKTtcclxuICAgICAgICAgICAgc2VsZWN0LmRhdGFzZXQuYWN0aXZlID0gJ2ZhbHNlJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vdXBkYXRlIHRoZSBzZWxlY3RlZFxyXG4gICAgICAgIGxldCB1cGRhdGUgPSAodmFsdWVzKSA9PiB7XHJcbiAgICAgICAgICAgIHNlbGVjdGVkID0gW107XHJcbiAgICAgICAgICAgIHZhbHVlcyA9IHZhbHVlcy5zcGxpdCgnLCcpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCB2YWx1ZSBvZiB2YWx1ZXMpIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSBpbiBwYXJhbXMuY29udGVudHMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocGFyYW1zLmNvbnRlbnRzW2ldID09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gaTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQucHVzaCh2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNlbGVjdC52YWx1ZSA9IHNlbGVjdGVkO1xyXG4gICAgICAgICAgICBpbnB1dC52YWx1ZSA9IHZhbHVlcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vY2hlY2sgd2hlbiBhY3RpdmF0ZWRcclxuICAgICAgICBzZWxlY3QuYnViYmxlZEV2ZW50KCdjbGljaycsIGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgaWYgKGV2ZW50LnRhcmdldCAhPSB0b2dnbGUgJiYgc2VsZWN0LmRhdGFzZXQuYWN0aXZlID09ICdmYWxzZScpIHtcclxuICAgICAgICAgICAgICAgIGFjdGl2YXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChldmVudC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdrZWRpby1zZWxlY3Qtb3B0aW9uJykpIHtcclxuICAgICAgICAgICAgICAgIGxldCB0ZXh0ID0gcGFyYW1zLmNvbnRlbnRzW2V2ZW50LnRhcmdldC52YWx1ZV07XHJcbiAgICAgICAgICAgICAgICBpZiAocGFyYW1zLm11bHRpcGxlID09ICdzaW5nbGUnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlucHV0LnZhbHVlLmluY2x1ZGVzKHRleHQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0LnZhbHVlID0gaW5wdXQudmFsdWUucmVwbGFjZSh0ZXh0LCAnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnB1dC52YWx1ZSArPSBgLCAke3RleHR9YDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpbnB1dC52YWx1ZSArPSBgLCAke3RleHR9YDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpbnB1dC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnY2hhbmdlJykpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChzaW5nbGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWFjdGl2YXRlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy9jaGVjayB3aGVuIGRlYWN0aXZhdGVkXHJcbiAgICAgICAgc2VsZWN0Lm5vdEJ1YmJsZWRFdmVudCgnY2xpY2snLCBldmVudCA9PiB7XHJcbiAgICAgICAgICAgIGlmIChzZWxlY3QuZGF0YXNldC5hY3RpdmUgPT0gJ3RydWUnKSB7XHJcbiAgICAgICAgICAgICAgICBkZWFjdGl2YXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy93aGVuIGlucHV0IHZhbHVlIGNoYW5nZXNcclxuICAgICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBldmVudCA9PiB7XHJcbiAgICAgICAgICAgIGxldCB2YWx1ZXMgPSBpbnB1dC52YWx1ZS5zcGxpdCgnLCcpO1xyXG5cclxuICAgICAgICAgICAgdmFsdWVzID0gdGhpcy5hcnJheS5maW5kQWxsKHZhbHVlcywgdmFsdWUgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLnRyaW0oKSAhPSAnJztcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB2YWx1ZXMgPSB0aGlzLmFycmF5LmVhY2godmFsdWVzLCB2YWx1ZSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUudHJpbSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmICghc2luZ2xlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocGFyYW1zLm11bHRpcGxlID09ICdzaW5nbGUnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVzID0gdGhpcy5hcnJheS50b1NldCh2YWx1ZXMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YWx1ZXMgPSB2YWx1ZXMuam9pbignLCAnKTtcclxuICAgICAgICAgICAgdXBkYXRlKHZhbHVlcyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vYWxpZ24gY29udGVudHMgb24gc2Nyb2xsXHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgaWYgKHNlbGVjdC5pblZpZXcoJ2JvZHknKSkge1xyXG4gICAgICAgICAgICAgICAgcGxhY2VDb250ZW50cygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBzZWxlY3Q7XHJcbiAgICB9XHJcblxyXG4gICAgY2hvb3NlKHBhcmFtcyA9IHsgbm90ZTogJycsIG9wdGlvbnM6IFtdIH0pIHtcclxuICAgICAgICBsZXQgY2hvb3NlV2luZG93ID0gdGhpcy5jcmVhdGVFbGVtZW50KHtcclxuICAgICAgICAgICAgZWxlbWVudDogJ3NwYW4nLCBhdHRyaWJ1dGVzOiB7IGNsYXNzOiAnY3JhdGVyLWNob29zZScgfSwgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgICAgIHsgZWxlbWVudDogJ3AnLCBhdHRyaWJ1dGVzOiB7IGNsYXNzOiAnY3JhdGVyLWNob29zZS1ub3RlJyB9LCB0ZXh0OiBwYXJhbXMubm90ZSB9LFxyXG4gICAgICAgICAgICAgICAgeyBlbGVtZW50OiAnc3BhbicsIGF0dHJpYnV0ZXM6IHsgY2xhc3M6ICdjcmF0ZXItY2hvb3NlLWNvbnRyb2wnIH0gfSxcclxuICAgICAgICAgICAgICAgIHsgZWxlbWVudDogJ2J1dHRvbicsIGF0dHJpYnV0ZXM6IHsgaWQ6ICdjcmF0ZXItY2hvb3NlLWNsb3NlJywgY2xhc3M6ICdidG4nIH0sIHRleHQ6ICdDbG9zZScgfVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxldCBjaG9vc2VDb250cm9sID0gY2hvb3NlV2luZG93LnF1ZXJ5U2VsZWN0b3IoJy5jcmF0ZXItY2hvb3NlLWNvbnRyb2wnKTtcclxuXHJcbiAgICAgICAgY2hvb3NlV2luZG93LnF1ZXJ5U2VsZWN0b3IoJyNjcmF0ZXItY2hvb3NlLWNsb3NlJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XHJcbiAgICAgICAgICAgIGNob29zZVdpbmRvdy5yZW1vdmUoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgb3B0aW9uIG9mIHBhcmFtcy5vcHRpb25zKSB7XHJcbiAgICAgICAgICAgIGNob29zZUNvbnRyb2wubWFrZUVsZW1lbnQoe1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudDogJ2J1dHRvbicsIGF0dHJpYnV0ZXM6IHsgY2xhc3M6ICdidG4gY2hvb3NlLW9wdGlvbicgfSwgdGV4dDogb3B0aW9uXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZGlzcGxheTogY2hvb3NlV2luZG93LCBjaG9pY2U6IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgIGNob29zZUNvbnRyb2wuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2Nob29zZS1vcHRpb24nKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGV2ZW50LnRhcmdldC50ZXh0Q29udGVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNob29zZVdpbmRvdy5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHRleHRFZGl0b3IocGFyYW1zID0geyBpZDogJycsIHdpZHRoOiAnbWF4LXdpZHRoJyB9KSB7XHJcbiAgICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xyXG4gICAgICAgIHBhcmFtcy5pZCA9IHBhcmFtcy5pZCB8fCAndGV4dC1lZGl0b3InO1xyXG4gICAgICAgIGxldCB0ZXh0RWRpdG9yID0gdGhpcy5jcmVhdGVFbGVtZW50KHtcclxuICAgICAgICAgICAgZWxlbWVudDogJ2RpdicsIGF0dHJpYnV0ZXM6IHtcclxuICAgICAgICAgICAgICAgIGlkOiBwYXJhbXMuaWRcclxuICAgICAgICAgICAgfSwgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50OiAnc3R5bGUnLCB0ZXh0OiBgXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGRpdiNjcmF0ZXItdGV4dC1lZGl0b3J7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbjogMCBhdXRvO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBncmlkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogJHtwYXJhbXMud2lkdGggfHwgJ21heC1jb250ZW50J307XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogbWF4LWNvbnRlbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlcjogMnB4IHNvbGlkIHJnYig0MCwgMTEwLCA4OSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDhweCA4cHggMHB4IDBweDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tcHJpbWFyeS1jb2xvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGRpdiNjcmF0ZXItcmljaC10ZXh0LWFyZWF7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogMTAwJTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBkaXYjY3JhdGVyLXRoZS1yaWJib257XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlci1ib3R0b206IG5vbmU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAuNWVtIDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGdyaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtcm93czogbWF4LWNvbnRlbnQgbWF4LWNvbnRlbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYig0MCwgMTEwLCA4OSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiB2YXIoLS1wcmltYXJ5LWNvbG9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dC1hbGlnbjogbGVmdDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmcmFtZSNjcmF0ZXItdGhlLVdZU0lXWUd7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogMTAwJTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBkaXYjY3JhdGVyLXRoZS1yaWJib24gYnV0dG9ue1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogdmFyKC0tcHJpbWFyeS1jb2xvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlcjogbm9uZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0bGluZTogbm9uZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogLjNlbTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luOiAuNWVtO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZGl2I2NyYXRlci10aGUtcmliYm9uIGJ1dHRvbjpob3ZlcntcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDIwLCA5MCwgNzApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiBhbGwgMC4zcyBsaW5lYXIgMHM7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBkaXYjY3JhdGVyLXRoZS1yaWJib24gaW5wdXQsICBkaXYjY3JhdGVyLXRoZS1yaWJib24gc2VsZWN0e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW46IC41ZW07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBkaXYjY3JhdGVyLXRoZS1yaWJib24gaW5wdXRbdHlwZT1cImNvbG9yXCJde1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3JkZXI6IG5vbmU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dGxpbmU6IG5vbmU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQ6ICdkaXYnLCBhdHRyaWJ1dGVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiAnY3JhdGVyLXRoZS1yaWJib24nXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudDogJ3NwYW4nLCBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgZWxlbWVudDogJ2J1dHRvbicsIGF0dHJpYnV0ZXM6IHsgaWQ6ICd1bmRvQnV0dG9uJywgdGl0bGU6ICdVbmRvJyB9LCB0ZXh0OiAnJmxhcnI7JyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgZWxlbWVudDogJ2J1dHRvbicsIGF0dHJpYnV0ZXM6IHsgaWQ6ICdyZWRvQnV0dG9uJywgdGl0bGU6ICdSZWRvJyB9LCB0ZXh0OiAnJnJhcnI7JyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgZWxlbWVudDogJ3NlbGVjdCcsIGF0dHJpYnV0ZXM6IHsgaWQ6ICdmb250Q2hhbmdlcicgfSwgb3B0aW9uczogdGhpcy5mb250U3R5bGVzIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBlbGVtZW50OiAnc2VsZWN0JywgYXR0cmlidXRlczogeyBpZDogJ2ZvbnRTaXplQ2hhbmdlcicgfSwgb3B0aW9uczogdGhpcy5yYW5nZSgxLCAyMCkgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGVsZW1lbnQ6ICdidXR0b24nLCBhdHRyaWJ1dGVzOiB7IGlkOiAnb3JkZXJlZExpc3RCdXR0b24nLCB0aXRsZTogJ051bWJlcmVkIExpc3QnIH0sIHRleHQ6ICcoaSknIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBlbGVtZW50OiAnYnV0dG9uJywgYXR0cmlidXRlczogeyBpZDogJ3Vub3JkZXJlZExpc3RCdXR0b24nLCB0aXRsZTogJ0J1bGxldHRlZCBMaXN0JyB9LCB0ZXh0OiAnJmJ1bGw7JyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgZWxlbWVudDogJ2J1dHRvbicsIGF0dHJpYnV0ZXM6IHsgaWQ6ICdsaW5rQnV0dG9uJywgdGl0bGU6ICdDcmVhdGUgTGluaycgfSwgdGV4dDogJ0xpbmsnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBlbGVtZW50OiAnYnV0dG9uJywgYXR0cmlidXRlczogeyBpZDogJ3VuTGlua0J1dHRvbicsIHRpdGxlOiAnUmVtb3ZlIExpbmsnIH0sIHRleHQ6ICdVbmxpbmsnIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudDogJ3NwYW4nLCBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgZWxlbWVudDogJ2J1dHRvbicsIGF0dHJpYnV0ZXM6IHsgaWQ6ICdib2xkQnV0dG9uJywgdGl0bGU6ICdCb2xkJyB9LCBjaGlsZHJlbjogW3sgZWxlbWVudDogJ2InLCB0ZXh0OiAnQicgfV0gfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGVsZW1lbnQ6ICdidXR0b24nLCBhdHRyaWJ1dGVzOiB7IGlkOiAnaXRhbGljQnV0dG9uJywgdGl0bGU6ICdJdGFsaWMnIH0sIGNoaWxkcmVuOiBbeyBlbGVtZW50OiAnZW0nLCB0ZXh0OiAnSScgfV0gfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGVsZW1lbnQ6ICdidXR0b24nLCBhdHRyaWJ1dGVzOiB7IGlkOiAndW5kZXJsaW5lQnV0dG9uJywgdGl0bGU6ICdVbmRlcmxpbmUnIH0sIGNoaWxkcmVuOiBbeyBlbGVtZW50OiAndScsIHRleHQ6ICdVJyB9XSB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgZWxlbWVudDogJ2J1dHRvbicsIGF0dHJpYnV0ZXM6IHsgaWQ6ICdzdXBCdXR0b24nLCB0aXRsZTogJ1N1cGVyc2NyaXB0JyB9LCBjaGlsZHJlbjogW3sgZWxlbWVudDogJ3N1cCcsIHRleHQ6ICcyJyB9XSB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgZWxlbWVudDogJ2J1dHRvbicsIGF0dHJpYnV0ZXM6IHsgaWQ6ICdzdWJCdXR0b24nLCB0aXRsZTogJ1N1YnNjcmlwdCcgfSwgY2hpbGRyZW46IFt7IGVsZW1lbnQ6ICdzdWInLCB0ZXh0OiAnMicgfV0gfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGVsZW1lbnQ6ICdidXR0b24nLCBhdHRyaWJ1dGVzOiB7IGlkOiAnc3RyaWtlQnV0dG9uJywgdGl0bGU6ICdTdHJpa2V0aHJvdWdoJyB9LCBjaGlsZHJlbjogW3sgZWxlbWVudDogJ3MnLCB0ZXh0OiAnYWJjJyB9XSB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgZWxlbWVudDogJ2lucHV0JywgYXR0cmlidXRlczogeyB0eXBlOiAnY29sb3InLCBpZDogJ2ZvbnRDb2xvckJ1dHRvbicsIHRpdGxlOiAnQ2hhbmdlIEZvbnQgQ29sb3InLCB2YWx1ZTogJyMwMDAwMDAnIH0gfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGVsZW1lbnQ6ICdpbnB1dCcsIGF0dHJpYnV0ZXM6IHsgdHlwZTogJ2NvbG9yJywgaWQ6ICdoaWdobGlnaHRCdXR0b24nLCB0aXRsZTogJ0hpZ2h0bGlnaHQgVGV4dCcsIHZhbHVlOiAnI2ZmZmZmZicgfSB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgZWxlbWVudDogJ2lucHV0JywgYXR0cmlidXRlczogeyB0eXBlOiAnY29sb3InLCBpZDogJ2JhY2tncm91bmRCdXR0b24nLCB0aXRsZTogJ0NoYW5nZSBCYWNrZ3JvdW5kJywgdmFsdWU6ICcjZmZmZmZmJyB9IH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBlbGVtZW50OiAnYnV0dG9uJywgYXR0cmlidXRlczogeyBpZDogJ2FsaWduTGVmdEJ1dHRvbicsIHRpdGxlOiAnQWxpZ24gTGVmdCcgfSwgY2hpbGRyZW46IFt7IGVsZW1lbnQ6ICdhJywgdGV4dDogJ0wnIH1dIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBlbGVtZW50OiAnYnV0dG9uJywgYXR0cmlidXRlczogeyBpZDogJ2FsaWduQ2VudGVyQnV0dG9uJywgdGl0bGU6ICdBbGlnbiBDZW50ZXInIH0sIGNoaWxkcmVuOiBbeyBlbGVtZW50OiAnYScsIHRleHQ6ICdDJyB9XSB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgZWxlbWVudDogJ2J1dHRvbicsIGF0dHJpYnV0ZXM6IHsgaWQ6ICdhbGlnbkp1c3RpZnlCdXR0b24nLCB0aXRsZTogJ0FsaWduIEp1c3RpZnknIH0sIGNoaWxkcmVuOiBbeyBlbGVtZW50OiAnYScsIHRleHQ6ICdKJyB9XSB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgZWxlbWVudDogJ2J1dHRvbicsIGF0dHJpYnV0ZXM6IHsgaWQ6ICdhbGlnblJpZ2h0QnV0dG9uJywgdGl0bGU6ICdBbGlnbiBSaWdodCcgfSwgY2hpbGRyZW46IFt7IGVsZW1lbnQ6ICdhJywgdGV4dDogJ1InIH1dIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudDogJ2RpdicsIGF0dHJpYnV0ZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6ICdjcmF0ZXItcmljaC10ZXh0LWFyZWEnXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudDogJ2lmcmFtZScsIGF0dHJpYnV0ZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogJ2NyYXRlci10aGUtV1lTSVdZRycsIGZyYW1lQm9yZGVyOiAwLCBuYW1lOiAndGhlV1lTSVdZRydcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBsZXQgZm9udHMgPSB0ZXh0RWRpdG9yLmZpbmRBbGwoJ3NlbGVjdCNmb250LWNoYW5nZXIgPiBvcHRpb24nKTtcclxuICAgICAgICBmb250cy5mb3JFYWNoKGZvbnQgPT4ge1xyXG4gICAgICAgICAgICBmb250LmNzcyh7IGZvbnRGYW1pbHk6IGZvbnQudmFsdWUgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRleHRFZGl0b3IuZmluZCgnI3Vub3JkZXJlZExpc3RCdXR0b24nKS5pbm5lckhUTUwgPSAnJmJ1bGw7JztcclxuICAgICAgICB0ZXh0RWRpdG9yLmZpbmQoJyNyZWRvQnV0dG9uJykuaW5uZXJIVE1MID0gJyZyYXJyOyc7XHJcbiAgICAgICAgdGV4dEVkaXRvci5maW5kKCcjdW5kb0J1dHRvbicpLmlubmVySFRNTCA9ICcmbGFycjsnO1xyXG5cclxuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgbGV0IGVkaXRvcldpbmRvdyA9IHRleHRFZGl0b3IuZmluZCgnI2NyYXRlci10aGUtV1lTSVdZRycpO1xyXG4gICAgICAgIGVkaXRvcldpbmRvdy5vbkFkZGVkKCgpID0+IHtcclxuICAgICAgICAgICAgbGV0IGVkaXRvciA9IGVkaXRvcldpbmRvdy5jb250ZW50V2luZG93LmRvY3VtZW50O1xyXG5cclxuICAgICAgICAgICAgZWRpdG9yLmJvZHkuaW5uZXJIVE1MID0gJyc7XHJcbiAgICAgICAgICAgIGlmIChzZWxmLmlzc2V0KHBhcmFtcy5jb250ZW50KSkge1xyXG4gICAgICAgICAgICAgICAgZWRpdG9yLmJvZHkuaW5uZXJIVE1MID0gcGFyYW1zLmNvbnRlbnQuaW5uZXJIVE1MO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBlZGl0b3IuZGVzaWduTW9kZSA9ICdvbic7XHJcblxyXG4gICAgICAgICAgICB0ZXh0RWRpdG9yLmZpbmQoJyNib2xkQnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlZGl0b3IuZXhlY0NvbW1hbmQoJ0JvbGQnLCBmYWxzZSwgbnVsbCk7XHJcbiAgICAgICAgICAgIH0sIGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgIHRleHRFZGl0b3IuZmluZCgnI2l0YWxpY0J1dHRvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZWRpdG9yLmV4ZWNDb21tYW5kKCdJdGFsaWMnLCBmYWxzZSwgbnVsbCk7XHJcbiAgICAgICAgICAgIH0sIGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgIHRleHRFZGl0b3IuZmluZCgnI3VuZGVybGluZUJ1dHRvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZWRpdG9yLmV4ZWNDb21tYW5kKCdVbmRlcmxpbmUnLCBmYWxzZSwgbnVsbCk7XHJcbiAgICAgICAgICAgIH0sIGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgIHRleHRFZGl0b3IuZmluZCgnI3N1cEJ1dHRvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZWRpdG9yLmV4ZWNDb21tYW5kKCdTdXBlcnNjcmlwdCcsIGZhbHNlLCBudWxsKTtcclxuICAgICAgICAgICAgfSwgZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgdGV4dEVkaXRvci5maW5kKCcjc3ViQnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlZGl0b3IuZXhlY0NvbW1hbmQoJ1N1YnNjcmlwdCcsIGZhbHNlLCBudWxsKTtcclxuICAgICAgICAgICAgfSwgZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgdGV4dEVkaXRvci5maW5kKCcjc3RyaWtlQnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlZGl0b3IuZXhlY0NvbW1hbmQoJ1N0cmlrZXRocm91Z2gnLCBmYWxzZSwgbnVsbCk7XHJcbiAgICAgICAgICAgIH0sIGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgIHRleHRFZGl0b3IuZmluZCgnI29yZGVyZWRMaXN0QnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlZGl0b3IuZXhlY0NvbW1hbmQoJ0luc2VydE9yZGVyZWRMaXN0JywgZmFsc2UsIGBuZXdPTCR7c2VsZi5yYW5kb20oKX1gKTtcclxuICAgICAgICAgICAgfSwgZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgdGV4dEVkaXRvci5maW5kKCcjdW5vcmRlcmVkTGlzdEJ1dHRvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZWRpdG9yLmV4ZWNDb21tYW5kKCdJbnNlcnRVbm9yZGVyZWRMaXN0JywgZmFsc2UsIGBuZXdVTCR7c2VsZi5yYW5kb20oKX1gKTtcclxuICAgICAgICAgICAgfSwgZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgdGV4dEVkaXRvci5maW5kKCcjZm9udENvbG9yQnV0dG9uJykub25DaGFuZ2VkKHZhbHVlID0+IHtcclxuICAgICAgICAgICAgICAgIGVkaXRvci5leGVjQ29tbWFuZCgnRm9yZUNvbG9yJywgZmFsc2UsIHZhbHVlKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0ZXh0RWRpdG9yLmZpbmQoJyNoaWdobGlnaHRCdXR0b24nKS5vbkNoYW5nZWQodmFsdWUgPT4ge1xyXG4gICAgICAgICAgICAgICAgZWRpdG9yLmV4ZWNDb21tYW5kKCdCYWNrQ29sb3InLCBmYWxzZSwgdmFsdWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRleHRFZGl0b3IuZmluZCgnI2JhY2tncm91bmRCdXR0b24nKS5vbkNoYW5nZWQodmFsdWUgPT4ge1xyXG4gICAgICAgICAgICAgICAgZWRpdG9yLmJvZHkuc3R5bGUuYmFja2dyb3VuZCA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRleHRFZGl0b3IuZmluZCgnI2ZvbnRDaGFuZ2VyJykub25DaGFuZ2VkKHZhbHVlID0+IHtcclxuICAgICAgICAgICAgICAgIGVkaXRvci5leGVjQ29tbWFuZCgnRm9udE5hbWUnLCBmYWxzZSwgdmFsdWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRleHRFZGl0b3IuZmluZCgnI2ZvbnRTaXplQ2hhbmdlcicpLm9uQ2hhbmdlZCh2YWx1ZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlZGl0b3IuZXhlY0NvbW1hbmQoJ0ZvbnRTaXplJywgZmFsc2UsIHZhbHVlKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0ZXh0RWRpdG9yLmZpbmQoJyNsaW5rQnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdXJsID0gcHJvbXB0KCdFbnRlciBhIFVSTCcsICdodHRwOi8vJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuaXNudWxsKHVybCkpIHJldHVybjtcclxuICAgICAgICAgICAgICAgIGVkaXRvci5leGVjQ29tbWFuZCgnQ3JlYXRlTGluaycsIGZhbHNlLCB1cmwpO1xyXG4gICAgICAgICAgICB9LCBmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICB0ZXh0RWRpdG9yLmZpbmQoJyN1bkxpbmtCdXR0b24nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGVkaXRvci5leGVjQ29tbWFuZCgnVW5MaW5rJywgZmFsc2UsIG51bGwpO1xyXG4gICAgICAgICAgICB9LCBmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICB0ZXh0RWRpdG9yLmZpbmQoJyN1bmRvQnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlZGl0b3IuZXhlY0NvbW1hbmQoJ1VuZG8nLCBmYWxzZSwgbnVsbCk7XHJcbiAgICAgICAgICAgIH0sIGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgIHRleHRFZGl0b3IuZmluZCgnI3JlZG9CdXR0b24nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGVkaXRvci5leGVjQ29tbWFuZCgncmVkbycsIGZhbHNlLCBudWxsKTtcclxuICAgICAgICAgICAgfSwgZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgdGV4dEVkaXRvci5maW5kKCcjYWxpZ25MZWZ0QnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlZGl0b3IuZXhlY0NvbW1hbmQoJ2p1c3RpZnlMZWZ0JywgZmFsc2UsIG51bGwpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRleHRFZGl0b3IuZmluZCgnI2FsaWduQ2VudGVyQnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlZGl0b3IuZXhlY0NvbW1hbmQoJ2p1c3RpZnlDZW50ZXInLCBmYWxzZSwgbnVsbCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGV4dEVkaXRvci5maW5kKCcjYWxpZ25KdXN0aWZ5QnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlZGl0b3IuZXhlY0NvbW1hbmQoJ2p1c3RpZnlGdWxsJywgZmFsc2UsIG51bGwpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRleHRFZGl0b3IuZmluZCgnI2FsaWduUmlnaHRCdXR0b24nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGVkaXRvci5leGVjQ29tbWFuZCgnanVzdGlmeVJpZ2h0JywgZmFsc2UsIG51bGwpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LCBmYWxzZSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0ZXh0RWRpdG9yO1xyXG4gICAgfVxyXG5cclxuICAgIGRpc3BsYXlEYXRhKGRhdGEgPSB7fSwgY29udGFpbmVyKSB7XHJcbiAgICAgICAgbGV0IGxpbmVOdW1iZXJzID0gW107XHJcbiAgICAgICAgbGV0IGRpc3BsYXlTdHJpbmcgPSAodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlRWxlbWVudCh7IGVsZW1lbnQ6ICdzcGFuJywgYXR0cmlidXRlczogeyBjbGFzczogJ2tlZGlvLWRhdGEtc3RyJyB9LCB0ZXh0OiBgXCIke3ZhbHVlfVwiYCB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBkaXNwbGF5TGl0ZXJhbCA9ICh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVFbGVtZW50KHsgZWxlbWVudDogJ3NwYW4nLCBhdHRyaWJ1dGVzOiB7IGNsYXNzOiAna2VkaW8tZGF0YS1saXQnIH0sIHRleHQ6IGAke3ZhbHVlfWAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgZGlzcGxheVB1bmN0dWF0aW9uID0gKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZUVsZW1lbnQoeyBlbGVtZW50OiAnc3BhbicsIGF0dHJpYnV0ZXM6IHsgY2xhc3M6ICdrZWRpby1kYXRhLXB1bicgfSwgdGV4dDogYCR7dmFsdWV9YCB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBkaXNwbGF5TmV3TGluZSA9ICgpID0+IHtcclxuICAgICAgICAgICAgaW5jcmVtZW50Kys7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZUVsZW1lbnQoeyBlbGVtZW50OiAnc3BhbicsIGF0dHJpYnV0ZXM6IHsgY2xhc3M6ICdrZWRpby1kYXRhLXBsbicgfSB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBkaXNwbGF5SXRlbSA9ICh2YWx1ZSwgcGFyYW1zKSA9PiB7XHJcbiAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcclxuICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLmNyZWF0ZUVsZW1lbnQoeyBlbGVtZW50OiAnc3BhbicsIGF0dHJpYnV0ZXM6IHsgY2xhc3M6ICdrZWRpby1kYXRhLWl0ZW0nIH0gfSk7XHJcbiAgICAgICAgICAgIGxpbmVOdW1iZXJzLnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzc2V0KHBhcmFtcy5rZXkpKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLm1ha2VFbGVtZW50KFtcclxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5U3RyaW5nKHBhcmFtcy5rZXkpLFxyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXlQdW5jdHVhdGlvbignIDogJyksXHJcbiAgICAgICAgICAgICAgICAgICAgY2hvb3NlRGlzcGxheSh2YWx1ZSksXHJcbiAgICAgICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0ubWFrZUVsZW1lbnQoW1xyXG4gICAgICAgICAgICAgICAgICAgIGNob29zZURpc3BsYXkodmFsdWUpLFxyXG4gICAgICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgZGlzcGxheUFycmF5ID0gKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBhcnJheSA9IHRoaXMuY3JlYXRlRWxlbWVudCh7IGVsZW1lbnQ6ICdzcGFuJywgYXR0cmlidXRlczogeyBjbGFzczogJ2tlZGlvLWRhdGEtYmxvY2snIH0gfSk7XHJcbiAgICAgICAgICAgIGxpbmVOdW1iZXJzLnB1c2goYXJyYXkpO1xyXG5cclxuICAgICAgICAgICAgYXJyYXkubWFrZUVsZW1lbnQoZGlzcGxheVB1bmN0dWF0aW9uKCdbJykpO1xyXG4gICAgICAgICAgICBsZXQgaXRlbTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaXRlbSA9IGFycmF5Lm1ha2VFbGVtZW50KGRpc3BsYXlJdGVtKHZhbHVlW2ldKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGkgIT0gdmFsdWUubGVuZ3RoIC0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0ubWFrZUVsZW1lbnQoZGlzcGxheVB1bmN0dWF0aW9uKCcsJykpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGFycmF5Lm1ha2VFbGVtZW50KGRpc3BsYXlQdW5jdHVhdGlvbignXScpKTtcclxuICAgICAgICAgICAgcmV0dXJuIGFycmF5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGRpc3BsYXlPYmplY3QgPSAodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgbGV0IG9iamVjdCA9IHRoaXMuY3JlYXRlRWxlbWVudCh7IGVsZW1lbnQ6ICdzcGFuJywgYXR0cmlidXRlczogeyBjbGFzczogJ2tlZGlvLWRhdGEtYmxvY2snIH0gfSk7XHJcbiAgICAgICAgICAgIGxpbmVOdW1iZXJzLnB1c2gob2JqZWN0KTtcclxuXHJcbiAgICAgICAgICAgIG9iamVjdC5tYWtlRWxlbWVudChkaXNwbGF5UHVuY3R1YXRpb24oJ3snKSk7XHJcbiAgICAgICAgICAgIGxldCBpdGVtO1xyXG4gICAgICAgICAgICBsZXQgaSA9IDA7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgaXRlbSA9IG9iamVjdC5tYWtlRWxlbWVudChkaXNwbGF5SXRlbSh2YWx1ZVtrZXldLCB7IGtleSB9KSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSAhPSBPYmplY3Qua2V5cyh2YWx1ZSkubGVuZ3RoIC0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0ubWFrZUVsZW1lbnQoZGlzcGxheVB1bmN0dWF0aW9uKCcsJykpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9iamVjdC5tYWtlRWxlbWVudChkaXNwbGF5UHVuY3R1YXRpb24oJ30nKSk7XHJcbiAgICAgICAgICAgIHJldHVybiBvYmplY3Q7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgY2hvb3NlRGlzcGxheSA9ICh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBkaXNwbGF5U3RyaW5nKHZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRpc3BsYXlBcnJheSh2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIHZhbHVlID09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZGlzcGxheU9iamVjdCh2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZGlzcGxheUxpdGVyYWwodmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBsaW5lSGVpZ2h0ID0gJzI1cHgnO1xyXG4gICAgICAgIGxldCBkaXNwbGF5ZWQgPSB0aGlzLmNyZWF0ZUVsZW1lbnQoe1xyXG4gICAgICAgICAgICBlbGVtZW50OiAncHJlJywgYXR0cmlidXRlczogeyBjbGFzczogJ2tlZGlvLWRhdGEtd2luZG93JyB9LCBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQ6ICdzcGFuJywgYXR0cmlidXRlczogeyBjbGFzczogJ2tlZGlvLWRhdGEtbGluZScsIHN0eWxlOiB7IGxpbmVIZWlnaHQgfSB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQ6ICdzcGFuJywgYXR0cmlidXRlczogeyBjbGFzczogJ2tlZGlvLWRhdGEtdG9nZ2xlcycgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50OiAnY29kZScsIGF0dHJpYnV0ZXM6IHsgY2xhc3M6ICdrZWRpby1kYXRhLWNvZGUnLCBzdHlsZTogeyBsaW5lSGVpZ2h0IH0gfSwgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hvb3NlRGlzcGxheShkYXRhKVxyXG4gICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudDogJ3N0eWxlJywgdGV4dDogYC5rZWRpby1kYXRhLXdpbmRvdyB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IGluaGVyaXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogZ3JpZDtcclxuICAgICAgICAgICAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IG1heC1jb250ZW50IG1heC1jb250ZW50IDFmcjtcclxuICAgICAgICAgICAgICAgICAgICBnYXA6IDFlbTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLmtlZGlvLWRhdGEtbGluZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IGluaGVyaXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogZ3JpZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLmtlZGlvLWRhdGEtdG9nZ2xlcyB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IGluaGVyaXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogZ3JpZDtcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC5rZWRpby1kYXRhLWxpbmUtbnVtYmVyIHtcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogaW5oZXJpdDtcclxuICAgICAgICAgICAgICAgICAgICAvKiBkaXNwbGF5OiBmbGV4OyAqL1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAua2VkaW8tZGF0YS10b2dnbGVzIC5rZWRpby1kYXRhLXRvZ2dsZXMtYnV0dG9uIHtcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogaW5oZXJpdDtcclxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgICAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9udC1zaXplOiAuOGVtO1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC5rZWRpby1kYXRhLWNvZGUge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiBpbmhlcml0O1xyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLmtlZGlvLWRhdGEtcHVuIHtcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogaW5oZXJpdDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLmtlZGlvLWRhdGEtbGl0IHtcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogaW5oZXJpdDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLmtlZGlvLWRhdGEtYmxvY2sge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiBpbmhlcml0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAua2VkaW8tZGF0YS1zdHIge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiBpbmhlcml0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAua2VkaW8tZGF0YS1wbG4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAua2VkaW8tZGF0YS1pdGVtIHtcclxuICAgICAgICAgICAgICAgICAgICBtYXJnaW4tbGVmdDogMjBweDtcclxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBibG9jaztcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogaW5oZXJpdDtcclxuICAgICAgICAgICAgICAgIH1gfVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzc2V0KGNvbnRhaW5lcikpIHtcclxuICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZChkaXNwbGF5ZWQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGNvZGUgPSBkaXNwbGF5ZWQuZmluZCgnLmtlZGlvLWRhdGEtY29kZScpLFxyXG4gICAgICAgICAgICBudW1iZXJzLFxyXG4gICAgICAgICAgICB0b2dnbGVCdXR0b25zLFxyXG4gICAgICAgICAgICBoZWlnaHQgPSBjb2RlLnBvc2l0aW9uKCkuaGVpZ2h0LFxyXG4gICAgICAgICAgICBsaW5lcyA9IGRpc3BsYXllZC5maW5kKCcua2VkaW8tZGF0YS1saW5lJyksXHJcbiAgICAgICAgICAgIHRvZ2dsZXMgPSBkaXNwbGF5ZWQuZmluZCgnLmtlZGlvLWRhdGEtdG9nZ2xlcycpLFxyXG4gICAgICAgICAgICBjb3VudCA9IGhlaWdodCAvIHBhcnNlSW50KGxpbmVIZWlnaHQpLFxyXG4gICAgICAgICAgICBpdGVtcyA9IGNvZGUuZmluZEFsbCgnLmtlZGlvLWRhdGEtaXRlbScpLFxyXG4gICAgICAgICAgICBibG9ja3MgPSBjb2RlLmZpbmRBbGwoJy5rZWRpby1kYXRhLWJsb2NrJyk7XHJcblxyXG4gICAgICAgIGxldCBzZXRSYW5nZSA9IChibG9jaykgPT4ge1xyXG4gICAgICAgICAgICBsZXQgc3RhcnQgPSBNYXRoLmZsb29yKChibG9jay5wb3NpdGlvbigpLnRvcCAtIGNvZGUucG9zaXRpb24oKS50b3ApIC8gcGFyc2VJbnQobGluZUhlaWdodCkpICsgMTtcclxuICAgICAgICAgICAgbGV0IGVuZCA9IE1hdGguZmxvb3IoKGJsb2NrLnBvc2l0aW9uKCkuYm90dG9tIC0gY29kZS5wb3NpdGlvbigpLnRvcCkgLyBwYXJzZUludChsaW5lSGVpZ2h0KSkgKyAxO1xyXG4gICAgICAgICAgICBibG9jay5yYW5nZSA9IHRoaXMucmFuZ2UoZW5kLCBzdGFydCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgc2V0TnVtYmVycyA9ICgpID0+IHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaW5lTnVtYmVycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGluZXMubWFrZUVsZW1lbnQoW1xyXG4gICAgICAgICAgICAgICAgICAgIHsgZWxlbWVudDogJ2EnLCBodG1sOiBgJHtpIC8gMSArIDF9YCwgYXR0cmlidXRlczogeyBjbGFzczogJ2tlZGlvLWRhdGEtbGluZS1udW1iZXInIH0gfVxyXG4gICAgICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBzZXRUb2dnbGVzID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJsb2Nrcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRvcCA9IGJsb2Nrc1tpXS5wb3NpdGlvbigpLnRvcCAtIGNvZGUucG9zaXRpb24oKS50b3AgKyA2ICsgJ3B4J1xyXG4gICAgICAgICAgICAgICAgbGV0IHRvZ2dsZSA9IHRvZ2dsZXMubWFrZUVsZW1lbnQoeyBlbGVtZW50OiAnaScsIGF0dHJpYnV0ZXM6IHsgY2xhc3M6ICdrZWRpby1kYXRhLXRvZ2dsZXMtYnV0dG9uIGZhcyBmYS1hcnJvdy1kb3duJywgc3R5bGU6IHsgdG9wIH0gfSB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICB0b2dnbGUuYmxvY2sgPSBibG9ja3NbaV07XHJcbiAgICAgICAgICAgICAgICBibG9ja3NbaV0udG9nZ2xlID0gdG9nZ2xlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgYWxpZ25Ub2dnbGVzID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvZ2dsZUJ1dHRvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRvZ2dsZUJ1dHRvbnNbaV0uY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICB0b3A6IHRvZ2dsZUJ1dHRvbnNbaV0uYmxvY2sucG9zaXRpb24oKS50b3AgLSBjb2RlLnBvc2l0aW9uKCkudG9wICsgNiArICdweCdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgaGlkZU51bWJlcnMgPSAoYmxvY2spID0+IHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBibG9jay5yYW5nZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmlzc2V0KG51bWJlcnNbYmxvY2sucmFuZ2VbaV1dLmNvbnRyb2xsZXIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbnVtYmVyc1tibG9jay5yYW5nZVtpXV0uY3NzKHsgZGlzcGxheTogJ25vbmUnIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIG51bWJlcnNbYmxvY2sucmFuZ2VbaV1dLmNvbnRyb2xsZXIgPSBibG9jaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGhpZGVCbG9jayA9IChibG9jaykgPT4ge1xyXG4gICAgICAgICAgICBsZXQgYmxvY2tDb250ZW50ID0gYmxvY2suY2hpbGRyZW47XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmxvY2tDb250ZW50Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYmxvY2tDb250ZW50W2ldLmNsYXNzTGlzdC5jb250YWlucygna2VkaW8tZGF0YS1pdGVtJykpIHtcclxuICAgICAgICAgICAgICAgICAgICBibG9ja0NvbnRlbnRbaV0uY3NzKHsgZGlzcGxheTogJ25vbmUnIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBibG9ja0NvbnRlbnRbaV0uZmluZEFsbCgnLmtlZGlvLWRhdGEtYmxvY2snKS5mb3JFYWNoKGIgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaXNzZXQoYi50b2dnbGUuY29udHJvbGxlcikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGIudG9nZ2xlLmNvbnRyb2xsZXIgPSBibG9jaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGIudG9nZ2xlLmNzcyh7IGRpc3BsYXk6ICdub25lJyB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgc2hvd051bWJlcnMgPSAoYmxvY2spID0+IHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBibG9jay5yYW5nZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKG51bWJlcnNbYmxvY2sucmFuZ2VbaV1dLmNvbnRyb2xsZXIgPT0gYmxvY2spIHtcclxuICAgICAgICAgICAgICAgICAgICBudW1iZXJzW2Jsb2NrLnJhbmdlW2ldXS5jc3NSZW1vdmUoWydkaXNwbGF5J10pO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBudW1iZXJzW2Jsb2NrLnJhbmdlW2ldXS5jb250cm9sbGVyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgc2hvd0Jsb2NrID0gKGJsb2NrKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBibG9ja0NvbnRlbnQgPSBibG9jay5jaGlsZHJlbjtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBibG9ja0NvbnRlbnQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChibG9ja0NvbnRlbnRbaV0uY2xhc3NMaXN0LmNvbnRhaW5zKCdrZWRpby1kYXRhLWl0ZW0nKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJsb2NrQ29udGVudFtpXS5jc3NSZW1vdmUoWydkaXNwbGF5J10pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBibG9ja0NvbnRlbnRbaV0uZmluZEFsbCgnLmtlZGlvLWRhdGEtYmxvY2snKS5mb3JFYWNoKGIgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYi50b2dnbGUuY29udHJvbGxlciA9PSBibG9jaykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGIudG9nZ2xlLmNvbnRyb2xsZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiLnRvZ2dsZS5jc3NSZW1vdmUoWydkaXNwbGF5J10pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxpbmVOdW1iZXJzLnB1c2godW5kZWZpbmVkKVxyXG5cclxuICAgICAgICBkaXNwbGF5ZWQub25BZGRlZChldmVudCA9PiB7XHJcbiAgICAgICAgICAgIHNldE51bWJlcnMoKTtcclxuICAgICAgICAgICAgc2V0VG9nZ2xlcygpO1xyXG5cclxuICAgICAgICAgICAgbnVtYmVycyA9IGxpbmVzLmZpbmRBbGwoJy5rZWRpby1kYXRhLWxpbmUtbnVtYmVyJyk7XHJcbiAgICAgICAgICAgIHRvZ2dsZUJ1dHRvbnMgPSB0b2dnbGVzLmZpbmRBbGwoJy5rZWRpby1kYXRhLXRvZ2dsZXMtYnV0dG9uJyk7XHJcblxyXG4gICAgICAgICAgICBsZXQgYmxvY2tDb250ZW50LCBzdGFydCwgZW5kO1xyXG4gICAgICAgICAgICBkaXNwbGF5ZWQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgICAgICAgICAgICAgaWYgKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2tlZGlvLWRhdGEtdG9nZ2xlcy1idXR0b24nKSkgey8vaWYgdG9nZ2xlZFxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5pc3NldCh0YXJnZXQuYmxvY2sucmFuZ2UpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFJhbmdlKHRhcmdldC5ibG9jayk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnZmEtYXJyb3ctZG93bicpKSB7Ly9pZiB0b2dnbGUgdG8gc2hvd1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoaWRlTnVtYmVycyh0YXJnZXQuYmxvY2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoaWRlQmxvY2sodGFyZ2V0LmJsb2NrKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3dOdW1iZXJzKHRhcmdldC5ibG9jayk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3dCbG9jayh0YXJnZXQuYmxvY2spO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC50b2dnbGUoJ2ZhLWFycm93LXVwJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC50b2dnbGUoJ2ZhLWFycm93LWRvd24nKTtcclxuICAgICAgICAgICAgICAgICAgICBhbGlnblRvZ2dsZXMoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBkaXNwbGF5ZWQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ29tcG9uZW50czsiLCJjbGFzcyBGdW5jIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmNhcGl0YWxzID0gXCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWlwiO1xyXG4gICAgICAgIHRoaXMuc21hbGxzID0gXCJhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5elwiO1xyXG4gICAgICAgIHRoaXMuZGlnaXRzID0gXCIxMjM0NTY3ODkwXCI7XHJcbiAgICAgICAgdGhpcy5zeW1ib2xzID0gXCIsLi8/JyFAIyQlXiYqKCktXys9YH5cXFxcfCBcIjtcclxuICAgICAgICB0aGlzLm1vbnRocyA9IFsnSmFudWFyeScsICdGZWJ1YXJ5JywgJ01hcmNoJywgJ0FwcmlsJywgJ01heScsICdKdW5lJywgJ0p1bHknLCAnQXVndXN0JywgJ1NlcHRlbWJlcicsICdPY3RvYmVyJywgJ05vdmVtYmVyJywgJ0RlY2VtYmVyJ107XHJcbiAgICAgICAgdGhpcy5kYXlzID0gWydTdW5kYXknLCAnTW9uZGF5JywgJ1R1ZXNkYXknLCAnV2VkbmVzZGF5JywgJ1RodXJzZGF5JywgJ0ZyaWRheScsICdTYXR1cmRheSddO1xyXG4gICAgICAgIHRoaXMuZ2VuZGVycyA9IFsnTWFsZScsICdGZW1hbGUnLCAnRG8gbm90IGRpc2Nsb3NlJ107XHJcbiAgICAgICAgdGhpcy5tYXJpdGFscyA9IFsnTWFycmllZCcsICdTaW5nbGUnLCAnRGl2b3JjZWQnLCAnV2lkb3dlZCddO1xyXG4gICAgICAgIHRoaXMucmVsaWdpb25zID0gWydDaHJpc3RhaW5pdHknLCAnSXNsYW0nLCAnSnVkYWlzbScsICdQYWdhbmlzbScsICdCdWRpc20nXTtcclxuICAgICAgICB0aGlzLnVzZXJUeXBlcyA9IFsnc3R1ZGVudCcsICdzdGFmZicsICdhZG1pbicsICdjZW8nXTtcclxuICAgICAgICB0aGlzLnN0YWZmUmVxdWVzdHMgPSBbJ2xlYXZlJywgJ2FsbG93YW5jZSddO1xyXG4gICAgICAgIHRoaXMuc3R1ZGVudHNSZXF1ZXN0cyA9IFsnYWJzZW5jZScsICdhY2FkZW1pYyddO1xyXG4gICAgICAgIHRoaXMuc3ViamVjdExpc3QgPSBbJ01hdGhlbWF0aWNzJywgJ0VuZ2xpc2gnLCAnUGh5c2ljcycsICdDaGVtaXN0cnknLCAnQmlvbG9neScsICdBZ3JpY3VsdHVyZScsICdMaXRlcmF0dXJlJywgJ0hpc3RvcnknXS5zb3J0KCk7XHJcbiAgICAgICAgdGhpcy5zdWJqZWN0TGV2ZWxzID0gWydHZW5lcmFsJywgJ1NlbmlvcicsICdTY2llbmNlJywgJ0FydHMnLCAnSnVuaW9yJ107XHJcbiAgICAgICAgdGhpcy5mb250U3R5bGVzID0gWydBcmlhbCcsICdUaW1lcyBOZXcgUm9tYW4nLCAnSGVsdmV0aWNhJywgJ1RpbWVzJywgJ0NvdXJpZXIgTmV3JywgJ1ZlcmRhbmEnLCAnQ291cmllcicsICdBcmlhbCBOYXJyb3cnLCAnQ2FuZGFyYScsICdHZW5ldmEnLCAnQ2FsaWJyaScsICdPcHRpbWEnLCAnQ2FtYnJpYScsICdHYXJhbW9uZCcsICdQZXJwZXR1YScsICdNb25hY28nLCAnRGlkb3QnLCAnQnJ1c2ggU2NyaXB0IE1UJywgJ0x1Y2lkYSBCcmlnaHQnLCAnQ29wcGVycGxhdGUnLCAnU2VyaWYnLCAnU2FuLVNlcmlmJywgJ0dlb3JnaWEnLCAnU2Vnb2UgVUknXTtcclxuICAgICAgICB0aGlzLnBpeGVsU2l6ZXMgPSBbJzBweCcsICcxcHgnLCAnMnB4JywgJzNweCcsICc0cHgnLCAnNXB4JywgJzZweCcsICc3cHgnLCAnOHB4JywgJzlweCcsICcxMHB4JywgJzIwcHgnLCAnMzBweCcsICc0MHB4JywgJzUwcHgnLCAnNjBweCcsICc3MHB4JywgJzgwcHgnLCAnOTBweCcsICcxMDBweCcsICdOb25lJywgJ1Vuc2V0JywgJ2F1dG8nLCAnLXdlYmtpdC1maWxsLWF2YWlsYWJsZSddO1xyXG4gICAgICAgIHRoaXMuY29sb3JzID0gWydSZWQnLCAnR3JlZW4nLCAnQmx1ZScsICdZZWxsb3cnLCAnQmxhY2snLCAnV2hpdGUnLCAnUHVycGxlJywgJ1Zpb2xldCcsICdJbmRpZ28nLCAnT3JhbmdlJywgJ1RyYW5zcGFyZW50JywgJ05vbmUnLCAnVW5zZXQnXTtcclxuICAgICAgICB0aGlzLmJvbGRuZXNzID0gWzEwMCwgMjAwLCAzMDAsIDQwMCwgNTAwLCA2MDAsIDcwMCwgODAwLCA5MDAsIDEwMDAsICdsaWdodGVyJywgJ2JvbGQnLCAnYm9sZGVyJywgJ25vcm1hbCcsICd1bnNldCddO1xyXG4gICAgICAgIHRoaXMuYm9yZGVyVHlwZXMgPSBbJ1NvbGlkJywgJ0RvdHRlZCcsICdEb3VibGUnLCAnR3Jvb3ZlJywgJ0Rhc2hlZCcsICdJbnNldCcsICdOb25lJywgJ1Vuc2V0JywgJ091dHNldCcsICdSaWdnZWQnLCAnSW5oZXJpdCcsICdJbml0aWFsJ107XHJcbiAgICAgICAgdGhpcy5zaGFkb3dzID0gWycycHggMnB4IDVweCAycHggcmVkJywgJzJweCAycHggNXB4IGdyZWVuJywgJzJweCAycHggeWVsbG93JywgJzJweCBibGFjaycsICdOb25lJywgJ1Vuc2V0J107XHJcbiAgICAgICAgdGhpcy5ib3JkZXJzID0gWycxcHggc29saWQgYmxhY2snLCAnMnB4IGRvdHRlZCBncmVlbicsICczcHggZGFzaGVkIHllbGxvdycsICcxcHggZG91YmxlIHJlZCcsICdOb25lJywgJ1Vuc2V0J107XHJcbiAgICAgICAgdGhpcy5hbGlnbm1lbnQgPSBbJ0xlZnQnLCAnSnVzdGlmaWVkJywgJ1JpZ2h0JywgJ0NlbnRlciddO1xyXG4gICAgfVxyXG5cclxuICAgIGV4dHJhY3RTb3VyY2Uoc291cmNlKSB7XHJcbiAgICAgICAgbGV0IHZhbHVlID0gdGhpcy5pbkJldHdlZW4oc291cmNlLCAnJCMmeycsICd9JiMkJyk7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdmFsdWUgPSBKU09OLnBhcnNlKHZhbHVlKTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICB2YWx1ZSA9IHt9O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgaW5kZXhBdChoYXlzdGFjayA9ICcnLCBuZWVkbGUgPSAnJywgcG9zID0gMCkge1xyXG4gICAgICAgIHBvcyA9IHBvcyB8fCAwO1xyXG4gICAgICAgIGlmIChoYXlzdGFjay5pbmRleE9mKG5lZWRsZSkgPT0gLTEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaGF5c3RhY2sgPSBoYXlzdGFjay5zcGxpdChuZWVkbGUpO1xyXG4gICAgICAgIGlmIChwb3MgPj0gaGF5c3RhY2subGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBpbmRleCA9IDA7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBoYXlzdGFjay5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoaSA8PSBwb3MpIHtcclxuICAgICAgICAgICAgICAgIGluZGV4ICs9IGhheXN0YWNrW2ldLmxlbmd0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpbmRleCArPSBuZWVkbGUubGVuZ3RoICogcG9zO1xyXG5cclxuICAgICAgICByZXR1cm4gaW5kZXg7XHJcbiAgICB9XHJcblxyXG4gICAgY29tYmluZShoYXlzdGFjayA9ICcnLCBmaXJzdCA9ICcnLCBzZWNvbmQgPSAnJywgcG9zID0gMCkge1xyXG4gICAgICAgIHBvcyA9IHBvcyB8fCAwOy8vaW5pdGlhbGl6ZSBwb3NpdGlvbiBpZiBub3Qgc2V0XHJcbiAgICAgICAgbGV0IGF0MSA9IHBvcyxcclxuICAgICAgICAgICAgYXQyID0gZmlyc3QgPT09IHNlY29uZCA/IHBvcyArIDEgOiBwb3M7IC8vY2hlY2sgaWYgaXQgaXMgdGhlIHNhbWUgYW5kIGNoYW5nZSBwb3NpdGlvblxyXG4gICAgICAgIGxldCBzdGFydCA9IHRoaXMuaW5kZXhBdChoYXlzdGFjaywgZmlyc3QsIGF0MSk7Ly9nZXQgdGhlIHN0YXJ0XHJcbiAgICAgICAgbGV0IGVuZCA9IHRoaXMuaW5kZXhBdChoYXlzdGFjaywgc2Vjb25kLCBhdDIpOy8vZ2V0IHRoZSBlbmRcclxuXHJcbiAgICAgICAgaWYgKHN0YXJ0ID09IC0xIHx8IHN0YXJ0ICsgZmlyc3QubGVuZ3RoID49IGhheXN0YWNrLmxlbmd0aCB8fCBlbmQgPT0gLTEpIHsvL251bGwgaWYgb25lIGlzIG5vdCBmb3VuZFxyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gaGF5c3RhY2suc2xpY2Uoc3RhcnQsIGVuZCArIHNlY29uZC5sZW5ndGgpO1xyXG4gICAgfVxyXG5cclxuICAgIGFsbENvbWJpbmUoaGF5c3RhY2sgPSAnJywgZmlyc3QgPSAnJywgc2Vjb25kID0gJycpIHtcclxuICAgICAgICBsZXQgcG9zID0gMDtcclxuICAgICAgICBsZXQgYWxsID0gW107XHJcbiAgICAgICAgbGV0IGZvdW5kO1xyXG4gICAgICAgIHdoaWxlIChmb3VuZCAhPSAtMSkge1xyXG4gICAgICAgICAgICBmb3VuZCA9IHRoaXMuY29tYmluZShoYXlzdGFjaywgZmlyc3QsIHNlY29uZCwgcG9zKTtcclxuICAgICAgICAgICAgcG9zKys7XHJcbiAgICAgICAgICAgIGlmIChmb3VuZCAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgYWxsLnB1c2goZm91bmQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGluQmV0d2VlbihoYXlzdGFjayA9ICcnLCBmaXJzdCA9ICcnLCBzZWNvbmQgPSAnJywgcG9zID0gMCkge1xyXG4gICAgICAgIHBvcyA9IHBvcyB8fCAwOy8vaW5pdGlhbGl6ZSBwb3NpdGlvbiBpZiBub3Qgc2V0XHJcbiAgICAgICAgbGV0IGF0MSA9IHBvcyxcclxuICAgICAgICAgICAgYXQyID0gZmlyc3QgPT09IHNlY29uZCA/IHBvcyArIDEgOiBwb3M7IC8vY2hlY2sgaWYgaXQgaXMgdGhlIHNhbWUgYW5kIGNoYW5nZSBwb3NpdGlvblxyXG4gICAgICAgIGxldCBzdGFydCA9IHRoaXMuaW5kZXhBdChoYXlzdGFjaywgZmlyc3QsIGF0MSk7Ly9nZXQgdGhlIHN0YXJ0XHJcbiAgICAgICAgbGV0IGVuZCA9IHRoaXMuaW5kZXhBdChoYXlzdGFjaywgc2Vjb25kLCBhdDIpOy8vZ2V0IHRoZSBlbmRcclxuXHJcbiAgICAgICAgaWYgKHN0YXJ0ID09IC0xIHx8IHN0YXJ0ICsgZmlyc3QubGVuZ3RoID49IGhheXN0YWNrLmxlbmd0aCB8fCBlbmQgPT0gLTEpIHsvLy0xIGlmIG9uZSBpcyBub3QgZm91bmQgb3IgaW5iZXR3ZWVuXHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBoYXlzdGFjay5zbGljZShzdGFydCArIGZpcnN0Lmxlbmd0aCwgZW5kKTtcclxuICAgIH1cclxuXHJcbiAgICBhbGxJbkJldHdlZW4oaGF5c3RhY2sgPSAnJywgZmlyc3QgPSAnJywgc2Vjb25kID0gJycpIHtcclxuICAgICAgICBsZXQgcG9zID0gMDtcclxuICAgICAgICBsZXQgYWxsID0gW107XHJcbiAgICAgICAgbGV0IGZvdW5kO1xyXG4gICAgICAgIHdoaWxlIChmb3VuZCAhPSAtMSkge1xyXG4gICAgICAgICAgICBmb3VuZCA9IHRoaXMuaW5CZXR3ZWVuKGhheXN0YWNrLCBmaXJzdCwgc2Vjb25kLCBwb3MpO1xyXG4gICAgICAgICAgICBwb3MrKztcclxuICAgICAgICAgICAgaWYgKGZvdW5kICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBhbGwucHVzaChmb3VuZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBhbGw7XHJcbiAgICB9XHJcblxyXG4gICAgZXh0cmFjdENTUyhlbGVtZW50KSB7XHJcbiAgICAgICAgbGV0IGNzcyA9IGVsZW1lbnQuc3R5bGUuY3NzVGV4dCxcclxuICAgICAgICAgICAgc3R5bGUgPSB7fSxcclxuICAgICAgICAgICAga2V5LFxyXG4gICAgICAgICAgICB2YWx1ZTtcclxuXHJcbiAgICAgICAgaWYgKGNzcyAhPSAnJykge1xyXG4gICAgICAgICAgICBjc3MgPSBjc3Muc3BsaXQoJzsgJyk7XHJcbiAgICAgICAgICAgIGxldCBwYWlyO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpIG9mIGNzcykge1xyXG4gICAgICAgICAgICAgICAgcGFpciA9IHRoaXMudHJlbShpKTtcclxuICAgICAgICAgICAgICAgIGtleSA9IHRoaXMuanNTdHlsZU5hbWUocGFpci5zcGxpdCgnOicpWzBdKTtcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gdGhpcy5zdHJpbmdSZXBsYWNlKHBhaXIuc3BsaXQoJzonKS5wb3AoKSwgJzsnLCAnJyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoa2V5ICE9ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGVba2V5XSA9IHRoaXMudHJlbSh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdHlsZTtcclxuICAgIH1cclxuXHJcbiAgICB0cmltTW9udGhBcnJheSgpIHtcclxuICAgICAgICBsZXQgbW9udGhzID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm1vbnRocy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBtb250aHMucHVzaCh0aGlzLm1vbnRoc1tpXS5zbGljZSgwLCAzKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBtb250aHM7XHJcbiAgICB9XHJcblxyXG4gICAganNTdHlsZU5hbWUobmFtZSA9ICcnKSB7XHJcbiAgICAgICAgbGV0IG5ld05hbWUgPSAnJztcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5hbWUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKG5hbWVbaV0gPT0gJy0nKSB7XHJcbiAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgICAgICBuZXdOYW1lICs9IG5hbWVbaV0udG9VcHBlckNhc2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIG5ld05hbWUgKz0gbmFtZVtpXS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3TmFtZTtcclxuICAgIH1cclxuXHJcbiAgICBjc3NTdHlsZU5hbWUobmFtZSA9ICcnKSB7XHJcbiAgICAgICAgbGV0IG5ld05hbWUgPSAnJztcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5hbWUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNDYXBpdGFsKG5hbWVbaV0pKSBuZXdOYW1lICs9ICctJztcclxuICAgICAgICAgICAgbmV3TmFtZSArPSBuYW1lW2ldLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbmV3TmFtZTtcclxuICAgIH1cclxuXHJcbiAgICB0ZXh0VG9DYW1lbENhc2VkKHRleHQgPSAnJykge1xyXG4gICAgICAgIGxldCB2YWx1ZSA9ICcnO1xyXG4gICAgICAgIGZvciAobGV0IGkgaW4gdGV4dCkge1xyXG4gICAgICAgICAgICBpZiAodGV4dFtpXSA9PSAnICcpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBlbHNlIGlmIChpID09IDApIHZhbHVlICs9IHRleHRbaV0udG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5pc3NldCh0ZXh0W2kgLSAxXSkgJiYgdGV4dFtpIC0gMV0gPT0gJyAnKSB2YWx1ZSArPSB0ZXh0W2ldLnRvVXBwZXJDYXNlKCk7XHJcbiAgICAgICAgICAgIGVsc2UgdmFsdWUgKz0gdGV4dFtpXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIGNhbWVsQ2FzZWRUb1RleHQoY2FtZWxDYXNlID0gJycpIHtcclxuICAgICAgICBsZXQgdmFsdWUgPSAnJztcclxuICAgICAgICBmb3IgKGxldCBpIGluIGNhbWVsQ2FzZSkge1xyXG4gICAgICAgICAgICBpZiAoaSAhPSAwICYmIHRoaXMuaXNDYXBpdGFsKGNhbWVsQ2FzZVtpXSkpIHZhbHVlICs9IGAgJHtjYW1lbENhc2VbaV0udG9Mb3dlckNhc2UoKX1gO1xyXG4gICAgICAgICAgICBlbHNlIHZhbHVlICs9IGNhbWVsQ2FzZVtpXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIGVtcHR5T2JqZWN0KG9iaikge1xyXG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShvYmopID09IEpTT04uc3RyaW5naWZ5KHt9KTtcclxuICAgIH1cclxuXHJcbiAgICByYW5kb20ocGFyYW1zID0geyBsaW1pdDogMSwgcmFuZ2U6IDEgfSkge1xyXG4gICAgICAgIGxldCByYW5kb207XHJcbiAgICAgICAgaWYgKHRoaXMuZW1wdHlPYmplY3QocGFyYW1zKSkge1xyXG4gICAgICAgICAgICByYW5kb20gPSBNYXRoLnJhbmRvbSgpICogMiAtIDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHRoaXMuaXNzZXQocGFyYW1zLmxpbWl0KSkge1xyXG4gICAgICAgICAgICByYW5kb20gPSBNYXRoLnJhbmRvbSgpICogcGFyYW1zLmxpbWl0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0aGlzLmlzc2V0KHBhcmFtcy5yYW5nZSkpIHtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByYW5kb207XHJcbiAgICB9XHJcblxyXG4gICAgcmFuZ2UoZW5kID0gMSwgc3RhcnQgPSAxKSB7XHJcbiAgICAgICAgbGV0IHZhbHVlID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IHN0YXJ0IHx8IDA7IGkgPCBlbmQ7IGkrKykge1xyXG4gICAgICAgICAgICB2YWx1ZS5wdXNoKGkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIGdlbmVyYXRlUmFuZG9tKGxlbmd0aCA9IDUsIHR5cGUgPSAnYWxwaGFudW0nKSB7XHJcbiAgICAgICAgbGV0IHN0cmluZztcclxuICAgICAgICBpZiAodHlwZSA9PSAnbnVtYmVyJykge1xyXG4gICAgICAgICAgICBzdHJpbmcgPSB0aGlzLmRpZ2l0cztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodHlwZSA9PSAnYWxwaGEnKSB7XHJcbiAgICAgICAgICAgIHN0cmluZyA9IHRoaXMuY2FwaXRhbHMgKyB0aGlzLnNtYWxscztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodHlwZSA9PSAnYWxwaGFudW0nKSB7XHJcbiAgICAgICAgICAgIHN0cmluZyA9IHRoaXMuY2FwaXRhbHMgKyB0aGlzLnNtYWxscyArIHRoaXMuZGlnaXRzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0eXBlID09ICdhbHBoYW51bXN5bScpIHtcclxuICAgICAgICAgICAgc3RyaW5nID0gdGhpcy5jYXBpdGFscyArIHRoaXMuc21hbGxzICsgdGhpcy5kaWdpdHMgKyB0aGlzLnN5bWJvbHM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgcmFuZG9tID0gJyc7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICByYW5kb20gKz0gc3RyaW5nW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHN0cmluZy5sZW5ndGgpXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJhbmRvbTtcclxuICAgIH1cclxuXHJcbiAgICBnZW5lcmF0ZVJhbmRvbUhleChsZW5ndGggPSA1KSB7XHJcbiAgICAgICAgdmFyIHN0cmluZyA9IHRoaXMuY2FwaXRhbHMuc2xpY2UoMCwgMykgKyB0aGlzLnNtYWxscy5zbGljZSgwLCAzKSArIHRoaXMuZGlnaXRzO1xyXG4gICAgICAgIHZhciBhbHBoYW51bWVyaWMgPSAnJztcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGFscGhhbnVtZXJpYyArPSBzdHJpbmdbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogc3RyaW5nLmxlbmd0aCldO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYWxwaGFudW1lcmljO1xyXG4gICAgfVxyXG5cclxuICAgIGdlbmVyYXRlS2V5KGxlbmd0aCA9IDUpIHtcclxuICAgICAgICBsZXQga2V5ID0gRGF0ZS5ub3coKS50b1N0cmluZyhsZW5ndGgpICsgTWF0aC5yYW5kb20oKS50b1N0cmluZyhsZW5ndGgpLnNsaWNlKDIpOy8vZ2VuZXJhdGUgdGhlIGtleVxyXG4gICAgICAgIHJldHVybiBrZXk7XHJcbiAgICB9XHJcblxyXG4gICAgZWRpdHRlZFVybChwYXJhbXMpIHtcclxuICAgICAgICB2YXIgdXJsID0gdGhpcy51cmxTcGxpdHRlcihwYXJhbXMudXJsKTtcclxuICAgICAgICB1cmwudmFyc1twYXJhbXMudG9BZGRdID0gcGFyYW1zLmFkZFZhbHVlLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudXJsTWVyZ2VyKHVybCwgcGFyYW1zLnRvQWRkKTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRDb21tYVRvTW9uZXkobW9uZXkgPSAnJykge1xyXG4gICAgICAgIHZhciBpbnZlcnNlID0gJyc7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IG1vbmV5Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgICAgICAgIGludmVyc2UgKz0gbW9uZXlbaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG1vbmV5ID0gXCJcIjtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGludmVyc2UubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IHBvc2l0aW9uID0gKGkgKyAxKSAlIDM7XHJcbiAgICAgICAgICAgIG1vbmV5ICs9IGludmVyc2VbaV07XHJcbiAgICAgICAgICAgIGlmIChwb3NpdGlvbiA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSAhPSBpbnZlcnNlLmxlbmd0aCAtIDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBtb25leSArPSAnLCc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaW52ZXJzZSA9ICcnO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSBtb25leS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgICAgICBpbnZlcnNlICs9IG1vbmV5W2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaW52ZXJzZTtcclxuICAgIH1cclxuXHJcbiAgICBpc0NhcGl0YWwodmFsdWUgPSAnJykge1xyXG4gICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPT0gMSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jYXBpdGFscy5pbmNsdWRlcyh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNhcGl0YWxpemUodmFsdWUgPSAnJykge1xyXG4gICAgICAgIGlmICghdGhpcy5pc0NhcGl0YWwodmFsdWVbMF0pKSB7XHJcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUuc3BsaXQoJycpO1xyXG4gICAgICAgICAgICB2YWx1ZVswXSA9IHRoaXMuY2FwaXRhbHNbdGhpcy5zbWFsbHMuaW5kZXhPZih2YWx1ZVswXSldO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdHJpbmdSZXBsYWNlKHZhbHVlLnRvU3RyaW5nKCksICcsJywgJycpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgZmxpcChoYXlzdGFjayA9ICcnKSB7XHJcbiAgICAgICAgcmV0dXJuIGhheXN0YWNrLnNwbGl0KCcnKS5yZXZlcnNlKCkuam9pbignJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaXNTbWFsbCh2YWx1ZSA9ICcnKSB7XHJcbiAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCA9PSAxKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNtYWxscy5pbmNsdWRlcyh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlzU3ltYm9sKHZhbHVlID0gJycpIHtcclxuICAgICAgICBpZiAodmFsdWUubGVuZ3RoID09IDEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3ltYm9scy5pbmNsdWRlcyh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlzTmFtZSh2YWx1ZSA9ICcnKSB7XHJcbiAgICAgICAgZm9yICh2YXIgeCBpbiB2YWx1ZSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0RpZ2l0KHZhbHVlW3hdKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGlzUGFzc3dvcmRWYWxpZCh2YWx1ZSA9ICcnKSB7XHJcbiAgICAgICAgdmFyIGxlbiA9IHZhbHVlLmxlbmd0aDtcclxuICAgICAgICBpZiAobGVuID4gNykge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBhIGluIHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0NhcGl0YWwodmFsdWVbYV0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgYiBpbiB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1NtYWxsKHZhbHVlW2JdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgYyBpbiB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzRGlnaXQodmFsdWVbY10pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGQgaW4gdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzU3ltYm9sKHZhbHVlW2RdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBpc1N1YlN0cmluZyhoYXlzdGFjayA9ICcnLCB2YWx1ZSA9ICcnKSB7XHJcbiAgICAgICAgaWYgKGhheXN0YWNrLmluZGV4T2YodmFsdWUpICE9IC0xKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgaXNEaWdpdCh2YWx1ZSA9ICcnKSB7XHJcbiAgICAgICAgdmFsdWUgPSBuZXcgU3RyaW5nKHZhbHVlKVxyXG4gICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPT0gMSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kaWdpdHMuaW5jbHVkZXModmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgaXNFbWFpbCh2YWx1ZSA9ICcnKSB7XHJcbiAgICAgICAgdmFyIGVtYWlsX3BhcnRzID0gdmFsdWUuc3BsaXQoJ0AnKTtcclxuICAgICAgICBpZiAoZW1haWxfcGFydHMubGVuZ3RoICE9IDIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzU3BhY2VTdHJpbmcoZW1haWxfcGFydHNbMF0pKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGRvdF9wYXJ0cyA9IGVtYWlsX3BhcnRzWzFdLnNwbGl0KCcuJyk7XHJcbiAgICAgICAgICAgIGlmIChkb3RfcGFydHMubGVuZ3RoICE9IDIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzU3BhY2VTdHJpbmcoZG90X3BhcnRzWzBdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzU3BhY2VTdHJpbmcoZG90X3BhcnRzWzFdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBpc1RydXRoeSh2YWx1ZSkge1xyXG4gICAgICAgIGxldCB0cnV0aHk7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnYm9vbGVhbicpIHtcclxuICAgICAgICAgICAgdHJ1dGh5ID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICB0cnV0aHkgPSAodmFsdWUudG9Mb2NhbGVMb3dlckNhc2UoKSA9PSAndHJ1ZScgfHwgdmFsdWUudG9Mb2NhbGVMb3dlckNhc2UoKSA9PSAnMScpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicpIHtcclxuICAgICAgICAgICAgdHJ1dGh5ID0gKHZhbHVlID09IDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1dGh5O1xyXG4gICAgfVxyXG5cclxuICAgIGlzRmFsc3kodmFsdWUpIHtcclxuICAgICAgICBsZXQgZmFsc3k7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnYm9vbGVhbicpIHtcclxuICAgICAgICAgICAgZmFsc3kgPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIHZhbHVlID09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIGZhbHN5ID0gKHZhbHVlLnRvTG9jYWxlTG93ZXJDYXNlKCkgPT0gJ2ZhbHNlJyB8fCB2YWx1ZS50b0xvY2FsZUxvd2VyQ2FzZSgpID09ICcwJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJykge1xyXG4gICAgICAgICAgICBmYWxzeSA9ICh2YWx1ZSA9PSAwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHN5O1xyXG4gICAgfVxyXG5cclxuICAgIG9iamVjdExlbmd0aChvYmplY3QgPSB7fSkge1xyXG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhvYmplY3QpLmxlbmd0aDtcclxuICAgIH1cclxuXHJcbiAgICBpc1NwYWNlU3RyaW5nKHZhbHVlID0gJycpIHtcclxuICAgICAgICBpZiAodmFsdWUgPT0gJycpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgeCBpbiB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlW3hdICE9ICcgJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBoYXNTdHJpbmcoaGF5c3RhY2sgPSAnJywgbmVlZGxlID0gJycpIHtcclxuICAgICAgICBmb3IgKHZhciB4IGluIGhheXN0YWNrKSB7XHJcbiAgICAgICAgICAgIGlmIChuZWVkbGUgPT0gaGF5c3RhY2tbeF0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICB0cmVtKG5lZWRsZSA9ICcnKSB7XHJcbiAgICAgICAgLy9yZW1vdmUgdGhlIHByZXBlbmRlZCBzcGFjZXNcclxuICAgICAgICBpZiAobmVlZGxlWzBdID09ICcgJykge1xyXG4gICAgICAgICAgICB2YXIgbmV3X25lZWRsZSA9ICcnO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5lZWRsZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGkgIT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld19uZWVkbGUgKz0gbmVlZGxlW2ldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG5lZWRsZSA9IHRoaXMudHJlbShuZXdfbmVlZGxlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vcmVtb3ZlIHRoZSBhcHBlbmRlZCBzcGFjZXNcclxuICAgICAgICBpZiAobmVlZGxlW25lZWRsZS5sZW5ndGggLSAxXSA9PSAnICcpIHtcclxuICAgICAgICAgICAgdmFyIG5ld19uZWVkbGUgPSAnJztcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuZWVkbGUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChpICE9IG5lZWRsZS5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3X25lZWRsZSArPSBuZWVkbGVbaV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbmVlZGxlID0gdGhpcy50cmVtKG5ld19uZWVkbGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmVlZGxlO1xyXG4gICAgfVxyXG5cclxuICAgIHN0cmluZ1JlcGxhY2Uod29yZCA9ICcnLCBmcm9tID0gJycsIHRvID0gJycpIHtcclxuICAgICAgICB2YXIgdmFsdWUgPSAnJztcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHdvcmQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHdvcmRbaV0gPT0gZnJvbSkge1xyXG4gICAgICAgICAgICAgICAgdmFsdWUgKz0gdG87XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSArPSB3b3JkW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBjb252ZXJUb1JlYWxQYXRoKHBhdGggPSAnJykge1xyXG4gICAgICAgIGlmIChwYXRoW3BhdGgubGVuZ3RoIC0gMV0gIT0gJy8nKSB7XHJcbiAgICAgICAgICAgIHBhdGggKz0gJy8nO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcGF0aDtcclxuICAgIH1cclxuXHJcbiAgICBpc1NwYWNpYWxDaGFyYWN0ZXIoY2hhciA9ICcnKSB7XHJcbiAgICAgICAgdmFyIHNwZWNpYWxjaGFyYWN0ZXJzID0gXCInXFxcXC86Pyo8PnwhLlwiO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3BlY2lhbGNoYXJhY3RlcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHNwZWNpYWxjaGFyYWN0ZXJzW2ldID09IGNoYXIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBjb3VudENoYXIoaGF5c3RhY2sgPSAnJywgbmVlZGxlID0gJycpIHtcclxuICAgICAgICB2YXIgaiA9IDA7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBoYXlzdGFjay5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoaGF5c3RhY2tbaV0gPT0gbmVlZGxlKSB7XHJcbiAgICAgICAgICAgICAgICBqKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGo7XHJcbiAgICB9XHJcblxyXG4gICAgb2NjdXJhbmNlc09mKGhheXN0YWNrID0gJycsIG5lZWRsZSA9ICcnKSB7XHJcbiAgICAgICAgbGV0IG9jY3VyYW5jZXMgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGhheXN0YWNrLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChoYXlzdGFja1tpXSA9PT0gbmVlZGxlKSB7XHJcbiAgICAgICAgICAgICAgICBvY2N1cmFuY2VzLnB1c2goaSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvY2N1cmFuY2VzO1xyXG4gICAgfVxyXG5cclxuICAgIGlzc2V0KHZhcmlhYmxlKSB7XHJcbiAgICAgICAgcmV0dXJuICh0eXBlb2YgdmFyaWFibGUgIT09ICd1bmRlZmluZWQnKTtcclxuICAgIH1cclxuXHJcbiAgICBpc251bGwodmFyaWFibGUpIHtcclxuICAgICAgICByZXR1cm4gdmFyaWFibGUgPT0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBub3ROdWxsKHZhcmlhYmxlKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNzZXQodmFyaWFibGUpICYmICF0aGlzLmlzbnVsbCh2YXJpYWJsZSk7XHJcbiAgICB9XHJcblxyXG4gICAgaXNBcnJheSh2YXJpYWJsZSkge1xyXG4gICAgICAgIGxldCBmbGFnID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB2YXJpYWJsZSA9PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICBmbGFnID0gdmFyaWFibGUuY29uc3RydWN0b3IgPT09IEFycmF5O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmxhZztcclxuICAgIH1cclxuXHJcbiAgICBpc09iamVjdCh2YXJpYWJsZSkge1xyXG4gICAgICAgIGxldCBmbGFnID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB2YXJpYWJsZSA9PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICBmbGFnID0gdmFyaWFibGUuY29uc3RydWN0b3IgPT09IE9iamVjdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZsYWc7XHJcbiAgICB9XHJcblxyXG4gICAgaXNTdHJpbmcodmFyaWFibGUpIHtcclxuICAgICAgICBsZXQgZmxhZyA9IGZhbHNlO1xyXG4gICAgICAgIGlmICh0eXBlb2YgdmFyaWFibGUgPT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgZmxhZyA9IHZhcmlhYmxlLmNvbnN0cnVjdG9yID09PSBTdHJpbmc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmbGFnO1xyXG4gICAgfVxyXG5cclxuICAgIGlzTnVtYmVyKHZhcmlhYmxlKSB7XHJcbiAgICAgICAgbGV0IGZsYWcgPSBmYWxzZTtcclxuICAgICAgICBpZiAodHlwZW9mIHZhcmlhYmxlID09ICdudW1iZXInKSB7XHJcbiAgICAgICAgICAgIGZsYWcgPSB2YXJpYWJsZS5jb25zdHJ1Y3RvciA9PT0gTnVtYmVyO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmxhZztcclxuICAgIH1cclxuXHJcbiAgICBpc0Jvb2wodmFyaWFibGUpIHtcclxuICAgICAgICBsZXQgZmxhZyA9IGZhbHNlO1xyXG4gICAgICAgIGlmICh0eXBlb2YgdmFyaWFibGUgPT0gJ2Jvb2xlYW4nKSB7XHJcbiAgICAgICAgICAgIGZsYWcgPSB2YXJpYWJsZS5jb25zdHJ1Y3RvciA9PT0gQm9vbGVhbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZsYWc7XHJcbiAgICB9XHJcblxyXG4gICAgaXNmdW5jdGlvbih2YXJpYWJsZSkge1xyXG4gICAgICAgIHJldHVybiAodHlwZW9mIHZhcmlhYmxlID09PSAnZnVuY3Rpb24nKTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBydW5QYXJhbGxlbChmdW5jdGlvbnMgPSBbXSwgY2FsbEJhY2sgPSAoKSA9PiB7IH0pIHtcclxuICAgICAgICBsZXQgcmVzdWx0cyA9IHt9O1xyXG4gICAgICAgIGZvciAobGV0IGYgaW4gZnVuY3Rpb25zKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdHNbZl0gPSBhd2FpdCBmdW5jdGlvbnNbZl07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhbGxCYWNrKHJlc3VsdHMpO1xyXG4gICAgfVxyXG5cclxuICAgIGlzTW9iaWxlKCkge1xyXG4gICAgICAgIHJldHVybiAoL0FuZHJvaWR8d2ViT1N8aVBob25lfGlQYWR8aVBvZHxCbGFja0JlcnJ5fElFTW9iaWxlfE9wZXJhIE1pbmkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpKTtcclxuICAgIH1cclxuXHJcbiAgICB1cmxNZXJnZXIoc3BsaXRVcmwgPSAnJywgbGFzdFF1ZXJ5ID0gJycpIHtcclxuICAgICAgICB2YXIgaG9zdFR5cGUgPSAodGhpcy5pc3NldChzcGxpdFVybC5ob3N0VHlwZSkpID8gc3BsaXRVcmwuaG9zdFR5cGUgOiAnaHR0cCc7XHJcbiAgICAgICAgdmFyIGhvc3ROYW1lID0gKHRoaXMuaXNzZXQoc3BsaXRVcmwuaG9zdE5hbWUpKSA/IHNwbGl0VXJsLmhvc3ROYW1lIDogJyc7XHJcbiAgICAgICAgdmFyIHBvcnQgPSAodGhpcy5pc3NldChzcGxpdFVybC5ob3N0KSkgPyBzcGxpdFVybC5wb3J0IDogJyc7XHJcbiAgICAgICAgdmFyIHBhdGhOYW1lID0gKHRoaXMuaXNzZXQoc3BsaXRVcmwucGF0aE5hbWUpKSA/IHNwbGl0VXJsLnBhdGhOYW1lIDogJyc7XHJcbiAgICAgICAgdmFyIHF1ZXJpZXMgPSAnPyc7XHJcbiAgICAgICAgdmFyIGtlZXBNYXBwaW5nID0gdHJ1ZTtcclxuICAgICAgICAodGhpcy5pc3NldChzcGxpdFVybC52YXJzKSkgP1xyXG4gICAgICAgICAgICBPYmplY3Qua2V5cyhzcGxpdFVybC52YXJzKS5tYXAoa2V5ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChrZWVwTWFwcGluZykgcXVlcmllcyArPSBrZXkgKyAnPScgKyBzcGxpdFVybC52YXJzW2tleV0gKyAnJic7XHJcbiAgICAgICAgICAgICAgICBpZiAoa2V5ID09IGxhc3RRdWVyeSkga2VlcE1hcHBpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgfSkgOiAnJztcclxuICAgICAgICB2YXIgbG9jYXRpb24gPSBob3N0VHlwZSArICc6Oi8nICsgaG9zdE5hbWUgKyAnOicgKyBwb3J0ICsgJy8nICsgcGF0aE5hbWUgKyBxdWVyaWVzO1xyXG4gICAgICAgIGxvY2F0aW9uID0gKGxvY2F0aW9uLmxhc3RJbmRleE9mKCcmJykgPT0gbG9jYXRpb24ubGVuZ3RoIC0gMSkgPyBsb2NhdGlvbi5zbGljZSgwLCBsb2NhdGlvbi5sZW5ndGggLSAxKSA6IGxvY2F0aW9uO1xyXG4gICAgICAgIGxvY2F0aW9uID0gKGxvY2F0aW9uLmxhc3RJbmRleE9mKCc9JykgPT0gbG9jYXRpb24ubGVuZ3RoIC0gMSkgPyBsb2NhdGlvbi5zbGljZSgwLCBsb2NhdGlvbi5sZW5ndGggLSAxKSA6IGxvY2F0aW9uO1xyXG4gICAgICAgIHJldHVybiBsb2NhdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICB1cmxTcGxpdHRlcihsb2NhdGlvbiA9ICcnKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNzZXQobG9jYXRpb24pKSB7XHJcbiAgICAgICAgICAgIGxvY2F0aW9uID0gbG9jYXRpb24udG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgbGV0IHByb3RvY29sID0gKGxvY2F0aW9uLmluZGV4T2YoJzovLycpID09PSAtMSkgPyB1bmRlZmluZWQgOiBsb2NhdGlvbi5zcGxpdCgnOi8vJylbMF07XHJcbiAgICAgICAgICAgIGxldCBmdWxsUGF0aCA9IGxvY2F0aW9uLnNwbGl0KCc6Ly8nKVsxXTtcclxuICAgICAgICAgICAgbGV0IGhvc3QgPSBmdWxsUGF0aC5zcGxpdCgnLycpWzBdO1xyXG4gICAgICAgICAgICBsZXQgaG9zdE5hbWUgPSBob3N0LnNwbGl0KCc6JylbMF07XHJcbiAgICAgICAgICAgIGxldCBwb3J0ID0gaG9zdC5zcGxpdCgnOicpWzFdO1xyXG4gICAgICAgICAgICBsZXQgcGF0aCA9IGZ1bGxQYXRoLnNsaWNlKGZ1bGxQYXRoLmluZGV4T2YoJy8nKSk7XHJcbiAgICAgICAgICAgIGxldCBwYXRoTmFtZSA9IHBhdGguc3BsaXQoJz8nKVswXS5zcGxpdCgnIycpWzBdO1xyXG4gICAgICAgICAgICBsZXQgaGFzaCA9IHBhdGguc2xpY2UocGF0aC5pbmRleE9mKCcjJykpO1xyXG4gICAgICAgICAgICBsZXQgcXVlcmllcyA9IChwYXRoLmluZGV4T2YoJyMnKSA+IHBhdGguaW5kZXhPZignPycpKSA/IHBhdGguc2xpY2UocGF0aC5pbmRleE9mKCc/JykpIDogbnVsbDtcclxuICAgICAgICAgICAgbGV0IHZhcnMgPSB7fTtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmlzbnVsbChxdWVyaWVzKSkge1xyXG4gICAgICAgICAgICAgICAgcXVlcmllcyA9IHF1ZXJpZXMuc2xpY2UoMCwgcXVlcmllcy5pbmRleE9mKCcjJykpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHF1ZXJ5ID0gcXVlcmllcy5zbGljZShxdWVyaWVzLmluZGV4T2YoJz8nKSArIDEpLnNwbGl0KCcmJyk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB4IGluIHF1ZXJ5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBhcnRzID0gcXVlcnlbeF0uc3BsaXQoJz0nKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocGFydHNbMV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyc1t0aGlzLnN0cmluZ1JlcGxhY2UocGFydHNbMF0sICctJywgJyAnKV0gPSB0aGlzLnN0cmluZ1JlcGxhY2UocGFydHNbMV0sICctJywgJyAnKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXJzW3RoaXMuc3RyaW5nUmVwbGFjZShwYXJ0c1swXSwgJy0nLCAnICcpXSA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgaHR0cGhvc3QgPSBwcm90b2NvbCArICc6Ly8nICsgaG9zdDtcclxuXHJcbiAgICAgICAgICAgIGxldCBzcGxpdEhvc3QgPSBob3N0LnNwbGl0KCcuJyk7XHJcbiAgICAgICAgICAgIGxldCBkb21haW4gPSBob3N0O1xyXG5cclxuICAgICAgICAgICAgaWYgKGlzTmFOKHRoaXMuc3RyaW5nUmVwbGFjZShob3N0TmFtZSwgJy4nLCAnJykpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3BsaXRIb3N0Lmxlbmd0aCA+IDIpIHNwbGl0SG9zdC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgZG9tYWluID0gc3BsaXRIb3N0LmpvaW4oJy4nKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHsgbG9jYXRpb24sIHByb3RvY29sLCBmdWxsUGF0aCwgaG9zdCwgaHR0cGhvc3QsIGhvc3ROYW1lLCBwb3J0LCBwYXRoLCBwYXRoTmFtZSwgcXVlcmllcywgdmFycywgaGFzaCwgZG9tYWluIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldFVybFZhcnMobG9jYXRpb24gPSAnJykge1xyXG4gICAgICAgIGxvY2F0aW9uID0gbG9jYXRpb24udG9TdHJpbmcoKTtcclxuICAgICAgICB2YXIgcXVlcmllcyA9IChsb2NhdGlvbi5pbmRleE9mKCc/JykgPT09IC0xKSA/IG51bGwgOiBsb2NhdGlvbi5zcGxpdCgnPycpLnBvcCgwKTtcclxuICAgICAgICB2YXIgdmFycyA9IHt9O1xyXG5cclxuICAgICAgICBpZiAocXVlcmllcyAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHZhciBxdWVyeSA9IHF1ZXJpZXMuc3BsaXQoJyYnKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgeCBpbiBxdWVyeSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhcnRzID0gcXVlcnlbeF0uc3BsaXQoJz0nKTtcclxuICAgICAgICAgICAgICAgIGlmIChwYXJ0c1sxXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhcnNbdGhpcy5zdHJpbmdSZXBsYWNlKHBhcnRzWzBdLCAnLScsICcgJyldID0gdGhpcy5zdHJpbmdSZXBsYWNlKHBhcnRzWzFdLCAnLScsICcgJyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhcnNbdGhpcy5zdHJpbmdSZXBsYWNlKHBhcnRzWzBdLCAnLScsICcgJyldID0gJyc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZhcnM7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyU2l6ZSh2YWx1ZSkge1xyXG4gICAgICAgIGxldCBvYmplY3RMaXN0ID0gW107XHJcblxyXG4gICAgICAgIGxldCByZWN1cnNlID0gKG9iamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgYnl0ZXMgPSAwO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIG9iamVjdCA9PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgYnl0ZXMgKz0gb2JqZWN0Lmxlbmd0aCAqIDI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIG9iamVjdCA9PSAnbnVtYmVyJykge1xyXG4gICAgICAgICAgICAgICAgYnl0ZXMgKz0gODtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlb2Ygb2JqZWN0ID09ICdib29sZWFuJykge1xyXG4gICAgICAgICAgICAgICAgYnl0ZXMgKz0gNDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlb2Ygb2JqZWN0ID09ICdvYmplY3QnICYmIG9iamVjdExpc3QuaW5kZXhPZihvYmplY3QpID09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBvYmplY3RMaXN0LnB1c2gob2JqZWN0KTtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpIGluIG9iamVjdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJ5dGVzICs9IHJlY3Vyc2UoaSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnl0ZXMgKz0gcmVjdXJzZShvYmplY3RbaV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gYnl0ZXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmVjdXJzZSh2YWx1ZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRnVuYzsiLCJjb25zdCBQZXJpb2QgPSByZXF1aXJlKCcuL1BlcmlvZCcpO1xyXG5jbGFzcyBFbXB0eSB7XHJcbn1cclxuXHJcbmNsYXNzIEpTRWxlbWVudHMgZXh0ZW5kcyBQZXJpb2Qge1xyXG4gICAgY29uc3RydWN0b3IodGhlV2luZG93ID0gRW1wdHkpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuRWxlbWVudCA9IHRoZVdpbmRvdy5FbGVtZW50O1xyXG4gICAgICAgIHRoaXMuZG9jdW1lbnQgPSB0aGVXaW5kb3cuZG9jdW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZENzcyhocmVmID0gJycpIHtcclxuICAgICAgICBsZXQgZWxlbWVudCA9IHRoaXMuY3JlYXRlRWxlbWVudCh7IGVsZW1lbnQ6ICdsaW5rJywgYXR0cmlidXRlczogeyByZWw6ICdzdHlsZXNoZWV0JywgdHlwZTogJ3RleHQvY3NzJywgaHJlZiB9IH0pO1xyXG4gICAgICAgIGlmICh0aGlzLmRvY3VtZW50ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZG9jdW1lbnRbJ2hlYWQnXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRvY3VtZW50WydoZWFkJ10uYXBwZW5kKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGpzb25Gb3JtKGZvcm0pIHtcclxuICAgICAgICBsZXQganNvbiA9IHt9O1xyXG4gICAgICAgIGxldCBwZXJmb3JtID0gKGVsZW1lbnQpID0+IHtcclxuICAgICAgICAgICAgbGV0IGNoaWxkcmVuID0gZWxlbWVudC5jaGlsZHJlbjtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgcGVyZm9ybShjaGlsZHJlbltpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQuaGFzQXR0cmlidXRlKCduYW1lJykpIHtcclxuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LnR5cGUgPT0gJ2ZpbGUnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQuaGFzQXR0cmlidXRlKCdtdWx0aXBsZScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGpzb25bZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ25hbWUnKV0gPSBlbGVtZW50LmZpbGVzO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAganNvbltlbGVtZW50LmdldEF0dHJpYnV0ZSgnbmFtZScpXSA9IGVsZW1lbnQuZmlsZXNbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAganNvbltlbGVtZW50LmdldEF0dHJpYnV0ZSgnbmFtZScpXSA9IGVsZW1lbnQudmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHBlcmZvcm0oZm9ybSk7XHJcbiAgICAgICAgcmV0dXJuIGpzb247XHJcbiAgICB9XHJcblxyXG4gICAganNvbkVsZW1lbnQoX2VsZW1lbnRfKSB7XHJcbiAgICAgICAgbGV0IGVsZW1lbnQgPSBfZWxlbWVudF8ubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICBsZXQgYXR0cmlidXRlcyA9IF9lbGVtZW50Xy5nZXRBdHRyaWJ1dGVzKCk7XHJcbiAgICAgICAgYXR0cmlidXRlcy5zdHlsZSA9IF9lbGVtZW50Xy5jc3MoKTtcclxuICAgICAgICBsZXQgY2hpbGRyZW4gPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IF9lbGVtZW50Xy5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjaGlsZHJlbi5wdXNoKF9lbGVtZW50Xy5jaGlsZHJlbltpXS50b0pzb24oKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7IGVsZW1lbnQsIGF0dHJpYnV0ZXMsIGNoaWxkcmVuIH1cclxuICAgIH1cclxuXHJcbiAgICBpc0VsZW1lbnQob2JqZWN0KSB7XHJcbiAgICAgICAgcmV0dXJuIG9iamVjdCBpbnN0YW5jZW9mIHRoaXMuRWxlbWVudDtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVGcm9tT2JqZWN0KG9iamVjdCA9IHt9LCBzaW5nbGVQYXJlbnQpIHtcclxuICAgICAgICBsZXQgY3JlYXRlZCwgbmFtZTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNFbGVtZW50KG9iamVjdCkpIHtcclxuICAgICAgICAgICAgY3JlYXRlZCA9IG9iamVjdDtcclxuICAgICAgICAgICAgbmFtZSA9IGNyZWF0ZWQubm9kZU5hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHRoaXMuaXNFbGVtZW50KG9iamVjdC5lbGVtZW50KSkge1xyXG4gICAgICAgICAgICBjcmVhdGVkID0gb2JqZWN0LmVsZW1lbnQ7XHJcbiAgICAgICAgICAgIG5hbWUgPSBjcmVhdGVkLm5vZGVOYW1lO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgbmFtZSA9IG9iamVjdC5lbGVtZW50LnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgIGNyZWF0ZWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG9iamVjdC5lbGVtZW50KTsvL2dlbmVyYXRlIHRoZSBlbGVtZW50XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNzZXQob2JqZWN0LmF0dHJpYnV0ZXMpICYmICF0aGlzLmlzRWxlbWVudChvYmplY3QpKSB7Ly9zZXQgdGhlIGF0dHJpYnV0ZXNcclxuICAgICAgICAgICAgZm9yICh2YXIgYXR0ciBpbiBvYmplY3QuYXR0cmlidXRlcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGF0dHIgPT0gJ3N0eWxlJykgey8vc2V0IHRoZSBzdHlsZXNcclxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVkLmNzcyhvYmplY3QuYXR0cmlidXRlc1thdHRyXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGNyZWF0ZWQuc2V0QXR0cmlidXRlKGF0dHIsIG9iamVjdC5hdHRyaWJ1dGVzW2F0dHJdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNzZXQob2JqZWN0LnRleHQpKSB7XHJcbiAgICAgICAgICAgIGNyZWF0ZWQudGV4dENvbnRlbnQgPSBvYmplY3QudGV4dDsvL3NldCB0aGUgaW5uZXJUZXh0XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5pc3NldChvYmplY3QuaHRtbCkpIHtcclxuICAgICAgICAgICAgY3JlYXRlZC5pbm5lckhUTUwgPSBvYmplY3QuaHRtbDsvL3NldCB0aGUgaW5uZXJIVE1MXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5pc3NldChvYmplY3QudmFsdWUpKSB7XHJcbiAgICAgICAgICAgIGNyZWF0ZWQudmFsdWUgPSBvYmplY3QudmFsdWU7Ly9zZXQgdGhlIHZhbHVlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobmFtZS5pbmNsdWRlcygnLScpKSB7XHJcbiAgICAgICAgICAgIGNyZWF0ZWQgPSB0aGlzLmNyZWF0ZUZyb21IVE1MKGNyZWF0ZWQub3V0ZXJIVE1MKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzc2V0KHNpbmdsZVBhcmVudCkpIHtcclxuICAgICAgICAgICAgc2luZ2xlUGFyZW50LmF0dGFjaEVsZW1lbnQoY3JlYXRlZCwgb2JqZWN0LmF0dGFjaG1lbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNzZXQob2JqZWN0LmNoaWxkcmVuKSkge1xyXG4gICAgICAgICAgICBjcmVhdGVkLm1ha2VFbGVtZW50KG9iamVjdC5jaGlsZHJlbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5pc3NldChvYmplY3Qub3B0aW9ucykgJiYgQXJyYXkuaXNBcnJheShvYmplY3Qub3B0aW9ucykpIHsvL2FkZCBvcHRpb25zIGlmIGlzc2V0ICAgICAgICAgICBcclxuICAgICAgICAgICAgZm9yICh2YXIgaSBvZiBvYmplY3Qub3B0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgbGV0IG9wdGlvbiA9IGNyZWF0ZWQubWFrZUVsZW1lbnQoeyBlbGVtZW50OiAnb3B0aW9uJywgdmFsdWU6IGksIHRleHQ6IGksIGF0dGFjaG1lbnQ6ICdhcHBlbmQnIH0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNzZXQob2JqZWN0LnNlbGVjdGVkKSAmJiBvYmplY3Quc2VsZWN0ZWQgPT0gaSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbi5zZXRBdHRyaWJ1dGUoJ3NlbGVjdGVkJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoaS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkgPT0gJ251bGwnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNzZXQoY3JlYXRlZC5kYXRhc2V0Lmljb24pKSB7XHJcbiAgICAgICAgICAgIGNyZWF0ZWQuYWRkQ2xhc3NlcyhjcmVhdGVkLmRhdGFzZXQuaWNvbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gY3JlYXRlZDtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVGcm9tSFRNTChodG1sU3RyaW5nID0gJycsIHNpbmdsZVBhcmVudCkge1xyXG4gICAgICAgIGxldCBwYXJzZXIgPSBuZXcgRE9NUGFyc2VyKCk7XHJcbiAgICAgICAgbGV0IGh0bWwgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKGh0bWxTdHJpbmcsICd0ZXh0L2h0bWwnKTtcclxuXHJcbiAgICAgICAgbGV0IGNyZWF0ZWQgPSBodG1sLmJvZHkuZmlyc3RDaGlsZDtcclxuXHJcbiAgICAgICAgaWYgKGh0bWxTdHJpbmcuaW5kZXhPZignaHRtbCcpID09IDEpIHtcclxuICAgICAgICAgICAgY3JlYXRlZCA9IGh0bWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGh0bWxTdHJpbmcuaW5kZXhPZignYm9keScpID09IDEpIHtcclxuICAgICAgICAgICAgY3JlYXRlZCA9IGh0bWwuYm9keTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzc2V0KHNpbmdsZVBhcmVudCkpIHNpbmdsZVBhcmVudC5hdHRhY2hFbGVtZW50KGNyZWF0ZWQsIHNpbmdsZVBhcmVudC5hdHRhY2htZW50KTtcclxuICAgICAgICByZXR1cm4gY3JlYXRlZDtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVQZXJjZXB0b3JFbGVtZW50KG9iamVjdCwgc2luZ2xlUGFyZW50KSB7XHJcbiAgICAgICAgbGV0IGNyZWF0ZWQgPSB0aGlzW29iamVjdC5wZXJjZXB0b3JFbGVtZW50XShvYmplY3QucGFyYW1zKTtcclxuICAgICAgICBpZiAodGhpcy5pc3NldChzaW5nbGVQYXJlbnQpKSB7XHJcbiAgICAgICAgICAgIHNpbmdsZVBhcmVudC5hdHRhY2hFbGVtZW50KGNyZWF0ZWQsIG9iamVjdC5hdHRhY2htZW50KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNyZWF0ZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RWxlbWVudChzaW5nbGVQYXJhbSA9IHsgZWxlbWVudDogJycsIGF0dHJpYnV0ZXM6IHt9IH0sIHNpbmdsZVBhcmVudCkge1xyXG4gICAgICAgIHZhciBlbGVtZW50O1xyXG4gICAgICAgIC8vaWYgcGFyYW1zIGlzIGEgSFRNTCBTdHJpbmdcclxuICAgICAgICBpZiAodHlwZW9mIHNpbmdsZVBhcmFtID09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQgPSB0aGlzLmNyZWF0ZUZyb21IVE1MKHNpbmdsZVBhcmFtLCBzaW5nbGVQYXJlbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0aGlzLmlzRWxlbWVudChzaW5nbGVQYXJhbSkpIHtcclxuICAgICAgICAgICAgZWxlbWVudCA9IHNpbmdsZVBhcmFtO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc3NldChzaW5nbGVQYXJlbnQpKSBzaW5nbGVQYXJlbnQuYXR0YWNoRWxlbWVudChlbGVtZW50LCBzaW5nbGVQYXJhbS5hdHRhY2htZW50KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy9pZiBwYXJhbXMgaXMgb2JqZWN0XHJcbiAgICAgICAgZWxzZSBpZiAoc2luZ2xlUGFyYW0uY29uc3RydWN0b3IgPT0gT2JqZWN0KSB7XHJcbiAgICAgICAgICAgIGlmIChzaW5nbGVQYXJhbS5wZXJjZXB0b3JFbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gdGhpcy5jcmVhdGVQZXJjZXB0b3JFbGVtZW50KHNpbmdsZVBhcmFtLCBzaW5nbGVQYXJlbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudCA9IHRoaXMuY3JlYXRlRnJvbU9iamVjdChzaW5nbGVQYXJhbSwgc2luZ2xlUGFyZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNzZXQoZWxlbWVudC5zZXRLZXkpICYmICF0aGlzLmlzc2V0KGVsZW1lbnQuZGF0YXNldC5kb21LZXkpKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuc2V0S2V5KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5pc3NldChzaW5nbGVQYXJhbS5saXN0KSkge1xyXG4gICAgICAgICAgICBsZXQgbGlzdCA9IGVsZW1lbnQubWFrZUVsZW1lbnQoeyBlbGVtZW50OiAnZGF0YWxpc3QnLCBvcHRpb25zOiBzaW5nbGVQYXJhbS5saXN0IH0pO1xyXG4gICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnbGlzdCcsIGVsZW1lbnQuZGF0YXNldC5kb21LZXkpO1xyXG4gICAgICAgICAgICBsaXN0LnNldEF0dHJpYnV0ZSgnaWQnLCBlbGVtZW50LmRhdGFzZXQuZG9tS2V5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzc2V0KHNpbmdsZVBhcmFtLnN0YXRlKSkge1xyXG4gICAgICAgICAgICBsZXQgb3duZXIgPSBlbGVtZW50LmdldFBhcmVudHMoc2luZ2xlUGFyYW0uc3RhdGUub3duZXIsIHNpbmdsZVBhcmFtLnN0YXRlLnZhbHVlKTtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmlzbnVsbChvd25lcikpIHtcclxuICAgICAgICAgICAgICAgIG93bmVyLmFkZFN0YXRlKHsgbmFtZTogc2luZ2xlUGFyYW0uc3RhdGUubmFtZSwgc3RhdGU6IGVsZW1lbnQgfSk7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LmRhdGFzZXQuc3RhdGVTdGF0dXMgPSAnc2V0JztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuZGF0YXNldC5zdGF0ZVN0YXR1cyA9ICdwZW5kaW5nJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICB9O1xyXG5cclxuICAgIGNyZWF0ZUVsZW1lbnQocGFyYW1zID0geyBlbGVtZW50OiAnJywgYXR0cmlidXRlczoge30gfSwgcGFyZW50KSB7XHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocGFyYW1zKSkge1xyXG4gICAgICAgICAgICBsZXQgZWxlbWVudHMgPSBbXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgcGFyYW0gb2YgcGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50cy5wdXNoKHRoaXMuZ2V0RWxlbWVudChwYXJhbSwgcGFyZW50KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnRzO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBlbGVtZW50ID0gdGhpcy5nZXRFbGVtZW50KHBhcmFtcywgcGFyZW50KTtcclxuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHZhbGlkYXRlRm9ybVRleHRhcmVhKGVsZW1lbnQpIHtcclxuICAgICAgICBpZiAoZWxlbWVudC52YWx1ZSA9PSAnJykge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHZhbGlkYXRlRm9ybUlucHV0KGVsZW1lbnQpIHtcclxuICAgICAgICB2YXIgdHlwZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCd0eXBlJyk7XHJcbiAgICAgICAgdmFyIHZhbHVlID0gZWxlbWVudC52YWx1ZTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNudWxsKHR5cGUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAhdGhpcy5pc1NwYWNlU3RyaW5nKHZhbHVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHR5cGUgPSB0eXBlLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgaWYgKHR5cGUgPT0gJ2ZpbGUnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZSAhPSAnJztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodHlwZSA9PSAndGV4dCcpIHtcclxuICAgICAgICAgICAgcmV0dXJuICF0aGlzLmlzU3BhY2VTdHJpbmcodmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0eXBlID09ICdkYXRlJykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5oYXNTdHJpbmcoZWxlbWVudC5jbGFzc05hbWUsICdmdXR1cmUnKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXNEYXRlKHZhbHVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmlzRGF0ZVZhbGlkKHZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0eXBlID09ICdlbWFpbCcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXNFbWFpbCh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHR5cGUgPT0gJ251bWJlcicpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXNOdW1iZXIodmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0eXBlID09ICdwYXNzd29yZCcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXNQYXNzd29yZFZhbGlkKHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiAhdGhpcy5pc1NwYWNlU3RyaW5nKHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdmFsaWRhdGVGb3JtU2VsZWN0KGVsZW1lbnQpIHtcclxuICAgICAgICBpZiAoZWxlbWVudC52YWx1ZSA9PSAwIHx8IGVsZW1lbnQudmFsdWUudG9Mb3dlckNhc2UoKSA9PSAnbnVsbCcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgdmFsaWRhdGVGb3JtKGZvcm0sIG9wdGlvbnMpIHtcclxuICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuICAgICAgICBvcHRpb25zLm5vZGVOYW1lcyA9IG9wdGlvbnMubm9kZU5hbWVzIHx8ICdJTlBVVCwgU0VMRUNULCBURVhUQVJFQSc7XHJcbiAgICAgICAgbGV0IGZsYWcgPSB0cnVlLFxyXG4gICAgICAgICAgICBub2RlTmFtZSxcclxuICAgICAgICAgICAgZWxlbWVudE5hbWUsXHJcbiAgICAgICAgICAgIGVsZW1lbnRzID0gZm9ybS5maW5kQWxsKG9wdGlvbnMubm9kZU5hbWVzKTtcclxuXHJcbiAgICAgICAgbGV0IHZhbGlkYXRlTWUgPSBtZSA9PiB7XHJcbiAgICAgICAgICAgIGxldCB2YWx1ZTtcclxuICAgICAgICAgICAgaWYgKG5vZGVOYW1lID09ICdJTlBVVCcpIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gdGhpcy52YWxpZGF0ZUZvcm1JbnB1dChtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAobm9kZU5hbWUgPT0gJ1NFTEVDVCcpIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gdGhpcy52YWxpZGF0ZUZvcm1TZWxlY3QobWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKG5vZGVOYW1lID09ICdURVhUQVJFQScpIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gdGhpcy52YWxpZGF0ZUZvcm1UZXh0YXJlYShtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXMudmFsaWRhdGVPdGhlckVsZW1lbnRzKG1lKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBub2RlTmFtZSA9IGVsZW1lbnRzW2ldLm5vZGVOYW1lO1xyXG4gICAgICAgICAgICBlbGVtZW50TmFtZSA9IGVsZW1lbnRzW2ldLmdldEF0dHJpYnV0ZSgnbmFtZScpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGVsZW1lbnRzW2ldLmdldEF0dHJpYnV0ZSgnaWdub3JlJykgPT0gJ3RydWUnKSB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNzZXQob3B0aW9ucy5uYW1lcykpIHtcclxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLm5hbWVzLmluY2x1ZGVzKGVsZW1lbnROYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZsYWcgPSB2YWxpZGF0ZU1lKGVsZW1lbnRzW2ldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZmxhZyA9IHZhbGlkYXRlTWUoZWxlbWVudHNbaV0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIWZsYWcpIHtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4geyBmbGFnLCBlbGVtZW50TmFtZSB9O1xyXG4gICAgfVxyXG5cclxuICAgIHZhbGlkYXRlT3RoZXJFbGVtZW50cyhlbGVtZW50KSB7XHJcbiAgICAgICAgbGV0IHZhbHVlID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNzZXQoZWxlbWVudC52YWx1ZSkgJiYgZWxlbWVudC52YWx1ZSAhPSAnJykgdmFsdWUgPSB0cnVlO1xyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBWYWxpZGF0ZUZvcm1JbWFnZXMoZm9ybSkge1xyXG4gICAgICAgIHJldHVybiAodHlwZSA9PSAnZmlsZScgJiYgIXNlbGYuaXNJbWFnZVZhbGlkKHZhbHVlKSk7XHJcbiAgICB9XHJcblxyXG4gICAgaXNJbWFnZVZhbGlkKGlucHV0KSB7XHJcbiAgICAgICAgdmFyIGV4dCA9IGlucHV0LnN1YnN0cmluZyhpbnB1dC5sYXN0SW5kZXhPZignLicpICsgMSkudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICBpZiAoZXh0ID09IFwicG5nXCIgfHwgZXh0ID09IFwiZ2lmXCIgfHwgZXh0ID09IFwianBlZ1wiIHx8IGV4dCA9PSBcImpwZ1wiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW1hZ2VUb0pzb24oZmlsZSwgY2FsbEJhY2sgPSAoKSA9PiB7IH0pIHtcclxuICAgICAgICBsZXQgZmlsZVJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcbiAgICAgICAgbGV0IG15ZmlsZSA9IHt9O1xyXG4gICAgICAgIGZpbGVSZWFkZXIub25sb2FkID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIG15ZmlsZS5zcmMgPSBldmVudC50YXJnZXQucmVzdWx0O1xyXG4gICAgICAgICAgICBjYWxsQmFjayhteWZpbGUpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIG15ZmlsZS5zaXplID0gZmlsZS5zaXplO1xyXG4gICAgICAgIG15ZmlsZS50eXBlID0gZmlsZS50eXBlO1xyXG4gICAgICAgIGZpbGVSZWFkZXIucmVhZEFzRGF0YVVSTChmaWxlKTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBKU0VsZW1lbnRzOyIsImNvbnN0IEZ1bmMgPSByZXF1aXJlKCcuL0Z1bmMnKTtcclxubGV0IGZ1bmMgPSBuZXcgRnVuYygpXHJcblxyXG5jbGFzcyBNYXRyaXgge1xyXG4gICAgY29uc3RydWN0b3IocGFyYW1zID0geyByb3dzOiAyLCBjb2xzOiAyLCBjb250ZW50czogW10gfSkge1xyXG4gICAgICAgIE9iamVjdC5rZXlzKHBhcmFtcykubWFwKGtleSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXNba2V5XSA9IHBhcmFtc1trZXldO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnJvd3MgPSB0aGlzLnJvd3MgfHwgMjtcclxuICAgICAgICB0aGlzLmNvbHMgPSB0aGlzLmNvbHMgfHwgMjtcclxuICAgICAgICB0aGlzLmNvbnRlbnRzID0gdGhpcy5jb250ZW50cyB8fCBbXTtcclxuICAgICAgICB0aGlzLnNldERhdGEodGhpcy5jb250ZW50cyk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0RGF0YShjb250ZW50cyA9IFtdKSB7XHJcbiAgICAgICAgdGhpcy5jb250ZW50cyA9IGNvbnRlbnRzO1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dzOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5kYXRhW2ldID0gW107XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5yb3dzOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YVtpXVtqXSA9IGNvbnRlbnRzLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHN0cnVjdHVyZSgpIHtcclxuICAgICAgICBsZXQgeyByb3dzLCBjb2xzIH0gPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiB7IHJvd3MsIGNvbHMgfTtcclxuICAgIH1cclxuXHJcbiAgICBhZGQobiA9IDApIHtcclxuICAgICAgICBpZiAobiBpbnN0YW5jZW9mIE1hdHJpeCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucm93czsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuY29sczsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhW2ldW2pdICs9IG4uZGF0YVtpXVtqXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAobiBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dzOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5jb2xzOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGFbaV1bal0gKz0gbltpXVtqXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvd3M7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmNvbHM7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YVtpXVtqXSArPSBuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN1YnRyYWN0KG4gPSAwKSB7XHJcbiAgICAgICAgaWYgKG4gaW5zdGFuY2VvZiBNYXRyaXgpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvd3M7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmNvbHM7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YVtpXVtqXSAtPSBuLmRhdGFbaV1bal07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKG4gaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucm93czsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuY29sczsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhW2ldW2pdIC09IG5baV1bal07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dzOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5jb2xzOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGFbaV1bal0gLT0gbjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBtdWx0aXBseShuID0gMSkge1xyXG4gICAgICAgIGlmIChuIGluc3RhbmNlb2YgTWF0cml4KSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dzOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbi5jb2xzOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGFbaV1bal0gKj0gbi5kYXRhW2ldW2pdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChuIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvd3M7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmNvbHM7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YVtpXVtqXSAqPSBuW2ldW2pdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucm93czsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuY29sczsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhW2ldW2pdICo9IG47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmFuZG9taXplKCkge1xyXG4gICAgICAgIHRoaXMubWFwKHZhbHVlID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGZ1bmMucmFuZG9tKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNwb3NlKCkge1xyXG4gICAgICAgIGxldCBuZXdNYXRyaXggPSBuZXcgTWF0cml4KHsgcm93czogdGhpcy5jb2xzLCBjb2xzOiB0aGlzLnJvd3MgfSk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvd3M7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuY29sczsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdNYXRyaXguZGF0YVtqXVtpXSA9IHRoaXMuZGF0YVtpXVtqXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBPYmplY3Qua2V5cyhuZXdNYXRyaXgpLm1hcChrZXkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzW2tleV0gPSBuZXdNYXRyaXhba2V5XTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBtYXAoY2FsbGJhY2sgPSAodmFsdWUsIC4uLnBvcykgPT4geyB9KSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvd3M7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuY29sczsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSB0aGlzLmRhdGFbaV1bal07XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGFbaV1bal0gPSBjYWxsYmFjayh2YWx1ZSwgaSwgaik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpbnQoKSB7XHJcbiAgICAgICAgY29uc29sZS50YWJsZSh0aGlzLmRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIHNheSgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnRvQXJyYXkoKSlcclxuICAgIH1cclxuXHJcbiAgICB0b0FycmF5KCkge1xyXG4gICAgICAgIHRoaXMuY29udGVudHMgPSBbXVxyXG4gICAgICAgIE1hdHJpeC5tYXAodGhpcywgdmFsdWUgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnRzLnB1c2godmFsdWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRlbnRzO1xyXG4gICAgfVxyXG5cclxuICAgIHJlc2hhcGUocGFyYW1zID0geyByb3dzOiAyLCBjb2xzOiAyIH0pIHtcclxuICAgICAgICB0aGlzLnRvQXJyYXkoKTtcclxuICAgICAgICB0aGlzLnJvd3MgPSBwYXJhbXMucm93cztcclxuICAgICAgICB0aGlzLmNvbHMgPSBwYXJhbXMuY29scztcclxuICAgICAgICB0aGlzLnNldERhdGEodGhpcy5jb250ZW50cyk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q29sdW1ucyguLi5jb2xzKSB7XHJcbiAgICAgICAgbGV0IHZhbHVlID0gW107XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgaW4gY29scykge1xyXG4gICAgICAgICAgICB2YWx1ZS5wdXNoKEFycmF5LmVhY2godGhpcy5kYXRhLCByb3cgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJvd1tjb2xzW2ldXTtcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFJvd3MoLi4ucm93cykge1xyXG4gICAgICAgIGxldCB2YWx1ZSA9IFtdO1xyXG5cclxuICAgICAgICBmb3IgKGxldCByID0gMDsgciA8IHRoaXMucm93czsgcisrKSB7XHJcbiAgICAgICAgICAgIGlmIChyb3dzLmluY2x1ZGVzKHIpKSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZS5wdXNoKHRoaXMuZGF0YVtyXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgdG9BcnJheShtYXRyaXgpIHtcclxuICAgICAgICBsZXQgYXJyYXkgPSBbXVxyXG4gICAgICAgIE1hdHJpeC5tYXAobWF0cml4LCB2YWx1ZSA9PiB7XHJcbiAgICAgICAgICAgIGFycmF5LnB1c2godmFsdWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBhcnJheTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgc3VidHJhY3QoYSA9IG5ldyBNYXRyaXgoKSwgYikge1xyXG4gICAgICAgIGxldCBjb250ZW50cyA9IFtdLCByb3dzID0gYS5yb3dzLCBjb2xzID0gYS5jb2xzO1xyXG5cclxuICAgICAgICBpZiAoYiBpbnN0YW5jZW9mIE1hdHJpeCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvd3M7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2xzOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50cy5wdXNoKGEuZGF0YVtpXVtqXSAtIGIuZGF0YVtpXVtqXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYiBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYS5yb3dzOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgYS5jb2xzOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50cy5wdXNoKGEuZGF0YVtpXVtqXSAtIGJbaV1bal0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucm93czsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuY29sczsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudHMucHVzaChhLmRhdGFbaV1bal0gLSBiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBNYXRyaXgoeyByb3dzLCBjb2xzLCBjb250ZW50cyB9KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYWRkKGEgPSBuZXcgTWF0cml4KCksIGIpIHtcclxuICAgICAgICBsZXQgY29udGVudHMgPSBbXSwgcm93cyA9IGEucm93cywgY29scyA9IGEuY29scztcclxuXHJcbiAgICAgICAgaWYgKGIgaW5zdGFuY2VvZiBNYXRyaXgpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3dzOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29sczsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudHMucHVzaChhLmRhdGFbaV1bal0gKyBiLmRhdGFbaV1bal0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGIgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGEucm93czsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGEuY29sczsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudHMucHVzaChhLmRhdGFbaV1bal0gKyBiW2ldW2pdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvd3M7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmNvbHM7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRzLnB1c2goYS5kYXRhW2ldW2pdICsgYik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgTWF0cml4KHsgcm93cywgY29scywgY29udGVudHMgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIG11bHRpcGx5KGEgPSBuZXcgTWF0cml4KCksIGIpIHtcclxuICAgICAgICBsZXQgY29udGVudHMgPSBbXSwgcm93cywgY29scztcclxuXHJcbiAgICAgICAgaWYgKGIgaW5zdGFuY2VvZiBNYXRyaXgpIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChhLmNvbHMgIT09IGIucm93cykge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0NvbHVtbnMgb2YgQSBtdXN0IGVxdWFsIHJvd3Mgb2YgQicpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByb3dzID0gYS5yb3dzO1xyXG4gICAgICAgICAgICBjb2xzID0gYi5jb2xzO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3dzOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29sczsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHN1bSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBhLmNvbHM7IGsrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdW0gKz0gYS5kYXRhW2ldW2tdICogYi5kYXRhW2tdW2pdO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50cy5wdXNoKHN1bSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYiBpbnN0YW5jZW9mIEFycmF5KSB7XHJcblxyXG4gICAgICAgICAgICByb3dzID0gYS5yb3dzO1xyXG4gICAgICAgICAgICBjb2xzID0gYS5jb2xzO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhLnJvd3M7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBhLmNvbHM7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRzLnB1c2goYS5kYXRhW2ldW2pdICogYltpXVtqXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dzOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5jb2xzOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50cy5wdXNoKGEuZGF0YVtpXVtqXSAqIGIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbmV3IE1hdHJpeCh7IHJvd3MsIGNvbHMsIGNvbnRlbnRzIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBkaXZpZGUoYSA9IG5ldyBNYXRyaXgoKSwgYikge1xyXG4gICAgICAgIGxldCBjb250ZW50cyA9IFtdLCByb3dzLCBjb2xzO1xyXG5cclxuICAgICAgICBpZiAoYiBpbnN0YW5jZW9mIE1hdHJpeCkge1xyXG5cclxuICAgICAgICAgICAgaWYgKGEuY29scyAhPT0gYi5yb3dzKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnQ29sdW1ucyBvZiBBIG11c3QgZXF1YWwgcm93cyBvZiBCJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJvd3MgPSBhLnJvd3M7XHJcbiAgICAgICAgICAgIGNvbHMgPSBiLmNvbHM7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvd3M7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2xzOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc3VtID0gMDtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IGEuY29sczsgaysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1bSArPSAoYS5kYXRhW2ldW2tdIC8gYi5kYXRhW2tdW2pdKSB8fCAwO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50cy5wdXNoKHN1bSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYiBpbnN0YW5jZW9mIEFycmF5KSB7XHJcblxyXG4gICAgICAgICAgICByb3dzID0gYS5yb3dzO1xyXG4gICAgICAgICAgICBjb2xzID0gYS5jb2xzO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhLnJvd3M7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBhLmNvbHM7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRzLnB1c2goKGEuZGF0YVtpXVtqXSAvIGJbaV1bal0pIHx8IDApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucm93czsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuY29sczsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudHMucHVzaCgoYS5kYXRhW2ldW2pdIC8gYikgfHwgMCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgTWF0cml4KHsgcm93cywgY29scywgY29udGVudHMgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHJhbmRvbWl6ZShtYXRyaXggPSBuZXcgTWF0cml4KCkpIHtcclxuICAgICAgICByZXR1cm4gTWF0cml4Lm1hcChtYXRyaXgsICh2YWx1ZSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBmdW5jLnJhbmRvbSgpO1xyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgdHJhbnNwb3NlKG1hdHJpeCA9IG5ldyBNYXRyaXgoKSkge1xyXG4gICAgICAgIGxldCBuZXdNYXRyaXggPSBuZXcgTWF0cml4KHsgcm93czogbWF0cml4LmNvbHMsIGNvbHM6IG1hdHJpeC5yb3dzIH0pO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWF0cml4LnJvd3M7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG1hdHJpeC5jb2xzOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIG5ld01hdHJpeC5kYXRhW2pdW2ldID0gbWF0cml4LmRhdGFbaV1bal07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ld01hdHJpeDtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbWFwKG1hdHJpeCA9IG5ldyBNYXRyaXgoKSwgY2FsbGJhY2sgPSAoKSA9PiB7IH0pIHtcclxuICAgICAgICBsZXQgbmV3TWF0cml4ID0gbmV3IE1hdHJpeCh7IHJvd3M6IG1hdHJpeC5yb3dzLCBjb2xzOiBtYXRyaXguY29scyB9KTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1hdHJpeC5yb3dzOyBpKyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBtYXRyaXguY29sczsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSBtYXRyaXguZGF0YVtpXVtqXTtcclxuICAgICAgICAgICAgICAgIG5ld01hdHJpeC5kYXRhW2ldW2pdID0gY2FsbGJhY2sodmFsdWUsIGksIGopO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXdNYXRyaXg7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZyb21BcnJheShjb250ZW50cyA9IFtdKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBNYXRyaXgoeyByb3dzOiBjb250ZW50cy5sZW5ndGgsIGNvbHM6IDEsIGNvbnRlbnRzIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyByZXNoYXBlKHBhcmFtcyA9IHsgcm93czogMiwgY29sczogMiwgbWF0cml4OiBuZXcgTWF0cml4IH0pIHtcclxuICAgICAgICBwYXJhbXMuY29udGVudHMgPSBNYXRyaXgudG9BcnJheShwYXJhbXMubWF0cml4KTtcclxuICAgICAgICBkZWxldGUgcGFyYW1zLm1hdHJpeDtcclxuICAgICAgICByZXR1cm4gbmV3IE1hdHJpeChwYXJhbXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBub3JtYWxpemUobWF0cml4ID0gbmV3IE1hdHJpeCgpKSB7XHJcbiAgICAgICAgbGV0IGNvbnRlbnRzID0gTWF0aC5ub3JtYWxpemUoTWF0cml4LnRvQXJyYXkobWF0cml4KSk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBNYXRyaXgoeyByb3dzOiBtYXRyaXgucm93cywgY29sczogbWF0cml4LmNvbHMsIGNvbnRlbnRzIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBkaWFnb25hbChhcnJheSA9IFtdKSB7XHJcbiAgICAgICAgbGV0IG1hdHJpeCA9IE1hdHJpeC5zcXVhcmUoYXJyYXkubGVuZ3RoKTtcclxuICAgICAgICBmb3IgKGxldCBpIGluIG1hdHJpeC5kYXRhKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogaW4gbWF0cml4LmRhdGFbaV0pIHtcclxuICAgICAgICAgICAgICAgIGlmIChpID09IGopIHtcclxuICAgICAgICAgICAgICAgICAgICBtYXRyaXguZGF0YVtpXVtqXSA9IGFycmF5W2ldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG1hdHJpeC50b0FycmF5KCk7XHJcbiAgICAgICAgcmV0dXJuIG1hdHJpeDtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgdW5pdChzaXplID0gMikge1xyXG4gICAgICAgIGxldCBtYXRyaXggPSBNYXRyaXguc3F1YXJlKHNpemUpO1xyXG4gICAgICAgIGZvciAobGV0IGkgaW4gbWF0cml4LmRhdGEpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiBpbiBtYXRyaXguZGF0YVtpXSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGkgPT0gaikge1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdHJpeC5kYXRhW2ldW2pdID0gMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBtYXRyaXgudG9BcnJheSgpO1xyXG4gICAgICAgIHJldHVybiBtYXRyaXg7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHNxdWFyZShzaXplID0gMikge1xyXG4gICAgICAgIHJldHVybiBuZXcgTWF0cml4KHsgcm93czogc2l6ZSwgY29sczogc2l6ZSB9KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZnJvbU1hdHJpeENvbHMobWF0cml4ID0gbmV3IE1hdHJpeCgpLCAuLi5jb2xzKSB7XHJcbiAgICAgICAgbGV0IHZhbHVlID0gbWF0cml4LmdldENvbHVtbnMoLi4uY29scyk7XHJcbiAgICAgICAgbGV0IGNvbnRlbnRzID0gQXJyYXkuZmxhdHRlbih2YWx1ZSk7XHJcbiAgICAgICAgbGV0IG5ld01hdHJpeCA9IG5ldyBNYXRyaXgoeyByb3dzOiB2YWx1ZS5sZW5ndGgsIGNvbHM6IG1hdHJpeC5jb2xzLCBjb250ZW50cyB9KTtcclxuICAgICAgICBuZXdNYXRyaXgudHJhbnNwb3NlKCk7XHJcbiAgICAgICAgcmV0dXJuIG5ld01hdHJpeDtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZGVlcE1hdHJpeChkaW1lbnNpb25zID0gW10sIGNvbnRlbnRzID0gW10pIHtcclxuICAgICAgICAvL3NwbGl0IHRoZSBkaW1lbnNpb25zIGludG8gYW4gYXJyYXkgb2YgYXJyYXlzIG9mIGxlbmd0aCAyXHJcbiAgICAgICAgbGV0IG1hdHJpeERpbWVuc2lvbnMgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRpbWVuc2lvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbWF0cml4RGltZW5zaW9ucy5wdXNoKHsgcm93czogZGltZW5zaW9uc1tpXSwgY29sczogZGltZW5zaW9uc1srK2ldIHx8IDEgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgbWFrZU1hdHJpeCA9IChsYXllcikgPT4ge1xyXG4gICAgICAgICAgICBsZXQgbWF0cml4ID0gbmV3IE1hdHJpeChtYXRyaXhEaW1lbnNpb25zW2xheWVyXSk7XHJcblxyXG4gICAgICAgICAgICBpZiAobGF5ZXIgKyAxID09IG1hdHJpeERpbWVuc2lvbnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBtYXRyaXgubWFwKHZhbHVlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29udGVudHMuc2hpZnQoKSB8fCAwO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBtYXRyaXgubWFwKHZhbHVlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbWFrZU1hdHJpeChsYXllciArIDEpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG1hdHJpeDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBtYWtlTWF0cml4KDApO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1hdHJpeDsiLCJjb25zdCBGdW5jID0gcmVxdWlyZSgnLi9GdW5jJyk7XHJcbmNvbnN0IE1hdHJpeCA9IHJlcXVpcmUoJy4vTWF0cml4Jyk7XHJcbmNvbnN0IEFycmF5TGlicmFyeSA9IHJlcXVpcmUoJy4vLi4vZnVuY3Rpb25zL0FycmF5TGlicmFyeScpO1xyXG5cclxubGV0IGZ1bmMgPSBuZXcgRnVuYygpO1xyXG5sZXQgYXJyYXlMaWJyYXJ5ID0gbmV3IEFycmF5TGlicmFyeSgpO1xyXG5cclxuY2xhc3MgTmV1cmFsTmV0d29yayB7XHJcbiAgICBjb25zdHJ1Y3RvcihwYXJhbXMpIHtcclxuICAgICAgICBmdW5jLm9iamVjdC5jb3B5KHBhcmFtcywgdGhpcyk7XHJcbiAgICAgICAgdGhpcy5paFdlaWdodHMgPSBuZXcgTWF0cml4KHsgcm93czogdGhpcy5oTm9kZXMsIGNvbHM6IHRoaXMuaU5vZGVzIH0pO1xyXG4gICAgICAgIHRoaXMuaWhXZWlnaHRzLnJhbmRvbWl6ZSgpO1xyXG5cclxuICAgICAgICB0aGlzLmloQmlhcyA9IG5ldyBNYXRyaXgoeyByb3dzOiB0aGlzLmhOb2RlcywgY29sczogMSB9KTtcclxuICAgICAgICB0aGlzLmloQmlhcy5yYW5kb21pemUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5ob1dlaWdodHMgPSBuZXcgTWF0cml4KHsgcm93czogdGhpcy5vTm9kZXMsIGNvbHM6IHRoaXMuaE5vZGVzIH0pO1xyXG4gICAgICAgIHRoaXMuaG9XZWlnaHRzLnJhbmRvbWl6ZSgpO1xyXG5cclxuICAgICAgICB0aGlzLmhvQmlhcyA9IG5ldyBNYXRyaXgoeyByb3dzOiB0aGlzLm9Ob2RlcywgY29sczogMSB9KTtcclxuICAgICAgICB0aGlzLmhvQmlhcy5yYW5kb21pemUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5sciA9IHRoaXMubHIgfHwgMC4xO1xyXG4gICAgfVxyXG5cclxuICAgIGZlZWRGb3dhcmQoaW5wdXRBcnJheSA9IFtdKSB7XHJcbiAgICAgICAgbGV0IGlucHV0cyA9IGlucHV0QXJyYXkgaW5zdGFuY2VvZiBNYXRyaXggPyBpbnB1dEFycmF5IDogdGhpcy5wcmVwYXJlSW5wdXRzKGlucHV0QXJyYXkpO1xyXG5cclxuICAgICAgICBsZXQgaGlkZGVucyA9IE1hdHJpeC5tdWx0aXBseSh0aGlzLmloV2VpZ2h0cywgaW5wdXRzKTtcclxuICAgICAgICBoaWRkZW5zLmFkZCh0aGlzLmloQmlhcyk7XHJcbiAgICAgICAgaGlkZGVucy5tYXAoc2lnbW9pZCk7XHJcblxyXG4gICAgICAgIGxldCBvdXRwdXRzID0gTWF0cml4Lm11bHRpcGx5KHRoaXMuaG9XZWlnaHRzLCBoaWRkZW5zKTtcclxuICAgICAgICBvdXRwdXRzLmFkZCh0aGlzLmhvQmlhcyk7XHJcbiAgICAgICAgb3V0cHV0cy5tYXAoc2lnbW9pZCk7XHJcblxyXG4gICAgICAgIHJldHVybiB7IGlucHV0cywgaGlkZGVucywgb3V0cHV0cyB9O1xyXG4gICAgfVxyXG5cclxuICAgIHF1ZXJ5QmFjayh0YXJnZXRBcnJheSA9IFtdKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHByZWRpY3QoaW5wdXRBcnJheSA9IFtdKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZmVlZEZvd2FyZChpbnB1dEFycmF5KS5vdXRwdXRzO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFdlaWdodHNVcGRhdGUoaW5wdXRzID0gbmV3IE1hdHJpeCgpLCBvdXRwdXRzID0gbmV3IE1hdHJpeCgpLCBlcnJvcnMgPSAxKSB7XHJcbiAgICAgICAgbGV0IGdyYWRpZW50cyA9IE1hdHJpeC5tYXAob3V0cHV0cywgZFNpZ21vaWQpO1xyXG4gICAgICAgIGdyYWRpZW50cy5tdWx0aXBseShlcnJvcnMpO1xyXG4gICAgICAgIGdyYWRpZW50cy5tdWx0aXBseSh0aGlzLmxyKTtcclxuXHJcbiAgICAgICAgbGV0IGlucHV0c1RyYW5zcG9zZWQgPSBNYXRyaXgudHJhbnNwb3NlKGlucHV0cyk7XHJcbiAgICAgICAgbGV0IGNoYW5nZSA9IE1hdHJpeC5tdWx0aXBseShncmFkaWVudHMsIGlucHV0c1RyYW5zcG9zZWQpO1xyXG5cclxuICAgICAgICByZXR1cm4geyBjaGFuZ2UsIGdyYWRpZW50cyB9O1xyXG4gICAgfVxyXG5cclxuICAgIGJhY2twcm9wYWdhdGUoaW5wdXRzID0gW10sIHRhcmdldHMgPSBuZXcgTWF0cml4KCkpIHtcclxuICAgICAgICBsZXQgeyBoaWRkZW5zLCBvdXRwdXRzIH0gPSB0aGlzLmZlZWRGb3dhcmQoaW5wdXRzKTtcclxuXHJcbiAgICAgICAgbGV0IGhvRXJyb3JzID0gTWF0cml4LnN1YnRyYWN0KHRhcmdldHMsIG91dHB1dHMpO1xyXG4gICAgICAgIGxldCBob1VwZGF0ZXMgPSB0aGlzLmdldFdlaWdodHNVcGRhdGUoaGlkZGVucywgb3V0cHV0cywgaG9FcnJvcnMpO1xyXG4gICAgICAgIHRoaXMuaG9XZWlnaHRzLmFkZChob1VwZGF0ZXMuY2hhbmdlKTtcclxuICAgICAgICB0aGlzLmhvQmlhcy5hZGQoaG9VcGRhdGVzLmdyYWRpZW50cyk7XHJcblxyXG4gICAgICAgIGxldCBob1dlaWdodHNUcmFuc3Bvc2VkID0gTWF0cml4LnRyYW5zcG9zZSh0aGlzLmhvV2VpZ2h0cyk7XHJcbiAgICAgICAgbGV0IGloRXJyb3JzID0gTWF0cml4Lm11bHRpcGx5KGhvV2VpZ2h0c1RyYW5zcG9zZWQsIGhvRXJyb3JzKTtcclxuICAgICAgICBsZXQgaWhVcGRhdGVzID0gdGhpcy5nZXRXZWlnaHRzVXBkYXRlKGlucHV0cywgaGlkZGVucywgaWhFcnJvcnMpO1xyXG4gICAgICAgIHRoaXMuaWhXZWlnaHRzLmFkZChpaFVwZGF0ZXMuY2hhbmdlKTtcclxuICAgICAgICB0aGlzLmloQmlhcy5hZGQoaWhVcGRhdGVzLmdyYWRpZW50cyk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJhaW4ocGFyYW1zID0geyB0cmFpbmluZ0RhdGE6IFtdLCBwZXJpb2Q6IDEsIGVwb2NoOiAxIH0pIHtcclxuICAgICAgICBsZXQgaW5wdXRBcnJheSA9IFtdLCB0YXJnZXRBcnJheSA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGRhdGEgb2YgcGFyYW1zLnRyYWluaW5nRGF0YSkge1xyXG4gICAgICAgICAgICBpbnB1dEFycmF5LnB1c2goZGF0YS5pbnB1dHMpO1xyXG4gICAgICAgICAgICB0YXJnZXRBcnJheS5wdXNoKGRhdGEudGFyZ2V0cyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgaW5wdXRzID0gYXJyYXlMaWJyYXJ5LmVhY2goaW5wdXRBcnJheSwgdmFsdWUgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcmVwYXJlSW5wdXRzKHZhbHVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgbGV0IHRhcmdldHMgPSBhcnJheUxpYnJhcnkuZWFjaCh0YXJnZXRBcnJheSwgdmFsdWUgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcmVwYXJlVGFyZ2V0cyh2YWx1ZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxldCBydW4gPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGFyYW1zLnBlcmlvZDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqIGluIGlucHV0cykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmFja3Byb3BhZ2F0ZShpbnB1dHNbal0sIHRhcmdldHNbal0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZnVuYy5pc3NldChwYXJhbXMuZXBvY2gpKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHAgPSAwOyBwIDwgcGFyYW1zLmVwb2NoOyBwKyspIHtcclxuICAgICAgICAgICAgICAgIHJ1bigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcnVuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNldExlYXJuaW5nUmF0ZShsciA9IDAuMSkge1xyXG4gICAgICAgIHRoaXMubHIgPSBscjtcclxuICAgIH1cclxuXHJcbiAgICBwcmVwYXJlSW5wdXRzKGlucHV0QXJyYXkgPSBbXSkge1xyXG4gICAgICAgIGxldCBpbnB1dHMgPSBNYXRyaXguZnJvbUFycmF5KE1hdGgubm9ybWFsaXplKGlucHV0QXJyYXkpKTtcclxuICAgICAgICBpbnB1dHMubXVsdGlwbHkoMC45OSk7XHJcbiAgICAgICAgaW5wdXRzLmFkZCgwLjAxKTtcclxuICAgICAgICByZXR1cm4gaW5wdXRzO1xyXG4gICAgfVxyXG5cclxuICAgIHByZXBhcmVUYXJnZXRzKHRhcmdldEFycmF5ID0gW10pIHtcclxuICAgICAgICBsZXQgdGFyZ2V0cyA9IE1hdHJpeC5mcm9tQXJyYXkodGFyZ2V0QXJyYXkpO1xyXG4gICAgICAgIHRhcmdldHMuYWRkKDAuMDEpO1xyXG4gICAgICAgIHRhcmdldHMubXVsdGlwbHkoMC45OSk7XHJcbiAgICAgICAgcmV0dXJuIHRhcmdldHM7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTmV1cmFsTmV0d29yazsiLCJjb25zdCBGdW5jID0gcmVxdWlyZSgnLi9GdW5jJyk7XHJcblxyXG5jbGFzcyBQZXJpb2QgZXh0ZW5kcyBGdW5jIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyaW1Nb250aEFycmF5KCkge1xyXG4gICAgICAgIGxldCBtb250aHMgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubW9udGhzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIG1vbnRocy5wdXNoKHRoaXMubW9udGhzW2ldLnNsaWNlKDAsIDMpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG1vbnRocztcclxuICAgIH1cclxuXHJcbiAgICBnZXRZZWFycyhjb3VudCA9IDUpIHtcclxuICAgICAgICBsZXQgeWVhciA9IG5ldyBEYXRlKCkuZ2V0WWVhcigpICsgMTkwMDtcclxuICAgICAgICBsZXQgZmV0Y2hlZCA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xyXG4gICAgICAgICAgICBmZXRjaGVkLnB1c2goYCR7eWVhciAtIDF9LSR7eWVhcn1gKTtcclxuICAgICAgICAgICAgeWVhcisrO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmV0Y2hlZDtcclxuICAgIH1cclxuXHJcbiAgICBpc1RpbWVWYWxpZCh0aW1lKSB7XHJcbiAgICAgICAgdGltZSA9IHRpbWUuc3BsaXQoJzonKTtcclxuICAgICAgICBpZiAodGltZS5sZW5ndGggPT0gMiB8fCB0aW1lLmxlbmd0aCA9PSAzKSB7XHJcbiAgICAgICAgICAgIHZhciBob3VyID0gbmV3IE51bWJlcih0aW1lWzBdKTtcclxuICAgICAgICAgICAgdmFyIG1pbnV0ZXMgPSBuZXcgTnVtYmVyKHRpbWVbMV0pO1xyXG4gICAgICAgICAgICB2YXIgc2Vjb25kcyA9IDA7XHJcbiAgICAgICAgICAgIHZhciB0b3RhbCA9IDA7XHJcblxyXG4gICAgICAgICAgICBpZiAodGltZS5sZW5ndGggPT0gMykge1xyXG4gICAgICAgICAgICAgICAgc2Vjb25kcyA9IG5ldyBOdW1iZXIodGltZVsyXSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaG91ciA+IDIzIHx8IGhvdXIgPCAwIHx8IG1pbnV0ZXMgPiA1OSB8fCBtaW51dGVzIDwgMCB8fCBzZWNvbmRzID4gNTkgfHwgc2Vjb25kcyA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaG91ciA+IDIzIHx8IGhvdXIgPCAwIHx8IG1pbnV0ZXMgPiA1OSB8fCBtaW51dGVzIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIHRvdGFsID0gKGhvdXIgKiA2MCAqIDYwKSArIChtaW51dGVzICogNjApICsgc2Vjb25kcztcclxuICAgICAgICAgICAgcmV0dXJuIHRvdGFsO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgdGltZSh0aW1lKSB7XHJcbiAgICAgICAgbGV0IGRhdGUgPSAodGhpcy5pc3NldCh0aW1lKSkgPyBuZXcgRGF0ZShNYXRoLmZsb29yKHRpbWUpKSA6IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgbGV0IGhvdXIgPSBkYXRlLmdldEhvdXJzKCkudG9TdHJpbmcoKTtcclxuICAgICAgICBsZXQgbWludXRlcyA9IGRhdGUuZ2V0TWludXRlcygpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgbGV0IHNlY29uZHMgPSBkYXRlLmdldFNlY29uZHMoKS50b1N0cmluZygpO1xyXG5cclxuICAgICAgICBob3VyID0gKGhvdXIubGVuZ3RoID4gMSkgPyBob3VyIDogYDAke2hvdXJ9YDtcclxuICAgICAgICBtaW51dGVzID0gKG1pbnV0ZXMubGVuZ3RoID4gMSkgPyBtaW51dGVzIDogYDAke21pbnV0ZXN9YDtcclxuICAgICAgICBzZWNvbmRzID0gKHNlY29uZHMubGVuZ3RoID4gMSkgPyBzZWNvbmRzIDogYDAke3NlY29uZHN9YDtcclxuXHJcbiAgICAgICAgcmV0dXJuIGAke2hvdXJ9OiR7bWludXRlc306JHtzZWNvbmRzfWA7XHJcbiAgICB9XHJcblxyXG4gICAgZGF0ZSh0aW1lKSB7XHJcbiAgICAgICAgbGV0IGRhdGUgPSAodGhpcy5pc3NldCh0aW1lKSkgPyBuZXcgRGF0ZShNYXRoLmZsb29yKHRpbWUpKSA6IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgbGV0IGRheSA9IGRhdGUuZ2V0RGF0ZSgpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgbGV0IG1vbnRoID0gKGRhdGUuZ2V0TW9udGgoKSArIDEpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgbGV0IHllYXIgPSBkYXRlLmdldEZ1bGxZZWFyKCkudG9TdHJpbmcoKTtcclxuXHJcbiAgICAgICAgZGF5ID0gKGRheS5sZW5ndGggPiAxKSA/IGRheSA6IGAwJHtkYXl9YDtcclxuICAgICAgICBtb250aCA9IChtb250aC5sZW5ndGggPiAxKSA/IG1vbnRoIDogYDAke21vbnRofWA7XHJcblxyXG4gICAgICAgIHJldHVybiBgJHt5ZWFyfS0ke21vbnRofS0ke2RheX1gO1xyXG4gICAgfVxyXG5cclxuICAgIHRpbWVfZGF0ZSh0aW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIGAke3RoaXMudGltZSh0aW1lKX0sICR7dGhpcy5kYXRlKHRpbWUpfWA7XHJcbiAgICB9XHJcblxyXG4gICAgdGltZVRvZGF5KCkge1xyXG4gICAgICAgIGxldCBkYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICBsZXQgaG91ciA9IGRhdGUuZ2V0SG91cnMoKTtcclxuICAgICAgICBsZXQgbWludXRlcyA9IGRhdGUuZ2V0TWludXRlcygpO1xyXG4gICAgICAgIGxldCBzZWNvbmRzID0gZGF0ZS5nZXRTZWNvbmRzKCk7XHJcblxyXG4gICAgICAgIGxldCB0aW1lID0gdGhpcy5pc1RpbWVWYWxpZChgJHtob3VyfToke21pbnV0ZXN9OiR7c2Vjb25kc31gKTtcclxuICAgICAgICByZXR1cm4gdGltZSA/IHRpbWUgOiAtMTtcclxuICAgIH1cclxuXHJcbiAgICBpc0RhdGVWYWxpZCh2YWx1ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzRGF0ZSh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNZZWFyVmFsaWQodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc01vbnRoVmFsaWQodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNEYXlWYWxpZCh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBpc0RheVZhbGlkKHZhbHVlKSB7XHJcbiAgICAgICAgdmFyIHZfZGF5ID0gXCJcIjtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDI7IGkrKykge1xyXG4gICAgICAgICAgICB2X2RheSArPSB2YWx1ZVtpICsgOF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBsaW1pdCA9IDA7XHJcbiAgICAgICAgdmFyIG1vbnRoID0gdGhpcy5pc01vbnRoVmFsaWQodmFsdWUpO1xyXG5cclxuICAgICAgICBpZiAobW9udGggPT0gJzAxJykge1xyXG4gICAgICAgICAgICBsaW1pdCA9IDMxO1xyXG4gICAgICAgIH0gZWxzZSBpZiAobW9udGggPT0gJzAyJykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0xlYXBZZWFyKHRoaXMuaXNZZWFyVmFsaWQodmFsdWUpKSkge1xyXG4gICAgICAgICAgICAgICAgbGltaXQgPSAyOTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxpbWl0ID0gMjg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKG1vbnRoID09ICcwMycpIHtcclxuICAgICAgICAgICAgbGltaXQgPSAzMTtcclxuICAgICAgICB9IGVsc2UgaWYgKG1vbnRoID09ICcwNCcpIHtcclxuICAgICAgICAgICAgbGltaXQgPSAzMDtcclxuICAgICAgICB9IGVsc2UgaWYgKG1vbnRoID09ICcwNScpIHtcclxuICAgICAgICAgICAgbGltaXQgPSAzMTtcclxuICAgICAgICB9IGVsc2UgaWYgKG1vbnRoID09ICcwNicpIHtcclxuICAgICAgICAgICAgbGltaXQgPSAzMDtcclxuICAgICAgICB9IGVsc2UgaWYgKG1vbnRoID09ICcwNycpIHtcclxuICAgICAgICAgICAgbGltaXQgPSAzMTtcclxuICAgICAgICB9IGVsc2UgaWYgKG1vbnRoID09ICcwOCcpIHtcclxuICAgICAgICAgICAgbGltaXQgPSAzMTtcclxuICAgICAgICB9IGVsc2UgaWYgKG1vbnRoID09ICcwOScpIHtcclxuICAgICAgICAgICAgbGltaXQgPSAzMDtcclxuICAgICAgICB9IGVsc2UgaWYgKG1vbnRoID09ICcxMCcpIHtcclxuICAgICAgICAgICAgbGltaXQgPSAzMTtcclxuICAgICAgICB9IGVsc2UgaWYgKG1vbnRoID09ICcxMScpIHtcclxuICAgICAgICAgICAgbGltaXQgPSAzMDtcclxuICAgICAgICB9IGVsc2UgaWYgKG1vbnRoID09ICcxMicpIHtcclxuICAgICAgICAgICAgbGltaXQgPSAzMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChsaW1pdCA8IHZfZGF5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdl9kYXk7XHJcbiAgICB9XHJcblxyXG4gICAgaXNEYXRlKHZhbHVlKSB7XHJcbiAgICAgICAgdmFyIGxlbiA9IHZhbHVlLmxlbmd0aDtcclxuICAgICAgICBpZiAobGVuID09IDEwKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHggaW4gdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzRGlnaXQodmFsdWVbeF0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh4ID09IDQgfHwgeCA9PSA3KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZVt4XSA9PSAnLScpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgaXNNb250aFZhbGlkKHZhbHVlKSB7XHJcbiAgICAgICAgdmFyIHZfbW9udGggPSBcIlwiO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZfbW9udGggKz0gdmFsdWVbaSArIDVdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodl9tb250aCA+IDEyIHx8IHZfbW9udGggPCAxKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdl9tb250aDtcclxuICAgIH1cclxuXHJcbiAgICBpc1llYXJWYWxpZCh2YWx1ZSkge1xyXG4gICAgICAgIHZhciB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcignWScpO1xyXG4gICAgICAgIHZhciB2X3llYXIgPSBcIlwiO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZfeWVhciArPSB2YWx1ZVtpICsgMF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh2X3llYXIgPiB5ZWFyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdl95ZWFyO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFllYXIodmFsdWUpIHtcclxuICAgICAgICB2YXIgdl95ZWFyID0gXCJcIjtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDQ7IGkrKykge1xyXG4gICAgICAgICAgICB2X3llYXIgKz0gdmFsdWVbaSArIDBdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdl95ZWFyO1xyXG4gICAgfVxyXG5cclxuICAgIGlzTGVhcFllYXIodmFsdWUpIHtcclxuICAgICAgICBpZiAodmFsdWUgJSA0ID09IDApIHtcclxuICAgICAgICAgICAgaWYgKCh2YWx1ZSAlIDEwMCA9PSAwKSAmJiAodmFsdWUgJSA0MDAgIT0gMCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGRheXNJbk1vbnRoKG1vbnRoLCB5ZWFyKSB7XHJcbiAgICAgICAgdmFyIGRheXMgPSAwO1xyXG4gICAgICAgIGlmIChtb250aCA9PSAnMDEnKSB7XHJcbiAgICAgICAgICAgIGRheXMgPSAzMTtcclxuICAgICAgICB9IGVsc2UgaWYgKG1vbnRoID09ICcwMicpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNMZWFwWWVhcih5ZWFyKSkge1xyXG4gICAgICAgICAgICAgICAgZGF5cyA9IDI5O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZGF5cyA9IDI4O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChtb250aCA9PSAnMDMnKSB7XHJcbiAgICAgICAgICAgIGRheXMgPSAzMTtcclxuICAgICAgICB9IGVsc2UgaWYgKG1vbnRoID09ICcwNCcpIHtcclxuICAgICAgICAgICAgZGF5cyA9IDMwO1xyXG4gICAgICAgIH0gZWxzZSBpZiAobW9udGggPT0gJzA1Jykge1xyXG4gICAgICAgICAgICBkYXlzID0gMzE7XHJcbiAgICAgICAgfSBlbHNlIGlmIChtb250aCA9PSAnMDYnKSB7XHJcbiAgICAgICAgICAgIGRheXMgPSAzMDtcclxuICAgICAgICB9IGVsc2UgaWYgKG1vbnRoID09ICcwNycpIHtcclxuICAgICAgICAgICAgZGF5cyA9IDMxO1xyXG4gICAgICAgIH0gZWxzZSBpZiAobW9udGggPT0gJzA4Jykge1xyXG4gICAgICAgICAgICBkYXlzID0gMzE7XHJcbiAgICAgICAgfSBlbHNlIGlmIChtb250aCA9PSAnMDknKSB7XHJcbiAgICAgICAgICAgIGRheXMgPSAzMDtcclxuICAgICAgICB9IGVsc2UgaWYgKG1vbnRoID09ICcxMCcpIHtcclxuICAgICAgICAgICAgZGF5cyA9IDMxO1xyXG4gICAgICAgIH0gZWxzZSBpZiAobW9udGggPT0gJzExJykge1xyXG4gICAgICAgICAgICBkYXlzID0gMzA7XHJcbiAgICAgICAgfSBlbHNlIGlmIChtb250aCA9PSAnMTInKSB7XHJcbiAgICAgICAgICAgIGRheXMgPSAzMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRheXM7XHJcbiAgICB9XHJcblxyXG4gICAgZGF0ZVZhbHVlKGRhdGUpIHtcclxuICAgICAgICB2YXIgdmFsdWUgPSAwO1xyXG4gICAgICAgIHZhciB5ZWFyID0gdGhpcy5nZXRZZWFyKGRhdGUpICogMzY1O1xyXG4gICAgICAgIHZhciBtb250aCA9IDA7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCB0aGlzLmlzTW9udGhWYWxpZChkYXRlKTsgaSsrKSB7XHJcbiAgICAgICAgICAgIG1vbnRoID0gdGhpcy5kYXlzSW5Nb250aChpLCB0aGlzLmdldFllYXIoZGF0ZSkpIC8gMSArIG1vbnRoIC8gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGRheSA9IHRoaXMuaXNEYXlWYWxpZChkYXRlKTtcclxuICAgICAgICB2YWx1ZSA9ICh5ZWFyIC8gMSkgKyAobW9udGggLyAxKSArIChkYXkgLyAxKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHRvZGF5KCkge1xyXG4gICAgICAgIGxldCB0b2RheSA9IG5ldyBEYXRlO1xyXG4gICAgICAgIGxldCBtb250aCA9IHRvZGF5LmdldE1vbnRoKCkgLyAxICsgMTtcclxuICAgICAgICBtb250aCA9IChtb250aC5sZW5ndGggPiAxKSA/IG1vbnRoIDogYDAke21vbnRofWA7XHJcblxyXG4gICAgICAgIHRvZGF5ID0gKHRvZGF5LmdldEZ1bGxZZWFyKCkpICsgJy0nICsgbW9udGggKyAnLScgKyB0b2RheS5nZXREYXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRvZGF5O1xyXG4gICAgfVxyXG5cclxuICAgIGdldERhdGVPYmplY3QodmFsdWUpIHtcclxuICAgICAgICBsZXQgZGF5cyA9IE1hdGguZmxvb3IodmFsdWUgLyB0aGlzLnNlY29uZHNJbkRheXMoMSkpO1xyXG5cclxuICAgICAgICB2YWx1ZSAtPSB0aGlzLnNlY29uZHNJbkRheXMoZGF5cyk7XHJcblxyXG4gICAgICAgIGxldCBob3VycyA9IE1hdGguZmxvb3IodmFsdWUgLyB0aGlzLnNlY29uZHNJbkhvdXJzKDEpKTtcclxuICAgICAgICB2YWx1ZSAtPSB0aGlzLnNlY29uZHNJbkhvdXJzKGhvdXJzKTtcclxuXHJcbiAgICAgICAgbGV0IG1pbnV0ZXMgPSBNYXRoLmZsb29yKHZhbHVlIC8gdGhpcy5zZWNvbmRzSW5NaW51dGVzKDEpKTtcclxuICAgICAgICB2YWx1ZSAtPSB0aGlzLnNlY29uZHNJbk1pbnV0ZXMobWludXRlcyk7XHJcblxyXG4gICAgICAgIGxldCBzZWNvbmRzID0gdmFsdWU7XHJcblxyXG4gICAgICAgIHJldHVybiB7IGRheXMsIGhvdXJzLCBtaW51dGVzLCBzZWNvbmRzIH07XHJcbiAgICB9XHJcblxyXG4gICAgZGF0ZVdpdGhUb2RheShkYXRlKSB7XHJcbiAgICAgICAgdmFyIHRvZGF5ID0gTWF0aC5mbG9vcih0aGlzLmRhdGVWYWx1ZSh0aGlzLnRvZGF5KCkpKTtcclxuICAgICAgICBsZXQgZGF0ZVZhbHVlID0gTWF0aC5mbG9vcih0aGlzLmRhdGVWYWx1ZShkYXRlKSk7XHJcblxyXG4gICAgICAgIHZhciB2YWx1ZSA9IHsgZGlmZjogKGRhdGVWYWx1ZSAtIHRvZGF5KSwgd2hlbjogJycgfTtcclxuICAgICAgICBpZiAoZGF0ZVZhbHVlID4gdG9kYXkpIHtcclxuICAgICAgICAgICAgdmFsdWUud2hlbiA9ICdmdXR1cmUnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChkYXRlVmFsdWUgPT0gdG9kYXkpIHtcclxuICAgICAgICAgICAgdmFsdWUud2hlbiA9ICd0b2RheSc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB2YWx1ZS53aGVuID0gJ3Bhc3QnO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgZGF0ZVN0cmluZyhkYXRlKSB7XHJcbiAgICAgICAgbGV0IHllYXIgPSBuZXcgTnVtYmVyKHRoaXMuZ2V0WWVhcihkYXRlKSk7XHJcbiAgICAgICAgbGV0IG1vbnRoID0gbmV3IE51bWJlcih0aGlzLmlzTW9udGhWYWxpZChkYXRlKSk7XHJcbiAgICAgICAgbGV0IGRheSA9IG5ldyBOdW1iZXIodGhpcy5pc0RheVZhbGlkKGRhdGUpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRheSArICcgJyArIHRoaXMubW9udGhzW21vbnRoIC0gMV0gKyAnLCAnICsgeWVhcjtcclxuICAgIH1cclxuXHJcbiAgICBzZWNvbmRzSW5EYXlzKGRheXMpIHtcclxuICAgICAgICBsZXQgdmFsdWUgPSBNYXRoLmZsb29yKGRheXMgKiAyNCAqIDYwICogNjApO1xyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBzZWNvbmRzSW5Ib3Vycyhob3Vycykge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKGhvdXJzICogNjAgKiA2MCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2Vjb25kc0luTWludXRlcyhtaW51dGVzKSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IobWludXRlcyAqIDYwKTtcclxuICAgIH1cclxuXHJcbiAgICBzZWNvbmRzVGlsbERhdGUoZGF0ZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNlY29uZHNJbkRheXMoTWF0aC5mbG9vcih0aGlzLmRhdGVWYWx1ZShkYXRlKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHNlY29uZHNUaWxsVG9kYXkoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2Vjb25kc1RpbGxEYXRlKHRoaXMudG9kYXkoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2Vjb25kc1RpbGxOb3coKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2Vjb25kc1RpbGxEYXRlKHRoaXMudG9kYXkoKSkgKyB0aGlzLnRpbWVUb2RheSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHNlY29uZHNUaWxsTW9tZW50KG1vbWVudCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNlY29uZHNUaWxsRGF0ZSh0aGlzLmRhdGUobW9tZW50KSkgKyB0aGlzLmlzVGltZVZhbGlkKHRoaXMudGltZShtb21lbnQpKTtcclxuICAgIH1cclxuXHJcbiAgICBsb2coLi4uZGF0YSkge1xyXG4gICAgICAgIGxldCB0aW1lID0gYFske3RoaXMudGltZSgpfV06YDtcclxuICAgICAgICBjb25zb2xlLmxvZyh0aW1lLCAuLi5kYXRhKTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQZXJpb2Q7IiwiY29uc3QgSlNFbGVtZW50cyA9IHJlcXVpcmUoJy4vSlNFbGVtZW50cycpO1xyXG5cclxuY2xhc3MgRW1wdHkge1xyXG59XHJcblxyXG5jbGFzcyBUZW1wbGF0ZSBleHRlbmRzIEpTRWxlbWVudHMge1xyXG4gICAgY29uc3RydWN0b3IodGhlV2luZG93ID0gRW1wdHkpIHtcclxuICAgICAgICBzdXBlcih0aGVXaW5kb3cpO1xyXG4gICAgICAgIHRoaXMudmlydHVhbCA9IHt9O1xyXG4gICAgICAgIHRoaXMuZWxlbWVudExpYnJhcnkodGhlV2luZG93LkVsZW1lbnQpO1xyXG4gICAgICAgIHRoaXMuaHRtbENvbGxlY3Rpb25MaWJyYXJ5KHRoZVdpbmRvdy5IVE1MQ29sbGVjdGlvbik7XHJcbiAgICAgICAgdGhpcy5ub2RlTGlicmFyeSh0aGVXaW5kb3cuTm9kZSk7XHJcbiAgICAgICAgdGhpcy5ub2RlTGlzdExpYnJhcnkodGhlV2luZG93Lk5vZGVMaXN0KTtcclxuICAgIH1cclxuXHJcbiAgICBlbGVtZW50TGlicmFyeShFbGVtZW50ID0gRW1wdHkpIHtcclxuICAgICAgICAvL0ZyYW1ld29yayB3aXRoIGpzZG9tXHJcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLmNoYW5nZU5vZGVOYW1lID0gZnVuY3Rpb24gKG5hbWUpIHtcclxuICAgICAgICAgICAgbGV0IHN0cnVjdHVyZSA9IHRoaXMudG9Kc29uKCk7XHJcbiAgICAgICAgICAgIHN0cnVjdHVyZS5lbGVtZW50ID0gbmFtZTtcclxuICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSBzZWxmLmNyZWF0ZUVsZW1lbnQoc3RydWN0dXJlKTtcclxuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgRWxlbWVudC5wcm90b3R5cGUudG9Kc29uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBsZXQgZWxlbWVudCA9IHRoaXMubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgbGV0IGF0dHJpYnV0ZXMgPSB0aGlzLmdldEF0dHJpYnV0ZXMoKTtcclxuICAgICAgICAgICAgYXR0cmlidXRlcy5zdHlsZSA9IHRoaXMuY3NzKCk7XHJcbiAgICAgICAgICAgIGxldCBjaGlsZHJlbiA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNoaWxkcmVuLnB1c2godGhpcy5jaGlsZHJlbltpXS50b0pzb24oKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHsgZWxlbWVudCwgYXR0cmlidXRlcywgY2hpbGRyZW4gfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgRWxlbWVudC5wcm90b3R5cGUuc2V0T3B0aW9ucyA9IGZ1bmN0aW9uIChvcHRpb25zID0gW10sIHBhcmFtcyA9IHsgc2VsZWN0ZWQ6ICcnIH0pIHtcclxuICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xyXG4gICAgICAgICAgICBpZiAoc2VsZi5pc3NldChwYXJhbXMuZmxhZykpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5uZXJIVE1MID0gJyc7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3B0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRleHQgPSBvcHRpb25zW2ldLnRleHQgfHwgb3B0aW9uc1tpXTtcclxuICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IG9wdGlvbnNbaV0udmFsdWUgfHwgb3B0aW9uc1tpXTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgb3B0aW9uID0gdGhpcy5tYWtlRWxlbWVudCh7IGVsZW1lbnQ6ICdvcHRpb24nLCBhdHRyaWJ1dGVzOiB7IHZhbHVlIH0sIHRleHQgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKSA9PSAnbnVsbCcpIHtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb24uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChzZWxmLmlzc2V0KHBhcmFtcy5zZWxlY3RlZCkgJiYgdmFsdWUgPT0gcGFyYW1zLnNlbGVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uLnNldEF0dHJpYnV0ZSgnc2VsZWN0ZWQnLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLmNvbW1vbkFuY2VzdG9yID0gZnVuY3Rpb24gKGVsZW1lbnRBLCBlbGVtZW50Qikge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBhbmNlc3RvckEgb2YgZWxlbWVudEEucGFyZW50cygpKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBhbmNlc3RvckIgb2YgZWxlbWVudEIucGFyZW50cygpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuY2VzdG9yQSA9PSBhbmNlc3RvckIpIHJldHVybiBhbmNlc3RvckE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgRWxlbWVudC5wcm90b3R5cGUub25BZGRlZCA9IGZ1bmN0aW9uIChjYWxsYmFjayA9ICgpID0+IHsgfSkge1xyXG4gICAgICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ0RPTU5vZGVJbnNlcnRlZEludG9Eb2N1bWVudCcsIGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL1N0b3JlIHRoZSBzdGF0ZXMgb2YgYW4gZWxlbWVudCBoZXJlXHJcbiAgICAgICAgRWxlbWVudC5wcm90b3R5cGUuc3RhdGVzID0ge307XHJcblxyXG4gICAgICAgIC8vVGhpcyBpcyBhIHRlbXBvcmFyeSBzdG9yYWdlIGZvciBlbGVtZW50cyBhdHRyaWJ1dGVzXHJcbiAgICAgICAgRWxlbWVudC5wcm90b3R5cGUudGVtcCA9IHt9O1xyXG5cclxuICAgICAgICAvL1RoaXMgbGlzdGVucyBhbmQgaGFuZGxlcyBmb3IgbXVsdGlwbGUgYnViYmxlZCBldmVudHNcclxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS5tYW55QnViYmxlZEV2ZW50cyA9IGZ1bmN0aW9uIChldmVudHMsIGNhbGxiYWNrID0gKCkgPT4geyB9KSB7XHJcbiAgICAgICAgICAgIGV2ZW50cyA9IGV2ZW50cy5zcGxpdCgnLCcpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBldmVudCBvZiBldmVudHMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYnViYmxlZEV2ZW50KGV2ZW50LnRyaW0oKSwgY2FsbGJhY2spO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL1RoaXMgbGlzdGVucyBhbmQgaGFuZGxlcyBmb3IgbXVsdGlwbGUgYnViYmxlZCBldmVudHMgdGhhdCBkaWQgbm90IGJ1YmJsZVxyXG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLm1hbnlOb3RCdWJibGVkRXZlbnRzID0gZnVuY3Rpb24gKGV2ZW50cywgY2FsbGJhY2sgPSAoKSA9PiB7IH0pIHtcclxuICAgICAgICAgICAgZXZlbnRzID0gZXZlbnRzLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGV2ZW50IG9mIGV2ZW50cykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ub3RCdWJibGVkRXZlbnQoZXZlbnQudHJpbSgpLCBjYWxsYmFjayk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vVGhpcyBoYW5kbGVzIGFsbCBldmVudHMgdGhhdCBhcmUgYnViYmxlZCB3aXRoaW4gYW4gZWxlbWVudCBhbmQgaXQncyBjaGlsZHJlblxyXG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLmJ1YmJsZWRFdmVudCA9IGZ1bmN0aW9uIChldmVudCwgY2FsbGJhY2sgPSAoKSA9PiB7IH0pIHtcclxuICAgICAgICAgICAgLy9MaXN0ZW4gZm9yIHRoaXMgZXZlbnQgb24gdGhlIGVudGlyZSBkb2N1bWVudFxyXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBldmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICAvL2lmIHRoZSBldmVudCBidWJibGVzIHVwIHRoZSBlbGVtZW50IGZpcmUgdGhlIGNhbGxiYWNrXHJcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQudGFyZ2V0ID09IHRoaXMgfHwgdGhpcy5pc0FuY2VzdG9yKGV2ZW50LnRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhldmVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgRWxlbWVudC5wcm90b3R5cGUuYWRkQ2hpbGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24gKG5hbWUgPSAnJywgY2hpbGQgPSB7IGlkOiAnJywgY2xhc3NlczogW10sIG5vZGVOYW1lOiAnJyB9LCBjYWxsQmFjayA9ICgpID0+IHsgfSkge1xyXG4gICAgICAgICAgICBsZXQgdGFyZ2V0LCBwYXJlbnQsIGlkZW50aWZpZXIsIGZsYWc7XHJcbiAgICAgICAgICAgIGlmIChjaGlsZC5jb25zdHJ1Y3RvciAhPSBPYmplY3QpIGNoaWxkID0ge307XHJcbiAgICAgICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihuYW1lLCBlID0+IHtcclxuICAgICAgICAgICAgICAgIHRhcmdldCA9IGUudGFyZ2V0O1xyXG4gICAgICAgICAgICAgICAgaWRlbnRpZmllciA9ICcnO1xyXG4gICAgICAgICAgICAgICAgZmxhZyA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkLmlkICE9IHVuZGVmaW5lZCAmJiBjaGlsZC5pZC5jb25zdHJ1Y3RvciA9PSBTdHJpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZGVudGlmaWVyICs9IGAjJHtjaGlsZC5pZH1gO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChmbGFnKSBmbGFnID0gZXZlbnQudGFyZ2V0LmlkID09IGNoaWxkLmlkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkLm5vZGVOYW1lICE9IHVuZGVmaW5lZCAmJiBjaGlsZC5ub2RlTmFtZS5jb25zdHJ1Y3RvciA9PSBTdHJpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZGVudGlmaWVyICs9IGNoaWxkLm5vZGVOYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChmbGFnKSBmbGFnID0gZXZlbnQudGFyZ2V0Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT0gY2hpbGQubm9kZU5hbWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGQuY2xhc3NlcyAhPSB1bmRlZmluZWQgJiYgQXJyYXkuaXNBcnJheShjaGlsZC5jbGFzc2VzKSAmJiBjaGlsZC5jbGFzc2VzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlkZW50aWZpZXIgKz0gYC4ke2NoaWxkLmNsYXNzZXMuam9pbignLicpfWA7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZsYWcpIGZsYWcgPSBldmVudC50YXJnZXQuaGFzQ2xhc3NlcyhjaGlsZC5jbGFzc2VzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoKGZsYWcgIT0gdW5kZWZpbmVkICYmIGZsYWcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZS5idWJibGVkVG8gPSB0YXJnZXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbEJhY2soZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQgPSB0YXJnZXQuZ2V0UGFyZW50cyhpZGVudGlmaWVyKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocGFyZW50ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZS5idWJibGVkVG8gPSBwYXJlbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxCYWNrKGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL1RoaXMgaGFuZGxlcyBhbGwgZXZlbnRzIHRoYXQgYXJlIG5vdCBidWJibGVkIHdpdGhpbiBhbiBlbGVtZW50IGFuZCBpdCdzIGNoaWxkcmVuXHJcbiAgICAgICAgRWxlbWVudC5wcm90b3R5cGUubm90QnViYmxlZEV2ZW50ID0gZnVuY3Rpb24gKGV2ZW50LCBjYWxsYmFjayA9ICgpID0+IHsgfSkge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBldmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIShldmVudC50YXJnZXQgPT0gdGhpcyB8fCB0aGlzLmlzQW5jZXN0b3IoZXZlbnQudGFyZ2V0KSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhldmVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9MaXN0ZW4gdG8gbXVsdGlwbGUgZXZlbnRzIGF0IHRpbWUgd2l0aCBhIHNpbmdsZSBjYWxsYmFjayBmdW5jdGlvblxyXG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLmFkZE11bHRpcGxlRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uIChldmVudHMsIGNhbGxiYWNrID0gKCkgPT4geyB9KSB7XHJcbiAgICAgICAgICAgIGV2ZW50cyA9IGV2ZW50cy5zcGxpdCgnLCcpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBldmVudCBvZiBldmVudHMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihldmVudC50cmltKCksIGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGUpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vcGVyZm9ybSBhY3Rpb25zIG9uIG1vdXNlZW50ZXIgYW5kIG1vdXNlbGVhdmVcclxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS5ob3ZlciA9IGZ1bmN0aW9uIChtb3ZlaW4gPSAoKSA9PiB7IH0sIG1vdmVvdXQgPSAoKSA9PiB7IH0pIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBtb3ZlaW4gPT09ICdmdW5jdGlvbicpXHJcbiAgICAgICAgICAgICAgICAgICAgbW92ZWluKGV2ZW50KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBldmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG1vdmVvdXQgPT09ICdmdW5jdGlvbicpXHJcbiAgICAgICAgICAgICAgICAgICAgbW92ZW91dChldmVudCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9hIHNob3J0ZXIgbmFtZSBmb3IgcXVlcnlTZWxlY3RvclxyXG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLmZpbmQgPSBmdW5jdGlvbiAobmFtZSA9ICcnLCBwb3NpdGlvbiA9IDApIHtcclxuICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAoc2VsZi5pc3NldChwb3NpdGlvbikpIHsvL2dldCB0aGUgYWxsIHRoZSBlbGVtZW50cyBmb3VuZCBhbmQgcmV0dXJuIHRoZSBvbmUgYXQgdGhpcyBwYXJ0aWN1bGFyIHBvc2l0aW9uXHJcbiAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwobmFtZSkuZm9yRWFjaCgoZSwgcCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwb3NpdGlvbiA9PSBwKSBlbGVtZW50ID0gZTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudCA9IHRoaXMucXVlcnlTZWxlY3RvcihuYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvL2Egc2hvcnRlciBuYW1lIGZvciBxdWVyeVNlbGVjdG9yQWxsXHJcbiAgICAgICAgRWxlbWVudC5wcm90b3R5cGUuZmluZEFsbCA9IGZ1bmN0aW9uIChuYW1lID0gJycpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucXVlcnlTZWxlY3RvckFsbChuYW1lKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vcGVyZm9ybSBhbiBleHRlbmRlZCBxdWVyeVNlbGVjdGlvbiBvbiB0aGlzIGVsZW1lbnRcclxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS5zZWFyY2ggPSBmdW5jdGlvbiAobmFtZSA9ICcnLCBvcHRpb25zID0geyBhdHRyaWJ1dGVzOiB7fSwgaWQ6ICcnLCBub2RlTmFtZTogJycsIGNsYXNzOiAnJywgY2xhc3NlczogJycgfSwgcG9zaXRpb24gPSAwKSB7XHJcbiAgICAgICAgICAgIGxldCBlbGVtZW50ID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IGZvdW5kRWxlbWVudHMgPSBbXTsvL2FsbCB0aGUgZWxlbWVudHMgbWVldGluZyB0aGUgcmVxdWlyZW1lbnRzXHJcblxyXG4gICAgICAgICAgICBpZiAoc2VsZi5pc3NldChvcHRpb25zKSkgey8vaWYgdGhlIG9wdGlvbnMgdG8gY2hlY2sgaXMgc2V0XHJcbiAgICAgICAgICAgICAgICBsZXQgYWxsRWxlbWVudHMgPSB0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwobmFtZSk7Ly9nZXQgYWxsIHRoZSBwb3NzaWJsZSBlbGVtZW50c1xyXG5cclxuICAgICAgICAgICAgICAgIC8vbG9vcCB0aHJvdWdoIHRoZW0gYW5kIGNoZWNrIGlmIHRoZSBtYXRjaCB0aGUgb3B0aW9uc1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhbGxFbGVtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBhbGxFbGVtZW50c1tpXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy9jaGVjayBmb3IgdGhlIGF0dHJpYnV0ZXNcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5pc3NldChvcHRpb25zLmF0dHJpYnV0ZXMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGF0dHIgaW4gb3B0aW9ucy5hdHRyaWJ1dGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjaGVjayBhbGwgdGhlIGF0dHJpYnV0ZXMgb25lIGFmdGVyIHRoZSBvdGhlclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQuZ2V0QXR0cmlidXRlKGF0dHIpICE9IG9wdGlvbnMuYXR0cmlidXRlc1thdHRyXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vaWYgdGhpcyBlbGVtZW50IGlzIG5vIGxvbmcgdmFsaWQgc2tpcCBpdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5pc251bGwoZWxlbWVudCkpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy9jaGVjayBmb3IgdGhlIElEXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYuaXNzZXQob3B0aW9ucy5pZCkgJiYgb3B0aW9ucy5pZCAhPSBlbGVtZW50LmlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vY2hlY2sgZm9yIHRoZSBjbGFzc1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLmlzc2V0KG9wdGlvbnMuY2xhc3MpICYmICFlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhvcHRpb25zLmNsYXNzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvL2NoZWNrIGZvciB0aGUgY2xhc3Nlc1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLmlzc2V0KG9wdGlvbnMuY2xhc3NlcykgJiYgIWVsZW1lbnQuaGFzQ2xhc3NlcyhvcHRpb25zLmNsYXNzZXMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vY2hlY2sgZm9yIHRoZSBub2RlbmFtZVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLmlzc2V0KG9wdGlvbnMubm9kZU5hbWUpICYmIGVsZW1lbnQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSAhPSBvcHRpb25zLm5vZGVOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vY2hlY2sgaWYgdG8gcmV0dXJuIGZvciBhIHBhcnRpY3VsYXIgcG9zaXRpb25cclxuICAgICAgICAgICAgICAgICAgICBpZiAocG9zaXRpb24gPD0gMCkgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgZm91bmRFbGVtZW50cy5wdXNoKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy9nZXQgdGhlIGVsZW1lbnQgYXQgdGhlIHNwZWNpZmllZCBwb3NpdGlvblxyXG4gICAgICAgICAgICAgICAgaWYgKGZvdW5kRWxlbWVudHMubGVuZ3RoICYmIHNlbGYuaXNzZXQoZm91bmRFbGVtZW50c1twb3NpdGlvbl0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudCA9IGZvdW5kRWxlbWVudHNbcG9zaXRpb25dO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gdGhpcy5maW5kKG5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvL3BlcmZvcm0gc2VhcmNoIGZvciBhbGwgdGhlIGVsZW1lbnRzIHRoYXQgbWVldCBhIHJlcXVpcmVtZW50XHJcbiAgICAgICAgRWxlbWVudC5wcm90b3R5cGUuc2VhcmNoQWxsID0gZnVuY3Rpb24gKG5hbWUgPSAnJywgb3B0aW9ucyA9IHsgYXR0cmlidXRlczoge30sIGlkOiAnJywgbm9kZU5hbWU6ICcnLCBjbGFzczogJycsIGNsYXNzZXM6ICcnIH0pIHtcclxuICAgICAgICAgICAgaWYgKHNlbGYuaXNzZXQob3B0aW9ucykpIHtcclxuICAgICAgICAgICAgICAgIGxldCBhbGxFbGVtZW50cyA9IHRoaXMucXVlcnlTZWxlY3RvckFsbChuYW1lKTtcclxuICAgICAgICAgICAgICAgIGxldCBlbGVtZW50cyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhbGxFbGVtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBlbGVtZW50ID0gYWxsRWxlbWVudHNbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYuaXNzZXQob3B0aW9ucy5hdHRyaWJ1dGVzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBhdHRyIGluIG9wdGlvbnMuYXR0cmlidXRlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQuZ2V0QXR0cmlidXRlKGF0dHIpICE9IG9wdGlvbnMuYXR0cmlidXRlc1thdHRyXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5pc3NldChvcHRpb25zLmlkKSAmJiBvcHRpb25zLmlkICE9IGVsZW1lbnQuaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYuaXNzZXQob3B0aW9ucy5jbGFzcykgJiYgIWVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKG9wdGlvbnMuY2xhc3MpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLmlzc2V0KG9wdGlvbnMuY2xhc3NlcykgJiYgIWVsZW1lbnQuaGFzQ2xhc3NlcyhvcHRpb25zLmNsYXNzZXMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLmlzc2V0KG9wdGlvbnMubm9kZU5hbWUpICYmIGVsZW1lbnQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSAhPSBvcHRpb25zLm5vZGVOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghc2VsZi5pc251bGwoZWxlbWVudCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudHMucHVzaChlbGVtZW50KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudHM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucXVlcnlTZWxlY3RvckFsbChuYW1lKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vbG9vayBmb3IgbXVsdGlwbGUgc2luZ2xlIGVsZW1lbnRzIGF0IGEgdGltZVxyXG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLmZldGNoID0gZnVuY3Rpb24gKG5hbWVzID0gW10sIHBvc2l0aW9uID0gMCkge1xyXG4gICAgICAgICAgICBsZXQgZWxlbWVudHMgPSB7fTtcclxuICAgICAgICAgICAgZm9yIChsZXQgbmFtZSBvZiBuYW1lcykge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudHNbbmFtZV0gPSB0aGlzLmZpbmQobmFtZSwgcG9zaXRpb24pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudHM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL2xvb2sgZm9yIG11bHRpcGxlIG5vZGVsaXN0cyBhdCBhIHRpbWVcclxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS5mZXRjaEFsbCA9IGZ1bmN0aW9uIChuYW1lcyA9IFtdKSB7XHJcbiAgICAgICAgICAgIGxldCBlbGVtZW50cyA9IHt9O1xyXG4gICAgICAgICAgICBmb3IgKGxldCBuYW1lIG9mIG5hbWVzKSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50c1tuYW1lXSA9IHRoaXMuZmluZEFsbChuYW1lKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnRzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9HZXQgdGhlIG5vZGVzIGJldHdlZW4gdHdvIGNoaWxkIGVsZW1lbnRzXHJcbiAgICAgICAgRWxlbWVudC5wcm90b3R5cGUubm9kZXNCZXR3ZWVuID0gZnVuY3Rpb24gKGVsZW1lbnRBLCBlbGVtZW50Qikge1xyXG4gICAgICAgICAgICBsZXQgaW5CZXR3ZWVuTm9kZXMgPSBbXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgY2hpbGQgb2YgQXJyYXkuZnJvbSh0aGlzLmNoaWxkcmVuKSkgey8vZ2V0IGFsbCB0aGUgY2hpbGRyZW5cclxuICAgICAgICAgICAgICAgIC8vY2hlY2sgaWYgdGhlIHR3byBlbGVtZW50cyBhcmUgY2hpbGRyZW4gb2YgdGhpcyBlbGVtZW50XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGQgPT0gZWxlbWVudEEgfHwgY2hpbGQgPT0gZWxlbWVudEIgfHwgY2hpbGQuaXNBbmNlc3RvcihlbGVtZW50QSkgfHwgY2hpbGQuaXNBbmNlc3RvcihlbGVtZW50QikpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbkJldHdlZW5Ob2Rlcy5wdXNoKGNoaWxkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGluQmV0d2Vlbk5vZGVzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9HZXQgaWYgZWxlbWVudCBpcyBjaGlsZCBvZiBhbiBlbGVtZW50XHJcbiAgICAgICAgRWxlbWVudC5wcm90b3R5cGUuaXNBbmNlc3RvciA9IGZ1bmN0aW9uIChjaGlsZCkge1xyXG4gICAgICAgICAgICBsZXQgcGFyZW50cyA9IGNoaWxkLnBhcmVudHMoKTsvL0dldCBhbGwgdGhlIHBhcmVudHMgb2YgY2hpbGRcclxuICAgICAgICAgICAgcmV0dXJuIHBhcmVudHMuaW5jbHVkZXModGhpcyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy9HZXQgYWxsIHRoZSBwYXJlbnRzIG9mIGFuIGVsZW1lbnQgdW50aWwgZG9jdW1lbnRcclxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS5wYXJlbnRzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBsZXQgcGFyZW50cyA9IFtdO1xyXG4gICAgICAgICAgICBsZXQgY3VycmVudFBhcmVudCA9IHRoaXMucGFyZW50Tm9kZTtcclxuICAgICAgICAgICAgd2hpbGUgKGN1cnJlbnRQYXJlbnQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcGFyZW50cy5wdXNoKGN1cnJlbnRQYXJlbnQpO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudFBhcmVudCA9IGN1cnJlbnRQYXJlbnQucGFyZW50Tm9kZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHBhcmVudHM7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgRWxlbWVudC5wcm90b3R5cGUuY3VzdG9tUGFyZW50cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbGV0IHBhcmVudHMgPSB0aGlzLnBhcmVudHMoKTtcclxuICAgICAgICAgICAgbGV0IGN1c3RvbVBhcmVudHMgPSBbXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXJlbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocGFyZW50c1tpXS5ub2RlTmFtZS5pbmNsdWRlcygnLScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VzdG9tUGFyZW50cy5wdXNoKHBhcmVudHNbaV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBjdXN0b21QYXJlbnRzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9SZW1vdmUgYSBzdGF0ZSBmcm9tIGFuIGVsZW1lbnRcclxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS5yZW1vdmVTdGF0ZSA9IGZ1bmN0aW9uIChwYXJhbXMgPSB7IG5hbWU6ICcnIH0pIHtcclxuICAgICAgICAgICAgbGV0IHN0YXRlID0gdGhpcy5nZXRTdGF0ZShwYXJhbXMpOy8vZ2V0IHRoZSBzdGF0ZSAoZWxlbWVudClcclxuICAgICAgICAgICAgaWYgKHNlbGYuaXNzZXQoc3RhdGUpICYmIHNlbGYuaXNzZXQocGFyYW1zLmZvcmNlKSkgey8vaWYgc3RhdGUgZXhpc3RzIGFuZCBzaG91bGQgYmUgZGVsZXRlZFxyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuaXNzZXQoc3RhdGUuZGF0YXNldC5kb21LZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHNlbGYudmlydHVhbFtzdGF0ZS5kYXRhc2V0LmRvbUtleV07Ly9kZWxldGUgdGhlIGVsZW1lbnQgZnJvbSB2aXJ0dWFsIGRvbVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgc3RhdGUucmVtb3ZlKCk7Ly9yZW1vdmUgdGhlIGVsZW1lbnQgZnJvbSBkb21cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZShgZGF0YS0ke3BhcmFtcy5uYW1lfWApOy8vcmVtb3ZlIHRoZSBzdGF0ZSBmcm9tIGVsZW1lbnRcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vR2V0IGFuIGVsZW1lbnQncyBzdGF0ZSBcclxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS5nZXRTdGF0ZSA9IGZ1bmN0aW9uIChwYXJhbXMgPSB7IG5hbWU6ICcnIH0pIHtcclxuICAgICAgICAgICAgbGV0IHN0YXRlID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IHN0YXRlTmFtZTtcclxuXHJcbiAgICAgICAgICAgIC8vZ2V0IHRoZSBzdGF0ZSBuYW1lXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcGFyYW1zID09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICBzdGF0ZU5hbWUgPSBwYXJhbXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoc2VsZi5pc3NldCh0aGlzLmRhdGFzZXRbYCR7cGFyYW1zLm5hbWV9YF0pKSB7XHJcbiAgICAgICAgICAgICAgICBzdGF0ZU5hbWUgPSBwYXJhbXMubmFtZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHNlbGYuaXNzZXQoc3RhdGVOYW1lKSkgey8vZ2V0IHRoZSBzdGF0ZVxyXG4gICAgICAgICAgICAgICAgc3RhdGUgPSBzZWxmLnZpcnR1YWxbdGhpcy5kYXRhc2V0W3N0YXRlTmFtZV1dO1xyXG4gICAgICAgICAgICAgICAgLy8gbGV0IHN0YXRlID0gc2VsZi5vYmplY3RUb0FycmF5KHRoaXMuc3RhdGVzW3N0YXRlTmFtZV0pLnBvcCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy9hZGQgYSBzdGF0ZSB0byBhbiBlbGVtZW50XHJcbiAgICAgICAgRWxlbWVudC5wcm90b3R5cGUuYWRkU3RhdGUgPSBmdW5jdGlvbiAocGFyYW1zID0geyBuYW1lOiAnJyB9KSB7XHJcbiAgICAgICAgICAgIC8vbWFrZSBzdXJlIHRoZSBzdGF0ZSBoYXMgYSBkb21rZXlcclxuICAgICAgICAgICAgaWYgKCFzZWxmLmlzc2V0KHBhcmFtcy5zdGF0ZS5kYXRhc2V0LmRvbUtleSkpIHtcclxuICAgICAgICAgICAgICAgIHBhcmFtcy5zdGF0ZS5zZXRLZXkoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9hZGQgdGhlIHN0YXRlIHRvIHRoZSBlbGVtZW50cyBkYXRhc2V0XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YXNldFtwYXJhbXMubmFtZV0gPSBwYXJhbXMuc3RhdGUuZGF0YXNldC5kb21LZXk7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGVzW3BhcmFtcy5uYW1lXSA9IHt9Ly9pbml0aWFsaXplIHRoZSBzdGF0ZVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvL3NldCB0aGUgc3RhdGUgb2YgYW4gZWxlbWVudFxyXG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLnNldFN0YXRlID0gZnVuY3Rpb24gKHBhcmFtcyA9IHsgbmFtZTogJycsIGF0dHJpYnV0ZXM6IHt9LCByZW5kZXI6IHt9LCBjaGlsZHJlbjogW10sIHRleHQ6ICcnLCBodG1sOiAnJywgdmFsdWU6ICcnLCBvcHRpb25zOiBbXSB9KSB7XHJcbiAgICAgICAgICAgIGxldCBzdGF0ZSA9IHRoaXMuZ2V0U3RhdGUocGFyYW1zKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGxldCBmb3VuZCA9IHRoaXMuc3RhdGVzW3BhcmFtcy5uYW1lXVtKU09OLnN0cmluZ2lmeShwYXJhbXMpXTtcclxuICAgICAgICAgICAgLy8gaWYgKHNlbGYuaXNzZXQoZm91bmQpKSB7XHJcbiAgICAgICAgICAgIC8vICAgICBzdGF0ZS5pbm5lckhUTUwgPSBmb3VuZC5pbm5lckhUTUw7XHJcbiAgICAgICAgICAgIC8vICAgICBzdGF0ZS5zZXRBdHRyaWJ1dGVzKGZvdW5kLmdldEF0dHJpYnV0ZXMoKSk7XHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgLy8gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vICAgICBzdGF0ZS5zZXRBdHRyaWJ1dGVzKHBhcmFtcy5hdHRyaWJ1dGVzKTtcclxuICAgICAgICAgICAgLy8gICAgIGlmIChzZWxmLmlzc2V0KHBhcmFtcy5jaGlsZHJlbikpIHsvL2FkZCB0aGUgY2hpbGRyZW4gaWYgc2V0XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgc3RhdGUubWFrZUVsZW1lbnQocGFyYW1zLmNoaWxkcmVuKTtcclxuICAgICAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAgICAgLy8gICAgIGlmIChzZWxmLmlzc2V0KHBhcmFtcy5yZW5kZXIpKSB7Ly9hZGQgdGhlIGNoaWxkcmVuIGlmIHNldFxyXG4gICAgICAgICAgICAvLyAgICAgICAgIHN0YXRlLnJlbmRlcihwYXJhbXMucmVuZGVyKTtcclxuICAgICAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAgICAgLy8gICAgIGlmIChzZWxmLmlzc2V0KHBhcmFtcy50ZXh0KSkgc3RhdGUudGV4dENvbnRlbnQgPSBwYXJhbXMudGV4dDsvL3NldCB0aGUgaW5uZXJUZXh0XHJcbiAgICAgICAgICAgIC8vICAgICBpZiAoc2VsZi5pc3NldChwYXJhbXMudmFsdWUpKSBzdGF0ZS52YWx1ZSA9IHBhcmFtcy52YWx1ZTsvL3NldCB0aGUgdmFsdWVcclxuICAgICAgICAgICAgLy8gICAgIGlmIChzZWxmLmlzc2V0KHBhcmFtcy5vcHRpb25zKSkgey8vYWRkIG9wdGlvbnMgaWYgaXNzZXRcclxuICAgICAgICAgICAgLy8gICAgICAgICBmb3IgKHZhciBpIG9mIHBhcmFtcy5vcHRpb25zKSB7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIHN0YXRlLm1ha2VFbGVtZW50KHsgZWxlbWVudDogJ29wdGlvbicsIHZhbHVlOiBpLCB0ZXh0OiBpLCBhdHRhY2htZW50OiAnYXBwZW5kJyB9KTtcclxuICAgICAgICAgICAgLy8gICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyAgICAgdGhpcy5zdGF0ZXNbcGFyYW1zLm5hbWVdW0pTT04uc3RyaW5naWZ5KHBhcmFtcyldID0gc3RhdGUuY2xvbmVOb2RlKHRydWUpO1xyXG4gICAgICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgICAgICBzdGF0ZS5zZXRBdHRyaWJ1dGVzKHBhcmFtcy5hdHRyaWJ1dGVzKTtcclxuICAgICAgICAgICAgaWYgKHNlbGYuaXNzZXQocGFyYW1zLmNoaWxkcmVuKSkgey8vYWRkIHRoZSBjaGlsZHJlbiBpZiBzZXRcclxuICAgICAgICAgICAgICAgIHN0YXRlLm1ha2VFbGVtZW50KHBhcmFtcy5jaGlsZHJlbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHNlbGYuaXNzZXQocGFyYW1zLnJlbmRlcikpIHsvL2FkZCB0aGUgY2hpbGRyZW4gaWYgc2V0XHJcbiAgICAgICAgICAgICAgICBzdGF0ZS5yZW5kZXIocGFyYW1zLnJlbmRlcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHNlbGYuaXNzZXQocGFyYW1zLnRleHQpKSBzdGF0ZS50ZXh0Q29udGVudCA9IHBhcmFtcy50ZXh0Oy8vc2V0IHRoZSBpbm5lclRleHRcclxuICAgICAgICAgICAgaWYgKHNlbGYuaXNzZXQocGFyYW1zLmh0bWwpKSBzdGF0ZS5pbm5lckhUTUwgPSBwYXJhbXMuaHRtbDsvL3NldCB0aGUgaW5uZXJUZXh0XHJcbiAgICAgICAgICAgIGlmIChzZWxmLmlzc2V0KHBhcmFtcy52YWx1ZSkpIHN0YXRlLnZhbHVlID0gcGFyYW1zLnZhbHVlOy8vc2V0IHRoZSB2YWx1ZVxyXG4gICAgICAgICAgICBpZiAoc2VsZi5pc3NldChwYXJhbXMub3B0aW9ucykpIHsvL2FkZCBvcHRpb25zIGlmIGlzc2V0XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpIG9mIHBhcmFtcy5vcHRpb25zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUubWFrZUVsZW1lbnQoeyBlbGVtZW50OiAnb3B0aW9uJywgdmFsdWU6IGksIHRleHQ6IGksIGF0dGFjaG1lbnQ6ICdhcHBlbmQnIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLnN0YXRlc1twYXJhbXMubmFtZV1bSlNPTi5zdHJpbmdpZnkocGFyYW1zKV0gPSBzdGF0ZS5jbG9uZU5vZGUodHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy9hc3luYyB2ZXJzaW9uIG9mIHNldHN0YXRlXHJcbiAgICAgICAgRWxlbWVudC5wcm90b3R5cGUuc2V0S2V5QXN5bmMgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnNldEtleSgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vc2V0IGVsZW1lbnQncyBkb20ga2V5IGZvciB0aGUgdmlydHVhbCBkb21cclxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS5zZXRLZXkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGxldCBrZXkgPSBEYXRlLm5vdygpLnRvU3RyaW5nKDM2KSArIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnNsaWNlKDIpOy8vZ2VuZXJhdGUgdGhlIGtleVxyXG4gICAgICAgICAgICBpZiAoIXNlbGYuaXNzZXQodGhpcy5kYXRhc2V0LmRvbUtleSkpIHsvL2RvZXMgdGhpcyBlbGVtZW50IGhhdmUgYSBrZXlcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YXNldC5kb21LZXkgPSBrZXk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBrZXkgPSB0aGlzLmRhdGFzZXQuZG9tS2V5O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNlbGYudmlydHVhbFtrZXldID0gdGhpczsvL2FkZCBpdCB0byB0aGUgdmlydHVhbCBkb21cclxuICAgICAgICAgICAgcmV0dXJuIGtleTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvL2Ryb3AgZG93biBhIGNoaWxkXHJcbiAgICAgICAgRWxlbWVudC5wcm90b3R5cGUuZHJvcERvd24gPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICBsZXQgcGFyZW50Q29udGVudCA9IHRoaXMuY2xvbmVOb2RlKHRydWUpO1xyXG4gICAgICAgICAgICB0aGlzLmlubmVySFRNTCA9ICcnO1xyXG4gICAgICAgICAgICB0aGlzLmFwcGVuZChwYXJlbnRDb250ZW50KTtcclxuICAgICAgICAgICAgcGFyZW50Q29udGVudC5jc3MoeyBib3hTaGFkb3c6ICcxcHggMXB4IDFweCAxcHggI2FhYWFhYScgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuY3NzKHsgYm94U2hhZG93OiAnMC41cHggMC41cHggMC41cHggMC41cHggI2NjY2NjYycgfSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgZHJvcENvbnRhaW5lciA9IHRoaXMubWFrZUVsZW1lbnQoe1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudDogJ2RpdicsIGF0dHJpYnV0ZXM6IHsgY2xhc3M6ICdkcm9wLWRvd24nIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGRyb3BDb250YWluZXIuYXBwZW5kKGVsZW1lbnQpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5yZW1vdmVEcm9wRG93biA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGRyb3BDb250YWluZXIucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnRDb250ZW50LmNzcyh7IGJveFNoYWRvdzogJ3Vuc2V0JyB9KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5uZXJIVE1MID0gcGFyZW50Q29udGVudC5pbm5lckhUTUw7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vc3RvcCBtb25pdG9yaW5nIHRoaXMgZWxlbWVudCBmb3IgY2hhbmdlc1xyXG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLnN0b3BNb25pdG9yID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vYnNlcnZlKSB0aGlzLm9ic2VydmVyLmRpc2Nvbm5lY3QoKTsvL2Rpc2Nvbm5lY3Qgb2JzZXJ2ZXJcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL0NoZWNrIGlmIGFuIGF0dHJpYnV0ZSBoYXMgY2hhbmdlZCBpbiB0aGlzIGVsZW1lbnRcclxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS5vbkF0dHJpYnV0ZUNoYW5nZSA9IGZ1bmN0aW9uIChhdHRyaWJ1dGUgPSAnJywgY2FsbGJhY2sgPSAoKSA9PiB7IH0pIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdhdHRyaWJ1dGVzQ2hhbmdlZCcsIGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChldmVudC5kZXRhaWwuYXR0cmlidXRlTmFtZSA9PSBhdHRyaWJ1dGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhldmVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gbW9uaXRvciB0aGlzIGVsZW1lbnQgZm9yIGNoYW5nZXNcclxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS5tb25pdG9yID0gZnVuY3Rpb24gKGNvbmZpZyA9IHsgYXR0cmlidXRlczogdHJ1ZSwgY2hpbGRMaXN0OiB0cnVlLCBzdWJ0cmVlOiB0cnVlIH0pIHtcclxuICAgICAgICAgICAgdGhpcy5vYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKChtdXRhdGlvbkxpc3QsIG9ic2VydmVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAobXV0YXRpb25MaXN0Lmxlbmd0aCkgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnbXV0YXRlZCcpKTsvL2ZpcmUgbXV0YXRlZCBldmVudCBmb3IgaXRcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IG11dGF0aW9uIG9mIG11dGF0aW9uTGlzdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChtdXRhdGlvbi50eXBlID09ICdjaGlsZExpc3QnKSB7Ly9pZiB0aGUgY2hhbmdlIHdhcyBhIGNoaWxkIGZpcmUgY2hpbGRsaXN0Y2hhbmdlZCBldmVudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdjaGlsZExpc3RjaGFuZ2VkJywgeyBkZXRhaWw6IG11dGF0aW9uIH0pKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAobXV0YXRpb24udHlwZSA9PSAnYXR0cmlidXRlcycpIHsvL2lmIHRoZSBjaGFuZ2Ugd2FzIGEgY2hpbGQgZmlyZSBjaGlsZGxpc3RjaGFuZ2VkIGV2ZW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2F0dHJpYnV0ZXNDaGFuZ2VkJywgeyBkZXRhaWw6IG11dGF0aW9uIH0pKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAobXV0YXRpb24udHlwZSA9PSAnY2hhcmFjdGVyRGF0YScpIHsvL2lmIHRoZSBjaGFuZ2Ugd2FzIGEgY2hpbGQgZmlyZSBjaGlsZGxpc3RjaGFuZ2VkIGV2ZW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2NoYXJhY3RlckRhdGFDaGFuZ2VkJywgeyBkZXRhaWw6IG11dGF0aW9uIH0pKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5vYnNlcnZlci5vYnNlcnZlKHRoaXMsIGNvbmZpZyk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgRWxlbWVudC5wcm90b3R5cGVbJ2NoZWNrQ2hhbmdlcyddID0gZnVuY3Rpb24gKGNhbGxiYWNrID0gKCkgPT4geyB9KSB7XHJcbiAgICAgICAgICAgIHRoaXMubW9uaXRvcigpO1xyXG4gICAgICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ211dGF0ZWQnLCBldmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhldmVudCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIGNoZWNrIHdoZW4gdGhlIHZhbHVlIG9mIGFuIGVsZW1lbnQgaXMgY2hhbmdlZFxyXG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLm9uQ2hhbmdlZCA9IGZ1bmN0aW9uIChjYWxsQmFjayA9ICgpID0+IHsgfSkge1xyXG4gICAgICAgICAgICBsZXQgdmFsdWUgPSB0aGlzLmdldEF0dHJpYnV0ZSgndmFsdWUnKTtcclxuICAgICAgICAgICAgbGV0IHVwZGF0ZU1lID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBpZiBlbGVtZW50IGlzIGlucHV0IGVsZW1lbnRcclxuICAgICAgICAgICAgICAgIGlmIChldmVudC50YXJnZXQubm9kZU5hbWUgPT0gJ0lOUFVUJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChldmVudC50YXJnZXQudHlwZSA9PSAnZGF0ZScpIHsvLyBpZiB0aGUgdHlwZSBpcyBkYXRlLCBjaGVjayBpZiB0aGUgZGF0ZSBpcyB2YWxpZCB0aGVuIHVwZGF0ZSB0aGUgYXR0cmlidXRlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzRGF0ZSh0aGlzLnZhbHVlKSkgdGhpcy5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgdGhpcy52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGV2ZW50LnRhcmdldC50eXBlID09ICd0aW1lJykgey8vIGlmIHRoZSB0eXBlIGlzIHRpbWUsIGNoZWNrIGlmIHRoZSB0aW1lIGlzIHZhbGlkIHRoZW4gdXBkYXRlIHRoZSBhdHRyaWJ1dGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNUaW1lVmFsaWQodGhpcy52YWx1ZSkpIHRoaXMuc2V0QXR0cmlidXRlKCd2YWx1ZScsIHRoaXMudmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChldmVudC50YXJnZXQudHlwZSA9PSAnZmlsZScpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZpbGVOYW1lID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZmlsZSA9IGV2ZW50LnRhcmdldC5maWxlc1swXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpbGUudHlwZS5pbmRleE9mKCdpbWFnZScpID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaW1hZ2VUb0pzb24oZmlsZSwgY2FsbEJhY2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZSgndmFsdWUnLCB0aGlzLnZhbHVlKTsvL3VwZGF0ZSB0aGUgYXR0cmlidXRlXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoZXZlbnQudGFyZ2V0Lm5vZGVOYW1lID09ICdTRUxFQ1QnKSB7Ly8gaWYgdGhlIGVsZW1lbnQgaXMgc2VsZWN0XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBldmVudC50YXJnZXQub3B0aW9ucy5sZW5ndGg7IGkrKykgey8vdXBkYXRlIHRoZSBzZWxlY3RlZCBvcHRpb24gdXNpbmcgdGhlIHNlbGVjdGVkIGluZGV4XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpID09IGV2ZW50LnRhcmdldC5zZWxlY3RlZEluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC50YXJnZXQub3B0aW9uc1tpXS5zZXRBdHRyaWJ1dGUoJ3NlbGVjdGVkJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC50YXJnZXQub3B0aW9uc1tpXS5yZW1vdmVBdHRyaWJ1dGUoJ3NlbGVjdGVkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChldmVudC50YXJnZXQubm9kZU5hbWUgPT0gJ0RBVEEtRUxFTUVOVCcpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZSgndmFsdWUnLCB0aGlzLnZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGV2ZW50LnRhcmdldC5ub2RlTmFtZSA9PSAnU0VMRUNULUVMRU1FTlQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgdGhpcy52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZhbHVlID0gdGhpcy50ZXh0Q29udGVudDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5pc3NldChjYWxsQmFjaykgJiYgZXZlbnQudGFyZ2V0LnR5cGUgIT0gJ2ZpbGUnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbEJhY2sodGhpcy52YWx1ZSwgZXZlbnQpOy8vZmlyZSB0aGUgY2FsbGJhY2sgZnVuY3Rpb25cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIC8vIGlmIGNoYW5nZSBpcyBjYXVzZWQgYnkga2V5Ym9hcmRcclxuICAgICAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdXBkYXRlTWUoZXZlbnQpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIGlmIGNoYW5nZSBpcyBjYXVzZWQgcHJvZ3JhbWF0aWNhbGx5XHJcbiAgICAgICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB1cGRhdGVNZShldmVudCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vcmVuZGVyIHRoZSBjb250ZW50cyBvZiBhbiBlbGVtZW50XHJcbiAgICAgICAgRWxlbWVudC5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKHBhcmFtcyA9IHsgZWxlbWVudDogJycsIGF0dHJpYnV0ZXM6IHt9IH0sIGV4Y2VwdCkge1xyXG4gICAgICAgICAgICBpZiAoc2VsZi5pc3NldChleGNlcHQpKSB0aGlzLnJlbW92ZUNoaWxkcmVuKGV4Y2VwdCk7Ly9yZW1vdmUgdGhlIGNvbnRlbnRzIG9mIHRoZSBlbGVtZW50IHdpdGggZXhjZXB0aW9uc1xyXG4gICAgICAgICAgICBlbHNlIHRoaXMucmVtb3ZlQ2hpbGRyZW4oKTtcclxuICAgICAgICAgICAgdGhpcy5tYWtlRWxlbWVudChwYXJhbXMpOy8vYXBwZW5kIHRoZSBuZXcgY29udGVudHMgb2YgdGhlIGVsZW1lbnRcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vR2V0IGFsbCB0aGUgc3R5bGVzIGZvciB0aGUgSUQsIHRoZSBjbGFzc2VzIGFuZCB0aGUgZWxlbWVudFxyXG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLmdldEFsbENzc1Byb3BlcnRpZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGxldCBzdHlsZVNoZWV0cyA9IEFycmF5LmZyb20oZG9jdW1lbnQuc3R5bGVTaGVldHMpLC8vZ2V0IGFsbCB0aGUgY3NzIHN0eWxlcyBmaWxlcyBhbmQgcnVsZXNcclxuICAgICAgICAgICAgICAgIGNzc1J1bGVzLFxyXG4gICAgICAgICAgICAgICAgaWQgPSB0aGlzLmlkLFxyXG4gICAgICAgICAgICAgICAgbm9kZU5hbWUgPSB0aGlzLm5vZGVOYW1lLFxyXG4gICAgICAgICAgICAgICAgY2xhc3NMaXN0ID0gQXJyYXkuZnJvbSh0aGlzLmNsYXNzTGlzdCksXHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0ge30sXHJcbiAgICAgICAgICAgICAgICBzZWxlY3RvclRleHQ7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIGNsYXNzTGlzdCkgY2xhc3NMaXN0W2ldID0gYC4ke2NsYXNzTGlzdFtpXX1gOy8vdHVybiBlYWNoIGNsYXNzIHRvIGNzcyBjbGFzcyBmb3JtYXQgWy5jbGFzc11cclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVTaGVldHMubGVuZ3RoOyBpKyspIHsvL2xvb3AgdGhyb3VnaCBhbGwgdGhlIGNzcyBydWxlcyBpbiBkb2N1bWVudC9hcHBcclxuICAgICAgICAgICAgICAgIGNzc1J1bGVzID0gc3R5bGVTaGVldHNbaV0uY3NzUnVsZXM7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGNzc1J1bGVzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3JUZXh0ID0gY3NzUnVsZXNbal0uc2VsZWN0b3JUZXh0OyAvL2ZvciBlYWNoIHNlbGVjdG9yIHRleHQgY2hlY2sgaWYgZWxlbWVudCBoYXMgaXQgYXMgYSBjc3MgcHJvcGVydHlcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0b3JUZXh0ID09IGAjJHtpZH1gIHx8IHNlbGVjdG9yVGV4dCA9PSBub2RlTmFtZSB8fCBjbGFzc0xpc3QuaW5kZXhPZihzZWxlY3RvclRleHQpICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXNbc2VsZWN0b3JUZXh0XSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgc3R5bGUgPSBjc3NSdWxlc1tqXS5zdHlsZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgbiBpbiBzdHlsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0eWxlW25dICE9PSAnJykgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXNbc2VsZWN0b3JUZXh0XVtuXSA9IHN0eWxlW25dXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vaWYgZWxlbWVudCBoYXMgcHJvcGVydHkgYWRkIGl0IHRvIGNzcyBwcm9wZXJ0eVxyXG4gICAgICAgICAgICBwcm9wZXJ0aWVzWydzdHlsZSddID0gdGhpcy5jc3MoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHByb3BlcnRpZXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL0dldCB0aGUgdmFsdWVzIG9mIHByb3BlcnR5IFxyXG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLmdldENzc1Byb3BlcnRpZXMgPSBmdW5jdGlvbiAocHJvcGVydHkgPSAnJykge1xyXG4gICAgICAgICAgICBsZXQgYWxsUHJvcGVydGllcyA9IHRoaXMuZ2V0QWxsQ3NzUHJvcGVydGllcygpO1xyXG4gICAgICAgICAgICBsZXQgcHJvcGVydGllcyA9IHt9O1xyXG4gICAgICAgICAgICBmb3IgKGxldCBuYW1lIGluIGFsbFByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXNbbmFtZV0gPSB7fTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHAgaW4gYWxsUHJvcGVydGllc1tuYW1lXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eSA9PSBwKSBwcm9wZXJ0aWVzW25hbWVdW3BdID0gYWxsUHJvcGVydGllc1tuYW1lXVtwXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHByb3BlcnRpZXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBDaGVjayBpZiB0aGlzIGVsZW1lbnQgaGFzIHRoaXMgcHJvcGVydHlcclxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS5oYXNDc3NQcm9wZXJ0eSA9IGZ1bmN0aW9uIChwcm9wZXJ0eSA9ICcnKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0aWVzID0gdGhpcy5nZXRDc3NQcm9wZXJ0aWVzKHByb3BlcnR5KTsgLy9nZXQgZWxlbWVudHMgY3NzIHByb3BlcnRpZXNcclxuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBwcm9wZXJ0aWVzKSB7Ly9sb29wIHRocm91Z2gganNvbiBvYmplY3RcclxuICAgICAgICAgICAgICAgIGlmIChzZWxmLmlzc2V0KHByb3BlcnRpZXNbaV0pICYmIHByb3BlcnRpZXNbaV0gIT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTsvLyBpZiBwcm9wZXJ0eSBpcyBmb3VuZCByZXR1cm4gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vR2V0IHRoZSBtb3N0IHJlbGF2YW50IHZhbHVlIGZvciB0aGUgcHJvcGVydHlcclxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS5jc3NQcm9wZXJ0eVZhbHVlID0gZnVuY3Rpb24gKHByb3BlcnR5ID0gJycpIHtcclxuICAgICAgICAgICAgLy9jaGVjayBmb3IgdGhlIHZhbHVlIG9mIGEgcHJvcGVydHkgb2YgYW4gZWxlbWVudFxyXG4gICAgICAgICAgICB2YXIgcHJvcGVydGllcyA9IHRoaXMuZ2V0Q3NzUHJvcGVydGllcyhwcm9wZXJ0eSksXHJcbiAgICAgICAgICAgICAgICBpZCA9IHRoaXMuaWQsXHJcbiAgICAgICAgICAgICAgICBjbGFzc0xpc3QgPSBBcnJheS5mcm9tKHRoaXMuY2xhc3NMaXN0KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzZWxmLmlzc2V0KHByb3BlcnRpZXNbJ3N0eWxlJ10pICYmIHByb3BlcnRpZXNbJ3N0eWxlJ10gIT0gJycpIHJldHVybiBwcm9wZXJ0aWVzWydzdHlsZSddOy8vY2hlY2sgaWYgc3R5bGUgcnVsZSBoYXMgdGhlIHByb3BlcnQgYW5kIHJldHVybiBpdCdzIHZhbHVlXHJcbiAgICAgICAgICAgIGlmIChzZWxmLmlzc2V0KGlkKSAmJiBzZWxmLmlzc2V0KHByb3BlcnRpZXNbYCMke2lkfWBdKSAmJiBwcm9wZXJ0aWVzW2AjJHtpZH1gXSAhPSAnJykgcmV0dXJuIHByb3BlcnRpZXNbYCMke2lkfWBdOy8vY2hlY2sgaWYgZWxlbWVudCBpZCBydWxlIGhhcyB0aGUgcHJvcGVydCBhbmQgcmV0dXJuIGl0J3MgdmFsdWVcclxuICAgICAgICAgICAgZm9yICh2YXIgaSBvZiBjbGFzc0xpc3QpIHsvL2NoZWNrIGlmIGFueSBjbGFzcyBydWxlIGhhcyB0aGUgcHJvcGVydCBhbmQgcmV0dXJuIGl0J3MgdmFsdWVcclxuICAgICAgICAgICAgICAgIGlmIChzZWxmLmlzc2V0KHByb3BlcnRpZXNbYC4ke2l9YF0pICYmIHByb3BlcnRpZXNbYC4ke2l9YF0gIT0gJycpIHJldHVybiBwcm9wZXJ0aWVzW2AuJHtpfWBdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vY2hlY2sgaWYgbm9kZSBydWxlIGhhcyB0aGUgcHJvcGVydCBhbmQgcmV0dXJuIGl0J3MgdmFsdWVcclxuICAgICAgICAgICAgaWYgKHNlbGYuaXNzZXQocHJvcGVydGllc1t0aGlzLm5vZGVOYW1lXSkgJiYgcHJvcGVydGllc1t0aGlzLm5vZGVOYW1lXSAhPSAnJykgcmV0dXJuIHByb3BlcnRpZXNbdGhpcy5ub2RlTmFtZV07XHJcbiAgICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEdldCBhbmQgU2V0IHRoZSBjc3MgdmFsdWVzXHJcbiAgICAgICAgRWxlbWVudC5wcm90b3R5cGUuY3NzID0gZnVuY3Rpb24gKHN0eWxlcyA9IHt9KSB7XHJcbiAgICAgICAgICAgIC8vIHNldCBjc3Mgc3R5bGUgb2YgZWxlbWVudCB1c2luZyBqc29uXHJcbiAgICAgICAgICAgIGlmIChzZWxmLmlzc2V0KHN0eWxlcykpIHtcclxuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKHN0eWxlcykubWFwKChrZXkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0eWxlW2tleV0gPSBzdHlsZXNba2V5XTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gc2VsZi5leHRyYWN0Q1NTKHRoaXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gUmVtb3ZlIGEgY3NzIHByb3BlcnR5XHJcbiAgICAgICAgRWxlbWVudC5wcm90b3R5cGUuY3NzUmVtb3ZlID0gZnVuY3Rpb24gKHN0eWxlcyA9IFtdKSB7XHJcbiAgICAgICAgICAgIC8vcmVtb3ZlIGEgZ3JvdXAgb2YgcHJvcGVydGllcyBmcm9tIGVsZW1lbnRzIHN0eWxlXHJcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHN0eWxlcykpIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgb2Ygc3R5bGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdHlsZS5yZW1vdmVQcm9wZXJ0eShpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3R5bGUucmVtb3ZlUHJvcGVydHkoc3R5bGVzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jc3MoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFRvZ2dsZSBhIGNoaWxkIGVsZW1lbnRcclxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS50b2dnbGVDaGlsZCA9IGZ1bmN0aW9uIChjaGlsZCkge1xyXG4gICAgICAgICAgICAvL0FkZCBjaGlsZCBpZiBlbGVtZW50IGRvZXMgbm90IGhhdmUgYSBjaGlsZCBlbHNlIHJlbW92ZSB0aGUgY2hpbGQgZm9ybSB0aGUgZWxlbWVudFxyXG4gICAgICAgICAgICB2YXIgbmFtZSwgX2NsYXNzZXMsIGlkLCBmb3VuZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKG5vZGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgbmFtZSA9IG5vZGUubm9kZU5hbWU7XHJcbiAgICAgICAgICAgICAgICBfY2xhc3NlcyA9IG5vZGUuY2xhc3NMaXN0O1xyXG4gICAgICAgICAgICAgICAgaWQgPSBub2RlLmlkO1xyXG4gICAgICAgICAgICAgICAgaWYgKG5hbWUgPT0gY2hpbGQubm9kZU5hbWUgJiYgaWQgPT0gY2hpbGQuaWQgJiYgX2NsYXNzZXMudG9TdHJpbmcoKSA9PSBjaGlsZC5jbGFzc0xpc3QudG9TdHJpbmcoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vZGUucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaWYgKCFmb3VuZCkgdGhpcy5hcHBlbmQoY2hpbGQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9yZW1vdmUgYWxsIGNsYXNzZXMgZXhjZXB0IHNvbWVcclxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS5jbGVhckNsYXNzZXMgPSBmdW5jdGlvbiAoZXhjZXB0ID0gJycpIHtcclxuICAgICAgICAgICAgZXhjZXB0ID0gZXhjZXB0LnNwbGl0KCcsJyk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogaW4gZXhjZXB0KSB7XHJcbiAgICAgICAgICAgICAgICBleGNlcHRbal0gPSBleGNlcHRbal0udHJpbSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgb2YgdGhpcy5jbGFzc0xpc3QpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxmLmlzc2V0KGV4Y2VwdCkgJiYgZXhjZXB0LmluY2x1ZGVzKGkpKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LnJlbW92ZShpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vcmVtb3ZlIGNsYXNzZXNcclxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS5yZW1vdmVDbGFzc2VzID0gZnVuY3Rpb24gKGNsYXNzZXMgPSAnJykge1xyXG4gICAgICAgICAgICBjbGFzc2VzID0gY2xhc3Nlcy5zcGxpdCgnLCcpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpIG9mIGNsYXNzZXMpIHtcclxuICAgICAgICAgICAgICAgIGkgPSBpLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgIGlmIChpICE9ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKGkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy9hZGQgY2xhc3Nlc1xyXG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLmFkZENsYXNzZXMgPSBmdW5jdGlvbiAoY2xhc3NlcyA9ICcnKSB7XHJcbiAgICAgICAgICAgIGNsYXNzZXMgPSBjbGFzc2VzLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgb2YgY2xhc3Nlcykge1xyXG4gICAgICAgICAgICAgICAgaSA9IGkudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGkgIT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5hZGQoaSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvL3RvZ2dsZSBjbGFzc2VzXHJcbiAgICAgICAgRWxlbWVudC5wcm90b3R5cGUudG9nZ2xlQ2xhc3NlcyA9IGZ1bmN0aW9uIChjbGFzc2VzID0gJycpIHtcclxuICAgICAgICAgICAgY2xhc3NlcyA9IGNsYXNzZXMuc3BsaXQoJywnKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSBvZiBjbGFzc2VzKSB7XHJcbiAgICAgICAgICAgICAgICBpID0gaS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSAhPSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LnRvZ2dsZShpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIFJlbW92ZSBhIGNsYXNzIGZyb20gZWxlbWVudCBjbGFzc2xpc3RcclxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS5yZW1vdmVDbGFzcyA9IGZ1bmN0aW9uIChfY2xhc3MgPSAnJykge1xyXG4gICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoX2NsYXNzKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBDaGVjayBpZiBlbGVtZW50IGNsYXNzbGlzdCBjb250YWlucyBhIGdyb3VwIG9mIGNsYXNzZXNcclxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS5oYXNDbGFzc2VzID0gZnVuY3Rpb24gKGNsYXNzTGlzdCA9IFtdKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IG1DbGFzcyBvZiBjbGFzc0xpc3QpIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5jbGFzc0xpc3QuY29udGFpbnMobUNsYXNzKSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gYWRkIGEgY2xhc3MgdG8gZWxlbWVudCBjbGFzc2xpc3RcclxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS5hZGRDbGFzcyA9IGZ1bmN0aW9uIChfY2xhc3MgPSAnJykge1xyXG4gICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5hZGQoX2NsYXNzKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyB0b2dnbGUgYSBjbGFzcyBpbiBlbGVtZW50IGNsYXNzbGlzdFxyXG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLnRvZ2dsZUNsYXNzID0gZnVuY3Rpb24gKF9jbGFzcyA9ICcnKSB7XHJcbiAgICAgICAgICAgIC8vICh0aGlzLmNsYXNzTGlzdC5jb250YWlucyhfY2xhc3MpKSA/IHRoaXMuY2xhc3NMaXN0LnJlbW92ZShfY2xhc3MpIDogdGhpcy5jbGFzc0xpc3QuYWRkKF9jbGFzcyk7XHJcbiAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LnRvZ2dsZShfY2xhc3MpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vR2V0IHRoZSBwb3NpdGlvbiBvZiBlbGVtZW50IGluIGRvbVxyXG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLnBvc2l0aW9uID0gZnVuY3Rpb24gKHBhcmFtcyA9IHt9KSB7XHJcbiAgICAgICAgICAgIGlmIChzZWxmLmlzc2V0KHBhcmFtcykpIHtcclxuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKHBhcmFtcykubWFwKGtleSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zW2tleV0gPSAobmV3IFN0cmluZyhwYXJhbXNba2V5XSkuc2xpY2UocGFyYW1zW2tleV0ubGVuZ3RoIC0gMikgPT0gJ3B4JykgPyBwYXJhbXNba2V5XSA6IGAke3BhcmFtc1trZXldfXB4YDtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jc3MocGFyYW1zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgcG9zaXRpb24gPSB0aGlzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHBvc2l0aW9uO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9jaGVjayBpZiBlbGVtZW50IGlzIHdpdGhpbiBjb250YWluZXJcclxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS5pblZpZXcgPSBmdW5jdGlvbiAocGFyZW50SWRlbnRpZmllciA9ICcnKSB7XHJcbiAgICAgICAgICAgIGxldCBwYXJlbnQgPSB0aGlzLmdldFBhcmVudHMocGFyZW50SWRlbnRpZmllcik7XHJcbiAgICAgICAgICAgIGxldCB0b3AgPSB0aGlzLnBvc2l0aW9uKCkudG9wO1xyXG4gICAgICAgICAgICBsZXQgZmxhZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFzZWxmLmlzbnVsbChwYXJlbnQpKSB7XHJcbiAgICAgICAgICAgICAgICBmbGFnID0gdG9wID49IDAgJiYgdG9wIDw9IHBhcmVudC5jbGllbnRIZWlnaHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZsYWc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL0NoZWNrIGlmIGEgY2xhc3MgZXhpc3RzIGluIGVsZW1lbnQncyBjbGFzc2xpc3RcclxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS5oYXNDbGFzcyA9IGZ1bmN0aW9uIChfY2xhc3MgPSAnJykge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jbGFzc0xpc3QuY29udGFpbnMoX2NsYXNzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFNldCBhIGxpc3Qgb2YgcHJvcGVydGllcyBmb3IgYW4gZWxlbWVudFxyXG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLnNldFByb3BlcnRpZXMgPSBmdW5jdGlvbiAocHJvcGVydGllcyA9IHt9KSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgaW4gcHJvcGVydGllcykge1xyXG4gICAgICAgICAgICAgICAgdGhpc1tpXSA9IHByb3BlcnRpZXNbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBTZXQgYSBsaXN0IG9mIGF0dHJpYnV0ZXMgZm9yIGFuIGVsZW1lbnRcclxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS5zZXRBdHRyaWJ1dGVzID0gZnVuY3Rpb24gKGF0dHJpYnV0ZXMgPSB7fSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpIGluIGF0dHJpYnV0ZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChpID09ICdzdHlsZScpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNzcyhhdHRyaWJ1dGVzW2ldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKGksIGF0dHJpYnV0ZXNbaV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gR2V0IHRoZSB2YWx1ZXMgb2YgYSBsaXN0IG9mIGF0dHJpYnV0ZXNcclxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS5nZXRBdHRyaWJ1dGVzID0gZnVuY3Rpb24gKG5hbWVzID0gW10pIHtcclxuICAgICAgICAgICAgaWYgKG5hbWVzLmxlbmd0aCA9PSAwKSBuYW1lcyA9IHRoaXMuZ2V0QXR0cmlidXRlTmFtZXMoKTtcclxuICAgICAgICAgICAgbGV0IGF0dHJpYnV0ZXMgPSB7fTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IG5hbWUgb2YgbmFtZXMpIHtcclxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXNbbmFtZV0gPSB0aGlzLmdldEF0dHJpYnV0ZShuYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYXR0cmlidXRlcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vQ3JlYXRlIGFuZCBhdHRhdGNoIGFuIGVsZW1lbnQgaW4gYW4gZWxlbWVudFxyXG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLm1ha2VFbGVtZW50ID0gZnVuY3Rpb24gKHBhcmFtcyA9IHsgZWxlbWVudDogJycsIGF0dHJpYnV0ZXM6IHt9IH0pIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRLZXlBc3luYygpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSBzZWxmLmNyZWF0ZUVsZW1lbnQocGFyYW1zLCB0aGlzKTtcclxuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBHZXQgYW4gZWxlbWVudHMgYW5jZXN0b3Igd2l0aCBhIHNwZWNpZmljIGF0dHJpYnV0ZVxyXG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLmdldFBhcmVudHMgPSBmdW5jdGlvbiAobmFtZSA9ICcnLCB2YWx1ZSA9ICcnKSB7XHJcbiAgICAgICAgICAgIHZhciBhdHRyaWJ1dGUgPSBuYW1lLnNsaWNlKDAsIDEpO1xyXG4gICAgICAgICAgICB2YXIgcGFyZW50ID0gdGhpcy5wYXJlbnROb2RlO1xyXG4gICAgICAgICAgICBpZiAoYXR0cmlidXRlID09ICcuJykge1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKHBhcmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLmlzc2V0KHBhcmVudC5jbGFzc0xpc3QpICYmIHBhcmVudC5jbGFzc0xpc3QuY29udGFpbnMobmFtZS5zbGljZSgxKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnROb2RlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGF0dHJpYnV0ZSA9PSAnIycpIHtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChwYXJlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5pc3NldChwYXJlbnQuaWQpICYmIHBhcmVudC5pZCA9PSBuYW1lLnNsaWNlKDEpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50Tm9kZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChwYXJlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5pc3NldChwYXJlbnQubm9kZU5hbWUpICYmIHBhcmVudC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09IG5hbWUudG9Mb3dlckNhc2UoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoc2VsZi5pc3NldChwYXJlbnQuaGFzQXR0cmlidXRlKSAmJiBwYXJlbnQuaGFzQXR0cmlidXRlKG5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLmlzc2V0KHZhbHVlKSAmJiBwYXJlbnQuZ2V0QXR0cmlidXRlKG5hbWUpID09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50Tm9kZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcGFyZW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gVG9nZ2xlIHRoZSBkaXNwbGF5IG9mIGFuIGVsZW1lbnRcclxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN0eWxlLmRpc3BsYXkgPT0gJ25vbmUnIHx8IHRoaXMuc3R5bGUudmlzaWJpbGl0eSA9PSAnaGlkZGVuJykgdGhpcy5zaG93KCk7XHJcbiAgICAgICAgICAgIGVsc2UgdGhpcy5oaWRlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL0hpZGUgYW4gZWxlbWVudCBpbiBkb21cclxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvLyBpZiAoc2VsZi5pc3NldCh0aGlzLnN0eWxlLmRpc3BsYXkpKSB0aGlzLnRlbXAuZGlzcGxheSA9IHRoaXMuc3R5bGUuZGlzcGxheTtcclxuICAgICAgICAgICAgLy8gaWYgKHNlbGYuaXNzZXQodGhpcy5zdHlsZS52aXNpYmlsaXR5KSkgdGhpcy50ZW1wLnZpc2liaWxpdHkgPSB0aGlzLnN0eWxlLnZpc2liaWxpdHk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgICAgIC8vIHRoaXMuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vU2hvdyBhbiBlbGVtZW50IGluIGRvbVxyXG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIC8vIGlmICh0aGlzLnN0eWxlLmRpc3BsYXkgPT0gJ25vbmUnKSB7XHJcbiAgICAgICAgICAgIC8vICAgICAvLyBpZiAoc2VsZi5pc3NldCh0aGlzLnRlbXAuZGlzcGxheSkpIHtcclxuICAgICAgICAgICAgLy8gICAgIC8vICAgICB0aGlzLmNzcyh7IGRpc3BsYXk6IHRoaXMudGVtcC5kaXNwbGF5IH0pO1xyXG4gICAgICAgICAgICAvLyAgICAgLy8gfVxyXG4gICAgICAgICAgICAvLyAgICAgLy8gZWxzZSB0aGlzLmNzc1JlbW92ZShbJ2Rpc3BsYXknXSk7XHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgdGhpcy5jc3NSZW1vdmUoWydkaXNwbGF5J10pO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vUmVtb3ZlIGFsbCB0aGUgY2hpbGRyZW4gb2YgYW4gZWxlbWVudCB3aXRoIGV4Y2VwdGlvbnMgb2Ygc29tZVxyXG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLnJlbW92ZUNoaWxkcmVuID0gZnVuY3Rpb24gKHBhcmFtcyA9IHsgZXhjZXB0OiBbXSB9KSB7XHJcbiAgICAgICAgICAgIGxldCBleGNlcHRpb25zID0gW107XHJcbiAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcclxuICAgICAgICAgICAgcGFyYW1zLmV4Y2VwdCA9IHBhcmFtcy5leGNlcHQgfHwgW107XHJcbiAgICAgICAgICAgIGxldCBleGNlcHQgPSBwYXJhbXMuZXhjZXB0O1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGV4Y2VwdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IGFsbCA9IHRoaXMuZmluZEFsbChleGNlcHRbaV0pO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBhbGwubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWV4Y2VwdGlvbnMuaW5jbHVkZXMoYWxsW2pdKSkgZXhjZXB0aW9ucy5wdXNoKGFsbFtqXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaChub2RlID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghZXhjZXB0aW9ucy5pbmNsdWRlcyhub2RlKSkgbm9kZS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vRGVsZXRlIGFuIGVsZW1lbnQgZnJvbSB0aGUgZG9tIGFuZCB2aXJ0dWFsIGRvbVxyXG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLmRlbGV0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHNlbGYuaXNzZXQodGhpcy5kYXRhc2V0LmRvbUtleSkpIHtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSBzZWxmLnZpcnR1YWxbdGhpcy5kYXRhc2V0LmRvbUtleV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vRGVsZXRlIGFuIGVsZW1lbnRzIGNoaWxkIGZyb20gdGhlIGRvbSBhbmQgdGhlIHZpcnR1YWwgZG9tXHJcbiAgICAgICAgRWxlbWVudC5wcm90b3R5cGUuZGVsZXRlQ2hpbGQgPSBmdW5jdGlvbiAoY2hpbGQpIHtcclxuICAgICAgICAgICAgY2hpbGQuZGVsZXRlKCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gVG9nZ2xlIGEgbGlzdCBvZiBjaGlsZHJlbiBvZiBhbiBlbGVtZW50XHJcbiAgICAgICAgRWxlbWVudC5wcm90b3R5cGUudG9nZ2xlQ2hpbGRyZW4gPSBmdW5jdGlvbiAocGFyYW1zID0geyBuYW1lOiAnJywgY2xhc3M6ICcnLCBpZDogJycgfSkge1xyXG4gICAgICAgICAgICBBcnJheS5mcm9tKHRoaXMuY2hpbGRyZW4pLmZvckVhY2gobm9kZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoISgoc2VsZi5pc3NldChwYXJhbXMubmFtZSkgJiYgcGFyYW1zLm5hbWUgPT0gbm9kZS5ub2RlTmFtZSkgfHwgc2VsZi5pc3NldChwYXJhbXMuY2xhc3MpICYmIHNlbGYuaGFzQXJyYXlFbGVtZW50KEFycmF5LmZyb20obm9kZS5jbGFzc0xpc3QpLCBwYXJhbXMuY2xhc3Muc3BsaXQoJyAnKSkgfHwgKHNlbGYuaXNzZXQocGFyYW1zLmlkKSAmJiBwYXJhbXMuaWQgPT0gbm9kZS5pZCkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9kZS50b2dnbGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vZGUudG9nZ2xlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQXR0YXRjaCBhbiBlbGVtZW50IHRvIGFub3RoZXIgZWxlbWVudCBbYXBwZW5kIG9yIHByZXBlbmRdXHJcbiAgICAgICAgRWxlbWVudC5wcm90b3R5cGUuYXR0YWNoRWxlbWVudCA9IGZ1bmN0aW9uIChlbGVtZW50LCBhdHRhY2htZW50ID0gJ2FwcGVuZCcpIHtcclxuICAgICAgICAgICAgdGhpc1thdHRhY2htZW50XShlbGVtZW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLnByZXNzZWQgPSBmdW5jdGlvbiAoY2FsbGJhY2sgPSAoKSA9PiB7IH0pIHtcclxuICAgICAgICAgICAgbGV0IHN0YXJ0VGltZSA9IDAsIGVuZFRpbWUgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLmFkZE11bHRpcGxlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duLCB0b3VjaHN0YXJ0JywgZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgc3RhcnRUaW1lID0gZXZlbnQudGltZVN0YW1wO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuYWRkTXVsdGlwbGVFdmVudExpc3RlbmVyKCdtb3VzZXVwLCB0b3VjaGVuZCcsIGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgIGVuZFRpbWUgPSBldmVudC50aW1lU3RhbXA7XHJcbiAgICAgICAgICAgICAgICBldmVudC5kdXJhdGlvbiA9IGVuZFRpbWUgLSBzdGFydFRpbWU7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXZlbnQpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaHRtbENvbGxlY3Rpb25MaWJyYXJ5KEhUTUxDb2xsZWN0aW9uID0gRW1wdHkpIHtcclxuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIEhUTUxDb2xsZWN0aW9uLnByb3RvdHlwZS5wb3BJbmRleCA9IGZ1bmN0aW9uIChwb3NpdGlvbiA9IDApIHtcclxuICAgICAgICAgICAgbGV0IGNvbGxlY3Rpb24gPSBzZWxmLmNyZWF0ZUVsZW1lbnQoeyBlbGVtZW50OiAnc2FtcGxlJyB9KS5jaGlsZHJlbjtcclxuXHJcbiAgICAgICAgICAgIGxldCBsaXN0ID0gQXJyYXkuZnJvbSh0aGlzKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGkgPT0gcG9zaXRpb24pIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbltpXSA9IHRoaXMuaXRlbShpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb247XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBIVE1MQ29sbGVjdGlvbi5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIChjYWxsYmFjayA9ICgpID0+IHsgfSkge1xyXG4gICAgICAgICAgICBsZXQgbGlzdCA9IEFycmF5LmZyb20odGhpcyk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2sobGlzdFtpXSwgaSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIEhUTUxDb2xsZWN0aW9uLnByb3RvdHlwZS5lYWNoID0gZnVuY3Rpb24gKGNhbGxiYWNrID0gKCkgPT4geyB9KSB7XHJcbiAgICAgICAgICAgIGxldCBsaXN0ID0gQXJyYXkuZnJvbSh0aGlzKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhsaXN0W2ldLCBpKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgSFRNTENvbGxlY3Rpb24ucHJvdG90eXBlWydpbmRleE9mJ10gPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICBsZXQgbGlzdCA9IEFycmF5LmZyb20odGhpcyk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgaW4gbGlzdCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGxpc3QgPT0gZWxlbWVudCkgcmV0dXJuIGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIEhUTUxDb2xsZWN0aW9uLnByb3RvdHlwZVsnaW5jbHVkZXMnXSA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmluZGV4T2YoZWxlbWVudCkgIT0gLTE7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgSFRNTENvbGxlY3Rpb24ucHJvdG90eXBlWydub2Rlc0JldHdlZW4nXSA9IGZ1bmN0aW9uIChlbGVtZW50QSwgZWxlbWVudEIpIHtcclxuICAgICAgICAgICAgbGV0IGluQmV0d2Vlbk5vZGVzID0gW107XHJcbiAgICAgICAgICAgIGxldCBsaXN0ID0gQXJyYXkuZnJvbSh0aGlzKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGFQYXJlbnQgb2YgbGlzdCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFQYXJlbnQgPT0gZWxlbWVudEEgfHwgYVBhcmVudCA9PSBlbGVtZW50QiB8fCBhUGFyZW50LmlzQW5jZXN0b3IoZWxlbWVudEEpIHx8IGFQYXJlbnQuaXNBbmNlc3RvcihlbGVtZW50QikpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbkJldHdlZW5Ob2Rlcy5wdXNoKGFQYXJlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gaW5CZXR3ZWVuTm9kZXM7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBub2RlTGlicmFyeShOb2RlID0gRW1wdHkpIHtcclxuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIE5vZGUucHJvdG90eXBlLnN0YXRlcyA9IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIG5vZGVMaXN0TGlicmFyeShOb2RlTGlzdCA9IEVtcHR5KSB7XHJcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBOb2RlTGlzdC5wcm90b3R5cGVbJ2VhY2gnXSA9IGZ1bmN0aW9uIChjYWxsYmFjayA9ICgpID0+IHsgfSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKHRoaXNbaV0sIGkpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIE5vZGVMaXN0LnByb3RvdHlwZVsnaW5kZXhPZiddID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSBpbiB0aGlzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpc1tpXSA9PSBlbGVtZW50KSByZXR1cm4gaTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgTm9kZUxpc3QucHJvdG90eXBlWydpbmNsdWRlcyddID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5kZXhPZihlbGVtZW50KSAhPSAtMTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBOb2RlTGlzdC5wcm90b3R5cGVbJ25vZGVzQmV0d2VlbiddID0gZnVuY3Rpb24gKGVsZW1lbnRBLCBlbGVtZW50Qikge1xyXG4gICAgICAgICAgICBsZXQgaW5CZXR3ZWVuTm9kZXMgPSBbXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgYVBhcmVudCBvZiB0aGlzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYVBhcmVudCA9PSBlbGVtZW50QSB8fCBhUGFyZW50ID09IGVsZW1lbnRCIHx8IGFQYXJlbnQuaXNBbmNlc3RvcihlbGVtZW50QSkgfHwgYVBhcmVudC5pc0FuY2VzdG9yKGVsZW1lbnRCKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluQmV0d2Vlbk5vZGVzLnB1c2goYVBhcmVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBpbkJldHdlZW5Ob2RlcztcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRlbXBsYXRlOyIsImNvbnN0IFRyZWVFdmVudCA9IHJlcXVpcmUoJy4vVHJlZUV2ZW50Jyk7XHJcblxyXG5jbGFzcyBUcmVlIHtcclxuICAgICNjaGlsZHJlbiA9IFtdO1xyXG4gICAgI3BhcmVudCA9IG51bGw7XHJcbiAgICAjcm9vdCA9IG51bGw7XHJcbiAgICAjYXR0cmlidXRlcyA9IHt9O1xyXG4gICAgI2V2ZW50c0xpc3QgPSBbXTtcclxuXHJcbiAgICBnZXQgaGVpZ2h0KCkge1xyXG4gICAgICAgIGxldCBoZWlnaHQgPSAxLCBicmFuY2hIZWlnaHRzID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgYnJhbmNoIG9mIHRoaXMuI2NoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgIGlmIChicmFuY2ggaW5zdGFuY2VvZiBUcmVlKSB7XHJcbiAgICAgICAgICAgICAgICBicmFuY2hIZWlnaHRzLnB1c2goYnJhbmNoLmhlaWdodCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGJyYW5jaEhlaWdodHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBoZWlnaHQgKz0gTWF0aC5tYXgoLi4uYnJhbmNoSGVpZ2h0cyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBoZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGxlbmd0aCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy4jY2hpbGRyZW4ubGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBwYXJlbnRUcmVlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLiNwYXJlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHJvb3RUcmVlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLiNyb290O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB2YWx1ZXMoKSB7XHJcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy4jY2hpbGRyZW4pO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBsZW5ndGgoc2l6ZSkge1xyXG4gICAgICAgIGxldCBuZXdDaGlsZHJlbiA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XHJcbiAgICAgICAgICAgIG5ld0NoaWxkcmVuLnB1c2godGhpcy4jY2hpbGRyZW5baV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLiNjaGlsZHJlbiA9IG5ld0NoaWxkcmVuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKGl0ZW1zLCBwYXJlbnQsIHJvb3QpIHtcclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShpdGVtcykpIHtcclxuICAgICAgICAgICAgdGhpcy5wdXNoKC4uLml0ZW1zKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChwYXJlbnQgIT0gdW5kZWZpbmVkICYmIHBhcmVudC5jb25zdHJ1Y3RvciA9PSBUcmVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuI3BhcmVudCA9IHBhcmVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChyb290ICE9IHVuZGVmaW5lZCAmJiByb290LmNvbnN0cnVjdG9yID09IFRyZWUpIHtcclxuICAgICAgICAgICAgdGhpcy4jcm9vdCA9IHJvb3Q7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUl0ZW1zKGl0ZW1zKSB7XHJcbiAgICAgICAgbGV0IHJvb3QgPSAodGhpcy4jcGFyZW50ICE9IG51bGwpID8gdGhpcy4jcm9vdCA6IHRoaXM7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShpdGVtc1tpXSkpIHtcclxuICAgICAgICAgICAgICAgIGl0ZW1zW2ldID0gbmV3IFRyZWUoaXRlbXNbaV0sIHRoaXMsIHJvb3QpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpdGVtcztcclxuICAgIH1cclxuXHJcbiAgICBjb3B5V2l0aGluKHRhcmdldCwgc3RhcnQgPSAwLCBlbmQgPSAxKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuI2NoaWxkcmVuLmNvcHlXaXRoaW4odGFyZ2V0LCBzdGFydCwgZW5kKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbmNhdCh0cmVlKSB7XHJcbiAgICAgICAgbGV0IG5ld1RyZWUgPSBuZXcgVHJlZSh0aGlzLnZhbHVlcywgdGhpcy4jcGFyZW50LCB0aGlzLiNyb290KTtcclxuICAgICAgICBpZiAodHJlZS5jb25zdHJ1Y3RvciA9PSBUcmVlKSB7XHJcbiAgICAgICAgICAgIG5ld1RyZWUucHVzaCguLi50cmVlLnZhbHVlcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKEFycmF5LmlzQXJyYXkodHJlZSkpIHtcclxuICAgICAgICAgICAgbmV3VHJlZS5wdXNoKC4uLnRyZWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgbmV3VHJlZS5wdXNoKHRyZWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3VHJlZTtcclxuICAgIH1cclxuXHJcbiAgICBjb21iaW5lKGZpcnN0LCBzZWNvbmQsIHBvc2l0aW9uKSB7Ly91c2VkIHRvIGdldCB3aGF0IGlzIGJldHdlZW4gdHdvIGl0ZW1zIGF0IGEgcGFydGljdWxhciBvY2N1cnJhbmNlIGluIGFuIEFycmF5IGFuZCB0aGUgaXRlbXMgY29tYmluZWRcclxuICAgICAgICBwb3NpdGlvbiA9IHBvc2l0aW9uIHx8IDA7Ly9pbml0aWFsaXplIHBvc2l0aW9uIGlmIG5vdCBzZXRcclxuICAgICAgICBsZXQgYXQxID0gcG9zaXRpb24sXHJcbiAgICAgICAgICAgIGF0MiA9IGZpcnN0ID09PSBzZWNvbmQgPyBwb3NpdGlvbiArIDEgOiBwb3NpdGlvbjsgLy9jaGVjayBpZiBpdCBpcyB0aGUgc2FtZSBhbmQgY2hhbmdlIHBvc2l0aW9uXHJcbiAgICAgICAgbGV0IHN0YXJ0ID0gdGhpcy5pbmRleEF0KGZpcnN0LCBhdDEpOy8vZ2V0IHRoZSBzdGFydFxyXG4gICAgICAgIGxldCBlbmQgPSB0aGlzLmluZGV4QXQoc2Vjb25kLCBhdDIpICsgMTsvL2dldCB0aGUgZW5kXHJcblxyXG4gICAgICAgIGlmIChzdGFydCA9PSAtMSB8fCBlbmQgPT0gMCkgey8vbnVsbCBpZiBvbmUgaXMgbm90IGZvdW5kXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2xpY2Uoc3RhcnQsIGVuZCk7XHJcbiAgICB9XHJcblxyXG4gICAgZW50cmllcygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZXMuZW50cmllcygpO1xyXG4gICAgfVxyXG5cclxuICAgIGVtcHR5KCkge1xyXG4gICAgICAgIHRoaXMuI2NoaWxkcmVuLmxlbmd0aCA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgZXZlcnkoY2FsbGJhY2sgPSAodmFsdWUsIGluZGV4KSA9PiB7IH0pIHtcclxuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgbGV0IHZhbHVlcyA9IHRoaXMudmFsdWVzO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpIGluIHZhbHVlcykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy4jY2hpbGRyZW5baV0gPSBjYWxsYmFjayh2YWx1ZXNbaV0sIGkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZpbmQoY2FsbGJhY2sgPSAodmFsdWUsIGluZGV4KSA9PiB7IH0pIHtcclxuICAgICAgICBsZXQgdmFsdWUsIGZvdW5kID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIGxldCB2YWx1ZXMgPSB0aGlzLnZhbHVlcztcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgaW4gdmFsdWVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2sodmFsdWVzW2ldLCBpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdGhpcy4jY2hpbGRyZW5baV07XHJcbiAgICAgICAgICAgICAgICAgICAgZm91bmRcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgZmluZExhc3QoY2FsbGJhY2sgPSAodmFsdWUsIGluZGV4KSA9PiB7IH0pIHtcclxuICAgICAgICBsZXQgdmFsdWU7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIGxldCB2YWx1ZXMgPSB0aGlzLnZhbHVlcy5yZXZlcnNlKCk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgaW4gdmFsdWVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2sodmFsdWVzW2ldLCBpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdGhpcy4jY2hpbGRyZW5baV07XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIGZpbmRJbmRleChjYWxsYmFjayA9ICh2YWx1ZSwgaW5kZXgpID0+IHsgfSkge1xyXG4gICAgICAgIGxldCB2YWx1ZTtcclxuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgbGV0IHZhbHVlcyA9IHRoaXMudmFsdWVzO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpIGluIHZhbHVlcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKHZhbHVlc1tpXSwgaSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIGZpbmRMYXN0SW5kZXgoY2FsbGJhY2sgPSAodmFsdWUsIGluZGV4KSA9PiB7IH0pIHtcclxuICAgICAgICBsZXQgdmFsdWU7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIGxldCB2YWx1ZXMgPSB0aGlzLnZhbHVlcy5yZXZlcnNlKCk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgaW4gdmFsdWVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2sodmFsdWVzW2ldLCBpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gaTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgZmluZEFsbChjYWxsYmFjayA9ICh2YWx1ZSwgaW5kZXgpID0+IHsgfSkge1xyXG4gICAgICAgIGxldCBuZXdUcmVlID0gbmV3IFRyZWUoKTtcclxuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgbGV0IHZhbHVlcyA9IHRoaXMudmFsdWVzO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpIGluIHZhbHVlcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKHZhbHVlc1tpXSwgaSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXdUcmVlLnB1c2godGhpcy4jY2hpbGRyZW5baV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXdUcmVlO1xyXG4gICAgfVxyXG5cclxuICAgIGZpbmRBbGxJbmRleChjYWxsYmFjayA9ICh2YWx1ZSwgaW5kZXgpID0+IHsgfSkge1xyXG4gICAgICAgIGxldCBuZXdBcnJheSA9IFtdO1xyXG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICBsZXQgdmFsdWVzID0gdGhpcy52YWx1ZXM7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgaW4gdmFsdWVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2sodmFsdWVzW2ldLCBpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld0FycmF5LnB1c2goaSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ld0FycmF5O1xyXG4gICAgfVxyXG5cclxuICAgIGZvckVhY2goY2FsbGJhY2sgPSAodmFsdWUsIGluZGV4KSA9PiB7IH0pIHtcclxuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgbGV0IHZhbHVlcyA9IHRoaXMudmFsdWVzO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpIGluIHZhbHVlcykge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2sodmFsdWVzW2ldLCBpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmaWxsKGl0ZW0pIHtcclxuICAgICAgICBmb3IgKGxldCBpIGluIHRoaXMuI2NoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLiNjaGlsZHJlbltpXS5jb25zdHJ1Y3RvciA9PSBUcmVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiNjaGlsZHJlbltpXS5maWxsKGl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy4jY2hpbGRyZW5baV0gPSBpdGVtO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZpbHRlcihjYWxsYmFjayA9ICh2YWx1ZSwgaW5kZXgpID0+IHsgfSkge1xyXG4gICAgICAgIGxldCBuZXdUcmVlID0gbmV3IFRyZWUoKTtcclxuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgbGV0IHZhbHVlcyA9IHRoaXMudmFsdWVzO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpIGluIHZhbHVlcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKHZhbHVlc1tpXSwgaSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXdUcmVlLnB1c2godGhpcy4jY2hpbGRyZW5baV0pXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ld1RyZWU7XHJcbiAgICB9XHJcblxyXG4gICAgZmxhdE1hcChjYWxsYmFjayA9ICh2YWx1ZSwgaW5kZXgpID0+IHsgfSkge1xyXG4gICAgICAgIGxldCBuZXdUcmVlID0gbmV3IFRyZWUoKTtcclxuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgbGV0IHZhbHVlcyA9IHRoaXMuZmxhdCgpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpIGluIHZhbHVlcykge1xyXG4gICAgICAgICAgICAgICAgbmV3VHJlZS5wdXNoKGNhbGxiYWNrKHZhbHVlc1tpXSwgaSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXdUcmVlO1xyXG4gICAgfVxyXG5cclxuICAgIGZsYXQoKSB7XHJcbiAgICAgICAgbGV0IGZsYXR0ZW5lZCA9IFtdO1xyXG4gICAgICAgIGxldCB2YWx1ZXMgPSB0aGlzLnZhbHVlcztcclxuICAgICAgICBmb3IgKGxldCB2IG9mIHZhbHVlcykge1xyXG4gICAgICAgICAgICBpZiAodi5jb25zdHJ1Y3RvciA9PSBUcmVlKSB7XHJcbiAgICAgICAgICAgICAgICBmbGF0dGVuZWQucHVzaCh2LmZsYXQoKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmbGF0dGVuZWQucHVzaCh2KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmxhdHRlbmVkLmZsYXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBmbGF0VHJlZSgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFRyZWUodGhpcy5mbGF0KCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEF0dHJpYnV0ZShuYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuI2F0dHJpYnV0ZXNbbmFtZV07XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0QXR0cmlidXRlcyhhdHRyaWJ1dGVzKSB7XHJcbiAgICAgICAgbGV0IGZvdW5kID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgbmFtZSBvZiBhdHRyaWJ1dGVzKSB7XHJcbiAgICAgICAgICAgIGZvdW5kLnB1c2godGhpcy4jYXR0cmlidXRlc1tuYW1lXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZm91bmQ7XHJcbiAgICB9XHJcblxyXG4gICAgaGFzQXR0cmlidXRlKG5hbWUpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy4jYXR0cmlidXRlcyAhPSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgaW5jbHVkZXModmFsdWUpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy4jY2hpbGRyZW4uaW5jbHVkZXModmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGluZGV4T2YodmFsdWUpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy4jY2hpbGRyZW4uaW5kZXhPZih2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgaXNCcmFuY2goKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuI3BhcmVudCAhPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGluQmV0d2VlbihmaXJzdCwgc2Vjb25kLCBwb3NpdGlvbikgey8vdXNlZCB0byBnZXQgd2hhdCBpcyBiZXR3ZWVuIHR3byBpdGVtcyBhdCBhIHBhcnRpY3VsYXIgb2NjdXJyYW5jZSBpbiBhbiBBcnJheVxyXG4gICAgICAgIHBvc2l0aW9uID0gcG9zaXRpb24gfHwgMDsvL2luaXRpYWxpemUgcG9zaXRpb24gaWYgbm90IHNldFxyXG4gICAgICAgIGxldCBhdDEgPSBwb3NpdGlvbixcclxuICAgICAgICAgICAgYXQyID0gZmlyc3QgPT09IHNlY29uZCA/IHBvc2l0aW9uICsgMSA6IHBvc2l0aW9uOyAvL2NoZWNrIGlmIGl0IGlzIHRoZSBzYW1lIGFuZCBjaGFuZ2UgcG9zaXRpb25cclxuXHJcbiAgICAgICAgbGV0IHN0YXJ0ID0gdGhpcy5pbmRleEF0KGZpcnN0LCBhdDEpICsgMTsvL2dldCB0aGUgc3RhcnRcclxuICAgICAgICBsZXQgZW5kID0gdGhpcy5pbmRleEF0KHNlY29uZCwgYXQyKTsvL2dldCB0aGUgZW5kXHJcblxyXG4gICAgICAgIGlmIChzdGFydCA9PSAwIHx8IGVuZCA9PSAtMSkgey8vbnVsbCBpZiBvbmUgaXMgbm90IGZvdW5kXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2xpY2Uoc3RhcnQsIGVuZCk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5kZXhBdChpdGVtLCBwb3NpdGlvbiA9IDApIHsvL3VzZWQgdG8gZ2V0IHRoZSBpbmRleCBvZiBhbiBpdGVtIGF0IGEgcGFydGljdWxhciBvY2N1cnJhbmNlXHJcbiAgICAgICAgcG9zaXRpb24gPSBwb3NpdGlvbiB8fCAwO1xyXG4gICAgICAgIGxldCBjb3VudCA9IC0xO1xyXG4gICAgICAgIGxldCB2YWx1ZXMgPSB0aGlzLnZhbHVlcztcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZhbHVlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodmFsdWVzW2ldID09IGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICBpZiAoY291bnQgPT0gcG9zaXRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgfVxyXG5cclxuICAgIGpvaW4oYXQpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50b0FycmF5KCkuam9pbihhdCk7XHJcbiAgICB9XHJcblxyXG4gICAgbGFzdEluZGV4T2YodmFsdWUpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy4jY2hpbGRyZW4ubGFzdEluZGV4T2YodmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIG1hcChjYWxsYmFjayA9ICh2YWx1ZSwgaW5kZXgpID0+IHsgfSkge1xyXG4gICAgICAgIGxldCBuZXdUcmVlID0gbmV3IFRyZWUoKTtcclxuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgbGV0IHZhbHVlcyA9IHRoaXMudmFsdWVzO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpIGluIHZhbHVlcykge1xyXG4gICAgICAgICAgICAgICAgbmV3VHJlZS5wdXNoKGNhbGxiYWNrKHZhbHVlc1tpXSwgaSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXdUcmVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1c2goLi4uaXRlbXMpIHtcclxuICAgICAgICB0aGlzLiNjaGlsZHJlbi5wdXNoKC4uLnRoaXMuY3JlYXRlSXRlbXMoaXRlbXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBwb3AoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuI2NoaWxkcmVuLnBvcCgpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICByZW1vdmUoKXtcclxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ3JlbW92ZScpO1xyXG4gICAgICAgIGlmKHRoaXMuaXNCcmFuY2goKSl7XHJcbiAgICAgICAgICAgIHRoaXMuI3BhcmVudC5yZW1vdmVDaGlsZCh0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdyZW1vdmVkJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZUNoaWxkKGNoaWxkKXtcclxuICAgICAgICBsZXQgaW5kZXggPSB0aGlzLmluZGV4T2YoY2hpbGQpO1xyXG4gICAgICAgIGxldCBuZXdDaGlsZHJlbiA9IFtdO1xyXG4gICAgICAgIGZvcihsZXQgaSBpbiB0aGlzLiNjaGlsZHJlbil7XHJcbiAgICAgICAgICAgIGlmKGkgIT0gaW5kZXgpe1xyXG4gICAgICAgICAgICAgICAgbmV3Q2hpbGRyZW4ucHVzaCh0aGlzLiNjaGlsZHJlbltpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy4jY2hpbGRyZW4gPSBuZXdDaGlsZHJlbjtcclxuICAgIH1cclxuXHJcbiAgICByZXZlcnNlKCkge1xyXG4gICAgICAgIHRoaXMuI2NoaWxkcmVuLnJldmVyc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICByZWR1Y2UoY2FsbGJhY2ssIHJlZHVjZXIgPSAwKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVzLnJlZHVjZShjYWxsYmFjaywgcmVkdWNlcik7XHJcbiAgICB9XHJcblxyXG4gICAgcmVkdWNlUmlnaHQoY2FsbGJhY2spIHtcclxuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZXMucmVkdWNlUmlnaHQoY2FsbGJhY2spO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZUF0dHJpYnV0ZShuYW1lKSB7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuI2F0dHJpYnV0ZXNbbmFtZV07XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlQXR0cmlidXRlcyhhdHRyaWJ1dGVzKSB7XHJcbiAgICAgICAgZm9yIChsZXQgbmFtZSBvZiBhdHRyaWJ1dGVzKSB7XHJcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLiNhdHRyaWJ1dGVzW25hbWVdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZWFyY2goY2FsbGJhY2sgPSAodmFsdWUsIGluZGV4KSA9PiB7IH0sIGRlcHRoID0gMCkge1xyXG4gICAgICAgIGxldCB2YWx1ZTtcclxuICAgICAgICBsZXQgcGF0aCA9IFtdOy8vaW5pdCBwYXRoXHJcbiAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIGxldCB2YWx1ZXMgPSB0aGlzLnZhbHVlcztcclxuICAgICAgICAgICAgZm9yIChsZXQgaSBpbiB2YWx1ZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjayh2YWx1ZXNbaV0sIGkpKSB7Ly9zZXQgcGF0aFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWVzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIHBhdGgucHVzaChpKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGRlcHRoICE9ICdudW1iZXInKSBkZXB0aCA9IDA7XHJcbiAgICAgICAgICAgIGlmIChwYXRoLmxlbmd0aCA9PSAwICYmIGRlcHRoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgZGVwdGgtLTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgaW4gdmFsdWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlc1tpXS5jb25zdHJ1Y3RvciA9PSBUcmVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzdWIgPSB2YWx1ZXNbaV0uc2VhcmNoKGNhbGxiYWNrLCBkZXB0aCwgcGF0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdWIucGF0aC5sZW5ndGggIT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3ViLnBhdGgudW5zaGlmdChpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGggPSBzdWIucGF0aDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gc3ViLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHsgcGF0aCwgdmFsdWUgfTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpIHtcclxuICAgICAgICBpZiAodHlwZW9mIG5hbWUgPT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgdGhpcy4jYXR0cmlidXRlc1tuYW1lXSA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZXRBdHRyaWJ1dGVzKGF0dHJpYnV0ZXMpIHtcclxuICAgICAgICBmb3IgKGxldCBuYW1lIGluIGF0dHJpYnV0ZXMpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUobmFtZSwgYXR0cmlidXRlc1tuYW1lXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNoaWZ0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLiNjaGlsZHJlbi5zaGlmdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHNsaWNlKHN0YXJ0LCBlbmQpIHtcclxuICAgICAgICBsZXQgdmFsdWVzID0gdGhpcy52YWx1ZXM7XHJcbiAgICAgICAgaWYgKGVuZCA9PSB1bmRlZmluZWQpIGVuZCA9IHZhbHVlcy5sZW5ndGg7XHJcblxyXG4gICAgICAgIHJldHVybiB2YWx1ZXMuc2xpY2Uoc3RhcnQsIGVuZCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2xpY2VBc1RyZWUoc3RhcnQsIGVuZCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVHJlZSh0aGlzLnNsaWNlKHN0YXJ0LCBlbmQpKTtcclxuICAgIH1cclxuXHJcbiAgICBzb21lKGNhbGxiYWNrID0gKHZhbHVlLCBpbmRleCkgPT4geyB9KSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIGxldCB2YWx1ZXMgPSB0aGlzLmZsYXQoKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSBpbiB2YWx1ZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjayh2YWx1ZXNbaV0sIGkpKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgc29ydChjYWxsYmFjaywgZGVwdGggPSAwKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICBjYWxsYmFjayA9IChhLCBiKSA9PiBhID4gYjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy4jY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IGkgKyAxOyBqIDwgdGhpcy4jY2hpbGRyZW4ubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCB0ZW1wO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKHRoaXMuI2NoaWxkcmVuW2ldLCB0aGlzLiNjaGlsZHJlbltqXSkgPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXAgPSB0aGlzLiNjaGlsZHJlbltpXTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLiNjaGlsZHJlbltpXSA9IHRoaXMuI2NoaWxkcmVuW2pdO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuI2NoaWxkcmVuW2pdID0gdGVtcDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBkZXB0aCAhPSAnbnVtYmVyJykgZGVwdGggPSAwO1xyXG4gICAgICAgIGlmIChkZXB0aCA+IDApIHtcclxuICAgICAgICAgICAgZGVwdGgtLTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSBpbiB0aGlzLiNjaGlsZHJlbikge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuI2NoaWxkcmVuW2ldLmNvbnN0cnVjdG9yID09IFRyZWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLiNjaGlsZHJlbltpXS5zb3J0KGNhbGxiYWNrLCBkZXB0aCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3BsaWNlKHN0YXJ0LCBkZWxldGVDb3VudCwgLi4uaXRlbXMpIHtcclxuICAgICAgICBpZiAoZGVsZXRlQ291bnQgPT0gdW5kZWZpbmVkKSBkZWxldGVDb3VudCA9IHRoaXMuI2NoaWxkcmVuLmxlbmd0aCAtIHN0YXJ0O1xyXG4gICAgICAgIGxldCBuZXdUcmVlID0gbmV3IFRyZWUodGhpcy4jY2hpbGRyZW4uc3BsaWNlKHN0YXJ0LCBkZWxldGVDb3VudCwgLi4uaXRlbXMpKTtcclxuICAgICAgICByZXR1cm4gbmV3VHJlZTtcclxuICAgIH1cclxuXHJcbiAgICB0b0FycmF5KCkge1xyXG4gICAgICAgIGxldCBhcnJheSA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGl0ZW0gb2YgdGhpcy4jY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgaWYgKGl0ZW0uY29uc3RydWN0b3IgPT0gVHJlZSkge1xyXG4gICAgICAgICAgICAgICAgYXJyYXkucHVzaChpdGVtLnRvQXJyYXkoKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhcnJheS5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYXJyYXk7XHJcbiAgICB9XHJcblxyXG4gICAgdG9TdHJpbmcoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZmxhdCgpLnRvU3RyaW5nKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdG9Mb2NhbGVTdHJpbmcoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZmxhdCgpLnRvTG9jYWxlU3RyaW5nKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJhY2UocGF0aCA9IFtdKSB7XHJcbiAgICAgICAgcGF0aCA9IEFycmF5LmZyb20ocGF0aCk7XHJcbiAgICAgICAgbGV0IGkgPSBwYXRoLnNoaWZ0KCk7XHJcbiAgICAgICAgbGV0IGZvdW5kID0gZmFsc2U7XHJcbiAgICAgICAgbGV0IHZhbHVlO1xyXG4gICAgICAgIGxldCBjaGlsZCA9IHRoaXMudmFsdWVzW2ldO1xyXG5cclxuICAgICAgICBpZiAoY2hpbGQgPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHZhbHVlID0gdGhpcztcclxuICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChwYXRoLmxlbmd0aCA9PSAwICYmIGNoaWxkICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB2YWx1ZSA9IGNoaWxkO1xyXG4gICAgICAgICAgICBmb3VuZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGNoaWxkICE9IHVuZGVmaW5lZCAmJiBjaGlsZC5jb25zdHJ1Y3RvciA9PSBUcmVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjaGlsZC50cmFjZShwYXRoKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICByZXR1cm4geyBmb3VuZCwgdmFsdWUgfTtcclxuICAgIH1cclxuXHJcbiAgICB1bnNoaWZ0KC4uLml0ZW1zKSB7XHJcbiAgICAgICAgdGhpcy4jY2hpbGRyZW4udW5zaGlmdCguLi50aGlzLmNyZWF0ZUl0ZW1zKGl0ZW1zKSk7XHJcbiAgICB9XHJcblxyXG4gICAgZGlzcGF0Y2hFdmVudChuYW1lLCBhdHRyaWJ1dGVzLCBidWJibGUpIHtcclxuICAgICAgICBsZXQgdHJlZUV2ZW50ID0gbmV3IFRyZWVFdmVudChuYW1lLCBhdHRyaWJ1dGVzLCBidWJibGUpO1xyXG4gICAgICAgIGlmICh0cmVlRXZlbnQuYnViYmxlID09IHRydWUgJiYgdGhpcy5pc0JyYW5jaCgpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuI3BhcmVudC5kaXNwYXRjaEV2ZW50KG5hbWUsIGF0dHJpYnV0ZXMsIGJ1YmJsZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGxldCBldmVudCBvZiB0aGlzLiNldmVudHNMaXN0KSB7XHJcbiAgICAgICAgICAgIGlmIChldmVudC5uYW1lID09IG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZXZlbnQuY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgICAgICBldmVudC5jYWxsYmFjayh0cmVlRXZlbnQuYXR0cmlidXRlcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYWRkRXZlbnRMaXN0ZW5lcihuYW1lLCBjYWxsYmFjaywgaWQpIHtcclxuICAgICAgICB0aGlzLiNldmVudHNMaXN0LnB1c2goeyBuYW1lLCBjYWxsYmFjaywgaWQgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlRXZlbnRMaXN0ZW5lcihuYW1lLCBjYWxsYmFjaywgaWQpIHtcclxuICAgICAgICBsZXQgbmV3TGlzdCA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGV2ZW50IG9mIHRoaXMuI2V2ZW50c0xpc3QpIHtcclxuICAgICAgICAgICAgaWYgKGV2ZW50Lm5hbWUgPT0gbmFtZSAmJiBldmVudC5pZCA9PSBpZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBuZXdMaXN0LnB1c2goZXZlbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLiNldmVudHNMaXN0ID0gbmV3TGlzdDtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgaXNUcmVlKHRyZWUpIHtcclxuICAgICAgICByZXR1cm4gdHJlZS5jb25zdHJ1Y3RvciA9PSBUcmVlO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tKGl0ZW1zKSB7XHJcbiAgICAgICAgbGV0IG5ld1RyZWUgPSBuZXcgVHJlZShpdGVtcyk7XHJcbiAgICAgICAgcmV0dXJuIG5ld1RyZWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVHJlZTsiLCJjbGFzcyBUcmVlRXZlbnQge1xyXG4gICAgbmFtZSA9ICcnO1xyXG4gICAgYXR0cmlidXRlcyA9IHt9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGF0dHJpYnV0ZXMsIGJ1YmJsZSkge1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGVzID0gYXR0cmlidXRlcztcclxuICAgICAgICB0aGlzLnNldEJ1YmJsZSA9IGJ1YmJsZTtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBzZXQgc2V0QnViYmxlKGJ1YmJsZSl7XHJcbiAgICAgICAgaWYodHlwZW9mIGJ1YmJsZSA9PT0gJ2Jvb2xlYW4nKXtcclxuICAgICAgICAgICAgdGhpcy5hdHRyaWJ1dGVzLmJ1YmJsZSA9IGJ1YmJsZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHNldEF0dHJpYnV0ZXMoYXR0cmlidXRlcykge1xyXG4gICAgICAgIGlmIChUcmVlRXZlbnQuZXZlbnRzW3RoaXMubmFtZV0gPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIFRyZWVFdmVudC5ldmVudHNbdGhpcy5uYW1lXSA9IGF0dHJpYnV0ZXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpIGluIFRyZWVFdmVudC5ldmVudHNbdGhpcy5uYW1lXSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hdHRyaWJ1dGVzW2ldID0gVHJlZUV2ZW50LmV2ZW50c1t0aGlzLm5hbWVdW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodHlwZW9mIGF0dHJpYnV0ZXMgPT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSBpbiBhdHRyaWJ1dGVzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmF0dHJpYnV0ZXNbaV0gPSBhdHRyaWJ1dGVzW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBldmVudHMgPSB7XHJcbiAgICAgICAgY2xpY2s6IHsgbmFtZTogJ0NsaWNrJywgZHVyYXRpb246ICcxc2VjJywgYnViYmxlOiB0cnVlIH0sXHJcbiAgICAgICAgaG92ZXI6IHsgbmFtZTogJ0hvdmVyJywgZHVyYXRpb246ICdJbmZpbml0eScsIGJ1YmJsZTogdHJ1ZSB9LFxyXG4gICAgICAgIHJlbW92ZTogeyBuYW1lOiAnUmVtb3ZlJywgYnViYmxlOiBmYWxzZSB9LFxyXG4gICAgICAgIGNyZWF0ZWQ6IHtuYW1lOiAnQ3JlYXRlZCcsIGJ1YmJsZTogZmFsc2UsIGR1cmF0aW9uOiAnMHNlYyd9XHJcbiAgICB9O1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRyZWVFdmVudDsiLCJjb25zdCBNYXRoc0xpYnJhcnkgPSByZXF1aXJlKCcuL01hdGhzTGlicmFyeScpO1xyXG5jb25zdCBPYmplY3RzTGlicmFyeSA9IHJlcXVpcmUoJy4vT2JqZWN0c0xpYnJhcnknKTtcclxuXHJcbmxldCBtYXRoTGlicmFyeSA9IG5ldyBNYXRoc0xpYnJhcnkoKTtcclxubGV0IG9iamVjdExpYnJhcnkgPSBuZXcgT2JqZWN0c0xpYnJhcnkoKTtcclxuXHJcbmZ1bmN0aW9uIEFuYWx5c2lzTGlicmFyeSgpIHtcclxuICAgIHRoaXMuZW50cm9weSA9IChkYXRhKSA9PiB7XHJcbiAgICAgICAgbGV0IGVudHJvcHkgPSAwOy8vaW5pdGlhbGl6ZSBlbnRyb3B5XHJcbiAgICAgICAgbGV0IHZhbHVlcyA9IE9iamVjdC52YWx1ZXMoZGF0YSk7Ly9nZXQgdGhlIHZhbHVlcyBvZiB0aGUgb2JqZWN0IHZhcmlhYmxlXHJcbiAgICAgICAgbGV0IHN1bSA9IG1hdGhMaWJyYXJ5LnN1bSh2YWx1ZXMpOy8vZ2V0IHRoZSBzdW0gb2YgdGhlIFZhbHVlc1xyXG4gICAgICAgIGZvciAobGV0IHZhbHVlIG9mIHZhbHVlcykge1xyXG4gICAgICAgICAgICBlbnRyb3B5IC09IHZhbHVlIC8gc3VtICogTWF0aC5sb2cyKHZhbHVlIC8gc3VtKTsgLy91c2UgdGhlIGZvcm11bGFyIG9uIGVhY2ggaXRlbVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZW50cm9weTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmluZm9ybWF0aW9uR2FpbiA9ICh0YXJnZXROb2RlLCB2YXJpYWJsZURhdGEpID0+IHtcclxuICAgICAgICBsZXQgYXJyYW5nZURhdGEgPSAobGlzdCkgPT4gey8vYXJyYW5nZSB0aGUgbGlzdCBpbnRvIGFuIG9iamVjdCBvZiBjb3VudHNcclxuICAgICAgICAgICAgbGV0IGRhdGEgPSB7fTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaXRlbSBvZiBsaXN0KSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhW2l0ZW1dID0gZGF0YVtpdGVtXSB8fCAwO1xyXG4gICAgICAgICAgICAgICAgZGF0YVtpdGVtXSsrO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBsZXQgdGFyZ2V0RGF0YSA9IGFycmFuZ2VEYXRhKHRhcmdldE5vZGUpO1xyXG5cclxuICAgICAgICBsZXQgdGFyZ2V0RW50cm9weSA9IHRoaXMuZW50cm9weSh0YXJnZXREYXRhKTsvL2dldCB0aGUgZW50cm9weSBvZiB0aGUgdGFyZ2V0IG5vZGVcclxuICAgICAgICBsZXQgc3VtT2ZJbmZvcm1hdGlvbiA9IDA7Ly9pbml0aWFsaXplIHN1bSBvZiBpbmZvcm1hdGlvbiBnYWluXHJcblxyXG4gICAgICAgIGxldCB2YXJpYWJsZVZhbHVlcyA9IE9iamVjdC52YWx1ZXModmFyaWFibGVEYXRhKTsvL2dldCB0aGUgdmFsdWVzIG9mIHRoaXMgdmFyaWFibGVcclxuICAgICAgICBsZXQgdmFyaWFibGVMZW5ndGggPSAwO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZhcmlhYmxlVmFsdWVzLmxlbmd0aDsgaSsrKSB7Ly9nZXQgdGhlIGxlbmd0aCBvZiB0aGUgdmFyaWFibGUgYnkgdGhlIGFkZGluZyB0aGUgdmFsdWVzXHJcbiAgICAgICAgICAgIHZhcmlhYmxlTGVuZ3RoICs9IHZhcmlhYmxlVmFsdWVzW2ldLmxlbmd0aDtcclxuICAgICAgICAgICAgdmFyaWFibGVWYWx1ZXNbaV0gPSBhcnJhbmdlRGF0YSh2YXJpYWJsZVZhbHVlc1tpXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGxldCB2IG9mIHZhcmlhYmxlVmFsdWVzKSB7Ly9nZXQgdGhlIGVudHJvcHkgb2YgZWFjaCBhbmQgbXVsdGlwbHkgYnkgdGhlIHByb2JhYmlsaXR5XHJcbiAgICAgICAgICAgIHN1bU9mSW5mb3JtYXRpb24gKz0gKG1hdGhMaWJyYXJ5LnN1bShPYmplY3QudmFsdWVzKHYpKSAvIHZhcmlhYmxlTGVuZ3RoKSAqIHRoaXMuZW50cm9weSh2KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBpbmZvcm1hdGlvbkdhaW4gPSB0YXJnZXRFbnRyb3B5IC0gc3VtT2ZJbmZvcm1hdGlvbjtcclxuICAgICAgICByZXR1cm4gaW5mb3JtYXRpb25HYWluO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaGlnaGVzdEluZm9ybWF0aW9uR2Fpbk5vZGUgPSAoZGF0YSwgbm9kZXMpID0+IHtcclxuICAgICAgICBsZXQgZ2FpbmVkSW5mb3JtYXRpb24gPSB7fTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSBpbiBub2Rlcykge1xyXG4gICAgICAgICAgICBnYWluZWRJbmZvcm1hdGlvbltpXSA9IHRoaXMuaW5mb3JtYXRpb25HYWluKGRhdGEsIG5vZGVzW2ldKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvYmplY3RMaWJyYXJ5Lm1heChnYWluZWRJbmZvcm1hdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5xdWFydGlsZVJhbmdlID0gKGRhdGEpID0+IHtcclxuXHJcbiAgICAgICAgbGV0IG1pZGRsZSA9IChfZHQpID0+IHsvL2dldCB0aGUgbWlkZGxlIHBvc2l0aW9uIG9mIGEgbGlzdCBvZiBudW1iZXJzXHJcbiAgICAgICAgICAgIGxldCBtaWRkbGU7XHJcbiAgICAgICAgICAgIGlmICgoX2R0Lmxlbmd0aCkgJSAyID09IDApIHsvL2lmIHRoZSBsaXN0IGNvdW50IGlzIG5vdCBldmVuXHJcbiAgICAgICAgICAgICAgICBtaWRkbGUgPSBbTWF0aC5jZWlsKF9kdC5sZW5ndGggLyAyKSAtIDEsIE1hdGguY2VpbChfZHQubGVuZ3RoIC8gMildOy8vZ2V0IHRoZSB0d28gaW4gdGhlIG1pZGRsZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbWlkZGxlID0gW01hdGguY2VpbChfZHQubGVuZ3RoIC8gMikgLSAxXTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG1pZGRsZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBnZXRNaWRkbGUgPSAoX2R0KSA9PiB7Ly8gZ2V0IHRoZSBpdGVtcyBpbiB0aGUgbWlkZGxlIG9mIGEgbGlzdFxyXG4gICAgICAgICAgICBsZXQgW21pZGRsZTEsIG1pZGRsZTJdID0gbWlkZGxlKF9kdCk7XHJcbiAgICAgICAgICAgIGxldCBtaWRkbGVzID0gW107XHJcbiAgICAgICAgICAgIG1pZGRsZXMucHVzaChfZHRbbWlkZGxlMV0pO1xyXG4gICAgICAgICAgICBpZiAobWlkZGxlMiAhPSB1bmRlZmluZWQpIG1pZGRsZXMucHVzaChfZHRbbWlkZGxlMl0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG1pZGRsZXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgaGFsZnMgPSAoX2R0KSA9PiB7Ly9kaXZpZGUgYSBsaXN0IGludG8gdHdvIGVxdWFsIGhhbGZzXHJcbiAgICAgICAgICAgIGxldCBbbWlkZGxlMSwgbWlkZGxlMl0gPSBtaWRkbGUoX2R0KTtcclxuICAgICAgICAgICAgaWYgKG1pZGRsZTIgPT0gdW5kZWZpbmVkKSBtaWRkbGUyID0gbWlkZGxlMTtcclxuICAgICAgICAgICAgbGV0IGhhbGYxID0gX2R0LnNsaWNlKDAsIG1pZGRsZTEpO1xyXG4gICAgICAgICAgICBsZXQgaGFsZjIgPSBfZHQuc2xpY2UobWlkZGxlMiArIDEpO1xyXG4gICAgICAgICAgICByZXR1cm4gW2hhbGYxLCBoYWxmMl07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgbGF5ZXJzID0gaGFsZnMoZGF0YSk7Ly9nZXQgdGhlIGhhbGZzIG9mIHRoZSBsaXN0XHJcbiAgICAgICAgbGV0IFtsYXllcjEsIGxheWVyMl0gPSBoYWxmcyhsYXllcnNbMF0pOy8vZGl2aWRlIGVhY2ggaGFsZiBpbnRvIGhhbGZzXHJcbiAgICAgICAgbGV0IFtsYXllcjMsIGxheWVyNF0gPSBoYWxmcyhsYXllcnNbMV0pO1xyXG5cclxuICAgICAgICBsZXQgbWlkZGxlMSA9IGdldE1pZGRsZShsYXllcnNbMF0pOy8vZ2V0IHRoZSBtaWRkbGUgb2YgdGhlIGZpcnN0IGxheWVyc1xyXG4gICAgICAgIGxldCBtaWRkbGUzID0gZ2V0TWlkZGxlKGxheWVyc1sxXSk7XHJcblxyXG4gICAgICAgIGxldCBxMSA9IG1hdGhMaWJyYXJ5Lm1lZGlhbihtaWRkbGUxKTsvL2dldCB0aGUgbWVkaWFuIG9mIHRoZSBmaXJzdCBhbmQgbGFzdCBsYXllcnNcclxuICAgICAgICBsZXQgcTMgPSBtYXRoTGlicmFyeS5tZWRpYW4obWlkZGxlMyk7XHJcblxyXG4gICAgICAgIHJldHVybiBxMyAtIHExOy8vZmluZCB0aGUgcmFuZ2VcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm5vcm1hbGl6ZURhdGEgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgIGRhdGEuc29ydCgoYSwgYikgPT4geyByZXR1cm4gYSAtIGIgfSk7XHJcbiAgICAgICAgdmFyIG1heCA9IGRhdGFbZGF0YS5sZW5ndGggLSAxXTtcclxuICAgICAgICB2YXIgbWluID0gZGF0YVswXTtcclxuICAgICAgICB2YXIgbm9ybWFsaXplZCA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBub3JtYWxpemVkLnB1c2goKGRhdGFbaV0gLSBtaW4pIC8gKG1heCAtIG1pbikpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbm9ybWFsaXplZDtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBBbmFseXNpc0xpYnJhcnk7IiwiY29uc3QgRnVuYyA9IHJlcXVpcmUoJy4vLi4vY2xhc3Nlcy9GdW5jJyk7XHJcbmxldCBmdW5jID0gbmV3IEZ1bmMoKTtcclxuXHJcbmZ1bmN0aW9uIEFwcExpYnJhcnkoKSB7XHJcbiAgICB0aGlzLm1ha2VXZWJhcHAgPSAoY2FsbGJhY2sgPSAoKSA9PiB7IH0pID0+IHtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgbGV0IGFuY2hvciA9IGV2ZW50LnRhcmdldDtcclxuICAgICAgICAgICAgbGV0IHBhcmVudEFuY2hvciA9IGV2ZW50LnRhcmdldC5nZXRQYXJlbnRzKCdhJyk7XHJcbiAgICAgICAgICAgIGxldCB1cmwgPSBhbmNob3IuZ2V0QXR0cmlidXRlKCdocmVmJyk7Ly9jaGVjayB3aGVuIGEgdXJsIGlzIGFib3V0IHRvIGJlIG9wZW5cclxuXHJcbiAgICAgICAgICAgIGlmIChhbmNob3Iubm9kZU5hbWUudG9Mb3dlckNhc2UoKSAhPSAnYScgJiYgIWZ1bmMuaXNudWxsKHBhcmVudEFuY2hvcikpIHtcclxuICAgICAgICAgICAgICAgIGFuY2hvciA9IHBhcmVudEFuY2hvcjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGZ1bmMuaXNudWxsKHVybCkgJiYgIWZ1bmMuaXNudWxsKHBhcmVudEFuY2hvcikpIHtcclxuICAgICAgICAgICAgICAgIGFuY2hvciA9IHBhcmVudEFuY2hvcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL2dldCB0aGUgYW5jaG9yIGVsZW1lbnRcclxuICAgICAgICAgICAgdXJsID0gYW5jaG9yLmdldEF0dHJpYnV0ZSgnaHJlZicpO1xyXG4gICAgICAgICAgICBsZXQgdGFyZ2V0ID0gYW5jaG9yLmdldEF0dHJpYnV0ZSgndGFyZ2V0Jyk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGFyZ2V0ID09ICdfYmxhbmsnKSB7Ly9jaGVjayBpZiBpdCBpcyBmb3IgbmV3IHBhZ2VcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5vcGVuKHRoaXMucHJlcGFyZVVybCh1cmwpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICghZnVuYy5pc251bGwodXJsKSkge1xyXG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTsvL2Jsb2NrIGFuZCBvcGVuIGluc2lkZSBhcyB3ZWJhcHBcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnByZXBhcmVVcmwodXJsKSAhPSBsb2NhdGlvbi5ocmVmKSB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoJ3BhZ2UnLCAndGl0bGUnLCB1cmwpO1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB3aW5kb3cub25wb3BzdGF0ZSA9IGNhbGxiYWNrO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucHJlcGFyZVVybCA9ICh1cmwgPSAnJykgPT4ge1xyXG4gICAgICAgIGlmICghdXJsLmluY2x1ZGVzKGxvY2F0aW9uLm9yaWdpbikpIHtcclxuICAgICAgICAgICAgbGV0IHNwbGl0VXJsID0gZnVuYy51cmxTcGxpdHRlcih1cmwpO1xyXG4gICAgICAgICAgICBpZiAoc3BsaXRVcmwubG9jYXRpb24gPT0gbG9jYXRpb24ub3JpZ2luKSB7XHJcbiAgICAgICAgICAgICAgICB1cmwgPSBsb2NhdGlvbi5vcmlnaW4gKyAnLycgKyB1cmw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoIXVybC5pbmNsdWRlcyhsb2NhdGlvbi5wcm90b2NvbCkpIHtcclxuICAgICAgICAgICAgdXJsID0gbG9jYXRpb24ucHJvdG9jb2wgKyAnLy8nICsgdXJsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHVybDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmFqYXggPSAocGFyYW1zID0geyBhc3luYzogdHJ1ZSwgZGF0YToge30sIHVybDogJycsIG1ldGhvZDogJycsIHNlY3VyZWQ6IGZhbHNlIH0pID0+IHtcclxuICAgICAgICBwYXJhbXMuYXN5bmMgPSBwYXJhbXMuYXN5bmMgfHwgdHJ1ZTtcclxuICAgICAgICBwYXJhbXMuZGF0YSA9IHBhcmFtcy5kYXRhIHx8IHt9O1xyXG4gICAgICAgIHBhcmFtcy51cmwgPSBwYXJhbXMudXJsIHx8ICcuLyc7XHJcbiAgICAgICAgcGFyYW1zLm1ldGhvZCA9IHBhcmFtcy5tZXRob2QgfHwgJ1BPU1QnO1xyXG4gICAgICAgIHBhcmFtcy5zZWN1cmVkID0gcGFyYW1zLnNlY3VyZWQgfHwgZmFsc2U7XHJcblxyXG4gICAgICAgIGlmIChwYXJhbXMuc2VjdXJlZCkge1xyXG4gICAgICAgICAgICBwYXJhbXMudXJsID0gJ2h0dHBzOi8vY29ycy1hbnl3aGVyZS5oZXJva3VhcHAuY29tLycgKyBwYXJhbXMudXJsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGRhdGEgPSBuZXcgRm9ybURhdGEoKTtcclxuICAgICAgICBpZiAocGFyYW1zLmRhdGEgaW5zdGFuY2VvZiBGb3JtRGF0YSkge1xyXG4gICAgICAgICAgICBkYXRhID0gcGFyYW1zLmRhdGE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpIGluIHBhcmFtcy5kYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhLmFwcGVuZChpLCBwYXJhbXMuZGF0YVtpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucmVhZHlTdGF0ZSA9PSA0ICYmIHRoaXMuc3RhdHVzID09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVxdWVzdC5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgaWYgKGZ1bmMuaXNzZXQocGFyYW1zLm9ucHJvZ3Jlc3MpKSB7XHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0LnVwbG9hZC5vbnByb2dyZXNzID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zLm9ucHJvZ3Jlc3MoKGV2ZW50LmxvYWRlZCAvIGV2ZW50LnRvdGFsKSAqIDUwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0Lm9ucHJvZ3Jlc3MgPSAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBwYXJhbXMub25wcm9ncmVzcygoZXZlbnQubG9hZGVkIC8gZXZlbnQudG90YWwpICogMTAwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5vbmVycm9yID0gKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5vcGVuKHBhcmFtcy5tZXRob2QsIHBhcmFtcy51cmwsIHBhcmFtcy5hc3luYyk7XHJcbiAgICAgICAgICAgIHJlcXVlc3Quc2VuZChkYXRhKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBBcHBMaWJyYXJ5OyIsImZ1bmN0aW9uIEFycmF5TGlicmFyeSgpIHtcclxuXHJcbiAgICB0aGlzLmNvbWJpbmUgPSAoaGF5c3RhY2ssIGZpcnN0LCBzZWNvbmQsIHBvcykgPT4gey8vdXNlZCB0byBnZXQgd2hhdCBpcyBiZXR3ZWVuIHR3byBpdGVtcyBhdCBhIHBhcnRpY3VsYXIgb2NjdXJyYW5jZSBpbiBhbiBBcnJheSBhbmQgdGhlIGl0ZW1zIGNvbWJpbmVkXHJcbiAgICAgICAgcG9zID0gcG9zIHx8IDA7Ly9pbml0aWFsaXplIHBvc2l0aW9uIGlmIG5vdCBzZXRcclxuICAgICAgICBsZXQgYXQxID0gcG9zLFxyXG4gICAgICAgICAgICBhdDIgPSBmaXJzdCA9PT0gc2Vjb25kID8gcG9zICsgMSA6IHBvczsgLy9jaGVjayBpZiBpdCBpcyB0aGUgc2FtZSBhbmQgY2hhbmdlIHBvc2l0aW9uXHJcbiAgICAgICAgbGV0IHN0YXJ0ID0gdGhpcy5pbmRleEF0KGhheXN0YWNrLCBmaXJzdCwgYXQxKTsvL2dldCB0aGUgc3RhcnRcclxuICAgICAgICBsZXQgZW5kID0gdGhpcy5pbmRleEF0KGhheXN0YWNrLCBzZWNvbmQsIGF0MikgKyAxOy8vZ2V0IHRoZSBlbmRcclxuXHJcbiAgICAgICAgaWYgKHN0YXJ0ID09IC0xIHx8IGVuZCA9PSAwKSB7Ly9udWxsIGlmIG9uZSBpcyBub3QgZm91bmRcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gaGF5c3RhY2suc2xpY2Uoc3RhcnQsIGVuZCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5pbkJldHdlZW4gPSAoaGF5c3RhY2ssIGZpcnN0LCBzZWNvbmQsIHBvcykgPT4gey8vdXNlZCB0byBnZXQgd2hhdCBpcyBiZXR3ZWVuIHR3byBpdGVtcyBhdCBhIHBhcnRpY3VsYXIgb2NjdXJyYW5jZSBpbiBhbiBBcnJheVxyXG4gICAgICAgIHBvcyA9IHBvcyB8fCAwOy8vaW5pdGlhbGl6ZSBwb3NpdGlvbiBpZiBub3Qgc2V0XHJcbiAgICAgICAgbGV0IGF0MSA9IHBvcyxcclxuICAgICAgICAgICAgYXQyID0gZmlyc3QgPT09IHNlY29uZCA/IHBvcyArIDEgOiBwb3M7IC8vY2hlY2sgaWYgaXQgaXMgdGhlIHNhbWUgYW5kIGNoYW5nZSBwb3NpdGlvblxyXG4gICAgICAgIGxldCBzdGFydCA9IHRoaXMuaW5kZXhBdChoYXlzdGFjaywgZmlyc3QsIGF0MSkgKyAxOy8vZ2V0IHRoZSBzdGFydFxyXG4gICAgICAgIGxldCBlbmQgPSB0aGlzLmluZGV4QXQoaGF5c3RhY2ssIHNlY29uZCwgYXQyKTsvL2dldCB0aGUgZW5kXHJcblxyXG4gICAgICAgIGlmIChzdGFydCA9PSAwIHx8IGVuZCA9PSAtMSkgey8vbnVsbCBpZiBvbmUgaXMgbm90IGZvdW5kXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGhheXN0YWNrLnNsaWNlKHN0YXJ0LCBlbmQpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY29udGFpbnMgPSAoaGF5c3RhY2ssIG5lZWRsZSkgPT4gey8vdXNlZCB0byBjaGVjayBpZiBhbiBBcnJheSBoYXMgYW4gaXRlbVxyXG4gICAgICAgIGxldCBmbGFnID0gZmFsc2U7Ly9zZXQgZmxhZyB0byBmYWxzZVxyXG4gICAgICAgIGZvciAobGV0IGkgaW4gaGF5c3RhY2spIHtcclxuICAgICAgICAgICAgaWYgKGhheXN0YWNrW2ldID09IG5lZWRsZSkgey8vaWYgZm91bmQgYnJlYWtvdXRcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmbGFnO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaW5kZXhBdCA9IChoYXlzdGFjaywgbmVlZGxlLCBwb3MpID0+IHsvL3VzZWQgdG8gZ2V0IHRoZSBpbmRleCBvZiBhbiBpdGVtIGF0IGEgcGFydGljdWxhciBvY2N1cnJhbmNlXHJcbiAgICAgICAgcG9zID0gcG9zIHx8IDA7XHJcbiAgICAgICAgbGV0IGNvdW50ID0gLTE7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBoYXlzdGFjay5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoaGF5c3RhY2tbaV0gPT0gbmVlZGxlKSB7XHJcbiAgICAgICAgICAgICAgICBjb3VudCsrO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjb3VudCA9PSBwb3MpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZmluZCA9IChoYXlzdGFjaywgY2FsbGJhY2spID0+IHsvL3VzZWQgYXMgYSBoaWdoZXIgb3JkZXIgZnVuY3Rpb24gdG8gZ2V0IGFuIGl0ZW1zIHRoYXQgbWF0Y2ggdGhlIGNvbmRpdGlvbnNcclxuICAgICAgICBmb3IgKGxldCBpIGluIGhheXN0YWNrKSB7XHJcbiAgICAgICAgICAgIGlmIChjYWxsYmFjayhoYXlzdGFja1tpXSkgPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGhheXN0YWNrW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZmluZEFsbCA9IChoYXlzdGFjaywgY2FsbGJhY2spID0+IHsvL3VzZWQgYXMgYSBoaWdoZXIgb3JkZXIgZnVuY3Rpb24gdG8gZ2V0IGFsbCB0aGUgaXRlbXMgdGhhdCBtYXRjaCB0aGUgY29uZGl0aW9uc1xyXG4gICAgICAgIGxldCB2YWx1ZXMgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpIGluIGhheXN0YWNrKSB7XHJcbiAgICAgICAgICAgIGlmIChjYWxsYmFjayhoYXlzdGFja1tpXSkgPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgdmFsdWVzLnB1c2goaGF5c3RhY2tbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdmFsdWVzO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZ2V0T2JqZWN0ID0gKGhheXN0YWNrLCBrZXksIHZhbHVlKSA9PiB7Ly91c2VkIHRvIGdldCBhbiBPYmplY3Qgd2l0aCBhbiBJdGVtIGluIGEgSnNvbkFycmF5XHJcbiAgICAgICAgbGV0IG9iamVjdDtcclxuICAgICAgICBmb3IgKGxldCBpIGluIGhheXN0YWNrKSB7XHJcbiAgICAgICAgICAgIGlmIChoYXlzdGFja1tpXVtrZXldID09IHZhbHVlKSBvYmplY3QgPSBoYXlzdGFja1tpXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG9iamVjdDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmdldEFsbE9iamVjdHMgPSAoaGF5c3RhY2ssIGtleSwgdmFsdWUpID0+IHsvL3VzZWQgdG8gZ2V0IGFsbCBvY2N1cnJhbmNlcyBvZiBhbiBPYmplY3Qgd2l0aCBhbiBJdGVtIGluIGEgSnNvbkFycmF5XHJcbiAgICAgICAgbGV0IG5ld0FycmF5ID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaSBpbiBoYXlzdGFjaykge1xyXG4gICAgICAgICAgICBpZiAoaGF5c3RhY2tbaV1ba2V5XSA9PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgbmV3QXJyYXkucHVzaChoYXlzdGFja1tpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ld0FycmF5O1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZ2V0QWxsID0gKGhheXN0YWNrLCBuZWVkbGUpID0+IHsvL3VzZWQgdG8gYWxsIG9jY3VycmFuY2VzIG9mIGFuIGl0ZW0gaW4gYW4gQXJyYXlcclxuICAgICAgICBsZXQgbmV3QXJyYXkgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpIGluIGhheXN0YWNrKSB7XHJcbiAgICAgICAgICAgIGlmIChoYXlzdGFja1tpXSA9PSBuZWVkbGUpIG5ld0FycmF5LnB1c2goaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXdBcnJheTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnJlbW92ZUFsbCA9IChoYXlzdGFjaywgbmVlZGxlKSA9PiB7Ly91c2VkIHRvIHJlbW92ZSBpbnN0YW5jZXMgb2YgYW4gaXRlbVxyXG4gICAgICAgIGxldCBuZXdBcnJheSA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgb2YgaGF5c3RhY2spIHtcclxuICAgICAgICAgICAgaWYgKGkgIT0gbmVlZGxlKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdBcnJheS5wdXNoKGkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXdBcnJheTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnB1dEF0ID0gKGhheXN0YWNrID0gW10sIHZhbHVlLCBrZXkgPSAwKSA9PiB7Ly91c2VkIHRvIHB1c2ggYW4gaXRlbSBpbnRvIGFuIGluZGV4IGluIEFycmF5XHJcbiAgICAgICAgbGV0IG5ld0FycmF5ID0gW107Ly9zdG9yYWdlXHJcbiAgICAgICAgZm9yIChsZXQgaSBpbiBoYXlzdGFjaykge1xyXG4gICAgICAgICAgICBpZiAoaSA9PSBrZXkpIHsvL21hdGNoZWRcclxuICAgICAgICAgICAgICAgIG5ld0FycmF5W2ldID0gdmFsdWU7Ly9wdXNoIGluIHRoZSB2YWx1ZVxyXG4gICAgICAgICAgICAgICAgbGV0IG5leHQgPSBNYXRoLmZsb29yKGtleSk7Ly9jaGVjayBpZiBpdCdzIGEgbnVtYmVyXHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGlzTmFOKG5leHQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV4dCA9IGtleSArIDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXh0Kys7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBuZXdBcnJheVtuZXh0XSA9IGhheXN0YWNrW2ldOy8vYWRkIHRoZSBwcmV2aW91cyB2YWx1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbmV3QXJyYXlbaV0gPSBoYXlzdGFja1tpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5ld0FycmF5O1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucHVzaEFycmF5ID0gKGhheXN0YWNrID0gW10sIG5lZWRsZSwgaW5zZXJ0KSA9PiB7Ly91c2VkIHRvIHB1c2ggaW4gYW4gaXRlbSBiZWZvcmUgYW5vdGhlciBleGlzdGluZyBpdGVtIGluIGFuIEFycmF5XHJcbiAgICAgICAgbGV0IHBvc2l0aW9uID0gdGhpcy5hcnJheUluZGV4KGhheXN0YWNrLCBuZWVkbGUpOy8vZ2V0IHRoZSBleGlzdGluZyBpdGVtIHBvc2l0aW9uXHJcbiAgICAgICAgbGV0IG5ld0FycmF5ID0gdGhpcy5wdXRBdChoYXlzdGFjaywgaW5zZXJ0LCBwb3NpdGlvbik7Ly9wdXNoIGluIG5ldyBpdGVtXHJcbiAgICAgICAgcmV0dXJuIG5ld0FycmF5O1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuYXJyYXlJbmRleCA9IChoYXlzdGFjayA9IFtdLCBuZWVkbGUgPSBbXSkgPT4gey8vdXNlZCB0byBnZXQgcG9zaXRpb24gb2YgYW4gaXRlbSBpbiBhbiBBcnJheVxyXG4gICAgICAgIGZvciAobGV0IGkgaW4gaGF5c3RhY2spIHtcclxuICAgICAgICAgICAgaWYgKEpTT04uc3RyaW5naWZ5KGhheXN0YWNrW2ldKSA9PSBKU09OLnN0cmluZ2lmeShuZWVkbGUpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gLTE7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5oYXNBcnJheSA9IChoYXlzdGFjayA9IFtdLCBuZWVkbGUgPSBbXSkgPT4gey8vdXNlZCB0byBjaGVjayBpZiBhbiBBcnJheSBpcyBhIHN1Yi1BcnJheSB0byBhbm90aGVyIEFycmF5XHJcbiAgICAgICAgaGF5c3RhY2sgPSBKU09OLnN0cmluZ2lmeShoYXlzdGFjayk7XHJcbiAgICAgICAgbmVlZGxlID0gSlNPTi5zdHJpbmdpZnkobmVlZGxlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGhheXN0YWNrLmluZGV4T2YobmVlZGxlKSAhPSAtMTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnRvT2JqZWN0ID0gKGFycmF5ID0gW10sIGtleSkgPT4gey8vdXNlZCB0byB0dXJuIGFuIEpzb25BcnJheSB0byBhbiBPYmplY3QgbGl0ZXJhbFxyXG4gICAgICAgIGxldCBvYmplY3QgPSB7fTsvL3N0b3JhZ2VcclxuICAgICAgICBmb3IgKGxldCBpIGluIGFycmF5KSB7XHJcbiAgICAgICAgICAgIG9iamVjdFthcnJheVtpXVtrZXldXSA9IGFycmF5W2ldOy8vc3RvcmUgdGhlIGludGVuZGVkIFtrZXksIHZhbHVlXVxyXG4gICAgICAgICAgICBkZWxldGUgb2JqZWN0W2FycmF5W2ldW2tleV1dW2tleV07Ly9yZW1vdmUgdGhlIGtleSBpbiB0aGUgdmFsdWVcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG9iamVjdDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnJlc2hhcGUgPSAocGFyYW1zKSA9PiB7Ly91c2VkIHRvIGNoYW5nZSB0aGUgc2hhcGUgb2YgYW4gQXJyYXlcclxuICAgICAgICAvLyBQZW5kaW5nXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5yYW5kb21QaWNrID0gKGFycmF5KSA9PiB7Ly91c2VkIHRvIHBpY2sgYSByYW5kb20gaXRlbSBmcm9tIGFuIEFycmF5XHJcbiAgICAgICAgcmV0dXJuIGFycmF5W01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGFycmF5Lmxlbmd0aCldO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnJlbW92ZUVtcHR5ID0gKGFycmF5ID0gW10pID0+IHsvL3VzZWQgdG8gdHJ1bmNhdGUgYW4gQXJyYXlcclxuICAgICAgICBsZXQgbmV3QXJyYXkgPSBbXTsvL3N0b3JhZ2VcclxuICAgICAgICBmb3IgKGxldCBpIGluIGFycmF5KSB7XHJcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGFycmF5W2ldKSAmJiBhcnJheVtpXS5sZW5ndGggPiAwKSB7Ly9pZiBhcnJheSBnbyBkZWVwXHJcbiAgICAgICAgICAgICAgICBuZXdBcnJheS5wdXNoKHRoaXMucmVtb3ZlRW1wdHkoYXJyYXlbaV0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChhcnJheVtpXSAhPSB1bmRlZmluZWQgJiYgYXJyYXlbaV0gIT0gbnVsbCAmJiBhcnJheVtpXSAhPSAwICYmIGFycmF5W2ldICE9ICcnKSB7Ly9za2lwIFt1bmRlZmluZWQsIG51bGwsIDAsICcnXVxyXG4gICAgICAgICAgICAgICAgbmV3QXJyYXkucHVzaChhcnJheVtpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ld0FycmF5O1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZWFjaCA9IChhcnJheSA9IFtdLCBjYWxsYmFjayA9ICgpID0+IHsgfSkgPT4gey8vdXNlZCBhcyBhIGhpZ2hlciBvcmRlciBBcnJheSBmdW5jdGlvblxyXG4gICAgICAgIGxldCBuZXdBcnJheSA9IFtdOy8vc3RvcmFnZVxyXG4gICAgICAgIGZvciAobGV0IGkgaW4gYXJyYXkpIHtcclxuICAgICAgICAgICAgbmV3QXJyYXkucHVzaChjYWxsYmFjayhhcnJheVtpXSwgaSkpOy8vbWFrZSBjaGFuZ2VzIHRvIHRoZSBpdGVtIGFuZCBzdG9yZSBpdC5cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ld0FycmF5O1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaGFzQXJyYXlFbGVtZW50ID0gKGhheXN0YWNrID0gW10sIG5lZWRsZSA9IFtdKSA9PiB7Ly91c2VkIHRvIGNoZWNrIGlmIHR3byBhcnJheXMgaGFzIGFuIGl0ZW0gaW4gY29tbW9uXHJcbiAgICAgICAgbGV0IGZsYWcgPSBmYWxzZTtcclxuICAgICAgICBmb3IgKGxldCBpIGluIG5lZWRsZSkge1xyXG4gICAgICAgICAgICBpZiAoaGF5c3RhY2suaW5kZXhPZihuZWVkbGVbaV0pICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmxhZztcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnRvU2V0ID0gKGhheXN0YWNrID0gW10pID0+IHsvL3VzZWQgdG8gdHVybiBhbiBBcnJheSBpbnRvIGEgc2V0KE1ha2Ugc3VyZSB0aGVyZSBhIG5vIGR1cGxpY2F0ZXMpXHJcbiAgICAgICAgbGV0IHNpbmdsZSA9IFtdOy8vc3RvcmFnZVxyXG4gICAgICAgIGZvciAobGV0IGkgaW4gaGF5c3RhY2spIHsvL3NraXAgaWYgYWxyZWFkeSBzdG9yZWRcclxuICAgICAgICAgICAgaWYgKHNpbmdsZS5pbmRleE9mKGhheXN0YWNrW2ldKSA9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgc2luZ2xlLnB1c2goaGF5c3RhY2tbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzaW5nbGU7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5wb3BJbmRleCA9IChhcnJheSA9IFtdLCBpbmRleCkgPT4gey8vdXNlZCB0byByZW1vdmUgYW4gaXRlbSBhdCBhIHBvc2l0aW9uIGluIGFuIEFycmF5XHJcbiAgICAgICAgbGV0IG5ld0FycmF5ID0gW107Ly9zdG9yYWdlIEFycmF5XHJcbiAgICAgICAgZm9yIChsZXQgaSBpbiBhcnJheSkge1xyXG4gICAgICAgICAgICBpZiAoaSAhPSBpbmRleCkgey8vc2tpcCB0aGUgcG9zaXRpb25cclxuICAgICAgICAgICAgICAgIG5ld0FycmF5LnB1c2goYXJyYXlbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXdBcnJheTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmRhdGFUeXBlID0gKGFycmF5ID0gW10pID0+IHsvL3VzZWQgdG8gZ2V0IHRoZSBkYXRhdHlwZXMgaW5zaWRlIGFuIEFycmF5XHJcbiAgICAgICAgbGV0IHR5cGUgPSB0eXBlb2YgYXJyYXlbMF07Ly9nZXQgdGhlIGluZGV4dCB0eXBlXHJcbiAgICAgICAgZm9yIChsZXQgaSBpbiBhcnJheSkge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGFycmF5W2ldICE9IHR5cGUpIHsvL2lmIHR3byB0eXBlcyBkbyBub3QgbWF0Y2ggcmV0dXJuIG1peGVkXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJ21peGVkJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHlwZTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQXJyYXlMaWJyYXJ5OyIsImNvbnN0IFRlbXBsYXRlID0gcmVxdWlyZSgnLi4vY2xhc3Nlcy9UZW1wbGF0ZScpO1xyXG5cclxuZnVuY3Rpb24gQ29sb3JQaWNrZXIod2luZG93ID0ge30pIHtcclxuICAgIGNvbnN0IGJhc2UgPSBuZXcgVGVtcGxhdGUod2luZG93KTtcclxuXHJcbiAgICB0aGlzLmNvbG9ySW5kaWNhdG9yUG9zaXRpb24gPSB7IHg6IDAsIHk6IDAgfTtcclxuICAgIHRoaXMub3BhY2l0eUluZGljYXRvclBvc2l0aW9uID0geyB4OiAwLCB5OiAwIH07XHJcbiAgICB0aGlzLmNvbnZlcnRUbyA9ICdSR0InO1xyXG5cclxuICAgIHRoaXMuaW5pdCA9IChwYXJhbXMgPSB7fSkgPT4ge1xyXG4gICAgICAgIHRoaXMucGlja2VyID0gYmFzZS5jcmVhdGVFbGVtZW50KHtcclxuICAgICAgICAgICAgZWxlbWVudDogJ2RpdicsIGF0dHJpYnV0ZXM6IHsgY2xhc3M6ICdjb2xvci1waWNrZXInIH0sIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudDogJ3NwYW4nLCBhdHRyaWJ1dGVzOiB7IGlkOiAnY29sb3ItcGlja2VyLXNldHRlcnMnIH0sIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQ6ICdzcGFuJywgYXR0cmlidXRlczogeyBpZDogJ2NvbG9yLXBpY2tlci1jb2xvcnMtd2luZG93JyB9LCBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgZWxlbWVudDogJ2NhbnZhcycsIGF0dHJpYnV0ZXM6IHsgaWQ6ICdjb2xvci1waWNrZXItY29sb3JzJyB9IH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBlbGVtZW50OiAnc3BhbicsIGF0dHJpYnV0ZXM6IHsgaWQ6ICdjb2xvci1waWNrZXItY29sb3ItaW5kaWNhdG9yJyB9IH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudDogJ3NwYW4nLCBhdHRyaWJ1dGVzOiB7IGlkOiAnY29sb3ItcGlja2VyLW9wYWNpdGllcy13aW5kb3cnIH0sIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBlbGVtZW50OiAnY2FudmFzJywgYXR0cmlidXRlczogeyBpZDogJ2NvbG9yLXBpY2tlci1vcGFjaXRpZXMnIH0gfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGVsZW1lbnQ6ICdzcGFuJywgYXR0cmlidXRlczogeyBpZDogJ2NvbG9yLXBpY2tlci1vcGFjaXR5LWluZGljYXRvcicgfSB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQ6ICdkaXYnLCBhdHRyaWJ1dGVzOiB7IGlkOiAnY29sb3ItcGlja2VyLXJlc3VsdCcgfSwgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgeyBlbGVtZW50OiAnc3BhbicsIGF0dHJpYnV0ZXM6IHsgaWQ6ICdwaWNrZWQtY29sb3InIH0gfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudDogJ3NwYW4nLCBhdHRyaWJ1dGVzOiB7IGlkOiAncGlja2VkLWNvbG9yLXdpbmRvdycgfSwgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGVsZW1lbnQ6ICdzZWxlY3QnLCBhdHRyaWJ1dGVzOiB7IGlkOiAncGlja2VkLWNvbG9yLXNldHRlcicgfSwgb3B0aW9uczogWydSR0InLCAnSEVYJywgJ0hTTCddIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBlbGVtZW50OiAnc3BhbicsIGF0dHJpYnV0ZXM6IHsgaWQ6ICdwaWNrZWQtY29sb3ItdmFsdWUnIH0gfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50OiAnc3R5bGUnLFxyXG4gICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHsgdHlwZTogJ3RleHQvY3NzJywgcmVsOiAnc3R5bGVzaGVldCcgfSxcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBgLmNvbG9yLXBpY2tlciB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IC41ZW07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGdyaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHotaW5kZXg6IDIwO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAjY29sb3ItcGlja2VyLXNldHRlcnMge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBncmlkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciBtaW4tY29udGVudDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2FwOiAxZW07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogaW5oZXJpdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGluaGVyaXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICNjb2xvci1waWNrZXItY29sb3JzLXdpbmRvdyB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCBncmF5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG92ZXJmbG93OiBoaWRkZW47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICNjb2xvci1waWNrZXItb3BhY2l0aWVzLXdpbmRvdyB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAyMHB4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBibG9jaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgZ3JheTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAjY29sb3ItcGlja2VyLWNvbG9yLWluZGljYXRvciB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogLjVlbTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDEwMCU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogMDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgI2NvbG9yLXBpY2tlci1vcGFjaXR5LWluZGljYXRvciB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogLjJlbTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogYmxhY2s7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogMDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgI2NvbG9yLXBpY2tlci1yZXN1bHQge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luOiAuMWVtIDBlbTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgI3BpY2tlZC1jb2xvciB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiA1MHB4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDMwcHg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAjcGlja2VkLWNvbG9yLXdpbmRvdyB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGdyaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdhcDogLjNlbTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiBtYXgtY29udGVudDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiByZXBlYXQoMiwgMWZyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAganVzdGlmeS1pdGVtczogbGVmdDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgI3BpY2tlZC1jb2xvci12YWx1ZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IGJsYWNrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1gXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5jb2xvcldpbmRvdyA9IHRoaXMucGlja2VyLmZpbmQoJyNjb2xvci1waWNrZXItY29sb3JzLXdpbmRvdycpO1xyXG4gICAgICAgIHRoaXMub3BhY2l0eVdpbmRvdyA9IHRoaXMucGlja2VyLmZpbmQoJyNjb2xvci1waWNrZXItb3BhY2l0aWVzLXdpbmRvdycpO1xyXG4gICAgICAgIHRoaXMuY29sb3JDYW52YXMgPSB0aGlzLnBpY2tlci5maW5kKCcjY29sb3ItcGlja2VyLWNvbG9ycycpO1xyXG4gICAgICAgIHRoaXMub3BhY2l0eUNhbnZhcyA9IHRoaXMucGlja2VyLmZpbmQoJyNjb2xvci1waWNrZXItb3BhY2l0aWVzJyk7XHJcbiAgICAgICAgdGhpcy5jb2xvck1hcmtlciA9IHRoaXMucGlja2VyLmZpbmQoJyNjb2xvci1waWNrZXItY29sb3ItaW5kaWNhdG9yJyk7XHJcbiAgICAgICAgdGhpcy5vcGFjaXR5TWFya2VyID0gdGhpcy5waWNrZXIuZmluZCgnI2NvbG9yLXBpY2tlci1vcGFjaXR5LWluZGljYXRvcicpO1xyXG4gICAgICAgIHRoaXMud2lkdGggPSBwYXJhbXMud2lkdGggPyBwYXJhbXMud2lkdGggOiAzMDA7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBwYXJhbXMuaGVpZ2h0ID8gcGFyYW1zLmhlaWdodCA6IDMwMDtcclxuICAgICAgICB0aGlzLnBpY2tlZENvbG9yID0gcGFyYW1zLmNvbG9yID8gcGFyYW1zLmNvbG9yIDogJ3JnYigwLCAwLCAwKSc7XHJcbiAgICAgICAgdGhpcy5jb2xvcldpbmRvdy5jc3MoeyBoZWlnaHQ6IHRoaXMuaGVpZ2h0ICsgJ3B4JyB9KTtcclxuICAgICAgICB0aGlzLmNvbG9yQ2FudmFzLndpZHRoID0gdGhpcy53aWR0aDtcclxuICAgICAgICB0aGlzLmNvbG9yQ2FudmFzLmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xyXG4gICAgICAgIHRoaXMub3BhY2l0eVdpbmRvdy5jc3MoeyBoZWlnaHQ6IHRoaXMuaGVpZ2h0ICsgJ3B4JyB9KTtcclxuICAgICAgICB0aGlzLm9wYWNpdHlDYW52YXMuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5vcGFjaXR5Q2FudmFzLndpZHRoID0gMjA7XHJcblxyXG4gICAgICAgIC8vdGhlIGNvbnRleHRcclxuICAgICAgICB0aGlzLmNvbG9yQ29udGV4dCA9IHRoaXMuY29sb3JDYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgICB0aGlzLm9wYWNpdHlDb250ZXh0ID0gdGhpcy5vcGFjaXR5Q2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcblxyXG4gICAgICAgIHRoaXMucGlja2VyLmZpbmQoJyNwaWNrZWQtY29sb3ItdmFsdWUnKS5pbm5lclRleHQgPSB0aGlzLnBpY2tlZENvbG9yO1xyXG4gICAgICAgIHRoaXMucGlja2VyLmZpbmQoJyNwaWNrZWQtY29sb3Itc2V0dGVyJykub25DaGFuZ2VkKHZhbHVlID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jb252ZXJ0VG8gPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5yZXBseSgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmxpc3RlbigpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5waWNrZXI7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jYWxpYnJhdGVDb2xvciA9ICgpID0+IHtcclxuICAgICAgICBsZXQgY29sb3JHcmFkaWVudCA9IHRoaXMuY29sb3JDb250ZXh0LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIHRoaXMud2lkdGgsIDApO1xyXG5cclxuICAgICAgICAvL2NvbG9yIHN0b3BzXHJcbiAgICAgICAgY29sb3JHcmFkaWVudC5hZGRDb2xvclN0b3AoMCwgXCJyZ2IoMjU1LCAwLCAwKVwiKTtcclxuICAgICAgICBjb2xvckdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjE1LCBcInJnYigyNTUsIDAsIDI1NSlcIik7XHJcbiAgICAgICAgY29sb3JHcmFkaWVudC5hZGRDb2xvclN0b3AoMC4zMywgXCJyZ2IoMCwgMCwgMjU1KVwiKTtcclxuICAgICAgICBjb2xvckdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjQ5LCBcInJnYigwLCAyNTUsIDI1NSlcIik7XHJcbiAgICAgICAgY29sb3JHcmFkaWVudC5hZGRDb2xvclN0b3AoMC42NywgXCJyZ2IoMCwgMjU1LCAwKVwiKTtcclxuICAgICAgICBjb2xvckdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjg3LCBcInJnYigyNTUsIDI1NSwgMClcIik7XHJcbiAgICAgICAgY29sb3JHcmFkaWVudC5hZGRDb2xvclN0b3AoMSwgXCJyZ2IoMjU1LCAwLCAwKVwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb2xvckNvbnRleHQuZmlsbFN0eWxlID0gY29sb3JHcmFkaWVudDtcclxuICAgICAgICB0aGlzLmNvbG9yQ29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcblxyXG4gICAgICAgIC8vYWRkIGJsYWNrIGFuZCB3aGl0ZSBzdG9wc1xyXG4gICAgICAgIGNvbG9yR3JhZGllbnQgPSB0aGlzLmNvbG9yQ29udGV4dC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCAwLCB0aGlzLmhlaWdodCk7XHJcbiAgICAgICAgY29sb3JHcmFkaWVudC5hZGRDb2xvclN0b3AoMCwgXCJyZ2JhKDI1NSwgMjU1LCAyNTUsIDEpXCIpO1xyXG4gICAgICAgIGNvbG9yR3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuNSwgXCJyZ2JhKDI1NSwgMjU1LCAyNTUsIDApXCIpO1xyXG4gICAgICAgIGNvbG9yR3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuNSwgXCJyZ2JhKDAsIDAsIDAsIDApXCIpO1xyXG4gICAgICAgIGNvbG9yR3JhZGllbnQuYWRkQ29sb3JTdG9wKDEsIFwicmdiYSgwLCAwLCAwLCAxKVwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb2xvckNvbnRleHQuZmlsbFN0eWxlID0gY29sb3JHcmFkaWVudDtcclxuICAgICAgICB0aGlzLmNvbG9yQ29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jYWxpYnJhdGVPcGFjaXR5ID0gKCkgPT4ge1xyXG4gICAgICAgIGxldCByZ2JhO1xyXG5cclxuICAgICAgICB0aGlzLm9wYWNpdHlDb250ZXh0LmNsZWFyUmVjdCgwLCAwLCB0aGlzLm9wYWNpdHlDYW52YXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcclxuICAgICAgICBsZXQgb3BhY2l0eUdyYWRpZW50ID0gdGhpcy5vcGFjaXR5Q29udGV4dC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCAwLCB0aGlzLm9wYWNpdHlDYW52YXMuaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDEwMDsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgICAgICAgcmdiYSA9IHRoaXMuYWRkT3BhY2l0eSh0aGlzLnBpY2tlZENvbG9yLCBpIC8gMTAwKTtcclxuICAgICAgICAgICAgb3BhY2l0eUdyYWRpZW50LmFkZENvbG9yU3RvcChpIC8gMTAwLCByZ2JhKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMub3BhY2l0eUNvbnRleHQuZmlsbFN0eWxlID0gb3BhY2l0eUdyYWRpZW50O1xyXG4gICAgICAgIHRoaXMub3BhY2l0eUNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRoaXMub3BhY2l0eUNhbnZhcy53aWR0aCwgdGhpcy5vcGFjaXR5Q2FudmFzLmhlaWdodCk7XHJcbiAgICAgICAgdGhpcy5vcGFjaXR5Q29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLm9wYWNpdHlDYW52YXMud2lkdGgsIHRoaXMub3BhY2l0eUNhbnZhcy5oZWlnaHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubGlzdGVuID0gKCkgPT4ge1xyXG4gICAgICAgIGxldCBpc0NvbG9yTW91c2VEb3duID0gZmFsc2U7XHJcbiAgICAgICAgbGV0IGlzT3BhY2l0eU1vdXNlRG93biA9IGZhbHNlO1xyXG5cclxuICAgICAgICB0aGlzLnBpY2tlci5ub3RCdWJibGVkRXZlbnQoJ2NsaWNrJywgZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5hZGRlZCAmJiAhaXNDb2xvck1vdXNlRG93biAmJiAhaXNPcGFjaXR5TW91c2VEb3duKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3Bvc2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBjb2xvck1vdXNlRG93biA9IChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgY3VycmVudFggPSBldmVudC5jbGllbnRYIC0gdGhpcy5jb2xvckNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0O1xyXG4gICAgICAgICAgICBsZXQgY3VycmVudFkgPSBldmVudC5jbGllbnRZIC0gdGhpcy5jb2xvckNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3A7XHJcblxyXG4gICAgICAgICAgICAvL2lzIG1vdXNlIGluIGNvbG9yIHBpY2tlclxyXG4gICAgICAgICAgICBpc0NvbG9yTW91c2VEb3duID0gKGN1cnJlbnRYID4gMCAmJiBjdXJyZW50WCA8IHRoaXMuY29sb3JDYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggJiYgY3VycmVudFkgPiAwICYmIGN1cnJlbnRZIDwgdGhpcy5jb2xvckNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbG9yTW91c2VNb3ZlID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpc0NvbG9yTW91c2VEb3duKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbG9ySW5kaWNhdG9yUG9zaXRpb24ueCA9IGV2ZW50LmNsaWVudFggLSB0aGlzLmNvbG9yQ2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbG9ySW5kaWNhdG9yUG9zaXRpb24ueSA9IGV2ZW50LmNsaWVudFkgLSB0aGlzLmNvbG9yQ2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcDtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29sb3JNYXJrZXIuY3NzKHsgdG9wOiB0aGlzLmNvbG9ySW5kaWNhdG9yUG9zaXRpb24ueSArICdweCcsIGxlZnQ6IHRoaXMuY29sb3JJbmRpY2F0b3JQb3NpdGlvbi54ICsgJ3B4JyB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgcGlja2VkID0gdGhpcy5nZXRQaWNrZWRDb2xvcigpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5waWNrZWRDb2xvciA9IGByZ2IoJHtwaWNrZWQucn0sICR7cGlja2VkLmd9LCAke3BpY2tlZC5ifSlgO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXBseSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3QgY29sb3JDbGlja2VkID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuY29sb3JJbmRpY2F0b3JQb3NpdGlvbi54ID0gZXZlbnQuY2xpZW50WCAtIHRoaXMuY29sb3JDYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdDtcclxuICAgICAgICAgICAgdGhpcy5jb2xvckluZGljYXRvclBvc2l0aW9uLnkgPSBldmVudC5jbGllbnRZIC0gdGhpcy5jb2xvckNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3A7XHJcbiAgICAgICAgICAgIHRoaXMuY29sb3JNYXJrZXIuY3NzKHsgdG9wOiB0aGlzLmNvbG9ySW5kaWNhdG9yUG9zaXRpb24ueSArICdweCcsIGxlZnQ6IHRoaXMuY29sb3JJbmRpY2F0b3JQb3NpdGlvbi54ICsgJ3B4JyB9KTtcclxuXHJcbiAgICAgICAgICAgIGxldCBwaWNrZWQgPSB0aGlzLmdldFBpY2tlZENvbG9yKCk7XHJcbiAgICAgICAgICAgIHRoaXMucGlja2VkQ29sb3IgPSBgcmdiKCR7cGlja2VkLnJ9LCAke3BpY2tlZC5nfSwgJHtwaWNrZWQuYn0pYDtcclxuICAgICAgICAgICAgdGhpcy5yZXBseSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgY29sb3JNb3VzZVVwID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGlzQ29sb3JNb3VzZURvd24gPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5jYWxpYnJhdGVPcGFjaXR5KCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy9SZWdpc3RlclxyXG4gICAgICAgIHRoaXMuY29sb3JDYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBjb2xvck1vdXNlRG93bik7XHJcbiAgICAgICAgdGhpcy5jb2xvckNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIGNvbG9yTW91c2VNb3ZlKTtcclxuICAgICAgICB0aGlzLmNvbG9yQ2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjb2xvckNsaWNrZWQpO1xyXG4gICAgICAgIHRoaXMuY29sb3JDYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgY29sb3JNb3VzZVVwKTtcclxuXHJcbiAgICAgICAgY29uc3Qgb3BhY2l0eU1vdXNlRG93biA9IChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgY3VycmVudFggPSBldmVudC5jbGllbnRYIC0gdGhpcy5vcGFjaXR5Q2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQ7XHJcbiAgICAgICAgICAgIGxldCBjdXJyZW50WSA9IGV2ZW50LmNsaWVudFkgLSB0aGlzLm9wYWNpdHlDYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wO1xyXG5cclxuICAgICAgICAgICAgLy9pcyBtb3VzZSBpbiBjb2xvciBwaWNrZXJcclxuICAgICAgICAgICAgaXNPcGFjaXR5TW91c2VEb3duID0gKGN1cnJlbnRYID4gMCAmJiBjdXJyZW50WCA8IHRoaXMub3BhY2l0eUNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCAmJiBjdXJyZW50WSA+IDAgJiYgY3VycmVudFkgPCB0aGlzLm9wYWNpdHlDYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBvcGFjaXR5TW91c2VNb3ZlID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpc09wYWNpdHlNb3VzZURvd24pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub3BhY2l0eUluZGljYXRvclBvc2l0aW9uLnggPSBldmVudC5jbGllbnRYIC0gdGhpcy5vcGFjaXR5Q2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9wYWNpdHlJbmRpY2F0b3JQb3NpdGlvbi55ID0gZXZlbnQuY2xpZW50WSAtIHRoaXMub3BhY2l0eUNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3A7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9wYWNpdHlNYXJrZXIuY3NzKHsgdG9wOiB0aGlzLm9wYWNpdHlJbmRpY2F0b3JQb3NpdGlvbi55ICsgJ3B4JyB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgcGlja2VkID0gdGhpcy5nZXRQaWNrZWRPcGFjaXR5KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBpY2tlZENvbG9yID0gYHJnYigke3BpY2tlZC5yfSwgJHtwaWNrZWQuZ30sICR7cGlja2VkLmJ9LCAke3BpY2tlZC5hfSlgO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXBseSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3Qgb3BhY2l0eUNsaWNrZWQgPSAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5vcGFjaXR5SW5kaWNhdG9yUG9zaXRpb24ueCA9IGV2ZW50LmNsaWVudFggLSB0aGlzLm9wYWNpdHlDYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdDtcclxuICAgICAgICAgICAgdGhpcy5vcGFjaXR5SW5kaWNhdG9yUG9zaXRpb24ueSA9IGV2ZW50LmNsaWVudFkgLSB0aGlzLm9wYWNpdHlDYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wO1xyXG4gICAgICAgICAgICB0aGlzLm9wYWNpdHlNYXJrZXIuY3NzKHsgdG9wOiB0aGlzLm9wYWNpdHlJbmRpY2F0b3JQb3NpdGlvbi55ICsgJ3B4JyB9KTtcclxuXHJcbiAgICAgICAgICAgIGxldCBwaWNrZWQgPSB0aGlzLmdldFBpY2tlZE9wYWNpdHkoKTtcclxuICAgICAgICAgICAgdGhpcy5waWNrZWRDb2xvciA9IGByZ2IoJHtwaWNrZWQucn0sICR7cGlja2VkLmd9LCAke3BpY2tlZC5ifSwgJHtwaWNrZWQuYX0pYDtcclxuICAgICAgICAgICAgdGhpcy5yZXBseSgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IG9wYWNpdHlNb3VzZVVwID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGlzT3BhY2l0eU1vdXNlRG93biA9IGZhbHNlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMub3BhY2l0eUNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIG9wYWNpdHlNb3VzZURvd24pO1xyXG4gICAgICAgIHRoaXMub3BhY2l0eUNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG9wYWNpdHlNb3VzZU1vdmUpO1xyXG4gICAgICAgIHRoaXMub3BhY2l0eUNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgb3BhY2l0eUNsaWNrZWQpO1xyXG4gICAgICAgIHRoaXMub3BhY2l0eUNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBvcGFjaXR5TW91c2VVcCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5yZXBseSA9ICgpID0+IHtcclxuICAgICAgICB0aGlzLmNvbnZlckNvbG9yKCk7XHJcbiAgICAgICAgdGhpcy5waWNrZXIuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2NvbG9yQ2hhbmdlZCcpKTtcclxuICAgICAgICB0aGlzLnBpY2tlci5maW5kKCcjcGlja2VkLWNvbG9yJykuY3NzKHsgYmFja2dyb3VuZENvbG9yOiB0aGlzLmNvbnZlcnRlZENvbG9yIH0pO1xyXG4gICAgICAgIHRoaXMucGlja2VyLmZpbmQoJyNwaWNrZWQtY29sb3ItdmFsdWUnKS5pbm5lclRleHQgPSB0aGlzLmNvbnZlcnRlZENvbG9yO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY29udmVyQ29sb3IgPSAoKSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29udmVydFRvID09ICdIRVgnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udmVydGVkQ29sb3IgPSB0aGlzLnJnYlRvSGV4KHRoaXMucGlja2VkQ29sb3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0aGlzLmNvbnZlcnRUbyA9PSAnSFNMJykge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnZlcnRlZENvbG9yID0gdGhpcy5yZ2JUb0hTTCh0aGlzLnBpY2tlZENvbG9yKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5jb252ZXJ0VG8gPT0gJ1JHQicpIHtcclxuICAgICAgICAgICAgdGhpcy5jb252ZXJ0ZWRDb2xvciA9IHRoaXMucGlja2VkQ29sb3I7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMub25DaGFuZ2VkID0gKGNhbGxCYWNrKSA9PiB7XHJcbiAgICAgICAgdGhpcy5waWNrZXIuYWRkRXZlbnRMaXN0ZW5lcignY29sb3JDaGFuZ2VkJywgZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICBjYWxsQmFjayh0aGlzLmNvbnZlcnRlZENvbG9yKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmdldFBpY2tlZENvbG9yID0gKCkgPT4ge1xyXG4gICAgICAgIGxldCBpbWFnZURhdGEgPSB0aGlzLmNvbG9yQ29udGV4dC5nZXRJbWFnZURhdGEodGhpcy5jb2xvckluZGljYXRvclBvc2l0aW9uLngsIHRoaXMuY29sb3JJbmRpY2F0b3JQb3NpdGlvbi55LCAxLCAxKTtcclxuICAgICAgICByZXR1cm4geyByOiBpbWFnZURhdGEuZGF0YVswXSwgZzogaW1hZ2VEYXRhLmRhdGFbMV0sIGI6IGltYWdlRGF0YS5kYXRhWzJdIH07XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5nZXRQaWNrZWRPcGFjaXR5ID0gKCkgPT4ge1xyXG4gICAgICAgIGxldCBpbWFnZURhdGEgPSB0aGlzLm9wYWNpdHlDb250ZXh0LmdldEltYWdlRGF0YSh0aGlzLm9wYWNpdHlJbmRpY2F0b3JQb3NpdGlvbi54LCB0aGlzLm9wYWNpdHlJbmRpY2F0b3JQb3NpdGlvbi55LCAxLCAxKTtcclxuXHJcbiAgICAgICAgbGV0IGFscGhhID0gTWF0aC5jZWlsKCgoaW1hZ2VEYXRhLmRhdGFbM10gLyAyNTUpICogMTAwKSkgLyAxMDA7XHJcbiAgICAgICAgcmV0dXJuIHsgcjogaW1hZ2VEYXRhLmRhdGFbMF0sIGc6IGltYWdlRGF0YS5kYXRhWzFdLCBiOiBpbWFnZURhdGEuZGF0YVsyXSwgYTogYWxwaGEgfTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmRyYXcgPSAocGFyYW1zKSA9PiB7XHJcbiAgICAgICAgdGhpcy5pbml0KHBhcmFtcyk7XHJcbiAgICAgICAgdGhpcy5jYWxpYnJhdGVDb2xvcigpO1xyXG4gICAgICAgIHRoaXMuY2FsaWJyYXRlT3BhY2l0eSgpO1xyXG5cclxuICAgICAgICBsZXQgaW50ZXJ2YWwgPSBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5hZGRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIGNsZWFyVGltZW91dChpbnRlcnZhbCk7XHJcbiAgICAgICAgfSwgMjAwMCk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnBpY2tlcjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmRpc3Bvc2UgPSAoKSA9PiB7XHJcbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcclxuICAgICAgICB0aGlzLnBpY2tlci5yZW1vdmUoKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmNvbG9yVHlwZSA9IChjb2xvciA9ICcjZmZmZmZmJykgPT4ge1xyXG4gICAgICAgIGxldCB0eXBlID0gJ3N0cmluZyc7XHJcbiAgICAgICAgaWYgKGNvbG9yLmluZGV4T2YoJyMnKSA9PSAwICYmIChjb2xvci5sZW5ndGggLSAxKSAlIDMgPT0gMCkge1xyXG4gICAgICAgICAgICB0eXBlID0gJ2hleCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGNvbG9yLmluZGV4T2YoJ3JnYmEnKSA9PSAwKSB7XHJcbiAgICAgICAgICAgIGxldCB2YWx1ZXMgPSBiYXNlLmluQmV0d2Vlbihjb2xvciwgJ3JnYmEoJywgJyknKTtcclxuICAgICAgICAgICAgaWYgKHZhbHVlcyAhPSAtMSAmJiB2YWx1ZXMuc3BsaXQoJywnKS5sZW5ndGggPT0gNCkge1xyXG4gICAgICAgICAgICAgICAgdHlwZSA9ICdyZ2JhJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjb2xvci5pbmRleE9mKCdyZ2InKSA9PSAwKSB7XHJcbiAgICAgICAgICAgIGxldCB2YWx1ZXMgPSBiYXNlLmluQmV0d2Vlbihjb2xvciwgJ3JnYignLCAnKScpO1xyXG4gICAgICAgICAgICBpZiAodmFsdWVzICE9IC0xICYmIHZhbHVlcy5zcGxpdCgnLCcpLmxlbmd0aCA9PSAzKSB7XHJcbiAgICAgICAgICAgICAgICB0eXBlID0gJ3JnYic7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoY29sb3IuaW5kZXhPZignaHNsYScpID09IDApIHtcclxuICAgICAgICAgICAgbGV0IHZhbHVlcyA9IGJhc2UuaW5CZXR3ZWVuKGNvbG9yLCAnaHNsYSgnLCAnKScpO1xyXG4gICAgICAgICAgICBpZiAodmFsdWVzICE9IC0xICYmIHZhbHVlcy5zcGxpdCgnLCcpLmxlbmd0aCA9PSA0KSB7XHJcbiAgICAgICAgICAgICAgICB0eXBlID0gJ2hzbGEnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGNvbG9yLmluZGV4T2YoJ2hzbCcpID09IDApIHtcclxuICAgICAgICAgICAgbGV0IHZhbHVlcyA9IGJhc2UuaW5CZXR3ZWVuKGNvbG9yLCAnaHNsKCcsICcpJyk7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZXMgIT0gLTEgJiYgdmFsdWVzLnNwbGl0KCcsJykubGVuZ3RoID09IDMpIHtcclxuICAgICAgICAgICAgICAgIHR5cGUgPSAnaHNsJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHR5cGU7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5oZXhUb1JHQiA9IChoZXggPSAnI2ZmZmZmZicsIGFscGhhID0gdHJ1ZSkgPT4ge1xyXG4gICAgICAgIGxldCByID0gMCwgZyA9IDAsIGIgPSAwLCBhID0gMjU1O1xyXG4gICAgICAgIGlmIChoZXgubGVuZ3RoID09IDQpIHtcclxuICAgICAgICAgICAgciA9IFwiMHhcIiArIGhleFsxXSArIGhleFsxXTtcclxuICAgICAgICAgICAgZyA9IFwiMHhcIiArIGhleFsyXSArIGhleFsyXTtcclxuICAgICAgICAgICAgYiA9IFwiMHhcIiArIGhleFszXSArIGhleFszXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoaGV4Lmxlbmd0aCA9PSA1KSB7XHJcbiAgICAgICAgICAgIHIgPSBcIjB4XCIgKyBoZXhbMV0gKyBoZXhbMV07XHJcbiAgICAgICAgICAgIGcgPSBcIjB4XCIgKyBoZXhbMl0gKyBoZXhbMl07XHJcbiAgICAgICAgICAgIGIgPSBcIjB4XCIgKyBoZXhbM10gKyBoZXhbM107XHJcbiAgICAgICAgICAgIGEgPSBcIjB4XCIgKyBoZXhbNF0gKyBoZXhbNF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGhleC5sZW5ndGggPT0gNykge1xyXG4gICAgICAgICAgICByID0gXCIweFwiICsgaGV4WzFdICsgaGV4WzJdO1xyXG4gICAgICAgICAgICBnID0gXCIweFwiICsgaGV4WzNdICsgaGV4WzRdO1xyXG4gICAgICAgICAgICBiID0gXCIweFwiICsgaGV4WzVdICsgaGV4WzZdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChoZXgubGVuZ3RoID09IDkpIHtcclxuICAgICAgICAgICAgciA9IFwiMHhcIiArIGhleFsxXSArIGhleFsyXTtcclxuICAgICAgICAgICAgZyA9IFwiMHhcIiArIGhleFszXSArIGhleFs0XTtcclxuICAgICAgICAgICAgYiA9IFwiMHhcIiArIGhleFs1XSArIGhleFs2XTtcclxuICAgICAgICAgICAgYSA9IFwiMHhcIiArIGhleFs3XSArIGhleFs4XTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYSA9ICsoYSAvIDI1NSkudG9GaXhlZCgzKTtcclxuXHJcbiAgICAgICAgaWYgKGFscGhhID09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBgcmdiKCR7K3J9LCAkeytnfSwgJHsrYn0pYDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBgcmdiKCR7K3J9LCAkeytnfSwgJHsrYn0sICR7YX0pYDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5oZXhUb0hTTCA9IChoZXggPSAnI2ZmZmZmZicsIGFscGhhID0gdHJ1ZSkgPT4ge1xyXG4gICAgICAgIGxldCBjb2xvciA9IHRoaXMuaGV4VG9SR0IoaGV4LCBhbHBoYSk7XHJcbiAgICAgICAgY29sb3IgPSB0aGlzLnJnYlRvSFNMKGNvbG9yLCBhbHBoYSk7XHJcbiAgICAgICAgcmV0dXJuIGNvbG9yO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucmdiVG9IZXggPSAocmdiID0gJ3JnYigwLCAwLCAwKScsIGFscGhhID0gdHJ1ZSkgPT4ge1xyXG4gICAgICAgIGxldCBzdGFydCA9IHJnYi5pbmRleE9mKCcoJykgKyAxO1xyXG4gICAgICAgIGxldCBlbmQgPSByZ2IuaW5kZXhPZignKScpO1xyXG4gICAgICAgIGxldCBbciwgZywgYiwgYV0gPSByZ2Iuc2xpY2Uoc3RhcnQsIGVuZCkuc3BsaXQoJywnKTtcclxuXHJcbiAgICAgICAgaWYgKCFiYXNlLmlzc2V0KGEpKSB7XHJcbiAgICAgICAgICAgIGEgPSAxO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgciA9ICgrcikudG9TdHJpbmcoMTYpO1xyXG4gICAgICAgIGcgPSAoK2cpLnRvU3RyaW5nKDE2KTtcclxuICAgICAgICBiID0gKCtiKS50b1N0cmluZygxNik7XHJcbiAgICAgICAgYSA9IE1hdGgucm91bmQoYSAqIDI1NSkudG9TdHJpbmcoMTYpO1xyXG5cclxuICAgICAgICBpZiAoci5sZW5ndGggPT0gMSkge1xyXG4gICAgICAgICAgICByID0gYDAke3J9YDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChnLmxlbmd0aCA9PSAxKSB7XHJcbiAgICAgICAgICAgIGcgPSBgMCR7Z31gO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGIubGVuZ3RoID09IDEpIHtcclxuICAgICAgICAgICAgYiA9IGAwJHtifWA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChhLmxlbmd0aCA9PSAxKSB7XHJcbiAgICAgICAgICAgIGEgPSBgMCR7YX1gO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGhleCA9ICcjJztcclxuICAgICAgICBpZiAoYWxwaGEgIT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgaGV4ICs9IGAke3J9JHtnfSR7Yn0ke2F9YDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGhleCArPSBgJHtyfSR7Z30ke2J9YDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBoZXg7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5yZ2JUb0hTTCA9IChyZ2IgPSAncmdiKDAsIDAsIDApJywgYWxwaGEgPSB0cnVlKSA9PiB7XHJcbiAgICAgICAgbGV0IHN0YXJ0ID0gcmdiLmluZGV4T2YoJygnKSArIDE7XHJcbiAgICAgICAgbGV0IGVuZCA9IHJnYi5pbmRleE9mKCcpJyk7XHJcbiAgICAgICAgbGV0IFtyLCBnLCBiLCBhXSA9IHJnYi5zbGljZShzdGFydCwgZW5kKS5zcGxpdCgnLCcpO1xyXG5cclxuICAgICAgICBpZiAoIWJhc2UuaXNzZXQoYSkpIHtcclxuICAgICAgICAgICAgYSA9IDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByIC89IDIyNTtcclxuICAgICAgICBnIC89IDIyNTtcclxuICAgICAgICBiIC89IDIyNTtcclxuXHJcbiAgICAgICAgbGV0IGNtaW4gPSBNYXRoLm1pbihyLCBnLCBiKSxcclxuICAgICAgICAgICAgY21heCA9IE1hdGgubWF4KHIsIGcsIGIpLFxyXG4gICAgICAgICAgICBkZWx0YSA9IGNtYXggLSBjbWluLFxyXG4gICAgICAgICAgICBoID0gMCxcclxuICAgICAgICAgICAgcyA9IDAsXHJcbiAgICAgICAgICAgIGwgPSAwO1xyXG5cclxuICAgICAgICAvLyBDYWxjdWxhdGUgaHVlXHJcbiAgICAgICAgLy8gTm8gZGlmZmVyZW5jZVxyXG4gICAgICAgIGlmIChkZWx0YSA9PSAwKSB7XHJcbiAgICAgICAgICAgIGggPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjbWF4ID09IHIpIHtcclxuICAgICAgICAgICAgaCA9ICgoZyAtIGIpIC8gZGVsdGEpICUgNjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoY21heCA9PSBnKSB7XHJcbiAgICAgICAgICAgIGggPSAoYiAtIHIpIC8gZGVsdGEgKyAyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjbWF4ID09IGcpIHtcclxuICAgICAgICAgICAgaCA9IChyIC0gZykgLyBkZWx0YSArIDQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBoID0gTWF0aC5yb3VuZChoICogNjApO1xyXG4gICAgICAgIC8vIE1ha2UgbmVnYXRpdmUgaHVlcyBwb3NpdGl2ZSBiZWhpbmQgMzYwwrBcclxuICAgICAgICBpZiAoaCA8IDApIHtcclxuICAgICAgICAgICAgaCArPSAzNjA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsID0gKGNtYXggKyBjbWluKSAvIDI7XHJcblxyXG4gICAgICAgIHMgPSBkZWx0YSA9PSAwID8gMCA6IGRlbHRhIC8gKDEgLSBNYXRoLmFicygyICogbCAtIDEpKTtcclxuXHJcbiAgICAgICAgbCA9ICsobCAqIDEwMCkudG9GaXhlZCgxKTtcclxuICAgICAgICBzID0gKyhzICogMTAwKS50b0ZpeGVkKDEpO1xyXG5cclxuICAgICAgICBsZXQgaHNsID0gYGhzbGA7XHJcbiAgICAgICAgaWYgKGFscGhhID09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIGhzbCArPSBgKCR7aH0sICR7c30lLCAke2x9JSlgO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaHNsICs9IGAoJHtofSwgJHtzfSUsICR7bH0lLCAke2F9KWA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBoc2w7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5oc2xUb1JHQiA9IChoc2wgPSAnaHNsKDAsIDAlLCAwJSknLCBhbHBoYSA9IHRydWUpID0+IHtcclxuICAgICAgICBsZXQgcmdiID0gJ3JnYic7XHJcbiAgICAgICAgbGV0IHN0YXJ0ID0gaHNsLmluZGV4T2YoJygnKSArIDE7XHJcbiAgICAgICAgbGV0IGVuZCA9IGhzbC5pbmRleE9mKCcpJyk7XHJcbiAgICAgICAgbGV0IFtoLCBzLCBsLCBhXSA9IGhzbC5zbGljZShzdGFydCwgZW5kKS5zcGxpdCgnLCcpO1xyXG5cclxuICAgICAgICBpZiAoIWJhc2UuaXNzZXQoYSkpIHtcclxuICAgICAgICAgICAgYSA9IDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoaC5pbmRleE9mKFwiZGVnXCIpID4gLTEpXHJcbiAgICAgICAgICAgIGggPSBoLnN1YnN0cigwLCBoLmxlbmd0aCAtIDMpO1xyXG4gICAgICAgIGVsc2UgaWYgKGguaW5kZXhPZihcInJhZFwiKSA+IC0xKVxyXG4gICAgICAgICAgICBoID0gTWF0aC5yb3VuZChoLnN1YnN0cigwLCBoLmxlbmd0aCAtIDMpICogKDE4MCAvIE1hdGguUEkpKTtcclxuICAgICAgICBlbHNlIGlmIChoLmluZGV4T2YoXCJ0dXJuXCIpID4gLTEpXHJcbiAgICAgICAgICAgIGggPSBNYXRoLnJvdW5kKGguc3Vic3RyKDAsIGgubGVuZ3RoIC0gNCkgKiAzNjApO1xyXG4gICAgICAgIC8vIEtlZXAgaHVlIGZyYWN0aW9uIG9mIDM2MCBpZiBlbmRpbmcgdXAgb3ZlclxyXG4gICAgICAgIGlmIChoID49IDM2MClcclxuICAgICAgICAgICAgaCAlPSAzNjA7XHJcblxyXG4gICAgICAgIHMgPSBzLnJlcGxhY2UoJyUnLCAnJykgLyAxMDA7XHJcbiAgICAgICAgbCA9IGwucmVwbGFjZSgnJScsICcnKSAvIDEwMDtcclxuXHJcbiAgICAgICAgbGV0IGMgPSAoMSAtIE1hdGguYWJzKDIgKiBsIC0gMSkpICogcyxcclxuICAgICAgICAgICAgeCA9IGMgKiAoMSAtIE1hdGguYWJzKChoIC8gNjApICUgMiAtIDEpKSxcclxuICAgICAgICAgICAgbSA9IGwgLSBjIC8gMixcclxuICAgICAgICAgICAgciA9IDAsXHJcbiAgICAgICAgICAgIGcgPSAwLFxyXG4gICAgICAgICAgICBiID0gMDtcclxuXHJcbiAgICAgICAgaWYgKDAgPD0gaCAmJiBoIDwgNjApIHtcclxuICAgICAgICAgICAgciA9IGM7IGcgPSB4OyBiID0gMDtcclxuICAgICAgICB9IGVsc2UgaWYgKDYwIDw9IGggJiYgaCA8IDEyMCkge1xyXG4gICAgICAgICAgICByID0geDsgZyA9IGM7IGIgPSAwO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoMTIwIDw9IGggJiYgaCA8IDE4MCkge1xyXG4gICAgICAgICAgICByID0gMDsgZyA9IGM7IGIgPSB4O1xyXG4gICAgICAgIH0gZWxzZSBpZiAoMTgwIDw9IGggJiYgaCA8IDI0MCkge1xyXG4gICAgICAgICAgICByID0gMDsgZyA9IHg7IGIgPSBjO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoMjQwIDw9IGggJiYgaCA8IDMwMCkge1xyXG4gICAgICAgICAgICByID0geDsgZyA9IDA7IGIgPSBjO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoMzAwIDw9IGggJiYgaCA8IDM2MCkge1xyXG4gICAgICAgICAgICByID0gYzsgZyA9IDA7IGIgPSB4O1xyXG4gICAgICAgIH1cclxuICAgICAgICByID0gTWF0aC5yb3VuZCgociArIG0pICogMjU1KTtcclxuICAgICAgICBnID0gTWF0aC5yb3VuZCgoZyArIG0pICogMjU1KTtcclxuICAgICAgICBiID0gTWF0aC5yb3VuZCgoYiArIG0pICogMjU1KTtcclxuXHJcbiAgICAgICAgaWYgKGFscGhhID09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIHJnYiArPSBgKCR7cn0sICR7Z30sICR7Yn0pYDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJnYiArPSBgKCR7cn0sICR7Z30sICR7Yn0sICR7YX0pYDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZ2I7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5oc2xUb0hleCA9IChoc2wgPSAnJywgYWxwaGEgPSB0cnVlKSA9PiB7XHJcbiAgICAgICAgbGV0IGNvbG9yID0gdGhpcy5oc2xUb1JHQihoc2wsIGFscGhhKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZ2JUb0hleChjb2xvciwgYWxwaGEpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuYWRkT3BhY2l0eSA9IChjb2xvciA9ICdyZ2IoMCwgMCwgMCknLCBvcGFjaXR5ID0gMC41KSA9PiB7XHJcbiAgICAgICAgbGV0IHR5cGUgPSB0aGlzLmNvbG9yVHlwZShjb2xvcik7XHJcbiAgICAgICAgaWYgKHR5cGUgPT0gJ2hleCcpIGNvbG9yID0gdGhpcy5oZXhUb1JHQihjb2xvcik7XHJcbiAgICAgICAgZWxzZSBpZiAodHlwZSA9PSAnaHNsJyB8fCB0eXBlID09ICdoc2xhJykgY29sb3IgPSB0aGlzLmhzbFRvUkdCKGNvbG9yKTtcclxuXHJcbiAgICAgICAgbGV0IHN0YXJ0ID0gY29sb3IuaW5kZXhPZignKCcpICsgMTtcclxuICAgICAgICBsZXQgZW5kID0gY29sb3IuaW5kZXhPZignKScpO1xyXG4gICAgICAgIGxldCBwb2ludHMgPSBjb2xvci5zbGljZShzdGFydCwgZW5kKS5zcGxpdCgnLCcpO1xyXG4gICAgICAgIHBvaW50c1szXSA9IG9wYWNpdHk7XHJcblxyXG4gICAgICAgIGxldCBjaGFuZ2VkQ29sb3IgPSBgcmdiYSgke3BvaW50cy5qb2luKCcsJyl9KWA7XHJcblxyXG4gICAgICAgIGlmICh0eXBlID09ICdoZXgnKSBjaGFuZ2VkQ29sb3IgPSB0aGlzLnJnYlRvSGV4KGNoYW5nZWRDb2xvcik7XHJcbiAgICAgICAgZWxzZSBpZiAodHlwZSA9PSAnaHNsJyB8fCB0eXBlID09ICdoc2xhJykgY2hhbmdlZENvbG9yID0gdGhpcy5yZ2JUb0hTTChjaGFuZ2VkQ29sb3IpO1xyXG5cclxuICAgICAgICByZXR1cm4gY2hhbmdlZENvbG9yO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZ2V0T3BhY2l0eSA9IChjb2xvciA9ICdyZ2IoMCwgMCwgMCknKSA9PiB7XHJcbiAgICAgICAgY29sb3IgPSBiYXNlLmluQmV0d2Vlbihjb2xvciwgJygnLCAnKScpO1xyXG4gICAgICAgIGxldCBbciwgZywgYiwgYV0gPSBjb2xvci5zcGxpdCgnLCcpO1xyXG4gICAgICAgIHJldHVybiBhLnRyaW0oKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmludmVydENvbG9yID0gKGNvbG9yID0gJyNmZmZmZmYnKSA9PiB7XHJcbiAgICAgICAgbGV0IHR5cGUgPSB0aGlzLmNvbG9yVHlwZShjb2xvcik7XHJcbiAgICAgICAgbGV0IGludmVydDtcclxuICAgICAgICBpZiAodHlwZSA9PSAnaGV4Jykge1xyXG4gICAgICAgICAgICBjb2xvciA9IGNvbG9yLnJlcGxhY2UoJyMnLCAnJyk7XHJcbiAgICAgICAgICAgIGludmVydCA9ICcjJyArIHRoaXMuaW52ZXJ0SGV4KGNvbG9yKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodHlwZSA9PSAncmdiJykge1xyXG4gICAgICAgICAgICBjb2xvciA9IHRoaXMucmdiVG9IZXgoY29sb3IpLnJlcGxhY2UoJyMnLCAnJyk7XHJcbiAgICAgICAgICAgIGludmVydCA9IHRoaXMuaW52ZXJ0SGV4KGNvbG9yKTtcclxuICAgICAgICAgICAgaW52ZXJ0ID0gdGhpcy5oZXhUb1JHQihpbnZlcnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0eXBlID09ICdyZ2JhJykge1xyXG4gICAgICAgICAgICBsZXQgb3BhY2l0eSA9IHRoaXMuZ2V0T3BhY2l0eShjb2xvcik7XHJcbiAgICAgICAgICAgIGNvbG9yID0gdGhpcy5yZ2JUb0hleChjb2xvcikucmVwbGFjZSgnIycsICcnKTtcclxuICAgICAgICAgICAgaW52ZXJ0ID0gdGhpcy5pbnZlcnRIZXgoY29sb3IpO1xyXG4gICAgICAgICAgICBpbnZlcnQgPSB0aGlzLmhleFRvUkdCKGludmVydCk7XHJcbiAgICAgICAgICAgIGludmVydCA9IHRoaXMuYWRkT3BhY2l0eShpbnZlcnQsIG9wYWNpdHkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaW52ZXJ0O1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaW52ZXJ0SGV4ID0gKGhleCA9ICdmZmZmZmYnKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIChOdW1iZXIoYDB4MSR7aGV4fWApIF4gMHhGRkZGRkYpLnRvU3RyaW5nKDE2KS5zdWJzdHIoMSkudG9VcHBlckNhc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm5hbWVUb0hleCA9IChjb2xvciA9ICd3aGl0ZScpID0+IHtcclxuICAgICAgICBsZXQgY3R4ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJykuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gY29sb3I7XHJcbiAgICAgICAgcmV0dXJuIGN0eC5maWxsU3R5bGU7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5uYW1lVG9SR0IgPSAoY29sb3IgPSAnd2hpdGUnKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaGV4VG9SR0IodGhpcy5uYW1lVG9IZXgoY29sb3IpKTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDb2xvclBpY2tlcjsiLCJjb25zdCBNYXRoc0xpYnJhcnkgPSByZXF1aXJlKCcuL01hdGhzTGlicmFyeScpO1xyXG5jb25zdCBPYmplY3RzTGlicmFyeSA9IHJlcXVpcmUoJy4vT2JqZWN0c0xpYnJhcnknKTtcclxuY29uc3QgQXJyYXlMaWJyYXJ5ID0gcmVxdWlyZSgnLi9BcnJheUxpYnJhcnknKTtcclxuY29uc3QgVHJlZSA9IHJlcXVpcmUoJy4vLi4vY2xhc3Nlcy9UcmVlJyk7XHJcblxyXG5sZXQgbWF0aExpYnJhcnkgPSBuZXcgTWF0aHNMaWJyYXJ5KCk7XHJcbmxldCBvYmplY3RMaWJyYXJ5ID0gbmV3IE9iamVjdHNMaWJyYXJ5KCk7XHJcbmxldCBhcnJheUxpYnJhcnkgPSBuZXcgQXJyYXlMaWJyYXJ5KCk7XHJcblxyXG5mdW5jdGlvbiBDb21wcmVzc2lvbigpIHtcclxuICAgIHRoaXMuZ2V0RnJlcXVlbmN5ID0gKGRhdGEgPSBbXSkgPT4gey8vZ2V0IHRoZSBvY2N1cnJhbmNlIG9mIHN5bWJvbHMgaW4gYSBsaXN0XHJcbiAgICAgICAgY29uc3QgZnJlcXVlbmN5ID0ge307XHJcbiAgICAgICAgZm9yIChsZXQgZCBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgIGlmIChmcmVxdWVuY3lbZGF0YVtkXV0gPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBmcmVxdWVuY3lbZGF0YVtkXV0gPSAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZnJlcXVlbmN5W2RhdGFbZF1dKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmcmVxdWVuY3k7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5nZXRQcm9iYWJpbGl0aWVzID0gKGRhdGEgPSBbXSkgPT4gey8vZ2V0IHRoZSBwcm9iYWJpbGl0aWVzIG9mIGFsbCBzeW1ib2xzIGluIGEgbGlzdFxyXG4gICAgICAgIGxldCBwcm9icyA9IHRoaXMuZ2V0RnJlcXVlbmN5KGRhdGEpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpIGluIHByb2JzKSB7XHJcbiAgICAgICAgICAgIHByb2JzW2ldID0gcHJvYnNbaV0gLyBkYXRhLmxlbmd0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHByb2JzO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZW50cm9weSA9IChkYXRhID0gW10pID0+IHsvL3RoaXMgc2hvd3MgdGhlIHNob3J0ZXN0IHBvc3NpYmxlIGF2ZXJhZ2UgbGVuZ3RoIG9mIGEgbG9zc2xlc3MgY29tcHJlc3Npb25cclxuICAgICAgICBsZXQgc3VtID0gMDtcclxuICAgICAgICBsZXQgZGF0YVR5cGUgPSBhcnJheUxpYnJhcnkuZGF0YVR5cGUoZGF0YSk7Ly9nZXQgdGhlIGRhdGF0eXBlIG9mIHRoZSBsaXN0XHJcbiAgICAgICAgbGV0IHByb2JhYmlsaXRpZXM7XHJcbiAgICAgICAgaWYgKGRhdGFUeXBlID09ICdudW1iZXInKSB7XHJcbiAgICAgICAgICAgIHByb2JhYmlsaXRpZXMgPSBkYXRhO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChkYXRhVHlwZSA9PSAnc3RyaW5nJykgey8vZ2V0IHRoZSBzeW1ib2xzIHByb2JhYmlsaXRpZXNcclxuICAgICAgICAgICAgcHJvYmFiaWxpdGllcyA9IE9iamVjdC52YWx1ZXModGhpcy5nZXRQcm9iYWJpbGl0aWVzKGRhdGEpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vU3VtIG9mICgtcCBsb2cgYmFzZSAyIG9mIHApXHJcbiAgICAgICAgZm9yIChsZXQgcHJvYiBvZiBwcm9iYWJpbGl0aWVzKSB7XHJcbiAgICAgICAgICAgIHN1bSArPSAoLXByb2IgKiBNYXRoLmxvZzIocHJvYikpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHN1bTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmlzVURDID0gKGRhdGEgPSBbXSkgPT4gey8vY2hlY2sgaWYgYSBsaXN0IGlzIHVuaXF1ZWx5IGRlY29kYWJsZSBjb2RlXHJcbiAgICAgICAgbGV0IGZsYWcgPSB0cnVlLCBub1ByZWZpeCwga2VlcFJ1bm5pbmcgPSB0cnVlO1xyXG5cclxuICAgICAgICBsZXQgYWRkU3VyZml4ID0gKHN0cikgPT4ge1xyXG4gICAgICAgICAgICAvL2NoZWNrIGlmIHN1ZmZpeCBpcyBpbiBsaXN0IGFscmVhZHkgdGhlbiBzdG9wIHJ1bm5pbmdcclxuICAgICAgICAgICAgaWYgKGRhdGEuaW5jbHVkZXMoc3RyKSkge1xyXG4gICAgICAgICAgICAgICAgZmxhZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAga2VlcFJ1bm5pbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZGF0YS5wdXNoKHN0cik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgY2hlY2tQcmVmaXggPSAocG9zKSA9PiB7Ly9jaGVjayBmb3IgcHJlZml4XHJcbiAgICAgICAgICAgIG5vUHJlZml4ID0gdHJ1ZTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSA9PSBwb3MpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL3NraXAgdGhlIGN1cnJlbnQgcG9zaXRpb25cclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGRhdGFbaV0gPT0gZGF0YVtwb3NdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9kb3VibGUgZm91bmQgaW4gdGhlIGxpc3RcclxuICAgICAgICAgICAgICAgICAgICBmbGFnID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAga2VlcFJ1bm5pbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGRhdGFbaV0uaW5kZXhPZihkYXRhW3Bvc10pID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2FkZCBzdWZmaXggZm91bmQgdG8gdGhlIGxpc3RcclxuICAgICAgICAgICAgICAgICAgICBhZGRTdXJmaXgoZGF0YVtpXS5yZXBsYWNlKGRhdGFbcG9zXSwgJycpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvL3N0b3AgY2hlY2tpbmcgZm9yIHByZWZpeFxyXG4gICAgICAgICAgICAgICAgaWYgKCFrZWVwUnVubmluZykgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHdoaWxlIChrZWVwUnVubmluZykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNoZWNrUHJlZml4KGkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGtlZXBSdW5uaW5nID09IGZhbHNlKSBicmVhazsvL3N0b3AgcnVubmluZ1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAobm9QcmVmaXggPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgLy9pZiBubyBwcmVmaXggaXMgZm91bmQgc3RvcCBpdCBpcyBVRENcclxuICAgICAgICAgICAgICAgIGtlZXBSdW5uaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmbGFnO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc2ZBbGdvcml0aG0gPSAoZGF0YSA9IFtdKSA9PiB7XHJcbiAgICAgICAgbGV0IGZyZXF1ZW5jeSA9IHRoaXMuZ2V0RnJlcXVlbmN5KGRhdGEpOy8vZ2V0IHRoZSBmcmVxdWVjaWVzIG9mIHRoZSBzeW1ib2xzXHJcbiAgICAgICAgbGV0IHNvcnRlZCA9IG9iamVjdExpYnJhcnkuc29ydChmcmVxdWVuY3ksIHsgdmFsdWU6IHRydWUgfSk7Ly9zb3J0IHRoZSBzeW1ib2xzIGJhc2VkIG9uIGZyZXF1ZWN5IG9mIG9jY3VycmFuY2VcclxuICAgICAgICBsZXQgY29kZVdvcmQgPSAnJztcclxuXHJcbiAgICAgICAgbGV0IHRyZWUgPSB7IHBhdGg6ICcnLCBzaXplOiBtYXRoTGlicmFyeS5zdW0oT2JqZWN0LnZhbHVlcyhzb3J0ZWQpKSwgdmFsdWU6IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoc29ydGVkKSkgfTsvL3NldCBhIGNvcHkgb2YgdGhlIHNvcnRlZCBkYXRhIGFzIGEgdHJlZVxyXG4gICAgICAgIGxldCB0YWJsZSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoc29ydGVkKSk7Ly9zZXQgdGhlIHNvcnRlZCBhcyB0YWJsZVxyXG5cclxuICAgICAgICBmb3IgKGxldCBpIGluIHRhYmxlKSB7XHJcbiAgICAgICAgICAgIHRhYmxlW2ldID0geyBmcmVxdWVuY3k6IHRhYmxlW2ldIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgdHJ5U3dpdGNoaW5nID0gKG5vZGUpID0+IHsvL3N3aXRjaCBub2RlcyBpZiB0aGUgbGVmdCBzaXplIGlzIGJpZ2dlciB0aGFuIHRoZSByaWdodCBzaWRlXHJcbiAgICAgICAgICAgIGlmIChub2RlWzBdLnNpemUgPiBub2RlWzFdLnNpemUpIHtcclxuICAgICAgICAgICAgICAgIGxldCB0ZW1wID0gbm9kZVswXTtcclxuICAgICAgICAgICAgICAgIG5vZGVbMF0gPSBub2RlWzFdO1xyXG4gICAgICAgICAgICAgICAgbm9kZVsxXSA9IHRlbXA7XHJcblxyXG4gICAgICAgICAgICAgICAgdGVtcCA9IG5vZGVbMF0ucGF0aDtcclxuICAgICAgICAgICAgICAgIG5vZGVbMF0ucGF0aCA9IG5vZGVbMV0ucGF0aFxyXG4gICAgICAgICAgICAgICAgbm9kZVsxXS5wYXRoID0gdGVtcDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbm9kZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBzcGxpdERhdGEgPSAoY29taW5nTm9kZSkgPT4gey8vc3BsaXQgYSB0cmVlXHJcbiAgICAgICAgICAgIGxldCBub2RlID0gW3sgcGF0aDogY29taW5nTm9kZS5wYXRoICsgJzAnLCBzaXplOiAwLCB2YWx1ZTogW10gfSwgeyBwYXRoOiBjb21pbmdOb2RlLnBhdGggKyAnMScsIHNpemU6IDAsIHZhbHVlOiBbXSB9XTsvL2ludG8gdHdvIGFsbW9zdCBlcXVhbCBsZW5ndGhcclxuICAgICAgICAgICAgZm9yIChsZXQgaSBpbiBjb21pbmdOb2RlLnZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobm9kZVswXS5zaXplIDwgbm9kZVsxXS5zaXplKSB7Ly9zcGxpdCBpbnRvIDIgYWxtb3N0IGVxdWFsIG5vZGVzXHJcbiAgICAgICAgICAgICAgICAgICAgbm9kZVswXS52YWx1ZVtpXSA9IGNvbWluZ05vZGUudmFsdWVbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgbm9kZVswXS5zaXplICs9IGNvbWluZ05vZGUudmFsdWVbaV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBub2RlWzFdLnZhbHVlW2ldID0gY29taW5nTm9kZS52YWx1ZVtpXTtcclxuICAgICAgICAgICAgICAgICAgICBub2RlWzFdLnNpemUgKz0gY29taW5nTm9kZS52YWx1ZVtpXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbm9kZSA9IHRyeVN3aXRjaGluZyhub2RlKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgaW4gbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKE9iamVjdC52YWx1ZXMobm9kZVtpXS52YWx1ZSkubGVuZ3RoID4gMSkgey8vaWYgaXQgaGFzIG1vcmUgdGhhbiAxIHN5bWJvbCBpdCdzIGEgbm9kZSB0aGVuIHNwbGl0IGl0IGFnYWluXHJcbiAgICAgICAgICAgICAgICAgICAgbm9kZVtpXS52YWx1ZSA9IHNwbGl0RGF0YShub2RlW2ldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Ugey8vaXQgaXMgYSBsZWFmLCBhZGQgaXQgdG8gdGhlIHRhYmxlIGFuZCBnZXQgdGhlIHByb3BlcnRpZXNcclxuICAgICAgICAgICAgICAgICAgICBsZXQga2V5ID0gT2JqZWN0LmtleXMobm9kZVtpXS52YWx1ZSlbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgdGFibGVba2V5XS5jb2RlID0gbm9kZVtpXS5wYXRoO1xyXG4gICAgICAgICAgICAgICAgICAgIHRhYmxlW2tleV0ubGVuZ3RoID0gbm9kZVtpXS5wYXRoLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgICAgICB0YWJsZVtrZXldLnByb2JhYmlsaXR5ID0gbm9kZVtpXS5zaXplIC8gZGF0YS5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFibGVba2V5XS5sb2cgPSBNYXRoLmxvZzIoMSAvIHRhYmxlW2tleV0ucHJvYmFiaWxpdHkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBub2RlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdHJlZSA9IHNwbGl0RGF0YSh0cmVlKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgZCBvZiBkYXRhKSB7XHJcbiAgICAgICAgICAgIGNvZGVXb3JkICs9IHRhYmxlW2RdLmNvZGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4geyBjb2RlV29yZCwgdGFibGUsIGRhdGEsIHRyZWUgfTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmh1ZmZtYW5Db2RpbmcgPSAoZGF0YSA9IFtdKSA9PiB7XHJcbiAgICAgICAgbGV0IGZyZXF1ZW5jeSA9IHRoaXMuZ2V0UHJvYmFiaWxpdGllcyhkYXRhKTsvL2dldCB0aGUgZnJlcXVlY2llcyBvZiB0aGUgc3ltYm9sc1xyXG4gICAgICAgIGxldCBzb3J0ZWQgPSBvYmplY3RMaWJyYXJ5LnNvcnQoZnJlcXVlbmN5LCB7IHZhbHVlOiB0cnVlIH0pOy8vc29ydCB0aGUgc3ltYm9scyBiYXNlZCBvbiBmcmVxdWVjeSBvZiBvY2N1cnJhbmNlXHJcblxyXG4gICAgICAgIGxldCB0cmVlID0gW107XHJcbiAgICAgICAgbGV0IHRhYmxlID0ge307XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgaW4gc29ydGVkKSB7Ly9pbml0IHRoZSB0YWJsZSBhbmQgdGhlIHRyZWVcclxuICAgICAgICAgICAgdGFibGVbaV0gPSB7IHByb2JhYmlsaXR5OiBzb3J0ZWRbaV0sIHBhdGg6ICcnLCBsZW5ndGg6IDAsIHByb2Q6IDAgfTtcclxuICAgICAgICAgICAgdHJlZS5wdXNoKHsgdmFsdWU6IHNvcnRlZFtpXSwgb3JpZ2luczogaSB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBkaWcgPSAoY29taW5nID0gW10pID0+IHsvL3J1biB0aGUgYWxnb3JpdGhtIGxvb3AgdW50aWwgb25lIG5vZGUgaXMgcmVtYWluaW5nIHdpdGggdmFsdWUgb2YgJzEnXHJcbiAgICAgICAgICAgIGxldCBsZW5ndGggPSBjb21pbmcubGVuZ3RoOy8vc2l6ZSBvZiBsaXN0IFxyXG4gICAgICAgICAgICBsZXQgbm9kZSA9IFtdOy8vaW5pdCBub2RlXHJcbiAgICAgICAgICAgIGlmIChsZW5ndGggPiAxKSB7Ly8gbGlzdCBoYXMgbW9yZSB0aGFuIG9uZSBub2RlP1xyXG4gICAgICAgICAgICAgICAgbGV0IGRvd24gPSBsZW5ndGggLSAxOy8vaW5kZXggb2YgbGFzdCB0d28gaXRlbXMgaW4gbGlzdFxyXG4gICAgICAgICAgICAgICAgbGV0IHVwID0gbGVuZ3RoIC0gMjtcclxuICAgICAgICAgICAgICAgIGxldCBzdW0gPSBjb21pbmdbdXBdLnZhbHVlICsgY29taW5nW2Rvd25dLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgbGV0IGFkZGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbWluZy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpID09IHVwIHx8IGkgPT0gZG93bikgey8vc3VtIGxhc3QgMiBpdGVtcyBhbmQgc2tpcCBhZGRpbmcgdGhlbVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobGVuZ3RoID09IDIpIHsvL2lmIGxhc3QgMiBzdW0gdGhlbSBhbmQgZXhpc3QgZGlnZ2luZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5ld0xlYWYgPSB7IHZhbHVlOiBzdW0sIG9yaWdpbnM6IFtjb21pbmdbdXBdLm9yaWdpbnMsIGNvbWluZ1tkb3duXS5vcmlnaW5zXSB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5wdXNoKG5ld0xlYWYpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGNvbWluZ1tpXS52YWx1ZSA8PSBzdW0gJiYgIWFkZGVkKSB7Ly9hZGQgc3VtIGlmIGl0IGhhcyBub3QgYmVlbiBhZGRlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmV3TGVhZiA9IHsgdmFsdWU6IHN1bSwgb3JpZ2luczogW2NvbWluZ1t1cF0ub3JpZ2lucywgY29taW5nW2Rvd25dLm9yaWdpbnNdIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUucHVzaChuZXdMZWFmKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRkZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5wdXNoKGNvbWluZ1tpXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGxlbmd0aCA+IDIpIHtcclxuICAgICAgICAgICAgICAgICAgICBub2RlID0gZGlnKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbm9kZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRyZWUgPSBkaWcodHJlZSk7XHJcblxyXG4gICAgICAgIC8vZ2V0IHRoZSBwYXRoL2NvZGV3b3JkIGZvcmVhY2ggc3ltYm9sXHJcbiAgICAgICAgbGV0IG5hbWVJdGVtcyA9IChvcmlnaW5zLCBwYXRoKSA9PiB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgaW4gb3JpZ2lucykge1xyXG4gICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkob3JpZ2luc1tpXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lSXRlbXMob3JpZ2luc1tpXSwgcGF0aCArIGkpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0YWJsZVtvcmlnaW5zW2ldXS5wYXRoID0gcGF0aCArIGk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFibGVbb3JpZ2luc1tpXV0ubGVuZ3RoID0gcGF0aC5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFibGVbb3JpZ2luc1tpXV0ucHJvZCA9IHBhdGgubGVuZ3RoICogdGFibGVbb3JpZ2luc1tpXV0ucHJvYmFiaWxpdHk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG5hbWVJdGVtcyh0cmVlWzBdLm9yaWdpbnMsICcnKTtcclxuXHJcbiAgICAgICAgLy9jYWxjdWxhdGUgdGhlIGF2ZXZhZ2UgbGVuZ3RoIG9mIHRoZSBjb2Rlc1xyXG4gICAgICAgIGxldCBhdmdMZW5ndGggPSBtYXRoTGlicmFyeS5zdW0ob2JqZWN0TGlicmFyeS52YWx1ZU9mT2JqZWN0QXJyYXkodGFibGUsICdwcm9kJykpO1xyXG5cclxuICAgICAgICBmcmVxdWVuY3kgPSBzb3J0ZWQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgcmV0dXJuIHsgdGFibGUsIGRhdGEsIGF2Z0xlbmd0aCwgdHJlZSB9O1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZW5jb2RlSHVmZm1hbiA9IChkYXRhLCBkaWN0aW9uYXJ5ID0gW10pID0+IHtcclxuICAgICAgICBsZXQgZGljdGlvbmFyeUxlbmd0aCA9IGRpY3Rpb25hcnkubGVuZ3RoO1xyXG4gICAgICAgIGxldCBjb2RlV29yZCA9ICcnLCBueXRDb2RlLCBjb2RlO1xyXG5cclxuICAgICAgICAvL2dldCB0aGUgZSBhbmQgciBwYXJhbWV0ZXJzXHJcbiAgICAgICAgbGV0IHsgZSwgciB9ID0gKCgpID0+IHtcclxuICAgICAgICAgICAgbGV0IG9rID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGxldCBlID0gMCwgcjtcclxuICAgICAgICAgICAgd2hpbGUgKCFvaykge1xyXG4gICAgICAgICAgICAgICAgZSsrO1xyXG4gICAgICAgICAgICAgICAgciA9IGRpY3Rpb25hcnlMZW5ndGggLSAyICoqIGU7XHJcbiAgICAgICAgICAgICAgICBvayA9IHIgPCAyICoqIGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHsgZSwgciB9O1xyXG4gICAgICAgIH0pKCk7XHJcblxyXG4gICAgICAgIGxldCBmaXhlZENvZGUgPSAoc3ltYm9sKSA9PiB7Ly9nZXQgdGhlIGZpeGVkIGNvZGVcclxuICAgICAgICAgICAgbGV0IGsgPSBkaWN0aW9uYXJ5LmluZGV4T2Yoc3ltYm9sKSArIDE7XHJcbiAgICAgICAgICAgIGxldCBjb2RlO1xyXG4gICAgICAgICAgICBpZiAoayA8PSAyICogcikgeyAvLyAxIDw9IGsgPD0gMnJcclxuICAgICAgICAgICAgICAgIGNvZGUgPSAoayAtIDEpLnRvU3RyaW5nKDIpO1xyXG4gICAgICAgICAgICAgICAgY29kZSA9IEFycmF5KChlICsgMSkgLSBjb2RlLmxlbmd0aCkuZmlsbCgwKS5qb2luKCcnKSArIGNvZGU7IC8vIGUgKyAxIHJlcHJlc2VudGF0aW9uIG9mIGsgLSAxXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoayA+IDIgKiByKSB7Ly9rID4gMnJcclxuICAgICAgICAgICAgICAgIGNvZGUgPSAoayAtIHIgLSAxKS50b1N0cmluZygyKTtcclxuICAgICAgICAgICAgICAgIGNvZGUgPSBBcnJheSgoZSkgLSBjb2RlLmxlbmd0aCkuZmlsbCgwKS5qb2luKCcnKSArIGNvZGU7Ly8gZSByZXByZXNlbnRhdGlvbiBvZiBrIC0gciAtIDFcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gY29kZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCB1cGRhdGVDb3VudCA9ICh0KSA9PiB7Ly9zZXQgdGhlIGNvdW50IG9mIGEgbm9kZSBhbmQgc3dpdGNoIGlmIGxlZnQgaXMgZ3JlYXRlciB0aGFuIHJpZ2h0XHJcbiAgICAgICAgICAgIGxldCBjb3VudCA9IHQuZ2V0QXR0cmlidXRlKCdjb3VudCcpO1xyXG4gICAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgICAgICB0LnNldEF0dHJpYnV0ZXMoeyBjb3VudCB9KTtcclxuICAgICAgICAgICAgbGV0IHAgPSB0LnBhcmVudFRyZWU7XHJcbiAgICAgICAgICAgIGlmIChwICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRyeVN3aXRjaGluZyhwKTtcclxuICAgICAgICAgICAgICAgIHVwZGF0ZUNvdW50KHApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgdHJ5U3dpdGNoaW5nID0gKG5vZGUpID0+IHsvL3N3aXRjaCBpZiBsZWZ0IGlzIGdyZWF0ZXIgdGhhbiByaWdodFxyXG4gICAgICAgICAgICBpZiAobm9kZS52YWx1ZXNbMF0uZ2V0QXR0cmlidXRlKCdjb3VudCcpID4gbm9kZS52YWx1ZXNbMV0uZ2V0QXR0cmlidXRlKCdjb3VudCcpKSB7XHJcbiAgICAgICAgICAgICAgICBub2RlLnJldmVyc2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGxldCB0cmVlID0gbmV3IFRyZWUoKTtcclxuICAgICAgICB0cmVlLnNldEF0dHJpYnV0ZSgnY291bnQnLCAwKTtcclxuICAgICAgICBsZXQgTllUID0gdHJlZTtcclxuXHJcbiAgICAgICAgbGV0IHJlYWRTeW1ib2wgPSAoc3ltYm9sKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBzID0gdHJlZS5zZWFyY2goKHYsIGkpID0+IHsvL3NlYXJjaCBhbmQgZ2V0IHN5bWJvbCBub2RlIGlmIGFkZGVkIGFscmVhZHlcclxuICAgICAgICAgICAgICAgIHJldHVybiB2LmdldEF0dHJpYnV0ZSgnaWQnKSA9PSBzeW1ib2w7XHJcbiAgICAgICAgICAgIH0sIHRyZWUuaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgICAgIGxldCB2ID0gcy52YWx1ZTtcclxuICAgICAgICAgICAgbnl0Q29kZSA9IHRyZWUuc2VhcmNoKCh2LCBpKSA9PiB7Ly9nZXQgdGhlIG55dCBub2RlXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdi5nZXRBdHRyaWJ1dGUoJ2lkJykgPT0gJ255dCc7XHJcbiAgICAgICAgICAgIH0sIHRyZWUuaGVpZ2h0KS5wYXRoLmpvaW4oJycpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHYgPT0gdW5kZWZpbmVkKSB7Ly9oYXMgbm90IGJlZW4gYWRkZWRcclxuICAgICAgICAgICAgICAgIE5ZVC5yZW1vdmVBdHRyaWJ1dGUoJ2lkJyk7Ly9yZW1vdmUgdGhlIGN1cnJlbnQgTllUIHRhZ1xyXG4gICAgICAgICAgICAgICAgTllULnB1c2goW10sIFtdKTsvL2FkZCB0aGUgMiBub2Rlc1xyXG4gICAgICAgICAgICAgICAgbGV0IHRlbXAgPSBOWVQudmFsdWVzWzBdO1xyXG4gICAgICAgICAgICAgICAgdiA9IE5ZVC52YWx1ZXNbMV07XHJcblxyXG4gICAgICAgICAgICAgICAgdGVtcC5zZXRBdHRyaWJ1dGVzKHsgaWQ6ICdueXQnLCBjb3VudDogMCB9KTsvL3NldCBuZXcgbnl0XHJcbiAgICAgICAgICAgICAgICB2LnNldEF0dHJpYnV0ZXMoeyBpZDogc3ltYm9sLCBjb3VudDogMCB9KTtcclxuICAgICAgICAgICAgICAgIE5ZVCA9IHRlbXA7XHJcbiAgICAgICAgICAgICAgICBjb2RlID0gbnl0Q29kZSArIGZpeGVkQ29kZShzeW1ib2wpOy8vbnl0ICsgZml4ZWRDb2RlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb2RlID0gcy5wYXRoLmpvaW4oJycpOy8vZ2V0IHBhdGhcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29kZVdvcmQgKz0gY29kZTsvL2NvbmNhdCB0aGUgY29kZVxyXG5cclxuICAgICAgICAgICAgdXBkYXRlQ291bnQodik7Ly91cGRhdGUgdGhlIGNvdW50IHN0YXJ0aW5nIGZyb20gdGhpcyBub2RlIHRvIHRoZSByb290XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGxldCBzeW1ib2wgb2YgZGF0YSkge1xyXG4gICAgICAgICAgICByZWFkU3ltYm9sKHN5bWJvbCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4geyBjb2RlV29yZCwgdHJlZSwgZGF0YSB9O1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZGVjb2RlSHVmZm1hbiA9IChjb2RlV29yZCwgZGljdGlvbmFyeSA9IFtdKSA9PiB7XHJcbiAgICAgICAgbGV0IGRpY3Rpb25hcnlMZW5ndGggPSBkaWN0aW9uYXJ5Lmxlbmd0aDtcclxuICAgICAgICBsZXQgZGF0YSA9ICcnLCBueXRDb2RlLCBjb2RlLCBwYXRoID0gW107XHJcbiAgICAgICAgbGV0IHRyZWUgPSBuZXcgVHJlZSgpO1xyXG4gICAgICAgIHRyZWUuc2V0QXR0cmlidXRlcyh7IGNvdW50OiAwLCBpZDogJ255dCcgfSk7XHJcbiAgICAgICAgbGV0IE5ZVCA9IHRyZWU7XHJcbiAgICAgICAgbGV0IGk7XHJcbiAgICAgICAgbGV0IHsgZSwgciB9ID0gKCgpID0+IHtcclxuICAgICAgICAgICAgbGV0IG9rID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGxldCBlID0gMCwgcjtcclxuICAgICAgICAgICAgd2hpbGUgKCFvaykge1xyXG4gICAgICAgICAgICAgICAgZSsrO1xyXG4gICAgICAgICAgICAgICAgciA9IGRpY3Rpb25hcnlMZW5ndGggLSAyICoqIGU7XHJcbiAgICAgICAgICAgICAgICBvayA9IHIgPCAyICoqIGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHsgZSwgciB9O1xyXG4gICAgICAgIH0pKCk7XHJcblxyXG4gICAgICAgIGxldCB0cnlTd2l0Y2hpbmcgPSAobm9kZSkgPT4gey8vc3dpdGNoIG5vZGVzIGlmIGxlZnQgc2lkZSBpcyBncmVhdGVyIHRoYW4gcmlnaHQgc2lkZVxyXG4gICAgICAgICAgICBpZiAobm9kZS52YWx1ZXNbMF0uZ2V0QXR0cmlidXRlKCdjb3VudCcpID4gbm9kZS52YWx1ZXNbMV0uZ2V0QXR0cmlidXRlKCdjb3VudCcpKSB7XHJcbiAgICAgICAgICAgICAgICBub2RlLnJldmVyc2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGxldCB1cGRhdGVDb3VudCA9ICh0KSA9PiB7Ly91cGRhdGUgdGhlIHNpemUgb2YgdGhlIGN1cnJlbnQgbm9kZSBhbmQgaXQncyBuZXh0IHBhcmVudFxyXG4gICAgICAgICAgICBsZXQgY291bnQgPSB0LmdldEF0dHJpYnV0ZSgnY291bnQnKTtcclxuICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICAgICAgdC5zZXRBdHRyaWJ1dGVzKHsgY291bnQgfSk7XHJcbiAgICAgICAgICAgIGxldCBwID0gdC5wYXJlbnRUcmVlO1xyXG4gICAgICAgICAgICBpZiAocCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0cnlTd2l0Y2hpbmcocCk7XHJcbiAgICAgICAgICAgICAgICB1cGRhdGVDb3VudChwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHJlYWRTeW1ib2wgPSAoc3ltYm9sKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBzID0gdHJlZS5zZWFyY2goKHYpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2LmdldEF0dHJpYnV0ZSgnaWQnKSA9PSBzeW1ib2w7Ly9zZWFyY2ggYW5kIGdldCBzeW1ib2wgaWYgZXhpc3RzIGFscmVhZHlcclxuICAgICAgICAgICAgfSwgdHJlZS5oZWlnaHQpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHYgPSBzLnZhbHVlO1xyXG4gICAgICAgICAgICBueXRDb2RlID0gdHJlZS5zZWFyY2goKHYsIGkpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2LmdldEF0dHJpYnV0ZSgnaWQnKSA9PSAnbnl0JzsvL2dldCB0aGUgTllUIGNvZGVcclxuICAgICAgICAgICAgfSwgdHJlZS5oZWlnaHQpLnBhdGguam9pbignJyk7XHJcblxyXG4gICAgICAgICAgICBpZiAodiA9PSB1bmRlZmluZWQpIHsvL25ldyBzeW1ib2w/IGFkZCBpdCB0byB0aGUgdHJlZSB3aXRoIG5ldyBOWVRcclxuICAgICAgICAgICAgICAgIE5ZVC5yZW1vdmVBdHRyaWJ1dGUoJ2lkJyk7XHJcbiAgICAgICAgICAgICAgICBOWVQucHVzaChbXSwgW10pO1xyXG4gICAgICAgICAgICAgICAgbGV0IHRlbXAgPSBOWVQudmFsdWVzWzBdO1xyXG4gICAgICAgICAgICAgICAgdiA9IE5ZVC52YWx1ZXNbMV07XHJcblxyXG4gICAgICAgICAgICAgICAgdGVtcC5zZXRBdHRyaWJ1dGVzKHsgaWQ6ICdueXQnLCBjb3VudDogMCB9KTtcclxuICAgICAgICAgICAgICAgIHYuc2V0QXR0cmlidXRlcyh7IGlkOiBzeW1ib2wsIGNvdW50OiAwIH0pO1xyXG4gICAgICAgICAgICAgICAgTllUID0gdGVtcDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdXBkYXRlQ291bnQodik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgaW50ZXJwcmV0ZSA9IChub2RlKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBjb2RlO1xyXG4gICAgICAgICAgICBpZiAobm9kZSA9PSBOWVQpIHsvL2lzIG5vZGUgTllUXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGU7IGorKykgey8vcmVhZCBuZXh0IDQgY29kZXNcclxuICAgICAgICAgICAgICAgICAgICBwYXRoLnB1c2goY29kZVdvcmRbKytpXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsZXQgcCA9IHBhcnNlSW50KHBhdGguam9pbignJyksIDIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHAgPCByKSB7Ly9wIGlzIG1vcmUgdGhhbiByLCByZWFkIDEgbW9yZVxyXG4gICAgICAgICAgICAgICAgICAgIHBhdGgucHVzaChjb2RlV29yZFsrK2ldKTtcclxuICAgICAgICAgICAgICAgICAgICBwID0gcGFyc2VJbnQocGF0aC5qb2luKCcnKSwgMik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBwICs9IHI7Ly9hZGQgciB0byBwXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb2RlID0gZGljdGlvbmFyeVtwXTsvL2dldCBzeW1ib2wgZnJvbSBkaWN0aW9uYXJ5XHJcbiAgICAgICAgICAgICAgICByZWFkU3ltYm9sKGNvZGUpOy8vYWRkIHRoaXMgc3ltYm9sIHRvIHRyZWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvZGUgPSBub2RlLmdldEF0dHJpYnV0ZSgnaWQnKTsvL2dldCB0aGUgc3ltYm9sIGZyb20gdGhlIHRyZWVcclxuICAgICAgICAgICAgICAgIHJlYWRTeW1ib2woY29kZSk7Ly91cGRhdGUgdGhlIHN5bWJvbFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBjb2RlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChpID0gLTE7IGkgPCBjb2RlV29yZC5sZW5ndGg7IGkrKykgey8vc3RhcnQgd2l0aCBlbXB0eSBOWVRcclxuICAgICAgICAgICAgbGV0IGNvZGUgPSBjb2RlV29yZFtpXTtcclxuICAgICAgICAgICAgaWYgKGNvZGUgIT0gdW5kZWZpbmVkKSB7Ly93aGVuIG5vdCBlbXB0eVxyXG4gICAgICAgICAgICAgICAgcGF0aC5wdXNoKGNvZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBub2RlID0gdHJlZS50cmFjZShwYXRoKS52YWx1ZTtcclxuICAgICAgICAgICAgaWYgKG5vZGUuZ2V0QXR0cmlidXRlKCdpZCcpICE9IHVuZGVmaW5lZCkgey8vaXMgbm9kZSBsYWJlbGxlZFxyXG4gICAgICAgICAgICAgICAgcGF0aCA9IFtpdGVtXTtcclxuICAgICAgICAgICAgICAgIGRhdGEgKz0gaW50ZXJwcmV0ZShub2RlKTsvL3doYXQgaXMgdGhpcyBub2RlXHJcbiAgICAgICAgICAgICAgICBwYXRoID0gW107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7IGRhdGEsIHRyZWUsIGNvZGVXb3JkIH07XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5nb2xvbWIgPSAobiwgbSkgPT4ge1xyXG4gICAgICAgIGxldCBxID0gTWF0aC5mbG9vcihuIC8gbSk7Ly9zdGVwIDFcclxuICAgICAgICBsZXQgdW5hcnkgPSBBcnJheShxKS5maWxsKDEpLmpvaW4oJycpICsgJzAnOy8vdW5hcnkgb2YgcVxyXG5cclxuICAgICAgICBsZXQgayA9IE1hdGguY2VpbChNYXRoLmxvZzIobSkpO1xyXG4gICAgICAgIGxldCBjID0gMiAqKiBrIC0gbTtcclxuICAgICAgICBsZXQgciA9IG4gJSBtO1xyXG4gICAgICAgIGxldCByQyA9ICgoKSA9PiB7Ly9yYFxyXG4gICAgICAgICAgICBsZXQgdmFsdWUgPSByLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIGlmIChyIDwgYykge1xyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSByLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IEFycmF5KChrIC0gMSkgLSB2YWx1ZS5sZW5ndGgpLmZpbGwoMCkuam9pbignJykgKyB2YWx1ZTsvL2stMSBiaXRzIHJlcCBvZiByXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IChyICsgYykudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gQXJyYXkoayAtIHZhbHVlLmxlbmd0aCkuZmlsbCgwKS5qb2luKCcnKSArIHZhbHVlOy8vayBiaXRzIHJlcCBvZiByK2NcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgfSkoKTtcclxuXHJcbiAgICAgICAgbGV0IGNvZGUgPSB1bmFyeSArIHJDOy8vY29uY2F0IHVuYXJ5IGFuZCByJ1xyXG4gICAgICAgIHJldHVybiBjb2RlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZW5jb2RlQXJpdGhtZXRpYyA9IChkYXRhLCBwcm9iYWJpbGl0aWVzKSA9PiB7XHJcbiAgICAgICAgbGV0IGdldFggPSAobikgPT4gey8vZih4KG4pKT0gc3VtIG9mIHgoMSkgLi4uLiB4KG4pXHJcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IDA7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgaW4gcHJvYmFiaWxpdGllcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKG4gPT0gaSkgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9ICh2YWx1ZSAvIDEwICsgcHJvYmFiaWxpdGllc1tpXSAvIDEwKSAqIDEwMCAvIDEwOy8vaGFuZGxlIHRoZSBKUyBkZWNpbWFsIHByb2JsZW1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBsKDApID0gMCwgdSgwKSA9IDAsIGZ4KDApID0gMFxyXG4gICAgICAgIGxldCBib3VuZHMgPSBbeyBsOiAwLCB1OiAxIH1dO1xyXG5cclxuICAgICAgICBsZXQgbG93ZXJOID0gKG4pID0+IHsvL2xvd2VyIGxpbWl0IG9mIG4gbChuKSA9IGwobi0xKSArICh1KG4tMSkgLSBsKG4tMSkpICogZih4KG4tMSkpXHJcbiAgICAgICAgICAgIGxldCBib3VuZCA9IGJvdW5kc1tuXTtcclxuICAgICAgICAgICAgbGV0IGwgPSBib3VuZC5sICsgKChib3VuZC51IC0gYm91bmQubCkgKiBnZXRYKGRhdGFbbl0gLSAxKSk7XHJcbiAgICAgICAgICAgIHJldHVybiBsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHVwcGVyTiA9IChuKSA9PiB7Ly9sb3dlciBsaW1pdCBvZiBuIHUobikgPSBsKG4tMSkgKyAodShuLTEpIC0gbChuLTEpKSAqIGYoeChuKSlcclxuICAgICAgICAgICAgbGV0IGJvdW5kID0gYm91bmRzW25dO1xyXG4gICAgICAgICAgICBsZXQgdSA9IGJvdW5kLmwgKyAoKGJvdW5kLnUgLSBib3VuZC5sKSAqIGdldFgoZGF0YVtuXSkpO1xyXG4gICAgICAgICAgICByZXR1cm4gdTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBib3VuZHMucHVzaCh7IGw6IGxvd2VyTihpKSwgdTogdXBwZXJOKGkpIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG4gPSBib3VuZHMucG9wKCk7XHJcbiAgICAgICAgcmV0dXJuIChuLmwgKyBuLnUpIC8gMjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmRlY29kZUFyaXRobWV0aWMgPSAodGFnID0gMCwgcHJvYmFiaWxpdGllcykgPT4ge1xyXG4gICAgICAgIGxldCBkYXRhID0gJyc7XHJcbiAgICAgICAgbGV0IGdldFggPSAobikgPT4gey8vZih4KG4pKT0gc3VtIG9mIHgoMSkgLi4uLiB4KG4pXHJcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IDA7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgaW4gcHJvYmFiaWxpdGllcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKG4gPT0gaSkgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9ICh2YWx1ZSAvIDEwICsgcHJvYmFiaWxpdGllc1tpXSAvIDEwKSAqIDEwMCAvIDEwOy8vaGFuZGxlIHRoZSBKUyBkZWNpbWFsIHByb2JsZW1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBsKDApID0gMCwgdSgwKSA9IDAsIGZ4KDApID0gMFxyXG4gICAgICAgIGxldCBib3VuZHMgPSBbeyBsOiAwLCB1OiAxIH1dO1xyXG5cclxuICAgICAgICBsZXQgbG93ZXJOID0gKG4pID0+IHsvL2xvd2VyIGxpbWl0IG9mIG4gbChuKSA9IGwobi0xKSArICh1KG4tMSkgLSBsKG4tMSkpICogZih4KG4tMSkpXHJcbiAgICAgICAgICAgIGxldCBib3VuZCA9IGJvdW5kc1tuXTtcclxuICAgICAgICAgICAgbGV0IGwgPSBib3VuZC5sICsgKChib3VuZC51IC0gYm91bmQubCkgKiBnZXRYKGRhdGFbbl0gLSAxKSk7XHJcbiAgICAgICAgICAgIHJldHVybiBsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHVwcGVyTiA9IChuKSA9PiB7Ly9sb3dlciBsaW1pdCBvZiBuIHUobikgPSBsKG4tMSkgKyAodShuLTEpIC0gbChuLTEpKSAqIGYoeChuKSlcclxuICAgICAgICAgICAgbGV0IGJvdW5kID0gYm91bmRzW25dO1xyXG4gICAgICAgICAgICBsZXQgdSA9IGJvdW5kLmwgKyAoKGJvdW5kLnUgLSBib3VuZC5sKSAqIGdldFgoZGF0YVtuXSkpO1xyXG4gICAgICAgICAgICByZXR1cm4gdTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBjb3VudCA9IDAsIGNvbXBsZXRlID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHdoaWxlICghY29tcGxldGUpIHsvL3J1biB1bnRpbCBhbGwgdGhlIGNvZGVzIGFyZSBmb3VuZFxyXG4gICAgICAgICAgICBsZXQgZm91bmQgPSBmYWxzZSwgeCA9IDEsIG4gPSB7fTtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlICghZm91bmQpIHsvLyBmb3IgZWFjaCBuZXcgY29kZVxyXG4gICAgICAgICAgICAgICAgbGV0IGwgPSBsb3dlck4oY291bnQsIHgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHUgPSB1cHBlck4oY291bnQsIHgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbXBsZXRlID0gKGwgPj0gdGFnICYmIHRhZyA8PSB1KTtcclxuICAgICAgICAgICAgICAgIGlmIChjb21wbGV0ZSkgYnJlYWs7Ly9pZiBhbGwgaXMgZm91bmQgc3RvcCBydW5uaW5nXHJcblxyXG4gICAgICAgICAgICAgICAgZm91bmQgPSAobCA8IHRhZyAmJiB0YWcgPCB1KTsvL2NoZWNrIGlmIGl0IHNhY3Rpc2ZpZXMgdGhlIGNvbmRpdGlvbnNcclxuICAgICAgICAgICAgICAgIG4gPSB7IGwsIHUsIHggfTtcclxuICAgICAgICAgICAgICAgIHgrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoY29tcGxldGUpIGJyZWFrO1xyXG4gICAgICAgICAgICBjb3VudCsrO1xyXG5cclxuICAgICAgICAgICAgYm91bmRzLnB1c2gobik7Ly9hZGQgY29kZVxyXG4gICAgICAgICAgICBkYXRhICs9IG4ueDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5lbmNvZGVEaWFncmFtID0gKGRhdGEgPSAnJywgZGljdGlvbmFyeSA9IHt9KSA9PiB7Ly9kYWlncmFtIGNvZGluZ1xyXG4gICAgICAgIGxldCBpO1xyXG4gICAgICAgIGxldCBjb2RlV29yZCA9ICcnO1xyXG4gICAgICAgIGxldCBlbmNvZGUgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBmaXJzdCA9IGRhdGFbaV07Ly90YWtlIHR3byBhdCBhIHRpbWVcclxuICAgICAgICAgICAgbGV0IHNlY29uZCA9IGRhdGFbaSArIDFdO1xyXG4gICAgICAgICAgICBsZXQgc3ltYm9sID0gZmlyc3QgKyBzZWNvbmQ7XHJcblxyXG4gICAgICAgICAgICBsZXQgY29kZTtcclxuICAgICAgICAgICAgaWYgKGRpY3Rpb25hcnlbc3ltYm9sXSAhPSB1bmRlZmluZWQpIHsvL2lzIHN5bWJvbCBpbiBkaWN0aW9uYXJ5XHJcbiAgICAgICAgICAgICAgICBjb2RlID0gZGljdGlvbmFyeVtzeW1ib2xdO1xyXG4gICAgICAgICAgICAgICAgaSsrOy8vc2V0IGNvdW50IHRvIGtub3cgaXQgcmVhZCB0d29cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvZGUgPSBkaWN0aW9uYXJ5W2ZpcnN0XTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGNvZGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb2RlV29yZCArPSBlbmNvZGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBjb2RlV29yZDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmVuY29kZUxaMSA9IChkYXRhID0gJycsIHBhcmFtcyA9IHsgd2luZG93U2l6ZTogMCwgc2VhcmNoU2l6ZTogMCwgbG9va0FoZWFkU2l6ZTogMCB9KSA9PiB7Ly9MWjcvL0xaMS8vU2xpZGluZyB3aW5kb3dcclxuICAgICAgICBpZiAocGFyYW1zLndpbmRvd1NpemUgPT0gdW5kZWZpbmVkKSBwYXJhbXMud2luZG93U2l6ZSA9IHBhcmFtcy5zZWFyY2hTaXplICsgcGFyYW1zLmxvb2tBaGVhZFNpemU7Ly9pbml0IHRoZSB3aW5kb3csIHNlYXJjaCBhbmQgbG9va2FoZWFkIHNpemVzXHJcbiAgICAgICAgaWYgKHBhcmFtcy5zZWFyY2hTaXplID09IHVuZGVmaW5lZCkgcGFyYW1zLnNlYXJjaFNpemUgPSBwYXJhbXMud2luZG93U2l6ZSAtIHBhcmFtcy5sb29rQWhlYWRTaXplO1xyXG4gICAgICAgIGlmIChwYXJhbXMubG9va0FoZWFkU2l6ZSA9PSB1bmRlZmluZWQpIHBhcmFtcy5sb29rQWhlYWRTaXplID0gcGFyYW1zLndpbmRvd1NpemUgLSBwYXJhbXMuc2VhcmNoU2l6ZTtcclxuXHJcblxyXG4gICAgICAgIGxldCBpID0gMCwgbG9va0FoZWFkU3RvcCwgc2VhcmNoU3RvcCwgbG9va0FoZWFkQnVmZmVyLCBzZWFyY2hCdWZmZXI7Ly9pbml0IHRoZSBidWZmZXJzIGFuZCBsb2NhdGlvbnNcclxuXHJcbiAgICAgICAgbGV0IGdldFRyaXBsZXQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCB4ID0gbG9va0FoZWFkQnVmZmVyWzBdO1xyXG4gICAgICAgICAgICBsZXQgcGlja2VkID0geyBvOiAwLCBsOiAwLCBjOiB4IH07Ly9zZXQgdGhlIHRyaXBsZXQgPG8sIGwsIGMobik+XHJcblxyXG4gICAgICAgICAgICBpZiAoc2VhcmNoQnVmZmVyLmluY2x1ZGVzKHgpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZm91bmRNYXRjaGVzID0gW107Ly9zdG9yYWdlIGZvciB0aGUgbWF0Y2hlc1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSBpbiBzZWFyY2hCdWZmZXIpIHsvL2ZpbmQgYWxsIHRoZSBtYXRjaGVzIGluIHNlYXJjaCBidWZmZXJcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VhcmNoQnVmZmVyW2ldID09IHBpY2tlZC5jKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW5kZXhJbkRhdGEgPSArc2VhcmNoU3RvcCArICtpLC8vdGhpcyBpcyB0aGUgam9pbnQgb2YgdGhlIHNlYXJjaCBhbmQgbG9va0FoZWFkIGJ1ZmZlcnNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4SW5Mb29rQWhlYWQgPSAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQgPSAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hpbmcgPSB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hlZCA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAobWF0Y2hpbmcpIHsvL2tlZXAgZ2V0dGluZyB0aGUgbWF0Y2hlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hlZC5wdXNoKGRhdGFbaW5kZXhJbkRhdGFdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRjaGluZyA9IGxvb2tBaGVhZEJ1ZmZlcltpbmRleEluTG9va0FoZWFkICsgY291bnRdID09PSBkYXRhW2luZGV4SW5EYXRhICsgY291bnRdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kTWF0Y2hlcy5wdXNoKHsgbzogc2VhcmNoQnVmZmVyLmxlbmd0aCAtIGksIGw6IG1hdGNoZWQubGVuZ3RoLCBjOiBsb29rQWhlYWRCdWZmZXJbbWF0Y2hlZC5sZW5ndGhdIH0pOy8vc2F2ZSBtYXRjaGVzXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHBpY2tlZCA9IGZvdW5kTWF0Y2hlc1swXTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHkgb2YgZm91bmRNYXRjaGVzKSB7Ly9nZXQgdGhlIG1hdGNoIHdpdGggbW9zdCBzaXplIGFuZCBjbG9zZXN0IHRvIHRoZSBsb29rQWhlYWQgYnVmZmVyXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBpY2tlZC5sIDwgeS5sKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpY2tlZCA9IHk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHBpY2tlZC5sID09IHkubCAmJiBwaWNrZWQubyA+IHkubykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwaWNrZWQgPSB5O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaSArPSBwaWNrZWQubDtcclxuICAgICAgICAgICAgcmV0dXJuIHBpY2tlZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBsaXN0ID0gW107XHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgc2VhcmNoU3RvcCA9IGkgLSBwYXJhbXMuc2VhcmNoU2l6ZTtcclxuICAgICAgICAgICAgaWYgKHNlYXJjaFN0b3AgPCAwKSBzZWFyY2hTdG9wID0gMDtcclxuICAgICAgICAgICAgbG9va0FoZWFkU3RvcCA9IGkgKyBwYXJhbXMubG9va0FoZWFkU2l6ZTtcclxuICAgICAgICAgICAgc2VhcmNoQnVmZmVyID0gZGF0YS5zbGljZShzZWFyY2hTdG9wLCBpKS5zcGxpdCgnJyk7XHJcbiAgICAgICAgICAgIGxvb2tBaGVhZEJ1ZmZlciA9IGRhdGEuc2xpY2UoaSwgbG9va0FoZWFkU3RvcCkuc3BsaXQoJycpO1xyXG4gICAgICAgICAgICBsaXN0LnB1c2goZ2V0VHJpcGxldCgpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBsaXN0O1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZGVjb2RlTFoxID0gKHRyaXBsZXRzID0gW3sgbzogMCwgbDogMCwgYzogJycgfV0sIHBhcmFtcyA9IHsgd2luZG93U2l6ZTogMCwgc2VhcmNoU2l6ZTogMCwgbG9va0FoZWFkU2l6ZTogMCB9KSA9PiB7XHJcbiAgICAgICAgbGV0IHdvcmQgPSAnJztcclxuXHJcbiAgICAgICAgaWYgKHBhcmFtcy53aW5kb3dTaXplID09IHVuZGVmaW5lZCkgcGFyYW1zLndpbmRvd1NpemUgPSBwYXJhbXMuc2VhcmNoU2l6ZSArIHBhcmFtcy5sb29rQWhlYWRTaXplOy8vaW5pdCB0aGUgd2luZG93LCBzZWFyY2ggYW5kIGxvb2thaGVhZCBzaXplc1xyXG4gICAgICAgIGlmIChwYXJhbXMuc2VhcmNoU2l6ZSA9PSB1bmRlZmluZWQpIHBhcmFtcy5zZWFyY2hTaXplID0gcGFyYW1zLndpbmRvd1NpemUgLSBwYXJhbXMubG9va0FoZWFkU2l6ZTtcclxuICAgICAgICBpZiAocGFyYW1zLmxvb2tBaGVhZFNpemUgPT0gdW5kZWZpbmVkKSBwYXJhbXMubG9va0FoZWFkU2l6ZSA9IHBhcmFtcy53aW5kb3dTaXplIC0gcGFyYW1zLnNlYXJjaFNpemU7XHJcblxyXG4gICAgICAgIGZvciAobGV0IHQgb2YgdHJpcGxldHMpIHsvL2RlY29kZSBlYWNoIHRyaXBsZXRcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0Lmw7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgd29yZCArPSAod29yZFt3b3JkLmxlbmd0aCAtIHQub10pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHdvcmQgKz0gKHQuYyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gd29yZDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmVuY29kZUxaMiA9IChkYXRhID0gJycpID0+IHsvL0xaOC8vTFoyXHJcbiAgICAgICAgbGV0IGR1cGxldHMgPSBbXTsvL2luaXQgZHVwbGV0IGxpc3RcclxuICAgICAgICBsZXQgZW50cmllcyA9IFtdOy8vaW5pdCBkaWN0aW9uYXJ5XHJcbiAgICAgICAgbGV0IGksIGxhc3RJbmRleDtcclxuXHJcbiAgICAgICAgbGV0IGdldFJhbmdlID0gKHJhbmdlKSA9PiB7Ly9nZXQgdGhlIHN5bWJvbHMgd2l0aGluIHRoZSByYW5nZVxyXG4gICAgICAgICAgICBsZXQgdmFsdWUgPSAnJztcclxuICAgICAgICAgICAgZm9yIChsZXQgciBvZiByYW5nZSkge1xyXG4gICAgICAgICAgICAgICAgdmFsdWUgKz0gZGF0YVtyXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgZW5jb2RlID0gKHJhbmdlKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBlID0gZ2V0UmFuZ2UocmFuZ2UpOy8vZ2V0IHRoZSB2YWx1ZSBvZiB0aGUgcmFuZ2VcclxuICAgICAgICAgICAgbGV0IGluZGV4ID0gZW50cmllcy5pbmRleE9mKGUpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGQgPSB7IGk6IGxhc3RJbmRleCwgYzogZVtlLmxlbmd0aCAtIDFdIH07Ly9jcmVhdGUgZHVwbGV0XHJcbiAgICAgICAgICAgIGlmIChpbmRleCA9PSAtMSkgey8vY3VycmVudCBncm91cCBvZiBzeW1ib2xzIGlzIGluIG5vdCBpbiB0aGUgZGljdGlvbmFyeVxyXG4gICAgICAgICAgICAgICAgZW50cmllcy5wdXNoKGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmFuZ2UucHVzaCgrK2kpO1xyXG4gICAgICAgICAgICAgICAgbGFzdEluZGV4ID0gaW5kZXggKyAxO1xyXG4gICAgICAgICAgICAgICAgZCA9IGVuY29kZShyYW5nZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGFzdEluZGV4ID0gMDtcclxuICAgICAgICAgICAgZHVwbGV0cy5wdXNoKGVuY29kZShbaV0pKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBkdXBsZXRzO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZGVjb2RlTFoyID0gKGR1cGxldHMgPSBbeyBpOiAwLCBjOiAnJyB9XSkgPT4ge1xyXG4gICAgICAgIGxldCBlbnRyaWVzID0gW107Ly9pbml0IGRpY3Rpb25hcnlcclxuICAgICAgICBsZXQgYztcclxuXHJcbiAgICAgICAgZm9yIChsZXQgZCBvZiBkdXBsZXRzKSB7Ly9kZWNvZGUgZWFjaCBkdXBsZXRcclxuICAgICAgICAgICAgYyA9ICcnO1xyXG4gICAgICAgICAgICBpZiAoZC5pICE9IDApIHtcclxuICAgICAgICAgICAgICAgIGMgPSBlbnRyaWVzW2QuaSAtIDFdOy8vZ2V0IHRoZSBjb2RlIGZyb20gdGhlIGRpY3Rpb25hcnlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjICs9IGQuYztcclxuICAgICAgICAgICAgZW50cmllcy5wdXNoKGMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGVudHJpZXMuam9pbignJyk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5lbmNvZGVMWlcgPSAoZGF0YSA9ICcnLCBpbml0RGljdGlvbmFyeSA9IFtdKSA9PiB7XHJcbiAgICAgICAgbGV0IGNvZGVXb3JkID0gW10sIGxhc3RJbmRleCwgaTtcclxuICAgICAgICBsZXQgZW50cmllcyA9IEFycmF5LmZyb20oaW5pdERpY3Rpb25hcnkpO1xyXG5cclxuICAgICAgICBsZXQgZ2V0UmFuZ2UgPSAocmFuZ2UpID0+IHsvLyBnZXQgdGhlIHZhbHVlcyB3aXRoaW4gdGhlIHJhbmdlXHJcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9ICcnO1xyXG4gICAgICAgICAgICBmb3IgKGxldCByIG9mIHJhbmdlKSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSArPSBkYXRhW3JdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBlbmNvZGUgPSAocmFuZ2UpID0+IHtcclxuICAgICAgICAgICAgbGV0IGUgPSBnZXRSYW5nZShyYW5nZSk7XHJcbiAgICAgICAgICAgIGxldCBpbmRleCA9IGVudHJpZXMuaW5kZXhPZihlKTtcclxuICAgICAgICAgICAgaWYgKGluZGV4ID09IC0xKSB7Ly9pcyB2YWx1ZSBub3QgaW4gZGljdGlvbmFyeT9cclxuICAgICAgICAgICAgICAgIGVudHJpZXMucHVzaChlKTsvL2FkZCBpdCBhbmQgc2V0IHRoZSBjb3VudGVyIHRvIHRoZSBsYXN0IHJlYWQgc3ltYm9sXHJcbiAgICAgICAgICAgICAgICBpbmRleCA9IDA7XHJcbiAgICAgICAgICAgICAgICBpLS07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpKys7Ly9zZXQgdGhlIGNvdW50ZXIgdG8gdGhlIG5leHQgc3ltYm9sIGFuZCB0cnkgZW5jb2RpbmcgdGhlIHJhbmdlXHJcbiAgICAgICAgICAgICAgICByYW5nZS5wdXNoKGkpO1xyXG4gICAgICAgICAgICAgICAgbGFzdEluZGV4ID0gaW5kZXggKz0gMTsvL3NldCB0aGUgbGFzdCByZWFkIGluZGV4LCB0aGlzIGlzIHRoZSBjb2RlXHJcbiAgICAgICAgICAgICAgICBlID0gZW5jb2RlKHJhbmdlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbGFzdEluZGV4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGFzdEluZGV4ID0gMDtcclxuICAgICAgICAgICAgbGV0IGNvZGUgPSBlbmNvZGUoW2ldKTtcclxuICAgICAgICAgICAgaWYgKGNvZGUgIT0gdW5kZWZpbmVkKSB7Ly9jb2RlIHdhcyBjcmVhdGVkXHJcbiAgICAgICAgICAgICAgICBjb2RlV29yZC5wdXNoKGNvZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gY29kZVdvcmQ7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5kZWNvZGVMWlcgPSAoc2luZ2xldG9uID0gW10sIGluaXREaWN0aW9uYXJ5ID0gW10pID0+IHtcclxuICAgICAgICBsZXQgd29yZCA9ICcnLCBjb2RlV29yZCA9IFtdLCBzdGF0ZSwgY291bnQgPSAwLCByZWJ1aWxkID0gZmFsc2UsIGJ1aWxkV2l0aCA9ICcnLCBpLCBzdGFydCA9IDA7XHJcbiAgICAgICAgbGV0IGVudHJpZXMgPSBBcnJheS5mcm9tKGluaXREaWN0aW9uYXJ5KTtcclxuXHJcbiAgICAgICAgbGV0IGdldENvZGUgPSAocmFuZ2UpID0+IHsvL2dldCB0aGUgY29kZSB3aXRoaW4gdGhlIHJhbmdlXHJcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9ICcnO1xyXG4gICAgICAgICAgICBjb3VudCA9IDA7XHJcbiAgICAgICAgICAgIGJ1aWxkV2l0aCA9ICcnO1xyXG4gICAgICAgICAgICBmb3IgKGxldCByIG9mIHJhbmdlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAod29yZFtyXSA9PSB1bmRlZmluZWQpIHsvL2l0IGlzIG5vdCBjb21wbGV0ZVxyXG4gICAgICAgICAgICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVidWlsZCA9IHRydWU7Ly9zZXQgdG8gcmVidWlsZFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnVpbGRXaXRoICs9IHdvcmRbcl07Ly9zZXQgdG8gcmVidWlsZCB3aXRoIGluY2FzZSBvZiBub3QgY29tcGxldGVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhbHVlICs9IHdvcmRbcl07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGRlY29kZSA9IChyYW5nZSA9IFtdKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBlID0gZ2V0Q29kZShyYW5nZSk7XHJcbiAgICAgICAgICAgIGxldCBpbmRleCA9IGVudHJpZXMuaW5kZXhPZihlKTtcclxuICAgICAgICAgICAgaWYgKGluZGV4ID09IC0xKSB7Ly9pcyBub3QgaW4gZGljdGlvbmFyeT9cclxuICAgICAgICAgICAgICAgIGVudHJpZXMucHVzaChlKTtcclxuICAgICAgICAgICAgICAgIGktLTsvL3NldCB0aGUgY291bnRlciB0byB0aGUgbGFzdCBzeW1ib2wgcmVhZFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgKytpO1xyXG4gICAgICAgICAgICAgICAgcmFuZ2UucHVzaChpKTtcclxuICAgICAgICAgICAgICAgIGRlY29kZShyYW5nZSk7Ly9hZGQgbmV4dCBzeW1ib2wgYW5kIGRlY29kZSBhZ2FpblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGJ1aWxkID0gKHN0YXRlKSA9PiB7Ly9idWlsZCB1cCB0aGUgZGljdGlvbmFyeSBmcm9tIHRoZSBkZWNvZGVkIHZhbHVlc1xyXG4gICAgICAgICAgICBmb3IgKGkgPSBzdGFydDsgaSA8IHdvcmQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBlID0gZGVjb2RlKFtpXSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZW50cmllcy5sZW5ndGggPT0gc3RhdGUpIHsvL3N0b3AgYXQgdGhlIGN1cnJlbnQgZGVjb2RpbmcgcG9pbnRcclxuICAgICAgICAgICAgICAgICAgICBzdGFydCA9IGkgKyAxIC0gY291bnQ7Ly9zZXQgbmV4dCBzdGFydGluZyBwb2ludCBhdCB0aGUgY3VycmVudCBzdG9wXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IHMgb2Ygc2luZ2xldG9uKSB7XHJcbiAgICAgICAgICAgIGxldCBlID0gZW50cmllc1tzIC0gMV07XHJcbiAgICAgICAgICAgIGlmIChlID09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgYnVpbGQocyk7Ly9idWlsZCB0aGUgZGljdGlvbmFyeVxyXG4gICAgICAgICAgICAgICAgZSA9IGVudHJpZXNbcyAtIDFdO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb2RlV29yZC5wdXNoKGUpO1xyXG4gICAgICAgICAgICB3b3JkID0gY29kZVdvcmQuam9pbignJyk7XHJcblxyXG4gICAgICAgICAgICBpZiAocmVidWlsZCkgey8vcmVidWlsZCB0aGUgbGFzdCBlbnRyeSBpbiB0aGUgZGljdGlvbmFyeSBcclxuICAgICAgICAgICAgICAgIHJlYnVpbGQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykgey8va2VlcCBhZGQgaXRlbXMgdG8gdGhlIGJ1aWxkd2l0aCB0byB0aGUgYnVpbGR3aXRoIHVudGlsIGl0IGlzIGNvbXBsZXRlXHJcbiAgICAgICAgICAgICAgICAgICAgYnVpbGRXaXRoICs9IGJ1aWxkV2l0aFtpXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvZGVXb3JkLnBvcCgpOy8vc2V0IGxhc3QgYnVpbHQgYW5kIGxhc3QgZGVjb2RlZCB0byB0aGUgbmV3IGJ1aWxkXHJcbiAgICAgICAgICAgICAgICBjb2RlV29yZC5wdXNoKGJ1aWxkV2l0aCk7XHJcbiAgICAgICAgICAgICAgICBlbnRyaWVzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgZW50cmllcy5wdXNoKGJ1aWxkV2l0aCk7XHJcbiAgICAgICAgICAgICAgICBzdGFydCArPSBjb3VudDsvL3NldCB0aGUgbmV4dCBidWlsZCBzdGFydGluZyBwb2ludFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gd29yZDtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDb21wcmVzc2lvbjtcclxuIiwiY29uc3QgT2JqZWN0c0xpYnJhcnkgPSByZXF1aXJlKCcuL09iamVjdHNMaWJyYXJ5Jyk7XHJcbmxldCBvYmplY3RMaWJyYXJ5ID0gbmV3IE9iamVjdHNMaWJyYXJ5KCk7XHJcblxyXG5mdW5jdGlvbiBJbmRleGVkTGlicmFyeShuYW1lLCB2ZXJzaW9uKSB7XHJcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgdGhpcy52ZXJzaW9uID0gdmVyc2lvbjtcclxuICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSBmYWxzZTtcclxuICAgIHRoaXMuaW5kZXhlZERCID0gd2luZG93LmluZGV4ZWREQiB8fCB3aW5kb3cubW96SW5kZXhlZERCIHx8IHdpbmRvdy53ZWJraXRJbmRleGVkREIgfHwgd2luZG93Lm1zSW5kZXhlZERCO1xyXG4gICAgdGhpcy5JREJUcmFuc2FjdGlvbiA9IHdpbmRvdy5JREJUcmFuc2FjdGlvbiB8fCB3aW5kb3cud2Via2l0SURCVHJhbnNhY3Rpb24gfHwgd2luZG93Lm1zSURCVHJhbnNhY3Rpb247XHJcbiAgICB0aGlzLklEQktleVJhbmdlID0gd2luZG93LklEQktleVJhbmdlIHx8IHdpbmRvdy53ZWJraXRJREJLZXlSYW5nZSB8fCB3aW5kb3cubXNJREJLZXlSYW5nZTtcclxuXHJcbiAgICB0aGlzLmluaXQgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHsvL2luaXRpYWxpemUgZGIgYnkgc2V0dGluZyB0aGUgY3VycmVudCB2ZXJzaW9uXHJcbiAgICAgICAgY29uc3QgcmVxdWVzdCA9IHRoaXMuaW5kZXhlZERCLm9wZW4odGhpcy5uYW1lKTtcclxuICAgICAgICByZXF1ZXN0Lm9udXBncmFkZW5lZWRlZCA9IChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgIChjYWxsYmFjayhldmVudC50YXJnZXQucmVzdWx0KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudmVyc2lvbiA9IE1hdGguZmxvb3IocmVxdWVzdC5yZXN1bHQudmVyc2lvbikgfHwgTWF0aC5mbG9vcih0aGlzLnZlcnNpb24pO1xyXG4gICAgICAgICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlcXVlc3Qub25lcnJvciA9IChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhldmVudC50YXJnZXQuZXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmdldFZlcnNpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcmVxdWVzdCA9IHRoaXMuaW5kZXhlZERCLm9wZW4odGhpcy5uYW1lKTtcclxuICAgICAgICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnZlcnNpb24gPT0gdW5kZWZpbmVkIHx8IHRoaXMudmVyc2lvbiA8IHJlcXVlc3QucmVzdWx0LnZlcnNpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZlcnNpb24gPSByZXF1ZXN0LnJlc3VsdC52ZXJzaW9uO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVxdWVzdC5yZXN1bHQuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUodGhpcy52ZXJzaW9uKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5vbmVycm9yID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5vcGVuID0gYXN5bmMgZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgaWYgKHRoaXMudmVyc2lvbiA9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5nZXRWZXJzaW9uKCk7Ly9zZXQgdGhlIHZlcnNpb24gaWYgbm90IHNldFxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCByZXF1ZXN0ID0gdGhpcy5pbmRleGVkREIub3Blbih0aGlzLm5hbWUsIHRoaXMudmVyc2lvbik7Ly9vcGVuIGRiXHJcbiAgICAgICAgICAgIHJlcXVlc3Qub251cGdyYWRlbmVlZGVkID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZlcnNpb24gPSByZXF1ZXN0LnJlc3VsdC52ZXJzaW9uOy8vdXBkYXRlIHZlcnNpb24gYWZ0ZXIgdXBncmFkZVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT0gJ2Z1bmN0aW9uJykgey8vcnVuIHRoZSBjYWxsYmFjayBpZiBzZXRcclxuICAgICAgICAgICAgICAgICAgICBsZXQgd29ya2VkRGIgPSBjYWxsYmFjayhldmVudC50YXJnZXQucmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICB3b3JrZWREYi5vbmVycm9yID0gd29ya2VkRXZlbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3Qod29ya2VkRXZlbnQudGFyZ2V0LmVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKGV2ZW50LnRhcmdldC5yZXN1bHQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0Lm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jb2xsZWN0aW9uRXhpc3RzID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24pIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcGVuKCkudGhlbihkYiA9PiB7XHJcbiAgICAgICAgICAgIGxldCBleGlzdHMgPSBkYi5vYmplY3RTdG9yZU5hbWVzLmNvbnRhaW5zKGNvbGxlY3Rpb24pOy8vY2hlY2sgaWYgZGIgaGFzIHRoaXMgY29sbGVjdGlvbiBpbiBvYmplY3RzdG9yZVxyXG4gICAgICAgICAgICByZXR1cm4gZXhpc3RzO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY3JlYXRlQ29sbGVjdGlvbiA9IGFzeW5jIGZ1bmN0aW9uICguLi5jb2xsZWN0aW9ucykge1xyXG4gICAgICAgIGxldCB2ZXJzaW9uID0gYXdhaXQgdGhpcy5nZXRWZXJzaW9uKCk7Ly91cGdyYWRlIGNvbGxlY3Rpb25cclxuICAgICAgICB0aGlzLnZlcnNpb24gPSB2ZXJzaW9uICsgMTtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcGVuKGRiID0+IHtcclxuICAgICAgICAgICAgZm9yIChsZXQgY29sbGVjdGlvbiBvZiBjb2xsZWN0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFkYi5vYmplY3RTdG9yZU5hbWVzLmNvbnRhaW5zKGNvbGxlY3Rpb24pKSB7Ly9jcmVhdGUgbmV3IGNvbGxlY3Rpb24gYW5kIHNldCBfaWQgYXMgdGhlIGtleXBhdGhcclxuICAgICAgICAgICAgICAgICAgICBkYi5jcmVhdGVPYmplY3RTdG9yZShjb2xsZWN0aW9uLCB7IGtleVBhdGg6ICdfaWQnIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBkYjtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmZpbmQgPSBmdW5jdGlvbiAocGFyYW1zKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5vcGVuKCkudGhlbihkYiA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZG9jdW1lbnRzID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGRiLm9iamVjdFN0b3JlTmFtZXMuY29udGFpbnMocGFyYW1zLmNvbGxlY3Rpb24pKSB7Ly9jb2xsZWN0aW9uIGV4aXN0c1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB0cmFuc2FjdGlvbiA9IGRiLnRyYW5zYWN0aW9uKHBhcmFtcy5jb2xsZWN0aW9uLCAncmVhZG9ubHknKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNhY3Rpb24ub25lcnJvciA9IGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGIuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB0cmFuc2FjdGlvbi5vbmNvbXBsZXRlID0gZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFyYW1zLm1hbnkgPT0gdHJ1ZSkgey8vbWFueSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRiLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGRvY3VtZW50cyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYi5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkb2N1bWVudHNbMF0pOy8vc2luZ2xlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzdG9yZSA9IHRyYW5zYWN0aW9uLm9iamVjdFN0b3JlKHBhcmFtcy5jb2xsZWN0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcmVxdWVzdCA9IHN0b3JlLm9wZW5DdXJzb3IoKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgY3Vyc29yO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0Lm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGIuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJzb3IgPSBldmVudC50YXJnZXQucmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3Vyc29yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFyYW1zLnF1ZXJ5ID09IHVuZGVmaW5lZCkgey8vZmluZCBhbnlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudHMucHVzaChjdXJzb3IudmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAob2JqZWN0TGlicmFyeS5pc1N1Yk9iamVjdChjdXJzb3IudmFsdWUsIHBhcmFtcy5xdWVyeSkpIHsvL2ZpbmQgc3BlY2lmaWNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudHMucHVzaChjdXJzb3IudmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yLmNvbnRpbnVlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmFtcy5tYW55ID09IHRydWUpIHsvL21hbnkgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRiLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZG9jdW1lbnRzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRiLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZG9jdW1lbnRzWzBdKTsvL3NpbmdsZVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgZGIuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZW1wdHlDb2xsZWN0aW9uID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24pIHtcclxuICAgICAgICBsZXQgcmVtb3ZlZENvdW50ID0gMCwgZm91bmRDb3VudCA9IDA7Ly9zZXQgdGhlIGNvdW50ZXJzXHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5maW5kKHsgY29sbGVjdGlvbiwgcXVlcnk6IHt9LCBtYW55OiB0cnVlIH0pLnRoZW4oZm91bmQgPT4gey8vZmluZCBhbGwgZG9jdW1lbnRzXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9wZW4oKS50aGVuKGRiID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGIub2JqZWN0U3RvcmVOYW1lcy5jb250YWlucyhjb2xsZWN0aW9uKSkgey8vaGFuZGxlIGNvbGxlY3Rpb24gbm9uLWV4aXN0ZW5jZSBlcnJvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdHJhbnNhY3Rpb24gPSBkYi50cmFuc2FjdGlvbihjb2xsZWN0aW9uLCAncmVhZHdyaXRlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzdG9yZSA9IHRyYW5zYWN0aW9uLm9iamVjdFN0b3JlKGNvbGxlY3Rpb24pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNhY3Rpb24ub25lcnJvciA9IGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRiLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNhY3Rpb24ub25jb21wbGV0ZSA9IGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRiLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHsgYWN0aW9uOiAnZW1wdHljb2xsZWN0aW9uJywgcmVtb3ZlZENvdW50LCBvazogcmVtb3ZlZENvdW50ID09IGZvdW5kQ291bnQgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZm91bmRDb3VudCA9IGZvdW5kLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgZGF0YSBvZiBmb3VuZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSBzdG9yZS5kZWxldGUoZGF0YS5faWQpOy8vZGVsZXRlIGVhY2ggZG9jdW1lbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3Qub25lcnJvciA9IGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgRXJyb3Igd2hpbGUgZGVsZXRpbmcgZG9jdW1lbnRzID0+ICR7ZXZlbnQudGFyZ2V0LmVycm9yfWApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZWRDb3VudCsrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYi5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHsgcmVtb3ZlZENvdW50LCBvazogcmVtb3ZlZENvdW50ID09IGZvdW5kQ291bnQgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGRiLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KS5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICBkYi5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmRvY3VtZW50RXhpc3RzID0gZnVuY3Rpb24gKHBhcmFtcykge1xyXG4gICAgICAgIGRlbGV0ZSBwYXJhbXMubWFueTsvL2NoZWNrIGZvciBvbmx5IG9uZVxyXG4gICAgICAgIHJldHVybiB0aGlzLmZpbmQocGFyYW1zKS50aGVuKHJlcyA9PiB7Ly9cclxuICAgICAgICAgICAgcmV0dXJuIHJlcyAhPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5nZW5lcmF0ZUlkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGxldCBpZCA9IERhdGUubm93KCkudG9TdHJpbmcoMzYpICsgTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc2xpY2UoMikgKyBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zbGljZSgyKTsvL2dlbmVyYXRlIHRoZSBpZCB1c2luZyB0aW1lXHJcbiAgICAgICAgcmV0dXJuIGlkO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY2hlY2tJZCA9IGZ1bmN0aW9uIChyZXF1ZXN0LCBfaWQsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBfaWQgIT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgX2lkID0gdGhpcy5nZW5lcmF0ZUlkKCk7Ly9nZXQgbmV3IF9pZCBpZiBub3Qgc2V0XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBnZXQgPSByZXF1ZXN0LmdldChfaWQpOy8vY2hlY2sgaWYgZXhpc3RpbmdcclxuICAgICAgICBnZXQub25zdWNjZXNzID0gZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXZlbnQudGFyZ2V0LnJlc3VsdCAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tJZChyZXF1ZXN0LCBfaWQsIGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKF9pZCk7Ly91c2UgdGhlIF9pZFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQub25lcnJvciA9IGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coYEVycm9yIGNoZWNraW5nIElEID0+ICR7ZXZlbnQudGFyZ2V0LmVycm9yfWApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmFkZCA9IGZ1bmN0aW9uIChwYXJhbXMsIGRiKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IHRyYW5zYWN0aW9uID0gZGIudHJhbnNhY3Rpb24ocGFyYW1zLmNvbGxlY3Rpb24sICdyZWFkd3JpdGUnKTtcclxuICAgICAgICAgICAgdHJhbnNhY3Rpb24ub25lcnJvciA9IChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZGIuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICB0cmFuc2FjdGlvbi5vbmNvbXBsZXRlID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkYi5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh7IGFjdGlvbjogJ2luc2VydCcsIGRvY3VtZW50czogcGFyYW1zLnF1ZXJ5IH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgcmVxdWVzdCA9IHRyYW5zYWN0aW9uLm9iamVjdFN0b3JlKHBhcmFtcy5jb2xsZWN0aW9uKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChwYXJhbXMubWFueSA9PSB0cnVlICYmIEFycmF5LmlzQXJyYXkocGFyYW1zLnF1ZXJ5KSkgey8vIGZvciBtYW55XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBxdWVyeSBvZiBwYXJhbXMucXVlcnkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoZWNrSWQocmVxdWVzdCwgcXVlcnkuX2lkLCBfaWQgPT4gey8vdmFsaWRhdGUgX2lkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5Ll9pZCA9IF9pZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdC5hZGQocXVlcnkpOy8vYWRkXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrSWQocmVxdWVzdCwgcGFyYW1zLnF1ZXJ5Ll9pZCwgX2lkID0+IHsvL3ZhbGlkYXRlIF9pZFxyXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcy5xdWVyeS5faWQgPSBfaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdC5hZGQocGFyYW1zLnF1ZXJ5KTsvL2FkZFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmluc2VydCA9IGFzeW5jIGZ1bmN0aW9uIChwYXJhbXMpIHtcclxuICAgICAgICBsZXQgaXNDb2xsZWN0aW9uID0gYXdhaXQgdGhpcy5jb2xsZWN0aW9uRXhpc3RzKHBhcmFtcy5jb2xsZWN0aW9uKTtcclxuICAgICAgICBpZiAoaXNDb2xsZWN0aW9uKSB7Ly9jb2xsZWN0aW9uIGlzIGV4aXN0aW5nXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9wZW4oKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZGIgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFkZChwYXJhbXMsIGRiKTsvL2FkZCB0byBjb2xsZWN0aW9uXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXJyb3I7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZUNvbGxlY3Rpb24ocGFyYW1zLmNvbGxlY3Rpb24pLy9jcmVhdGUgY29sbGVjdGlvblxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZGIgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFkZChwYXJhbXMsIGRiKTsvL2FkZCB0byBuZXcgQ29sbGVjdGlvblxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVycm9yO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudXBkYXRlID0gZnVuY3Rpb24gKHBhcmFtcykge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMub3BlbigpLnRoZW4oZGIgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFkYi5vYmplY3RTdG9yZU5hbWVzLmNvbnRhaW5zKHBhcmFtcy5jb2xsZWN0aW9uKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRiLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KCdDb2xsZWN0aW9uIG5vdCBmb3VuZCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGxldCB0cmFuc2FjdGlvbiA9IGRiLnRyYW5zYWN0aW9uKHBhcmFtcy5jb2xsZWN0aW9uLCAncmVhZHdyaXRlJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgdHJhbnNhY3Rpb24ub25lcnJvciA9IGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBkYi5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRyYW5zYWN0aW9uLm9uY29tcGxldGUgPSBldmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGIuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHsgYWN0aW9uOiAndXBkYXRlJywgZG9jdW1lbnRzIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGxldCBzdG9yZSA9IHRyYW5zYWN0aW9uLm9iamVjdFN0b3JlKHBhcmFtcy5jb2xsZWN0aW9uKTtcclxuICAgICAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gc3RvcmUub3BlbkN1cnNvcigpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGRvY3VtZW50cyA9IHt9O1xyXG5cclxuICAgICAgICAgICAgICAgIHJlcXVlc3Qub25lcnJvciA9IChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGRiLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgY3Vyc29yID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZm91bmQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY3Vyc29yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmplY3RMaWJyYXJ5LmlzU3ViT2JqZWN0KGN1cnNvci52YWx1ZSwgcGFyYW1zLmNoZWNrKSkgey8vcmV0cmlldmUgdGhlIG1hdGNoZWQgZG9jdW1lbnRzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpIGluIHBhcmFtcy5xdWVyeSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnNvci52YWx1ZVtpXSA9IHBhcmFtcy5xdWVyeVtpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXMgPSBjdXJzb3IudXBkYXRlKGN1cnNvci52YWx1ZSk7Ly91cGRhdGVcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLm9uZXJyb3IgPSAockV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50c1tyRXZlbnQudGFyZ2V0LnJlc3VsdF0gPSB7IHZhbHVlOiBjdXJzb3IudmFsdWUsIHN0YXR1czogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5vbnN1Y2Nlc3MgPSAockV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50c1tyRXZlbnQudGFyZ2V0LnJlc3VsdF0gPSB7IHZhbHVlOiBjdXJzb3IudmFsdWUsIHN0YXR1czogdHJ1ZSB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGIuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFyYW1zLm1hbnkgPT0gdHJ1ZSB8fCBmb3VuZCA9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yLmNvbnRpbnVlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9KS5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICBkYi5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zYXZlID0gZnVuY3Rpb24gKHBhcmFtcyA9IHsgY29sbGVjdGlvbjogJycsIHF1ZXJ5OiB7fSwgY2hlY2s6IHt9IH0pIHtcclxuICAgICAgICAvL2NoZWNrIGV4aXN0ZW5jZSBvZiBkb2N1bWVudFxyXG4gICAgICAgIHJldHVybiB0aGlzLmRvY3VtZW50RXhpc3RzKHsgY29sbGVjdGlvbjogcGFyYW1zLmNvbGxlY3Rpb24sIHF1ZXJ5OiBwYXJhbXMuY2hlY2sgfSkudGhlbihleGlzdHMgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXhpc3RzID09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5pbnNlcnQocGFyYW1zKTsvL2luc2VydCBpZiBub3QgZm91bmRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnVwZGF0ZShwYXJhbXMpOy8vIHVwZGF0ZSBpZiBmb3VuZFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5kZWxldGUgPSBmdW5jdGlvbiAocGFyYW1zKSB7XHJcbiAgICAgICAgbGV0IGZvdW5kQ291bnQgPSAwLCByZW1vdmVkQ291bnQgPSAwOy8vc2V0IHRoZSBjb3VudGVyc1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZmluZChwYXJhbXMpLnRoZW4oZm91bmQgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vcGVuKCkudGhlbihkYiA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRyYW5zYWN0aW9uID0gZGIudHJhbnNhY3Rpb24ocGFyYW1zLmNvbGxlY3Rpb24sICdyZWFkd3JpdGUnKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc3RvcmUgPSB0cmFuc2FjdGlvbi5vYmplY3RTdG9yZShwYXJhbXMuY29sbGVjdGlvbik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zYWN0aW9uLm9uZXJyb3IgPSBldmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRiLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNhY3Rpb24ub25jb21wbGV0ZSA9IGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGIuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7IGFjdGlvbjogJ2RlbGV0ZScsIHJlbW92ZWRDb3VudCwgb2s6IHJlbW92ZWRDb3VudCA9PSBmb3VuZENvdW50IH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZm91bmQpKSB7Ly9pZiBtYW55XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kQ291bnQgPSBmb3VuZC5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGRhdGEgb2YgZm91bmQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gc3RvcmUuZGVsZXRlKGRhdGEuX2lkKTsvL2RlbGV0ZSBlYWNoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1ZXN0Lm9uZXJyb3IgPSBldmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYEVycm9yIHdoaWxlIGRlbGV0aW5nIGRvY3VtZW50cyA9PiAke2V2ZW50LnRhcmdldC5lcnJvcn1gKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9IGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVkQ291bnQrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChmb3VuZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3VuZENvdW50ID0gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSBzdG9yZS5kZWxldGUoZm91bmQuX2lkKTsvL2RlbGV0ZSBkb2N1bWVudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXF1ZXN0Lm9uZXJyb3IgPSBldmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgRXJyb3Igd2hpbGUgZGVsZXRpbmcgZG9jdW1lbnRzID0+ICR7ZXZlbnQudGFyZ2V0LmVycm9yfWApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9IGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZWRDb3VudCsrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGRiLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KS5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICBkYi5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSW5kZXhlZExpYnJhcnk7XHJcbiIsImNvbnN0IEFycmF5TGlicmFyeSA9IHJlcXVpcmUoJy4vQXJyYXlMaWJyYXJ5Jyk7XHJcbmxldCBhcnJheUxpYnJhcnkgPSBuZXcgQXJyYXlMaWJyYXJ5KCk7XHJcblxyXG5mdW5jdGlvbiBNYXRoc0xpYnJhcnkoKSB7XHJcblxyXG4gICAgdGhpcy5wbGFjZVVuaXQgPSAobnVtLCB2YWx1ZSwgY291bnQpID0+IHtcclxuICAgICAgICBudW0gPSBNYXRoLmZsb29yKG51bSkudG9TdHJpbmcoKTtcclxuICAgICAgICB2YWx1ZSA9IHZhbHVlIHx8IG51bVswXTtcclxuICAgICAgICBjb3VudCA9IGNvdW50IHx8IDA7XHJcblxyXG4gICAgICAgIGxldCBwb3MgPSAtMTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAobnVtW2ldID09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY291bnQgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBvcyA9IGk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb3VudC0tO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgaWYgKHBvcyAhPSAtMSkgcG9zID0gMTAgKiogKG51bS5sZW5ndGggLSBwb3MgLSAxKTtcclxuICAgICAgICByZXR1cm4gcG9zO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucm91bmQgPSAocGFyYW1zKSA9PiB7XHJcbiAgICAgICAgcGFyYW1zLmRpciA9IHBhcmFtcy5kaXIgfHwgJ3JvdW5kJztcclxuICAgICAgICBwYXJhbXMudG8gPSBwYXJhbXMudG8gfHwgMTtcclxuXHJcbiAgICAgICAgbGV0IHZhbHVlID0gTWF0aFtwYXJhbXMuZGlyXShwYXJhbXMubnVtIC8gcGFyYW1zLnRvKSAqIHBhcmFtcy50bztcclxuICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy52YXJpYW5jZSA9IChkYXRhKSA9PiB7XHJcbiAgICAgICAgbGV0IG1lYW4gPSB0aGlzLm1lYW4oZGF0YSk7XHJcbiAgICAgICAgbGV0IHZhcmlhbmNlID0gMDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyaWFuY2UgKz0gKGRhdGFbaV0gLSBtZWFuKSAqKiAyO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmFyaWFuY2UgLyBkYXRhLmxlbmd0aDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnN0YW5kYXJkRGV2aWF0aW9uID0gKGRhdGEpID0+IHtcclxuICAgICAgICBsZXQgdmFyaWFuY2UgPSB0aGlzLnZhcmlhbmNlKGRhdGEpO1xyXG4gICAgICAgIGxldCBzdGQgPSBNYXRoLnNxcnQodmFyaWFuY2UpO1xyXG4gICAgICAgIHJldHVybiBzdGQ7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5yYW5nZSA9IChkYXRhKSA9PiB7XHJcbiAgICAgICAgbGV0IG1pbiA9IE1hdGgubWluKC4uLmRhdGEpO1xyXG4gICAgICAgIGxldCBtYXggPSBNYXRoLm1heCguLi5kYXRhKTtcclxuXHJcbiAgICAgICAgbGV0IHJhbmdlID0gbWF4IC0gbWluO1xyXG4gICAgICAgIHJldHVybiByYW5nZTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm1lYW4gPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgIGxldCBzdW0gPSB0aGlzLnN1bShkYXRhKTtcclxuXHJcbiAgICAgICAgbGV0IG1lYW4gPSBzdW0gLyBkYXRhLmxlbmd0aDtcclxuICAgICAgICByZXR1cm4gbWVhbjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm1lZGlhbiA9IChkYXRhKSA9PiB7XHJcbiAgICAgICAgbGV0IGxlbmd0aCA9IGRhdGEubGVuZ3RoO1xyXG4gICAgICAgIGxldCBtZWRpYW47XHJcbiAgICAgICAgaWYgKGxlbmd0aCAlIDIgPT0gMCkge1xyXG4gICAgICAgICAgICBtZWRpYW4gPSAoZGF0YVsobGVuZ3RoIC8gMikgLSAxXSArIGRhdGFbbGVuZ3RoIC8gMl0pIC8gMjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBtZWRpYW4gPSBkYXRhW01hdGguZmxvb3IobGVuZ3RoIC8gMildO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG1lZGlhbjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm1vZGUgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgIGxldCByZWNvcmQgPSB7fTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHJlY29yZFtkYXRhW2ldXSAhPSB1bmRlZmluZWQpIHJlY29yZFtkYXRhW2ldXSsrO1xyXG4gICAgICAgICAgICBlbHNlIHJlY29yZFtkYXRhW2ldXSA9IGk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgbWF4ID0gTWF0aC5tYXgoLi4uT2JqZWN0LnZhbHVlKHJlY29yZCkpO1xyXG4gICAgICAgIGxldCBtb2RlO1xyXG4gICAgICAgIGZvciAobGV0IGkgaW4gcmVjb3JkKSB7XHJcbiAgICAgICAgICAgIGlmIChyZWNvcmRbaV0gPT0gbWF4KSB7XHJcbiAgICAgICAgICAgICAgICBtb2RlID0gaTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbW9kZTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm5vcm1hbGl6ZURhdGEgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgIGRhdGEuc29ydCgoYSwgYikgPT4geyByZXR1cm4gYSAtIGIgfSk7XHJcbiAgICAgICAgdmFyIG1heCA9IGRhdGFbZGF0YS5sZW5ndGggLSAxXTtcclxuICAgICAgICB2YXIgbWluID0gZGF0YVswXTtcclxuICAgICAgICB2YXIgbm9ybWFsaXplZCA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBub3JtYWxpemVkLnB1c2goKGRhdGFbaV0gLSBtaW4pIC8gKG1heCAtIG1pbikpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbm9ybWFsaXplZDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm1pbmltdWltU3dhcHMgPSAoYXJyLCBvcmRlcikgPT4ge1xyXG4gICAgICAgIHZhciBzd2FwID0gMDtcclxuICAgICAgICB2YXIgY2hlY2tlZCA9IFtdO1xyXG4gICAgICAgIHZhciBjb3VudGVyID0gMDtcclxuICAgICAgICB2YXIgZmluYWwgPSBbLi4uYXJyXS5zb3J0KChhLCBiKSA9PiB7IHJldHVybiBhIC0gYiB9KTtcclxuICAgICAgICBpZiAob3JkZXIgPT0gLTEpIGZpbmFsID0gZmluYWwucmV2ZXJzZSgpO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgZWxlbWVudCA9IGFycltpXTtcclxuICAgICAgICAgICAgaWYgKGkgPT0gZWxlbWVudCB8fCBjaGVja2VkW2ldKSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgIGNvdW50ZXIgPSAwO1xyXG5cclxuICAgICAgICAgICAgaWYgKGFyclswXSA9PSAwKSBlbGVtZW50ID0gaTtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlICghY2hlY2tlZFtpXSkge1xyXG4gICAgICAgICAgICAgICAgY2hlY2tlZFtpXSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBpID0gZmluYWwuaW5kZXhPZihlbGVtZW50KTtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBhcnJbaV07XHJcbiAgICAgICAgICAgICAgICBjb3VudGVyKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGNvdW50ZXIgIT0gMCkge1xyXG4gICAgICAgICAgICAgICAgc3dhcCArPSBjb3VudGVyIC0gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc3dhcDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnByaW1lRmFjdG9yaXplID0gKG51bWJlcikgPT4ge1xyXG4gICAgICAgIGlmICh0eXBlb2YgbnVtYmVyICE9IFwibnVtYmVyXCIpIHJldHVybiBbXTtcclxuICAgICAgICBudW1iZXIgPSBNYXRoLmFicyhwYXJzZUludChudW1iZXIpKTtcclxuICAgICAgICBpZiAobnVtYmVyID09IDEgfHwgbnVtYmVyID09IDApIHJldHVybiBbXS8vMSBhbmQgMCBoYXMgbm8gcHJpbWVzXHJcbiAgICAgICAgdmFyIGRpdmlkZXIgPSAyO1xyXG4gICAgICAgIHZhciBkaXZpZGVuZDtcclxuICAgICAgICB2YXIgZmFjdG9ycyA9IFtdO1xyXG4gICAgICAgIHdoaWxlIChudW1iZXIgIT0gMSkge1xyXG4gICAgICAgICAgICBkaXZpZGVuZCA9IG51bWJlciAvIGRpdmlkZXI7XHJcbiAgICAgICAgICAgIGlmIChkaXZpZGVuZC50b1N0cmluZygpLmluZGV4T2YoJy4nKSAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgZGl2aWRlcisrXHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBudW1iZXIgPSBkaXZpZGVuZDtcclxuICAgICAgICAgICAgZmFjdG9ycy5wdXNoKGRpdmlkZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFjdG9ycztcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmxjZiA9IChudW1iZXJzKSA9PiB7XHJcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KG51bWJlcnMpKSByZXR1cm4gW107XHJcbiAgICAgICAgdmFyIGZhY3RvcnMgPSBbXTtcclxuICAgICAgICB2YXIgY29tbW9uRmFjdG9ycyA9IFtdO1xyXG4gICAgICAgIHZhciB2YWx1ZSA9IDE7XHJcbiAgICAgICAgZm9yICh2YXIgbnVtYmVyIG9mIG51bWJlcnMpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBudW1iZXIgIT0gXCJudW1iZXJcIikgcmV0dXJuIFtdO1xyXG4gICAgICAgICAgICBmYWN0b3JzLnB1c2godGhpcy5wcmltZUZhY3Rvcml6ZShudW1iZXIpKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbWFpbjpcclxuICAgICAgICBmb3IgKHZhciBmYWN0b3Igb2YgZmFjdG9yc1swXSkge1xyXG4gICAgICAgICAgICBpZiAoY29tbW9uRmFjdG9ycy5pbmRleE9mKGZhY3RvcikgPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgb2YgZmFjdG9ycykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpLmluZGV4T2YoZmFjdG9yKSA9PSAtMSkgY29udGludWUgbWFpbjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbW1vbkZhY3RvcnMucHVzaChmYWN0b3IpO1xyXG4gICAgICAgICAgICAgICAgdmFsdWUgKj0gZmFjdG9yO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnN0cmlwSW50ZWdlciA9IChudW1iZXIpID0+IHtcclxuICAgICAgICBudW1iZXIgPSBudW1iZXIudG9TdHJpbmcoKTtcclxuICAgICAgICBudW1iZXIgPSAobnVtYmVyLmluZGV4T2YoJy4nKSA9PSAtMSkgPyBudW1iZXIgOiBudW1iZXIuc2xpY2UoMCwgbnVtYmVyLmluZGV4T2YoJy4nKSk7XHJcbiAgICAgICAgcmV0dXJuIG51bWJlcjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnN0cmlwRnJhY3Rpb24gPSAobnVtYmVyKSA9PiB7XHJcbiAgICAgICAgbnVtYmVyID0gbnVtYmVyLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgbnVtYmVyID0gKG51bWJlci5pbmRleE9mKCcuJykgPT0gLTEpID8gJzAnIDogbnVtYmVyLnNsaWNlKG51bWJlci5pbmRleE9mKCcuJykgKyAxKTtcclxuICAgICAgICByZXR1cm4gbnVtYmVyO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY2hhbmdlQmFzZSA9IChudW1iZXIsIGZyb20sIHRvKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQobnVtYmVyLCBmcm9tKS50b1N0cmluZyh0byk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5tYXggPSAoYXJyYXkpID0+IHtcclxuICAgICAgICB2YXIgbWF4ID0gYXJyYXlbMF07XHJcbiAgICAgICAgYXJyYXlMaWJyYXJ5LmVhY2goYXJyYXksIHZhbHVlID0+IHtcclxuICAgICAgICAgICAgaWYgKG1heCA8IHZhbHVlKSBtYXggPSB2YWx1ZTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gbWF4O1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubWluID0gKGFycmF5KSA9PiB7XHJcbiAgICAgICAgdmFyIG1heCA9IGFycmF5WzBdO1xyXG4gICAgICAgIGFycmF5TGlicmFyeS5lYWNoKGFycmF5LCB2YWx1ZSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChtYXggPiB2YWx1ZSkgbWF4ID0gdmFsdWU7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIG1heDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnN1bSA9IChhcnJheSkgPT4ge1xyXG4gICAgICAgIC8vZm9yIGZpbmRpbmcgdGhlIHN1bSBvZiBvbmUgbGF5ZXIgYXJyYXlcclxuICAgICAgICBsZXQgc3VtID0gMDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChpc05hTihNYXRoLmZsb29yKGFycmF5W2ldKSkpIHtcclxuICAgICAgICAgICAgICAgIHN1bSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3VtICs9IGFycmF5W2ldIC8gMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdW07XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5wcm9kdWN0ID0gKGFycmF5KSA9PiB7XHJcbiAgICAgICAgLy9mb3IgZmluZGluZyB0aGUgc3VtIG9mIG9uZSBsYXllciBhcnJheVxyXG4gICAgICAgIGxldCBwcm9kdWN0ID0gMTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChpc05hTihNYXRoLmZsb29yKGFycmF5W2ldKSkpIHtcclxuICAgICAgICAgICAgICAgIHByb2R1Y3QgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHByb2R1Y3QgKj0gYXJyYXlbaV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcHJvZHVjdDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmFkZCA9ICguLi5hcnJheXMpID0+IHtcclxuICAgICAgICBsZXQgbmV3QXJyYXkgPSBbXTtcclxuICAgICAgICBhcnJheXNbMF0uZm9yRWFjaCgodmFsdWUsIHBvc2l0aW9uKSA9PiB7XHJcbiAgICAgICAgICAgIGFycmF5cy5mb3JFYWNoKChhcnJheSwgbG9jYXRpb24pID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChsb2NhdGlvbiAhPSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSBBcnJheS5pc0FycmF5KGFycmF5KSA/IGFycmF5W3Bvc2l0aW9uXSA6IGFycmF5O1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlICs9IGlzTmFOKGVsZW1lbnQpID09IHRydWUgPyAwIDogZWxlbWVudDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgbmV3QXJyYXkucHVzaCh2YWx1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIG5ld0FycmF5O1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc3ViID0gKC4uLmFycmF5cykgPT4ge1xyXG4gICAgICAgIGxldCBuZXdBcnJheSA9IFtdO1xyXG4gICAgICAgIGFycmF5c1swXS5mb3JFYWNoKCh2YWx1ZSwgcG9zaXRpb24pID0+IHtcclxuICAgICAgICAgICAgYXJyYXlzLmZvckVhY2goKGFycmF5LCBsb2NhdGlvbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGxvY2F0aW9uICE9IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZWxlbWVudCA9IEFycmF5LmlzQXJyYXkoYXJyYXkpID8gYXJyYXlbcG9zaXRpb25dIDogYXJyYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgLT0gaXNOYU4oZWxlbWVudCkgPT0gdHJ1ZSA/IDAgOiBlbGVtZW50O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBuZXdBcnJheS5wdXNoKHZhbHVlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gbmV3QXJyYXk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5tdWwgPSAoLi4uYXJyYXlzKSA9PiB7XHJcbiAgICAgICAgbGV0IG5ld0FycmF5ID0gW107XHJcbiAgICAgICAgYXJyYXlzWzBdLmZvckVhY2goKHZhbHVlLCBwb3NpdGlvbikgPT4ge1xyXG4gICAgICAgICAgICBhcnJheXMuZm9yRWFjaCgoYXJyYXksIGxvY2F0aW9uKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAobG9jYXRpb24gIT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBlbGVtZW50ID0gQXJyYXkuaXNBcnJheShhcnJheSkgPyBhcnJheVtwb3NpdGlvbl0gOiBhcnJheTtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSAqPSBpc05hTihlbGVtZW50KSA9PSB0cnVlID8gMCA6IGVsZW1lbnQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIG5ld0FycmF5LnB1c2godmFsdWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBuZXdBcnJheTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmRpdmlkZSA9ICguLi5hcnJheXMpID0+IHtcclxuICAgICAgICBsZXQgbmV3QXJyYXkgPSBbXTtcclxuICAgICAgICBhcnJheXNbMF0uZm9yRWFjaCgodmFsdWUsIHBvc2l0aW9uKSA9PiB7XHJcbiAgICAgICAgICAgIGFycmF5cy5mb3JFYWNoKChhcnJheSwgbG9jYXRpb24pID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChsb2NhdGlvbiAhPSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSBBcnJheS5pc0FycmF5KGFycmF5KSA/IGFycmF5W3Bvc2l0aW9uXSA6IGFycmF5O1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlIC89IGlzTmFOKGVsZW1lbnQpID09IHRydWUgPyAwIDogZWxlbWVudDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgbmV3QXJyYXkucHVzaCh2YWx1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIG5ld0FycmF5O1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuYWJzID0gKGFycmF5KSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGFycmF5TGlicmFyeS5lYWNoKGFycmF5LCB2YWx1ZSA9PiB7XHJcbiAgICAgICAgICAgIHZhbHVlID0gaXNOYU4odmFsdWUpID09IHRydWUgPyAwIDogdmFsdWU7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmFicyh2YWx1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWF0aHNMaWJyYXJ5OyIsImNvbnN0IEFycmF5TGlicmFyeSA9IHJlcXVpcmUoJy4vQXJyYXlMaWJyYXJ5Jyk7XHJcbmxldCBhcnJheUxpYnJhcnkgPSBuZXcgQXJyYXlMaWJyYXJ5KCk7XHJcblxyXG5mdW5jdGlvbiBPYmplY3RzTGlicmFyeSgpIHtcclxuXHJcbiAgICB0aGlzLmV4dHJhY3RGcm9tSnNvbkFycmF5ID0gKG1ldGEsIHNvdXJjZSkgPT4gey8vZXh0cmFjdCBhIGJsdWVwcmludCBvZiBkYXRhIGZyb20gYSBKc29uQXJyYXlcclxuICAgICAgICBsZXQga2V5cyA9IE9iamVjdC5rZXlzKG1ldGEpOy8vZ2V0IHRoZSBrZXlzXHJcbiAgICAgICAgbGV0IHZhbHVlcyA9IE9iamVjdC52YWx1ZXMobWV0YSk7Ly9nZXQgdGhlIHZhbHVlc1xyXG5cclxuICAgICAgICBsZXQgZVNvdXJjZSA9IFtdO1xyXG4gICAgICAgIGlmIChzb3VyY2UgIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IG9iaiBvZiBzb3VyY2UpIHsvL2VhY2ggaXRlbSBpbiBzb3VyY2VcclxuICAgICAgICAgICAgICAgIGxldCBvYmplY3QgPSB7fTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgaW4ga2V5cykgey8vZWFjaCBibHVlcHJpbnQga2V5XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFycmF5TGlicmFyeS5jb250YWlucyhPYmplY3Qua2V5cyhvYmopLCB2YWx1ZXNbaV0pKSB7Ly9zb3VyY2UgaXRlbSBoYXMgYmx1ZXByaW50IHZhbHVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdFtrZXlzW2ldXSA9IG9ialt2YWx1ZXNbaV1dOy8vc3RvcmUgYWNjb3JkaW5nIHRvIGJsdWVwcmludFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVTb3VyY2UucHVzaChvYmplY3QpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBlU291cmNlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZmluZCA9IChvYmosIGNhbGxiYWNrKSA9PiB7Ly9oaWdoZXIgb3JkZXIgT2JqZWN0IGZ1bmN0aW9uIGZvciB0aGUgZmlyc3QgaXRlbSBpbiBhbiBPYmplY3QgdGhhdCBtYXRjaFxyXG4gICAgICAgIGZvciAobGV0IGkgaW4gb2JqKSB7XHJcbiAgICAgICAgICAgIGlmIChjYWxsYmFjayhvYmpbaV0pID09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvYmpbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5maW5kQWxsID0gKG9iaiwgY2FsbGJhY2spID0+IHsvL2hpZ2hlciBvcmRlciBPYmplY3QgZnVuY3Rpb24gZm9yIGFsbCBpdGVtcyBpbiBhbiBPYmplY3QgdGhhdCBtYXRjaFxyXG4gICAgICAgIGxldCB2YWx1ZXMgPSB7fTtcclxuICAgICAgICBmb3IgKGxldCBpIGluIG9iaikge1xyXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2sob2JqW2ldKSA9PSB0cnVlKVxyXG4gICAgICAgICAgICAgICAgdmFsdWVzW2ldID0gb2JqW2ldO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHZhbHVlcztcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm1ha2VJdGVyYWJsZSA9IChvYmopID0+IHsvL21ha2UgYW4gb2JqZWN0IHRvIHVzZSAnZm9yIGluJ1xyXG4gICAgICAgIG9ialtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgbGV0IHByb3BlcnRpZXMgPSBPYmplY3Qua2V5cyhvYmopO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBwIG9mIHByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgIHlpZWxkIHRoaXNbcF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG9iajtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm1heCA9IChvYmplY3QpID0+IHtcclxuICAgICAgICBvYmplY3QgPSB0aGlzLnNvcnQob2JqZWN0LCB7IHZhbHVlOiB0cnVlIH0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldEluZGV4KG9iamVjdCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5taW4gPSAob2JqZWN0KSA9PiB7Ly9nZXQgdGhlIG1pbmludW0gaW4gaXRlbSBpbiBhbiBPYmplY3RcclxuICAgICAgICBvYmplY3QgPSB0aGlzLnNvcnQob2JqZWN0LCB7IHZhbHVlOiBmYWxzZSB9KTtcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRJbmRleChvYmplY3QpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMub25DaGFuZ2VkID0gKG9iaiwgY2FsbGJhY2spID0+IHsvL21ha2UgYW4gb2JqZWN0IGxpc3RlbiB0byBjaGFuZ2VzIG9mIGl0J3MgaXRlbXNcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0ge1xyXG4gICAgICAgICAgICBnZXQodGFyZ2V0LCBwcm9wZXJ0eSwgcmVjZWl2ZXIpIHsvL3doZW4gYW4gSXRlbSBpcyBmZXRjaGVkXHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUHJveHkodGFyZ2V0W3Byb3BlcnR5XSwgaGFuZGxlcik7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUmVmbGVjdC5nZXQodGFyZ2V0LCBwcm9wZXJ0eSwgcmVjZWl2ZXIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBkZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIHByb3BlcnR5LCBkZXNjcmlwdG9yKSB7Ly93aGVuIGFuIEl0ZW0gaXMgYWRkZWRcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKHRhcmdldCwgcHJvcGVydHkpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFJlZmxlY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBwcm9wZXJ0eSwgZGVzY3JpcHRvcik7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGRlbGV0ZVByb3BlcnR5KHRhcmdldCwgcHJvcGVydHkpIHsvL3doZW4gYW4gSXRlbSBpcyByZW1vdmVkXHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayh0YXJnZXQsIHByb3BlcnR5KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBSZWZsZWN0LmRlbGV0ZVByb3BlcnR5KHRhcmdldCwgcHJvcGVydHkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm94eShvYmosIGhhbmRsZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudG9BcnJheSA9IChvYmplY3QsIG5hbWVkKSA9PiB7Ly90dXJuIGFuIE9iamVjdCBpbnRvIGFuIEFycmF5XHJcbiAgICAgICAgdmFyIGFycmF5ID0gW107XHJcbiAgICAgICAgT2JqZWN0LmtleXMob2JqZWN0KS5tYXAoKGtleSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAobmFtZWQgPT0gdHJ1ZSkgey8vbWFrZSBpdCBuYW1lZFxyXG4gICAgICAgICAgICAgICAgYXJyYXlba2V5XSA9IG9iamVjdFtrZXldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYXJyYXkucHVzaChvYmplY3Rba2V5XSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gYXJyYXk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy52YWx1ZU9mT2JqZWN0QXJyYXkgPSAoYXJyYXksIG5hbWUpID0+IHsvL2dldCBhbGwgdGhlIGtleXMgaW4gYSBKc29uQXJyYXkgb2YgaXRlbSBuYW1lXHJcbiAgICAgICAgdmFyIG5ld0FycmF5ID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaSBpbiBhcnJheSkge1xyXG4gICAgICAgICAgICBuZXdBcnJheS5wdXNoKGFycmF5W2ldW25hbWVdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ld0FycmF5O1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMua2V5c09mT2JqZWN0QXJyYXkgPSAoYXJyYXkgPSBbXSkgPT4gey8vZ2V0IGFsbCB0aGUga2V5cyBpbiBhIEpzb25BcnJheVxyXG4gICAgICAgIHZhciBuZXdBcnJheSA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgaW4gYXJyYXkpIHtcclxuICAgICAgICAgICAgbmV3QXJyYXkgPSBuZXdBcnJheS5jb25jYXQoT2JqZWN0LmtleXMoYXJyYXlbaV0pKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFycmF5TGlicmFyeS50b1NldChuZXdBcnJheSk7Ly9yZW1vdmUgZHVwbGljYXRlc1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMub2JqZWN0T2ZPYmplY3RBcnJheSA9IChhcnJheSA9IFtdLCBpZCwgbmFtZSkgPT4gey8vc3RyaXAgW2tleSB2YWx1ZV0gZnJvbSBhIEpzb25BcnJheVxyXG4gICAgICAgIHZhciBvYmplY3QgPSB7fTtcclxuICAgICAgICBmb3IgKGxldCBpIGluIGFycmF5KSB7XHJcbiAgICAgICAgICAgIG9iamVjdFthcnJheVtpXVtpZF1dID0gYXJyYXlbaV1bbmFtZV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvYmplY3Q7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jb3B5ID0gKGZyb20sIHRvKSA9PiB7Ly9jbG9uZSBhbiBPYmplY3RcclxuICAgICAgICBPYmplY3Qua2V5cyhmcm9tKS5tYXAoa2V5ID0+IHtcclxuICAgICAgICAgICAgdG9ba2V5XSA9IGZyb21ba2V5XTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmZvckVhY2ggPSAob2JqZWN0LCBjYWxsYmFjaykgPT4gey8vaGlnaGVyIG9yZGVyIGZ1bmN0aW9uIGZvciBPYmplY3QgbGl0ZXJhbFxyXG4gICAgICAgIGZvciAobGV0IGtleSBpbiBvYmplY3QpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2sob2JqZWN0W2tleV0sIGtleSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZWFjaCA9IGZ1bmN0aW9uIChvYmplY3QsIGNhbGxiYWNrKSB7Ly9oaWdoZXIgb3JkZXIgZnVuY3Rpb24gZm9yIE9iamVjdCBsaXRlcmFsXHJcbiAgICAgICAgbGV0IG5ld09iamVjdCA9IHt9O1xyXG4gICAgICAgIGZvciAobGV0IGtleSBpbiBvYmplY3QpIHtcclxuICAgICAgICAgICAgbmV3T2JqZWN0W2tleV0gPSBjYWxsYmFjayhvYmplY3Rba2V5XSwga2V5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ld09iamVjdDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmlzU3ViT2JqZWN0ID0gKGRhdGEsIHNhbXBsZSkgPT4gey8vY2hlY2sgaWYgYW4gb2JqZWN0IGlzIGEgc3ViLU9iamVjdCBvZiBhbm90aGVyIE9iamVjdFxyXG4gICAgICAgIGxldCBmbGFnO1xyXG4gICAgICAgIGZvciAobGV0IG5hbWUgaW4gc2FtcGxlKSB7XHJcbiAgICAgICAgICAgIGZsYWcgPSBKU09OLnN0cmluZ2lmeShzYW1wbGVbbmFtZV0pID09IEpTT04uc3RyaW5naWZ5KGRhdGFbbmFtZV0pOy8vY29udmVydCB0byBzdHJpbmcgYW5kIGNvbXBhcmVcclxuICAgICAgICAgICAgaWYgKCFmbGFnKSBicmVhaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmbGFnO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZ2V0U3ViT2JqZWN0ID0gKGRhdGEgPSBbXSwgc2FtcGxlID0ge30pID0+IHsvL2dldCBtYXRjaGVkIGl0ZW1zIGluIE9iamVjdFxyXG4gICAgICAgIGxldCBtYXRjaGVkID0gW10sIGZsYWcgPSB0cnVlO1xyXG4gICAgICAgIGZvciAobGV0IGkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICBmbGFnID0gdGhpcy5pc1N1Yk9iamVjdChkYXRhW2ldLCBzYW1wbGUpOy8vY2hlY2sgZWFjaCBvYmplY3RcclxuICAgICAgICAgICAgaWYgKCFmbGFnKSBjb250aW51ZTtcclxuICAgICAgICAgICAgbWF0Y2hlZC5wdXNoKGRhdGFbaV0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG1hdGNoZWRcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnNvcnQgPSAoZGF0YSA9IHt9LCBwYXJhbXMgPSB7IGl0ZW1zOiBbXSwgZGVzY2VuZDogZmFsc2UsIGtleTogZmFsc2UsIHZhbHVlOiBmYWxzZSB9KSA9PiB7Ly9zb3J0IGFuIE9iamVjdCBiYXNlZCBvbltrZXksIHZhbHVlIG9yIGl0ZW1zXVxyXG4gICAgICAgIHBhcmFtcy5pdGVtID0gcGFyYW1zLml0ZW0gfHwgJyc7XHJcbiAgICAgICAgcGFyYW1zLmRlc2NlbmQgPSBwYXJhbXMuZGVzY2VuZCB8fCBmYWxzZTtcclxuXHJcbiAgICAgICAgbGV0IHNvcnRlZCA9IFtdLCBuRGF0YSA9IHt9O1xyXG4gICAgICAgIGZvciAobGV0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhkYXRhKSkge1xyXG4gICAgICAgICAgICBzb3J0ZWQucHVzaCh7IGtleSwgdmFsdWUgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocGFyYW1zLmtleSAhPSB1bmRlZmluZWQpIHsvL3NvcnQgd2l0aCBrZXlcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0hlbGxvJyk7XHJcbiAgICAgICAgICAgIHNvcnRlZC5zb3J0KChhLCBiKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSAoYS5rZXkgPj0gYi5rZXkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBhcmFtcy5rZXkgPT0gdHJ1ZSkgdmFsdWUgPSAhdmFsdWU7Ly9kZXNjZW5kXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBhcmFtcy52YWx1ZSAhPSB1bmRlZmluZWQpIHsvL3NvcnQgd2l0aCB2YWx1ZVxyXG4gICAgICAgICAgICBzb3J0ZWQuc29ydCgoYSwgYikgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gKGEudmFsdWUgPj0gYi52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAocGFyYW1zLnZhbHVlID09IHRydWUpIHZhbHVlID0gIXZhbHVlOy8vZGVzY2VuZFxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChwYXJhbXMuaXRlbXMgIT0gdW5kZWZpbmVkKSB7Ly9zb3J0IHdpdGggaXRlbXNcclxuICAgICAgICAgICAgc29ydGVkLnNvcnQoKGEsIGIpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBncmVhdGVyID0gMCwgbGVzc2VyID0gMDtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgcGFyYW1zLml0ZW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGEudmFsdWVbaXRlbV0gPj0gYi52YWx1ZVtpdGVtXSkgZ3JlYXRlcisrXHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBsZXNzZXIrKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IGdyZWF0ZXIgPj0gbGVzc2VyO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBhcmFtcy5kZXNjZW5kID09IHRydWUpIHZhbHVlID0gIXZhbHVlOy8vZGVzY2VuZCBpdGVtc1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IHsga2V5LCB2YWx1ZSB9IG9mIHNvcnRlZCkge1xyXG4gICAgICAgICAgICBuRGF0YVtrZXldID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbkRhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5yZXZlcnNlID0gKGRhdGEgPSB7fSkgPT4gey8vcmV2ZXJzZSBhbiBPYmplY3RcclxuICAgICAgICBsZXQga2V5cyA9IE9iamVjdC5rZXlzKGRhdGEpLnJldmVyc2UoKTtcclxuICAgICAgICBsZXQgbmV3T2JqZWN0ID0ge307XHJcbiAgICAgICAgZm9yIChsZXQgaSBvZiBrZXlzKSB7XHJcbiAgICAgICAgICAgIG5ld09iamVjdFtpXSA9IGRhdGFbaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXdPYmplY3Q7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5nZXRJbmRleCA9IChkYXRhID0ge30pID0+IHsvL2dldCB0aGUgZmlyc3QgaXRlbSBpbiB0aGUgT2JqZWN0XHJcbiAgICAgICAgbGV0IGtleSA9IE9iamVjdC5rZXlzKGRhdGEpLnNoaWZ0KCk7XHJcbiAgICAgICAgbGV0IHZhbHVlID0gZGF0YVtrZXldO1xyXG4gICAgICAgIHJldHVybiB7IGtleSwgdmFsdWUgfTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmdldExhc3QgPSAoZGF0YSA9IHt9KSA9PiB7Ly9nZXQgdGhlIGxhc3QgaXRlbSBpbiB0aGUgT2JqZWN0XHJcbiAgICAgICAgbGV0IGtleSA9IE9iamVjdC5rZXlzKGRhdGEpLnBvcCgpO1xyXG4gICAgICAgIGxldCB2YWx1ZSA9IGRhdGFba2V5XTtcclxuICAgICAgICByZXR1cm4geyBrZXksIHZhbHVlIH07XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5nZXRBdCA9IChkYXRhID0ge30sIGluZGV4KSA9PiB7Ly9nZXQgdGhlIGl0ZW0gb2YgaW5kZXggaW4gdGhlIE9iamVjdFxyXG4gICAgICAgIGxldCBrZXkgPSBPYmplY3Qua2V5cyhkYXRhKVtpbmRleF07XHJcbiAgICAgICAgbGV0IHZhbHVlID0gZGF0YVtrZXldO1xyXG4gICAgICAgIHJldHVybiB7IGtleSwgdmFsdWUgfTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmtleU9mID0gKGRhdGEgPSB7fSwgaXRlbSkgPT4gey8vZ2V0IHRoZSBmaXJzdCBvY2N1cnJhbmNlIG9mIGFuIGl0ZW0gaW4gYW4gT2JqZWN0XHJcbiAgICAgICAgbGV0IGluZGV4ID0gLTE7XHJcbiAgICAgICAgZm9yIChsZXQgaSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgIGlmIChKU09OLnN0cmluZ2lmeShkYXRhW2ldKSA9PSBKU09OLnN0cmluZ2lmeShpdGVtKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBpbmRleDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmxhc3RLZXlPZiA9IChkYXRhID0ge30sIGl0ZW0pID0+IHsvL2dldCB0aGUgbGFzdCBvY2N1cnJhbmNlIG9mIGFuIGl0ZW0gaW4gYW4gb2JqZWN0XHJcbiAgICAgICAgbGV0IGluZGV4ID0gLTE7XHJcbiAgICAgICAgZm9yIChsZXQgaSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgIGlmIChKU09OLnN0cmluZ2lmeShkYXRhW2ldKSA9PSBKU09OLnN0cmluZ2lmeShpdGVtKSkge1xyXG4gICAgICAgICAgICAgICAgaW5kZXggPSBpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gaW5kZXg7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5pbmNsdWRlcyA9IChkYXRhID0ge30sIGl0ZW0pID0+IHsvL2NoZWNrIGlmIGFuIE9iamVjdCBoYXMgYW4gaXRlbVxyXG4gICAgICAgIHJldHVybiB0aGlzLmtleU9mKGRhdGEsIGl0ZW0pICE9IC0xO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuYWdncmVnYXRlID0gKGRhdGEgPSB7fSwgZ3JvdXBzID0ge30pID0+IHtcclxuICAgICAgICBsZXQgZnVuY3MgPSB7XHJcbiAgICAgICAgICAgICRzdW06ICguLi5hKSA9PiB7IHJldHVybiBhLnJlZHVjZSgoaSwgaikgPT4gaSArIGopIH0sXHJcbiAgICAgICAgICAgICRkaWY6ICguLi5hKSA9PiB7IHJldHVybiBhWzBdIC0gYVsxXSA/IGFbMV0gOiAwIH0sXHJcbiAgICAgICAgICAgICRtdWw6ICguLi5hKSA9PiB7IHJldHVybiBhLnJlZHVjZSgoaSwgaikgPT4gaSAqIGopIH0sXHJcbiAgICAgICAgICAgICRkaWY6ICguLi5hKSA9PiB7IHJldHVybiBhWzBdIC0gYVsxXSA/IGFbMV0gOiAxIH0sXHJcbiAgICAgICAgICAgIGNhc3Q6IChhLCB0bykgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRvID09ICdpbnQnKSBhID0gcGFyc2VJbnQoYSk7XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0byA9PSAnZmxvYXQnKSBhID0gcGFyc2VGbG9hdChhKTtcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRvID09ICdzdHJpbmcnKSBhID0gYS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodG8gPT0gJ2RhdGUnKSBhID0gbmV3IERhdGUoYSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBhZ2cgPSBPYmplY3QuYXNzaWduKHt9LCBkYXRhKTtcclxuICAgICAgICBsZXQgeCwgbGlzdCwgbDtcclxuICAgICAgICBmb3IgKHggaW4gZ3JvdXBzKSB7XHJcbiAgICAgICAgICAgIGxpc3QgPSBbXTtcclxuICAgICAgICAgICAgZm9yIChsIG9mIGdyb3Vwc1t4XS5saXN0KSBsaXN0LnB1c2goYWdnW2xdKTtcclxuICAgICAgICAgICAgYWdnW3hdID0gZnVuY3NbZ3JvdXBzW3hdLmFjdGlvbl0oLi4ubGlzdCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYWdnO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdHNMaWJyYXJ5OyIsImNvbnN0IEZ1bmMgPSByZXF1aXJlKCcuLy4uL2NsYXNzZXMvRnVuYycpO1xyXG5sZXQgZnVuYyA9IG5ldyBGdW5jKCk7XHJcblxyXG5mdW5jdGlvbiBTaGFkb3coZWxlbWVudCkge1xyXG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudC5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICB0aGlzLnByb3BlcnRpZXMgPSB7fTtcclxuICAgIHRoaXMuY2hpbGRQcm9wZXJ0aWVzID0ge307XHJcblxyXG4gICAgdGhpcy51cGRhdGVOZXdFbGVtZW50Q2hpbGRQcm9wZXJ0aWVzID0gZnVuY3Rpb24gKGVsZW1lbnQsIHByb3BlcnR5Q29sbGVjdGlvbiA9IHt9KSB7XHJcbiAgICAgICAgbGV0IGNoaWxkcmVuLCBwb3NpdGlvbnM7XHJcbiAgICAgICAgZm9yIChsZXQgaWRlbnRpZmllciBpbiBwcm9wZXJ0eUNvbGxlY3Rpb24pIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgY2hpbGRQcm9wZXJ0aWVzIG9mIHByb3BlcnR5Q29sbGVjdGlvbltpZGVudGlmaWVyXSkge1xyXG4gICAgICAgICAgICAgICAgcG9zaXRpb25zID0gdGhpcy5zZXRQb3NpdGlvbnMoY2hpbGRQcm9wZXJ0aWVzLnBvc2l0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICBjaGlsZHJlbiA9IHRoaXMuZ2V0Q2hpbGRyZW4oaWRlbnRpZmllciwgZWxlbWVudCwgcG9zaXRpb25zKTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY2hpbGRyZW4ubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbltqXS5zZXRQcm9wZXJ0aWVzKGNoaWxkUHJvcGVydGllcy5wcm9wZXJ0aWVzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnVwZGF0ZU5ld0VsZW1lbnRDaGlsZEF0dHJpYnV0ZXMgPSBmdW5jdGlvbiAoZWxlbWVudCwgYXR0cmlidXRlQ29sbGVjdGlvbiA9IHt9KSB7XHJcbiAgICAgICAgbGV0IGNoaWxkcmVuLCBwb3NpdGlvbnM7XHJcbiAgICAgICAgZm9yIChsZXQgaWRlbnRpZmllciBpbiBhdHRyaWJ1dGVDb2xsZWN0aW9uKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGNoaWxkQXRycmlidXRlcyBvZiBhdHRyaWJ1dGVDb2xsZWN0aW9uW2lkZW50aWZpZXJdKSB7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbnMgPSB0aGlzLnNldFBvc2l0aW9ucyhjaGlsZEF0cnJpYnV0ZXMucG9zaXRpb25zKTtcclxuICAgICAgICAgICAgICAgIGNoaWxkcmVuID0gdGhpcy5nZXRDaGlsZHJlbihpZGVudGlmaWVyLCBlbGVtZW50LCBwb3NpdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjaGlsZHJlbi5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuW2pdLnNldEF0dHJpYnV0ZXMoY2hpbGRBdHJyaWJ1dGVzLmF0dHJpYnV0ZXMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc2V0UG9zaXRpb25zID0gZnVuY3Rpb24gKHBvc2l0aW9ucyA9IDEpIHtcclxuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkocG9zaXRpb25zKSkge1xyXG4gICAgICAgICAgICBwb3NpdGlvbnMgPSBmdW5jLnJhbmdlKHBvc2l0aW9ucyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcG9zaXRpb25zO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uIChwYXJhbXMgPSB7IGNoaWxkRGV0YWlsczogeyBhdHRyaWJ1dGVzOiB7fSwgcHJvcGVydGllczoge30gfSwgZGV0YWlsczogeyBhdHRyaWJ1dGVzOiB7fSwgcHJvcGVydGllczoge30gfSB9KSB7XHJcbiAgICAgICAgbGV0IGVsZW1lbnQgPSB0aGlzLmVsZW1lbnQuY2xvbmVOb2RlKHRydWUpO1xyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaChlbGVtZW50KTtcclxuXHJcbiAgICAgICAgdGhpcy5wcmVwYXJlRWxlbWVudChlbGVtZW50LCBwYXJhbXMpO1xyXG4gICAgICAgIHJldHVybiBlbGVtZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucHJlcGFyZUVsZW1lbnQgPSBmdW5jdGlvbiAoZWxlbWVudCwgcGFyYW1zID0geyBjaGlsZERldGFpbHM6IHsgYXR0cmlidXRlczoge30sIHByb3BlcnRpZXM6IHt9IH0sIGRldGFpbHM6IHsgYXR0cmlidXRlczoge30sIHByb3BlcnRpZXM6IHt9IH0gfSkge1xyXG4gICAgICAgIGlmIChwYXJhbXMuY2hpbGREZXRhaWxzICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBpZiAocGFyYW1zLmNoaWxkRGV0YWlscy5hdHRyaWJ1dGVzICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVOZXdFbGVtZW50Q2hpbGRBdHRyaWJ1dGVzKGVsZW1lbnQsIHBhcmFtcy5jaGlsZERldGFpbHMuYXR0cmlidXRlcyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChwYXJhbXMuY2hpbGREZXRhaWxzLnByb3BlcnRpZXMgIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZU5ld0VsZW1lbnRDaGlsZFByb3BlcnRpZXMoZWxlbWVudCwgcGFyYW1zLmNoaWxkRGV0YWlscy5wcm9wZXJ0aWVzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBhcmFtcy5kZXRhaWxzICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBpZiAocGFyYW1zLmRldGFpbHMuYXR0cmlidXRlcyAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlcyhwYXJhbXMuZGV0YWlscy5hdHRyaWJ1dGVzKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHBhcmFtcy5kZXRhaWxzLnByb3BlcnRpZXMgIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LnNldFByb3BlcnRpZXMocGFyYW1zLmRldGFpbHMucHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlTmV3RWxlbWVudENoaWxkUHJvcGVydGllcyhlbGVtZW50LCB0aGlzLmNoaWxkUHJvcGVydGllcyk7XHJcbiAgICAgICAgZWxlbWVudC5zZXRQcm9wZXJ0aWVzKHRoaXMucHJvcGVydGllcyk7XHJcblxyXG4gICAgICAgIHRoaXMubWFrZUNsb25lYWJsZShlbGVtZW50KTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnJlbW92ZUVsZW1lbnQgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgIGxldCBjaGlsZHJlbiA9IFtdO1xyXG4gICAgICAgIGxldCBwb3NpdGlvbiA9IHRoaXMuY2hpbGRyZW4uaW5kZXhPZihlbGVtZW50KTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3Q7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAocG9zaXRpb24gIT0gaSkge1xyXG4gICAgICAgICAgICAgICAgY2hpbGRyZW4ucHVzaCh0aGlzLmNoaWxkcmVuW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNoaWxkcmVuID0gY2hpbGRyZW47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jbG9uZUVsZW1lbnQgPSBmdW5jdGlvbiAocG9zaXRpb24sIHBhcmFtcyA9IHsgY2hpbGREZXRhaWxzOiB7IGF0dHJpYnV0ZXM6IHt9LCBwcm9wZXJ0aWVzOiB7fSB9LCBkZXRhaWxzOiB7IGF0dHJpYnV0ZXM6IHt9LCBwcm9wZXJ0aWVzOiB7fSB9IH0pIHtcclxuICAgICAgICBsZXQgZWxlbWVudCA9IHRoaXMuY2hpbGRyZW5bcG9zaXRpb25dLmNsb25lTm9kZSh0cnVlKTtcclxuICAgICAgICB0aGlzLmNoaWxkcmVuLnB1c2goZWxlbWVudCk7XHJcblxyXG4gICAgICAgIHRoaXMucHJlcGFyZUVsZW1lbnQoZWxlbWVudCwgcGFyYW1zKTtcclxuICAgICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm1ha2VDbG9uZWFibGUgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgIGxldCBwb3NpdGlvbiA9IHRoaXMuY2hpbGRyZW4uaW5kZXhPZihlbGVtZW50KTtcclxuICAgICAgICBpZiAocG9zaXRpb24gPT0gLTEpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZWxlbWVudC51bml0Q2xvbmUgPSAocGFyYW1zKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNsb25lRWxlbWVudChwb3NpdGlvbiwgcGFyYW1zKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmxlbmd0aCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zZXRQcm9wZXJ0aWVzID0gZnVuY3Rpb24gKHByb3BlcnRpZXMgPSB7fSkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuW2ldLnNldFByb3BlcnRpZXMocHJvcGVydGllcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zZXRQcm9wZXJ0aWVzKHByb3BlcnRpZXMpO1xyXG4gICAgICAgIGZvciAobGV0IGkgaW4gcHJvcGVydGllcykge1xyXG4gICAgICAgICAgICB0aGlzLnByb3BlcnRpZXNbaV0gPSBwcm9wZXJ0aWVzW2ldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmNzcyA9IGZ1bmN0aW9uIChzdHlsZSA9IHt9KSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5baV0uY3NzKHN0eWxlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmNzcyhzdHlsZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zZXRBdHRyaWJ1dGVzID0gZnVuY3Rpb24gKGF0dHJpYnV0ZXMgPSB7fSkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuW2ldLnNldEF0dHJpYnV0ZXMoYXR0cmlidXRlcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGVzKGF0dHJpYnV0ZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuYWRkQ2xhc3NlcyA9IGZ1bmN0aW9uIChjbGFzc2VzID0gJycpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbltpXS5hZGRDbGFzc2VzKGNsYXNzZXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkQ2xhc3NlcyhjbGFzc2VzKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnJlbW92ZUNsYXNzZXMgPSBmdW5jdGlvbiAoY2xhc3NlcyA9ICcnKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5baV0ucmVtb3ZlQ2xhc3NlcyhjbGFzc2VzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUNsYXNzZXMoY2xhc3Nlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5nZXRDaGlsZHJlbiA9IGZ1bmN0aW9uIChpZGVudGlmaWVyID0gJycsIGVsZW1lbnQsIHBvc2l0aW9ucyA9IFtdKSB7XHJcbiAgICAgICAgbGV0IGNvbGxlY3Rpb24gPSBbXTtcclxuICAgICAgICBsZXQgY2hpbGRyZW4gPSBlbGVtZW50LmZpbmRBbGwoaWRlbnRpZmllcik7Ly9nZXQgdGhlIGNoaWxkcmVuIG1hdGNoaW5nIGlkZW50aWZpZXIgaW4gZWFjaCBlbGVtZW50XHJcbiAgICAgICAgaWYgKGNoaWxkcmVuLmxlbmd0aCA+IDApIHsvL2lmIG5vdCBlbXB0eVxyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHBvc2l0aW9ucy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkcmVuW3Bvc2l0aW9uc1tqXV0gIT0gdW5kZWZpbmVkKSB7Ly9pZiBhdmFpbGFibGVcclxuICAgICAgICAgICAgICAgICAgICBjb2xsZWN0aW9uLnB1c2goY2hpbGRyZW5bcG9zaXRpb25zW2pdXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb247XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jaGlsZENzcyA9IGZ1bmN0aW9uIChpZGVudGlmaWVyID0gJycsIHN0eWxlID0ge30sIHBvc2l0aW9ucyA9IFtdKSB7XHJcbiAgICAgICAgcG9zaXRpb25zID0gdGhpcy5zZXRQb3NpdGlvbnMocG9zaXRpb25zKTtcclxuXHJcbiAgICAgICAgbGV0IGNoaWxkcmVuO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjaGlsZHJlbiA9IHRoaXMuZ2V0Q2hpbGRyZW4oaWRlbnRpZmllciwgdGhpcy5jaGlsZHJlbltpXSwgcG9zaXRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY2hpbGRyZW4ubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGNoaWxkcmVuW2pdLmNzcyhzdHlsZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNoaWxkcmVuID0gdGhpcy5nZXRDaGlsZHJlbihpZGVudGlmaWVyLCB0aGlzLmVsZW1lbnQsIHBvc2l0aW9ucyk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY2hpbGRyZW4ubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgY2hpbGRyZW5bal0uY3NzKHN0eWxlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zZXRDaGlsZFByb3BlcnRpZXMgPSBmdW5jdGlvbiAoaWRlbnRpZmllciA9ICcnLCBwcm9wZXJ0aWVzID0ge30sIHBvc2l0aW9ucyA9IFtdKSB7XHJcbiAgICAgICAgcG9zaXRpb25zID0gdGhpcy5zZXRQb3NpdGlvbnMocG9zaXRpb25zKTtcclxuXHJcbiAgICAgICAgbGV0IGNoaWxkcmVuO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjaGlsZHJlbiA9IHRoaXMuZ2V0Q2hpbGRyZW4oaWRlbnRpZmllciwgdGhpcy5jaGlsZHJlbltpXSwgcG9zaXRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY2hpbGRyZW4ubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGNoaWxkcmVuW2pdLnNldFByb3BlcnRpZXMocHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNoaWxkcmVuID0gdGhpcy5nZXRDaGlsZHJlbihpZGVudGlmaWVyLCB0aGlzLmVsZW1lbnQsIHBvc2l0aW9ucyk7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjaGlsZHJlbi5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBjaGlsZHJlbltqXS5zZXRQcm9wZXJ0aWVzKHByb3BlcnRpZXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jaGlsZFByb3BlcnRpZXNbaWRlbnRpZmllcl0gPSB0aGlzLmNoaWxkUHJvcGVydGllc1tpZGVudGlmaWVyXSB8fCBbXTtcclxuICAgICAgICB0aGlzLmNoaWxkUHJvcGVydGllc1tpZGVudGlmaWVyXS5wdXNoKHsgcHJvcGVydGllcywgcG9zaXRpb25zIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc2V0Q2hpbGRBdHRyaWJ1dGVzID0gZnVuY3Rpb24gKGlkZW50aWZpZXIgPSAnJywgYXR0cmlidXRlcyA9IHt9LCBwb3NpdGlvbnMgPSAnJykge1xyXG4gICAgICAgIHBvc2l0aW9ucyA9IHRoaXMuc2V0UG9zaXRpb25zKHBvc2l0aW9ucyk7XHJcblxyXG4gICAgICAgIGxldCBjaGlsZHJlbjtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY2hpbGRyZW4gPSB0aGlzLmdldENoaWxkcmVuKGlkZW50aWZpZXIsIHRoaXMuY2hpbGRyZW5baV0sIHBvc2l0aW9ucyk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNoaWxkcmVuLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBjaGlsZHJlbltqXS5zZXRBdHRyaWJ1dGVzKGF0dHJpYnV0ZXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjaGlsZHJlbiA9IHRoaXMuZ2V0Q2hpbGRyZW4oaWRlbnRpZmllciwgdGhpcy5lbGVtZW50LCBwb3NpdGlvbnMpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNoaWxkcmVuLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgIGNoaWxkcmVuW2pdLnNldEF0dHJpYnV0ZXMoYXR0cmlidXRlcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuYWRkQ2xhc3Nlc1RvQ2hpbGQgPSBmdW5jdGlvbiAoaWRlbnRpZmllciA9ICcnLCBjbGFzc2VzID0gJycsIHBvc2l0aW9ucyA9IFtdKSB7XHJcbiAgICAgICAgcG9zaXRpb25zID0gdGhpcy5zZXRQb3NpdGlvbnMocG9zaXRpb25zKTtcclxuXHJcbiAgICAgICAgbGV0IGNoaWxkcmVuO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjaGlsZHJlbiA9IHRoaXMuZ2V0Q2hpbGRyZW4oaWRlbnRpZmllciwgdGhpcy5jaGlsZHJlbltpXSwgcG9zaXRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY2hpbGRyZW4ubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGNoaWxkcmVuW2pdLmFkZENsYXNzZXMoY2xhc3Nlcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNoaWxkcmVuID0gdGhpcy5nZXRDaGlsZHJlbihpZGVudGlmaWVyLCB0aGlzLmVsZW1lbnQsIHBvc2l0aW9ucyk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY2hpbGRyZW4ubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgY2hpbGRyZW5bal0uYWRkQ2xhc3NlcyhjbGFzc2VzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5yZW1vdmVDbGFzc2VzRnJvbUNoaWxkID0gZnVuY3Rpb24gKGlkZW50aWZpZXIgPSAnJywgY2xhc3NlcyA9ICcnLCBwb3NpdGlvbnMgPSBbXSkge1xyXG4gICAgICAgIHBvc2l0aW9ucyA9IHRoaXMuc2V0UG9zaXRpb25zKHBvc2l0aW9ucyk7XHJcblxyXG4gICAgICAgIGxldCBjaGlsZHJlbjtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY2hpbGRyZW4gPSB0aGlzLmdldENoaWxkcmVuKGlkZW50aWZpZXIsIHRoaXMuY2hpbGRyZW5baV0sIHBvc2l0aW9ucyk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNoaWxkcmVuLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBjaGlsZHJlbltqXS5yZW1vdmVDbGFzc2VzKGNsYXNzZXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjaGlsZHJlbiA9IHRoaXMuZ2V0Q2hpbGRyZW4oaWRlbnRpZmllciwgdGhpcy5lbGVtZW50LCBwb3NpdGlvbnMpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNoaWxkcmVuLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgIGNoaWxkcmVuW2pdLnJlbW92ZUNsYXNzZXMoY2xhc3Nlcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNoYWRvdzsiXX0=
