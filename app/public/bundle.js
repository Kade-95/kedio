(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const {Base} = require('./../../browser');

window.base = new Base(window);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL1VzZXJzLzIzNDgxL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImFwcC9zcmMvbWFpbi5qcyIsImJyb3dzZXIuanMiLCJjbGFzc2VzL0Jhc2UuanMiLCJjbGFzc2VzL0NvbXBvbmVudHMuanMiLCJjbGFzc2VzL0Z1bmMuanMiLCJjbGFzc2VzL0pTRWxlbWVudHMuanMiLCJjbGFzc2VzL01hdHJpeC5qcyIsImNsYXNzZXMvTmV1cmFsTmV0d29yay5qcyIsImNsYXNzZXMvUGVyaW9kLmpzIiwiY2xhc3Nlcy9UZW1wbGF0ZS5qcyIsImNsYXNzZXMvVHJlZS5qcyIsImNsYXNzZXMvVHJlZUV2ZW50LmpzIiwiZnVuY3Rpb25zL0FuYWx5c2lzTGlicmFyeS5qcyIsImZ1bmN0aW9ucy9BcHBMaWJyYXJ5LmpzIiwiZnVuY3Rpb25zL0FycmF5TGlicmFyeS5qcyIsImZ1bmN0aW9ucy9Db2xvclBpY2tlci5qcyIsImZ1bmN0aW9ucy9Db21wcmVzc2lvbi5qcyIsImZ1bmN0aW9ucy9JbmRleGVkTGlicmFyeS5qcyIsImZ1bmN0aW9ucy9NYXRoc0xpYnJhcnkuanMiLCJmdW5jdGlvbnMvT2JqZWN0c0xpYnJhcnkuanMiLCJmdW5jdGlvbnMvU2hhZG93LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3Z6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNXFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbGJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4VkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbmlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1a0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3B5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcGFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaFNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNvbnN0IHtCYXNlfSA9IHJlcXVpcmUoJy4vLi4vLi4vYnJvd3NlcicpO1xyXG5cclxud2luZG93LmJhc2UgPSBuZXcgQmFzZSh3aW5kb3cpOyIsImNvbnN0IEJhc2UgPSByZXF1aXJlKCcuL2NsYXNzZXMvQmFzZScpO1xyXG5jb25zdCBDb21wb25lbnRzID0gcmVxdWlyZSgnLi9jbGFzc2VzL0NvbXBvbmVudHMnKTtcclxuY29uc3QgRnVuYyA9IHJlcXVpcmUoJy4vY2xhc3Nlcy9GdW5jJyk7XHJcbmNvbnN0IEpTRWxlbWVudHMgPSByZXF1aXJlKCcuL2NsYXNzZXMvSlNFbGVtZW50cycpO1xyXG5jb25zdCBNYXRyaXggPSByZXF1aXJlKCcuL2NsYXNzZXMvTWF0cml4Jyk7XHJcbmNvbnN0IE5ldXJhbE5ldHdvcmsgPSByZXF1aXJlKCcuL2NsYXNzZXMvTmV1cmFsTmV0d29yaycpO1xyXG5jb25zdCBQZXJpb2QgPSByZXF1aXJlKCcuL2NsYXNzZXMvUGVyaW9kJyk7XHJcbmNvbnN0IFRlbXBsYXRlID0gcmVxdWlyZSgnLi9jbGFzc2VzL1RlbXBsYXRlJyk7XHJcbmNvbnN0IFRyZWUgPSByZXF1aXJlKCcuL2NsYXNzZXMvVHJlZScpO1xyXG5jb25zdCBBcHBMaWJyYXJ5ID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMvQXBwTGlicmFyeScpO1xyXG5jb25zdCBBbmFseXNpc0xpYnJhcnkgPSByZXF1aXJlKCcuL2Z1bmN0aW9ucy9BbmFseXNpc0xpYnJhcnknKTtcclxuY29uc3QgQXJyYXlMaWJyYXJ5ID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMvQXJyYXlMaWJyYXJ5Jyk7XHJcbmNvbnN0IENvbXByZXNzaW9uID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMvQ29tcHJlc3Npb24nKTtcclxuY29uc3QgTWF0aHNMaWJyYXJ5ID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMvTWF0aHNMaWJyYXJ5Jyk7XHJcbmNvbnN0IFNoYWRvdyA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zL1NoYWRvdycpO1xyXG5jb25zdCBPYmplY3RzTGlicmFyeSA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zL09iamVjdHNMaWJyYXJ5Jyk7XHJcbmNvbnN0IEluZGV4ZWRMaWJyYXJ5ID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMvSW5kZXhlZExpYnJhcnknKTtcclxuY29uc3QgQ29sb3JQaWNrZXIgPSByZXF1aXJlKCcuL2Z1bmN0aW9ucy9Db2xvclBpY2tlcicpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBCYXNlLFxyXG4gICAgRnVuYyxcclxuICAgIE5ldXJhbE5ldHdvcmssXHJcbiAgICBNYXRyaXgsXHJcbiAgICBUZW1wbGF0ZSxcclxuICAgIENvbXBvbmVudHMsXHJcbiAgICBDb21wcmVzc2lvbixcclxuICAgIENvbG9yUGlja2VyLFxyXG4gICAgSW5kZXhlZExpYnJhcnksXHJcbiAgICBBcHBMaWJyYXJ5LFxyXG4gICAgQXJyYXlMaWJyYXJ5LFxyXG4gICAgQW5hbHlzaXNMaWJyYXJ5LFxyXG4gICAgT2JqZWN0c0xpYnJhcnksXHJcbiAgICBNYXRoc0xpYnJhcnksXHJcbiAgICBTaGFkb3csXHJcbiAgICBUcmVlLFxyXG4gICAgUGVyaW9kLFxyXG4gICAgSlNFbGVtZW50cyxcclxufVxyXG4iLCJjb25zdCBDb21wb25lbnRzID0gcmVxdWlyZSgnLi9Db21wb25lbnRzJyk7XHJcbmNvbnN0IENvbG9yUGlja2VyID0gcmVxdWlyZSgnLi4vZnVuY3Rpb25zL0NvbG9yUGlja2VyJyk7XHJcbmNvbnN0IEFycmF5TGlicmFyeSA9IHJlcXVpcmUoJy4vLi4vZnVuY3Rpb25zL0FycmF5TGlicmFyeScpO1xyXG5jb25zdCBPYmplY3RzTGlicmFyeSA9IHJlcXVpcmUoJy4vLi4vZnVuY3Rpb25zL09iamVjdHNMaWJyYXJ5Jyk7XHJcblxyXG5jbGFzcyBFbXB0eSB7XHJcbn1cclxuXHJcbmNsYXNzIEJhc2UgZXh0ZW5kcyBDb21wb25lbnRzIHtcclxuICAgIGNvbnN0cnVjdG9yKHRoZVdpbmRvdyA9IEVtcHR5KSB7XHJcbiAgICAgICAgc3VwZXIodGhlV2luZG93KTtcclxuICAgICAgICB0aGlzLmNvbG9ySGFuZGxlciA9IG5ldyBDb2xvclBpY2tlcigpO1xyXG4gICAgICAgIHRoaXMuYXJyYXkgPSAgbmV3IEFycmF5TGlicmFyeSgpO1xyXG4gICAgICAgIHRoaXMub2JqZWN0ID0gbmV3IE9iamVjdHNMaWJyYXJ5KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQmFzZTtcclxuIiwiY29uc3QgVGVtcGxhdGUgPSByZXF1aXJlKCcuL1RlbXBsYXRlJyk7XHJcbmNsYXNzIEVtcHR5IHtcclxufVxyXG5cclxuY2xhc3MgQ29tcG9uZW50cyBleHRlbmRzIFRlbXBsYXRlIHtcclxuICAgIGNvbnN0cnVjdG9yKHRoZVdpbmRvdyA9IEVtcHR5KSB7XHJcbiAgICAgICAgc3VwZXIodGhlV2luZG93KTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVUYWIocGFyYW1zID0geyB0aXRsZXM6IFtdIH0pIHtcclxuICAgICAgICB2YXIgdGFiVGl0bGUgPSB0aGlzLmNyZWF0ZUVsZW1lbnQoeyBlbGVtZW50OiAndWwnLCBhdHRyaWJ1dGVzOiB7IGNsYXNzOiAndGFiJyB9IH0pO1xyXG4gICAgICAgIHBhcmFtcy52aWV3LmFwcGVuZCh0YWJUaXRsZSk7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgb2YgcGFyYW1zLnRpdGxlcykge1xyXG4gICAgICAgICAgICB0YWJUaXRsZS5hcHBlbmQoXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZUVsZW1lbnQoeyBlbGVtZW50OiAnbGknLCBhdHRyaWJ1dGVzOiB7IGNsYXNzOiAndGFiLXRpdGxlJyB9LCB0ZXh0OiBpIH0pXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRhYlRpdGxlLmZpbmRBbGwoJ2xpJykuZm9yRWFjaChub2RlID0+IHtcclxuICAgICAgICAgICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciB1cmwgPSB0aGlzLnVybFNwbGl0dGVyKGxvY2F0aW9uLmhyZWYpO1xyXG4gICAgICAgICAgICAgICAgdXJsLnZhcnMudGFiID0gbm9kZS50ZXh0Q29udGVudC50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICAgICAgcm91dGVyLnJlbmRlcih7IHVybDogJz8nICsgdGhpcy51cmxTcGxpdHRlcih0aGlzLnVybE1lcmdlcih1cmwsICd0YWInKSkucXVlcmllcyB9KTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGNlbGwocGFyYW1zID0geyBlbGVtZW50OiAnaW5wdXQnLCBhdHRyaWJ1dGVzOiB7fSwgbmFtZTogJycsIGRhdGFBdHRyaWJ1dGVzOiB7fSwgdmFsdWU6ICcnLCB0ZXh0OiAnJywgaHRtbDogJycsIGVkaXQ6ICcnIH0pIHtcclxuICAgICAgICAvL3NldCB0aGUgY2VsbC1kYXRhIGlkXHJcbiAgICAgICAgdmFyIGlkID0gdGhpcy5zdHJpbmdSZXBsYWNlKHBhcmFtcy5uYW1lLCAnICcsICctJykgKyAnLWNlbGwnO1xyXG5cclxuICAgICAgICAvL2NyZWF0ZSB0aGUgY2VsbCBsYWJlbFxyXG4gICAgICAgIHZhciBsYWJlbCA9IHRoaXMuY3JlYXRlRWxlbWVudCh7IGVsZW1lbnQ6ICdsYWJlbCcsIGF0dHJpYnV0ZXM6IHsgY2xhc3M6ICdjZWxsLWxhYmVsJyB9LCB0ZXh0OiBwYXJhbXMubmFtZSB9KTtcclxuXHJcbiAgICAgICAgLy9jZWxsIGF0dHJpYnV0ZXNcclxuICAgICAgICBwYXJhbXMuYXR0cmlidXRlcyA9ICh0aGlzLmlzc2V0KHBhcmFtcy5hdHRyaWJ1dGVzKSkgPyBwYXJhbXMuYXR0cmlidXRlcyA6IHt9O1xyXG5cclxuICAgICAgICAvL2NlbGwgZGF0YSBhdHRyaWJ1dGVzXHJcbiAgICAgICAgcGFyYW1zLmRhdGFBdHRyaWJ1dGVzID0gKHRoaXMuaXNzZXQocGFyYW1zLmRhdGFBdHRyaWJ1dGVzKSkgPyBwYXJhbXMuZGF0YUF0dHJpYnV0ZXMgOiB7fTtcclxuICAgICAgICBwYXJhbXMuZGF0YUF0dHJpYnV0ZXMuaWQgPSBpZDtcclxuXHJcbiAgICAgICAgdmFyIGNvbXBvbmVudHM7XHJcblxyXG4gICAgICAgIC8vc2V0IHRoZSBwcm9wZXJ0aWVzIG9mIGNlbGwgZGF0YVxyXG4gICAgICAgIGlmIChwYXJhbXMuZWxlbWVudCA9PSAnc2VsZWN0Jykgey8vY2hlY2sgaWYgY2VsbCBkYXRhIGlzIGluIHNlbGVjdCBlbGVtZW50XHJcbiAgICAgICAgICAgIGNvbXBvbmVudHMgPSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50OiBwYXJhbXMuZWxlbWVudCwgYXR0cmlidXRlczogcGFyYW1zLmRhdGFBdHRyaWJ1dGVzLCBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgICAgICAgIHsgZWxlbWVudDogJ29wdGlvbicsIGF0dHJpYnV0ZXM6IHsgZGlzYWJsZWQ6ICcnLCBzZWxlY3RlZDogJycgfSwgdGV4dDogYFNlbGVjdCAke3BhcmFtcy5uYW1lfWAsIHZhbHVlOiAnJyB9Ly9zZXQgdGhlIGRlZmF1bHQgb3B0aW9uXHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb21wb25lbnRzID0geyBlbGVtZW50OiBwYXJhbXMuZWxlbWVudCwgYXR0cmlidXRlczogcGFyYW1zLmRhdGFBdHRyaWJ1dGVzLCB0ZXh0OiBwYXJhbXMudmFsdWUgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzc2V0KHBhcmFtcy52YWx1ZSkpIGNvbXBvbmVudHMuYXR0cmlidXRlcy52YWx1ZSA9IHBhcmFtcy52YWx1ZTtcclxuICAgICAgICBpZiAodGhpcy5pc3NldChwYXJhbXMub3B0aW9ucykpIGNvbXBvbmVudHMub3B0aW9ucyA9IHBhcmFtcy5vcHRpb25zO1xyXG5cclxuICAgICAgICBsZXQgZGF0YTtcclxuICAgICAgICBpZiAocGFyYW1zLmVsZW1lbnQgaW5zdGFuY2VvZiBFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIGRhdGEgPSBwYXJhbXMuZWxlbWVudDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGRhdGEgPSB0aGlzLmNyZWF0ZUVsZW1lbnQoY29tcG9uZW50cyk7Ly9jcmVhdGUgdGhlIGNlbGwtZGF0YVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZGF0YS5jbGFzc0xpc3QuYWRkKCdjZWxsLWRhdGEnKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNzZXQocGFyYW1zLnZhbHVlKSkgZGF0YS52YWx1ZSA9IHBhcmFtcy52YWx1ZTtcclxuXHJcbiAgICAgICAgLy9jcmVhdGUgY2VsbCBlbGVtZW50XHJcbiAgICAgICAgbGV0IGNlbGwgPSB0aGlzLmNyZWF0ZUVsZW1lbnQoeyBlbGVtZW50OiAnZGl2JywgYXR0cmlidXRlczogcGFyYW1zLmF0dHJpYnV0ZXMsIGNoaWxkcmVuOiBbbGFiZWwsIGRhdGFdIH0pO1xyXG5cclxuICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoJ2NlbGwnKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNzZXQocGFyYW1zLnRleHQpKSBkYXRhLnRleHRDb250ZW50ID0gcGFyYW1zLnRleHQ7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzc2V0KHBhcmFtcy5odG1sKSkgZGF0YS5pbm5lckhUTUwgPSBwYXJhbXMuaHRtbDtcclxuXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzc2V0KHBhcmFtcy5saXN0KSkge1xyXG4gICAgICAgICAgICBjZWxsLm1ha2VFbGVtZW50KHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQ6ICdkYXRhbGlzdCcsIGF0dHJpYnV0ZXM6IHsgaWQ6IGAke2lkfS1saXN0YCB9LCBvcHRpb25zOiBwYXJhbXMubGlzdC5zb3J0KClcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBkYXRhLnNldEF0dHJpYnV0ZSgnbGlzdCcsIGAke2lkfS1saXN0YCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgZWRpdDtcclxuICAgICAgICBpZiAodGhpcy5pc3NldChwYXJhbXMuZWRpdCkpIHtcclxuICAgICAgICAgICAgZWRpdCA9IGNlbGwubWFrZUVsZW1lbnQoe1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudDogJ2knLCBhdHRyaWJ1dGVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M6IGAke3BhcmFtcy5lZGl0fWAsICdkYXRhLWljb24nOiAnZmFzLCBmYS1wZW4nLCBzdHlsZTogeyBjdXJzb3I6ICdwb2ludGVyJywgYmFja2dyb3VuZENvbG9yOiAndmFyKC0tcHJpbWFyeS1jb2xvciknLCB3aWR0aDogJzFlbScsIGhlaWdodDogJ2F1dG8nLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgdG9wOiAnMHB4JywgcmlnaHQ6ICcwcHgnLCBwYWRkaW5nOiAnLjE1ZW0nIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGNlbGwuY3NzKHsgcG9zaXRpb246ICdyZWxhdGl2ZScgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjZWxsLm1ha2VFbGVtZW50KHtcclxuICAgICAgICAgICAgZWxlbWVudDogJ3N0eWxlJywgdGV4dDogYFxyXG4gICAgICAgIC5jZWxsIHtcclxuICAgICAgICAgICAgZGlzcGxheTogaW5saW5lLWdyaWQ7XHJcbiAgICAgICAgICAgIG1hcmdpbjogLjVlbTtcclxuICAgICAgICAgICAgZm9udC1zaXplOiAxZW07XHJcbiAgICAgICAgICAgIGxldHRlci1zcGFjaW5nOiAuMWVtO1xyXG4gICAgICAgICAgICBmb250LXdlaWdodDogMzAwO1xyXG4gICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCBncmF5O1xyXG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiAxMHB4O1xyXG4gICAgICAgICAgICBvdmVyZmxvdzogYXV0bztcclxuICAgICAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgICAgICAgICBtaW4td2lkdGg6IDEwMHB4O1xyXG4gICAgICAgICAgICBvdmVyZmxvdy15OiBoaWRkZW47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC5jZWxsOmhvdmVyLCAuY2VsbDpmb2N1cyB7XHJcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IHVuc2V0O1xyXG4gICAgICAgICAgICBib3gtc2hhZG93OiB2YXIoLS1wcmltYXJ5LXNoYWRvdyk7XHJcbiAgICAgICAgICAgIHRyYW5zaXRpb24tZHVyYXRpb246IC4ycztcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgLmNlbGwtbGFiZWwge1xyXG4gICAgICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1zZWNvbmRhcnktY29sb3IpO1xyXG4gICAgICAgICAgICBjb2xvcjogdmFyKC0tcHJpbWFyeS1jb2xvcik7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDAuM2VtO1xyXG4gICAgICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA0MDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC5jZWxsLWRhdGF7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDAuM2VtO1xyXG4gICAgICAgICAgICBvdXRsaW5lOiBub25lO1xyXG4gICAgICAgICAgICBib3JkZXI6IG5vbmU7XHJcbiAgICAgICAgICAgIGNvbG9yOiB2YXIoLS1zZWNvbmRhcnktY29sb3IpO1xyXG4gICAgICAgICAgICBtaW4taGVpZ2h0OiAzMHB4O1xyXG4gICAgICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICAgICAgICAgIGp1c3RpZnktc2VsZjogY2VudGVyO1xyXG4gICAgICAgICAgICBtYXgtd2lkdGg6IDMwMHB4O1xyXG4gICAgICAgICAgICBtYXgtaGVpZ2h0OiAxMDBweDtcclxuICAgICAgICAgICAgb3ZlcmZsb3c6IGF1dG87XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC5jZWxsLWRhdGE6aG92ZXIsIC5jZWxsLWRhdGE6Zm9jdXMge1xyXG4gICAgICAgICAgICBjdXJzb3I6IHRleHQ7XHJcbiAgICAgICAgICAgIHRyYW5zaXRpb24tZHVyYXRpb246IDFzO1xyXG4gICAgICAgIH1gfSlcclxuICAgICAgICByZXR1cm4gY2VsbDtcclxuICAgIH1cclxuXHJcbiAgICBtZXNzYWdlKHBhcmFtcyA9IHsgbGluazogJycsIHRleHQ6ICcnLCB0ZW1wOiAwIH0pIHtcclxuICAgICAgICB2YXIgbWUgPSB0aGlzLmNyZWF0ZUVsZW1lbnQoe1xyXG4gICAgICAgICAgICBlbGVtZW50OiAnc3BhbicsIGF0dHJpYnV0ZXM6IHsgY2xhc3M6ICdhbGVydCcgfSwgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlRWxlbWVudCh7IGVsZW1lbnQ6ICdhJywgdGV4dDogcGFyYW1zLnRleHQsIGF0dHJpYnV0ZXM6IHsgY2xhc3M6ICd0ZXh0JywgaHJlZjogcGFyYW1zLmxpbmsgfSB9KSxcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlRWxlbWVudCh7IGVsZW1lbnQ6ICdzcGFuJywgYXR0cmlidXRlczogeyBjbGFzczogJ2Nsb3NlJyB9IH0pXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNzZXQocGFyYW1zLnRlbXApKSB7XHJcbiAgICAgICAgICAgIHZhciB0aW1lID0gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBtZS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lKTtcclxuICAgICAgICAgICAgfSwgKHBhcmFtcy50ZW1wICE9ICcnKSA/IHBhcmFtcy50aW1lICogMTAwMCA6IDUwMDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbWUuZmluZCgnLmNsb3NlJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XHJcbiAgICAgICAgICAgIG1lLnJlbW92ZSgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBib2R5LmZpbmQoJyNub3RpZmljYXRpb24tYmxvY2snKS5hcHBlbmQobWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZVRhYmxlKHBhcmFtcyA9IHsgdGl0bGU6ICcnLCBjb250ZW50czoge30sIHByb2plY3Rpb246IHt9LCByZW5hbWU6IHt9LCBzb3J0OiBmYWxzZSwgc2VhcmNoOiBmYWxzZSwgZmlsdGVyOiBbXSB9KSB7XHJcbiAgICAgICAgLy9jcmVhdGUgdGhlIHRhYmxlIGVsZW1lbnQgICBcclxuICAgICAgICBsZXQgaGVhZGVycyA9IFtdLC8vdGhlIGhlYWRlcnNcclxuICAgICAgICAgICAgY29sdW1ucyA9IHt9LFxyXG4gICAgICAgICAgICBjb2x1bW5Db3VudCA9IDAsXHJcbiAgICAgICAgICAgIGksXHJcbiAgICAgICAgICAgIHRhYmxlID0gdGhpcy5jcmVhdGVFbGVtZW50KFxyXG4gICAgICAgICAgICAgICAgeyBlbGVtZW50OiAnZGl2JywgYXR0cmlidXRlczogcGFyYW1zLmF0dHJpYnV0ZXMgfVxyXG4gICAgICAgICAgICApOy8vY3JlYXRlIHRoZSB0YWJsZSBcclxuXHJcbiAgICAgICAgdGFibGUuY2xhc3NMaXN0LmFkZCgna2VkaW8tdGFibGUnKTsvL2FkZCB0YWJsZSB0byB0aGUgY2xhc3NcclxuXHJcbiAgICAgICAgZm9yIChsZXQgY29udGVudCBvZiBwYXJhbXMuY29udGVudHMpIHsvL2xvb3AgdGhyb3VnaCB0aGUganNvbiBhcnJheVxyXG4gICAgICAgICAgICBpID0gcGFyYW1zLmNvbnRlbnRzLmluZGV4T2YoY29udGVudCk7Ly9nZXQgdGhlIHBvc2l0aW9uIG9mIHRoZSByb3dcclxuICAgICAgICAgICAgZm9yIChsZXQgbmFtZSBpbiBjb250ZW50KSB7Ly9sb29wIHRocm91Z2ggdGhlIHJvd1xyXG4gICAgICAgICAgICAgICAgaWYgKGhlYWRlcnMuaW5kZXhPZihuYW1lKSA9PSAtMSkgey8vYWRkIHRvIGhlYWRlcnNcclxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzLnB1c2gobmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uc1tuYW1lXSA9IHRhYmxlLm1ha2VFbGVtZW50KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudDogJ2NvbHVtbicsIGF0dHJpYnV0ZXM6IHsgY2xhc3M6ICdrZWRpby10YWJsZS1jb2x1bW4nLCAnZGF0YS1uYW1lJzogbmFtZSB9LCBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQ6ICdzcGFuJywgYXR0cmlidXRlczogeyBjbGFzczogJ2tlZGlvLXRhYmxlLWNvbHVtbi10aXRsZScsICdkYXRhLW5hbWUnOiBuYW1lIH0sIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgZWxlbWVudDogJ3AnLCBhdHRyaWJ1dGVzOiB7IGNsYXNzOiAna2VkaW8tdGFibGUtY29sdW1uLXRpdGxlLXRleHQnIH0sIHRleHQ6IG5hbWUgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGVsZW1lbnQ6ICdkaXYnLCBhdHRyaWJ1dGVzOiB7IGNsYXNzOiAna2VkaW8tdGFibGUtY29sdW1uLWNvbnRlbnRzJyB9IH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc3NldChwYXJhbXMuc29ydCkpIHsvL21ha2Ugc29ydGFibGUgaWYgbmVlZGVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbnNbbmFtZV0uZmluZCgnLmtlZGlvLXRhYmxlLWNvbHVtbi10aXRsZScpLm1ha2VFbGVtZW50KHsgZWxlbWVudDogJ2knLCBhdHRyaWJ1dGVzOiB7IGNsYXNzOiAna2VkaW8tdGFibGUtY29sdW1uLXRpdGxlLXNvcnQnLCAnZGF0YS1pY29uJzogJ2ZhcywgZmEtYXJyb3ctZG93bicgfSB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHBhcmFtcy5wcm9qZWN0aW9uID0gcGFyYW1zLnByb2plY3Rpb24gfHwge307XHJcblxyXG4gICAgICAgIGxldCBoaWRlID0gT2JqZWN0LnZhbHVlcyhwYXJhbXMucHJvamVjdGlvbikuaW5jbHVkZXMoMSk7XHJcblxyXG5cclxuICAgICAgICBmb3IgKGxldCBuYW1lIG9mIGhlYWRlcnMpIHsvL2xvb3AgdGhyb3VnaCB0aGUgaGVhZGVycyBhbmQgYWRkIHRoZSBjb250ZW50cyBcclxuICAgICAgICAgICAgZm9yIChsZXQgY29udGVudCBvZiBwYXJhbXMuY29udGVudHMpIHtcclxuICAgICAgICAgICAgICAgIGkgPSBwYXJhbXMuY29udGVudHMuaW5kZXhPZihjb250ZW50KTtcclxuICAgICAgICAgICAgICAgIGNvbHVtbnNbbmFtZV0uZmluZCgnLmtlZGlvLXRhYmxlLWNvbHVtbi1jb250ZW50cycpLm1ha2VFbGVtZW50KHsgZWxlbWVudDogJ3NwYW4nLCBhdHRyaWJ1dGVzOiB7IGNsYXNzOiAna2VkaW8tdGFibGUtY29sdW1uLWNlbGwnLCAnZGF0YS1uYW1lJzogbmFtZSwgJ2RhdGEtdmFsdWUnOiBjb250ZW50W25hbWVdIHx8ICcnLCAnZGF0YS1yb3cnOiBpIH0sIGh0bWw6IGNvbnRlbnRbbmFtZV0gfHwgJycgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChwYXJhbXMucHJvamVjdGlvbltuYW1lXSA9PSAtMSB8fCAoaGlkZSAmJiAhdGhpcy5pc3NldChwYXJhbXMucHJvamVjdGlvbltuYW1lXSkpKSB7XHJcbiAgICAgICAgICAgICAgICBjb2x1bW5zW25hbWVdLmNzcyh7IGRpc3BsYXk6ICdub25lJyB9KTtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb2x1bW5Db3VudCsrOy8vY291bnQgdGhlIGNvbHVtbiBsZW5ndGhcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRhYmxlLmNzcyh7IGdyaWRUZW1wbGF0ZUNvbHVtbnM6IGByZXBlYXQoJHtjb2x1bW5Db3VudH0sIDFmcilgIH0pO1xyXG5cclxuICAgICAgICBsZXQgdGFibGVDb250YWluZXIgPSB0aGlzLmNyZWF0ZUVsZW1lbnQoey8vY3JlYXRlIHRhYmxlIGNvbnRhaW5lciBhbmQgdGl0bGVcclxuICAgICAgICAgICAgZWxlbWVudDogJ2RpdicsIGF0dHJpYnV0ZXM6IHsgY2xhc3M6ICdrZWRpby10YWJsZS1jb250YWluZXInIH0sIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudDogJ3NwYW4nLCBhdHRyaWJ1dGVzOiB7IGNsYXNzOiAna2VkaW8tdGFibGUtdGl0bGVhbmRzZWFyY2gnIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB0YWJsZVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxldCB0aXRsZUNvdW50ID0gMDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNzZXQocGFyYW1zLnRpdGxlKSkgey8vIGNyZWF0ZSB0aGUgdGl0bGUgdGV4dCBpZiBuZWVkZWRcclxuICAgICAgICAgICAgdGFibGVDb250YWluZXIuZmluZCgnLmtlZGlvLXRhYmxlLXRpdGxlYW5kc2VhcmNoJykubWFrZUVsZW1lbnQoeyBlbGVtZW50OiAnaDUnLCBhdHRyaWJ1dGVzOiB7IGNsYXNzOiAna2VkaW8tdGFibGUtdGl0bGUnIH0sIHRleHQ6IHBhcmFtcy50aXRsZSB9KTtcclxuICAgICAgICAgICAgdGl0bGVDb3VudCsrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNzZXQocGFyYW1zLnNvcnQpKSB7Ly8gc2V0IHRoZSBkYXRhIGZvciBzb3J0aW5nXHJcbiAgICAgICAgICAgIHRhYmxlLmRhdGFzZXQuc29ydCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5pc3NldChwYXJhbXMuc2VhcmNoKSkgey8vIGNyZWF0ZSB0aGUgc2VhcmNoIGFyZWFcclxuICAgICAgICAgICAgdGFibGVDb250YWluZXIuZmluZCgnLmtlZGlvLXRhYmxlLXRpdGxlYW5kc2VhcmNoJykubWFrZUVsZW1lbnQoeyBlbGVtZW50OiAnaW5wdXQnLCBhdHRyaWJ1dGVzOiB7IGNsYXNzOiAna2VkaW8tdGFibGUtc2VhcmNoJywgcGxhY2VIb2xkZXI6ICdTZWFyY2ggdGFibGUuLi4nIH0gfSk7XHJcbiAgICAgICAgICAgIHRpdGxlQ291bnQrKztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzc2V0KHBhcmFtcy5maWx0ZXIpKSB7Ly9jcmVhdGUgdGhlIGZpbHRlciBhcmVhXHJcbiAgICAgICAgICAgIHRhYmxlQ29udGFpbmVyLmZpbmQoJy5rZWRpby10YWJsZS10aXRsZWFuZHNlYXJjaCcpLm1ha2VFbGVtZW50KHsgZWxlbWVudDogJ3NlbGVjdCcsIGF0dHJpYnV0ZXM6IHsgY2xhc3M6ICdrZWRpby10YWJsZS1maWx0ZXInIH0sIG9wdGlvbnM6IHBhcmFtcy5maWx0ZXIgfSk7XHJcbiAgICAgICAgICAgIHRpdGxlQ291bnQrKztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChwYXJhbXMuY29udGVudHMubGVuZ3RoID09IDApIHsvLyBOb3RpZnkgaWYgdGFibGUgaXMgZW1wdHlcclxuICAgICAgICAgICAgdGFibGUudGV4dENvbnRlbnQgPSAnRW1wdHkgVGFibGUnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGFibGVDb250YWluZXIubWFrZUVsZW1lbnQoXHJcbiAgICAgICAgICAgIFt7Ly8gYXJyYW5nZSB0aGUgdGFibGUgdGl0bGVcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQ6ICdzdHlsZScsIHRleHQ6IGBcclxuICAgICAgICAgICAgQG1lZGlhKG1pbi13aWR0aDogNzAwcHgpIHtcclxuICAgICAgICAgICAgICAgIC5rZWRpby10YWJsZS10aXRsZWFuZHNlYXJjaCB7XHJcbiAgICAgICAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KCR7dGl0bGVDb3VudH0sIDFmcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgIGB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50OiAnc3R5bGUnLCB0ZXh0OiBgLmtlZGlvLXRhYmxlLWNvbnRhaW5lciB7XHJcbiAgICAgICAgICAgIHdpZHRoOiB2YXIoLS1tYXRjaC1wYXJlbnQpO1xyXG4gICAgICAgICAgICBwYWRkaW5nOiAwZW0gMWVtO1xyXG4gICAgICAgICAgICBoZWlnaHQ6IHZhcigtLWZpbGwtcGFyZW50KTtcclxuICAgICAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICAgICAgICAgICAgZGlzcGxheTogZ3JpZDtcclxuICAgICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiBtYXgtY29udGVudCAxZnI7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIC5rZWRpby10YWJsZS10aXRsZWFuZHNlYXJjaCB7XHJcbiAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDFlbTtcclxuICAgICAgICAgICAgZGlzcGxheTogZ3JpZDtcclxuICAgICAgICAgICAgZ3JpZC1nYXA6IDFlbTtcclxuICAgICAgICAgICAgcGFkZGluZzogLjVlbTtcclxuICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgICAgICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIGxpZ2h0Z3JheTtcclxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tcHJpbWFyeS1jb2xvcik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIC5rZWRpby10YWJsZS10aXRsZSB7XHJcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiAxMDAwO1xyXG4gICAgICAgICAgICBmb250LXNpemU6IDEuNWVtO1xyXG4gICAgICAgICAgICB0ZXh0LXRyYW5zZm9ybTogY2FwaXRhbGl6ZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIFxyXG4gICAgICAgICAgLmtlZGlvLXRhYmxlLXNlYXJjaCB7XHJcbiAgICAgICAgICAgIGp1c3RpZnktc2VsZjogZmxleC1lbmQ7XHJcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDEwcHg7XHJcbiAgICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLXNlY29uZGFyeS1jb2xvcik7XHJcbiAgICAgICAgICAgIG91dGxpbmU6IG5vbmU7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDFlbTtcclxuICAgICAgICAgICAgd2lkdGg6IHZhcigtLW1hdGNoLXBhcmVudCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIC5rZWRpby10YWJsZS1maWx0ZXIge1xyXG4gICAgICAgICAgICBqdXN0aWZ5LXNlbGY6IGZsZXgtZW5kO1xyXG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiAxMHB4O1xyXG4gICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1zZWNvbmRhcnktY29sb3IpO1xyXG4gICAgICAgICAgICBvdXRsaW5lOiBub25lO1xyXG4gICAgICAgICAgICBwYWRkaW5nOiAxZW07XHJcbiAgICAgICAgICAgIHdpZHRoOiB2YXIoLS1tYXRjaC1wYXJlbnQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAua2VkaW8tdGFibGUge1xyXG4gICAgICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMWVtO1xyXG4gICAgICAgICAgICBmb250LXdlaWdodDogMzAwO1xyXG4gICAgICAgICAgICB3aWR0aDogdmFyKC0tbWF0Y2gtcGFyZW50KTtcclxuICAgICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiAxZnI7XHJcbiAgICAgICAgICAgIG92ZXJmbG93OiBhdXRvO1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBncmlkO1xyXG4gICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1zZWNvbmRhcnktY29sb3IpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAua2VkaW8tdGFibGUgLmtlZGlvLXRhYmxlLWNvbHVtbntcclxuICAgICAgICAgICAgaGVpZ2h0OiB2YXIoLS1maWxsLXBhcmVudCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIC5rZWRpby10YWJsZSAua2VkaW8tdGFibGUtY29sdW1uLXRpdGxlIHtcclxuICAgICAgICAgICAgcG9zaXRpb246IHN0aWNreTtcclxuICAgICAgICAgICAgdG9wOiAwO1xyXG4gICAgICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1zZWNvbmRhcnktY29sb3IpO1xyXG4gICAgICAgICAgICBjb2xvcjogdmFyKC0tcHJpbWFyeS1jb2xvcik7XHJcbiAgICAgICAgICAgIHdpZHRoOiB2YXIoLS1tYXRjaC1wYXJlbnQpO1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBncmlkO1xyXG4gICAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgyLCBtYXgtY29udGVudCk7XHJcbiAgICAgICAgICAgIGdhcDogLjVlbTtcclxuICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IC41ZW07XHJcbiAgICAgICAgICAgIHotaW5kZXg6IDE7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIC5rZWRpby10YWJsZSAua2VkaW8tdGFibGUtY29sdW1uLXRpdGxlLXRleHR7XHJcbiAgICAgICAgICAgIGNvbG9yOiBpbmhlcml0O1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcclxuICAgICAgICAgICAgZm9udC1zaXplOiBpbmhlcml0O1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAua2VkaW8tdGFibGUgLmtlZGlvLXRhYmxlLWNvbHVtbi10aXRsZS1zb3J0e1xyXG4gICAgICAgICAgICBjb2xvcjogaW5oZXJpdDtcclxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogaW5oZXJpdDtcclxuICAgICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBub25lO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAua2VkaW8tdGFibGUgLmtlZGlvLXRhYmxlLWNvbHVtbi1jb250ZW50c3tcclxuICAgICAgICAgICAgZGlzcGxheTogZ3JpZDtcclxuICAgICAgICAgICAgZ2FwOiAuMmVtO1xyXG4gICAgICAgICAgICB3aWR0aDogdmFyKC0tbWF0Y2gtcGFyZW50KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIFxyXG4gICAgICAgICAgLmtlZGlvLXRhYmxlIC5rZWRpby10YWJsZS1jb2x1bW4tY2VsbHtcclxuICAgICAgICAgICAgbWluLXdpZHRoOiBtYXgtY29udGVudDtcclxuICAgICAgICAgICAgd2lkdGg6IHZhcigtLW1hdGNoLXBhcmVudCk7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IC41ZW07XHJcbiAgICAgICAgICAgIG1pbi1oZWlnaHQ6IDIwcHg7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIC5rZWRpby10YWJsZSAua2VkaW8tdGFibGUtY29sdW1uLWNlbGw6bnRoLWNoaWxkKG9kZCkge1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1wcmltYXJ5LWNvbG9yKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIFxyXG4gICAgICAgICAgLmtlZGlvLXRhYmxlIC5rZWRpby10YWJsZS1jb2x1bW4tY2VsbDpudGgtY2hpbGQoZXZlbikge1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1saWdodGVyLXNlY29uZGFyeS1jb2xvcik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIC5rZWRpby10YWJsZSBpbnB1dCB7XHJcbiAgICAgICAgICAgIHdpZHRoOiBpbmhlcml0O1xyXG4gICAgICAgICAgICBoZWlnaHQ6IGluaGVyaXQ7XHJcbiAgICAgICAgICAgIHRleHQtdHJhbnNmb3JtOiBpbmhlcml0O1xyXG4gICAgICAgICAgICBmb250LXNpemU6IGluaGVyaXQ7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIC5rZWRpby10YWJsZSBpbWcge1xyXG4gICAgICAgICAgICB3aWR0aDogMjBweDtcclxuICAgICAgICAgICAgaGVpZ2h0OiBhdXRvO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAua2VkaW8tdGFibGUgYTp2aXNpdGVkIHtcclxuICAgICAgICAgICAgY29sb3I6IHZhcigtLWFjY2llbnQtY29sb3IpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAua2VkaW8tdGFibGUtY2VsbCBhIHtcclxuICAgICAgICAgICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICAgICAgICAgIHdpZHRoOiB2YXIoLS1maWxsLXBhcmVudCk7XHJcbiAgICAgICAgICAgIGhlaWdodDogdmFyKC0tZmlsbC1wYXJlbnQpO1xyXG4gICAgICAgICAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XHJcbiAgICAgICAgICAgIGNvbG9yOiB2YXIoLS1hY2NpZW50LWNvbG9yKTtcclxuICAgICAgICAgICAgZm9udC1zaXplOiAxZW07XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIC5rZWRpby10YWJsZS1jZWxsIGE6aG92ZXIge1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1saWdodC1wcmltYXJ5LWNvbG9yKTtcclxuICAgICAgICAgICAgY29sb3I6IHZhcigtLWxpZ2h0LXNlY29uZGFyeS1jb2xvcik7XHJcbiAgICAgICAgICAgIHRyYW5zaXRpb24tZHVyYXRpb246IC40cztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIFxyXG4gICAgICAgICAgLmtlZGlvLXRhYmxlIC5rZWRpby10YWJsZS1jb2x1bW4tY2VsbC5rZWRpby10YWJsZS1zZWxlY3RlZC1yb3cge1xyXG4gICAgICAgICAgICBjb2xvcjogdmFyKC0tYWNjaWVudC1jb2xvcik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIC5rZWRpby10YWJsZS1vcHRpb25zIHtcclxuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XHJcbiAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWFjY2llbnQtY29sb3IpO1xyXG4gICAgICAgICAgICBjb2xvcjogdmFyKC0tc2Vjb25kYXJ5LWNvbG9yKTtcclxuICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgICAgICAgICBsZWZ0OiAwO1xyXG4gICAgICAgICAgICB0b3A6IDA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIC5rZWRpby10YWJsZS1vcHRpb25zIC5rZWRpby10YWJsZS1vcHRpb24ge1xyXG4gICAgICAgICAgICBwYWRkaW5nOiAuNWVtO1xyXG4gICAgICAgICAgICBjb2xvcjogaW5oZXJpdDtcclxuICAgICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xyXG4gICAgICAgICAgICBoZWlnaHQ6IDIwcHg7XHJcbiAgICAgICAgICAgIHdpZHRoOiAyMHB4O1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAua2VkaW8tdGFibGUtb3B0aW9uOmhvdmVyIHtcclxuICAgICAgICAgICAgY29sb3I6IHZhcigtLXByaW1hcnktY29sb3IpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYH1dKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRhYmxlQ29udGFpbmVyO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFRhYmxlRGF0YSh0YWJsZSkge1xyXG4gICAgICAgIGxldCBkYXRhID0gW107XHJcbiAgICAgICAgbGV0IGNlbGxzID0gdGFibGUuZmluZEFsbCgnLmtlZGlvLXRhYmxlLWNvbHVtbi1jZWxsJyk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2VsbHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IHsgbmFtZSwgdmFsdWUsIHJvdyB9ID0gY2VsbHNbaV0uZGF0YXNldDtcclxuICAgICAgICAgICAgZGF0YVtyb3ddID0gZGF0YVtyb3ddIHx8IHt9O1xyXG4gICAgICAgICAgICBkYXRhW3Jvd11bbmFtZV0gPSB2YWx1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIHNvcnRUYWJsZSh0YWJsZSwgYnkgPSAnJywgZGlyZWN0aW9uID0gMSkge1xyXG4gICAgICAgIGxldCBkYXRhID0gdGhpcy5nZXRUYWJsZURhdGEodGFibGUpO1xyXG5cclxuICAgICAgICBkYXRhLnNvcnQoKGEsIGIpID0+IHtcclxuICAgICAgICAgICAgYSA9IGFbYnldO1xyXG4gICAgICAgICAgICBiID0gYltieV07XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5pc051bWJlcihhKSAmJiB0aGlzLmlzTnVtYmVyKGIpKSB7XHJcbiAgICAgICAgICAgICAgICBhID0gYSAvIDE7XHJcbiAgICAgICAgICAgICAgICBiID0gYiAvIDE7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChkaXJlY3Rpb24gPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGEgPiBiID8gMSA6IC0xO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGEgPiBiID8gLTEgOiAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgbGlzdGVuVGFibGUocGFyYW1zID0geyB0YWJsZToge30sIG9wdGlvbnM6IFtdIH0sIGNhbGxiYWNrcyA9IHsgY2xpY2s6ICgpID0+IHsgfSwgZmlsdGVyOiAoKSA9PiB7IH0gfSkge1xyXG4gICAgICAgIHBhcmFtcy5vcHRpb25zID0gcGFyYW1zLm9wdGlvbnMgfHwgW107XHJcbiAgICAgICAgY2FsbGJhY2tzID0gY2FsbGJhY2tzIHx8IFtdO1xyXG4gICAgICAgIGxldCB0YWJsZSA9IHBhcmFtcy50YWJsZS5maW5kKCcua2VkaW8tdGFibGUnKTtcclxuXHJcbiAgICAgICAgbGV0IG9wdGlvbnMgPSB0aGlzLmNyZWF0ZUVsZW1lbnQoe1xyXG4gICAgICAgICAgICBlbGVtZW50OiAnc3BhbicsIGF0dHJpYnV0ZXM6IHsgY2xhc3M6ICdrZWRpby10YWJsZS1vcHRpb25zJyB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxldCBsaXN0ID0ge1xyXG4gICAgICAgICAgICB2aWV3OiAnZmFzIGZhLWV5ZScsXHJcbiAgICAgICAgICAgIGRlbGV0ZTogJ2ZhcyBmYS10cmFzaCcsXHJcbiAgICAgICAgICAgIGVkaXQ6ICdmYXMgZmEtcGVuJyxcclxuICAgICAgICAgICAgcmV2ZXJ0OiAnZmFzIGZhLWhpc3RvcnknXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgb3B0aW9uQ2xhc3M7XHJcbiAgICAgICAgZm9yIChsZXQgb3B0aW9uIG9mIHBhcmFtcy5vcHRpb25zKSB7XHJcbiAgICAgICAgICAgIG9wdGlvbkNsYXNzID0gbGlzdFtvcHRpb25dIHx8IGBmYXMgZmEtJHtvcHRpb259YDtcclxuICAgICAgICAgICAgbGV0IGFuT3B0aW9uID0gb3B0aW9ucy5tYWtlRWxlbWVudCh7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50OiAnaScsIGF0dHJpYnV0ZXM6IHsgY2xhc3M6IG9wdGlvbkNsYXNzICsgJyBrZWRpby10YWJsZS1vcHRpb24nLCBpZDogJ2tlZGlvLXRhYmxlLW9wdGlvbi0nICsgb3B0aW9uIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgdGFibGVUaXRsZXMgPSB0YWJsZS5maW5kQWxsKCcua2VkaW8tdGFibGUtY29sdW1uLXRpdGxlJyk7XHJcbiAgICAgICAgbGV0IHRhYmxlQ29sdW1ucyA9IHRhYmxlLmZpbmRBbGwoJy5rZWRpby10YWJsZS1jb2x1bW4nKTtcclxuICAgICAgICBsZXQgcm93cyA9IFtdO1xyXG4gICAgICAgIGxldCBmaXJzdENvbHVtbiA9IHRhYmxlQ29sdW1uc1swXTtcclxuICAgICAgICBsZXQgZmlyc3RWaXNpYmxlQ29sdW1uO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pc251bGwoZmlyc3RDb2x1bW4pKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGFibGVDb2x1bW5zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0YWJsZUNvbHVtbnNbaV0uY3NzKCkuZGlzcGxheSAhPSAnbm9uZScpIHtcclxuICAgICAgICAgICAgICAgIGZpcnN0VmlzaWJsZUNvbHVtbiA9IHRhYmxlQ29sdW1uc1tpXTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgZmlyc3RDZWxscyA9IGZpcnN0Q29sdW1uLmZpbmRBbGwoJy5rZWRpby10YWJsZS1jb2x1bW4tY2VsbCcpO1xyXG4gICAgICAgIGxldCBmaXJzdFZpc2libGVDZWxscyA9IGZpcnN0VmlzaWJsZUNvbHVtbi5maW5kQWxsKCcua2VkaW8tdGFibGUtY29sdW1uLWNlbGwnKTtcclxuXHJcbiAgICAgICAgbGV0IHRhYmxlUm93O1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpcnN0Q2VsbHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgcm93cy5wdXNoKGZpcnN0Q2VsbHNbaV0uZGF0YXNldC5yb3cpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBhcmFtcy50YWJsZS5maW5kKCcua2VkaW8tdGFibGUnKS5kYXRhc2V0LnNvcnQgPT0gJ3RydWUnKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGFibGVUaXRsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRhYmxlVGl0bGVzW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCBldmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFibGVUaXRsZXNbaV0uZmluZCgnLmtlZGlvLXRhYmxlLWNvbHVtbi10aXRsZS1zb3J0JykuY3NzKHsgZGlzcGxheTogJ3Vuc2V0JyB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHRhYmxlVGl0bGVzW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBldmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFibGVUaXRsZXNbaV0uZmluZCgnLmtlZGlvLXRhYmxlLWNvbHVtbi10aXRsZS1zb3J0JykuY3NzKHsgZGlzcGxheTogJ25vbmUnIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGFibGVUaXRsZXNbaV0uZmluZCgnLmtlZGlvLXRhYmxlLWNvbHVtbi10aXRsZS1zb3J0JykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRpcmVjdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICB0YWJsZVRpdGxlc1tpXS5maW5kKCcua2VkaW8tdGFibGUtY29sdW1uLXRpdGxlLXNvcnQnKS50b2dnbGVDbGFzc2VzKCdmYXMsIGZhLWFycm93LXVwJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFibGVUaXRsZXNbaV0uZmluZCgnLmtlZGlvLXRhYmxlLWNvbHVtbi10aXRsZS1zb3J0JykudG9nZ2xlQ2xhc3NlcygnZmFzLCBmYS1hcnJvdy1kb3duJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhYmxlVGl0bGVzW2ldLmZpbmQoJy5rZWRpby10YWJsZS1jb2x1bW4tdGl0bGUtc29ydCcpLmRhdGFzZXQuZGlyZWN0aW9uID09ICd1cCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFibGVUaXRsZXNbaV0uZmluZCgnLmtlZGlvLXRhYmxlLWNvbHVtbi10aXRsZS1zb3J0JykuZGF0YXNldC5kaXJlY3Rpb24gPSAnZG93bic7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvbiA9IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YWJsZVRpdGxlc1tpXS5maW5kKCcua2VkaW8tdGFibGUtY29sdW1uLXRpdGxlLXNvcnQnKS5kYXRhc2V0LmRpcmVjdGlvbiA9ICd1cCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvbiA9IC0xO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRleHQgPSB0YWJsZVRpdGxlc1tpXS5maW5kKCcua2VkaW8tdGFibGUtY29sdW1uLXRpdGxlLXRleHQnKS50ZXh0Q29udGVudDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRhdGEgPSB0aGlzLnNvcnRUYWJsZShwYXJhbXMudGFibGUuZmluZCgnLmtlZGlvLXRhYmxlJyksIHRleHQsIGRpcmVjdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5ld1RhYmxlID0gdGhpcy5jcmVhdGVUYWJsZSh7IGNvbnRlbnRzOiBkYXRhIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgbmV3VGFibGVDb2x1bW5zID0gbmV3VGFibGUuZmluZEFsbCgnLmtlZGlvLXRhYmxlLWNvbHVtbicpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbmV3VGFibGVDb2x1bW5zLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhYmxlQ29sdW1uc1tqXS5maW5kKCcua2VkaW8tdGFibGUtY29sdW1uLWNvbnRlbnRzJykuaW5uZXJIVE1MID0gbmV3VGFibGVDb2x1bW5zW2pdLmZpbmQoJy5rZWRpby10YWJsZS1jb2x1bW4tY29udGVudHMnKS5pbm5lckhUTUw7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB0YWJsZUNvbHVtbnMgPSB0YWJsZS5maW5kQWxsKCcua2VkaW8tdGFibGUtY29sdW1uJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmlzbnVsbChwYXJhbXMudGFibGUuZmluZCgnLmtlZGlvLXRhYmxlLXNlYXJjaCcpKSkge1xyXG4gICAgICAgICAgICBwYXJhbXMudGFibGUuZmluZCgnLmtlZGlvLXRhYmxlLXNlYXJjaCcpLm9uQ2hhbmdlZCh2YWx1ZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBmaWx0ZXIoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXRoaXMuaXNudWxsKHBhcmFtcy50YWJsZS5maW5kKCcua2VkaW8tdGFibGUtZmlsdGVyJykpKSB7XHJcbiAgICAgICAgICAgIHBhcmFtcy50YWJsZS5maW5kKCcua2VkaW8tdGFibGUtZmlsdGVyJykub25DaGFuZ2VkKHZhbHVlID0+IHtcclxuICAgICAgICAgICAgICAgIGZpbHRlcigpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBzZWFyY2hWYWx1ZSwgZmlsdGVyVmFsdWU7XHJcblxyXG4gICAgICAgIGxldCBmaWx0ZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5pc251bGwocGFyYW1zLnRhYmxlLmZpbmQoJy5rZWRpby10YWJsZS1zZWFyY2gnKSkpIHtcclxuICAgICAgICAgICAgICAgIHNlYXJjaFZhbHVlID0gcGFyYW1zLnRhYmxlLmZpbmQoJy5rZWRpby10YWJsZS1zZWFyY2gnKS52YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCF0aGlzLmlzbnVsbChwYXJhbXMudGFibGUuZmluZCgnLmtlZGlvLXRhYmxlLWZpbHRlcicpKSkge1xyXG4gICAgICAgICAgICAgICAgZmlsdGVyVmFsdWUgPSBwYXJhbXMudGFibGUuZmluZCgnLmtlZGlvLXRhYmxlLWZpbHRlcicpLnZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvd3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBoaWRlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0YWJsZVJvdyA9IHRhYmxlLmZpbmRBbGwoYC5rZWRpby10YWJsZS1jb2x1bW4tY2VsbFtkYXRhLXJvdz1cIiR7aX1cIl1gKTtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRhYmxlUm93Lmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFibGVSb3dbal0uY3NzUmVtb3ZlKFsnZGlzcGxheSddKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc3NldChmaWx0ZXJWYWx1ZSkgJiYgaGlkZSA9PSBmYWxzZSAmJiB0aGlzLmlzc2V0KGNhbGxiYWNrcy5maWx0ZXIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaGlkZSA9IGNhbGxiYWNrcy5maWx0ZXIoZmlsdGVyVmFsdWUsIHRhYmxlUm93KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc3NldChzZWFyY2hWYWx1ZSkgJiYgaGlkZSA9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGhpZGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGFibGVSb3cubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRhYmxlUm93W2pdLnRleHRDb250ZW50LnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoc2VhcmNoVmFsdWUudG9Mb3dlckNhc2UoKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhpZGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChoaWRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0YWJsZVJvdy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YWJsZVJvd1tqXS5jc3MoeyBkaXNwbGF5OiAnbm9uZScgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5pc3NldChjYWxsYmFja3MuY2xpY2spKSB7XHJcbiAgICAgICAgICAgIHRhYmxlLmFkZE11bHRpcGxlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duLCB0b3VjaHN0YXJ0JywgZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRhcmdldCA9IGV2ZW50LnRhcmdldDtcclxuICAgICAgICAgICAgICAgIGlmICh0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdrZWRpby10YWJsZS1vcHRpb24nKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzc2V0KGNhbGxiYWNrcy5jbGljaykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzLmNsaWNrKGV2ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdrZWRpby10YWJsZS1jb2x1bW4tY2VsbCcpIHx8ICF0aGlzLmlzbnVsbCh0YXJnZXQuZ2V0UGFyZW50cygnLmtlZGlvLXRhYmxlLWNvbHVtbi1jZWxsJykpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdrZWRpby10YWJsZS1jb2x1bW4tY2VsbCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldCA9IHRhcmdldC5nZXRQYXJlbnRzKCcua2VkaW8tdGFibGUtY29sdW1uLWNlbGwnKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBvc2l0aW9uID0gdGFyZ2V0LmRhdGFzZXQucm93O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZpcnN0VmlzaWJsZUNlbGxzW3Bvc2l0aW9uXS5jc3MoeyBwb3NpdGlvbjogJ3JlbGF0aXZlJyB9KTtcclxuICAgICAgICAgICAgICAgICAgICBmaXJzdFZpc2libGVDZWxsc1twb3NpdGlvbl0uYXBwZW5kKG9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAocGFyYW1zLnRhYmxlLmNsYXNzTGlzdC5jb250YWlucygna2VkaW8tc2VsZWN0YWJsZScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByb3cgPSB0YWJsZS5maW5kQWxsKGAua2VkaW8tdGFibGUtY29sdW1uLWNlbGxbZGF0YS1yb3c9XCIke3Bvc2l0aW9ufVwiXWApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvdy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93W2ldLmNsYXNzTGlzdC50b2dnbGUoJ2tlZGlvLXRhYmxlLXNlbGVjdGVkLXJvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2tlZGlvLXRhYmxlLXNlbGVjdGVkLXJvdycpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZmlyc3RDb2x1bW4uZmluZEFsbCgnLmtlZGlvLXRhYmxlLXNlbGVjdGVkLXJvdycpLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zLnRhYmxlLmNsYXNzTGlzdC5yZW1vdmUoJ2tlZGlvLXNlbGVjdGFibGUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0YWJsZS5wcmVzc2VkKGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCB0YXJnZXQgPSBldmVudC50YXJnZXQ7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQuZHVyYXRpb24gPiAzMDApIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygna2VkaW8tdGFibGUtY29sdW1uLWNlbGwnKSB8fCAhdGhpcy5pc251bGwodGFyZ2V0LmdldFBhcmVudHMoJy5rZWRpby10YWJsZS1jb2x1bW4tY2VsbCcpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2tlZGlvLXRhYmxlLWNvbHVtbi1jZWxsJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldCA9IHRhcmdldC5nZXRQYXJlbnRzKCcua2VkaW8tdGFibGUtY29sdW1uLWNlbGwnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcG9zaXRpb24gPSB0YXJnZXQuZGF0YXNldC5yb3c7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZmlyc3RDb2x1bW4uZmluZEFsbCgnLmtlZGlvLXRhYmxlLXNlbGVjdGVkLXJvdycpLmxlbmd0aCA9PSAwICYmICFwYXJhbXMudGFibGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdrZWRpby1zZWxlY3RhYmxlJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtcy50YWJsZS5jbGFzc0xpc3QuYWRkKCdrZWRpby1zZWxlY3RhYmxlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcm93ID0gdGFibGUuZmluZEFsbChgLmtlZGlvLXRhYmxlLWNvbHVtbi1jZWxsW2RhdGEtcm93PVwiJHtwb3NpdGlvbn1cIl1gKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm93Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93W2ldLmNsYXNzTGlzdC5hZGQoJ2tlZGlvLXRhYmxlLXNlbGVjdGVkLXJvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUZvcm0ocGFyYW1zID0geyBlbGVtZW50OiAnJywgdGl0bGU6ICcnLCBjb2x1bW5zOiAxLCBjb250ZW50czoge30sIHJlcXVpcmVkOiBbXSwgYnV0dG9uczoge30gfSkge1xyXG4gICAgICAgIGxldCBmb3JtID0gdGhpcy5jcmVhdGVFbGVtZW50KHtcclxuICAgICAgICAgICAgZWxlbWVudDogcGFyYW1zLmVsZW1lbnQgfHwgJ2Zvcm0nLCBhdHRyaWJ1dGVzOiBwYXJhbXMuYXR0cmlidXRlcywgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgICAgIHsgZWxlbWVudDogJ2gzJywgYXR0cmlidXRlczogeyBjbGFzczogJ2tlZGlvLWZvcm0tdGl0bGUnIH0sIHRleHQ6IHBhcmFtcy50aXRsZSB9LFxyXG4gICAgICAgICAgICAgICAgeyBlbGVtZW50OiAnc2VjdGlvbicsIGF0dHJpYnV0ZXM6IHsgY2xhc3M6ICdrZWRpby1mb3JtLWNvbnRlbnRzJywgc3R5bGU6IHsgZ3JpZFRlbXBsYXRlQ29sdW1uczogYHJlcGVhdCgke3BhcmFtcy5jb2x1bW5zfSwgMWZyKWAgfSB9IH0sXHJcbiAgICAgICAgICAgICAgICB7IGVsZW1lbnQ6ICdzZWN0aW9uJywgYXR0cmlidXRlczogeyBjbGFzczogJ2tlZGlvLWZvcm0tYnV0dG9ucycgfSB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQ6ICdzdHlsZScsIHRleHQ6IGAua2VkaW8tZm9ybSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgICAgICAgICAgICAgICAgIGp1c3RpZnktc2VsZjogY2VudGVyO1xyXG4gICAgICAgICAgICAgICAgICAgIGFsaWduLXNlbGY6IGNlbnRlcjtcclxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBncmlkO1xyXG4gICAgICAgICAgICAgICAgICAgIGdyaWQtcm93LWdhcDogMWVtO1xyXG4gICAgICAgICAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtcm93czogcmVwZWF0KDQsIG1pbi1jb250ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogdmFyKC0tbWF0Y2gtcGFyZW50KTtcclxuICAgICAgICAgICAgICAgICAgICBtYXgtd2lkdGg6IDcwMHB4O1xyXG4gICAgICAgICAgICAgICAgICAgIG1hcmdpbjogMmVtO1xyXG4gICAgICAgICAgICAgICAgICAgIGJveC1zaGFkb3c6IDAgMTRweCAyOHB4IHJnYmEoMCwwLDAsMC4yNSksIDAgMTBweCAxMHB4IHJnYmEoMCwwLDAsMC4yMik7XHJcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tc2Vjb25kYXJ5LWNvbG9yKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLmtlZGlvLWZvcm0tdGl0bGUge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiAzMDA7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0dGVyLXNwYWNpbmc6IC4wNWVtO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMS4yZW07XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXNlY29uZGFyeS1jb2xvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IHZhcigtLXByaW1hcnktY29sb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xyXG4gICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IDFlbTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLmtlZGlvLWZvcm0tY29udGVudHN7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogZ3JpZDtcclxuICAgICAgICAgICAgICAgICAgICBncmlkLWdhcDogMWVtO1xyXG4gICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IDFlbTtcclxuICAgICAgICAgICAgICAgICAgICBhbGlnbi1pdGVtczogc3RhcnQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC5rZWRpby1mb3JtLWJ1dHRvbnN7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogZ3JpZDtcclxuICAgICAgICAgICAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmcjtcclxuICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICAgICAgICAgICAgICAgICAgICBhbGlnbi1jb250ZW50OiBjZW50ZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogMWVtO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAua2VkaW8tZm9ybS1idXR0b25zIGJ1dHRvbntcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogdmFyKC0tZmlsbC1wYXJlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDIwcHg7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogMWVtO1xyXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLXNlY29uZGFyeS1jb2xvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xyXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXNlY29uZGFyeS1jb2xvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IHZhcigtLXByaW1hcnktY29sb3IpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAua2VkaW8tZm9ybS1zaW5nbGUtY29udGVudHtcclxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBncmlkO1xyXG4gICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IC41ZW07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC5rZWRpby1mb3JtLWxhYmVsIHtcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogIzY2NjY2NjtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0LXRyYW5zZm9ybTogY2FwaXRhbGl6ZTtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0LWFsaWduOiBqdXN0aWZ5O1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgICAgICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAua2VkaW8tZm9ybS1ub3Rle1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAjOTk5OTk5O1xyXG4gICAgICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogLjdlbTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLmtlZGlvLWZvcm0tZGF0YXtcclxuICAgICAgICAgICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1zZWNvbmRhcnktY29sb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IC43ZW0gLjNlbTtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0LWFsaWduOiBqdXN0aWZ5O1xyXG4gICAgICAgICAgICAgICAgICAgIG1pbi13aWR0aDogdW5zZXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMjBweDtcclxuICAgICAgICAgICAgICAgICAgICBvdXRsaW5lOiBub25lO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAua2VkaW8tZm9ybS1kYXRhOmZvY3VzIHtcclxuICAgICAgICAgICAgICAgICAgICBib3JkZXItY29sb3I6IHZhcigtLXNlY29uZGFyeS1jb2xvcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC5rZWRpby1mb3JtLXJvd3tcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogZ3JpZDtcclxuICAgICAgICAgICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1zZWNvbmRhcnktY29sb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIGdyaWQtZ2FwOiAuNWVtO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAua2VkaW8tZm9ybS1yb3ctY29udGVudHN7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogZ3JpZDtcclxuICAgICAgICAgICAgICAgICAgICBncmlkLWdhcDogLjVlbTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLmtlZGlvLWZvcm0gLmNlbGwtbGFiZWx7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9udC1zaXplOiAuOWVtO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAua2VkaW8tZm9ybSAuY2VsbC1kYXRhe1xyXG4gICAgICAgICAgICAgICAgICAgIG91dGxpbmU6IG5vbmU7XHJcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiBub25lO1xyXG4gICAgICAgICAgICAgICAgICAgIG1pbi1oZWlnaHQ6IDIwcHg7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC5rZWRpby1mb3JtLWVycm9ye1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IG5vbmU7XHJcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYWNjaWVudC1jb2xvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IHZhcigtLXNlY29uZGFyeS1jb2xvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9udC1zaXplOiAuOGVtO1xyXG4gICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IC41ZW07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIEBtZWRpYShtaW4td2lkdGg6IDcwMHB4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLmtlZGlvLWZvcm0gI3JlbWVtYmVyLW1lIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDIwcHg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogMjBweDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9YH1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBmb3JtLmNsYXNzTGlzdC5hZGQoJ2tlZGlvLWZvcm0nKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNzZXQocGFyYW1zLnBhcmVudCkpIHBhcmFtcy5wYXJlbnQuYXBwZW5kKGZvcm0pO1xyXG4gICAgICAgIGxldCBub3RlO1xyXG4gICAgICAgIGxldCBmb3JtQ29udGVudHMgPSBmb3JtLmZpbmQoJy5rZWRpby1mb3JtLWNvbnRlbnRzJyk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGtleSBpbiBwYXJhbXMuY29udGVudHMpIHtcclxuICAgICAgICAgICAgbm90ZSA9ICh0aGlzLmlzc2V0KHBhcmFtcy5jb250ZW50c1trZXldLm5vdGUpKSA/IGAoJHtwYXJhbXMuY29udGVudHNba2V5XS5ub3RlfSlgIDogJyc7XHJcbiAgICAgICAgICAgIGxldCBsYWJsZVRleHQgPSBwYXJhbXMuY29udGVudHNba2V5XS5sYWJlbCB8fCB0aGlzLmNhbWVsQ2FzZWRUb1RleHQoa2V5KS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICBsZXQgYmxvY2sgPSBmb3JtQ29udGVudHMubWFrZUVsZW1lbnQoe1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudDogJ2RpdicsIGF0dHJpYnV0ZXM6IHsgY2xhc3M6ICdrZWRpby1mb3JtLXNpbmdsZS1jb250ZW50JyB9LCBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgICAgICAgIHsgZWxlbWVudDogJ2xhYmVsJywgaHRtbDogbGFibGVUZXh0LCBhdHRyaWJ1dGVzOiB7IGNsYXNzOiAna2VkaW8tZm9ybS1sYWJlbCcsIGZvcjoga2V5LnRvTG93ZXJDYXNlKCkgfSB9XHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgbGV0IGRhdGEgPSBibG9jay5tYWtlRWxlbWVudChwYXJhbXMuY29udGVudHNba2V5XSk7XHJcbiAgICAgICAgICAgIGRhdGEuY2xhc3NMaXN0LmFkZCgna2VkaW8tZm9ybS1kYXRhJyk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzc2V0KHBhcmFtcy5jb250ZW50c1trZXldLm5vdGUpKSBibG9jay5tYWtlRWxlbWVudCh7IGVsZW1lbnQ6ICdzcGFuJywgdGV4dDogcGFyYW1zLmNvbnRlbnRzW2tleV0ubm90ZSwgYXR0cmlidXRlczogeyBjbGFzczogJ2tlZGlvLWZvcm0tbm90ZScgfSB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzc2V0KHBhcmFtcy5yZXF1aXJlZCkgJiYgcGFyYW1zLnJlcXVpcmVkLmluY2x1ZGVzKGtleSkpIHtcclxuICAgICAgICAgICAgICAgIGRhdGEucmVxdWlyZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGxldCBrZXkgaW4gcGFyYW1zLmJ1dHRvbnMpIHtcclxuICAgICAgICAgICAgZm9ybS5maW5kKCcua2VkaW8tZm9ybS1idXR0b25zJykubWFrZUVsZW1lbnQocGFyYW1zLmJ1dHRvbnNba2V5XSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3JtLm1ha2VFbGVtZW50KHsgZWxlbWVudDogJ3NwYW4nLCBhdHRyaWJ1dGVzOiB7IGNsYXNzOiAna2VkaW8tZm9ybS1lcnJvcicgfSwgc3RhdGU6IHsgbmFtZTogJ2Vycm9yJywgb3duZXI6IGAjJHtmb3JtLmlkfWAgfSB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZvcm07XHJcbiAgICB9XHJcblxyXG4gICAgcGlja2VyKHBhcmFtcyA9IHsgdGl0bGU6ICcnLCBjb250ZW50czogW10gfSwgY2FsbGJhY2sgPSAoZXZlbnQpID0+IHsgfSkge1xyXG4gICAgICAgIGxldCBwaWNrZXIgPSB0aGlzLmNyZWF0ZUVsZW1lbnQoe1xyXG4gICAgICAgICAgICBlbGVtZW50OiAnZGl2JywgYXR0cmlidXRlczogeyBjbGFzczogJ2tlZGlvLXBpY2tlcicgfSwgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgICAgIHsgZWxlbWVudDogJ2gzJywgYXR0cmlidXRlczogeyBjbGFzczogJ2tlZGlvLXBpY2tlci10aXRsZScgfSwgdGV4dDogcGFyYW1zLnRpdGxlIHx8ICcnIH0sXHJcbiAgICAgICAgICAgICAgICB7IGVsZW1lbnQ6ICdkaXYnLCBhdHRyaWJ1dGVzOiB7IGNsYXNzOiAna2VkaW8tcGlja2VyLWNvbnRlbnRzJyB9IH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudDogJ3N0eWxlJywgdGV4dDogYC5rZWRpby1waWNrZXIge1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGdyaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiB2YXIoLS1maWxsLXBhcmVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHZhcigtLWZpbGwtcGFyZW50KTtcclxuICAgICAgICAgICAgICAgICAgICBncmlkLXRlbXBsYXRlLXJvd3M6IG1heC1jb250ZW50IDFmcjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLmtlZGlvLXBpY2tlci1jb250ZW50cyB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiB2YXIoLS1maWxsLXBhcmVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHZhcigtLWZpbGwtcGFyZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLmtlZGlvLXBpY2tlci1zaW5nbGUge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IDJlbTtcclxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICAgICAgICAgICAgICAgICAgbWFyZ2luOiAxZW07XHJcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tc2Vjb25kYXJ5LWNvbG9yKTtcclxuICAgICAgICAgICAgICAgICAgICBtYXJnaW46IDFlbTtcclxuICAgICAgICAgICAgICAgIH1gfVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGNvbnRlbnQgb2YgcGFyYW1zLmNvbnRlbnRzKSB7XHJcbiAgICAgICAgICAgIHBpY2tlci5maW5kKCcua2VkaW8tcGlja2VyLWNvbnRlbnRzJykubWFrZUVsZW1lbnQoeyBlbGVtZW50OiAnc3BhbicsIGF0dHJpYnV0ZXM6IHsgY2xhc3M6ICdrZWRpby1waWNrZXItc2luZ2xlJywgJ2RhdGEtbmFtZSc6IGNvbnRlbnQgfSwgdGV4dDogY29udGVudCB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHBpY2tlci5hZGRFdmVudExpc3RlbmVyKCdkYmxjbGljaycsIGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgaWYgKGV2ZW50LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2tlZGlvLXBpY2tlci1zaW5nbGUnKSkge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXZlbnQudGFyZ2V0LmRhdGFzZXQubmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHBpY2tlcjtcclxuICAgIH1cclxuXHJcbiAgICBwb3BVcChjb250ZW50LCBwYXJhbXMgPSB7IHRpdGxlOiAnJywgYXR0cmlidXRlczoge30gfSkge1xyXG4gICAgICAgIGxldCBjb250YWluZXIgPSBwYXJhbXMuY29udGFpbmVyIHx8IGRvY3VtZW50LmJvZHk7XHJcbiAgICAgICAgbGV0IHRpdGxlID0gcGFyYW1zLnRpdGxlIHx8ICcnO1xyXG5cclxuICAgICAgICBwYXJhbXMuYXR0cmlidXRlcyA9IHBhcmFtcy5hdHRyaWJ1dGVzIHx8IHt9O1xyXG4gICAgICAgIHBhcmFtcy5hdHRyaWJ1dGVzLnN0eWxlID0gcGFyYW1zLmF0dHJpYnV0ZXMuc3R5bGUgfHwge307XHJcbiAgICAgICAgcGFyYW1zLmF0dHJpYnV0ZXMuc3R5bGUud2lkdGggPSBwYXJhbXMuYXR0cmlidXRlcy5zdHlsZS53aWR0aCB8fCAnNTB2dyc7XHJcbiAgICAgICAgcGFyYW1zLmF0dHJpYnV0ZXMuc3R5bGUuaGVpZ2h0ID0gcGFyYW1zLmF0dHJpYnV0ZXMuc3R5bGUuaGVpZ2h0IHx8ICc1MHZoJztcclxuXHJcbiAgICAgICAgbGV0IHBvcFVwID0gdGhpcy5jcmVhdGVFbGVtZW50KHtcclxuICAgICAgICAgICAgZWxlbWVudDogJ2RpdicsIGF0dHJpYnV0ZXM6IHsgY2xhc3M6ICdrZWRpby1wb3AtdXAnIH0sIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudDogJ2RpdicsIGF0dHJpYnV0ZXM6IHsgaWQ6ICdwb3AtdXAtd2luZG93JywgY2xhc3M6ICdrZWRpby1wb3AtdXAtd2luZG93JyB9LCBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50OiAnZGl2JywgYXR0cmlidXRlczogeyBpZDogJ3BvcC11cC1tZW51JywgY2xhc3M6ICdrZWRpby1wb3AtdXAtbWVudScgfSwgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGVsZW1lbnQ6ICdwJywgYXR0cmlidXRlczogeyBpZDogJycsIHN0eWxlOiB7IGNvbG9yOiAnaW5oZXJpdCcsIHBhZGRpbmc6ICcxZW0nIH0gfSwgdGV4dDogdGl0bGUgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGVsZW1lbnQ6ICdpJywgYXR0cmlidXRlczogeyBpZDogJ3RvZ2dsZS13aW5kb3cnLCBjbGFzczogJ2tlZGlvLXBvcC11cC1jb250cm9sIGZhcyBmYS1leHBhbmQtYWx0JyB9IH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBlbGVtZW50OiAnaScsIGF0dHJpYnV0ZXM6IHsgaWQ6ICdjbG9zZS13aW5kb3cnLCBjbGFzczogJ2tlZGlvLXBvcC11cC1jb250cm9sIGZhcyBmYS10aW1lcycgfSB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQ6ICdkaXYnLCBhdHRyaWJ1dGVzOiB7IGlkOiAncG9wLXVwLWNvbnRlbnQnLCBjbGFzczogJ2tlZGlvLXBvcC11cC1jb250ZW50JyB9LCBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudDogJ3N0eWxlJywgdGV4dDogYC5rZWRpby1wb3AtdXAge1xyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBmaXhlZDtcclxuICAgICAgICAgICAgICAgICAgICB0b3A6IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogMDtcclxuICAgICAgICAgICAgICAgICAgICBib3R0b206IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgcmlnaHQ6IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbGlnaHQtc2Vjb25kYXJ5LWNvbG9yKTtcclxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBncmlkO1xyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiB2YXIoLS1maWxsLXBhcmVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiB2YXIoLS1maWxsLXBhcmVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAganVzdGlmeS1pdGVtczogY2VudGVyO1xyXG4gICAgICAgICAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgei1pbmRleDogMTAwMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLmtlZGlvLXBvcC11cC13aW5kb3cge1xyXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXByaW1hcnktY29sb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGdyaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3JpZC1nYXA6IDFlbTtcclxuICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5LWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxpZ24taXRlbXM6IHN0YXJ0O1xyXG4gICAgICAgICAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyO1xyXG4gICAgICAgICAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtcm93czogbWF4LWNvbnRlbnQgMWZyO1xyXG4gICAgICAgICAgICAgICAgICAgIG92ZXJmbG93OiBoaWRkZW47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC5rZWRpby1wb3AtdXAtbWVudSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tc2Vjb25kYXJ5LWNvbG9yKTtcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogdmFyKC0tcHJpbWFyeS1jb2xvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogZ3JpZDtcclxuICAgICAgICAgICAgICAgICAgICBncmlkLWdhcDogLjVlbTtcclxuICAgICAgICAgICAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciByZXBlYXQoMiwgbWluLWNvbnRlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICAgICAgICAgICAgICAgIGp1c3RpZnktaXRlbXM6IGZsZXgtZW5kO1xyXG4gICAgICAgICAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXJcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLmtlZGlvLXBvcC11cC1jb250cm9sIHtcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogdmFyKC0tcHJpbWFyeS1jb2xvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAyMHB4O1xyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAyMHB4O1xyXG4gICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IDFlbVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAua2VkaW8tcG9wLXVwLWNvbnRlbnQge1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgICAgICAgICAgICAgICAgIG92ZXJmbG93OiBhdXRvO1xyXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogMTAwJTtcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogMTAwJTtcclxuICAgICAgICAgICAgICAgIH1gfVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHBvcFVwLmZpbmQoJyNwb3AtdXAtd2luZG93Jykuc2V0QXR0cmlidXRlcyhwYXJhbXMuYXR0cmlidXRlcyk7XHJcblxyXG4gICAgICAgIHBvcFVwLmZpbmQoJyN0b2dnbGUtd2luZG93JykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XHJcbiAgICAgICAgICAgIHBvcFVwLmZpbmQoJyN0b2dnbGUtd2luZG93JykuY2xhc3NMaXN0LnRvZ2dsZSgnZmEtZXhwYW5kLWFsdCcpO1xyXG4gICAgICAgICAgICBwb3BVcC5maW5kKCcjdG9nZ2xlLXdpbmRvdycpLmNsYXNzTGlzdC50b2dnbGUoJ2ZhLWNvbXByZXNzLWFsdCcpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHBvcFVwLmZpbmQoJyN0b2dnbGUtd2luZG93JykuY2xhc3NMaXN0LmNvbnRhaW5zKCdmYS1leHBhbmQtYWx0JykpIHtcclxuICAgICAgICAgICAgICAgIHBvcFVwLmZpbmQoJyNwb3AtdXAtd2luZG93JykuY3NzKHsgaGVpZ2h0OiBwYXJhbXMuYXR0cmlidXRlcy5zdHlsZS5oZWlnaHQsIHdpZHRoOiBwYXJhbXMuYXR0cmlidXRlcy5zdHlsZS53aWR0aCB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHBvcFVwLmZpbmQoJyNwb3AtdXAtd2luZG93JykuY3NzKHsgaGVpZ2h0OiAndmFyKC0tZmlsbC1wYXJlbnQpJywgd2lkdGg6ICd2YXIoLS1maWxsLXBhcmVudCknIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHBvcFVwLmZpbmQoJyNjbG9zZS13aW5kb3cnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgcG9wVXAucmVtb3ZlKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmQocG9wVXApO1xyXG4gICAgICAgIHJldHVybiBwb3BVcDtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVTZWxlY3QocGFyYW1zID0geyB2YWx1ZTogJycsIGNvbnRlbnRzOiB7fSwgbXVsdGlwbGU6IGZhbHNlIH0pIHtcclxuICAgICAgICBsZXQgc2VsZWN0ZWQgPSBbXSxcclxuICAgICAgICAgICAgYWxsb3dOYXZpZ2F0ZSA9IGZhbHNlLFxyXG4gICAgICAgICAgICBzY3JvbGxQb3NpdGlvbiA9IC0xLFxyXG4gICAgICAgICAgICBhY3RpdmU7XHJcblxyXG4gICAgICAgIC8vY3JlYXRlIHRoZSBlbGVtZW50XHJcbiAgICAgICAgbGV0IHNlbGVjdCA9IHRoaXMuY3JlYXRlRWxlbWVudCh7XHJcbiAgICAgICAgICAgIGVsZW1lbnQ6ICdkaXYnLCBhdHRyaWJ1dGVzOiBwYXJhbXMuYXR0cmlidXRlcywgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50OiAnc3BhbicsIGF0dHJpYnV0ZXM6IHsgY2xhc3M6ICdrZWRpby1zZWxlY3QtY29udHJvbCcsIH0sIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgZWxlbWVudDogJ2lucHV0JywgYXR0cmlidXRlczogeyBjbGFzczogJ2tlZGlvLXNlbGVjdC1pbnB1dCcsIHZhbHVlOiBwYXJhbXMudmFsdWUgfHwgJycsIGlnbm9yZTogdHJ1ZSB9IH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQ6ICdzcGFuJywgYXR0cmlidXRlczogeyBjbGFzczogJ2tlZGlvLXNlbGVjdC10b2dnbGUnIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7IGVsZW1lbnQ6ICdpbnB1dCcsIGF0dHJpYnV0ZXM6IHsgY2xhc3M6ICdrZWRpby1zZWxlY3Qtc2VhcmNoJywgcGxhY2VIb2xkZXI6ICdTZWFyY2ggbWUuLi4nLCBpZ25vcmU6IHRydWUgfSB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQ6ICdzcGFuJywgYXR0cmlidXRlczogeyBjbGFzczogJ2tlZGlvLXNlbGVjdC1jb250ZW50cycgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50OiAnc3R5bGUnLCB0ZXh0OiBgLmtlZGlvLXNlbGVjdCB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogZ3JpZDtcclxuICAgICAgICAgICAgICAgICAgICBtYXgtaGVpZ2h0OiAyNTBweDtcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IG1heC1jb250ZW50O1xyXG4gICAgICAgICAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtcm93czogbWF4LWNvbnRlbnQgMWZyO1xyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgICAgICAgICAgICAgICAgICB6LWluZGV4OiAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAua2VkaW8tc2VsZWN0LWNvbnRyb2wge1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGdyaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgbWF4LWNvbnRlbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcnM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC5rZWRpby1zZWxlY3QtaW5wdXQge1xyXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlcjogbm9uZTtcclxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogdmFyKC0tc2Vjb25kYXJ5LWNvbG9yKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLmtlZGlvLXNlbGVjdC1zZWFyY2gge1xyXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IHZhcigtLXByaW1hcnktY29sb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiB2YXIoLS1zZWNvbmRhcnktY29sb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiB2YXIoLS1tYXRjaC1wYXJlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IC4zZW07XHJcbiAgICAgICAgICAgICAgICAgICAganVzdGlmeS1zZWxmOiBjZW50ZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogbm9uZTtcclxuICAgICAgICAgICAgICAgICAgICBib3JkZXI6IG5vbmU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC5rZWRpby1zZWxlY3QtdG9nZ2xlIHtcclxuICAgICAgICAgICAgICAgICAgICBib3JkZXItbGVmdDogMnB4IHNvbGlkIHZhcigtLXNlY29uZGFyeS1jb2xvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyLXRvcDogMnB4IHNvbGlkIHZhcigtLXNlY29uZGFyeS1jb2xvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtOiByb3RhdGUoMjI1ZGVnKTtcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogLjVlbTtcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IC41ZW07XHJcbiAgICAgICAgICAgICAgICAgICAgbWFyZ2luOiAuM2VtO1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnNvcjogcG9pbnRlclxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAua2VkaW8tc2VsZWN0LWNvbnRlbnRzIHtcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogdmFyKC0tZmlsbC1wYXJlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBub25lO1xyXG4gICAgICAgICAgICAgICAgICAgIGp1c3RpZnktaXRlbXM6IGNlbnRlcjtcclxuICAgICAgICAgICAgICAgICAgICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcclxuICAgICAgICAgICAgICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgICAgICAgICAgICAgICAgIG92ZXJmbG93OiBhdXRvO1xyXG4gICAgICAgICAgICAgICAgICAgIHotaW5kZXg6IDEwMDA7XHJcbiAgICAgICAgICAgICAgICAgICAgbWluLWhlaWdodDogNTBweDtcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IG1heC1jb250ZW50O1xyXG4gICAgICAgICAgICAgICAgICAgIG1heC1oZWlnaHQ6IDI1MHB4O1xyXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkO1xyXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXByaW1hcnktY29sb3IpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAua2VkaW8tc2VsZWN0LW9wdGlvbiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgICAgICAgICAgICAgICBwbGFjZS1pdGVtczogY2VudGVyO1xyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiB2YXIoLS1tYXRjaC1wYXJlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IC41ZW07XHJcbiAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAua2VkaW8tc2VsZWN0LW9wdGlvbjpob3ZlciwgLmtlZGlvLXNlbGVjdC1hY3RpdmUtb3B0aW9ue1xyXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXNlY29uZGFyeS1jb2xvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IHZhcigtLXByaW1hcnktY29sb3IpO1xyXG4gICAgICAgICAgICAgICAgfWB9XHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9KTtcclxuICAgICAgICBzZWxlY3QuY2xhc3NMaXN0LmFkZCgna2VkaW8tc2VsZWN0Jyk7XHJcbiAgICAgICAgbGV0IHNldFZhbHVlID0gc2VsZWN0LmdldEF0dHJpYnV0ZSgndmFsdWUnKTtcclxuICAgICAgICBzZWxlY3QudmFsdWUgPSBbXTtcclxuICAgICAgICBpZiAoIXRoaXMuaXNudWxsKHNldFZhbHVlKSkge1xyXG4gICAgICAgICAgICBzZWxlY3QudmFsdWUgPSB0aGlzLmFycmF5LmZpbmRBbGwoc2V0VmFsdWUuc3BsaXQoJywnKSwgdiA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdi50cmltKCkgIT0gJyc7XHJcbiAgICAgICAgICAgIH0pOy8vcmVtb3ZlIGFsbCBlbXB0eSBzdHJpbmdzXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZWxlY3QuZGF0YXNldC5hY3RpdmUgPSAnZmFsc2UnO1xyXG4gICAgICAgIC8vZ2V0IHRoZSBjb250ZW50c1xyXG4gICAgICAgIGxldCBjb250ZW50cyA9IHNlbGVjdC5maW5kKCcua2VkaW8tc2VsZWN0LWNvbnRlbnRzJyk7XHJcbiAgICAgICAgbGV0IGlucHV0ID0gc2VsZWN0LmZpbmQoJy5rZWRpby1zZWxlY3QtaW5wdXQnKTtcclxuICAgICAgICBsZXQgc2VhcmNoID0gc2VsZWN0LmZpbmQoJy5rZWRpby1zZWxlY3Qtc2VhcmNoJyk7XHJcbiAgICAgICAgbGV0IHRvZ2dsZSA9IHNlbGVjdC5maW5kKCcua2VkaW8tc2VsZWN0LXRvZ2dsZScpO1xyXG4gICAgICAgIHBhcmFtcy5jb250ZW50cyA9IHBhcmFtcy5jb250ZW50cyB8fCB7fTtcclxuICAgICAgICAvL3BvcHVsYXRlIHRoZSBlbGVtZW50IGNvbnRlbnRzXHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocGFyYW1zLmNvbnRlbnRzKSkgey8vVHVybiBjb250ZW50cyB0byBvYmplY3QgaWYgaXRzIGFycmF5XHJcbiAgICAgICAgICAgIGxldCBpdGVtcyA9IHBhcmFtcy5jb250ZW50cztcclxuICAgICAgICAgICAgcGFyYW1zLmNvbnRlbnRzID0ge307XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHBhcmFtcy5jb250ZW50c1tpdGVtc1tpXV0gPSBpdGVtc1tpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSBpbiBwYXJhbXMuY29udGVudHMpIHtcclxuICAgICAgICAgICAgbGV0IG9wdGlvbiA9IGNvbnRlbnRzLm1ha2VFbGVtZW50KHsgZWxlbWVudDogJ3NwYW4nLCBhdHRyaWJ1dGVzOiB7IGNsYXNzOiAna2VkaW8tc2VsZWN0LW9wdGlvbicsIHZhbHVlOiBpIH0gfSk7XHJcbiAgICAgICAgICAgIG9wdGlvbi5pbm5lckhUTUwgPSBwYXJhbXMuY29udGVudHNbaV07XHJcbiAgICAgICAgICAgIG9wdGlvbi52YWx1ZSA9IGk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGxldCB2IG9mIHNlbGVjdC52YWx1ZSkge1xyXG4gICAgICAgICAgICBpbnB1dC52YWx1ZSArPSBwYXJhbXMuY29udGVudHNbdl07XHJcbiAgICAgICAgICAgIGlucHV0LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdjaGFuZ2UnKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL2VuYWJsZSBtdWx0aXBsZSB2YWx1ZXNcclxuICAgICAgICBsZXQgc2luZ2xlID0gKCF0aGlzLmlzc2V0KHBhcmFtcy5tdWx0aXBsZSkgfHwgcGFyYW1zLm11bHRpcGxlID09IGZhbHNlKTtcclxuXHJcbiAgICAgICAgbGV0IG9wdGlvbnMgPSBzZWxlY3QuZmluZEFsbCgnLmtlZGlvLXNlbGVjdC1vcHRpb24nKTtcclxuXHJcbiAgICAgICAgLy9zZWFyY2ggdGhlIGNvbnRlbnRzXHJcbiAgICAgICAgc2VhcmNoLm9uQ2hhbmdlZCh2YWx1ZSA9PiB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3B0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFvcHRpb25zW2ldLnRleHRDb250ZW50LnRvTG93ZXJDYXNlKCkuaW5jbHVkZXModmFsdWUudG9Mb3dlckNhc2UoKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zW2ldLmNzcyh7IGRpc3BsYXk6ICdub25lJyB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnNbaV0uY3NzUmVtb3ZlKFsnZGlzcGxheSddKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvL25hdmlnYXRlIHRoZSBjb250ZW50c1xyXG4gICAgICAgIGxldCBuYXZpZ2F0ZSA9IGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgYWxsb3dOYXZpZ2F0ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBpZiAoZXZlbnQua2V5ID09ICdBcnJvd0Rvd24nICYmIHNjcm9sbFBvc2l0aW9uIDwgb3B0aW9ucy5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICAgICAgICBzY3JvbGxQb3NpdGlvbisrO1xyXG4gICAgICAgICAgICAgICAgYWxsb3dOYXZpZ2F0ZSA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoZXZlbnQua2V5ID09ICdBcnJvd1VwJyAmJiBzY3JvbGxQb3NpdGlvbiA+IDApIHtcclxuICAgICAgICAgICAgICAgIHNjcm9sbFBvc2l0aW9uLS07XHJcbiAgICAgICAgICAgICAgICBhbGxvd05hdmlnYXRlID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChldmVudC5rZXkgPT0gJ0VudGVyJykge1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGFsbG93TmF2aWdhdGUpIHtcclxuICAgICAgICAgICAgICAgIGFjdGl2ZSA9IGNvbnRlbnRzLmZpbmQoJy5rZWRpby1zZWxlY3QtYWN0aXZlLW9wdGlvbicpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmlzbnVsbChhY3RpdmUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlLmNsYXNzTGlzdC5yZW1vdmUoJ2tlZGlvLXNlbGVjdC1hY3RpdmUtb3B0aW9uJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgb3B0aW9uc1tzY3JvbGxQb3NpdGlvbl0uY2xhc3NMaXN0LmFkZCgna2VkaW8tc2VsZWN0LWFjdGl2ZS1vcHRpb24nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy90b2dnbGUgdGhlIGNvbnRlbnRzXHJcbiAgICAgICAgdG9nZ2xlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICBsZXQgYWN0aXZlID0gc2VsZWN0LmRhdGFzZXQuYWN0aXZlID09ICd0cnVlJztcclxuICAgICAgICAgICAgaWYgKGFjdGl2ZSkge1xyXG4gICAgICAgICAgICAgICAgZGVhY3RpdmF0ZShhY3RpdmUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYWN0aXZhdGUoYWN0aXZlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvL3Nob3cgdGhlIGNvbnRlbnRzXHJcbiAgICAgICAgbGV0IGluVmlldywgdG9wLCBib3R0b207XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jc3MoeyBvdmVyZmxvdzogJ2F1dG8nIH0pXHJcblxyXG4gICAgICAgIGxldCBwbGFjZUNvbnRlbnRzID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0b3AgPSBzZWxlY3QucG9zaXRpb24oKS50b3A7XHJcbiAgICAgICAgICAgIGJvdHRvbSA9IGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0IC0gc2VsZWN0LnBvc2l0aW9uKCkudG9wO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRvcCA+IGJvdHRvbSkge1xyXG4gICAgICAgICAgICAgICAgY29udGVudHMuY3NzKHsgdG9wOiAtY29udGVudHMucG9zaXRpb24oKS5oZWlnaHQgKyAncHgnIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29udGVudHMuY3NzKHsgdG9wOiBzZWxlY3QucG9zaXRpb24oKS5oZWlnaHQgKyAncHgnIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL3Nob3cgY29udGVudHNcclxuICAgICAgICBsZXQgYWN0aXZhdGUgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChzZWxlY3QuaW5WaWV3KCdib2R5JykpIHtcclxuICAgICAgICAgICAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBuYXZpZ2F0ZSwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgc2VhcmNoLmNzcyh7IGRpc3BsYXk6ICdmbGV4JyB9KTtcclxuICAgICAgICAgICAgICAgIGNvbnRlbnRzLmNzcyh7IGRpc3BsYXk6ICdmbGV4JyB9KTtcclxuICAgICAgICAgICAgICAgIHBsYWNlQ29udGVudHMoKTtcclxuICAgICAgICAgICAgICAgIHNlbGVjdC5kYXRhc2V0LmFjdGl2ZSA9ICd0cnVlJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9oaWRlIHRoZSBjb250ZW50c1xyXG4gICAgICAgIGxldCBkZWFjdGl2YXRlID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBpbnB1dC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgbmF2aWdhdGUsIGZhbHNlKTtcclxuICAgICAgICAgICAgc2VhcmNoLmNzc1JlbW92ZShbJ2Rpc3BsYXknXSk7XHJcbiAgICAgICAgICAgIGNvbnRlbnRzLmNzc1JlbW92ZShbJ2Rpc3BsYXknXSk7XHJcbiAgICAgICAgICAgIHNlbGVjdC5kYXRhc2V0LmFjdGl2ZSA9ICdmYWxzZSc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL3VwZGF0ZSB0aGUgc2VsZWN0ZWRcclxuICAgICAgICBsZXQgdXBkYXRlID0gKHZhbHVlcykgPT4ge1xyXG4gICAgICAgICAgICBzZWxlY3RlZCA9IFtdO1xyXG4gICAgICAgICAgICB2YWx1ZXMgPSB2YWx1ZXMuc3BsaXQoJywnKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgdmFsdWUgb2YgdmFsdWVzKSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgaW4gcGFyYW1zLmNvbnRlbnRzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmFtcy5jb250ZW50c1tpXSA9PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHNlbGVjdGVkLnB1c2godmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzZWxlY3QudmFsdWUgPSBzZWxlY3RlZDtcclxuICAgICAgICAgICAgaW5wdXQudmFsdWUgPSB2YWx1ZXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL2NoZWNrIHdoZW4gYWN0aXZhdGVkXHJcbiAgICAgICAgc2VsZWN0LmJ1YmJsZWRFdmVudCgnY2xpY2snLCBldmVudCA9PiB7XHJcbiAgICAgICAgICAgIGlmIChldmVudC50YXJnZXQgIT0gdG9nZ2xlICYmIHNlbGVjdC5kYXRhc2V0LmFjdGl2ZSA9PSAnZmFsc2UnKSB7XHJcbiAgICAgICAgICAgICAgICBhY3RpdmF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygna2VkaW8tc2VsZWN0LW9wdGlvbicpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGV4dCA9IHBhcmFtcy5jb250ZW50c1tldmVudC50YXJnZXQudmFsdWVdO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBhcmFtcy5tdWx0aXBsZSA9PSAnc2luZ2xlJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbnB1dC52YWx1ZS5pbmNsdWRlcyh0ZXh0KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnB1dC52YWx1ZSA9IGlucHV0LnZhbHVlLnJlcGxhY2UodGV4dCwgJycpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQudmFsdWUgKz0gYCwgJHt0ZXh0fWA7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQudmFsdWUgKz0gYCwgJHt0ZXh0fWA7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaW5wdXQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2NoYW5nZScpKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoc2luZ2xlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVhY3RpdmF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vY2hlY2sgd2hlbiBkZWFjdGl2YXRlZFxyXG4gICAgICAgIHNlbGVjdC5ub3RCdWJibGVkRXZlbnQoJ2NsaWNrJywgZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICBpZiAoc2VsZWN0LmRhdGFzZXQuYWN0aXZlID09ICd0cnVlJykge1xyXG4gICAgICAgICAgICAgICAgZGVhY3RpdmF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vd2hlbiBpbnB1dCB2YWx1ZSBjaGFuZ2VzXHJcbiAgICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICBsZXQgdmFsdWVzID0gaW5wdXQudmFsdWUuc3BsaXQoJywnKTtcclxuXHJcbiAgICAgICAgICAgIHZhbHVlcyA9IHRoaXMuYXJyYXkuZmluZEFsbCh2YWx1ZXMsIHZhbHVlID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS50cmltKCkgIT0gJyc7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdmFsdWVzID0gdGhpcy5hcnJheS5lYWNoKHZhbHVlcywgdmFsdWUgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLnRyaW0oKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXNpbmdsZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHBhcmFtcy5tdWx0aXBsZSA9PSAnc2luZ2xlJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlcyA9IHRoaXMuYXJyYXkudG9TZXQodmFsdWVzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFsdWVzID0gdmFsdWVzLmpvaW4oJywgJyk7XHJcbiAgICAgICAgICAgIHVwZGF0ZSh2YWx1ZXMpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvL2FsaWduIGNvbnRlbnRzIG9uIHNjcm9sbFxyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBldmVudCA9PiB7XHJcbiAgICAgICAgICAgIGlmIChzZWxlY3QuaW5WaWV3KCdib2R5JykpIHtcclxuICAgICAgICAgICAgICAgIHBsYWNlQ29udGVudHMoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gc2VsZWN0O1xyXG4gICAgfVxyXG5cclxuICAgIGNob29zZShwYXJhbXMgPSB7IG5vdGU6ICcnLCBvcHRpb25zOiBbXSB9KSB7XHJcbiAgICAgICAgbGV0IGNob29zZVdpbmRvdyA9IHRoaXMuY3JlYXRlRWxlbWVudCh7XHJcbiAgICAgICAgICAgIGVsZW1lbnQ6ICdzcGFuJywgYXR0cmlidXRlczogeyBjbGFzczogJ2NyYXRlci1jaG9vc2UnIH0sIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgICAgICB7IGVsZW1lbnQ6ICdwJywgYXR0cmlidXRlczogeyBjbGFzczogJ2NyYXRlci1jaG9vc2Utbm90ZScgfSwgdGV4dDogcGFyYW1zLm5vdGUgfSxcclxuICAgICAgICAgICAgICAgIHsgZWxlbWVudDogJ3NwYW4nLCBhdHRyaWJ1dGVzOiB7IGNsYXNzOiAnY3JhdGVyLWNob29zZS1jb250cm9sJyB9IH0sXHJcbiAgICAgICAgICAgICAgICB7IGVsZW1lbnQ6ICdidXR0b24nLCBhdHRyaWJ1dGVzOiB7IGlkOiAnY3JhdGVyLWNob29zZS1jbG9zZScsIGNsYXNzOiAnYnRuJyB9LCB0ZXh0OiAnQ2xvc2UnIH1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBsZXQgY2hvb3NlQ29udHJvbCA9IGNob29zZVdpbmRvdy5xdWVyeVNlbGVjdG9yKCcuY3JhdGVyLWNob29zZS1jb250cm9sJyk7XHJcblxyXG4gICAgICAgIGNob29zZVdpbmRvdy5xdWVyeVNlbGVjdG9yKCcjY3JhdGVyLWNob29zZS1jbG9zZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICBjaG9vc2VXaW5kb3cucmVtb3ZlKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IG9wdGlvbiBvZiBwYXJhbXMub3B0aW9ucykge1xyXG4gICAgICAgICAgICBjaG9vc2VDb250cm9sLm1ha2VFbGVtZW50KHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQ6ICdidXR0b24nLCBhdHRyaWJ1dGVzOiB7IGNsYXNzOiAnYnRuIGNob29zZS1vcHRpb24nIH0sIHRleHQ6IG9wdGlvblxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGNob29zZVdpbmRvdywgY2hvaWNlOiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjaG9vc2VDb250cm9sLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChldmVudC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjaG9vc2Utb3B0aW9uJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShldmVudC50YXJnZXQudGV4dENvbnRlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaG9vc2VXaW5kb3cucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICB0ZXh0RWRpdG9yKHBhcmFtcyA9IHsgaWQ6ICcnLCB3aWR0aDogJ21heC13aWR0aCcgfSkge1xyXG4gICAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcclxuICAgICAgICBwYXJhbXMuaWQgPSBwYXJhbXMuaWQgfHwgJ3RleHQtZWRpdG9yJztcclxuICAgICAgICBsZXQgdGV4dEVkaXRvciA9IHRoaXMuY3JlYXRlRWxlbWVudCh7XHJcbiAgICAgICAgICAgIGVsZW1lbnQ6ICdkaXYnLCBhdHRyaWJ1dGVzOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogcGFyYW1zLmlkXHJcbiAgICAgICAgICAgIH0sIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudDogJ3N0eWxlJywgdGV4dDogYFxyXG5cclxuICAgICAgICAgICAgICAgICAgICBkaXYjY3JhdGVyLXRleHQtZWRpdG9ye1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW46IDAgYXV0bztcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogZ3JpZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICR7cGFyYW1zLndpZHRoIHx8ICdtYXgtY29udGVudCd9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IG1heC1jb250ZW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3JkZXI6IDJweCBzb2xpZCByZ2IoNDAsIDExMCwgODkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3JkZXItcmFkaXVzOiA4cHggOHB4IDBweCAwcHg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXByaW1hcnktY29sb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBkaXYjY3JhdGVyLXJpY2gtdGV4dC1hcmVhe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZGl2I2NyYXRlci10aGUtcmliYm9ue1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3JkZXItYm90dG9tOiBub25lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogMTAwJTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogLjVlbSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBncmlkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBncmlkLXRlbXBsYXRlLXJvd3M6IG1heC1jb250ZW50IG1heC1jb250ZW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoNDAsIDExMCwgODkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogdmFyKC0tcHJpbWFyeS1jb2xvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQtYWxpZ246IGxlZnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZnJhbWUjY3JhdGVyLXRoZS1XWVNJV1lHe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZGl2I2NyYXRlci10aGUtcmliYm9uIGJ1dHRvbntcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IHZhcigtLXByaW1hcnktY29sb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3JkZXI6IG5vbmU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dGxpbmU6IG5vbmU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IC4zZW07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbjogLjVlbTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGRpdiNjcmF0ZXItdGhlLXJpYmJvbiBidXR0b246aG92ZXJ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYigyMCwgOTAsIDcwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogYWxsIDAuM3MgbGluZWFyIDBzO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZGl2I2NyYXRlci10aGUtcmliYm9uIGlucHV0LCAgZGl2I2NyYXRlci10aGUtcmliYm9uIHNlbGVjdHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luOiAuNWVtO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZGl2I2NyYXRlci10aGUtcmliYm9uIGlucHV0W3R5cGU9XCJjb2xvclwiXXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiBub25lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRsaW5lOiBub25lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50OiAnZGl2JywgYXR0cmlidXRlczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogJ2NyYXRlci10aGUtcmliYm9uJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQ6ICdzcGFuJywgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGVsZW1lbnQ6ICdidXR0b24nLCBhdHRyaWJ1dGVzOiB7IGlkOiAndW5kb0J1dHRvbicsIHRpdGxlOiAnVW5kbycgfSwgdGV4dDogJyZsYXJyOycgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGVsZW1lbnQ6ICdidXR0b24nLCBhdHRyaWJ1dGVzOiB7IGlkOiAncmVkb0J1dHRvbicsIHRpdGxlOiAnUmVkbycgfSwgdGV4dDogJyZyYXJyOycgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGVsZW1lbnQ6ICdzZWxlY3QnLCBhdHRyaWJ1dGVzOiB7IGlkOiAnZm9udENoYW5nZXInIH0sIG9wdGlvbnM6IHRoaXMuZm9udFN0eWxlcyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgZWxlbWVudDogJ3NlbGVjdCcsIGF0dHJpYnV0ZXM6IHsgaWQ6ICdmb250U2l6ZUNoYW5nZXInIH0sIG9wdGlvbnM6IHRoaXMucmFuZ2UoMSwgMjApIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBlbGVtZW50OiAnYnV0dG9uJywgYXR0cmlidXRlczogeyBpZDogJ29yZGVyZWRMaXN0QnV0dG9uJywgdGl0bGU6ICdOdW1iZXJlZCBMaXN0JyB9LCB0ZXh0OiAnKGkpJyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgZWxlbWVudDogJ2J1dHRvbicsIGF0dHJpYnV0ZXM6IHsgaWQ6ICd1bm9yZGVyZWRMaXN0QnV0dG9uJywgdGl0bGU6ICdCdWxsZXR0ZWQgTGlzdCcgfSwgdGV4dDogJyZidWxsOycgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGVsZW1lbnQ6ICdidXR0b24nLCBhdHRyaWJ1dGVzOiB7IGlkOiAnbGlua0J1dHRvbicsIHRpdGxlOiAnQ3JlYXRlIExpbmsnIH0sIHRleHQ6ICdMaW5rJyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgZWxlbWVudDogJ2J1dHRvbicsIGF0dHJpYnV0ZXM6IHsgaWQ6ICd1bkxpbmtCdXR0b24nLCB0aXRsZTogJ1JlbW92ZSBMaW5rJyB9LCB0ZXh0OiAnVW5saW5rJyB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQ6ICdzcGFuJywgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGVsZW1lbnQ6ICdidXR0b24nLCBhdHRyaWJ1dGVzOiB7IGlkOiAnYm9sZEJ1dHRvbicsIHRpdGxlOiAnQm9sZCcgfSwgY2hpbGRyZW46IFt7IGVsZW1lbnQ6ICdiJywgdGV4dDogJ0InIH1dIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBlbGVtZW50OiAnYnV0dG9uJywgYXR0cmlidXRlczogeyBpZDogJ2l0YWxpY0J1dHRvbicsIHRpdGxlOiAnSXRhbGljJyB9LCBjaGlsZHJlbjogW3sgZWxlbWVudDogJ2VtJywgdGV4dDogJ0knIH1dIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBlbGVtZW50OiAnYnV0dG9uJywgYXR0cmlidXRlczogeyBpZDogJ3VuZGVybGluZUJ1dHRvbicsIHRpdGxlOiAnVW5kZXJsaW5lJyB9LCBjaGlsZHJlbjogW3sgZWxlbWVudDogJ3UnLCB0ZXh0OiAnVScgfV0gfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGVsZW1lbnQ6ICdidXR0b24nLCBhdHRyaWJ1dGVzOiB7IGlkOiAnc3VwQnV0dG9uJywgdGl0bGU6ICdTdXBlcnNjcmlwdCcgfSwgY2hpbGRyZW46IFt7IGVsZW1lbnQ6ICdzdXAnLCB0ZXh0OiAnMicgfV0gfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGVsZW1lbnQ6ICdidXR0b24nLCBhdHRyaWJ1dGVzOiB7IGlkOiAnc3ViQnV0dG9uJywgdGl0bGU6ICdTdWJzY3JpcHQnIH0sIGNoaWxkcmVuOiBbeyBlbGVtZW50OiAnc3ViJywgdGV4dDogJzInIH1dIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBlbGVtZW50OiAnYnV0dG9uJywgYXR0cmlidXRlczogeyBpZDogJ3N0cmlrZUJ1dHRvbicsIHRpdGxlOiAnU3RyaWtldGhyb3VnaCcgfSwgY2hpbGRyZW46IFt7IGVsZW1lbnQ6ICdzJywgdGV4dDogJ2FiYycgfV0gfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGVsZW1lbnQ6ICdpbnB1dCcsIGF0dHJpYnV0ZXM6IHsgdHlwZTogJ2NvbG9yJywgaWQ6ICdmb250Q29sb3JCdXR0b24nLCB0aXRsZTogJ0NoYW5nZSBGb250IENvbG9yJywgdmFsdWU6ICcjMDAwMDAwJyB9IH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBlbGVtZW50OiAnaW5wdXQnLCBhdHRyaWJ1dGVzOiB7IHR5cGU6ICdjb2xvcicsIGlkOiAnaGlnaGxpZ2h0QnV0dG9uJywgdGl0bGU6ICdIaWdodGxpZ2h0IFRleHQnLCB2YWx1ZTogJyNmZmZmZmYnIH0gfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGVsZW1lbnQ6ICdpbnB1dCcsIGF0dHJpYnV0ZXM6IHsgdHlwZTogJ2NvbG9yJywgaWQ6ICdiYWNrZ3JvdW5kQnV0dG9uJywgdGl0bGU6ICdDaGFuZ2UgQmFja2dyb3VuZCcsIHZhbHVlOiAnI2ZmZmZmZicgfSB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgZWxlbWVudDogJ2J1dHRvbicsIGF0dHJpYnV0ZXM6IHsgaWQ6ICdhbGlnbkxlZnRCdXR0b24nLCB0aXRsZTogJ0FsaWduIExlZnQnIH0sIGNoaWxkcmVuOiBbeyBlbGVtZW50OiAnYScsIHRleHQ6ICdMJyB9XSB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgZWxlbWVudDogJ2J1dHRvbicsIGF0dHJpYnV0ZXM6IHsgaWQ6ICdhbGlnbkNlbnRlckJ1dHRvbicsIHRpdGxlOiAnQWxpZ24gQ2VudGVyJyB9LCBjaGlsZHJlbjogW3sgZWxlbWVudDogJ2EnLCB0ZXh0OiAnQycgfV0gfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGVsZW1lbnQ6ICdidXR0b24nLCBhdHRyaWJ1dGVzOiB7IGlkOiAnYWxpZ25KdXN0aWZ5QnV0dG9uJywgdGl0bGU6ICdBbGlnbiBKdXN0aWZ5JyB9LCBjaGlsZHJlbjogW3sgZWxlbWVudDogJ2EnLCB0ZXh0OiAnSicgfV0gfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGVsZW1lbnQ6ICdidXR0b24nLCBhdHRyaWJ1dGVzOiB7IGlkOiAnYWxpZ25SaWdodEJ1dHRvbicsIHRpdGxlOiAnQWxpZ24gUmlnaHQnIH0sIGNoaWxkcmVuOiBbeyBlbGVtZW50OiAnYScsIHRleHQ6ICdSJyB9XSB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQ6ICdkaXYnLCBhdHRyaWJ1dGVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiAnY3JhdGVyLXJpY2gtdGV4dC1hcmVhJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQ6ICdpZnJhbWUnLCBhdHRyaWJ1dGVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6ICdjcmF0ZXItdGhlLVdZU0lXWUcnLCBmcmFtZUJvcmRlcjogMCwgbmFtZTogJ3RoZVdZU0lXWUcnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgbGV0IGZvbnRzID0gdGV4dEVkaXRvci5maW5kQWxsKCdzZWxlY3QjZm9udC1jaGFuZ2VyID4gb3B0aW9uJyk7XHJcbiAgICAgICAgZm9udHMuZm9yRWFjaChmb250ID0+IHtcclxuICAgICAgICAgICAgZm9udC5jc3MoeyBmb250RmFtaWx5OiBmb250LnZhbHVlIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0ZXh0RWRpdG9yLmZpbmQoJyN1bm9yZGVyZWRMaXN0QnV0dG9uJykuaW5uZXJIVE1MID0gJyZidWxsOyc7XHJcbiAgICAgICAgdGV4dEVkaXRvci5maW5kKCcjcmVkb0J1dHRvbicpLmlubmVySFRNTCA9ICcmcmFycjsnO1xyXG4gICAgICAgIHRleHRFZGl0b3IuZmluZCgnI3VuZG9CdXR0b24nKS5pbm5lckhUTUwgPSAnJmxhcnI7JztcclxuXHJcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGxldCBlZGl0b3JXaW5kb3cgPSB0ZXh0RWRpdG9yLmZpbmQoJyNjcmF0ZXItdGhlLVdZU0lXWUcnKTtcclxuICAgICAgICBlZGl0b3JXaW5kb3cub25BZGRlZCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBlZGl0b3IgPSBlZGl0b3JXaW5kb3cuY29udGVudFdpbmRvdy5kb2N1bWVudDtcclxuXHJcbiAgICAgICAgICAgIGVkaXRvci5ib2R5LmlubmVySFRNTCA9ICcnO1xyXG4gICAgICAgICAgICBpZiAoc2VsZi5pc3NldChwYXJhbXMuY29udGVudCkpIHtcclxuICAgICAgICAgICAgICAgIGVkaXRvci5ib2R5LmlubmVySFRNTCA9IHBhcmFtcy5jb250ZW50LmlubmVySFRNTDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZWRpdG9yLmRlc2lnbk1vZGUgPSAnb24nO1xyXG5cclxuICAgICAgICAgICAgdGV4dEVkaXRvci5maW5kKCcjYm9sZEJ1dHRvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZWRpdG9yLmV4ZWNDb21tYW5kKCdCb2xkJywgZmFsc2UsIG51bGwpO1xyXG4gICAgICAgICAgICB9LCBmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICB0ZXh0RWRpdG9yLmZpbmQoJyNpdGFsaWNCdXR0b24nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGVkaXRvci5leGVjQ29tbWFuZCgnSXRhbGljJywgZmFsc2UsIG51bGwpO1xyXG4gICAgICAgICAgICB9LCBmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICB0ZXh0RWRpdG9yLmZpbmQoJyN1bmRlcmxpbmVCdXR0b24nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGVkaXRvci5leGVjQ29tbWFuZCgnVW5kZXJsaW5lJywgZmFsc2UsIG51bGwpO1xyXG4gICAgICAgICAgICB9LCBmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICB0ZXh0RWRpdG9yLmZpbmQoJyNzdXBCdXR0b24nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGVkaXRvci5leGVjQ29tbWFuZCgnU3VwZXJzY3JpcHQnLCBmYWxzZSwgbnVsbCk7XHJcbiAgICAgICAgICAgIH0sIGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgIHRleHRFZGl0b3IuZmluZCgnI3N1YkJ1dHRvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZWRpdG9yLmV4ZWNDb21tYW5kKCdTdWJzY3JpcHQnLCBmYWxzZSwgbnVsbCk7XHJcbiAgICAgICAgICAgIH0sIGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgIHRleHRFZGl0b3IuZmluZCgnI3N0cmlrZUJ1dHRvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZWRpdG9yLmV4ZWNDb21tYW5kKCdTdHJpa2V0aHJvdWdoJywgZmFsc2UsIG51bGwpO1xyXG4gICAgICAgICAgICB9LCBmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICB0ZXh0RWRpdG9yLmZpbmQoJyNvcmRlcmVkTGlzdEJ1dHRvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZWRpdG9yLmV4ZWNDb21tYW5kKCdJbnNlcnRPcmRlcmVkTGlzdCcsIGZhbHNlLCBgbmV3T0wke3NlbGYucmFuZG9tKCl9YCk7XHJcbiAgICAgICAgICAgIH0sIGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgIHRleHRFZGl0b3IuZmluZCgnI3Vub3JkZXJlZExpc3RCdXR0b24nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGVkaXRvci5leGVjQ29tbWFuZCgnSW5zZXJ0VW5vcmRlcmVkTGlzdCcsIGZhbHNlLCBgbmV3VUwke3NlbGYucmFuZG9tKCl9YCk7XHJcbiAgICAgICAgICAgIH0sIGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgIHRleHRFZGl0b3IuZmluZCgnI2ZvbnRDb2xvckJ1dHRvbicpLm9uQ2hhbmdlZCh2YWx1ZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlZGl0b3IuZXhlY0NvbW1hbmQoJ0ZvcmVDb2xvcicsIGZhbHNlLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGV4dEVkaXRvci5maW5kKCcjaGlnaGxpZ2h0QnV0dG9uJykub25DaGFuZ2VkKHZhbHVlID0+IHtcclxuICAgICAgICAgICAgICAgIGVkaXRvci5leGVjQ29tbWFuZCgnQmFja0NvbG9yJywgZmFsc2UsIHZhbHVlKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0ZXh0RWRpdG9yLmZpbmQoJyNiYWNrZ3JvdW5kQnV0dG9uJykub25DaGFuZ2VkKHZhbHVlID0+IHtcclxuICAgICAgICAgICAgICAgIGVkaXRvci5ib2R5LnN0eWxlLmJhY2tncm91bmQgPSB2YWx1ZTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0ZXh0RWRpdG9yLmZpbmQoJyNmb250Q2hhbmdlcicpLm9uQ2hhbmdlZCh2YWx1ZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlZGl0b3IuZXhlY0NvbW1hbmQoJ0ZvbnROYW1lJywgZmFsc2UsIHZhbHVlKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0ZXh0RWRpdG9yLmZpbmQoJyNmb250U2l6ZUNoYW5nZXInKS5vbkNoYW5nZWQodmFsdWUgPT4ge1xyXG4gICAgICAgICAgICAgICAgZWRpdG9yLmV4ZWNDb21tYW5kKCdGb250U2l6ZScsIGZhbHNlLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGV4dEVkaXRvci5maW5kKCcjbGlua0J1dHRvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHVybCA9IHByb21wdCgnRW50ZXIgYSBVUkwnLCAnaHR0cDovLycpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChzZWxmLmlzbnVsbCh1cmwpKSByZXR1cm47XHJcbiAgICAgICAgICAgICAgICBlZGl0b3IuZXhlY0NvbW1hbmQoJ0NyZWF0ZUxpbmsnLCBmYWxzZSwgdXJsKTtcclxuICAgICAgICAgICAgfSwgZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgdGV4dEVkaXRvci5maW5kKCcjdW5MaW5rQnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlZGl0b3IuZXhlY0NvbW1hbmQoJ1VuTGluaycsIGZhbHNlLCBudWxsKTtcclxuICAgICAgICAgICAgfSwgZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgdGV4dEVkaXRvci5maW5kKCcjdW5kb0J1dHRvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZWRpdG9yLmV4ZWNDb21tYW5kKCdVbmRvJywgZmFsc2UsIG51bGwpO1xyXG4gICAgICAgICAgICB9LCBmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICB0ZXh0RWRpdG9yLmZpbmQoJyNyZWRvQnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlZGl0b3IuZXhlY0NvbW1hbmQoJ3JlZG8nLCBmYWxzZSwgbnVsbCk7XHJcbiAgICAgICAgICAgIH0sIGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgIHRleHRFZGl0b3IuZmluZCgnI2FsaWduTGVmdEJ1dHRvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZWRpdG9yLmV4ZWNDb21tYW5kKCdqdXN0aWZ5TGVmdCcsIGZhbHNlLCBudWxsKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0ZXh0RWRpdG9yLmZpbmQoJyNhbGlnbkNlbnRlckJ1dHRvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZWRpdG9yLmV4ZWNDb21tYW5kKCdqdXN0aWZ5Q2VudGVyJywgZmFsc2UsIG51bGwpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRleHRFZGl0b3IuZmluZCgnI2FsaWduSnVzdGlmeUJ1dHRvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZWRpdG9yLmV4ZWNDb21tYW5kKCdqdXN0aWZ5RnVsbCcsIGZhbHNlLCBudWxsKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0ZXh0RWRpdG9yLmZpbmQoJyNhbGlnblJpZ2h0QnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlZGl0b3IuZXhlY0NvbW1hbmQoJ2p1c3RpZnlSaWdodCcsIGZhbHNlLCBudWxsKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSwgZmFsc2UpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGV4dEVkaXRvcjtcclxuICAgIH1cclxuXHJcbiAgICBkaXNwbGF5RGF0YShkYXRhID0ge30sIGNvbnRhaW5lcikge1xyXG4gICAgICAgIGxldCBsaW5lTnVtYmVycyA9IFtdO1xyXG4gICAgICAgIGxldCBkaXNwbGF5U3RyaW5nID0gKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZUVsZW1lbnQoeyBlbGVtZW50OiAnc3BhbicsIGF0dHJpYnV0ZXM6IHsgY2xhc3M6ICdrZWRpby1kYXRhLXN0cicgfSwgdGV4dDogYFwiJHt2YWx1ZX1cImAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgZGlzcGxheUxpdGVyYWwgPSAodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlRWxlbWVudCh7IGVsZW1lbnQ6ICdzcGFuJywgYXR0cmlidXRlczogeyBjbGFzczogJ2tlZGlvLWRhdGEtbGl0JyB9LCB0ZXh0OiBgJHt2YWx1ZX1gIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGRpc3BsYXlQdW5jdHVhdGlvbiA9ICh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVFbGVtZW50KHsgZWxlbWVudDogJ3NwYW4nLCBhdHRyaWJ1dGVzOiB7IGNsYXNzOiAna2VkaW8tZGF0YS1wdW4nIH0sIHRleHQ6IGAke3ZhbHVlfWAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgZGlzcGxheU5ld0xpbmUgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGluY3JlbWVudCsrO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVFbGVtZW50KHsgZWxlbWVudDogJ3NwYW4nLCBhdHRyaWJ1dGVzOiB7IGNsYXNzOiAna2VkaW8tZGF0YS1wbG4nIH0gfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgZGlzcGxheUl0ZW0gPSAodmFsdWUsIHBhcmFtcykgPT4ge1xyXG4gICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMgfHwge307XHJcbiAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5jcmVhdGVFbGVtZW50KHsgZWxlbWVudDogJ3NwYW4nLCBhdHRyaWJ1dGVzOiB7IGNsYXNzOiAna2VkaW8tZGF0YS1pdGVtJyB9IH0pO1xyXG4gICAgICAgICAgICBsaW5lTnVtYmVycy5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc3NldChwYXJhbXMua2V5KSkge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5tYWtlRWxlbWVudChbXHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheVN0cmluZyhwYXJhbXMua2V5KSxcclxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5UHVuY3R1YXRpb24oJyA6ICcpLFxyXG4gICAgICAgICAgICAgICAgICAgIGNob29zZURpc3BsYXkodmFsdWUpLFxyXG4gICAgICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLm1ha2VFbGVtZW50KFtcclxuICAgICAgICAgICAgICAgICAgICBjaG9vc2VEaXNwbGF5KHZhbHVlKSxcclxuICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGRpc3BsYXlBcnJheSA9ICh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgYXJyYXkgPSB0aGlzLmNyZWF0ZUVsZW1lbnQoeyBlbGVtZW50OiAnc3BhbicsIGF0dHJpYnV0ZXM6IHsgY2xhc3M6ICdrZWRpby1kYXRhLWJsb2NrJyB9IH0pO1xyXG4gICAgICAgICAgICBsaW5lTnVtYmVycy5wdXNoKGFycmF5KTtcclxuXHJcbiAgICAgICAgICAgIGFycmF5Lm1ha2VFbGVtZW50KGRpc3BsYXlQdW5jdHVhdGlvbignWycpKTtcclxuICAgICAgICAgICAgbGV0IGl0ZW07XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0gPSBhcnJheS5tYWtlRWxlbWVudChkaXNwbGF5SXRlbSh2YWx1ZVtpXSkpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpICE9IHZhbHVlLmxlbmd0aCAtIDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLm1ha2VFbGVtZW50KGRpc3BsYXlQdW5jdHVhdGlvbignLCcpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBhcnJheS5tYWtlRWxlbWVudChkaXNwbGF5UHVuY3R1YXRpb24oJ10nKSk7XHJcbiAgICAgICAgICAgIHJldHVybiBhcnJheTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBkaXNwbGF5T2JqZWN0ID0gKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBvYmplY3QgPSB0aGlzLmNyZWF0ZUVsZW1lbnQoeyBlbGVtZW50OiAnc3BhbicsIGF0dHJpYnV0ZXM6IHsgY2xhc3M6ICdrZWRpby1kYXRhLWJsb2NrJyB9IH0pO1xyXG4gICAgICAgICAgICBsaW5lTnVtYmVycy5wdXNoKG9iamVjdCk7XHJcblxyXG4gICAgICAgICAgICBvYmplY3QubWFrZUVsZW1lbnQoZGlzcGxheVB1bmN0dWF0aW9uKCd7JykpO1xyXG4gICAgICAgICAgICBsZXQgaXRlbTtcclxuICAgICAgICAgICAgbGV0IGkgPSAwO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0gPSBvYmplY3QubWFrZUVsZW1lbnQoZGlzcGxheUl0ZW0odmFsdWVba2V5XSwgeyBrZXkgfSkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGkgIT0gT2JqZWN0LmtleXModmFsdWUpLmxlbmd0aCAtIDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLm1ha2VFbGVtZW50KGRpc3BsYXlQdW5jdHVhdGlvbignLCcpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvYmplY3QubWFrZUVsZW1lbnQoZGlzcGxheVB1bmN0dWF0aW9uKCd9JykpO1xyXG4gICAgICAgICAgICByZXR1cm4gb2JqZWN0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGNob29zZURpc3BsYXkgPSAodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZGlzcGxheVN0cmluZyh2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBkaXNwbGF5QXJyYXkodmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRpc3BsYXlPYmplY3QodmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRpc3BsYXlMaXRlcmFsKHZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgbGluZUhlaWdodCA9ICcyNXB4JztcclxuICAgICAgICBsZXQgZGlzcGxheWVkID0gdGhpcy5jcmVhdGVFbGVtZW50KHtcclxuICAgICAgICAgICAgZWxlbWVudDogJ3ByZScsIGF0dHJpYnV0ZXM6IHsgY2xhc3M6ICdrZWRpby1kYXRhLXdpbmRvdycgfSwgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50OiAnc3BhbicsIGF0dHJpYnV0ZXM6IHsgY2xhc3M6ICdrZWRpby1kYXRhLWxpbmUnLCBzdHlsZTogeyBsaW5lSGVpZ2h0IH0gfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50OiAnc3BhbicsIGF0dHJpYnV0ZXM6IHsgY2xhc3M6ICdrZWRpby1kYXRhLXRvZ2dsZXMnIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudDogJ2NvZGUnLCBhdHRyaWJ1dGVzOiB7IGNsYXNzOiAna2VkaW8tZGF0YS1jb2RlJywgc3R5bGU6IHsgbGluZUhlaWdodCB9IH0sIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNob29zZURpc3BsYXkoZGF0YSlcclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQ6ICdzdHlsZScsIHRleHQ6IGAua2VkaW8tZGF0YS13aW5kb3cge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiBpbmhlcml0O1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGdyaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiBtYXgtY29udGVudCBtYXgtY29udGVudCAxZnI7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2FwOiAxZW07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC5rZWRpby1kYXRhLWxpbmUge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiBpbmhlcml0O1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGdyaWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC5rZWRpby1kYXRhLXRvZ2dsZXMge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiBpbmhlcml0O1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGdyaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAua2VkaW8tZGF0YS1saW5lLW51bWJlciB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IGluaGVyaXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgLyogZGlzcGxheTogZmxleDsgKi9cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLmtlZGlvLWRhdGEtdG9nZ2xlcyAua2VkaW8tZGF0YS10b2dnbGVzLWJ1dHRvbiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IGluaGVyaXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgICAgICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogLjhlbTtcclxuICAgICAgICAgICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAua2VkaW8tZGF0YS1jb2RlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogaW5oZXJpdDtcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC5rZWRpby1kYXRhLXB1biB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IGluaGVyaXQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC5rZWRpby1kYXRhLWxpdCB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IGluaGVyaXQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC5rZWRpby1kYXRhLWJsb2NrIHtcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogaW5oZXJpdDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLmtlZGlvLWRhdGEtc3RyIHtcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogaW5oZXJpdDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLmtlZGlvLWRhdGEtcGxuIHtcclxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBibG9jaztcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogMTAwJTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLmtlZGlvLWRhdGEtaXRlbSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWFyZ2luLWxlZnQ6IDIwcHg7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IGluaGVyaXQ7XHJcbiAgICAgICAgICAgICAgICB9YH1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pc3NldChjb250YWluZXIpKSB7XHJcbiAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmQoZGlzcGxheWVkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBjb2RlID0gZGlzcGxheWVkLmZpbmQoJy5rZWRpby1kYXRhLWNvZGUnKSxcclxuICAgICAgICAgICAgbnVtYmVycyxcclxuICAgICAgICAgICAgdG9nZ2xlQnV0dG9ucyxcclxuICAgICAgICAgICAgaGVpZ2h0ID0gY29kZS5wb3NpdGlvbigpLmhlaWdodCxcclxuICAgICAgICAgICAgbGluZXMgPSBkaXNwbGF5ZWQuZmluZCgnLmtlZGlvLWRhdGEtbGluZScpLFxyXG4gICAgICAgICAgICB0b2dnbGVzID0gZGlzcGxheWVkLmZpbmQoJy5rZWRpby1kYXRhLXRvZ2dsZXMnKSxcclxuICAgICAgICAgICAgY291bnQgPSBoZWlnaHQgLyBwYXJzZUludChsaW5lSGVpZ2h0KSxcclxuICAgICAgICAgICAgaXRlbXMgPSBjb2RlLmZpbmRBbGwoJy5rZWRpby1kYXRhLWl0ZW0nKSxcclxuICAgICAgICAgICAgYmxvY2tzID0gY29kZS5maW5kQWxsKCcua2VkaW8tZGF0YS1ibG9jaycpO1xyXG5cclxuICAgICAgICBsZXQgc2V0UmFuZ2UgPSAoYmxvY2spID0+IHtcclxuICAgICAgICAgICAgbGV0IHN0YXJ0ID0gTWF0aC5mbG9vcigoYmxvY2sucG9zaXRpb24oKS50b3AgLSBjb2RlLnBvc2l0aW9uKCkudG9wKSAvIHBhcnNlSW50KGxpbmVIZWlnaHQpKSArIDE7XHJcbiAgICAgICAgICAgIGxldCBlbmQgPSBNYXRoLmZsb29yKChibG9jay5wb3NpdGlvbigpLmJvdHRvbSAtIGNvZGUucG9zaXRpb24oKS50b3ApIC8gcGFyc2VJbnQobGluZUhlaWdodCkpICsgMTtcclxuICAgICAgICAgICAgYmxvY2sucmFuZ2UgPSB0aGlzLnJhbmdlKGVuZCwgc3RhcnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHNldE51bWJlcnMgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGluZU51bWJlcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxpbmVzLm1ha2VFbGVtZW50KFtcclxuICAgICAgICAgICAgICAgICAgICB7IGVsZW1lbnQ6ICdhJywgaHRtbDogYCR7aSAvIDEgKyAxfWAsIGF0dHJpYnV0ZXM6IHsgY2xhc3M6ICdrZWRpby1kYXRhLWxpbmUtbnVtYmVyJyB9IH1cclxuICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgc2V0VG9nZ2xlcyA9ICgpID0+IHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBibG9ja3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCB0b3AgPSBibG9ja3NbaV0ucG9zaXRpb24oKS50b3AgLSBjb2RlLnBvc2l0aW9uKCkudG9wICsgNiArICdweCdcclxuICAgICAgICAgICAgICAgIGxldCB0b2dnbGUgPSB0b2dnbGVzLm1ha2VFbGVtZW50KHsgZWxlbWVudDogJ2knLCBhdHRyaWJ1dGVzOiB7IGNsYXNzOiAna2VkaW8tZGF0YS10b2dnbGVzLWJ1dHRvbiBmYXMgZmEtYXJyb3ctZG93bicsIHN0eWxlOiB7IHRvcCB9IH0gfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdG9nZ2xlLmJsb2NrID0gYmxvY2tzW2ldO1xyXG4gICAgICAgICAgICAgICAgYmxvY2tzW2ldLnRvZ2dsZSA9IHRvZ2dsZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGFsaWduVG9nZ2xlcyA9ICgpID0+IHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b2dnbGVCdXR0b25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB0b2dnbGVCdXR0b25zW2ldLmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9wOiB0b2dnbGVCdXR0b25zW2ldLmJsb2NrLnBvc2l0aW9uKCkudG9wIC0gY29kZS5wb3NpdGlvbigpLnRvcCArIDYgKyAncHgnXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGhpZGVOdW1iZXJzID0gKGJsb2NrKSA9PiB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmxvY2sucmFuZ2UubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5pc3NldChudW1iZXJzW2Jsb2NrLnJhbmdlW2ldXS5jb250cm9sbGVyKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG51bWJlcnNbYmxvY2sucmFuZ2VbaV1dLmNzcyh7IGRpc3BsYXk6ICdub25lJyB9KTtcclxuICAgICAgICAgICAgICAgICAgICBudW1iZXJzW2Jsb2NrLnJhbmdlW2ldXS5jb250cm9sbGVyID0gYmxvY2s7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBoaWRlQmxvY2sgPSAoYmxvY2spID0+IHtcclxuICAgICAgICAgICAgbGV0IGJsb2NrQ29udGVudCA9IGJsb2NrLmNoaWxkcmVuO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJsb2NrQ29udGVudC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGJsb2NrQ29udGVudFtpXS5jbGFzc0xpc3QuY29udGFpbnMoJ2tlZGlvLWRhdGEtaXRlbScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmxvY2tDb250ZW50W2ldLmNzcyh7IGRpc3BsYXk6ICdub25lJyB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgYmxvY2tDb250ZW50W2ldLmZpbmRBbGwoJy5rZWRpby1kYXRhLWJsb2NrJykuZm9yRWFjaChiID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmlzc2V0KGIudG9nZ2xlLmNvbnRyb2xsZXIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiLnRvZ2dsZS5jb250cm9sbGVyID0gYmxvY2s7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiLnRvZ2dsZS5jc3MoeyBkaXNwbGF5OiAnbm9uZScgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHNob3dOdW1iZXJzID0gKGJsb2NrKSA9PiB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmxvY2sucmFuZ2UubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChudW1iZXJzW2Jsb2NrLnJhbmdlW2ldXS5jb250cm9sbGVyID09IGJsb2NrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbnVtYmVyc1tibG9jay5yYW5nZVtpXV0uY3NzUmVtb3ZlKFsnZGlzcGxheSddKTtcclxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgbnVtYmVyc1tibG9jay5yYW5nZVtpXV0uY29udHJvbGxlcjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHNob3dCbG9jayA9IChibG9jaykgPT4ge1xyXG4gICAgICAgICAgICBsZXQgYmxvY2tDb250ZW50ID0gYmxvY2suY2hpbGRyZW47XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmxvY2tDb250ZW50Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYmxvY2tDb250ZW50W2ldLmNsYXNzTGlzdC5jb250YWlucygna2VkaW8tZGF0YS1pdGVtJykpIHtcclxuICAgICAgICAgICAgICAgICAgICBibG9ja0NvbnRlbnRbaV0uY3NzUmVtb3ZlKFsnZGlzcGxheSddKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgYmxvY2tDb250ZW50W2ldLmZpbmRBbGwoJy5rZWRpby1kYXRhLWJsb2NrJykuZm9yRWFjaChiID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGIudG9nZ2xlLmNvbnRyb2xsZXIgPT0gYmxvY2spIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBiLnRvZ2dsZS5jb250cm9sbGVyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYi50b2dnbGUuY3NzUmVtb3ZlKFsnZGlzcGxheSddKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsaW5lTnVtYmVycy5wdXNoKHVuZGVmaW5lZClcclxuXHJcbiAgICAgICAgZGlzcGxheWVkLm9uQWRkZWQoZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICBzZXROdW1iZXJzKCk7XHJcbiAgICAgICAgICAgIHNldFRvZ2dsZXMoKTtcclxuXHJcbiAgICAgICAgICAgIG51bWJlcnMgPSBsaW5lcy5maW5kQWxsKCcua2VkaW8tZGF0YS1saW5lLW51bWJlcicpO1xyXG4gICAgICAgICAgICB0b2dnbGVCdXR0b25zID0gdG9nZ2xlcy5maW5kQWxsKCcua2VkaW8tZGF0YS10b2dnbGVzLWJ1dHRvbicpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGJsb2NrQ29udGVudCwgc3RhcnQsIGVuZDtcclxuICAgICAgICAgICAgZGlzcGxheWVkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRhcmdldCA9IGV2ZW50LnRhcmdldDtcclxuICAgICAgICAgICAgICAgIGlmICh0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdrZWRpby1kYXRhLXRvZ2dsZXMtYnV0dG9uJykpIHsvL2lmIHRvZ2dsZWRcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaXNzZXQodGFyZ2V0LmJsb2NrLnJhbmdlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRSYW5nZSh0YXJnZXQuYmxvY2spO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2ZhLWFycm93LWRvd24nKSkgey8vaWYgdG9nZ2xlIHRvIHNob3dcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGlkZU51bWJlcnModGFyZ2V0LmJsb2NrKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGlkZUJsb2NrKHRhcmdldC5ibG9jayk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93TnVtYmVycyh0YXJnZXQuYmxvY2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93QmxvY2sodGFyZ2V0LmJsb2NrKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldC5jbGFzc0xpc3QudG9nZ2xlKCdmYS1hcnJvdy11cCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldC5jbGFzc0xpc3QudG9nZ2xlKCdmYS1hcnJvdy1kb3duJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxpZ25Ub2dnbGVzKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gZGlzcGxheWVkO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENvbXBvbmVudHM7IiwiY2xhc3MgRnVuYyB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5jYXBpdGFscyA9IFwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpcIjtcclxuICAgICAgICB0aGlzLnNtYWxscyA9IFwiYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpcIjtcclxuICAgICAgICB0aGlzLmRpZ2l0cyA9IFwiMTIzNDU2Nzg5MFwiO1xyXG4gICAgICAgIHRoaXMuc3ltYm9scyA9IFwiLC4vPychQCMkJV4mKigpLV8rPWB+XFxcXHwgXCI7XHJcbiAgICAgICAgdGhpcy5tb250aHMgPSBbJ0phbnVhcnknLCAnRmVidWFyeScsICdNYXJjaCcsICdBcHJpbCcsICdNYXknLCAnSnVuZScsICdKdWx5JywgJ0F1Z3VzdCcsICdTZXB0ZW1iZXInLCAnT2N0b2JlcicsICdOb3ZlbWJlcicsICdEZWNlbWJlciddO1xyXG4gICAgICAgIHRoaXMuZGF5cyA9IFsnU3VuZGF5JywgJ01vbmRheScsICdUdWVzZGF5JywgJ1dlZG5lc2RheScsICdUaHVyc2RheScsICdGcmlkYXknLCAnU2F0dXJkYXknXTtcclxuICAgICAgICB0aGlzLmdlbmRlcnMgPSBbJ01hbGUnLCAnRmVtYWxlJywgJ0RvIG5vdCBkaXNjbG9zZSddO1xyXG4gICAgICAgIHRoaXMubWFyaXRhbHMgPSBbJ01hcnJpZWQnLCAnU2luZ2xlJywgJ0Rpdm9yY2VkJywgJ1dpZG93ZWQnXTtcclxuICAgICAgICB0aGlzLnJlbGlnaW9ucyA9IFsnQ2hyaXN0YWluaXR5JywgJ0lzbGFtJywgJ0p1ZGFpc20nLCAnUGFnYW5pc20nLCAnQnVkaXNtJ107XHJcbiAgICAgICAgdGhpcy51c2VyVHlwZXMgPSBbJ3N0dWRlbnQnLCAnc3RhZmYnLCAnYWRtaW4nLCAnY2VvJ107XHJcbiAgICAgICAgdGhpcy5zdGFmZlJlcXVlc3RzID0gWydsZWF2ZScsICdhbGxvd2FuY2UnXTtcclxuICAgICAgICB0aGlzLnN0dWRlbnRzUmVxdWVzdHMgPSBbJ2Fic2VuY2UnLCAnYWNhZGVtaWMnXTtcclxuICAgICAgICB0aGlzLnN1YmplY3RMaXN0ID0gWydNYXRoZW1hdGljcycsICdFbmdsaXNoJywgJ1BoeXNpY3MnLCAnQ2hlbWlzdHJ5JywgJ0Jpb2xvZ3knLCAnQWdyaWN1bHR1cmUnLCAnTGl0ZXJhdHVyZScsICdIaXN0b3J5J10uc29ydCgpO1xyXG4gICAgICAgIHRoaXMuc3ViamVjdExldmVscyA9IFsnR2VuZXJhbCcsICdTZW5pb3InLCAnU2NpZW5jZScsICdBcnRzJywgJ0p1bmlvciddO1xyXG4gICAgICAgIHRoaXMuZm9udFN0eWxlcyA9IFsnQXJpYWwnLCAnVGltZXMgTmV3IFJvbWFuJywgJ0hlbHZldGljYScsICdUaW1lcycsICdDb3VyaWVyIE5ldycsICdWZXJkYW5hJywgJ0NvdXJpZXInLCAnQXJpYWwgTmFycm93JywgJ0NhbmRhcmEnLCAnR2VuZXZhJywgJ0NhbGlicmknLCAnT3B0aW1hJywgJ0NhbWJyaWEnLCAnR2FyYW1vbmQnLCAnUGVycGV0dWEnLCAnTW9uYWNvJywgJ0RpZG90JywgJ0JydXNoIFNjcmlwdCBNVCcsICdMdWNpZGEgQnJpZ2h0JywgJ0NvcHBlcnBsYXRlJywgJ1NlcmlmJywgJ1Nhbi1TZXJpZicsICdHZW9yZ2lhJywgJ1NlZ29lIFVJJ107XHJcbiAgICAgICAgdGhpcy5waXhlbFNpemVzID0gWycwcHgnLCAnMXB4JywgJzJweCcsICczcHgnLCAnNHB4JywgJzVweCcsICc2cHgnLCAnN3B4JywgJzhweCcsICc5cHgnLCAnMTBweCcsICcyMHB4JywgJzMwcHgnLCAnNDBweCcsICc1MHB4JywgJzYwcHgnLCAnNzBweCcsICc4MHB4JywgJzkwcHgnLCAnMTAwcHgnLCAnTm9uZScsICdVbnNldCcsICdhdXRvJywgJy13ZWJraXQtZmlsbC1hdmFpbGFibGUnXTtcclxuICAgICAgICB0aGlzLmNvbG9ycyA9IFsnUmVkJywgJ0dyZWVuJywgJ0JsdWUnLCAnWWVsbG93JywgJ0JsYWNrJywgJ1doaXRlJywgJ1B1cnBsZScsICdWaW9sZXQnLCAnSW5kaWdvJywgJ09yYW5nZScsICdUcmFuc3BhcmVudCcsICdOb25lJywgJ1Vuc2V0J107XHJcbiAgICAgICAgdGhpcy5ib2xkbmVzcyA9IFsxMDAsIDIwMCwgMzAwLCA0MDAsIDUwMCwgNjAwLCA3MDAsIDgwMCwgOTAwLCAxMDAwLCAnbGlnaHRlcicsICdib2xkJywgJ2JvbGRlcicsICdub3JtYWwnLCAndW5zZXQnXTtcclxuICAgICAgICB0aGlzLmJvcmRlclR5cGVzID0gWydTb2xpZCcsICdEb3R0ZWQnLCAnRG91YmxlJywgJ0dyb292ZScsICdEYXNoZWQnLCAnSW5zZXQnLCAnTm9uZScsICdVbnNldCcsICdPdXRzZXQnLCAnUmlnZ2VkJywgJ0luaGVyaXQnLCAnSW5pdGlhbCddO1xyXG4gICAgICAgIHRoaXMuc2hhZG93cyA9IFsnMnB4IDJweCA1cHggMnB4IHJlZCcsICcycHggMnB4IDVweCBncmVlbicsICcycHggMnB4IHllbGxvdycsICcycHggYmxhY2snLCAnTm9uZScsICdVbnNldCddO1xyXG4gICAgICAgIHRoaXMuYm9yZGVycyA9IFsnMXB4IHNvbGlkIGJsYWNrJywgJzJweCBkb3R0ZWQgZ3JlZW4nLCAnM3B4IGRhc2hlZCB5ZWxsb3cnLCAnMXB4IGRvdWJsZSByZWQnLCAnTm9uZScsICdVbnNldCddO1xyXG4gICAgICAgIHRoaXMuYWxpZ25tZW50ID0gWydMZWZ0JywgJ0p1c3RpZmllZCcsICdSaWdodCcsICdDZW50ZXInXTtcclxuICAgIH1cclxuXHJcbiAgICBleHRyYWN0U291cmNlKHNvdXJjZSkge1xyXG4gICAgICAgIGxldCB2YWx1ZSA9IHRoaXMuaW5CZXR3ZWVuKHNvdXJjZSwgJyQjJnsnLCAnfSYjJCcpO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHZhbHVlID0gSlNPTi5wYXJzZSh2YWx1ZSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgdmFsdWUgPSB7fTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIGluZGV4QXQoaGF5c3RhY2sgPSAnJywgbmVlZGxlID0gJycsIHBvcyA9IDApIHtcclxuICAgICAgICBwb3MgPSBwb3MgfHwgMDtcclxuICAgICAgICBpZiAoaGF5c3RhY2suaW5kZXhPZihuZWVkbGUpID09IC0xKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGhheXN0YWNrID0gaGF5c3RhY2suc3BsaXQobmVlZGxlKTtcclxuICAgICAgICBpZiAocG9zID49IGhheXN0YWNrLmxlbmd0aCkge1xyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgaW5kZXggPSAwO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaGF5c3RhY2subGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGkgPD0gcG9zKSB7XHJcbiAgICAgICAgICAgICAgICBpbmRleCArPSBoYXlzdGFja1tpXS5sZW5ndGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaW5kZXggKz0gbmVlZGxlLmxlbmd0aCAqIHBvcztcclxuXHJcbiAgICAgICAgcmV0dXJuIGluZGV4O1xyXG4gICAgfVxyXG5cclxuICAgIGNvbWJpbmUoaGF5c3RhY2sgPSAnJywgZmlyc3QgPSAnJywgc2Vjb25kID0gJycsIHBvcyA9IDApIHtcclxuICAgICAgICBwb3MgPSBwb3MgfHwgMDsvL2luaXRpYWxpemUgcG9zaXRpb24gaWYgbm90IHNldFxyXG4gICAgICAgIGxldCBhdDEgPSBwb3MsXHJcbiAgICAgICAgICAgIGF0MiA9IGZpcnN0ID09PSBzZWNvbmQgPyBwb3MgKyAxIDogcG9zOyAvL2NoZWNrIGlmIGl0IGlzIHRoZSBzYW1lIGFuZCBjaGFuZ2UgcG9zaXRpb25cclxuICAgICAgICBsZXQgc3RhcnQgPSB0aGlzLmluZGV4QXQoaGF5c3RhY2ssIGZpcnN0LCBhdDEpOy8vZ2V0IHRoZSBzdGFydFxyXG4gICAgICAgIGxldCBlbmQgPSB0aGlzLmluZGV4QXQoaGF5c3RhY2ssIHNlY29uZCwgYXQyKTsvL2dldCB0aGUgZW5kXHJcblxyXG4gICAgICAgIGlmIChzdGFydCA9PSAtMSB8fCBzdGFydCArIGZpcnN0Lmxlbmd0aCA+PSBoYXlzdGFjay5sZW5ndGggfHwgZW5kID09IC0xKSB7Ly9udWxsIGlmIG9uZSBpcyBub3QgZm91bmRcclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGhheXN0YWNrLnNsaWNlKHN0YXJ0LCBlbmQgKyBzZWNvbmQubGVuZ3RoKTtcclxuICAgIH1cclxuXHJcbiAgICBhbGxDb21iaW5lKGhheXN0YWNrID0gJycsIGZpcnN0ID0gJycsIHNlY29uZCA9ICcnKSB7XHJcbiAgICAgICAgbGV0IHBvcyA9IDA7XHJcbiAgICAgICAgbGV0IGFsbCA9IFtdO1xyXG4gICAgICAgIGxldCBmb3VuZDtcclxuICAgICAgICB3aGlsZSAoZm91bmQgIT0gLTEpIHtcclxuICAgICAgICAgICAgZm91bmQgPSB0aGlzLmNvbWJpbmUoaGF5c3RhY2ssIGZpcnN0LCBzZWNvbmQsIHBvcyk7XHJcbiAgICAgICAgICAgIHBvcysrO1xyXG4gICAgICAgICAgICBpZiAoZm91bmQgIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIGFsbC5wdXNoKGZvdW5kKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGFsbDtcclxuICAgIH1cclxuXHJcbiAgICBpbkJldHdlZW4oaGF5c3RhY2sgPSAnJywgZmlyc3QgPSAnJywgc2Vjb25kID0gJycsIHBvcyA9IDApIHtcclxuICAgICAgICBwb3MgPSBwb3MgfHwgMDsvL2luaXRpYWxpemUgcG9zaXRpb24gaWYgbm90IHNldFxyXG4gICAgICAgIGxldCBhdDEgPSBwb3MsXHJcbiAgICAgICAgICAgIGF0MiA9IGZpcnN0ID09PSBzZWNvbmQgPyBwb3MgKyAxIDogcG9zOyAvL2NoZWNrIGlmIGl0IGlzIHRoZSBzYW1lIGFuZCBjaGFuZ2UgcG9zaXRpb25cclxuICAgICAgICBsZXQgc3RhcnQgPSB0aGlzLmluZGV4QXQoaGF5c3RhY2ssIGZpcnN0LCBhdDEpOy8vZ2V0IHRoZSBzdGFydFxyXG4gICAgICAgIGxldCBlbmQgPSB0aGlzLmluZGV4QXQoaGF5c3RhY2ssIHNlY29uZCwgYXQyKTsvL2dldCB0aGUgZW5kXHJcblxyXG4gICAgICAgIGlmIChzdGFydCA9PSAtMSB8fCBzdGFydCArIGZpcnN0Lmxlbmd0aCA+PSBoYXlzdGFjay5sZW5ndGggfHwgZW5kID09IC0xKSB7Ly8tMSBpZiBvbmUgaXMgbm90IGZvdW5kIG9yIGluYmV0d2VlblxyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gaGF5c3RhY2suc2xpY2Uoc3RhcnQgKyBmaXJzdC5sZW5ndGgsIGVuZCk7XHJcbiAgICB9XHJcblxyXG4gICAgYWxsSW5CZXR3ZWVuKGhheXN0YWNrID0gJycsIGZpcnN0ID0gJycsIHNlY29uZCA9ICcnKSB7XHJcbiAgICAgICAgbGV0IHBvcyA9IDA7XHJcbiAgICAgICAgbGV0IGFsbCA9IFtdO1xyXG4gICAgICAgIGxldCBmb3VuZDtcclxuICAgICAgICB3aGlsZSAoZm91bmQgIT0gLTEpIHtcclxuICAgICAgICAgICAgZm91bmQgPSB0aGlzLmluQmV0d2VlbihoYXlzdGFjaywgZmlyc3QsIHNlY29uZCwgcG9zKTtcclxuICAgICAgICAgICAgcG9zKys7XHJcbiAgICAgICAgICAgIGlmIChmb3VuZCAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgYWxsLnB1c2goZm91bmQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGV4dHJhY3RDU1MoZWxlbWVudCkge1xyXG4gICAgICAgIGxldCBjc3MgPSBlbGVtZW50LnN0eWxlLmNzc1RleHQsXHJcbiAgICAgICAgICAgIHN0eWxlID0ge30sXHJcbiAgICAgICAgICAgIGtleSxcclxuICAgICAgICAgICAgdmFsdWU7XHJcblxyXG4gICAgICAgIGlmIChjc3MgIT0gJycpIHtcclxuICAgICAgICAgICAgY3NzID0gY3NzLnNwbGl0KCc7ICcpO1xyXG4gICAgICAgICAgICBsZXQgcGFpcjtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSBvZiBjc3MpIHtcclxuICAgICAgICAgICAgICAgIHBhaXIgPSB0aGlzLnRyZW0oaSk7XHJcbiAgICAgICAgICAgICAgICBrZXkgPSB0aGlzLmpzU3R5bGVOYW1lKHBhaXIuc3BsaXQoJzonKVswXSk7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXMuc3RyaW5nUmVwbGFjZShwYWlyLnNwbGl0KCc6JykucG9wKCksICc7JywgJycpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGtleSAhPSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlW2tleV0gPSB0aGlzLnRyZW0odmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc3R5bGU7XHJcbiAgICB9XHJcblxyXG4gICAgdHJpbU1vbnRoQXJyYXkoKSB7XHJcbiAgICAgICAgbGV0IG1vbnRocyA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5tb250aHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbW9udGhzLnB1c2godGhpcy5tb250aHNbaV0uc2xpY2UoMCwgMykpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbW9udGhzO1xyXG4gICAgfVxyXG5cclxuICAgIGpzU3R5bGVOYW1lKG5hbWUgPSAnJykge1xyXG4gICAgICAgIGxldCBuZXdOYW1lID0gJyc7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuYW1lLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChuYW1lW2ldID09ICctJykge1xyXG4gICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICAgICAgbmV3TmFtZSArPSBuYW1lW2ldLnRvVXBwZXJDYXNlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBuZXdOYW1lICs9IG5hbWVbaV0udG9Mb3dlckNhc2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ld05hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgY3NzU3R5bGVOYW1lKG5hbWUgPSAnJykge1xyXG4gICAgICAgIGxldCBuZXdOYW1lID0gJyc7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuYW1lLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzQ2FwaXRhbChuYW1lW2ldKSkgbmV3TmFtZSArPSAnLSc7XHJcbiAgICAgICAgICAgIG5ld05hbWUgKz0gbmFtZVtpXS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5ld05hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgdGV4dFRvQ2FtZWxDYXNlZCh0ZXh0ID0gJycpIHtcclxuICAgICAgICBsZXQgdmFsdWUgPSAnJztcclxuICAgICAgICBmb3IgKGxldCBpIGluIHRleHQpIHtcclxuICAgICAgICAgICAgaWYgKHRleHRbaV0gPT0gJyAnKSBjb250aW51ZTtcclxuICAgICAgICAgICAgZWxzZSBpZiAoaSA9PSAwKSB2YWx1ZSArPSB0ZXh0W2ldLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuaXNzZXQodGV4dFtpIC0gMV0pICYmIHRleHRbaSAtIDFdID09ICcgJykgdmFsdWUgKz0gdGV4dFtpXS50b1VwcGVyQ2FzZSgpO1xyXG4gICAgICAgICAgICBlbHNlIHZhbHVlICs9IHRleHRbaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBjYW1lbENhc2VkVG9UZXh0KGNhbWVsQ2FzZSA9ICcnKSB7XHJcbiAgICAgICAgbGV0IHZhbHVlID0gJyc7XHJcbiAgICAgICAgZm9yIChsZXQgaSBpbiBjYW1lbENhc2UpIHtcclxuICAgICAgICAgICAgaWYgKGkgIT0gMCAmJiB0aGlzLmlzQ2FwaXRhbChjYW1lbENhc2VbaV0pKSB2YWx1ZSArPSBgICR7Y2FtZWxDYXNlW2ldLnRvTG93ZXJDYXNlKCl9YDtcclxuICAgICAgICAgICAgZWxzZSB2YWx1ZSArPSBjYW1lbENhc2VbaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBlbXB0eU9iamVjdChvYmopIHtcclxuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkob2JqKSA9PSBKU09OLnN0cmluZ2lmeSh7fSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmFuZG9tKHBhcmFtcyA9IHsgbGltaXQ6IDEsIHJhbmdlOiAxIH0pIHtcclxuICAgICAgICBsZXQgcmFuZG9tO1xyXG4gICAgICAgIGlmICh0aGlzLmVtcHR5T2JqZWN0KHBhcmFtcykpIHtcclxuICAgICAgICAgICAgcmFuZG9tID0gTWF0aC5yYW5kb20oKSAqIDIgLSAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0aGlzLmlzc2V0KHBhcmFtcy5saW1pdCkpIHtcclxuICAgICAgICAgICAgcmFuZG9tID0gTWF0aC5yYW5kb20oKSAqIHBhcmFtcy5saW1pdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5pc3NldChwYXJhbXMucmFuZ2UpKSB7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmFuZG9tO1xyXG4gICAgfVxyXG5cclxuICAgIHJhbmdlKGVuZCA9IDEsIHN0YXJ0ID0gMSkge1xyXG4gICAgICAgIGxldCB2YWx1ZSA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSBzdGFydCB8fCAwOyBpIDwgZW5kOyBpKyspIHtcclxuICAgICAgICAgICAgdmFsdWUucHVzaChpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBnZW5lcmF0ZVJhbmRvbShsZW5ndGggPSA1LCB0eXBlID0gJ2FscGhhbnVtJykge1xyXG4gICAgICAgIGxldCBzdHJpbmc7XHJcbiAgICAgICAgaWYgKHR5cGUgPT0gJ251bWJlcicpIHtcclxuICAgICAgICAgICAgc3RyaW5nID0gdGhpcy5kaWdpdHM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHR5cGUgPT0gJ2FscGhhJykge1xyXG4gICAgICAgICAgICBzdHJpbmcgPSB0aGlzLmNhcGl0YWxzICsgdGhpcy5zbWFsbHM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHR5cGUgPT0gJ2FscGhhbnVtJykge1xyXG4gICAgICAgICAgICBzdHJpbmcgPSB0aGlzLmNhcGl0YWxzICsgdGhpcy5zbWFsbHMgKyB0aGlzLmRpZ2l0cztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodHlwZSA9PSAnYWxwaGFudW1zeW0nKSB7XHJcbiAgICAgICAgICAgIHN0cmluZyA9IHRoaXMuY2FwaXRhbHMgKyB0aGlzLnNtYWxscyArIHRoaXMuZGlnaXRzICsgdGhpcy5zeW1ib2xzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHJhbmRvbSA9ICcnO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgcmFuZG9tICs9IHN0cmluZ1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBzdHJpbmcubGVuZ3RoKV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByYW5kb207XHJcbiAgICB9XHJcblxyXG4gICAgZ2VuZXJhdGVSYW5kb21IZXgobGVuZ3RoID0gNSkge1xyXG4gICAgICAgIHZhciBzdHJpbmcgPSB0aGlzLmNhcGl0YWxzLnNsaWNlKDAsIDMpICsgdGhpcy5zbWFsbHMuc2xpY2UoMCwgMykgKyB0aGlzLmRpZ2l0cztcclxuICAgICAgICB2YXIgYWxwaGFudW1lcmljID0gJyc7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBhbHBoYW51bWVyaWMgKz0gc3RyaW5nW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHN0cmluZy5sZW5ndGgpXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFscGhhbnVtZXJpYztcclxuICAgIH1cclxuXHJcbiAgICBnZW5lcmF0ZUtleShsZW5ndGggPSA1KSB7XHJcbiAgICAgICAgbGV0IGtleSA9IERhdGUubm93KCkudG9TdHJpbmcobGVuZ3RoKSArIE1hdGgucmFuZG9tKCkudG9TdHJpbmcobGVuZ3RoKS5zbGljZSgyKTsvL2dlbmVyYXRlIHRoZSBrZXlcclxuICAgICAgICByZXR1cm4ga2V5O1xyXG4gICAgfVxyXG5cclxuICAgIGVkaXR0ZWRVcmwocGFyYW1zKSB7XHJcbiAgICAgICAgdmFyIHVybCA9IHRoaXMudXJsU3BsaXR0ZXIocGFyYW1zLnVybCk7XHJcbiAgICAgICAgdXJsLnZhcnNbcGFyYW1zLnRvQWRkXSA9IHBhcmFtcy5hZGRWYWx1ZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnVybE1lcmdlcih1cmwsIHBhcmFtcy50b0FkZCk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkQ29tbWFUb01vbmV5KG1vbmV5ID0gJycpIHtcclxuICAgICAgICB2YXIgaW52ZXJzZSA9ICcnO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSBtb25leS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgICAgICBpbnZlcnNlICs9IG1vbmV5W2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICBtb25leSA9IFwiXCI7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbnZlcnNlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBwb3NpdGlvbiA9IChpICsgMSkgJSAzO1xyXG4gICAgICAgICAgICBtb25leSArPSBpbnZlcnNlW2ldO1xyXG4gICAgICAgICAgICBpZiAocG9zaXRpb24gPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGkgIT0gaW52ZXJzZS5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbW9uZXkgKz0gJywnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGludmVyc2UgPSAnJztcclxuICAgICAgICBmb3IgKHZhciBpID0gbW9uZXkubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgICAgICAgaW52ZXJzZSArPSBtb25leVtpXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGludmVyc2U7XHJcbiAgICB9XHJcblxyXG4gICAgaXNDYXBpdGFsKHZhbHVlID0gJycpIHtcclxuICAgICAgICBpZiAodmFsdWUubGVuZ3RoID09IDEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2FwaXRhbHMuaW5jbHVkZXModmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjYXBpdGFsaXplKHZhbHVlID0gJycpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaXNDYXBpdGFsKHZhbHVlWzBdKSkge1xyXG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnNwbGl0KCcnKTtcclxuICAgICAgICAgICAgdmFsdWVbMF0gPSB0aGlzLmNhcGl0YWxzW3RoaXMuc21hbGxzLmluZGV4T2YodmFsdWVbMF0pXTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RyaW5nUmVwbGFjZSh2YWx1ZS50b1N0cmluZygpLCAnLCcsICcnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIGZsaXAoaGF5c3RhY2sgPSAnJykge1xyXG4gICAgICAgIHJldHVybiBoYXlzdGFjay5zcGxpdCgnJykucmV2ZXJzZSgpLmpvaW4oJycpO1xyXG4gICAgfVxyXG5cclxuICAgIGlzU21hbGwodmFsdWUgPSAnJykge1xyXG4gICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPT0gMSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zbWFsbHMuaW5jbHVkZXModmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpc1N5bWJvbCh2YWx1ZSA9ICcnKSB7XHJcbiAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCA9PSAxKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN5bWJvbHMuaW5jbHVkZXModmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpc05hbWUodmFsdWUgPSAnJykge1xyXG4gICAgICAgIGZvciAodmFyIHggaW4gdmFsdWUpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNEaWdpdCh2YWx1ZVt4XSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBpc1Bhc3N3b3JkVmFsaWQodmFsdWUgPSAnJykge1xyXG4gICAgICAgIHZhciBsZW4gPSB2YWx1ZS5sZW5ndGg7XHJcbiAgICAgICAgaWYgKGxlbiA+IDcpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgYSBpbiB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNDYXBpdGFsKHZhbHVlW2FdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGIgaW4gdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNTbWFsbCh2YWx1ZVtiXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGMgaW4gdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0RpZ2l0KHZhbHVlW2NdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBkIGluIHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1N5bWJvbCh2YWx1ZVtkXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgaXNTdWJTdHJpbmcoaGF5c3RhY2sgPSAnJywgdmFsdWUgPSAnJykge1xyXG4gICAgICAgIGlmIChoYXlzdGFjay5pbmRleE9mKHZhbHVlKSAhPSAtMSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGlzRGlnaXQodmFsdWUgPSAnJykge1xyXG4gICAgICAgIHZhbHVlID0gbmV3IFN0cmluZyh2YWx1ZSlcclxuICAgICAgICBpZiAodmFsdWUubGVuZ3RoID09IDEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGlnaXRzLmluY2x1ZGVzKHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGlzRW1haWwodmFsdWUgPSAnJykge1xyXG4gICAgICAgIHZhciBlbWFpbF9wYXJ0cyA9IHZhbHVlLnNwbGl0KCdAJyk7XHJcbiAgICAgICAgaWYgKGVtYWlsX3BhcnRzLmxlbmd0aCAhPSAyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc1NwYWNlU3RyaW5nKGVtYWlsX3BhcnRzWzBdKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBkb3RfcGFydHMgPSBlbWFpbF9wYXJ0c1sxXS5zcGxpdCgnLicpO1xyXG4gICAgICAgICAgICBpZiAoZG90X3BhcnRzLmxlbmd0aCAhPSAyKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1NwYWNlU3RyaW5nKGRvdF9wYXJ0c1swXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1NwYWNlU3RyaW5nKGRvdF9wYXJ0c1sxXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgaXNUcnV0aHkodmFsdWUpIHtcclxuICAgICAgICBsZXQgdHJ1dGh5O1xyXG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT0gJ2Jvb2xlYW4nKSB7XHJcbiAgICAgICAgICAgIHRydXRoeSA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgdHJ1dGh5ID0gKHZhbHVlLnRvTG9jYWxlTG93ZXJDYXNlKCkgPT0gJ3RydWUnIHx8IHZhbHVlLnRvTG9jYWxlTG93ZXJDYXNlKCkgPT0gJzEnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIHZhbHVlID09ICdudW1iZXInKSB7XHJcbiAgICAgICAgICAgIHRydXRoeSA9ICh2YWx1ZSA9PSAxKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydXRoeTtcclxuICAgIH1cclxuXHJcbiAgICBpc0ZhbHN5KHZhbHVlKSB7XHJcbiAgICAgICAgbGV0IGZhbHN5O1xyXG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT0gJ2Jvb2xlYW4nKSB7XHJcbiAgICAgICAgICAgIGZhbHN5ID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICBmYWxzeSA9ICh2YWx1ZS50b0xvY2FsZUxvd2VyQ2FzZSgpID09ICdmYWxzZScgfHwgdmFsdWUudG9Mb2NhbGVMb3dlckNhc2UoKSA9PSAnMCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicpIHtcclxuICAgICAgICAgICAgZmFsc3kgPSAodmFsdWUgPT0gMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzeTtcclxuICAgIH1cclxuXHJcbiAgICBvYmplY3RMZW5ndGgob2JqZWN0ID0ge30pIHtcclxuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMob2JqZWN0KS5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgaXNTcGFjZVN0cmluZyh2YWx1ZSA9ICcnKSB7XHJcbiAgICAgICAgaWYgKHZhbHVlID09ICcnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHggaW4gdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZVt4XSAhPSAnICcpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgaGFzU3RyaW5nKGhheXN0YWNrID0gJycsIG5lZWRsZSA9ICcnKSB7XHJcbiAgICAgICAgZm9yICh2YXIgeCBpbiBoYXlzdGFjaykge1xyXG4gICAgICAgICAgICBpZiAobmVlZGxlID09IGhheXN0YWNrW3hdKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgdHJlbShuZWVkbGUgPSAnJykge1xyXG4gICAgICAgIC8vcmVtb3ZlIHRoZSBwcmVwZW5kZWQgc3BhY2VzXHJcbiAgICAgICAgaWYgKG5lZWRsZVswXSA9PSAnICcpIHtcclxuICAgICAgICAgICAgdmFyIG5ld19uZWVkbGUgPSAnJztcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuZWVkbGUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChpICE9IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXdfbmVlZGxlICs9IG5lZWRsZVtpXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBuZWVkbGUgPSB0aGlzLnRyZW0obmV3X25lZWRsZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL3JlbW92ZSB0aGUgYXBwZW5kZWQgc3BhY2VzXHJcbiAgICAgICAgaWYgKG5lZWRsZVtuZWVkbGUubGVuZ3RoIC0gMV0gPT0gJyAnKSB7XHJcbiAgICAgICAgICAgIHZhciBuZXdfbmVlZGxlID0gJyc7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmVlZGxlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSAhPSBuZWVkbGUubGVuZ3RoIC0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld19uZWVkbGUgKz0gbmVlZGxlW2ldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG5lZWRsZSA9IHRoaXMudHJlbShuZXdfbmVlZGxlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5lZWRsZTtcclxuICAgIH1cclxuXHJcbiAgICBzdHJpbmdSZXBsYWNlKHdvcmQgPSAnJywgZnJvbSA9ICcnLCB0byA9ICcnKSB7XHJcbiAgICAgICAgdmFyIHZhbHVlID0gJyc7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB3b3JkLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh3b3JkW2ldID09IGZyb20pIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlICs9IHRvO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFsdWUgKz0gd29yZFtpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgY29udmVyVG9SZWFsUGF0aChwYXRoID0gJycpIHtcclxuICAgICAgICBpZiAocGF0aFtwYXRoLmxlbmd0aCAtIDFdICE9ICcvJykge1xyXG4gICAgICAgICAgICBwYXRoICs9ICcvJztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHBhdGg7XHJcbiAgICB9XHJcblxyXG4gICAgaXNTcGFjaWFsQ2hhcmFjdGVyKGNoYXIgPSAnJykge1xyXG4gICAgICAgIHZhciBzcGVjaWFsY2hhcmFjdGVycyA9IFwiJ1xcXFwvOj8qPD58IS5cIjtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNwZWNpYWxjaGFyYWN0ZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChzcGVjaWFsY2hhcmFjdGVyc1tpXSA9PSBjaGFyKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgY291bnRDaGFyKGhheXN0YWNrID0gJycsIG5lZWRsZSA9ICcnKSB7XHJcbiAgICAgICAgdmFyIGogPSAwO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaGF5c3RhY2subGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGhheXN0YWNrW2ldID09IG5lZWRsZSkge1xyXG4gICAgICAgICAgICAgICAgaisrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBqO1xyXG4gICAgfVxyXG5cclxuICAgIG9jY3VyYW5jZXNPZihoYXlzdGFjayA9ICcnLCBuZWVkbGUgPSAnJykge1xyXG4gICAgICAgIGxldCBvY2N1cmFuY2VzID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBoYXlzdGFjay5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoaGF5c3RhY2tbaV0gPT09IG5lZWRsZSkge1xyXG4gICAgICAgICAgICAgICAgb2NjdXJhbmNlcy5wdXNoKGkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gb2NjdXJhbmNlcztcclxuICAgIH1cclxuXHJcbiAgICBpc3NldCh2YXJpYWJsZSkge1xyXG4gICAgICAgIHJldHVybiAodHlwZW9mIHZhcmlhYmxlICE9PSAndW5kZWZpbmVkJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaXNudWxsKHZhcmlhYmxlKSB7XHJcbiAgICAgICAgcmV0dXJuIHZhcmlhYmxlID09IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgbm90TnVsbCh2YXJpYWJsZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmlzc2V0KHZhcmlhYmxlKSAmJiAhdGhpcy5pc251bGwodmFyaWFibGUpO1xyXG4gICAgfVxyXG5cclxuICAgIGlzQXJyYXkodmFyaWFibGUpIHtcclxuICAgICAgICBsZXQgZmxhZyA9IGZhbHNlO1xyXG4gICAgICAgIGlmICh0eXBlb2YgdmFyaWFibGUgPT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgZmxhZyA9IHZhcmlhYmxlLmNvbnN0cnVjdG9yID09PSBBcnJheTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZsYWc7XHJcbiAgICB9XHJcblxyXG4gICAgaXNPYmplY3QodmFyaWFibGUpIHtcclxuICAgICAgICBsZXQgZmxhZyA9IGZhbHNlO1xyXG4gICAgICAgIGlmICh0eXBlb2YgdmFyaWFibGUgPT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgZmxhZyA9IHZhcmlhYmxlLmNvbnN0cnVjdG9yID09PSBPYmplY3Q7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmbGFnO1xyXG4gICAgfVxyXG5cclxuICAgIGlzU3RyaW5nKHZhcmlhYmxlKSB7XHJcbiAgICAgICAgbGV0IGZsYWcgPSBmYWxzZTtcclxuICAgICAgICBpZiAodHlwZW9mIHZhcmlhYmxlID09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIGZsYWcgPSB2YXJpYWJsZS5jb25zdHJ1Y3RvciA9PT0gU3RyaW5nO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmxhZztcclxuICAgIH1cclxuXHJcbiAgICBpc051bWJlcih2YXJpYWJsZSkge1xyXG4gICAgICAgIGxldCBmbGFnID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB2YXJpYWJsZSA9PSAnbnVtYmVyJykge1xyXG4gICAgICAgICAgICBmbGFnID0gdmFyaWFibGUuY29uc3RydWN0b3IgPT09IE51bWJlcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZsYWc7XHJcbiAgICB9XHJcblxyXG4gICAgaXNCb29sKHZhcmlhYmxlKSB7XHJcbiAgICAgICAgbGV0IGZsYWcgPSBmYWxzZTtcclxuICAgICAgICBpZiAodHlwZW9mIHZhcmlhYmxlID09ICdib29sZWFuJykge1xyXG4gICAgICAgICAgICBmbGFnID0gdmFyaWFibGUuY29uc3RydWN0b3IgPT09IEJvb2xlYW47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmbGFnO1xyXG4gICAgfVxyXG5cclxuICAgIGlzZnVuY3Rpb24odmFyaWFibGUpIHtcclxuICAgICAgICByZXR1cm4gKHR5cGVvZiB2YXJpYWJsZSA9PT0gJ2Z1bmN0aW9uJyk7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgcnVuUGFyYWxsZWwoZnVuY3Rpb25zID0gW10sIGNhbGxCYWNrID0gKCkgPT4geyB9KSB7XHJcbiAgICAgICAgbGV0IHJlc3VsdHMgPSB7fTtcclxuICAgICAgICBmb3IgKGxldCBmIGluIGZ1bmN0aW9ucykge1xyXG4gICAgICAgICAgICByZXN1bHRzW2ZdID0gYXdhaXQgZnVuY3Rpb25zW2ZdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYWxsQmFjayhyZXN1bHRzKTtcclxuICAgIH1cclxuXHJcbiAgICBpc01vYmlsZSgpIHtcclxuICAgICAgICByZXR1cm4gKC9BbmRyb2lkfHdlYk9TfGlQaG9uZXxpUGFkfGlQb2R8QmxhY2tCZXJyeXxJRU1vYmlsZXxPcGVyYSBNaW5pL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXJsTWVyZ2VyKHNwbGl0VXJsID0gJycsIGxhc3RRdWVyeSA9ICcnKSB7XHJcbiAgICAgICAgdmFyIGhvc3RUeXBlID0gKHRoaXMuaXNzZXQoc3BsaXRVcmwuaG9zdFR5cGUpKSA/IHNwbGl0VXJsLmhvc3RUeXBlIDogJ2h0dHAnO1xyXG4gICAgICAgIHZhciBob3N0TmFtZSA9ICh0aGlzLmlzc2V0KHNwbGl0VXJsLmhvc3ROYW1lKSkgPyBzcGxpdFVybC5ob3N0TmFtZSA6ICcnO1xyXG4gICAgICAgIHZhciBwb3J0ID0gKHRoaXMuaXNzZXQoc3BsaXRVcmwuaG9zdCkpID8gc3BsaXRVcmwucG9ydCA6ICcnO1xyXG4gICAgICAgIHZhciBwYXRoTmFtZSA9ICh0aGlzLmlzc2V0KHNwbGl0VXJsLnBhdGhOYW1lKSkgPyBzcGxpdFVybC5wYXRoTmFtZSA6ICcnO1xyXG4gICAgICAgIHZhciBxdWVyaWVzID0gJz8nO1xyXG4gICAgICAgIHZhciBrZWVwTWFwcGluZyA9IHRydWU7XHJcbiAgICAgICAgKHRoaXMuaXNzZXQoc3BsaXRVcmwudmFycykpID9cclxuICAgICAgICAgICAgT2JqZWN0LmtleXMoc3BsaXRVcmwudmFycykubWFwKGtleSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoa2VlcE1hcHBpbmcpIHF1ZXJpZXMgKz0ga2V5ICsgJz0nICsgc3BsaXRVcmwudmFyc1trZXldICsgJyYnO1xyXG4gICAgICAgICAgICAgICAgaWYgKGtleSA9PSBsYXN0UXVlcnkpIGtlZXBNYXBwaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH0pIDogJyc7XHJcbiAgICAgICAgdmFyIGxvY2F0aW9uID0gaG9zdFR5cGUgKyAnOjovJyArIGhvc3ROYW1lICsgJzonICsgcG9ydCArICcvJyArIHBhdGhOYW1lICsgcXVlcmllcztcclxuICAgICAgICBsb2NhdGlvbiA9IChsb2NhdGlvbi5sYXN0SW5kZXhPZignJicpID09IGxvY2F0aW9uLmxlbmd0aCAtIDEpID8gbG9jYXRpb24uc2xpY2UoMCwgbG9jYXRpb24ubGVuZ3RoIC0gMSkgOiBsb2NhdGlvbjtcclxuICAgICAgICBsb2NhdGlvbiA9IChsb2NhdGlvbi5sYXN0SW5kZXhPZignPScpID09IGxvY2F0aW9uLmxlbmd0aCAtIDEpID8gbG9jYXRpb24uc2xpY2UoMCwgbG9jYXRpb24ubGVuZ3RoIC0gMSkgOiBsb2NhdGlvbjtcclxuICAgICAgICByZXR1cm4gbG9jYXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgdXJsU3BsaXR0ZXIobG9jYXRpb24gPSAnJykge1xyXG4gICAgICAgIGlmICh0aGlzLmlzc2V0KGxvY2F0aW9uKSkge1xyXG4gICAgICAgICAgICBsb2NhdGlvbiA9IGxvY2F0aW9uLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIGxldCBwcm90b2NvbCA9IChsb2NhdGlvbi5pbmRleE9mKCc6Ly8nKSA9PT0gLTEpID8gdW5kZWZpbmVkIDogbG9jYXRpb24uc3BsaXQoJzovLycpWzBdO1xyXG4gICAgICAgICAgICBsZXQgZnVsbFBhdGggPSBsb2NhdGlvbi5zcGxpdCgnOi8vJylbMV07XHJcbiAgICAgICAgICAgIGxldCBob3N0ID0gZnVsbFBhdGguc3BsaXQoJy8nKVswXTtcclxuICAgICAgICAgICAgbGV0IGhvc3ROYW1lID0gaG9zdC5zcGxpdCgnOicpWzBdO1xyXG4gICAgICAgICAgICBsZXQgcG9ydCA9IGhvc3Quc3BsaXQoJzonKVsxXTtcclxuICAgICAgICAgICAgbGV0IHBhdGggPSBmdWxsUGF0aC5zbGljZShmdWxsUGF0aC5pbmRleE9mKCcvJykpO1xyXG4gICAgICAgICAgICBsZXQgcGF0aE5hbWUgPSBwYXRoLnNwbGl0KCc/JylbMF0uc3BsaXQoJyMnKVswXTtcclxuICAgICAgICAgICAgbGV0IGhhc2ggPSBwYXRoLnNsaWNlKHBhdGguaW5kZXhPZignIycpKTtcclxuICAgICAgICAgICAgbGV0IHF1ZXJpZXMgPSAocGF0aC5pbmRleE9mKCcjJykgPiBwYXRoLmluZGV4T2YoJz8nKSkgPyBwYXRoLnNsaWNlKHBhdGguaW5kZXhPZignPycpKSA6IG51bGw7XHJcbiAgICAgICAgICAgIGxldCB2YXJzID0ge307XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5pc251bGwocXVlcmllcykpIHtcclxuICAgICAgICAgICAgICAgIHF1ZXJpZXMgPSBxdWVyaWVzLnNsaWNlKDAsIHF1ZXJpZXMuaW5kZXhPZignIycpKTtcclxuICAgICAgICAgICAgICAgIGxldCBxdWVyeSA9IHF1ZXJpZXMuc2xpY2UocXVlcmllcy5pbmRleE9mKCc/JykgKyAxKS5zcGxpdCgnJicpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgeCBpbiBxdWVyeSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBwYXJ0cyA9IHF1ZXJ5W3hdLnNwbGl0KCc9Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnRzWzFdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhcnNbdGhpcy5zdHJpbmdSZXBsYWNlKHBhcnRzWzBdLCAnLScsICcgJyldID0gdGhpcy5zdHJpbmdSZXBsYWNlKHBhcnRzWzFdLCAnLScsICcgJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyc1t0aGlzLnN0cmluZ1JlcGxhY2UocGFydHNbMF0sICctJywgJyAnKV0gPSAnJztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IGh0dHBob3N0ID0gcHJvdG9jb2wgKyAnOi8vJyArIGhvc3Q7XHJcblxyXG4gICAgICAgICAgICBsZXQgc3BsaXRIb3N0ID0gaG9zdC5zcGxpdCgnLicpO1xyXG4gICAgICAgICAgICBsZXQgZG9tYWluID0gaG9zdDtcclxuXHJcbiAgICAgICAgICAgIGlmIChpc05hTih0aGlzLnN0cmluZ1JlcGxhY2UoaG9zdE5hbWUsICcuJywgJycpKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNwbGl0SG9zdC5sZW5ndGggPiAyKSBzcGxpdEhvc3Quc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgIGRvbWFpbiA9IHNwbGl0SG9zdC5qb2luKCcuJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7IGxvY2F0aW9uLCBwcm90b2NvbCwgZnVsbFBhdGgsIGhvc3QsIGh0dHBob3N0LCBob3N0TmFtZSwgcG9ydCwgcGF0aCwgcGF0aE5hbWUsIHF1ZXJpZXMsIHZhcnMsIGhhc2gsIGRvbWFpbiB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXRVcmxWYXJzKGxvY2F0aW9uID0gJycpIHtcclxuICAgICAgICBsb2NhdGlvbiA9IGxvY2F0aW9uLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgdmFyIHF1ZXJpZXMgPSAobG9jYXRpb24uaW5kZXhPZignPycpID09PSAtMSkgPyBudWxsIDogbG9jYXRpb24uc3BsaXQoJz8nKS5wb3AoMCk7XHJcbiAgICAgICAgdmFyIHZhcnMgPSB7fTtcclxuXHJcbiAgICAgICAgaWYgKHF1ZXJpZXMgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB2YXIgcXVlcnkgPSBxdWVyaWVzLnNwbGl0KCcmJyk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHggaW4gcXVlcnkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBwYXJ0cyA9IHF1ZXJ5W3hdLnNwbGl0KCc9Jyk7XHJcbiAgICAgICAgICAgICAgICBpZiAocGFydHNbMV0pIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXJzW3RoaXMuc3RyaW5nUmVwbGFjZShwYXJ0c1swXSwgJy0nLCAnICcpXSA9IHRoaXMuc3RyaW5nUmVwbGFjZShwYXJ0c1sxXSwgJy0nLCAnICcpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXJzW3RoaXMuc3RyaW5nUmVwbGFjZShwYXJ0c1swXSwgJy0nLCAnICcpXSA9ICcnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2YXJzO1xyXG4gICAgfVxyXG5cclxuICAgIHZhclNpemUodmFsdWUpIHtcclxuICAgICAgICBsZXQgb2JqZWN0TGlzdCA9IFtdO1xyXG5cclxuICAgICAgICBsZXQgcmVjdXJzZSA9IChvYmplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IGJ5dGVzID0gMDtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBvYmplY3QgPT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgIGJ5dGVzICs9IG9iamVjdC5sZW5ndGggKiAyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBvYmplY3QgPT0gJ251bWJlcicpIHtcclxuICAgICAgICAgICAgICAgIGJ5dGVzICs9IDg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIG9iamVjdCA9PSAnYm9vbGVhbicpIHtcclxuICAgICAgICAgICAgICAgIGJ5dGVzICs9IDQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIG9iamVjdCA9PSAnb2JqZWN0JyAmJiBvYmplY3RMaXN0LmluZGV4T2Yob2JqZWN0KSA9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0TGlzdC5wdXNoKG9iamVjdCk7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSBpbiBvYmplY3QpIHtcclxuICAgICAgICAgICAgICAgICAgICBieXRlcyArPSByZWN1cnNlKGkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJ5dGVzICs9IHJlY3Vyc2Uob2JqZWN0W2ldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGJ5dGVzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJlY3Vyc2UodmFsdWUpO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEZ1bmM7IiwiY29uc3QgUGVyaW9kID0gcmVxdWlyZSgnLi9QZXJpb2QnKTtcclxuY2xhc3MgRW1wdHkge1xyXG59XHJcblxyXG5jbGFzcyBKU0VsZW1lbnRzIGV4dGVuZHMgUGVyaW9kIHtcclxuICAgIGNvbnN0cnVjdG9yKHRoZVdpbmRvdyA9IEVtcHR5KSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLkVsZW1lbnQgPSB0aGVXaW5kb3cuRWxlbWVudDtcclxuICAgICAgICB0aGlzLmRvY3VtZW50ID0gdGhlV2luZG93LmRvY3VtZW50O1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRDc3MoaHJlZiA9ICcnKSB7XHJcbiAgICAgICAgbGV0IGVsZW1lbnQgPSB0aGlzLmNyZWF0ZUVsZW1lbnQoeyBlbGVtZW50OiAnbGluaycsIGF0dHJpYnV0ZXM6IHsgcmVsOiAnc3R5bGVzaGVldCcsIHR5cGU6ICd0ZXh0L2NzcycsIGhyZWYgfSB9KTtcclxuICAgICAgICBpZiAodGhpcy5kb2N1bWVudCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRvY3VtZW50WydoZWFkJ10gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kb2N1bWVudFsnaGVhZCddLmFwcGVuZChlbGVtZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBqc29uRm9ybShmb3JtKSB7XHJcbiAgICAgICAgbGV0IGpzb24gPSB7fTtcclxuICAgICAgICBsZXQgcGVyZm9ybSA9IChlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBjaGlsZHJlbiA9IGVsZW1lbnQuY2hpbGRyZW47XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHBlcmZvcm0oY2hpbGRyZW5baV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChlbGVtZW50Lmhhc0F0dHJpYnV0ZSgnbmFtZScpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC50eXBlID09ICdmaWxlJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlbGVtZW50Lmhhc0F0dHJpYnV0ZSgnbXVsdGlwbGUnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBqc29uW2VsZW1lbnQuZ2V0QXR0cmlidXRlKCduYW1lJyldID0gZWxlbWVudC5maWxlcztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGpzb25bZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ25hbWUnKV0gPSBlbGVtZW50LmZpbGVzWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGpzb25bZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ25hbWUnKV0gPSBlbGVtZW50LnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwZXJmb3JtKGZvcm0pO1xyXG4gICAgICAgIHJldHVybiBqc29uO1xyXG4gICAgfVxyXG5cclxuICAgIGpzb25FbGVtZW50KF9lbGVtZW50Xykge1xyXG4gICAgICAgIGxldCBlbGVtZW50ID0gX2VsZW1lbnRfLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgbGV0IGF0dHJpYnV0ZXMgPSBfZWxlbWVudF8uZ2V0QXR0cmlidXRlcygpO1xyXG4gICAgICAgIGF0dHJpYnV0ZXMuc3R5bGUgPSBfZWxlbWVudF8uY3NzKCk7XHJcbiAgICAgICAgbGV0IGNoaWxkcmVuID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBfZWxlbWVudF8uY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY2hpbGRyZW4ucHVzaChfZWxlbWVudF8uY2hpbGRyZW5baV0udG9Kc29uKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4geyBlbGVtZW50LCBhdHRyaWJ1dGVzLCBjaGlsZHJlbiB9XHJcbiAgICB9XHJcblxyXG4gICAgaXNFbGVtZW50KG9iamVjdCkge1xyXG4gICAgICAgIHJldHVybiBvYmplY3QgaW5zdGFuY2VvZiB0aGlzLkVsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlRnJvbU9iamVjdChvYmplY3QgPSB7fSwgc2luZ2xlUGFyZW50KSB7XHJcbiAgICAgICAgbGV0IGNyZWF0ZWQsIG5hbWU7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzRWxlbWVudChvYmplY3QpKSB7XHJcbiAgICAgICAgICAgIGNyZWF0ZWQgPSBvYmplY3Q7XHJcbiAgICAgICAgICAgIG5hbWUgPSBjcmVhdGVkLm5vZGVOYW1lO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0aGlzLmlzRWxlbWVudChvYmplY3QuZWxlbWVudCkpIHtcclxuICAgICAgICAgICAgY3JlYXRlZCA9IG9iamVjdC5lbGVtZW50O1xyXG4gICAgICAgICAgICBuYW1lID0gY3JlYXRlZC5ub2RlTmFtZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIG5hbWUgPSBvYmplY3QuZWxlbWVudC50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICBjcmVhdGVkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChvYmplY3QuZWxlbWVudCk7Ly9nZW5lcmF0ZSB0aGUgZWxlbWVudFxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzc2V0KG9iamVjdC5hdHRyaWJ1dGVzKSAmJiAhdGhpcy5pc0VsZW1lbnQob2JqZWN0KSkgey8vc2V0IHRoZSBhdHRyaWJ1dGVzXHJcbiAgICAgICAgICAgIGZvciAodmFyIGF0dHIgaW4gb2JqZWN0LmF0dHJpYnV0ZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChhdHRyID09ICdzdHlsZScpIHsvL3NldCB0aGUgc3R5bGVzXHJcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlZC5jc3Mob2JqZWN0LmF0dHJpYnV0ZXNbYXR0cl0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBjcmVhdGVkLnNldEF0dHJpYnV0ZShhdHRyLCBvYmplY3QuYXR0cmlidXRlc1thdHRyXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzc2V0KG9iamVjdC50ZXh0KSkge1xyXG4gICAgICAgICAgICBjcmVhdGVkLnRleHRDb250ZW50ID0gb2JqZWN0LnRleHQ7Ly9zZXQgdGhlIGlubmVyVGV4dFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNzZXQob2JqZWN0Lmh0bWwpKSB7XHJcbiAgICAgICAgICAgIGNyZWF0ZWQuaW5uZXJIVE1MID0gb2JqZWN0Lmh0bWw7Ly9zZXQgdGhlIGlubmVySFRNTFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNzZXQob2JqZWN0LnZhbHVlKSkge1xyXG4gICAgICAgICAgICBjcmVhdGVkLnZhbHVlID0gb2JqZWN0LnZhbHVlOy8vc2V0IHRoZSB2YWx1ZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG5hbWUuaW5jbHVkZXMoJy0nKSkge1xyXG4gICAgICAgICAgICBjcmVhdGVkID0gdGhpcy5jcmVhdGVGcm9tSFRNTChjcmVhdGVkLm91dGVySFRNTCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5pc3NldChzaW5nbGVQYXJlbnQpKSB7XHJcbiAgICAgICAgICAgIHNpbmdsZVBhcmVudC5hdHRhY2hFbGVtZW50KGNyZWF0ZWQsIG9iamVjdC5hdHRhY2htZW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzc2V0KG9iamVjdC5jaGlsZHJlbikpIHtcclxuICAgICAgICAgICAgY3JlYXRlZC5tYWtlRWxlbWVudChvYmplY3QuY2hpbGRyZW4pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNzZXQob2JqZWN0Lm9wdGlvbnMpICYmIEFycmF5LmlzQXJyYXkob2JqZWN0Lm9wdGlvbnMpKSB7Ly9hZGQgb3B0aW9ucyBpZiBpc3NldCAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgb2Ygb2JqZWN0Lm9wdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgIGxldCBvcHRpb24gPSBjcmVhdGVkLm1ha2VFbGVtZW50KHsgZWxlbWVudDogJ29wdGlvbicsIHZhbHVlOiBpLCB0ZXh0OiBpLCBhdHRhY2htZW50OiAnYXBwZW5kJyB9KTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzc2V0KG9iamVjdC5zZWxlY3RlZCkgJiYgb2JqZWN0LnNlbGVjdGVkID09IGkpIHtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb24uc2V0QXR0cmlidXRlKCdzZWxlY3RlZCcsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGkudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpID09ICdudWxsJykge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzc2V0KGNyZWF0ZWQuZGF0YXNldC5pY29uKSkge1xyXG4gICAgICAgICAgICBjcmVhdGVkLmFkZENsYXNzZXMoY3JlYXRlZC5kYXRhc2V0Lmljb24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGNyZWF0ZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlRnJvbUhUTUwoaHRtbFN0cmluZyA9ICcnLCBzaW5nbGVQYXJlbnQpIHtcclxuICAgICAgICBsZXQgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xyXG4gICAgICAgIGxldCBodG1sID0gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyhodG1sU3RyaW5nLCAndGV4dC9odG1sJyk7XHJcblxyXG4gICAgICAgIGxldCBjcmVhdGVkID0gaHRtbC5ib2R5LmZpcnN0Q2hpbGQ7XHJcblxyXG4gICAgICAgIGlmIChodG1sU3RyaW5nLmluZGV4T2YoJ2h0bWwnKSA9PSAxKSB7XHJcbiAgICAgICAgICAgIGNyZWF0ZWQgPSBodG1sO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChodG1sU3RyaW5nLmluZGV4T2YoJ2JvZHknKSA9PSAxKSB7XHJcbiAgICAgICAgICAgIGNyZWF0ZWQgPSBodG1sLmJvZHk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5pc3NldChzaW5nbGVQYXJlbnQpKSBzaW5nbGVQYXJlbnQuYXR0YWNoRWxlbWVudChjcmVhdGVkLCBzaW5nbGVQYXJlbnQuYXR0YWNobWVudCk7XHJcbiAgICAgICAgcmV0dXJuIGNyZWF0ZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlUGVyY2VwdG9yRWxlbWVudChvYmplY3QsIHNpbmdsZVBhcmVudCkge1xyXG4gICAgICAgIGxldCBjcmVhdGVkID0gdGhpc1tvYmplY3QucGVyY2VwdG9yRWxlbWVudF0ob2JqZWN0LnBhcmFtcyk7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNzZXQoc2luZ2xlUGFyZW50KSkge1xyXG4gICAgICAgICAgICBzaW5nbGVQYXJlbnQuYXR0YWNoRWxlbWVudChjcmVhdGVkLCBvYmplY3QuYXR0YWNobWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjcmVhdGVkO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEVsZW1lbnQoc2luZ2xlUGFyYW0gPSB7IGVsZW1lbnQ6ICcnLCBhdHRyaWJ1dGVzOiB7fSB9LCBzaW5nbGVQYXJlbnQpIHtcclxuICAgICAgICB2YXIgZWxlbWVudDtcclxuICAgICAgICAvL2lmIHBhcmFtcyBpcyBhIEhUTUwgU3RyaW5nXHJcbiAgICAgICAgaWYgKHR5cGVvZiBzaW5nbGVQYXJhbSA9PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICBlbGVtZW50ID0gdGhpcy5jcmVhdGVGcm9tSFRNTChzaW5nbGVQYXJhbSwgc2luZ2xlUGFyZW50KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5pc0VsZW1lbnQoc2luZ2xlUGFyYW0pKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQgPSBzaW5nbGVQYXJhbTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNzZXQoc2luZ2xlUGFyZW50KSkgc2luZ2xlUGFyZW50LmF0dGFjaEVsZW1lbnQoZWxlbWVudCwgc2luZ2xlUGFyYW0uYXR0YWNobWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vaWYgcGFyYW1zIGlzIG9iamVjdFxyXG4gICAgICAgIGVsc2UgaWYgKHNpbmdsZVBhcmFtLmNvbnN0cnVjdG9yID09IE9iamVjdCkge1xyXG4gICAgICAgICAgICBpZiAoc2luZ2xlUGFyYW0ucGVyY2VwdG9yRWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudCA9IHRoaXMuY3JlYXRlUGVyY2VwdG9yRWxlbWVudChzaW5nbGVQYXJhbSwgc2luZ2xlUGFyZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSB0aGlzLmNyZWF0ZUZyb21PYmplY3Qoc2luZ2xlUGFyYW0sIHNpbmdsZVBhcmVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzc2V0KGVsZW1lbnQuc2V0S2V5KSAmJiAhdGhpcy5pc3NldChlbGVtZW50LmRhdGFzZXQuZG9tS2V5KSkge1xyXG4gICAgICAgICAgICBlbGVtZW50LnNldEtleSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNzZXQoc2luZ2xlUGFyYW0ubGlzdCkpIHtcclxuICAgICAgICAgICAgbGV0IGxpc3QgPSBlbGVtZW50Lm1ha2VFbGVtZW50KHsgZWxlbWVudDogJ2RhdGFsaXN0Jywgb3B0aW9uczogc2luZ2xlUGFyYW0ubGlzdCB9KTtcclxuICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2xpc3QnLCBlbGVtZW50LmRhdGFzZXQuZG9tS2V5KTtcclxuICAgICAgICAgICAgbGlzdC5zZXRBdHRyaWJ1dGUoJ2lkJywgZWxlbWVudC5kYXRhc2V0LmRvbUtleSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5pc3NldChzaW5nbGVQYXJhbS5zdGF0ZSkpIHtcclxuICAgICAgICAgICAgbGV0IG93bmVyID0gZWxlbWVudC5nZXRQYXJlbnRzKHNpbmdsZVBhcmFtLnN0YXRlLm93bmVyLCBzaW5nbGVQYXJhbS5zdGF0ZS52YWx1ZSk7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5pc251bGwob3duZXIpKSB7XHJcbiAgICAgICAgICAgICAgICBvd25lci5hZGRTdGF0ZSh7IG5hbWU6IHNpbmdsZVBhcmFtLnN0YXRlLm5hbWUsIHN0YXRlOiBlbGVtZW50IH0pO1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5kYXRhc2V0LnN0YXRlU3RhdHVzID0gJ3NldCc7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LmRhdGFzZXQuc3RhdGVTdGF0dXMgPSAncGVuZGluZyc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBlbGVtZW50O1xyXG4gICAgfTtcclxuXHJcbiAgICBjcmVhdGVFbGVtZW50KHBhcmFtcyA9IHsgZWxlbWVudDogJycsIGF0dHJpYnV0ZXM6IHt9IH0sIHBhcmVudCkge1xyXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHBhcmFtcykpIHtcclxuICAgICAgICAgICAgbGV0IGVsZW1lbnRzID0gW107XHJcbiAgICAgICAgICAgIGZvciAobGV0IHBhcmFtIG9mIHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudHMucHVzaCh0aGlzLmdldEVsZW1lbnQocGFyYW0sIHBhcmVudCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50cztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgZWxlbWVudCA9IHRoaXMuZ2V0RWxlbWVudChwYXJhbXMsIHBhcmVudCk7XHJcbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB2YWxpZGF0ZUZvcm1UZXh0YXJlYShlbGVtZW50KSB7XHJcbiAgICAgICAgaWYgKGVsZW1lbnQudmFsdWUgPT0gJycpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICB2YWxpZGF0ZUZvcm1JbnB1dChlbGVtZW50KSB7XHJcbiAgICAgICAgdmFyIHR5cGUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgndHlwZScpO1xyXG4gICAgICAgIHZhciB2YWx1ZSA9IGVsZW1lbnQudmFsdWU7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzbnVsbCh0eXBlKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gIXRoaXMuaXNTcGFjZVN0cmluZyh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0eXBlID0gdHlwZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIGlmICh0eXBlID09ICdmaWxlJykge1xyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWUgIT0gJyc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHR5cGUgPT0gJ3RleHQnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAhdGhpcy5pc1NwYWNlU3RyaW5nKHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodHlwZSA9PSAnZGF0ZScpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzU3RyaW5nKGVsZW1lbnQuY2xhc3NOYW1lLCAnZnV0dXJlJykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmlzRGF0ZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5pc0RhdGVWYWxpZCh2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodHlwZSA9PSAnZW1haWwnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmlzRW1haWwodmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0eXBlID09ICdudW1iZXInKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmlzTnVtYmVyKHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodHlwZSA9PSAncGFzc3dvcmQnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmlzUGFzc3dvcmRWYWxpZCh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gIXRoaXMuaXNTcGFjZVN0cmluZyh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHZhbGlkYXRlRm9ybVNlbGVjdChlbGVtZW50KSB7XHJcbiAgICAgICAgaWYgKGVsZW1lbnQudmFsdWUgPT0gMCB8fCBlbGVtZW50LnZhbHVlLnRvTG93ZXJDYXNlKCkgPT0gJ251bGwnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHZhbGlkYXRlRm9ybShmb3JtLCBvcHRpb25zKSB7XHJcbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcbiAgICAgICAgb3B0aW9ucy5ub2RlTmFtZXMgPSBvcHRpb25zLm5vZGVOYW1lcyB8fCAnSU5QVVQsIFNFTEVDVCwgVEVYVEFSRUEnO1xyXG4gICAgICAgIGxldCBmbGFnID0gdHJ1ZSxcclxuICAgICAgICAgICAgbm9kZU5hbWUsXHJcbiAgICAgICAgICAgIGVsZW1lbnROYW1lLFxyXG4gICAgICAgICAgICBlbGVtZW50cyA9IGZvcm0uZmluZEFsbChvcHRpb25zLm5vZGVOYW1lcyk7XHJcblxyXG4gICAgICAgIGxldCB2YWxpZGF0ZU1lID0gbWUgPT4ge1xyXG4gICAgICAgICAgICBsZXQgdmFsdWU7XHJcbiAgICAgICAgICAgIGlmIChub2RlTmFtZSA9PSAnSU5QVVQnKSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXMudmFsaWRhdGVGb3JtSW5wdXQobWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKG5vZGVOYW1lID09ICdTRUxFQ1QnKSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXMudmFsaWRhdGVGb3JtU2VsZWN0KG1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChub2RlTmFtZSA9PSAnVEVYVEFSRUEnKSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXMudmFsaWRhdGVGb3JtVGV4dGFyZWEobWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSB0aGlzLnZhbGlkYXRlT3RoZXJFbGVtZW50cyhtZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbm9kZU5hbWUgPSBlbGVtZW50c1tpXS5ub2RlTmFtZTtcclxuICAgICAgICAgICAgZWxlbWVudE5hbWUgPSBlbGVtZW50c1tpXS5nZXRBdHRyaWJ1dGUoJ25hbWUnKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChlbGVtZW50c1tpXS5nZXRBdHRyaWJ1dGUoJ2lnbm9yZScpID09ICd0cnVlJykge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzc2V0KG9wdGlvbnMubmFtZXMpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5uYW1lcy5pbmNsdWRlcyhlbGVtZW50TmFtZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBmbGFnID0gdmFsaWRhdGVNZShlbGVtZW50c1tpXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZsYWcgPSB2YWxpZGF0ZU1lKGVsZW1lbnRzW2ldKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCFmbGFnKSB7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHsgZmxhZywgZWxlbWVudE5hbWUgfTtcclxuICAgIH1cclxuXHJcbiAgICB2YWxpZGF0ZU90aGVyRWxlbWVudHMoZWxlbWVudCkge1xyXG4gICAgICAgIGxldCB2YWx1ZSA9IGZhbHNlO1xyXG4gICAgICAgIGlmICh0aGlzLmlzc2V0KGVsZW1lbnQudmFsdWUpICYmIGVsZW1lbnQudmFsdWUgIT0gJycpIHZhbHVlID0gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgVmFsaWRhdGVGb3JtSW1hZ2VzKGZvcm0pIHtcclxuICAgICAgICByZXR1cm4gKHR5cGUgPT0gJ2ZpbGUnICYmICFzZWxmLmlzSW1hZ2VWYWxpZCh2YWx1ZSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGlzSW1hZ2VWYWxpZChpbnB1dCkge1xyXG4gICAgICAgIHZhciBleHQgPSBpbnB1dC5zdWJzdHJpbmcoaW5wdXQubGFzdEluZGV4T2YoJy4nKSArIDEpLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgaWYgKGV4dCA9PSBcInBuZ1wiIHx8IGV4dCA9PSBcImdpZlwiIHx8IGV4dCA9PSBcImpwZWdcIiB8fCBleHQgPT0gXCJqcGdcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGltYWdlVG9Kc29uKGZpbGUsIGNhbGxCYWNrID0gKCkgPT4geyB9KSB7XHJcbiAgICAgICAgbGV0IGZpbGVSZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG4gICAgICAgIGxldCBteWZpbGUgPSB7fTtcclxuICAgICAgICBmaWxlUmVhZGVyLm9ubG9hZCA9IChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBteWZpbGUuc3JjID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcclxuICAgICAgICAgICAgY2FsbEJhY2sobXlmaWxlKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBteWZpbGUuc2l6ZSA9IGZpbGUuc2l6ZTtcclxuICAgICAgICBteWZpbGUudHlwZSA9IGZpbGUudHlwZTtcclxuICAgICAgICBmaWxlUmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSlNFbGVtZW50czsiLCJjb25zdCBGdW5jID0gcmVxdWlyZSgnLi9GdW5jJyk7XHJcbmxldCBmdW5jID0gbmV3IEZ1bmMoKVxyXG5cclxuY2xhc3MgTWF0cml4IHtcclxuICAgIGNvbnN0cnVjdG9yKHBhcmFtcyA9IHsgcm93czogMiwgY29sczogMiwgY29udGVudHM6IFtdIH0pIHtcclxuICAgICAgICBPYmplY3Qua2V5cyhwYXJhbXMpLm1hcChrZXkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzW2tleV0gPSBwYXJhbXNba2V5XTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5yb3dzID0gdGhpcy5yb3dzIHx8IDI7XHJcbiAgICAgICAgdGhpcy5jb2xzID0gdGhpcy5jb2xzIHx8IDI7XHJcbiAgICAgICAgdGhpcy5jb250ZW50cyA9IHRoaXMuY29udGVudHMgfHwgW107XHJcbiAgICAgICAgdGhpcy5zZXREYXRhKHRoaXMuY29udGVudHMpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldERhdGEoY29udGVudHMgPSBbXSkge1xyXG4gICAgICAgIHRoaXMuY29udGVudHMgPSBjb250ZW50cztcclxuICAgICAgICB0aGlzLmRhdGEgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucm93czsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVtpXSA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMucm93czsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGFbaV1bal0gPSBjb250ZW50cy5zaGlmdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldCBzdHJ1Y3R1cmUoKSB7XHJcbiAgICAgICAgbGV0IHsgcm93cywgY29scyB9ID0gdGhpcztcclxuICAgICAgICByZXR1cm4geyByb3dzLCBjb2xzIH07XHJcbiAgICB9XHJcblxyXG4gICAgYWRkKG4gPSAwKSB7XHJcbiAgICAgICAgaWYgKG4gaW5zdGFuY2VvZiBNYXRyaXgpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvd3M7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmNvbHM7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YVtpXVtqXSArPSBuLmRhdGFbaV1bal07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKG4gaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucm93czsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuY29sczsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhW2ldW2pdICs9IG5baV1bal07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dzOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5jb2xzOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGFbaV1bal0gKz0gbjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdWJ0cmFjdChuID0gMCkge1xyXG4gICAgICAgIGlmIChuIGluc3RhbmNlb2YgTWF0cml4KSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dzOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5jb2xzOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGFbaV1bal0gLT0gbi5kYXRhW2ldW2pdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChuIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvd3M7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmNvbHM7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YVtpXVtqXSAtPSBuW2ldW2pdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucm93czsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuY29sczsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhW2ldW2pdIC09IG47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbXVsdGlwbHkobiA9IDEpIHtcclxuICAgICAgICBpZiAobiBpbnN0YW5jZW9mIE1hdHJpeCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucm93czsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG4uY29sczsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhW2ldW2pdICo9IG4uZGF0YVtpXVtqXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAobiBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dzOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5jb2xzOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGFbaV1bal0gKj0gbltpXVtqXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvd3M7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmNvbHM7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YVtpXVtqXSAqPSBuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJhbmRvbWl6ZSgpIHtcclxuICAgICAgICB0aGlzLm1hcCh2YWx1ZSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBmdW5jLnJhbmRvbSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zcG9zZSgpIHtcclxuICAgICAgICBsZXQgbmV3TWF0cml4ID0gbmV3IE1hdHJpeCh7IHJvd3M6IHRoaXMuY29scywgY29sczogdGhpcy5yb3dzIH0pO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dzOyBpKyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmNvbHM7IGorKykge1xyXG4gICAgICAgICAgICAgICAgbmV3TWF0cml4LmRhdGFbal1baV0gPSB0aGlzLmRhdGFbaV1bal07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgT2JqZWN0LmtleXMobmV3TWF0cml4KS5tYXAoa2V5ID0+IHtcclxuICAgICAgICAgICAgdGhpc1trZXldID0gbmV3TWF0cml4W2tleV07XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbWFwKGNhbGxiYWNrID0gKHZhbHVlLCAuLi5wb3MpID0+IHsgfSkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dzOyBpKyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmNvbHM7IGorKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gdGhpcy5kYXRhW2ldW2pdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhW2ldW2pdID0gY2FsbGJhY2sodmFsdWUsIGksIGopO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaW50KCkge1xyXG4gICAgICAgIGNvbnNvbGUudGFibGUodGhpcy5kYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICBzYXkoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy50b0FycmF5KCkpXHJcbiAgICB9XHJcblxyXG4gICAgdG9BcnJheSgpIHtcclxuICAgICAgICB0aGlzLmNvbnRlbnRzID0gW11cclxuICAgICAgICBNYXRyaXgubWFwKHRoaXMsIHZhbHVlID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jb250ZW50cy5wdXNoKHZhbHVlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb250ZW50cztcclxuICAgIH1cclxuXHJcbiAgICByZXNoYXBlKHBhcmFtcyA9IHsgcm93czogMiwgY29sczogMiB9KSB7XHJcbiAgICAgICAgdGhpcy50b0FycmF5KCk7XHJcbiAgICAgICAgdGhpcy5yb3dzID0gcGFyYW1zLnJvd3M7XHJcbiAgICAgICAgdGhpcy5jb2xzID0gcGFyYW1zLmNvbHM7XHJcbiAgICAgICAgdGhpcy5zZXREYXRhKHRoaXMuY29udGVudHMpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldENvbHVtbnMoLi4uY29scykge1xyXG4gICAgICAgIGxldCB2YWx1ZSA9IFtdO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpIGluIGNvbHMpIHtcclxuICAgICAgICAgICAgdmFsdWUucHVzaChBcnJheS5lYWNoKHRoaXMuZGF0YSwgcm93ID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByb3dbY29sc1tpXV07XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRSb3dzKC4uLnJvd3MpIHtcclxuICAgICAgICBsZXQgdmFsdWUgPSBbXTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgciA9IDA7IHIgPCB0aGlzLnJvd3M7IHIrKykge1xyXG4gICAgICAgICAgICBpZiAocm93cy5pbmNsdWRlcyhyKSkge1xyXG4gICAgICAgICAgICAgICAgdmFsdWUucHVzaCh0aGlzLmRhdGFbcl0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHRvQXJyYXkobWF0cml4KSB7XHJcbiAgICAgICAgbGV0IGFycmF5ID0gW11cclxuICAgICAgICBNYXRyaXgubWFwKG1hdHJpeCwgdmFsdWUgPT4ge1xyXG4gICAgICAgICAgICBhcnJheS5wdXNoKHZhbHVlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gYXJyYXk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHN1YnRyYWN0KGEgPSBuZXcgTWF0cml4KCksIGIpIHtcclxuICAgICAgICBsZXQgY29udGVudHMgPSBbXSwgcm93cyA9IGEucm93cywgY29scyA9IGEuY29scztcclxuXHJcbiAgICAgICAgaWYgKGIgaW5zdGFuY2VvZiBNYXRyaXgpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3dzOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29sczsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudHMucHVzaChhLmRhdGFbaV1bal0gLSBiLmRhdGFbaV1bal0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGIgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGEucm93czsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGEuY29sczsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudHMucHVzaChhLmRhdGFbaV1bal0gLSBiW2ldW2pdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvd3M7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmNvbHM7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRzLnB1c2goYS5kYXRhW2ldW2pdIC0gYik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgTWF0cml4KHsgcm93cywgY29scywgY29udGVudHMgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGFkZChhID0gbmV3IE1hdHJpeCgpLCBiKSB7XHJcbiAgICAgICAgbGV0IGNvbnRlbnRzID0gW10sIHJvd3MgPSBhLnJvd3MsIGNvbHMgPSBhLmNvbHM7XHJcblxyXG4gICAgICAgIGlmIChiIGluc3RhbmNlb2YgTWF0cml4KSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm93czsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvbHM7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRzLnB1c2goYS5kYXRhW2ldW2pdICsgYi5kYXRhW2ldW2pdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChiIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhLnJvd3M7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBhLmNvbHM7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRzLnB1c2goYS5kYXRhW2ldW2pdICsgYltpXVtqXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dzOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5jb2xzOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50cy5wdXNoKGEuZGF0YVtpXVtqXSArIGIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbmV3IE1hdHJpeCh7IHJvd3MsIGNvbHMsIGNvbnRlbnRzIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBtdWx0aXBseShhID0gbmV3IE1hdHJpeCgpLCBiKSB7XHJcbiAgICAgICAgbGV0IGNvbnRlbnRzID0gW10sIHJvd3MsIGNvbHM7XHJcblxyXG4gICAgICAgIGlmIChiIGluc3RhbmNlb2YgTWF0cml4KSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoYS5jb2xzICE9PSBiLnJvd3MpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDb2x1bW5zIG9mIEEgbXVzdCBlcXVhbCByb3dzIG9mIEInKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcm93cyA9IGEucm93cztcclxuICAgICAgICAgICAgY29scyA9IGIuY29scztcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm93czsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvbHM7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzdW0gPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgYS5jb2xzOyBrKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3VtICs9IGEuZGF0YVtpXVtrXSAqIGIuZGF0YVtrXVtqXTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudHMucHVzaChzdW0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGIgaW5zdGFuY2VvZiBBcnJheSkge1xyXG5cclxuICAgICAgICAgICAgcm93cyA9IGEucm93cztcclxuICAgICAgICAgICAgY29scyA9IGEuY29scztcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYS5yb3dzOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgYS5jb2xzOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50cy5wdXNoKGEuZGF0YVtpXVtqXSAqIGJbaV1bal0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucm93czsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuY29sczsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudHMucHVzaChhLmRhdGFbaV1bal0gKiBiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBNYXRyaXgoeyByb3dzLCBjb2xzLCBjb250ZW50cyB9KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZGl2aWRlKGEgPSBuZXcgTWF0cml4KCksIGIpIHtcclxuICAgICAgICBsZXQgY29udGVudHMgPSBbXSwgcm93cywgY29scztcclxuXHJcbiAgICAgICAgaWYgKGIgaW5zdGFuY2VvZiBNYXRyaXgpIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChhLmNvbHMgIT09IGIucm93cykge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0NvbHVtbnMgb2YgQSBtdXN0IGVxdWFsIHJvd3Mgb2YgQicpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByb3dzID0gYS5yb3dzO1xyXG4gICAgICAgICAgICBjb2xzID0gYi5jb2xzO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3dzOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29sczsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHN1bSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBhLmNvbHM7IGsrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdW0gKz0gKGEuZGF0YVtpXVtrXSAvIGIuZGF0YVtrXVtqXSkgfHwgMDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudHMucHVzaChzdW0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGIgaW5zdGFuY2VvZiBBcnJheSkge1xyXG5cclxuICAgICAgICAgICAgcm93cyA9IGEucm93cztcclxuICAgICAgICAgICAgY29scyA9IGEuY29scztcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYS5yb3dzOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgYS5jb2xzOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50cy5wdXNoKChhLmRhdGFbaV1bal0gLyBiW2ldW2pdKSB8fCAwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvd3M7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmNvbHM7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRzLnB1c2goKGEuZGF0YVtpXVtqXSAvIGIpIHx8IDApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbmV3IE1hdHJpeCh7IHJvd3MsIGNvbHMsIGNvbnRlbnRzIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyByYW5kb21pemUobWF0cml4ID0gbmV3IE1hdHJpeCgpKSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdHJpeC5tYXAobWF0cml4LCAodmFsdWUgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gZnVuYy5yYW5kb20oKTtcclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHRyYW5zcG9zZShtYXRyaXggPSBuZXcgTWF0cml4KCkpIHtcclxuICAgICAgICBsZXQgbmV3TWF0cml4ID0gbmV3IE1hdHJpeCh7IHJvd3M6IG1hdHJpeC5jb2xzLCBjb2xzOiBtYXRyaXgucm93cyB9KTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1hdHJpeC5yb3dzOyBpKyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBtYXRyaXguY29sczsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdNYXRyaXguZGF0YVtqXVtpXSA9IG1hdHJpeC5kYXRhW2ldW2pdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXdNYXRyaXg7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIG1hcChtYXRyaXggPSBuZXcgTWF0cml4KCksIGNhbGxiYWNrID0gKCkgPT4geyB9KSB7XHJcbiAgICAgICAgbGV0IG5ld01hdHJpeCA9IG5ldyBNYXRyaXgoeyByb3dzOiBtYXRyaXgucm93cywgY29sczogbWF0cml4LmNvbHMgfSk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXRyaXgucm93czsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbWF0cml4LmNvbHM7IGorKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gbWF0cml4LmRhdGFbaV1bal07XHJcbiAgICAgICAgICAgICAgICBuZXdNYXRyaXguZGF0YVtpXVtqXSA9IGNhbGxiYWNrKHZhbHVlLCBpLCBqKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3TWF0cml4O1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmcm9tQXJyYXkoY29udGVudHMgPSBbXSkge1xyXG4gICAgICAgIHJldHVybiBuZXcgTWF0cml4KHsgcm93czogY29udGVudHMubGVuZ3RoLCBjb2xzOiAxLCBjb250ZW50cyB9KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgcmVzaGFwZShwYXJhbXMgPSB7IHJvd3M6IDIsIGNvbHM6IDIsIG1hdHJpeDogbmV3IE1hdHJpeCB9KSB7XHJcbiAgICAgICAgcGFyYW1zLmNvbnRlbnRzID0gTWF0cml4LnRvQXJyYXkocGFyYW1zLm1hdHJpeCk7XHJcbiAgICAgICAgZGVsZXRlIHBhcmFtcy5tYXRyaXg7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBNYXRyaXgocGFyYW1zKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbm9ybWFsaXplKG1hdHJpeCA9IG5ldyBNYXRyaXgoKSkge1xyXG4gICAgICAgIGxldCBjb250ZW50cyA9IE1hdGgubm9ybWFsaXplKE1hdHJpeC50b0FycmF5KG1hdHJpeCkpO1xyXG4gICAgICAgIHJldHVybiBuZXcgTWF0cml4KHsgcm93czogbWF0cml4LnJvd3MsIGNvbHM6IG1hdHJpeC5jb2xzLCBjb250ZW50cyB9KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZGlhZ29uYWwoYXJyYXkgPSBbXSkge1xyXG4gICAgICAgIGxldCBtYXRyaXggPSBNYXRyaXguc3F1YXJlKGFycmF5Lmxlbmd0aCk7XHJcbiAgICAgICAgZm9yIChsZXQgaSBpbiBtYXRyaXguZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqIGluIG1hdHJpeC5kYXRhW2ldKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSA9PSBqKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0cml4LmRhdGFbaV1bal0gPSBhcnJheVtpXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBtYXRyaXgudG9BcnJheSgpO1xyXG4gICAgICAgIHJldHVybiBtYXRyaXg7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHVuaXQoc2l6ZSA9IDIpIHtcclxuICAgICAgICBsZXQgbWF0cml4ID0gTWF0cml4LnNxdWFyZShzaXplKTtcclxuICAgICAgICBmb3IgKGxldCBpIGluIG1hdHJpeC5kYXRhKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogaW4gbWF0cml4LmRhdGFbaV0pIHtcclxuICAgICAgICAgICAgICAgIGlmIChpID09IGopIHtcclxuICAgICAgICAgICAgICAgICAgICBtYXRyaXguZGF0YVtpXVtqXSA9IDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgbWF0cml4LnRvQXJyYXkoKTtcclxuICAgICAgICByZXR1cm4gbWF0cml4O1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBzcXVhcmUoc2l6ZSA9IDIpIHtcclxuICAgICAgICByZXR1cm4gbmV3IE1hdHJpeCh7IHJvd3M6IHNpemUsIGNvbHM6IHNpemUgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZyb21NYXRyaXhDb2xzKG1hdHJpeCA9IG5ldyBNYXRyaXgoKSwgLi4uY29scykge1xyXG4gICAgICAgIGxldCB2YWx1ZSA9IG1hdHJpeC5nZXRDb2x1bW5zKC4uLmNvbHMpO1xyXG4gICAgICAgIGxldCBjb250ZW50cyA9IEFycmF5LmZsYXR0ZW4odmFsdWUpO1xyXG4gICAgICAgIGxldCBuZXdNYXRyaXggPSBuZXcgTWF0cml4KHsgcm93czogdmFsdWUubGVuZ3RoLCBjb2xzOiBtYXRyaXguY29scywgY29udGVudHMgfSk7XHJcbiAgICAgICAgbmV3TWF0cml4LnRyYW5zcG9zZSgpO1xyXG4gICAgICAgIHJldHVybiBuZXdNYXRyaXg7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGRlZXBNYXRyaXgoZGltZW5zaW9ucyA9IFtdLCBjb250ZW50cyA9IFtdKSB7XHJcbiAgICAgICAgLy9zcGxpdCB0aGUgZGltZW5zaW9ucyBpbnRvIGFuIGFycmF5IG9mIGFycmF5cyBvZiBsZW5ndGggMlxyXG4gICAgICAgIGxldCBtYXRyaXhEaW1lbnNpb25zID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaW1lbnNpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIG1hdHJpeERpbWVuc2lvbnMucHVzaCh7IHJvd3M6IGRpbWVuc2lvbnNbaV0sIGNvbHM6IGRpbWVuc2lvbnNbKytpXSB8fCAxIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG1ha2VNYXRyaXggPSAobGF5ZXIpID0+IHtcclxuICAgICAgICAgICAgbGV0IG1hdHJpeCA9IG5ldyBNYXRyaXgobWF0cml4RGltZW5zaW9uc1tsYXllcl0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKGxheWVyICsgMSA9PSBtYXRyaXhEaW1lbnNpb25zLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgbWF0cml4Lm1hcCh2YWx1ZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnRzLnNoaWZ0KCkgfHwgMDtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbWF0cml4Lm1hcCh2YWx1ZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1ha2VNYXRyaXgobGF5ZXIgKyAxKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBtYXRyaXg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbWFrZU1hdHJpeCgwKTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNYXRyaXg7IiwiY29uc3QgRnVuYyA9IHJlcXVpcmUoJy4vRnVuYycpO1xyXG5jb25zdCBNYXRyaXggPSByZXF1aXJlKCcuL01hdHJpeCcpO1xyXG5jb25zdCBBcnJheUxpYnJhcnkgPSByZXF1aXJlKCcuLy4uL2Z1bmN0aW9ucy9BcnJheUxpYnJhcnknKTtcclxuXHJcbmxldCBmdW5jID0gbmV3IEZ1bmMoKTtcclxubGV0IGFycmF5TGlicmFyeSA9IG5ldyBBcnJheUxpYnJhcnkoKTtcclxuXHJcbmNsYXNzIE5ldXJhbE5ldHdvcmsge1xyXG4gICAgY29uc3RydWN0b3IocGFyYW1zKSB7XHJcbiAgICAgICAgZnVuYy5vYmplY3QuY29weShwYXJhbXMsIHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaWhXZWlnaHRzID0gbmV3IE1hdHJpeCh7IHJvd3M6IHRoaXMuaE5vZGVzLCBjb2xzOiB0aGlzLmlOb2RlcyB9KTtcclxuICAgICAgICB0aGlzLmloV2VpZ2h0cy5yYW5kb21pemUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5paEJpYXMgPSBuZXcgTWF0cml4KHsgcm93czogdGhpcy5oTm9kZXMsIGNvbHM6IDEgfSk7XHJcbiAgICAgICAgdGhpcy5paEJpYXMucmFuZG9taXplKCk7XHJcblxyXG4gICAgICAgIHRoaXMuaG9XZWlnaHRzID0gbmV3IE1hdHJpeCh7IHJvd3M6IHRoaXMub05vZGVzLCBjb2xzOiB0aGlzLmhOb2RlcyB9KTtcclxuICAgICAgICB0aGlzLmhvV2VpZ2h0cy5yYW5kb21pemUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5ob0JpYXMgPSBuZXcgTWF0cml4KHsgcm93czogdGhpcy5vTm9kZXMsIGNvbHM6IDEgfSk7XHJcbiAgICAgICAgdGhpcy5ob0JpYXMucmFuZG9taXplKCk7XHJcblxyXG4gICAgICAgIHRoaXMubHIgPSB0aGlzLmxyIHx8IDAuMTtcclxuICAgIH1cclxuXHJcbiAgICBmZWVkRm93YXJkKGlucHV0QXJyYXkgPSBbXSkge1xyXG4gICAgICAgIGxldCBpbnB1dHMgPSBpbnB1dEFycmF5IGluc3RhbmNlb2YgTWF0cml4ID8gaW5wdXRBcnJheSA6IHRoaXMucHJlcGFyZUlucHV0cyhpbnB1dEFycmF5KTtcclxuXHJcbiAgICAgICAgbGV0IGhpZGRlbnMgPSBNYXRyaXgubXVsdGlwbHkodGhpcy5paFdlaWdodHMsIGlucHV0cyk7XHJcbiAgICAgICAgaGlkZGVucy5hZGQodGhpcy5paEJpYXMpO1xyXG4gICAgICAgIGhpZGRlbnMubWFwKHNpZ21vaWQpO1xyXG5cclxuICAgICAgICBsZXQgb3V0cHV0cyA9IE1hdHJpeC5tdWx0aXBseSh0aGlzLmhvV2VpZ2h0cywgaGlkZGVucyk7XHJcbiAgICAgICAgb3V0cHV0cy5hZGQodGhpcy5ob0JpYXMpO1xyXG4gICAgICAgIG91dHB1dHMubWFwKHNpZ21vaWQpO1xyXG5cclxuICAgICAgICByZXR1cm4geyBpbnB1dHMsIGhpZGRlbnMsIG91dHB1dHMgfTtcclxuICAgIH1cclxuXHJcbiAgICBxdWVyeUJhY2sodGFyZ2V0QXJyYXkgPSBbXSkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwcmVkaWN0KGlucHV0QXJyYXkgPSBbXSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmZlZWRGb3dhcmQoaW5wdXRBcnJheSkub3V0cHV0cztcclxuICAgIH1cclxuXHJcbiAgICBnZXRXZWlnaHRzVXBkYXRlKGlucHV0cyA9IG5ldyBNYXRyaXgoKSwgb3V0cHV0cyA9IG5ldyBNYXRyaXgoKSwgZXJyb3JzID0gMSkge1xyXG4gICAgICAgIGxldCBncmFkaWVudHMgPSBNYXRyaXgubWFwKG91dHB1dHMsIGRTaWdtb2lkKTtcclxuICAgICAgICBncmFkaWVudHMubXVsdGlwbHkoZXJyb3JzKTtcclxuICAgICAgICBncmFkaWVudHMubXVsdGlwbHkodGhpcy5scik7XHJcblxyXG4gICAgICAgIGxldCBpbnB1dHNUcmFuc3Bvc2VkID0gTWF0cml4LnRyYW5zcG9zZShpbnB1dHMpO1xyXG4gICAgICAgIGxldCBjaGFuZ2UgPSBNYXRyaXgubXVsdGlwbHkoZ3JhZGllbnRzLCBpbnB1dHNUcmFuc3Bvc2VkKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHsgY2hhbmdlLCBncmFkaWVudHMgfTtcclxuICAgIH1cclxuXHJcbiAgICBiYWNrcHJvcGFnYXRlKGlucHV0cyA9IFtdLCB0YXJnZXRzID0gbmV3IE1hdHJpeCgpKSB7XHJcbiAgICAgICAgbGV0IHsgaGlkZGVucywgb3V0cHV0cyB9ID0gdGhpcy5mZWVkRm93YXJkKGlucHV0cyk7XHJcblxyXG4gICAgICAgIGxldCBob0Vycm9ycyA9IE1hdHJpeC5zdWJ0cmFjdCh0YXJnZXRzLCBvdXRwdXRzKTtcclxuICAgICAgICBsZXQgaG9VcGRhdGVzID0gdGhpcy5nZXRXZWlnaHRzVXBkYXRlKGhpZGRlbnMsIG91dHB1dHMsIGhvRXJyb3JzKTtcclxuICAgICAgICB0aGlzLmhvV2VpZ2h0cy5hZGQoaG9VcGRhdGVzLmNoYW5nZSk7XHJcbiAgICAgICAgdGhpcy5ob0JpYXMuYWRkKGhvVXBkYXRlcy5ncmFkaWVudHMpO1xyXG5cclxuICAgICAgICBsZXQgaG9XZWlnaHRzVHJhbnNwb3NlZCA9IE1hdHJpeC50cmFuc3Bvc2UodGhpcy5ob1dlaWdodHMpO1xyXG4gICAgICAgIGxldCBpaEVycm9ycyA9IE1hdHJpeC5tdWx0aXBseShob1dlaWdodHNUcmFuc3Bvc2VkLCBob0Vycm9ycyk7XHJcbiAgICAgICAgbGV0IGloVXBkYXRlcyA9IHRoaXMuZ2V0V2VpZ2h0c1VwZGF0ZShpbnB1dHMsIGhpZGRlbnMsIGloRXJyb3JzKTtcclxuICAgICAgICB0aGlzLmloV2VpZ2h0cy5hZGQoaWhVcGRhdGVzLmNoYW5nZSk7XHJcbiAgICAgICAgdGhpcy5paEJpYXMuYWRkKGloVXBkYXRlcy5ncmFkaWVudHMpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyYWluKHBhcmFtcyA9IHsgdHJhaW5pbmdEYXRhOiBbXSwgcGVyaW9kOiAxLCBlcG9jaDogMSB9KSB7XHJcbiAgICAgICAgbGV0IGlucHV0QXJyYXkgPSBbXSwgdGFyZ2V0QXJyYXkgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBkYXRhIG9mIHBhcmFtcy50cmFpbmluZ0RhdGEpIHtcclxuICAgICAgICAgICAgaW5wdXRBcnJheS5wdXNoKGRhdGEuaW5wdXRzKTtcclxuICAgICAgICAgICAgdGFyZ2V0QXJyYXkucHVzaChkYXRhLnRhcmdldHMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGlucHV0cyA9IGFycmF5TGlicmFyeS5lYWNoKGlucHV0QXJyYXksIHZhbHVlID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJlcGFyZUlucHV0cyh2YWx1ZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxldCB0YXJnZXRzID0gYXJyYXlMaWJyYXJ5LmVhY2godGFyZ2V0QXJyYXksIHZhbHVlID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJlcGFyZVRhcmdldHModmFsdWUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBsZXQgcnVuID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcmFtcy5wZXJpb2Q7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiBpbiBpbnB1dHMpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJhY2twcm9wYWdhdGUoaW5wdXRzW2pdLCB0YXJnZXRzW2pdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGZ1bmMuaXNzZXQocGFyYW1zLmVwb2NoKSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBwID0gMDsgcCA8IHBhcmFtcy5lcG9jaDsgcCsrKSB7XHJcbiAgICAgICAgICAgICAgICBydW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJ1bigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZXRMZWFybmluZ1JhdGUobHIgPSAwLjEpIHtcclxuICAgICAgICB0aGlzLmxyID0gbHI7XHJcbiAgICB9XHJcblxyXG4gICAgcHJlcGFyZUlucHV0cyhpbnB1dEFycmF5ID0gW10pIHtcclxuICAgICAgICBsZXQgaW5wdXRzID0gTWF0cml4LmZyb21BcnJheShNYXRoLm5vcm1hbGl6ZShpbnB1dEFycmF5KSk7XHJcbiAgICAgICAgaW5wdXRzLm11bHRpcGx5KDAuOTkpO1xyXG4gICAgICAgIGlucHV0cy5hZGQoMC4wMSk7XHJcbiAgICAgICAgcmV0dXJuIGlucHV0cztcclxuICAgIH1cclxuXHJcbiAgICBwcmVwYXJlVGFyZ2V0cyh0YXJnZXRBcnJheSA9IFtdKSB7XHJcbiAgICAgICAgbGV0IHRhcmdldHMgPSBNYXRyaXguZnJvbUFycmF5KHRhcmdldEFycmF5KTtcclxuICAgICAgICB0YXJnZXRzLmFkZCgwLjAxKTtcclxuICAgICAgICB0YXJnZXRzLm11bHRpcGx5KDAuOTkpO1xyXG4gICAgICAgIHJldHVybiB0YXJnZXRzO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE5ldXJhbE5ldHdvcms7IiwiY29uc3QgRnVuYyA9IHJlcXVpcmUoJy4vRnVuYycpO1xyXG5cclxuY2xhc3MgUGVyaW9kIGV4dGVuZHMgRnVuYyB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICB0cmltTW9udGhBcnJheSgpIHtcclxuICAgICAgICBsZXQgbW9udGhzID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm1vbnRocy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBtb250aHMucHVzaCh0aGlzLm1vbnRoc1tpXS5zbGljZSgwLCAzKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBtb250aHM7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0WWVhcnMoY291bnQgPSA1KSB7XHJcbiAgICAgICAgbGV0IHllYXIgPSBuZXcgRGF0ZSgpLmdldFllYXIoKSArIDE5MDA7XHJcbiAgICAgICAgbGV0IGZldGNoZWQgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcclxuICAgICAgICAgICAgZmV0Y2hlZC5wdXNoKGAke3llYXIgLSAxfS0ke3llYXJ9YCk7XHJcbiAgICAgICAgICAgIHllYXIrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZldGNoZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgaXNUaW1lVmFsaWQodGltZSkge1xyXG4gICAgICAgIHRpbWUgPSB0aW1lLnNwbGl0KCc6Jyk7XHJcbiAgICAgICAgaWYgKHRpbWUubGVuZ3RoID09IDIgfHwgdGltZS5sZW5ndGggPT0gMykge1xyXG4gICAgICAgICAgICB2YXIgaG91ciA9IG5ldyBOdW1iZXIodGltZVswXSk7XHJcbiAgICAgICAgICAgIHZhciBtaW51dGVzID0gbmV3IE51bWJlcih0aW1lWzFdKTtcclxuICAgICAgICAgICAgdmFyIHNlY29uZHMgPSAwO1xyXG4gICAgICAgICAgICB2YXIgdG90YWwgPSAwO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRpbWUubGVuZ3RoID09IDMpIHtcclxuICAgICAgICAgICAgICAgIHNlY29uZHMgPSBuZXcgTnVtYmVyKHRpbWVbMl0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKGhvdXIgPiAyMyB8fCBob3VyIDwgMCB8fCBtaW51dGVzID4gNTkgfHwgbWludXRlcyA8IDAgfHwgc2Vjb25kcyA+IDU5IHx8IHNlY29uZHMgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKGhvdXIgPiAyMyB8fCBob3VyIDwgMCB8fCBtaW51dGVzID4gNTkgfHwgbWludXRlcyA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciB0b3RhbCA9IChob3VyICogNjAgKiA2MCkgKyAobWludXRlcyAqIDYwKSArIHNlY29uZHM7XHJcbiAgICAgICAgICAgIHJldHVybiB0b3RhbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHRpbWUodGltZSkge1xyXG4gICAgICAgIGxldCBkYXRlID0gKHRoaXMuaXNzZXQodGltZSkpID8gbmV3IERhdGUoTWF0aC5mbG9vcih0aW1lKSkgOiBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIGxldCBob3VyID0gZGF0ZS5nZXRIb3VycygpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgbGV0IG1pbnV0ZXMgPSBkYXRlLmdldE1pbnV0ZXMoKS50b1N0cmluZygpO1xyXG4gICAgICAgIGxldCBzZWNvbmRzID0gZGF0ZS5nZXRTZWNvbmRzKCkudG9TdHJpbmcoKTtcclxuXHJcbiAgICAgICAgaG91ciA9IChob3VyLmxlbmd0aCA+IDEpID8gaG91ciA6IGAwJHtob3VyfWA7XHJcbiAgICAgICAgbWludXRlcyA9IChtaW51dGVzLmxlbmd0aCA+IDEpID8gbWludXRlcyA6IGAwJHttaW51dGVzfWA7XHJcbiAgICAgICAgc2Vjb25kcyA9IChzZWNvbmRzLmxlbmd0aCA+IDEpID8gc2Vjb25kcyA6IGAwJHtzZWNvbmRzfWA7XHJcblxyXG4gICAgICAgIHJldHVybiBgJHtob3VyfToke21pbnV0ZXN9OiR7c2Vjb25kc31gO1xyXG4gICAgfVxyXG5cclxuICAgIGRhdGUodGltZSkge1xyXG4gICAgICAgIGxldCBkYXRlID0gKHRoaXMuaXNzZXQodGltZSkpID8gbmV3IERhdGUoTWF0aC5mbG9vcih0aW1lKSkgOiBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIGxldCBkYXkgPSBkYXRlLmdldERhdGUoKS50b1N0cmluZygpO1xyXG4gICAgICAgIGxldCBtb250aCA9IChkYXRlLmdldE1vbnRoKCkgKyAxKS50b1N0cmluZygpO1xyXG4gICAgICAgIGxldCB5ZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCk7XHJcblxyXG4gICAgICAgIGRheSA9IChkYXkubGVuZ3RoID4gMSkgPyBkYXkgOiBgMCR7ZGF5fWA7XHJcbiAgICAgICAgbW9udGggPSAobW9udGgubGVuZ3RoID4gMSkgPyBtb250aCA6IGAwJHttb250aH1gO1xyXG5cclxuICAgICAgICByZXR1cm4gYCR7eWVhcn0tJHttb250aH0tJHtkYXl9YDtcclxuICAgIH1cclxuXHJcbiAgICB0aW1lX2RhdGUodGltZSkge1xyXG4gICAgICAgIHJldHVybiBgJHt0aGlzLnRpbWUodGltZSl9LCAke3RoaXMuZGF0ZSh0aW1lKX1gO1xyXG4gICAgfVxyXG5cclxuICAgIHRpbWVUb2RheSgpIHtcclxuICAgICAgICBsZXQgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgbGV0IGhvdXIgPSBkYXRlLmdldEhvdXJzKCk7XHJcbiAgICAgICAgbGV0IG1pbnV0ZXMgPSBkYXRlLmdldE1pbnV0ZXMoKTtcclxuICAgICAgICBsZXQgc2Vjb25kcyA9IGRhdGUuZ2V0U2Vjb25kcygpO1xyXG5cclxuICAgICAgICBsZXQgdGltZSA9IHRoaXMuaXNUaW1lVmFsaWQoYCR7aG91cn06JHttaW51dGVzfToke3NlY29uZHN9YCk7XHJcbiAgICAgICAgcmV0dXJuIHRpbWUgPyB0aW1lIDogLTE7XHJcbiAgICB9XHJcblxyXG4gICAgaXNEYXRlVmFsaWQodmFsdWUpIHtcclxuICAgICAgICBpZiAodGhpcy5pc0RhdGUodmFsdWUpKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzWWVhclZhbGlkKHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNNb250aFZhbGlkKHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzRGF5VmFsaWQodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgaXNEYXlWYWxpZCh2YWx1ZSkge1xyXG4gICAgICAgIHZhciB2X2RheSA9IFwiXCI7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAyOyBpKyspIHtcclxuICAgICAgICAgICAgdl9kYXkgKz0gdmFsdWVbaSArIDhdO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbGltaXQgPSAwO1xyXG4gICAgICAgIHZhciBtb250aCA9IHRoaXMuaXNNb250aFZhbGlkKHZhbHVlKTtcclxuXHJcbiAgICAgICAgaWYgKG1vbnRoID09ICcwMScpIHtcclxuICAgICAgICAgICAgbGltaXQgPSAzMTtcclxuICAgICAgICB9IGVsc2UgaWYgKG1vbnRoID09ICcwMicpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNMZWFwWWVhcih0aGlzLmlzWWVhclZhbGlkKHZhbHVlKSkpIHtcclxuICAgICAgICAgICAgICAgIGxpbWl0ID0gMjk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsaW1pdCA9IDI4O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChtb250aCA9PSAnMDMnKSB7XHJcbiAgICAgICAgICAgIGxpbWl0ID0gMzE7XHJcbiAgICAgICAgfSBlbHNlIGlmIChtb250aCA9PSAnMDQnKSB7XHJcbiAgICAgICAgICAgIGxpbWl0ID0gMzA7XHJcbiAgICAgICAgfSBlbHNlIGlmIChtb250aCA9PSAnMDUnKSB7XHJcbiAgICAgICAgICAgIGxpbWl0ID0gMzE7XHJcbiAgICAgICAgfSBlbHNlIGlmIChtb250aCA9PSAnMDYnKSB7XHJcbiAgICAgICAgICAgIGxpbWl0ID0gMzA7XHJcbiAgICAgICAgfSBlbHNlIGlmIChtb250aCA9PSAnMDcnKSB7XHJcbiAgICAgICAgICAgIGxpbWl0ID0gMzE7XHJcbiAgICAgICAgfSBlbHNlIGlmIChtb250aCA9PSAnMDgnKSB7XHJcbiAgICAgICAgICAgIGxpbWl0ID0gMzE7XHJcbiAgICAgICAgfSBlbHNlIGlmIChtb250aCA9PSAnMDknKSB7XHJcbiAgICAgICAgICAgIGxpbWl0ID0gMzA7XHJcbiAgICAgICAgfSBlbHNlIGlmIChtb250aCA9PSAnMTAnKSB7XHJcbiAgICAgICAgICAgIGxpbWl0ID0gMzE7XHJcbiAgICAgICAgfSBlbHNlIGlmIChtb250aCA9PSAnMTEnKSB7XHJcbiAgICAgICAgICAgIGxpbWl0ID0gMzA7XHJcbiAgICAgICAgfSBlbHNlIGlmIChtb250aCA9PSAnMTInKSB7XHJcbiAgICAgICAgICAgIGxpbWl0ID0gMzE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobGltaXQgPCB2X2RheSkge1xyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZfZGF5O1xyXG4gICAgfVxyXG5cclxuICAgIGlzRGF0ZSh2YWx1ZSkge1xyXG4gICAgICAgIHZhciBsZW4gPSB2YWx1ZS5sZW5ndGg7XHJcbiAgICAgICAgaWYgKGxlbiA9PSAxMCkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciB4IGluIHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0RpZ2l0KHZhbHVlW3hdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoeCA9PSA0IHx8IHggPT0gNykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWVbeF0gPT0gJy0nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGlzTW9udGhWYWxpZCh2YWx1ZSkge1xyXG4gICAgICAgIHZhciB2X21vbnRoID0gXCJcIjtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDI7IGkrKykge1xyXG4gICAgICAgICAgICB2X21vbnRoICs9IHZhbHVlW2kgKyA1XTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHZfbW9udGggPiAxMiB8fCB2X21vbnRoIDwgMSkge1xyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZfbW9udGg7XHJcbiAgICB9XHJcblxyXG4gICAgaXNZZWFyVmFsaWQodmFsdWUpIHtcclxuICAgICAgICB2YXIgeWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoJ1knKTtcclxuICAgICAgICB2YXIgdl95ZWFyID0gXCJcIjtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDQ7IGkrKykge1xyXG4gICAgICAgICAgICB2X3llYXIgKz0gdmFsdWVbaSArIDBdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodl95ZWFyID4geWVhcikge1xyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZfeWVhcjtcclxuICAgIH1cclxuXHJcbiAgICBnZXRZZWFyKHZhbHVlKSB7XHJcbiAgICAgICAgdmFyIHZfeWVhciA9IFwiXCI7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA0OyBpKyspIHtcclxuICAgICAgICAgICAgdl95ZWFyICs9IHZhbHVlW2kgKyAwXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZfeWVhcjtcclxuICAgIH1cclxuXHJcbiAgICBpc0xlYXBZZWFyKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHZhbHVlICUgNCA9PSAwKSB7XHJcbiAgICAgICAgICAgIGlmICgodmFsdWUgJSAxMDAgPT0gMCkgJiYgKHZhbHVlICUgNDAwICE9IDApKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBkYXlzSW5Nb250aChtb250aCwgeWVhcikge1xyXG4gICAgICAgIHZhciBkYXlzID0gMDtcclxuICAgICAgICBpZiAobW9udGggPT0gJzAxJykge1xyXG4gICAgICAgICAgICBkYXlzID0gMzE7XHJcbiAgICAgICAgfSBlbHNlIGlmIChtb250aCA9PSAnMDInKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzTGVhcFllYXIoeWVhcikpIHtcclxuICAgICAgICAgICAgICAgIGRheXMgPSAyOTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRheXMgPSAyODtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAobW9udGggPT0gJzAzJykge1xyXG4gICAgICAgICAgICBkYXlzID0gMzE7XHJcbiAgICAgICAgfSBlbHNlIGlmIChtb250aCA9PSAnMDQnKSB7XHJcbiAgICAgICAgICAgIGRheXMgPSAzMDtcclxuICAgICAgICB9IGVsc2UgaWYgKG1vbnRoID09ICcwNScpIHtcclxuICAgICAgICAgICAgZGF5cyA9IDMxO1xyXG4gICAgICAgIH0gZWxzZSBpZiAobW9udGggPT0gJzA2Jykge1xyXG4gICAgICAgICAgICBkYXlzID0gMzA7XHJcbiAgICAgICAgfSBlbHNlIGlmIChtb250aCA9PSAnMDcnKSB7XHJcbiAgICAgICAgICAgIGRheXMgPSAzMTtcclxuICAgICAgICB9IGVsc2UgaWYgKG1vbnRoID09ICcwOCcpIHtcclxuICAgICAgICAgICAgZGF5cyA9IDMxO1xyXG4gICAgICAgIH0gZWxzZSBpZiAobW9udGggPT0gJzA5Jykge1xyXG4gICAgICAgICAgICBkYXlzID0gMzA7XHJcbiAgICAgICAgfSBlbHNlIGlmIChtb250aCA9PSAnMTAnKSB7XHJcbiAgICAgICAgICAgIGRheXMgPSAzMTtcclxuICAgICAgICB9IGVsc2UgaWYgKG1vbnRoID09ICcxMScpIHtcclxuICAgICAgICAgICAgZGF5cyA9IDMwO1xyXG4gICAgICAgIH0gZWxzZSBpZiAobW9udGggPT0gJzEyJykge1xyXG4gICAgICAgICAgICBkYXlzID0gMzE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkYXlzO1xyXG4gICAgfVxyXG5cclxuICAgIGRhdGVWYWx1ZShkYXRlKSB7XHJcbiAgICAgICAgdmFyIHZhbHVlID0gMDtcclxuICAgICAgICB2YXIgeWVhciA9IHRoaXMuZ2V0WWVhcihkYXRlKSAqIDM2NTtcclxuICAgICAgICB2YXIgbW9udGggPSAwO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgdGhpcy5pc01vbnRoVmFsaWQoZGF0ZSk7IGkrKykge1xyXG4gICAgICAgICAgICBtb250aCA9IHRoaXMuZGF5c0luTW9udGgoaSwgdGhpcy5nZXRZZWFyKGRhdGUpKSAvIDEgKyBtb250aCAvIDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBkYXkgPSB0aGlzLmlzRGF5VmFsaWQoZGF0ZSk7XHJcbiAgICAgICAgdmFsdWUgPSAoeWVhciAvIDEpICsgKG1vbnRoIC8gMSkgKyAoZGF5IC8gMSk7XHJcblxyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICB0b2RheSgpIHtcclxuICAgICAgICBsZXQgdG9kYXkgPSBuZXcgRGF0ZTtcclxuICAgICAgICBsZXQgbW9udGggPSB0b2RheS5nZXRNb250aCgpIC8gMSArIDE7XHJcbiAgICAgICAgbW9udGggPSAobW9udGgubGVuZ3RoID4gMSkgPyBtb250aCA6IGAwJHttb250aH1gO1xyXG5cclxuICAgICAgICB0b2RheSA9ICh0b2RheS5nZXRGdWxsWWVhcigpKSArICctJyArIG1vbnRoICsgJy0nICsgdG9kYXkuZ2V0RGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0b2RheTtcclxuICAgIH1cclxuXHJcbiAgICBnZXREYXRlT2JqZWN0KHZhbHVlKSB7XHJcbiAgICAgICAgbGV0IGRheXMgPSBNYXRoLmZsb29yKHZhbHVlIC8gdGhpcy5zZWNvbmRzSW5EYXlzKDEpKTtcclxuXHJcbiAgICAgICAgdmFsdWUgLT0gdGhpcy5zZWNvbmRzSW5EYXlzKGRheXMpO1xyXG5cclxuICAgICAgICBsZXQgaG91cnMgPSBNYXRoLmZsb29yKHZhbHVlIC8gdGhpcy5zZWNvbmRzSW5Ib3VycygxKSk7XHJcbiAgICAgICAgdmFsdWUgLT0gdGhpcy5zZWNvbmRzSW5Ib3Vycyhob3Vycyk7XHJcblxyXG4gICAgICAgIGxldCBtaW51dGVzID0gTWF0aC5mbG9vcih2YWx1ZSAvIHRoaXMuc2Vjb25kc0luTWludXRlcygxKSk7XHJcbiAgICAgICAgdmFsdWUgLT0gdGhpcy5zZWNvbmRzSW5NaW51dGVzKG1pbnV0ZXMpO1xyXG5cclxuICAgICAgICBsZXQgc2Vjb25kcyA9IHZhbHVlO1xyXG5cclxuICAgICAgICByZXR1cm4geyBkYXlzLCBob3VycywgbWludXRlcywgc2Vjb25kcyB9O1xyXG4gICAgfVxyXG5cclxuICAgIGRhdGVXaXRoVG9kYXkoZGF0ZSkge1xyXG4gICAgICAgIHZhciB0b2RheSA9IE1hdGguZmxvb3IodGhpcy5kYXRlVmFsdWUodGhpcy50b2RheSgpKSk7XHJcbiAgICAgICAgbGV0IGRhdGVWYWx1ZSA9IE1hdGguZmxvb3IodGhpcy5kYXRlVmFsdWUoZGF0ZSkpO1xyXG5cclxuICAgICAgICB2YXIgdmFsdWUgPSB7IGRpZmY6IChkYXRlVmFsdWUgLSB0b2RheSksIHdoZW46ICcnIH07XHJcbiAgICAgICAgaWYgKGRhdGVWYWx1ZSA+IHRvZGF5KSB7XHJcbiAgICAgICAgICAgIHZhbHVlLndoZW4gPSAnZnV0dXJlJztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoZGF0ZVZhbHVlID09IHRvZGF5KSB7XHJcbiAgICAgICAgICAgIHZhbHVlLndoZW4gPSAndG9kYXknO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdmFsdWUud2hlbiA9ICdwYXN0JztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIGRhdGVTdHJpbmcoZGF0ZSkge1xyXG4gICAgICAgIGxldCB5ZWFyID0gbmV3IE51bWJlcih0aGlzLmdldFllYXIoZGF0ZSkpO1xyXG4gICAgICAgIGxldCBtb250aCA9IG5ldyBOdW1iZXIodGhpcy5pc01vbnRoVmFsaWQoZGF0ZSkpO1xyXG4gICAgICAgIGxldCBkYXkgPSBuZXcgTnVtYmVyKHRoaXMuaXNEYXlWYWxpZChkYXRlKSk7XHJcblxyXG4gICAgICAgIHJldHVybiBkYXkgKyAnICcgKyB0aGlzLm1vbnRoc1ttb250aCAtIDFdICsgJywgJyArIHllYXI7XHJcbiAgICB9XHJcblxyXG4gICAgc2Vjb25kc0luRGF5cyhkYXlzKSB7XHJcbiAgICAgICAgbGV0IHZhbHVlID0gTWF0aC5mbG9vcihkYXlzICogMjQgKiA2MCAqIDYwKTtcclxuICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgc2Vjb25kc0luSG91cnMoaG91cnMpIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihob3VycyAqIDYwICogNjApO1xyXG4gICAgfVxyXG5cclxuICAgIHNlY29uZHNJbk1pbnV0ZXMobWludXRlcykge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKG1pbnV0ZXMgKiA2MCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2Vjb25kc1RpbGxEYXRlKGRhdGUpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zZWNvbmRzSW5EYXlzKE1hdGguZmxvb3IodGhpcy5kYXRlVmFsdWUoZGF0ZSkpKTtcclxuICAgIH1cclxuXHJcbiAgICBzZWNvbmRzVGlsbFRvZGF5KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNlY29uZHNUaWxsRGF0ZSh0aGlzLnRvZGF5KCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHNlY29uZHNUaWxsTm93KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNlY29uZHNUaWxsRGF0ZSh0aGlzLnRvZGF5KCkpICsgdGhpcy50aW1lVG9kYXkoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZWNvbmRzVGlsbE1vbWVudChtb21lbnQpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zZWNvbmRzVGlsbERhdGUodGhpcy5kYXRlKG1vbWVudCkpICsgdGhpcy5pc1RpbWVWYWxpZCh0aGlzLnRpbWUobW9tZW50KSk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9nKC4uLmRhdGEpIHtcclxuICAgICAgICBsZXQgdGltZSA9IGBbJHt0aGlzLnRpbWUoKX1dOmA7XHJcbiAgICAgICAgY29uc29sZS5sb2codGltZSwgLi4uZGF0YSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGVyaW9kOyIsImNvbnN0IEpTRWxlbWVudHMgPSByZXF1aXJlKCcuL0pTRWxlbWVudHMnKTtcclxuXHJcbmNsYXNzIEVtcHR5IHtcclxufVxyXG5cclxuY2xhc3MgVGVtcGxhdGUgZXh0ZW5kcyBKU0VsZW1lbnRzIHtcclxuICAgIGNvbnN0cnVjdG9yKHRoZVdpbmRvdyA9IEVtcHR5KSB7XHJcbiAgICAgICAgc3VwZXIodGhlV2luZG93KTtcclxuICAgICAgICB0aGlzLnZpcnR1YWwgPSB7fTtcclxuICAgICAgICB0aGlzLmVsZW1lbnRMaWJyYXJ5KHRoZVdpbmRvdy5FbGVtZW50KTtcclxuICAgICAgICB0aGlzLmh0bWxDb2xsZWN0aW9uTGlicmFyeSh0aGVXaW5kb3cuSFRNTENvbGxlY3Rpb24pO1xyXG4gICAgICAgIHRoaXMubm9kZUxpYnJhcnkodGhlV2luZG93Lk5vZGUpO1xyXG4gICAgICAgIHRoaXMubm9kZUxpc3RMaWJyYXJ5KHRoZVdpbmRvdy5Ob2RlTGlzdCk7XHJcbiAgICB9XHJcblxyXG4gICAgZWxlbWVudExpYnJhcnkoRWxlbWVudCA9IEVtcHR5KSB7XHJcbiAgICAgICAgLy9GcmFtZXdvcmsgd2l0aCBqc2RvbVxyXG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcclxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS5jaGFuZ2VOb2RlTmFtZSA9IGZ1bmN0aW9uIChuYW1lKSB7XHJcbiAgICAgICAgICAgIGxldCBzdHJ1Y3R1cmUgPSB0aGlzLnRvSnNvbigpO1xyXG4gICAgICAgICAgICBzdHJ1Y3R1cmUuZWxlbWVudCA9IG5hbWU7XHJcbiAgICAgICAgICAgIGxldCBlbGVtZW50ID0gc2VsZi5jcmVhdGVFbGVtZW50KHN0cnVjdHVyZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50O1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLnRvSnNvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSB0aGlzLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgIGxldCBhdHRyaWJ1dGVzID0gdGhpcy5nZXRBdHRyaWJ1dGVzKCk7XHJcbiAgICAgICAgICAgIGF0dHJpYnV0ZXMuc3R5bGUgPSB0aGlzLmNzcygpO1xyXG4gICAgICAgICAgICBsZXQgY2hpbGRyZW4gPSBbXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjaGlsZHJlbi5wdXNoKHRoaXMuY2hpbGRyZW5baV0udG9Kc29uKCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB7IGVsZW1lbnQsIGF0dHJpYnV0ZXMsIGNoaWxkcmVuIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLnNldE9wdGlvbnMgPSBmdW5jdGlvbiAob3B0aW9ucyA9IFtdLCBwYXJhbXMgPSB7IHNlbGVjdGVkOiAnJyB9KSB7XHJcbiAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcclxuICAgICAgICAgICAgaWYgKHNlbGYuaXNzZXQocGFyYW1zLmZsYWcpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlubmVySFRNTCA9ICcnO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9wdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCB0ZXh0ID0gb3B0aW9uc1tpXS50ZXh0IHx8IG9wdGlvbnNbaV07XHJcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSBvcHRpb25zW2ldLnZhbHVlIHx8IG9wdGlvbnNbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IG9wdGlvbiA9IHRoaXMubWFrZUVsZW1lbnQoeyBlbGVtZW50OiAnb3B0aW9uJywgYXR0cmlidXRlczogeyB2YWx1ZSB9LCB0ZXh0IH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkgPT0gJ251bGwnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5pc3NldChwYXJhbXMuc2VsZWN0ZWQpICYmIHZhbHVlID09IHBhcmFtcy5zZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbi5zZXRBdHRyaWJ1dGUoJ3NlbGVjdGVkJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS5jb21tb25BbmNlc3RvciA9IGZ1bmN0aW9uIChlbGVtZW50QSwgZWxlbWVudEIpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgYW5jZXN0b3JBIG9mIGVsZW1lbnRBLnBhcmVudHMoKSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgYW5jZXN0b3JCIG9mIGVsZW1lbnRCLnBhcmVudHMoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmNlc3RvckEgPT0gYW5jZXN0b3JCKSByZXR1cm4gYW5jZXN0b3JBO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLm9uQWRkZWQgPSBmdW5jdGlvbiAoY2FsbGJhY2sgPSAoKSA9PiB7IH0pIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdET01Ob2RlSW5zZXJ0ZWRJbnRvRG9jdW1lbnQnLCBldmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy9TdG9yZSB0aGUgc3RhdGVzIG9mIGFuIGVsZW1lbnQgaGVyZVxyXG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLnN0YXRlcyA9IHt9O1xyXG5cclxuICAgICAgICAvL1RoaXMgaXMgYSB0ZW1wb3Jhcnkgc3RvcmFnZSBmb3IgZWxlbWVudHMgYXR0cmlidXRlc1xyXG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLnRlbXAgPSB7fTtcclxuXHJcbiAgICAgICAgLy9UaGlzIGxpc3RlbnMgYW5kIGhhbmRsZXMgZm9yIG11bHRpcGxlIGJ1YmJsZWQgZXZlbnRzXHJcbiAgICAgICAgRWxlbWVudC5wcm90b3R5cGUubWFueUJ1YmJsZWRFdmVudHMgPSBmdW5jdGlvbiAoZXZlbnRzLCBjYWxsYmFjayA9ICgpID0+IHsgfSkge1xyXG4gICAgICAgICAgICBldmVudHMgPSBldmVudHMuc3BsaXQoJywnKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgZXZlbnQgb2YgZXZlbnRzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJ1YmJsZWRFdmVudChldmVudC50cmltKCksIGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9UaGlzIGxpc3RlbnMgYW5kIGhhbmRsZXMgZm9yIG11bHRpcGxlIGJ1YmJsZWQgZXZlbnRzIHRoYXQgZGlkIG5vdCBidWJibGVcclxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS5tYW55Tm90QnViYmxlZEV2ZW50cyA9IGZ1bmN0aW9uIChldmVudHMsIGNhbGxiYWNrID0gKCkgPT4geyB9KSB7XHJcbiAgICAgICAgICAgIGV2ZW50cyA9IGV2ZW50cy5zcGxpdCgnLCcpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBldmVudCBvZiBldmVudHMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubm90QnViYmxlZEV2ZW50KGV2ZW50LnRyaW0oKSwgY2FsbGJhY2spO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL1RoaXMgaGFuZGxlcyBhbGwgZXZlbnRzIHRoYXQgYXJlIGJ1YmJsZWQgd2l0aGluIGFuIGVsZW1lbnQgYW5kIGl0J3MgY2hpbGRyZW5cclxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS5idWJibGVkRXZlbnQgPSBmdW5jdGlvbiAoZXZlbnQsIGNhbGxiYWNrID0gKCkgPT4geyB9KSB7XHJcbiAgICAgICAgICAgIC8vTGlzdGVuIGZvciB0aGlzIGV2ZW50IG9uIHRoZSBlbnRpcmUgZG9jdW1lbnRcclxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy9pZiB0aGUgZXZlbnQgYnViYmxlcyB1cCB0aGUgZWxlbWVudCBmaXJlIHRoZSBjYWxsYmFja1xyXG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LnRhcmdldCA9PSB0aGlzIHx8IHRoaXMuaXNBbmNlc3RvcihldmVudC50YXJnZXQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vVGhpcyBoYW5kbGVzIGFsbCBldmVudHMgdGhhdCBhcmUgbm90IGJ1YmJsZWQgd2l0aGluIGFuIGVsZW1lbnQgYW5kIGl0J3MgY2hpbGRyZW5cclxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS5ub3RCdWJibGVkRXZlbnQgPSBmdW5jdGlvbiAoZXZlbnQsIGNhbGxiYWNrID0gKCkgPT4geyB9KSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghKGV2ZW50LnRhcmdldCA9PSB0aGlzIHx8IHRoaXMuaXNBbmNlc3RvcihldmVudC50YXJnZXQpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL0xpc3RlbiB0byBtdWx0aXBsZSBldmVudHMgYXQgdGltZSB3aXRoIGEgc2luZ2xlIGNhbGxiYWNrIGZ1bmN0aW9uXHJcbiAgICAgICAgRWxlbWVudC5wcm90b3R5cGUuYWRkTXVsdGlwbGVFdmVudExpc3RlbmVyID0gZnVuY3Rpb24gKGV2ZW50cywgY2FsbGJhY2sgPSAoKSA9PiB7IH0pIHtcclxuICAgICAgICAgICAgZXZlbnRzID0gZXZlbnRzLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGV2ZW50IG9mIGV2ZW50cykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKGV2ZW50LnRyaW0oKSwgZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9wZXJmb3JtIGFjdGlvbnMgb24gbW91c2VlbnRlciBhbmQgbW91c2VsZWF2ZVxyXG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLmhvdmVyID0gZnVuY3Rpb24gKG1vdmVpbiA9ICgpID0+IHsgfSwgbW92ZW91dCA9ICgpID0+IHsgfSkge1xyXG4gICAgICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCBldmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG1vdmVpbiA9PT0gJ2Z1bmN0aW9uJylcclxuICAgICAgICAgICAgICAgICAgICBtb3ZlaW4oZXZlbnQpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgbW92ZW91dCA9PT0gJ2Z1bmN0aW9uJylcclxuICAgICAgICAgICAgICAgICAgICBtb3Zlb3V0KGV2ZW50KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL2Egc2hvcnRlciBuYW1lIGZvciBxdWVyeVNlbGVjdG9yXHJcbiAgICAgICAgRWxlbWVudC5wcm90b3R5cGUuZmluZCA9IGZ1bmN0aW9uIChuYW1lID0gJycsIHBvc2l0aW9uID0gMCkge1xyXG4gICAgICAgICAgICBsZXQgZWxlbWVudCA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmIChzZWxmLmlzc2V0KHBvc2l0aW9uKSkgey8vZ2V0IHRoZSBhbGwgdGhlIGVsZW1lbnRzIGZvdW5kIGFuZCByZXR1cm4gdGhlIG9uZSBhdCB0aGlzIHBhcnRpY3VsYXIgcG9zaXRpb25cclxuICAgICAgICAgICAgICAgIHRoaXMucXVlcnlTZWxlY3RvckFsbChuYW1lKS5mb3JFYWNoKChlLCBwKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBvc2l0aW9uID09IHApIGVsZW1lbnQgPSBlO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gdGhpcy5xdWVyeVNlbGVjdG9yKG5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50O1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vYSBzaG9ydGVyIG5hbWUgZm9yIHF1ZXJ5U2VsZWN0b3JBbGxcclxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS5maW5kQWxsID0gZnVuY3Rpb24gKG5hbWUgPSAnJykge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5xdWVyeVNlbGVjdG9yQWxsKG5hbWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9wZXJmb3JtIGFuIGV4dGVuZGVkIHF1ZXJ5U2VsZWN0aW9uIG9uIHRoaXMgZWxlbWVudFxyXG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLnNlYXJjaCA9IGZ1bmN0aW9uIChuYW1lID0gJycsIG9wdGlvbnMgPSB7IGF0dHJpYnV0ZXM6IHt9LCBpZDogJycsIG5vZGVOYW1lOiAnJywgY2xhc3M6ICcnLCBjbGFzc2VzOiAnJyB9LCBwb3NpdGlvbiA9IDApIHtcclxuICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQgZm91bmRFbGVtZW50cyA9IFtdOy8vYWxsIHRoZSBlbGVtZW50cyBtZWV0aW5nIHRoZSByZXF1aXJlbWVudHNcclxuXHJcbiAgICAgICAgICAgIGlmIChzZWxmLmlzc2V0KG9wdGlvbnMpKSB7Ly9pZiB0aGUgb3B0aW9ucyB0byBjaGVjayBpcyBzZXRcclxuICAgICAgICAgICAgICAgIGxldCBhbGxFbGVtZW50cyA9IHRoaXMucXVlcnlTZWxlY3RvckFsbChuYW1lKTsvL2dldCBhbGwgdGhlIHBvc3NpYmxlIGVsZW1lbnRzXHJcblxyXG4gICAgICAgICAgICAgICAgLy9sb29wIHRocm91Z2ggdGhlbSBhbmQgY2hlY2sgaWYgdGhlIG1hdGNoIHRoZSBvcHRpb25zXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFsbEVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudCA9IGFsbEVsZW1lbnRzW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvL2NoZWNrIGZvciB0aGUgYXR0cmlidXRlc1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLmlzc2V0KG9wdGlvbnMuYXR0cmlidXRlcykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgYXR0ciBpbiBvcHRpb25zLmF0dHJpYnV0ZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNoZWNrIGFsbCB0aGUgYXR0cmlidXRlcyBvbmUgYWZ0ZXIgdGhlIG90aGVyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoYXR0cikgIT0gb3B0aW9ucy5hdHRyaWJ1dGVzW2F0dHJdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9pZiB0aGlzIGVsZW1lbnQgaXMgbm8gbG9uZyB2YWxpZCBza2lwIGl0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLmlzbnVsbChlbGVtZW50KSkgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvL2NoZWNrIGZvciB0aGUgSURcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5pc3NldChvcHRpb25zLmlkKSAmJiBvcHRpb25zLmlkICE9IGVsZW1lbnQuaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy9jaGVjayBmb3IgdGhlIGNsYXNzXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYuaXNzZXQob3B0aW9ucy5jbGFzcykgJiYgIWVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKG9wdGlvbnMuY2xhc3MpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vY2hlY2sgZm9yIHRoZSBjbGFzc2VzXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYuaXNzZXQob3B0aW9ucy5jbGFzc2VzKSAmJiAhZWxlbWVudC5oYXNDbGFzc2VzKG9wdGlvbnMuY2xhc3NlcykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy9jaGVjayBmb3IgdGhlIG5vZGVuYW1lXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYuaXNzZXQob3B0aW9ucy5ub2RlTmFtZSkgJiYgZWxlbWVudC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpICE9IG9wdGlvbnMubm9kZU5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy9jaGVjayBpZiB0byByZXR1cm4gZm9yIGEgcGFydGljdWxhciBwb3NpdGlvblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwb3NpdGlvbiA8PSAwKSByZXR1cm4gZWxlbWVudDtcclxuICAgICAgICAgICAgICAgICAgICBmb3VuZEVsZW1lbnRzLnB1c2goZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvL2dldCB0aGUgZWxlbWVudCBhdCB0aGUgc3BlY2lmaWVkIHBvc2l0aW9uXHJcbiAgICAgICAgICAgICAgICBpZiAoZm91bmRFbGVtZW50cy5sZW5ndGggJiYgc2VsZi5pc3NldChmb3VuZEVsZW1lbnRzW3Bvc2l0aW9uXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50ID0gZm91bmRFbGVtZW50c1twb3NpdGlvbl07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSB0aGlzLmZpbmQobmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50O1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vcGVyZm9ybSBzZWFyY2ggZm9yIGFsbCB0aGUgZWxlbWVudHMgdGhhdCBtZWV0IGEgcmVxdWlyZW1lbnRcclxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS5zZWFyY2hBbGwgPSBmdW5jdGlvbiAobmFtZSA9ICcnLCBvcHRpb25zID0geyBhdHRyaWJ1dGVzOiB7fSwgaWQ6ICcnLCBub2RlTmFtZTogJycsIGNsYXNzOiAnJywgY2xhc3NlczogJycgfSkge1xyXG4gICAgICAgICAgICBpZiAoc2VsZi5pc3NldChvcHRpb25zKSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGFsbEVsZW1lbnRzID0gdGhpcy5xdWVyeVNlbGVjdG9yQWxsKG5hbWUpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGVsZW1lbnRzID0gW107XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFsbEVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSBhbGxFbGVtZW50c1tpXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5pc3NldChvcHRpb25zLmF0dHJpYnV0ZXMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGF0dHIgaW4gb3B0aW9ucy5hdHRyaWJ1dGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoYXR0cikgIT0gb3B0aW9ucy5hdHRyaWJ1dGVzW2F0dHJdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLmlzc2V0KG9wdGlvbnMuaWQpICYmIG9wdGlvbnMuaWQgIT0gZWxlbWVudC5pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5pc3NldChvcHRpb25zLmNsYXNzKSAmJiAhZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMob3B0aW9ucy5jbGFzcykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYuaXNzZXQob3B0aW9ucy5jbGFzc2VzKSAmJiAhZWxlbWVudC5oYXNDbGFzc2VzKG9wdGlvbnMuY2xhc3NlcykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYuaXNzZXQob3B0aW9ucy5ub2RlTmFtZSkgJiYgZWxlbWVudC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpICE9IG9wdGlvbnMubm9kZU5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzZWxmLmlzbnVsbChlbGVtZW50KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50cy5wdXNoKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBlbGVtZW50cztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5xdWVyeVNlbGVjdG9yQWxsKG5hbWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9sb29rIGZvciBtdWx0aXBsZSBzaW5nbGUgZWxlbWVudHMgYXQgYSB0aW1lXHJcbiAgICAgICAgRWxlbWVudC5wcm90b3R5cGUuZmV0Y2ggPSBmdW5jdGlvbiAobmFtZXMgPSBbXSwgcG9zaXRpb24gPSAwKSB7XHJcbiAgICAgICAgICAgIGxldCBlbGVtZW50cyA9IHt9O1xyXG4gICAgICAgICAgICBmb3IgKGxldCBuYW1lIG9mIG5hbWVzKSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50c1tuYW1lXSA9IHRoaXMuZmluZChuYW1lLCBwb3NpdGlvbik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50cztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vbG9vayBmb3IgbXVsdGlwbGUgbm9kZWxpc3RzIGF0IGEgdGltZVxyXG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLmZldGNoQWxsID0gZnVuY3Rpb24gKG5hbWVzID0gW10pIHtcclxuICAgICAgICAgICAgbGV0IGVsZW1lbnRzID0ge307XHJcbiAgICAgICAgICAgIGZvciAobGV0IG5hbWUgb2YgbmFtZXMpIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnRzW25hbWVdID0gdGhpcy5maW5kQWxsKG5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudHM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL0dldCB0aGUgbm9kZXMgYmV0d2VlbiB0d28gY2hpbGQgZWxlbWVudHNcclxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS5ub2Rlc0JldHdlZW4gPSBmdW5jdGlvbiAoZWxlbWVudEEsIGVsZW1lbnRCKSB7XHJcbiAgICAgICAgICAgIGxldCBpbkJldHdlZW5Ob2RlcyA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBjaGlsZCBvZiBBcnJheS5mcm9tKHRoaXMuY2hpbGRyZW4pKSB7Ly9nZXQgYWxsIHRoZSBjaGlsZHJlblxyXG4gICAgICAgICAgICAgICAgLy9jaGVjayBpZiB0aGUgdHdvIGVsZW1lbnRzIGFyZSBjaGlsZHJlbiBvZiB0aGlzIGVsZW1lbnRcclxuICAgICAgICAgICAgICAgIGlmIChjaGlsZCA9PSBlbGVtZW50QSB8fCBjaGlsZCA9PSBlbGVtZW50QiB8fCBjaGlsZC5pc0FuY2VzdG9yKGVsZW1lbnRBKSB8fCBjaGlsZC5pc0FuY2VzdG9yKGVsZW1lbnRCKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluQmV0d2Vlbk5vZGVzLnB1c2goY2hpbGQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gaW5CZXR3ZWVuTm9kZXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL0dldCBpZiBlbGVtZW50IGlzIGNoaWxkIG9mIGFuIGVsZW1lbnRcclxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS5pc0FuY2VzdG9yID0gZnVuY3Rpb24gKGNoaWxkKSB7XHJcbiAgICAgICAgICAgIGxldCBwYXJlbnRzID0gY2hpbGQucGFyZW50cygpOy8vR2V0IGFsbCB0aGUgcGFyZW50cyBvZiBjaGlsZFxyXG4gICAgICAgICAgICByZXR1cm4gcGFyZW50cy5pbmNsdWRlcyh0aGlzKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvL0dldCBhbGwgdGhlIHBhcmVudHMgb2YgYW4gZWxlbWVudCB1bnRpbCBkb2N1bWVudFxyXG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLnBhcmVudHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGxldCBwYXJlbnRzID0gW107XHJcbiAgICAgICAgICAgIGxldCBjdXJyZW50UGFyZW50ID0gdGhpcy5wYXJlbnROb2RlO1xyXG4gICAgICAgICAgICB3aGlsZSAoY3VycmVudFBhcmVudCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnRzLnB1c2goY3VycmVudFBhcmVudCk7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50UGFyZW50ID0gY3VycmVudFBhcmVudC5wYXJlbnROb2RlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcGFyZW50cztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS5jdXN0b21QYXJlbnRzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBsZXQgcGFyZW50cyA9IHRoaXMucGFyZW50cygpO1xyXG4gICAgICAgICAgICBsZXQgY3VzdG9tUGFyZW50cyA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcmVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChwYXJlbnRzW2ldLm5vZGVOYW1lLmluY2x1ZGVzKCctJykpIHtcclxuICAgICAgICAgICAgICAgICAgICBjdXN0b21QYXJlbnRzLnB1c2gocGFyZW50c1tpXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGN1c3RvbVBhcmVudHM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL1JlbW92ZSBhIHN0YXRlIGZyb20gYW4gZWxlbWVudFxyXG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLnJlbW92ZVN0YXRlID0gZnVuY3Rpb24gKHBhcmFtcyA9IHsgbmFtZTogJycgfSkge1xyXG4gICAgICAgICAgICBsZXQgc3RhdGUgPSB0aGlzLmdldFN0YXRlKHBhcmFtcyk7Ly9nZXQgdGhlIHN0YXRlIChlbGVtZW50KVxyXG4gICAgICAgICAgICBpZiAoc2VsZi5pc3NldChzdGF0ZSkgJiYgc2VsZi5pc3NldChwYXJhbXMuZm9yY2UpKSB7Ly9pZiBzdGF0ZSBleGlzdHMgYW5kIHNob3VsZCBiZSBkZWxldGVkXHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5pc3NldChzdGF0ZS5kYXRhc2V0LmRvbUtleSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgc2VsZi52aXJ0dWFsW3N0YXRlLmRhdGFzZXQuZG9tS2V5XTsvL2RlbGV0ZSB0aGUgZWxlbWVudCBmcm9tIHZpcnR1YWwgZG9tXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBzdGF0ZS5yZW1vdmUoKTsvL3JlbW92ZSB0aGUgZWxlbWVudCBmcm9tIGRvbVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKGBkYXRhLSR7cGFyYW1zLm5hbWV9YCk7Ly9yZW1vdmUgdGhlIHN0YXRlIGZyb20gZWxlbWVudFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9HZXQgYW4gZWxlbWVudCdzIHN0YXRlIFxyXG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLmdldFN0YXRlID0gZnVuY3Rpb24gKHBhcmFtcyA9IHsgbmFtZTogJycgfSkge1xyXG4gICAgICAgICAgICBsZXQgc3RhdGUgPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQgc3RhdGVOYW1lO1xyXG5cclxuICAgICAgICAgICAgLy9nZXQgdGhlIHN0YXRlIG5hbWVcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBwYXJhbXMgPT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgIHN0YXRlTmFtZSA9IHBhcmFtcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChzZWxmLmlzc2V0KHRoaXMuZGF0YXNldFtgJHtwYXJhbXMubmFtZX1gXSkpIHtcclxuICAgICAgICAgICAgICAgIHN0YXRlTmFtZSA9IHBhcmFtcy5uYW1lO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoc2VsZi5pc3NldChzdGF0ZU5hbWUpKSB7Ly9nZXQgdGhlIHN0YXRlXHJcbiAgICAgICAgICAgICAgICBzdGF0ZSA9IHNlbGYudmlydHVhbFt0aGlzLmRhdGFzZXRbc3RhdGVOYW1lXV07XHJcbiAgICAgICAgICAgICAgICAvLyBsZXQgc3RhdGUgPSBzZWxmLm9iamVjdFRvQXJyYXkodGhpcy5zdGF0ZXNbc3RhdGVOYW1lXSkucG9wKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvL2FkZCBhIHN0YXRlIHRvIGFuIGVsZW1lbnRcclxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS5hZGRTdGF0ZSA9IGZ1bmN0aW9uIChwYXJhbXMgPSB7IG5hbWU6ICcnIH0pIHtcclxuICAgICAgICAgICAgLy9tYWtlIHN1cmUgdGhlIHN0YXRlIGhhcyBhIGRvbWtleVxyXG4gICAgICAgICAgICBpZiAoIXNlbGYuaXNzZXQocGFyYW1zLnN0YXRlLmRhdGFzZXQuZG9tS2V5KSkge1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zLnN0YXRlLnNldEtleSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL2FkZCB0aGUgc3RhdGUgdG8gdGhlIGVsZW1lbnRzIGRhdGFzZXRcclxuICAgICAgICAgICAgdGhpcy5kYXRhc2V0W3BhcmFtcy5uYW1lXSA9IHBhcmFtcy5zdGF0ZS5kYXRhc2V0LmRvbUtleTtcclxuICAgICAgICAgICAgdGhpcy5zdGF0ZXNbcGFyYW1zLm5hbWVdID0ge30vL2luaXRpYWxpemUgdGhlIHN0YXRlXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vc2V0IHRoZSBzdGF0ZSBvZiBhbiBlbGVtZW50XHJcbiAgICAgICAgRWxlbWVudC5wcm90b3R5cGUuc2V0U3RhdGUgPSBmdW5jdGlvbiAocGFyYW1zID0geyBuYW1lOiAnJywgYXR0cmlidXRlczoge30sIHJlbmRlcjoge30sIGNoaWxkcmVuOiBbXSwgdGV4dDogJycsIGh0bWw6ICcnLCB2YWx1ZTogJycsIG9wdGlvbnM6IFtdIH0pIHtcclxuICAgICAgICAgICAgbGV0IHN0YXRlID0gdGhpcy5nZXRTdGF0ZShwYXJhbXMpO1xyXG5cclxuICAgICAgICAgICAgLy8gbGV0IGZvdW5kID0gdGhpcy5zdGF0ZXNbcGFyYW1zLm5hbWVdW0pTT04uc3RyaW5naWZ5KHBhcmFtcyldO1xyXG4gICAgICAgICAgICAvLyBpZiAoc2VsZi5pc3NldChmb3VuZCkpIHtcclxuICAgICAgICAgICAgLy8gICAgIHN0YXRlLmlubmVySFRNTCA9IGZvdW5kLmlubmVySFRNTDtcclxuICAgICAgICAgICAgLy8gICAgIHN0YXRlLnNldEF0dHJpYnV0ZXMoZm91bmQuZ2V0QXR0cmlidXRlcygpKTtcclxuICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICAvLyBlbHNlIHtcclxuICAgICAgICAgICAgLy8gICAgIHN0YXRlLnNldEF0dHJpYnV0ZXMocGFyYW1zLmF0dHJpYnV0ZXMpO1xyXG4gICAgICAgICAgICAvLyAgICAgaWYgKHNlbGYuaXNzZXQocGFyYW1zLmNoaWxkcmVuKSkgey8vYWRkIHRoZSBjaGlsZHJlbiBpZiBzZXRcclxuICAgICAgICAgICAgLy8gICAgICAgICBzdGF0ZS5tYWtlRWxlbWVudChwYXJhbXMuY2hpbGRyZW4pO1xyXG4gICAgICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgICAgICAvLyAgICAgaWYgKHNlbGYuaXNzZXQocGFyYW1zLnJlbmRlcikpIHsvL2FkZCB0aGUgY2hpbGRyZW4gaWYgc2V0XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgc3RhdGUucmVuZGVyKHBhcmFtcy5yZW5kZXIpO1xyXG4gICAgICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgICAgICAvLyAgICAgaWYgKHNlbGYuaXNzZXQocGFyYW1zLnRleHQpKSBzdGF0ZS50ZXh0Q29udGVudCA9IHBhcmFtcy50ZXh0Oy8vc2V0IHRoZSBpbm5lclRleHRcclxuICAgICAgICAgICAgLy8gICAgIGlmIChzZWxmLmlzc2V0KHBhcmFtcy52YWx1ZSkpIHN0YXRlLnZhbHVlID0gcGFyYW1zLnZhbHVlOy8vc2V0IHRoZSB2YWx1ZVxyXG4gICAgICAgICAgICAvLyAgICAgaWYgKHNlbGYuaXNzZXQocGFyYW1zLm9wdGlvbnMpKSB7Ly9hZGQgb3B0aW9ucyBpZiBpc3NldFxyXG4gICAgICAgICAgICAvLyAgICAgICAgIGZvciAodmFyIGkgb2YgcGFyYW1zLm9wdGlvbnMpIHtcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgc3RhdGUubWFrZUVsZW1lbnQoeyBlbGVtZW50OiAnb3B0aW9uJywgdmFsdWU6IGksIHRleHQ6IGksIGF0dGFjaG1lbnQ6ICdhcHBlbmQnIH0pO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vICAgICB0aGlzLnN0YXRlc1twYXJhbXMubmFtZV1bSlNPTi5zdHJpbmdpZnkocGFyYW1zKV0gPSBzdGF0ZS5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICAgICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgICAgIHN0YXRlLnNldEF0dHJpYnV0ZXMocGFyYW1zLmF0dHJpYnV0ZXMpO1xyXG4gICAgICAgICAgICBpZiAoc2VsZi5pc3NldChwYXJhbXMuY2hpbGRyZW4pKSB7Ly9hZGQgdGhlIGNoaWxkcmVuIGlmIHNldFxyXG4gICAgICAgICAgICAgICAgc3RhdGUubWFrZUVsZW1lbnQocGFyYW1zLmNoaWxkcmVuKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoc2VsZi5pc3NldChwYXJhbXMucmVuZGVyKSkgey8vYWRkIHRoZSBjaGlsZHJlbiBpZiBzZXRcclxuICAgICAgICAgICAgICAgIHN0YXRlLnJlbmRlcihwYXJhbXMucmVuZGVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoc2VsZi5pc3NldChwYXJhbXMudGV4dCkpIHN0YXRlLnRleHRDb250ZW50ID0gcGFyYW1zLnRleHQ7Ly9zZXQgdGhlIGlubmVyVGV4dFxyXG4gICAgICAgICAgICBpZiAoc2VsZi5pc3NldChwYXJhbXMuaHRtbCkpIHN0YXRlLmlubmVySFRNTCA9IHBhcmFtcy5odG1sOy8vc2V0IHRoZSBpbm5lclRleHRcclxuICAgICAgICAgICAgaWYgKHNlbGYuaXNzZXQocGFyYW1zLnZhbHVlKSkgc3RhdGUudmFsdWUgPSBwYXJhbXMudmFsdWU7Ly9zZXQgdGhlIHZhbHVlXHJcbiAgICAgICAgICAgIGlmIChzZWxmLmlzc2V0KHBhcmFtcy5vcHRpb25zKSkgey8vYWRkIG9wdGlvbnMgaWYgaXNzZXRcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgb2YgcGFyYW1zLm9wdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5tYWtlRWxlbWVudCh7IGVsZW1lbnQ6ICdvcHRpb24nLCB2YWx1ZTogaSwgdGV4dDogaSwgYXR0YWNobWVudDogJ2FwcGVuZCcgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGVzW3BhcmFtcy5uYW1lXVtKU09OLnN0cmluZ2lmeShwYXJhbXMpXSA9IHN0YXRlLmNsb25lTm9kZSh0cnVlKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvL2FzeW5jIHZlcnNpb24gb2Ygc2V0c3RhdGVcclxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS5zZXRLZXlBc3luYyA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuc2V0S2V5KCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy9zZXQgZWxlbWVudCdzIGRvbSBrZXkgZm9yIHRoZSB2aXJ0dWFsIGRvbVxyXG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLnNldEtleSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbGV0IGtleSA9IERhdGUubm93KCkudG9TdHJpbmcoMzYpICsgTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc2xpY2UoMik7Ly9nZW5lcmF0ZSB0aGUga2V5XHJcbiAgICAgICAgICAgIGlmICghc2VsZi5pc3NldCh0aGlzLmRhdGFzZXQuZG9tS2V5KSkgey8vZG9lcyB0aGlzIGVsZW1lbnQgaGF2ZSBhIGtleVxyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhc2V0LmRvbUtleSA9IGtleTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGtleSA9IHRoaXMuZGF0YXNldC5kb21LZXk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2VsZi52aXJ0dWFsW2tleV0gPSB0aGlzOy8vYWRkIGl0IHRvIHRoZSB2aXJ0dWFsIGRvbVxyXG4gICAgICAgICAgICByZXR1cm4ga2V5O1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vZHJvcCBkb3duIGEgY2hpbGRcclxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS5kcm9wRG93biA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIGxldCBwYXJlbnRDb250ZW50ID0gdGhpcy5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuaW5uZXJIVE1MID0gJyc7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwZW5kKHBhcmVudENvbnRlbnQpO1xyXG4gICAgICAgICAgICBwYXJlbnRDb250ZW50LmNzcyh7IGJveFNoYWRvdzogJzFweCAxcHggMXB4IDFweCAjYWFhYWFhJyB9KTtcclxuICAgICAgICAgICAgdGhpcy5jc3MoeyBib3hTaGFkb3c6ICcwLjVweCAwLjVweCAwLjVweCAwLjVweCAjY2NjY2NjJyB9KTtcclxuXHJcbiAgICAgICAgICAgIGxldCBkcm9wQ29udGFpbmVyID0gdGhpcy5tYWtlRWxlbWVudCh7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50OiAnZGl2JywgYXR0cmlidXRlczogeyBjbGFzczogJ2Ryb3AtZG93bicgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZHJvcENvbnRhaW5lci5hcHBlbmQoZWxlbWVudCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZURyb3BEb3duID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZHJvcENvbnRhaW5lci5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgIHBhcmVudENvbnRlbnQuY3NzKHsgYm94U2hhZG93OiAndW5zZXQnIH0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbm5lckhUTUwgPSBwYXJlbnRDb250ZW50LmlubmVySFRNTDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy9zdG9wIG1vbml0b3JpbmcgdGhpcyBlbGVtZW50IGZvciBjaGFuZ2VzXHJcbiAgICAgICAgRWxlbWVudC5wcm90b3R5cGUuc3RvcE1vbml0b3IgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9ic2VydmUpIHRoaXMub2JzZXJ2ZXIuZGlzY29ubmVjdCgpOy8vZGlzY29ubmVjdCBvYnNlcnZlclxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vQ2hlY2sgaWYgYW4gYXR0cmlidXRlIGhhcyBjaGFuZ2VkIGluIHRoaXMgZWxlbWVudFxyXG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLm9uQXR0cmlidXRlQ2hhbmdlID0gZnVuY3Rpb24gKGF0dHJpYnV0ZSA9ICcnLCBjYWxsYmFjayA9ICgpID0+IHsgfSkge1xyXG4gICAgICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ2F0dHJpYnV0ZXNDaGFuZ2VkJywgZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LmRldGFpbC5hdHRyaWJ1dGVOYW1lID09IGF0dHJpYnV0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBtb25pdG9yIHRoaXMgZWxlbWVudCBmb3IgY2hhbmdlc1xyXG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLm1vbml0b3IgPSBmdW5jdGlvbiAoY29uZmlnID0geyBhdHRyaWJ1dGVzOiB0cnVlLCBjaGlsZExpc3Q6IHRydWUsIHN1YnRyZWU6IHRydWUgfSkge1xyXG4gICAgICAgICAgICB0aGlzLm9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKG11dGF0aW9uTGlzdCwgb2JzZXJ2ZXIpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChtdXRhdGlvbkxpc3QubGVuZ3RoKSB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdtdXRhdGVkJykpOy8vZmlyZSBtdXRhdGVkIGV2ZW50IGZvciBpdFxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgbXV0YXRpb24gb2YgbXV0YXRpb25MaXN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG11dGF0aW9uLnR5cGUgPT0gJ2NoaWxkTGlzdCcpIHsvL2lmIHRoZSBjaGFuZ2Ugd2FzIGEgY2hpbGQgZmlyZSBjaGlsZGxpc3RjaGFuZ2VkIGV2ZW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2NoaWxkTGlzdGNoYW5nZWQnLCB7IGRldGFpbDogbXV0YXRpb24gfSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChtdXRhdGlvbi50eXBlID09ICdhdHRyaWJ1dGVzJykgey8vaWYgdGhlIGNoYW5nZSB3YXMgYSBjaGlsZCBmaXJlIGNoaWxkbGlzdGNoYW5nZWQgZXZlbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnYXR0cmlidXRlc0NoYW5nZWQnLCB7IGRldGFpbDogbXV0YXRpb24gfSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChtdXRhdGlvbi50eXBlID09ICdjaGFyYWN0ZXJEYXRhJykgey8vaWYgdGhlIGNoYW5nZSB3YXMgYSBjaGlsZCBmaXJlIGNoaWxkbGlzdGNoYW5nZWQgZXZlbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnY2hhcmFjdGVyRGF0YUNoYW5nZWQnLCB7IGRldGFpbDogbXV0YXRpb24gfSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLm9ic2VydmVyLm9ic2VydmUodGhpcywgY29uZmlnKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZVsnY2hlY2tDaGFuZ2VzJ10gPSBmdW5jdGlvbiAoY2FsbGJhY2sgPSAoKSA9PiB7IH0pIHtcclxuICAgICAgICAgICAgdGhpcy5tb25pdG9yKCk7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignbXV0YXRlZCcsIGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGV2ZW50KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gY2hlY2sgd2hlbiB0aGUgdmFsdWUgb2YgYW4gZWxlbWVudCBpcyBjaGFuZ2VkXHJcbiAgICAgICAgRWxlbWVudC5wcm90b3R5cGUub25DaGFuZ2VkID0gZnVuY3Rpb24gKGNhbGxCYWNrID0gKCkgPT4geyB9KSB7XHJcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IHRoaXMuZ2V0QXR0cmlidXRlKCd2YWx1ZScpO1xyXG4gICAgICAgICAgICBsZXQgdXBkYXRlTWUgPSAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIGlmIGVsZW1lbnQgaXMgaW5wdXQgZWxlbWVudFxyXG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LnRhcmdldC5ub2RlTmFtZSA9PSAnSU5QVVQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50LnRhcmdldC50eXBlID09ICdkYXRlJykgey8vIGlmIHRoZSB0eXBlIGlzIGRhdGUsIGNoZWNrIGlmIHRoZSBkYXRlIGlzIHZhbGlkIHRoZW4gdXBkYXRlIHRoZSBhdHRyaWJ1dGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNEYXRlKHRoaXMudmFsdWUpKSB0aGlzLnNldEF0dHJpYnV0ZSgndmFsdWUnLCB0aGlzLnZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoZXZlbnQudGFyZ2V0LnR5cGUgPT0gJ3RpbWUnKSB7Ly8gaWYgdGhlIHR5cGUgaXMgdGltZSwgY2hlY2sgaWYgdGhlIHRpbWUgaXMgdmFsaWQgdGhlbiB1cGRhdGUgdGhlIGF0dHJpYnV0ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1RpbWVWYWxpZCh0aGlzLnZhbHVlKSkgdGhpcy5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgdGhpcy52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGV2ZW50LnRhcmdldC50eXBlID09ICdmaWxlJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZmlsZU5hbWUgPSBldmVudC50YXJnZXQudmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmaWxlID0gZXZlbnQudGFyZ2V0LmZpbGVzWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZmlsZS50eXBlLmluZGV4T2YoJ2ltYWdlJykgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5pbWFnZVRvSnNvbihmaWxlLCBjYWxsQmFjayk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCd2YWx1ZScsIHRoaXMudmFsdWUpOy8vdXBkYXRlIHRoZSBhdHRyaWJ1dGVcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChldmVudC50YXJnZXQubm9kZU5hbWUgPT0gJ1NFTEVDVCcpIHsvLyBpZiB0aGUgZWxlbWVudCBpcyBzZWxlY3RcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGV2ZW50LnRhcmdldC5vcHRpb25zLmxlbmd0aDsgaSsrKSB7Ly91cGRhdGUgdGhlIHNlbGVjdGVkIG9wdGlvbiB1c2luZyB0aGUgc2VsZWN0ZWQgaW5kZXhcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkgPT0gZXZlbnQudGFyZ2V0LnNlbGVjdGVkSW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnRhcmdldC5vcHRpb25zW2ldLnNldEF0dHJpYnV0ZSgnc2VsZWN0ZWQnLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnRhcmdldC5vcHRpb25zW2ldLnJlbW92ZUF0dHJpYnV0ZSgnc2VsZWN0ZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGV2ZW50LnRhcmdldC5ub2RlTmFtZSA9PSAnREFUQS1FTEVNRU5UJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCd2YWx1ZScsIHRoaXMudmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoZXZlbnQudGFyZ2V0Lm5vZGVOYW1lID09ICdTRUxFQ1QtRUxFTUVOVCcpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZSgndmFsdWUnLCB0aGlzLnZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLnRleHRDb250ZW50O1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChzZWxmLmlzc2V0KGNhbGxCYWNrKSAmJiBldmVudC50YXJnZXQudHlwZSAhPSAnZmlsZScpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsQmFjayh0aGlzLnZhbHVlLCBldmVudCk7Ly9maXJlIHRoZSBjYWxsYmFjayBmdW5jdGlvblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgLy8gaWYgY2hhbmdlIGlzIGNhdXNlZCBieSBrZXlib2FyZFxyXG4gICAgICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB1cGRhdGVNZShldmVudCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gaWYgY2hhbmdlIGlzIGNhdXNlZCBwcm9ncmFtYXRpY2FsbHlcclxuICAgICAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIHVwZGF0ZU1lKGV2ZW50KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy9yZW5kZXIgdGhlIGNvbnRlbnRzIG9mIGFuIGVsZW1lbnRcclxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAocGFyYW1zID0geyBlbGVtZW50OiAnJywgYXR0cmlidXRlczoge30gfSwgZXhjZXB0KSB7XHJcbiAgICAgICAgICAgIGlmIChzZWxmLmlzc2V0KGV4Y2VwdCkpIHRoaXMucmVtb3ZlQ2hpbGRyZW4oZXhjZXB0KTsvL3JlbW92ZSB0aGUgY29udGVudHMgb2YgdGhlIGVsZW1lbnQgd2l0aCBleGNlcHRpb25zXHJcbiAgICAgICAgICAgIGVsc2UgdGhpcy5yZW1vdmVDaGlsZHJlbigpO1xyXG4gICAgICAgICAgICB0aGlzLm1ha2VFbGVtZW50KHBhcmFtcyk7Ly9hcHBlbmQgdGhlIG5ldyBjb250ZW50cyBvZiB0aGUgZWxlbWVudFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9HZXQgYWxsIHRoZSBzdHlsZXMgZm9yIHRoZSBJRCwgdGhlIGNsYXNzZXMgYW5kIHRoZSBlbGVtZW50XHJcbiAgICAgICAgRWxlbWVudC5wcm90b3R5cGUuZ2V0QWxsQ3NzUHJvcGVydGllcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbGV0IHN0eWxlU2hlZXRzID0gQXJyYXkuZnJvbShkb2N1bWVudC5zdHlsZVNoZWV0cyksLy9nZXQgYWxsIHRoZSBjc3Mgc3R5bGVzIGZpbGVzIGFuZCBydWxlc1xyXG4gICAgICAgICAgICAgICAgY3NzUnVsZXMsXHJcbiAgICAgICAgICAgICAgICBpZCA9IHRoaXMuaWQsXHJcbiAgICAgICAgICAgICAgICBub2RlTmFtZSA9IHRoaXMubm9kZU5hbWUsXHJcbiAgICAgICAgICAgICAgICBjbGFzc0xpc3QgPSBBcnJheS5mcm9tKHRoaXMuY2xhc3NMaXN0KSxcclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgPSB7fSxcclxuICAgICAgICAgICAgICAgIHNlbGVjdG9yVGV4dDtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gY2xhc3NMaXN0KSBjbGFzc0xpc3RbaV0gPSBgLiR7Y2xhc3NMaXN0W2ldfWA7Ly90dXJuIGVhY2ggY2xhc3MgdG8gY3NzIGNsYXNzIGZvcm1hdCBbLmNsYXNzXVxyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZVNoZWV0cy5sZW5ndGg7IGkrKykgey8vbG9vcCB0aHJvdWdoIGFsbCB0aGUgY3NzIHJ1bGVzIGluIGRvY3VtZW50L2FwcFxyXG4gICAgICAgICAgICAgICAgY3NzUnVsZXMgPSBzdHlsZVNoZWV0c1tpXS5jc3NSdWxlcztcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgY3NzUnVsZXMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxlY3RvclRleHQgPSBjc3NSdWxlc1tqXS5zZWxlY3RvclRleHQ7IC8vZm9yIGVhY2ggc2VsZWN0b3IgdGV4dCBjaGVjayBpZiBlbGVtZW50IGhhcyBpdCBhcyBhIGNzcyBwcm9wZXJ0eVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxlY3RvclRleHQgPT0gYCMke2lkfWAgfHwgc2VsZWN0b3JUZXh0ID09IG5vZGVOYW1lIHx8IGNsYXNzTGlzdC5pbmRleE9mKHNlbGVjdG9yVGV4dCkgIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllc1tzZWxlY3RvclRleHRdID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzdHlsZSA9IGNzc1J1bGVzW2pdLnN0eWxlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBuIGluIHN0eWxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3R5bGVbbl0gIT09ICcnKSBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllc1tzZWxlY3RvclRleHRdW25dID0gc3R5bGVbbl1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9pZiBlbGVtZW50IGhhcyBwcm9wZXJ0eSBhZGQgaXQgdG8gY3NzIHByb3BlcnR5XHJcbiAgICAgICAgICAgIHByb3BlcnRpZXNbJ3N0eWxlJ10gPSB0aGlzLmNzcygpO1xyXG4gICAgICAgICAgICByZXR1cm4gcHJvcGVydGllcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vR2V0IHRoZSB2YWx1ZXMgb2YgcHJvcGVydHkgXHJcbiAgICAgICAgRWxlbWVudC5wcm90b3R5cGUuZ2V0Q3NzUHJvcGVydGllcyA9IGZ1bmN0aW9uIChwcm9wZXJ0eSA9ICcnKSB7XHJcbiAgICAgICAgICAgIGxldCBhbGxQcm9wZXJ0aWVzID0gdGhpcy5nZXRBbGxDc3NQcm9wZXJ0aWVzKCk7XHJcbiAgICAgICAgICAgIGxldCBwcm9wZXJ0aWVzID0ge307XHJcbiAgICAgICAgICAgIGZvciAobGV0IG5hbWUgaW4gYWxsUHJvcGVydGllcykge1xyXG4gICAgICAgICAgICAgICAgcHJvcGVydGllc1tuYW1lXSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgcCBpbiBhbGxQcm9wZXJ0aWVzW25hbWVdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5ID09IHApIHByb3BlcnRpZXNbbmFtZV1bcF0gPSBhbGxQcm9wZXJ0aWVzW25hbWVdW3BdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcHJvcGVydGllcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIENoZWNrIGlmIHRoaXMgZWxlbWVudCBoYXMgdGhpcyBwcm9wZXJ0eVxyXG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLmhhc0Nzc1Byb3BlcnR5ID0gZnVuY3Rpb24gKHByb3BlcnR5ID0gJycpIHtcclxuICAgICAgICAgICAgdmFyIHByb3BlcnRpZXMgPSB0aGlzLmdldENzc1Byb3BlcnRpZXMocHJvcGVydHkpOyAvL2dldCBlbGVtZW50cyBjc3MgcHJvcGVydGllc1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIHByb3BlcnRpZXMpIHsvL2xvb3AgdGhyb3VnaCBqc29uIG9iamVjdFxyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuaXNzZXQocHJvcGVydGllc1tpXSkgJiYgcHJvcGVydGllc1tpXSAhPSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlOy8vIGlmIHByb3BlcnR5IGlzIGZvdW5kIHJldHVybiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9HZXQgdGhlIG1vc3QgcmVsYXZhbnQgdmFsdWUgZm9yIHRoZSBwcm9wZXJ0eVxyXG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLmNzc1Byb3BlcnR5VmFsdWUgPSBmdW5jdGlvbiAocHJvcGVydHkgPSAnJykge1xyXG4gICAgICAgICAgICAvL2NoZWNrIGZvciB0aGUgdmFsdWUgb2YgYSBwcm9wZXJ0eSBvZiBhbiBlbGVtZW50XHJcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0aWVzID0gdGhpcy5nZXRDc3NQcm9wZXJ0aWVzKHByb3BlcnR5KSxcclxuICAgICAgICAgICAgICAgIGlkID0gdGhpcy5pZCxcclxuICAgICAgICAgICAgICAgIGNsYXNzTGlzdCA9IEFycmF5LmZyb20odGhpcy5jbGFzc0xpc3QpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHNlbGYuaXNzZXQocHJvcGVydGllc1snc3R5bGUnXSkgJiYgcHJvcGVydGllc1snc3R5bGUnXSAhPSAnJykgcmV0dXJuIHByb3BlcnRpZXNbJ3N0eWxlJ107Ly9jaGVjayBpZiBzdHlsZSBydWxlIGhhcyB0aGUgcHJvcGVydCBhbmQgcmV0dXJuIGl0J3MgdmFsdWVcclxuICAgICAgICAgICAgaWYgKHNlbGYuaXNzZXQoaWQpICYmIHNlbGYuaXNzZXQocHJvcGVydGllc1tgIyR7aWR9YF0pICYmIHByb3BlcnRpZXNbYCMke2lkfWBdICE9ICcnKSByZXR1cm4gcHJvcGVydGllc1tgIyR7aWR9YF07Ly9jaGVjayBpZiBlbGVtZW50IGlkIHJ1bGUgaGFzIHRoZSBwcm9wZXJ0IGFuZCByZXR1cm4gaXQncyB2YWx1ZVxyXG4gICAgICAgICAgICBmb3IgKHZhciBpIG9mIGNsYXNzTGlzdCkgey8vY2hlY2sgaWYgYW55IGNsYXNzIHJ1bGUgaGFzIHRoZSBwcm9wZXJ0IGFuZCByZXR1cm4gaXQncyB2YWx1ZVxyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuaXNzZXQocHJvcGVydGllc1tgLiR7aX1gXSkgJiYgcHJvcGVydGllc1tgLiR7aX1gXSAhPSAnJykgcmV0dXJuIHByb3BlcnRpZXNbYC4ke2l9YF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy9jaGVjayBpZiBub2RlIHJ1bGUgaGFzIHRoZSBwcm9wZXJ0IGFuZCByZXR1cm4gaXQncyB2YWx1ZVxyXG4gICAgICAgICAgICBpZiAoc2VsZi5pc3NldChwcm9wZXJ0aWVzW3RoaXMubm9kZU5hbWVdKSAmJiBwcm9wZXJ0aWVzW3RoaXMubm9kZU5hbWVdICE9ICcnKSByZXR1cm4gcHJvcGVydGllc1t0aGlzLm5vZGVOYW1lXTtcclxuICAgICAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gR2V0IGFuZCBTZXQgdGhlIGNzcyB2YWx1ZXNcclxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS5jc3MgPSBmdW5jdGlvbiAoc3R5bGVzID0ge30pIHtcclxuICAgICAgICAgICAgLy8gc2V0IGNzcyBzdHlsZSBvZiBlbGVtZW50IHVzaW5nIGpzb25cclxuICAgICAgICAgICAgaWYgKHNlbGYuaXNzZXQoc3R5bGVzKSkge1xyXG4gICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoc3R5bGVzKS5tYXAoKGtleSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3R5bGVba2V5XSA9IHN0eWxlc1trZXldO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzZWxmLmV4dHJhY3RDU1ModGhpcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBSZW1vdmUgYSBjc3MgcHJvcGVydHlcclxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS5jc3NSZW1vdmUgPSBmdW5jdGlvbiAoc3R5bGVzID0gW10pIHtcclxuICAgICAgICAgICAgLy9yZW1vdmUgYSBncm91cCBvZiBwcm9wZXJ0aWVzIGZyb20gZWxlbWVudHMgc3R5bGVcclxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoc3R5bGVzKSkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBvZiBzdHlsZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0eWxlLnJlbW92ZVByb3BlcnR5KGkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdHlsZS5yZW1vdmVQcm9wZXJ0eShzdHlsZXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNzcygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gVG9nZ2xlIGEgY2hpbGQgZWxlbWVudFxyXG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLnRvZ2dsZUNoaWxkID0gZnVuY3Rpb24gKGNoaWxkKSB7XHJcbiAgICAgICAgICAgIC8vQWRkIGNoaWxkIGlmIGVsZW1lbnQgZG9lcyBub3QgaGF2ZSBhIGNoaWxkIGVsc2UgcmVtb3ZlIHRoZSBjaGlsZCBmb3JtIHRoZSBlbGVtZW50XHJcbiAgICAgICAgICAgIHZhciBuYW1lLCBfY2xhc3NlcywgaWQsIGZvdW5kID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2gobm9kZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lID0gbm9kZS5ub2RlTmFtZTtcclxuICAgICAgICAgICAgICAgIF9jbGFzc2VzID0gbm9kZS5jbGFzc0xpc3Q7XHJcbiAgICAgICAgICAgICAgICBpZCA9IG5vZGUuaWQ7XHJcbiAgICAgICAgICAgICAgICBpZiAobmFtZSA9PSBjaGlsZC5ub2RlTmFtZSAmJiBpZCA9PSBjaGlsZC5pZCAmJiBfY2xhc3Nlcy50b1N0cmluZygpID09IGNoaWxkLmNsYXNzTGlzdC50b1N0cmluZygpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpZiAoIWZvdW5kKSB0aGlzLmFwcGVuZChjaGlsZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL3JlbW92ZSBhbGwgY2xhc3NlcyBleGNlcHQgc29tZVxyXG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLmNsZWFyQ2xhc3NlcyA9IGZ1bmN0aW9uIChleGNlcHQgPSAnJykge1xyXG4gICAgICAgICAgICBleGNlcHQgPSBleGNlcHQuc3BsaXQoJywnKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiBpbiBleGNlcHQpIHtcclxuICAgICAgICAgICAgICAgIGV4Y2VwdFtqXSA9IGV4Y2VwdFtqXS50cmltKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZm9yIChsZXQgaSBvZiB0aGlzLmNsYXNzTGlzdCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuaXNzZXQoZXhjZXB0KSAmJiBleGNlcHQuaW5jbHVkZXMoaSkpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKGkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy9yZW1vdmUgY2xhc3Nlc1xyXG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLnJlbW92ZUNsYXNzZXMgPSBmdW5jdGlvbiAoY2xhc3NlcyA9ICcnKSB7XHJcbiAgICAgICAgICAgIGNsYXNzZXMgPSBjbGFzc2VzLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgb2YgY2xhc3Nlcykge1xyXG4gICAgICAgICAgICAgICAgaSA9IGkudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGkgIT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoaSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvL2FkZCBjbGFzc2VzXHJcbiAgICAgICAgRWxlbWVudC5wcm90b3R5cGUuYWRkQ2xhc3NlcyA9IGZ1bmN0aW9uIChjbGFzc2VzID0gJycpIHtcclxuICAgICAgICAgICAgY2xhc3NlcyA9IGNsYXNzZXMuc3BsaXQoJywnKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSBvZiBjbGFzc2VzKSB7XHJcbiAgICAgICAgICAgICAgICBpID0gaS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSAhPSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZChpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vdG9nZ2xlIGNsYXNzZXNcclxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS50b2dnbGVDbGFzc2VzID0gZnVuY3Rpb24gKGNsYXNzZXMgPSAnJykge1xyXG4gICAgICAgICAgICBjbGFzc2VzID0gY2xhc3Nlcy5zcGxpdCgnLCcpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpIG9mIGNsYXNzZXMpIHtcclxuICAgICAgICAgICAgICAgIGkgPSBpLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgIGlmIChpICE9ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGFzc0xpc3QudG9nZ2xlKGkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gUmVtb3ZlIGEgY2xhc3MgZnJvbSBlbGVtZW50IGNsYXNzbGlzdFxyXG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLnJlbW92ZUNsYXNzID0gZnVuY3Rpb24gKF9jbGFzcyA9ICcnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LnJlbW92ZShfY2xhc3MpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIENoZWNrIGlmIGVsZW1lbnQgY2xhc3NsaXN0IGNvbnRhaW5zIGEgZ3JvdXAgb2YgY2xhc3Nlc1xyXG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLmhhc0NsYXNzZXMgPSBmdW5jdGlvbiAoY2xhc3NMaXN0ID0gW10pIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgbUNsYXNzIG9mIGNsYXNzTGlzdCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmNsYXNzTGlzdC5jb250YWlucyhtQ2xhc3MpKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBhZGQgYSBjbGFzcyB0byBlbGVtZW50IGNsYXNzbGlzdFxyXG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLmFkZENsYXNzID0gZnVuY3Rpb24gKF9jbGFzcyA9ICcnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZChfY2xhc3MpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHRvZ2dsZSBhIGNsYXNzIGluIGVsZW1lbnQgY2xhc3NsaXN0XHJcbiAgICAgICAgRWxlbWVudC5wcm90b3R5cGUudG9nZ2xlQ2xhc3MgPSBmdW5jdGlvbiAoX2NsYXNzID0gJycpIHtcclxuICAgICAgICAgICAgLy8gKHRoaXMuY2xhc3NMaXN0LmNvbnRhaW5zKF9jbGFzcykpID8gdGhpcy5jbGFzc0xpc3QucmVtb3ZlKF9jbGFzcykgOiB0aGlzLmNsYXNzTGlzdC5hZGQoX2NsYXNzKTtcclxuICAgICAgICAgICAgdGhpcy5jbGFzc0xpc3QudG9nZ2xlKF9jbGFzcyk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9HZXQgdGhlIHBvc2l0aW9uIG9mIGVsZW1lbnQgaW4gZG9tXHJcbiAgICAgICAgRWxlbWVudC5wcm90b3R5cGUucG9zaXRpb24gPSBmdW5jdGlvbiAocGFyYW1zID0ge30pIHtcclxuICAgICAgICAgICAgaWYgKHNlbGYuaXNzZXQocGFyYW1zKSkge1xyXG4gICAgICAgICAgICAgICAgT2JqZWN0LmtleXMocGFyYW1zKS5tYXAoa2V5ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBwYXJhbXNba2V5XSA9IChuZXcgU3RyaW5nKHBhcmFtc1trZXldKS5zbGljZShwYXJhbXNba2V5XS5sZW5ndGggLSAyKSA9PSAncHgnKSA/IHBhcmFtc1trZXldIDogYCR7cGFyYW1zW2tleV19cHhgO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNzcyhwYXJhbXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBwb3NpdGlvbiA9IHRoaXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcG9zaXRpb247XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL2NoZWNrIGlmIGVsZW1lbnQgaXMgd2l0aGluIGNvbnRhaW5lclxyXG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLmluVmlldyA9IGZ1bmN0aW9uIChwYXJlbnRJZGVudGlmaWVyID0gJycpIHtcclxuICAgICAgICAgICAgbGV0IHBhcmVudCA9IHRoaXMuZ2V0UGFyZW50cyhwYXJlbnRJZGVudGlmaWVyKTtcclxuICAgICAgICAgICAgbGV0IHRvcCA9IHRoaXMucG9zaXRpb24oKS50b3A7XHJcbiAgICAgICAgICAgIGxldCBmbGFnID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXNlbGYuaXNudWxsKHBhcmVudCkpIHtcclxuICAgICAgICAgICAgICAgIGZsYWcgPSB0b3AgPj0gMCAmJiB0b3AgPD0gcGFyZW50LmNsaWVudEhlaWdodDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmxhZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vQ2hlY2sgaWYgYSBjbGFzcyBleGlzdHMgaW4gZWxlbWVudCdzIGNsYXNzbGlzdFxyXG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLmhhc0NsYXNzID0gZnVuY3Rpb24gKF9jbGFzcyA9ICcnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNsYXNzTGlzdC5jb250YWlucyhfY2xhc3MpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gU2V0IGEgbGlzdCBvZiBwcm9wZXJ0aWVzIGZvciBhbiBlbGVtZW50XHJcbiAgICAgICAgRWxlbWVudC5wcm90b3R5cGUuc2V0UHJvcGVydGllcyA9IGZ1bmN0aW9uIChwcm9wZXJ0aWVzID0ge30pIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSBpbiBwcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzW2ldID0gcHJvcGVydGllc1tpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIFNldCBhIGxpc3Qgb2YgYXR0cmlidXRlcyBmb3IgYW4gZWxlbWVudFxyXG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLnNldEF0dHJpYnV0ZXMgPSBmdW5jdGlvbiAoYXR0cmlidXRlcyA9IHt9KSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgaW4gYXR0cmlidXRlcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGkgPT0gJ3N0eWxlJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3NzKGF0dHJpYnV0ZXNbaV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoaSwgYXR0cmlidXRlc1tpXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBHZXQgdGhlIHZhbHVlcyBvZiBhIGxpc3Qgb2YgYXR0cmlidXRlc1xyXG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLmdldEF0dHJpYnV0ZXMgPSBmdW5jdGlvbiAobmFtZXMgPSBbXSkge1xyXG4gICAgICAgICAgICBpZiAobmFtZXMubGVuZ3RoID09IDApIG5hbWVzID0gdGhpcy5nZXRBdHRyaWJ1dGVOYW1lcygpO1xyXG4gICAgICAgICAgICBsZXQgYXR0cmlidXRlcyA9IHt9O1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgbmFtZSBvZiBuYW1lcykge1xyXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlc1tuYW1lXSA9IHRoaXMuZ2V0QXR0cmlidXRlKG5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBhdHRyaWJ1dGVzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9DcmVhdGUgYW5kIGF0dGF0Y2ggYW4gZWxlbWVudCBpbiBhbiBlbGVtZW50XHJcbiAgICAgICAgRWxlbWVudC5wcm90b3R5cGUubWFrZUVsZW1lbnQgPSBmdW5jdGlvbiAocGFyYW1zID0geyBlbGVtZW50OiAnJywgYXR0cmlidXRlczoge30gfSkge1xyXG4gICAgICAgICAgICB0aGlzLnNldEtleUFzeW5jKCk7XHJcblxyXG4gICAgICAgICAgICBsZXQgZWxlbWVudCA9IHNlbGYuY3JlYXRlRWxlbWVudChwYXJhbXMsIHRoaXMpO1xyXG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEdldCBhbiBlbGVtZW50cyBhbmNlc3RvciB3aXRoIGEgc3BlY2lmaWMgYXR0cmlidXRlXHJcbiAgICAgICAgRWxlbWVudC5wcm90b3R5cGUuZ2V0UGFyZW50cyA9IGZ1bmN0aW9uIChuYW1lID0gJycsIHZhbHVlID0gJycpIHtcclxuICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZSA9IG5hbWUuc2xpY2UoMCwgMSk7XHJcbiAgICAgICAgICAgIHZhciBwYXJlbnQgPSB0aGlzLnBhcmVudE5vZGU7XHJcbiAgICAgICAgICAgIGlmIChhdHRyaWJ1dGUgPT0gJy4nKSB7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAocGFyZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYuaXNzZXQocGFyZW50LmNsYXNzTGlzdCkgJiYgcGFyZW50LmNsYXNzTGlzdC5jb250YWlucyhuYW1lLnNsaWNlKDEpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmVudE5vZGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoYXR0cmlidXRlID09ICcjJykge1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKHBhcmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLmlzc2V0KHBhcmVudC5pZCkgJiYgcGFyZW50LmlkID09IG5hbWUuc2xpY2UoMSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnROb2RlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKHBhcmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLmlzc2V0KHBhcmVudC5ub2RlTmFtZSkgJiYgcGFyZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT0gbmFtZS50b0xvd2VyQ2FzZSgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChzZWxmLmlzc2V0KHBhcmVudC5oYXNBdHRyaWJ1dGUpICYmIHBhcmVudC5oYXNBdHRyaWJ1dGUobmFtZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYuaXNzZXQodmFsdWUpICYmIHBhcmVudC5nZXRBdHRyaWJ1dGUobmFtZSkgPT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnROb2RlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBwYXJlbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBUb2dnbGUgdGhlIGRpc3BsYXkgb2YgYW4gZWxlbWVudFxyXG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc3R5bGUuZGlzcGxheSA9PSAnbm9uZScgfHwgdGhpcy5zdHlsZS52aXNpYmlsaXR5ID09ICdoaWRkZW4nKSB0aGlzLnNob3coKTtcclxuICAgICAgICAgICAgZWxzZSB0aGlzLmhpZGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vSGlkZSBhbiBlbGVtZW50IGluIGRvbVxyXG4gICAgICAgIEVsZW1lbnQucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIC8vIGlmIChzZWxmLmlzc2V0KHRoaXMuc3R5bGUuZGlzcGxheSkpIHRoaXMudGVtcC5kaXNwbGF5ID0gdGhpcy5zdHlsZS5kaXNwbGF5O1xyXG4gICAgICAgICAgICAvLyBpZiAoc2VsZi5pc3NldCh0aGlzLnN0eWxlLnZpc2liaWxpdHkpKSB0aGlzLnRlbXAudmlzaWJpbGl0eSA9IHRoaXMuc3R5bGUudmlzaWJpbGl0eTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICAgICAgLy8gdGhpcy5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9TaG93IGFuIGVsZW1lbnQgaW4gZG9tXHJcbiAgICAgICAgRWxlbWVudC5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgLy8gaWYgKHRoaXMuc3R5bGUuZGlzcGxheSA9PSAnbm9uZScpIHtcclxuICAgICAgICAgICAgLy8gICAgIC8vIGlmIChzZWxmLmlzc2V0KHRoaXMudGVtcC5kaXNwbGF5KSkge1xyXG4gICAgICAgICAgICAvLyAgICAgLy8gICAgIHRoaXMuY3NzKHsgZGlzcGxheTogdGhpcy50ZW1wLmRpc3BsYXkgfSk7XHJcbiAgICAgICAgICAgIC8vICAgICAvLyB9XHJcbiAgICAgICAgICAgIC8vICAgICAvLyBlbHNlIHRoaXMuY3NzUmVtb3ZlKFsnZGlzcGxheSddKTtcclxuICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICB0aGlzLmNzc1JlbW92ZShbJ2Rpc3BsYXknXSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9SZW1vdmUgYWxsIHRoZSBjaGlsZHJlbiBvZiBhbiBlbGVtZW50IHdpdGggZXhjZXB0aW9ucyBvZiBzb21lXHJcbiAgICAgICAgRWxlbWVudC5wcm90b3R5cGUucmVtb3ZlQ2hpbGRyZW4gPSBmdW5jdGlvbiAocGFyYW1zID0geyBleGNlcHQ6IFtdIH0pIHtcclxuICAgICAgICAgICAgbGV0IGV4Y2VwdGlvbnMgPSBbXTtcclxuICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xyXG4gICAgICAgICAgICBwYXJhbXMuZXhjZXB0ID0gcGFyYW1zLmV4Y2VwdCB8fCBbXTtcclxuICAgICAgICAgICAgbGV0IGV4Y2VwdCA9IHBhcmFtcy5leGNlcHQ7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXhjZXB0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYWxsID0gdGhpcy5maW5kQWxsKGV4Y2VwdFtpXSk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGFsbC5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghZXhjZXB0aW9ucy5pbmNsdWRlcyhhbGxbal0pKSBleGNlcHRpb25zLnB1c2goYWxsW2pdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKG5vZGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFleGNlcHRpb25zLmluY2x1ZGVzKG5vZGUpKSBub2RlLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9EZWxldGUgYW4gZWxlbWVudCBmcm9tIHRoZSBkb20gYW5kIHZpcnR1YWwgZG9tXHJcbiAgICAgICAgRWxlbWVudC5wcm90b3R5cGUuZGVsZXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoc2VsZi5pc3NldCh0aGlzLmRhdGFzZXQuZG9tS2V5KSkge1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHNlbGYudmlydHVhbFt0aGlzLmRhdGFzZXQuZG9tS2V5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9EZWxldGUgYW4gZWxlbWVudHMgY2hpbGQgZnJvbSB0aGUgZG9tIGFuZCB0aGUgdmlydHVhbCBkb21cclxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS5kZWxldGVDaGlsZCA9IGZ1bmN0aW9uIChjaGlsZCkge1xyXG4gICAgICAgICAgICBjaGlsZC5kZWxldGUoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBUb2dnbGUgYSBsaXN0IG9mIGNoaWxkcmVuIG9mIGFuIGVsZW1lbnRcclxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS50b2dnbGVDaGlsZHJlbiA9IGZ1bmN0aW9uIChwYXJhbXMgPSB7IG5hbWU6ICcnLCBjbGFzczogJycsIGlkOiAnJyB9KSB7XHJcbiAgICAgICAgICAgIEFycmF5LmZyb20odGhpcy5jaGlsZHJlbikuZm9yRWFjaChub2RlID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghKChzZWxmLmlzc2V0KHBhcmFtcy5uYW1lKSAmJiBwYXJhbXMubmFtZSA9PSBub2RlLm5vZGVOYW1lKSB8fCBzZWxmLmlzc2V0KHBhcmFtcy5jbGFzcykgJiYgc2VsZi5oYXNBcnJheUVsZW1lbnQoQXJyYXkuZnJvbShub2RlLmNsYXNzTGlzdCksIHBhcmFtcy5jbGFzcy5zcGxpdCgnICcpKSB8fCAoc2VsZi5pc3NldChwYXJhbXMuaWQpICYmIHBhcmFtcy5pZCA9PSBub2RlLmlkKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBub2RlLnRvZ2dsZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9kZS50b2dnbGUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBBdHRhdGNoIGFuIGVsZW1lbnQgdG8gYW5vdGhlciBlbGVtZW50IFthcHBlbmQgb3IgcHJlcGVuZF1cclxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS5hdHRhY2hFbGVtZW50ID0gZnVuY3Rpb24gKGVsZW1lbnQsIGF0dGFjaG1lbnQgPSAnYXBwZW5kJykge1xyXG4gICAgICAgICAgICB0aGlzW2F0dGFjaG1lbnRdKGVsZW1lbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgRWxlbWVudC5wcm90b3R5cGUucHJlc3NlZCA9IGZ1bmN0aW9uIChjYWxsYmFjayA9ICgpID0+IHsgfSkge1xyXG4gICAgICAgICAgICBsZXQgc3RhcnRUaW1lID0gMCwgZW5kVGltZSA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkTXVsdGlwbGVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24sIHRvdWNoc3RhcnQnLCBldmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICBzdGFydFRpbWUgPSBldmVudC50aW1lU3RhbXA7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5hZGRNdWx0aXBsZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAsIHRvdWNoZW5kJywgZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgZW5kVGltZSA9IGV2ZW50LnRpbWVTdGFtcDtcclxuICAgICAgICAgICAgICAgIGV2ZW50LmR1cmF0aW9uID0gZW5kVGltZSAtIHN0YXJ0VGltZTtcclxuXHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhldmVudCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBodG1sQ29sbGVjdGlvbkxpYnJhcnkoSFRNTENvbGxlY3Rpb24gPSBFbXB0eSkge1xyXG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgSFRNTENvbGxlY3Rpb24ucHJvdG90eXBlLnBvcEluZGV4ID0gZnVuY3Rpb24gKHBvc2l0aW9uID0gMCkge1xyXG4gICAgICAgICAgICBsZXQgY29sbGVjdGlvbiA9IHNlbGYuY3JlYXRlRWxlbWVudCh7IGVsZW1lbnQ6ICdzYW1wbGUnIH0pLmNoaWxkcmVuO1xyXG5cclxuICAgICAgICAgICAgbGV0IGxpc3QgPSBBcnJheS5mcm9tKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSA9PSBwb3NpdGlvbikgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9uW2ldID0gdGhpcy5pdGVtKGkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gY29sbGVjdGlvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIEhUTUxDb2xsZWN0aW9uLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gKGNhbGxiYWNrID0gKCkgPT4geyB9KSB7XHJcbiAgICAgICAgICAgIGxldCBsaXN0ID0gQXJyYXkuZnJvbSh0aGlzKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhsaXN0W2ldLCBpKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgSFRNTENvbGxlY3Rpb24ucHJvdG90eXBlLmVhY2ggPSBmdW5jdGlvbiAoY2FsbGJhY2sgPSAoKSA9PiB7IH0pIHtcclxuICAgICAgICAgICAgbGV0IGxpc3QgPSBBcnJheS5mcm9tKHRoaXMpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGxpc3RbaV0sIGkpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBIVE1MQ29sbGVjdGlvbi5wcm90b3R5cGVbJ2luZGV4T2YnXSA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIGxldCBsaXN0ID0gQXJyYXkuZnJvbSh0aGlzKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSBpbiBsaXN0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobGlzdCA9PSBlbGVtZW50KSByZXR1cm4gaTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgSFRNTENvbGxlY3Rpb24ucHJvdG90eXBlWydpbmNsdWRlcyddID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5kZXhPZihlbGVtZW50KSAhPSAtMTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBIVE1MQ29sbGVjdGlvbi5wcm90b3R5cGVbJ25vZGVzQmV0d2VlbiddID0gZnVuY3Rpb24gKGVsZW1lbnRBLCBlbGVtZW50Qikge1xyXG4gICAgICAgICAgICBsZXQgaW5CZXR3ZWVuTm9kZXMgPSBbXTtcclxuICAgICAgICAgICAgbGV0IGxpc3QgPSBBcnJheS5mcm9tKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgYVBhcmVudCBvZiBsaXN0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYVBhcmVudCA9PSBlbGVtZW50QSB8fCBhUGFyZW50ID09IGVsZW1lbnRCIHx8IGFQYXJlbnQuaXNBbmNlc3RvcihlbGVtZW50QSkgfHwgYVBhcmVudC5pc0FuY2VzdG9yKGVsZW1lbnRCKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluQmV0d2Vlbk5vZGVzLnB1c2goYVBhcmVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBpbkJldHdlZW5Ob2RlcztcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIG5vZGVMaWJyYXJ5KE5vZGUgPSBFbXB0eSkge1xyXG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgTm9kZS5wcm90b3R5cGUuc3RhdGVzID0ge307XHJcbiAgICB9XHJcblxyXG4gICAgbm9kZUxpc3RMaWJyYXJ5KE5vZGVMaXN0ID0gRW1wdHkpIHtcclxuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIE5vZGVMaXN0LnByb3RvdHlwZVsnZWFjaCddID0gZnVuY3Rpb24gKGNhbGxiYWNrID0gKCkgPT4geyB9KSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2sodGhpc1tpXSwgaSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgTm9kZUxpc3QucHJvdG90eXBlWydpbmRleE9mJ10gPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpIGluIHRoaXMpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzW2ldID09IGVsZW1lbnQpIHJldHVybiBpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBOb2RlTGlzdC5wcm90b3R5cGVbJ2luY2x1ZGVzJ10gPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pbmRleE9mKGVsZW1lbnQpICE9IC0xO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIE5vZGVMaXN0LnByb3RvdHlwZVsnbm9kZXNCZXR3ZWVuJ10gPSBmdW5jdGlvbiAoZWxlbWVudEEsIGVsZW1lbnRCKSB7XHJcbiAgICAgICAgICAgIGxldCBpbkJldHdlZW5Ob2RlcyA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBhUGFyZW50IG9mIHRoaXMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChhUGFyZW50ID09IGVsZW1lbnRBIHx8IGFQYXJlbnQgPT0gZWxlbWVudEIgfHwgYVBhcmVudC5pc0FuY2VzdG9yKGVsZW1lbnRBKSB8fCBhUGFyZW50LmlzQW5jZXN0b3IoZWxlbWVudEIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5CZXR3ZWVuTm9kZXMucHVzaChhUGFyZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGluQmV0d2Vlbk5vZGVzO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGVtcGxhdGU7IiwiY29uc3QgVHJlZUV2ZW50ID0gcmVxdWlyZSgnLi9UcmVlRXZlbnQnKTtcclxuXHJcbmNsYXNzIFRyZWUge1xyXG4gICAgI2NoaWxkcmVuID0gW107XHJcbiAgICAjcGFyZW50ID0gbnVsbDtcclxuICAgICNyb290ID0gbnVsbDtcclxuICAgICNhdHRyaWJ1dGVzID0ge307XHJcbiAgICAjZXZlbnRzTGlzdCA9IFtdO1xyXG5cclxuICAgIGdldCBoZWlnaHQoKSB7XHJcbiAgICAgICAgbGV0IGhlaWdodCA9IDEsIGJyYW5jaEhlaWdodHMgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBicmFuY2ggb2YgdGhpcy4jY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgaWYgKGJyYW5jaCBpbnN0YW5jZW9mIFRyZWUpIHtcclxuICAgICAgICAgICAgICAgIGJyYW5jaEhlaWdodHMucHVzaChicmFuY2guaGVpZ2h0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoYnJhbmNoSGVpZ2h0cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGhlaWdodCArPSBNYXRoLm1heCguLi5icmFuY2hIZWlnaHRzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgbGVuZ3RoKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLiNjaGlsZHJlbi5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHBhcmVudFRyZWUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuI3BhcmVudDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgcm9vdFRyZWUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuI3Jvb3Q7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHZhbHVlcygpIHtcclxuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLiNjaGlsZHJlbik7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGxlbmd0aChzaXplKSB7XHJcbiAgICAgICAgbGV0IG5ld0NoaWxkcmVuID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcclxuICAgICAgICAgICAgbmV3Q2hpbGRyZW4ucHVzaCh0aGlzLiNjaGlsZHJlbltpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuI2NoaWxkcmVuID0gbmV3Q2hpbGRyZW47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IoaXRlbXMsIHBhcmVudCwgcm9vdCkge1xyXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGl0ZW1zKSkge1xyXG4gICAgICAgICAgICB0aGlzLnB1c2goLi4uaXRlbXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBhcmVudCAhPSB1bmRlZmluZWQgJiYgcGFyZW50LmNvbnN0cnVjdG9yID09IFRyZWUpIHtcclxuICAgICAgICAgICAgdGhpcy4jcGFyZW50ID0gcGFyZW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHJvb3QgIT0gdW5kZWZpbmVkICYmIHJvb3QuY29uc3RydWN0b3IgPT0gVHJlZSkge1xyXG4gICAgICAgICAgICB0aGlzLiNyb290ID0gcm9vdDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlSXRlbXMoaXRlbXMpIHtcclxuICAgICAgICBsZXQgcm9vdCA9ICh0aGlzLiNwYXJlbnQgIT0gbnVsbCkgPyB0aGlzLiNyb290IDogdGhpcztcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGl0ZW1zW2ldKSkge1xyXG4gICAgICAgICAgICAgICAgaXRlbXNbaV0gPSBuZXcgVHJlZShpdGVtc1tpXSwgdGhpcywgcm9vdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGl0ZW1zO1xyXG4gICAgfVxyXG5cclxuICAgIGNvcHlXaXRoaW4odGFyZ2V0LCBzdGFydCA9IDAsIGVuZCA9IDEpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy4jY2hpbGRyZW4uY29weVdpdGhpbih0YXJnZXQsIHN0YXJ0LCBlbmQpXHJcbiAgICB9XHJcblxyXG4gICAgY29uY2F0KHRyZWUpIHtcclxuICAgICAgICBsZXQgbmV3VHJlZSA9IG5ldyBUcmVlKHRoaXMudmFsdWVzLCB0aGlzLiNwYXJlbnQsIHRoaXMuI3Jvb3QpO1xyXG4gICAgICAgIGlmICh0cmVlLmNvbnN0cnVjdG9yID09IFRyZWUpIHtcclxuICAgICAgICAgICAgbmV3VHJlZS5wdXNoKC4uLnRyZWUudmFsdWVzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh0cmVlKSkge1xyXG4gICAgICAgICAgICBuZXdUcmVlLnB1c2goLi4udHJlZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBuZXdUcmVlLnB1c2godHJlZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXdUcmVlO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbWJpbmUoZmlyc3QsIHNlY29uZCwgcG9zaXRpb24pIHsvL3VzZWQgdG8gZ2V0IHdoYXQgaXMgYmV0d2VlbiB0d28gaXRlbXMgYXQgYSBwYXJ0aWN1bGFyIG9jY3VycmFuY2UgaW4gYW4gQXJyYXkgYW5kIHRoZSBpdGVtcyBjb21iaW5lZFxyXG4gICAgICAgIHBvc2l0aW9uID0gcG9zaXRpb24gfHwgMDsvL2luaXRpYWxpemUgcG9zaXRpb24gaWYgbm90IHNldFxyXG4gICAgICAgIGxldCBhdDEgPSBwb3NpdGlvbixcclxuICAgICAgICAgICAgYXQyID0gZmlyc3QgPT09IHNlY29uZCA/IHBvc2l0aW9uICsgMSA6IHBvc2l0aW9uOyAvL2NoZWNrIGlmIGl0IGlzIHRoZSBzYW1lIGFuZCBjaGFuZ2UgcG9zaXRpb25cclxuICAgICAgICBsZXQgc3RhcnQgPSB0aGlzLmluZGV4QXQoZmlyc3QsIGF0MSk7Ly9nZXQgdGhlIHN0YXJ0XHJcbiAgICAgICAgbGV0IGVuZCA9IHRoaXMuaW5kZXhBdChzZWNvbmQsIGF0MikgKyAxOy8vZ2V0IHRoZSBlbmRcclxuXHJcbiAgICAgICAgaWYgKHN0YXJ0ID09IC0xIHx8IGVuZCA9PSAwKSB7Ly9udWxsIGlmIG9uZSBpcyBub3QgZm91bmRcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5zbGljZShzdGFydCwgZW5kKTtcclxuICAgIH1cclxuXHJcbiAgICBlbnRyaWVzKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlcy5lbnRyaWVzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZW1wdHkoKSB7XHJcbiAgICAgICAgdGhpcy4jY2hpbGRyZW4ubGVuZ3RoID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBldmVyeShjYWxsYmFjayA9ICh2YWx1ZSwgaW5kZXgpID0+IHsgfSkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICBsZXQgdmFsdWVzID0gdGhpcy52YWx1ZXM7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgaW4gdmFsdWVzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiNjaGlsZHJlbltpXSA9IGNhbGxiYWNrKHZhbHVlc1tpXSwgaSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZmluZChjYWxsYmFjayA9ICh2YWx1ZSwgaW5kZXgpID0+IHsgfSkge1xyXG4gICAgICAgIGxldCB2YWx1ZSwgZm91bmQgPSBmYWxzZTtcclxuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgbGV0IHZhbHVlcyA9IHRoaXMudmFsdWVzO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSBpbiB2YWx1ZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjayh2YWx1ZXNbaV0sIGkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB0aGlzLiNjaGlsZHJlbltpXTtcclxuICAgICAgICAgICAgICAgICAgICBmb3VuZFxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBmaW5kTGFzdChjYWxsYmFjayA9ICh2YWx1ZSwgaW5kZXgpID0+IHsgfSkge1xyXG4gICAgICAgIGxldCB2YWx1ZTtcclxuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgbGV0IHZhbHVlcyA9IHRoaXMudmFsdWVzLnJldmVyc2UoKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSBpbiB2YWx1ZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjayh2YWx1ZXNbaV0sIGkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB0aGlzLiNjaGlsZHJlbltpXTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgZmluZEluZGV4KGNhbGxiYWNrID0gKHZhbHVlLCBpbmRleCkgPT4geyB9KSB7XHJcbiAgICAgICAgbGV0IHZhbHVlO1xyXG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICBsZXQgdmFsdWVzID0gdGhpcy52YWx1ZXM7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgaW4gdmFsdWVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2sodmFsdWVzW2ldLCBpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gaTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgZmluZExhc3RJbmRleChjYWxsYmFjayA9ICh2YWx1ZSwgaW5kZXgpID0+IHsgfSkge1xyXG4gICAgICAgIGxldCB2YWx1ZTtcclxuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgbGV0IHZhbHVlcyA9IHRoaXMudmFsdWVzLnJldmVyc2UoKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSBpbiB2YWx1ZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjayh2YWx1ZXNbaV0sIGkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBmaW5kQWxsKGNhbGxiYWNrID0gKHZhbHVlLCBpbmRleCkgPT4geyB9KSB7XHJcbiAgICAgICAgbGV0IG5ld1RyZWUgPSBuZXcgVHJlZSgpO1xyXG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICBsZXQgdmFsdWVzID0gdGhpcy52YWx1ZXM7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgaW4gdmFsdWVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2sodmFsdWVzW2ldLCBpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld1RyZWUucHVzaCh0aGlzLiNjaGlsZHJlbltpXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ld1RyZWU7XHJcbiAgICB9XHJcblxyXG4gICAgZmluZEFsbEluZGV4KGNhbGxiYWNrID0gKHZhbHVlLCBpbmRleCkgPT4geyB9KSB7XHJcbiAgICAgICAgbGV0IG5ld0FycmF5ID0gW107XHJcbiAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIGxldCB2YWx1ZXMgPSB0aGlzLnZhbHVlcztcclxuICAgICAgICAgICAgZm9yIChsZXQgaSBpbiB2YWx1ZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjayh2YWx1ZXNbaV0sIGkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3QXJyYXkucHVzaChpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3QXJyYXk7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yRWFjaChjYWxsYmFjayA9ICh2YWx1ZSwgaW5kZXgpID0+IHsgfSkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICBsZXQgdmFsdWVzID0gdGhpcy52YWx1ZXM7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgaW4gdmFsdWVzKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayh2YWx1ZXNbaV0sIGkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZpbGwoaXRlbSkge1xyXG4gICAgICAgIGZvciAobGV0IGkgaW4gdGhpcy4jY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuI2NoaWxkcmVuW2ldLmNvbnN0cnVjdG9yID09IFRyZWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuI2NoaWxkcmVuW2ldLmZpbGwoaXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiNjaGlsZHJlbltpXSA9IGl0ZW07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZmlsdGVyKGNhbGxiYWNrID0gKHZhbHVlLCBpbmRleCkgPT4geyB9KSB7XHJcbiAgICAgICAgbGV0IG5ld1RyZWUgPSBuZXcgVHJlZSgpO1xyXG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICBsZXQgdmFsdWVzID0gdGhpcy52YWx1ZXM7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgaW4gdmFsdWVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2sodmFsdWVzW2ldLCBpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld1RyZWUucHVzaCh0aGlzLiNjaGlsZHJlbltpXSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3VHJlZTtcclxuICAgIH1cclxuXHJcbiAgICBmbGF0TWFwKGNhbGxiYWNrID0gKHZhbHVlLCBpbmRleCkgPT4geyB9KSB7XHJcbiAgICAgICAgbGV0IG5ld1RyZWUgPSBuZXcgVHJlZSgpO1xyXG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICBsZXQgdmFsdWVzID0gdGhpcy5mbGF0KCk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgaW4gdmFsdWVzKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdUcmVlLnB1c2goY2FsbGJhY2sodmFsdWVzW2ldLCBpKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ld1RyZWU7XHJcbiAgICB9XHJcblxyXG4gICAgZmxhdCgpIHtcclxuICAgICAgICBsZXQgZmxhdHRlbmVkID0gW107XHJcbiAgICAgICAgbGV0IHZhbHVlcyA9IHRoaXMudmFsdWVzO1xyXG4gICAgICAgIGZvciAobGV0IHYgb2YgdmFsdWVzKSB7XHJcbiAgICAgICAgICAgIGlmICh2LmNvbnN0cnVjdG9yID09IFRyZWUpIHtcclxuICAgICAgICAgICAgICAgIGZsYXR0ZW5lZC5wdXNoKHYuZmxhdCgpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZsYXR0ZW5lZC5wdXNoKHYpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmbGF0dGVuZWQuZmxhdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGZsYXRUcmVlKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVHJlZSh0aGlzLmZsYXQoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0QXR0cmlidXRlKG5hbWUpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy4jYXR0cmlidXRlc1tuYW1lXTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRBdHRyaWJ1dGVzKGF0dHJpYnV0ZXMpIHtcclxuICAgICAgICBsZXQgZm91bmQgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBuYW1lIG9mIGF0dHJpYnV0ZXMpIHtcclxuICAgICAgICAgICAgZm91bmQucHVzaCh0aGlzLiNhdHRyaWJ1dGVzW25hbWVdKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmb3VuZDtcclxuICAgIH1cclxuXHJcbiAgICBoYXNBdHRyaWJ1dGUobmFtZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLiNhdHRyaWJ1dGVzICE9IHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICBpbmNsdWRlcyh2YWx1ZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLiNjaGlsZHJlbi5pbmNsdWRlcyh2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5kZXhPZih2YWx1ZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLiNjaGlsZHJlbi5pbmRleE9mKHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBpc0JyYW5jaCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy4jcGFyZW50ICE9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgaW5CZXR3ZWVuKGZpcnN0LCBzZWNvbmQsIHBvc2l0aW9uKSB7Ly91c2VkIHRvIGdldCB3aGF0IGlzIGJldHdlZW4gdHdvIGl0ZW1zIGF0IGEgcGFydGljdWxhciBvY2N1cnJhbmNlIGluIGFuIEFycmF5XHJcbiAgICAgICAgcG9zaXRpb24gPSBwb3NpdGlvbiB8fCAwOy8vaW5pdGlhbGl6ZSBwb3NpdGlvbiBpZiBub3Qgc2V0XHJcbiAgICAgICAgbGV0IGF0MSA9IHBvc2l0aW9uLFxyXG4gICAgICAgICAgICBhdDIgPSBmaXJzdCA9PT0gc2Vjb25kID8gcG9zaXRpb24gKyAxIDogcG9zaXRpb247IC8vY2hlY2sgaWYgaXQgaXMgdGhlIHNhbWUgYW5kIGNoYW5nZSBwb3NpdGlvblxyXG5cclxuICAgICAgICBsZXQgc3RhcnQgPSB0aGlzLmluZGV4QXQoZmlyc3QsIGF0MSkgKyAxOy8vZ2V0IHRoZSBzdGFydFxyXG4gICAgICAgIGxldCBlbmQgPSB0aGlzLmluZGV4QXQoc2Vjb25kLCBhdDIpOy8vZ2V0IHRoZSBlbmRcclxuXHJcbiAgICAgICAgaWYgKHN0YXJ0ID09IDAgfHwgZW5kID09IC0xKSB7Ly9udWxsIGlmIG9uZSBpcyBub3QgZm91bmRcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5zbGljZShzdGFydCwgZW5kKTtcclxuICAgIH1cclxuXHJcbiAgICBpbmRleEF0KGl0ZW0sIHBvc2l0aW9uID0gMCkgey8vdXNlZCB0byBnZXQgdGhlIGluZGV4IG9mIGFuIGl0ZW0gYXQgYSBwYXJ0aWN1bGFyIG9jY3VycmFuY2VcclxuICAgICAgICBwb3NpdGlvbiA9IHBvc2l0aW9uIHx8IDA7XHJcbiAgICAgICAgbGV0IGNvdW50ID0gLTE7XHJcbiAgICAgICAgbGV0IHZhbHVlcyA9IHRoaXMudmFsdWVzO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZXNbaV0gPT0gaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICAgICAgICAgIGlmIChjb3VudCA9PSBwb3NpdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gLTE7XHJcbiAgICB9XHJcblxyXG4gICAgam9pbihhdCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRvQXJyYXkoKS5qb2luKGF0KTtcclxuICAgIH1cclxuXHJcbiAgICBsYXN0SW5kZXhPZih2YWx1ZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLiNjaGlsZHJlbi5sYXN0SW5kZXhPZih2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgbWFwKGNhbGxiYWNrID0gKHZhbHVlLCBpbmRleCkgPT4geyB9KSB7XHJcbiAgICAgICAgbGV0IG5ld1RyZWUgPSBuZXcgVHJlZSgpO1xyXG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICBsZXQgdmFsdWVzID0gdGhpcy52YWx1ZXM7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgaW4gdmFsdWVzKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdUcmVlLnB1c2goY2FsbGJhY2sodmFsdWVzW2ldLCBpKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ld1RyZWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVzaCguLi5pdGVtcykge1xyXG4gICAgICAgIHRoaXMuI2NoaWxkcmVuLnB1c2goLi4udGhpcy5jcmVhdGVJdGVtcyhpdGVtcykpO1xyXG4gICAgfVxyXG5cclxuICAgIHBvcCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy4jY2hpbGRyZW4ucG9wKCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJlbW92ZSgpe1xyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgncmVtb3ZlJyk7XHJcbiAgICAgICAgaWYodGhpcy5pc0JyYW5jaCgpKXtcclxuICAgICAgICAgICAgdGhpcy4jcGFyZW50LnJlbW92ZUNoaWxkKHRoaXMpO1xyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ3JlbW92ZWQnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlQ2hpbGQoY2hpbGQpe1xyXG4gICAgICAgIGxldCBpbmRleCA9IHRoaXMuaW5kZXhPZihjaGlsZCk7XHJcbiAgICAgICAgbGV0IG5ld0NoaWxkcmVuID0gW107XHJcbiAgICAgICAgZm9yKGxldCBpIGluIHRoaXMuI2NoaWxkcmVuKXtcclxuICAgICAgICAgICAgaWYoaSAhPSBpbmRleCl7XHJcbiAgICAgICAgICAgICAgICBuZXdDaGlsZHJlbi5wdXNoKHRoaXMuI2NoaWxkcmVuW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLiNjaGlsZHJlbiA9IG5ld0NoaWxkcmVuO1xyXG4gICAgfVxyXG5cclxuICAgIHJldmVyc2UoKSB7XHJcbiAgICAgICAgdGhpcy4jY2hpbGRyZW4ucmV2ZXJzZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlZHVjZShjYWxsYmFjaywgcmVkdWNlciA9IDApIHtcclxuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZXMucmVkdWNlKGNhbGxiYWNrLCByZWR1Y2VyKTtcclxuICAgIH1cclxuXHJcbiAgICByZWR1Y2VSaWdodChjYWxsYmFjaykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlcy5yZWR1Y2VSaWdodChjYWxsYmFjayk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlQXR0cmlidXRlKG5hbWUpIHtcclxuICAgICAgICBkZWxldGUgdGhpcy4jYXR0cmlidXRlc1tuYW1lXTtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVBdHRyaWJ1dGVzKGF0dHJpYnV0ZXMpIHtcclxuICAgICAgICBmb3IgKGxldCBuYW1lIG9mIGF0dHJpYnV0ZXMpIHtcclxuICAgICAgICAgICAgZGVsZXRlIHRoaXMuI2F0dHJpYnV0ZXNbbmFtZV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNlYXJjaChjYWxsYmFjayA9ICh2YWx1ZSwgaW5kZXgpID0+IHsgfSwgZGVwdGggPSAwKSB7XHJcbiAgICAgICAgbGV0IHZhbHVlO1xyXG4gICAgICAgIGxldCBwYXRoID0gW107Ly9pbml0IHBhdGhcclxuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgbGV0IHZhbHVlcyA9IHRoaXMudmFsdWVzO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpIGluIHZhbHVlcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKHZhbHVlc1tpXSwgaSkpIHsvL3NldCBwYXRoXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZXNbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgcGF0aC5wdXNoKGkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZGVwdGggIT0gJ251bWJlcicpIGRlcHRoID0gMDtcclxuICAgICAgICAgICAgaWYgKHBhdGgubGVuZ3RoID09IDAgJiYgZGVwdGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBkZXB0aC0tO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSBpbiB2YWx1ZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWVzW2ldLmNvbnN0cnVjdG9yID09IFRyZWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHN1YiA9IHZhbHVlc1tpXS5zZWFyY2goY2FsbGJhY2ssIGRlcHRoLCBwYXRoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN1Yi5wYXRoLmxlbmd0aCAhPSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWIucGF0aC51bnNoaWZ0KGkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aCA9IHN1Yi5wYXRoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBzdWIudmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4geyBwYXRoLCB2YWx1ZSB9O1xyXG4gICAgfVxyXG5cclxuICAgIHNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgbmFtZSA9PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICB0aGlzLiNhdHRyaWJ1dGVzW25hbWVdID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNldEF0dHJpYnV0ZXMoYXR0cmlidXRlcykge1xyXG4gICAgICAgIGZvciAobGV0IG5hbWUgaW4gYXR0cmlidXRlcykge1xyXG4gICAgICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShuYW1lLCBhdHRyaWJ1dGVzW25hbWVdKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2hpZnQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuI2NoaWxkcmVuLnNoaWZ0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2xpY2Uoc3RhcnQsIGVuZCkge1xyXG4gICAgICAgIGxldCB2YWx1ZXMgPSB0aGlzLnZhbHVlcztcclxuICAgICAgICBpZiAoZW5kID09IHVuZGVmaW5lZCkgZW5kID0gdmFsdWVzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgcmV0dXJuIHZhbHVlcy5zbGljZShzdGFydCwgZW5kKTtcclxuICAgIH1cclxuXHJcbiAgICBzbGljZUFzVHJlZShzdGFydCwgZW5kKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBUcmVlKHRoaXMuc2xpY2Uoc3RhcnQsIGVuZCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHNvbWUoY2FsbGJhY2sgPSAodmFsdWUsIGluZGV4KSA9PiB7IH0pIHtcclxuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgbGV0IHZhbHVlcyA9IHRoaXMuZmxhdCgpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpIGluIHZhbHVlcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKHZhbHVlc1tpXSwgaSkpIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBzb3J0KGNhbGxiYWNrLCBkZXB0aCA9IDApIHtcclxuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrID0gKGEsIGIpID0+IGEgPiBiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLiNjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gaSArIDE7IGogPCB0aGlzLiNjaGlsZHJlbi5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRlbXA7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2sodGhpcy4jY2hpbGRyZW5baV0sIHRoaXMuI2NoaWxkcmVuW2pdKSA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcCA9IHRoaXMuI2NoaWxkcmVuW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuI2NoaWxkcmVuW2ldID0gdGhpcy4jY2hpbGRyZW5bal07XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4jY2hpbGRyZW5bal0gPSB0ZW1wO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodHlwZW9mIGRlcHRoICE9ICdudW1iZXInKSBkZXB0aCA9IDA7XHJcbiAgICAgICAgaWYgKGRlcHRoID4gMCkge1xyXG4gICAgICAgICAgICBkZXB0aC0tO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpIGluIHRoaXMuI2NoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy4jY2hpbGRyZW5baV0uY29uc3RydWN0b3IgPT0gVHJlZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuI2NoaWxkcmVuW2ldLnNvcnQoY2FsbGJhY2ssIGRlcHRoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzcGxpY2Uoc3RhcnQsIGRlbGV0ZUNvdW50LCAuLi5pdGVtcykge1xyXG4gICAgICAgIGlmIChkZWxldGVDb3VudCA9PSB1bmRlZmluZWQpIGRlbGV0ZUNvdW50ID0gdGhpcy4jY2hpbGRyZW4ubGVuZ3RoIC0gc3RhcnQ7XHJcbiAgICAgICAgbGV0IG5ld1RyZWUgPSBuZXcgVHJlZSh0aGlzLiNjaGlsZHJlbi5zcGxpY2Uoc3RhcnQsIGRlbGV0ZUNvdW50LCAuLi5pdGVtcykpO1xyXG4gICAgICAgIHJldHVybiBuZXdUcmVlO1xyXG4gICAgfVxyXG5cclxuICAgIHRvQXJyYXkoKSB7XHJcbiAgICAgICAgbGV0IGFycmF5ID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaXRlbSBvZiB0aGlzLiNjaGlsZHJlbikge1xyXG4gICAgICAgICAgICBpZiAoaXRlbS5jb25zdHJ1Y3RvciA9PSBUcmVlKSB7XHJcbiAgICAgICAgICAgICAgICBhcnJheS5wdXNoKGl0ZW0udG9BcnJheSgpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGFycmF5LnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBhcnJheTtcclxuICAgIH1cclxuXHJcbiAgICB0b1N0cmluZygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5mbGF0KCkudG9TdHJpbmcoKTtcclxuICAgIH1cclxuXHJcbiAgICB0b0xvY2FsZVN0cmluZygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5mbGF0KCkudG9Mb2NhbGVTdHJpbmcoKTtcclxuICAgIH1cclxuXHJcbiAgICB0cmFjZShwYXRoID0gW10pIHtcclxuICAgICAgICBwYXRoID0gQXJyYXkuZnJvbShwYXRoKTtcclxuICAgICAgICBsZXQgaSA9IHBhdGguc2hpZnQoKTtcclxuICAgICAgICBsZXQgZm91bmQgPSBmYWxzZTtcclxuICAgICAgICBsZXQgdmFsdWU7XHJcbiAgICAgICAgbGV0IGNoaWxkID0gdGhpcy52YWx1ZXNbaV07XHJcblxyXG4gICAgICAgIGlmIChjaGlsZCA9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdmFsdWUgPSB0aGlzO1xyXG4gICAgICAgICAgICBmb3VuZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHBhdGgubGVuZ3RoID09IDAgJiYgY2hpbGQgIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHZhbHVlID0gY2hpbGQ7XHJcbiAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoY2hpbGQgIT0gdW5kZWZpbmVkICYmIGNoaWxkLmNvbnN0cnVjdG9yID09IFRyZWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNoaWxkLnRyYWNlKHBhdGgpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHJldHVybiB7IGZvdW5kLCB2YWx1ZSB9O1xyXG4gICAgfVxyXG5cclxuICAgIHVuc2hpZnQoLi4uaXRlbXMpIHtcclxuICAgICAgICB0aGlzLiNjaGlsZHJlbi51bnNoaWZ0KC4uLnRoaXMuY3JlYXRlSXRlbXMoaXRlbXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBkaXNwYXRjaEV2ZW50KG5hbWUsIGF0dHJpYnV0ZXMsIGJ1YmJsZSkge1xyXG4gICAgICAgIGxldCB0cmVlRXZlbnQgPSBuZXcgVHJlZUV2ZW50KG5hbWUsIGF0dHJpYnV0ZXMsIGJ1YmJsZSk7XHJcbiAgICAgICAgaWYgKHRyZWVFdmVudC5idWJibGUgPT0gdHJ1ZSAmJiB0aGlzLmlzQnJhbmNoKCkpIHtcclxuICAgICAgICAgICAgdGhpcy4jcGFyZW50LmRpc3BhdGNoRXZlbnQobmFtZSwgYXR0cmlidXRlcywgYnViYmxlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IGV2ZW50IG9mIHRoaXMuI2V2ZW50c0xpc3QpIHtcclxuICAgICAgICAgICAgaWYgKGV2ZW50Lm5hbWUgPT0gbmFtZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBldmVudC5jYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LmNhbGxiYWNrKHRyZWVFdmVudC5hdHRyaWJ1dGVzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhZGRFdmVudExpc3RlbmVyKG5hbWUsIGNhbGxiYWNrLCBpZCkge1xyXG4gICAgICAgIHRoaXMuI2V2ZW50c0xpc3QucHVzaCh7IG5hbWUsIGNhbGxiYWNrLCBpZCB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVFdmVudExpc3RlbmVyKG5hbWUsIGNhbGxiYWNrLCBpZCkge1xyXG4gICAgICAgIGxldCBuZXdMaXN0ID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgZXZlbnQgb2YgdGhpcy4jZXZlbnRzTGlzdCkge1xyXG4gICAgICAgICAgICBpZiAoZXZlbnQubmFtZSA9PSBuYW1lICYmIGV2ZW50LmlkID09IGlkKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG5ld0xpc3QucHVzaChldmVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuI2V2ZW50c0xpc3QgPSBuZXdMaXN0O1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBpc1RyZWUodHJlZSkge1xyXG4gICAgICAgIHJldHVybiB0cmVlLmNvbnN0cnVjdG9yID09IFRyZWU7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZyb20oaXRlbXMpIHtcclxuICAgICAgICBsZXQgbmV3VHJlZSA9IG5ldyBUcmVlKGl0ZW1zKTtcclxuICAgICAgICByZXR1cm4gbmV3VHJlZTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUcmVlOyIsImNsYXNzIFRyZWVFdmVudCB7XHJcbiAgICBuYW1lID0gJyc7XHJcbiAgICBhdHRyaWJ1dGVzID0ge307XHJcblxyXG4gICAgY29uc3RydWN0b3IobmFtZSwgYXR0cmlidXRlcywgYnViYmxlKSB7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZXMgPSBhdHRyaWJ1dGVzO1xyXG4gICAgICAgIHRoaXMuc2V0QnViYmxlID0gYnViYmxlO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHNldCBzZXRCdWJibGUoYnViYmxlKXtcclxuICAgICAgICBpZih0eXBlb2YgYnViYmxlID09PSAnYm9vbGVhbicpe1xyXG4gICAgICAgICAgICB0aGlzLmF0dHJpYnV0ZXMuYnViYmxlID0gYnViYmxlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZXQgc2V0QXR0cmlidXRlcyhhdHRyaWJ1dGVzKSB7XHJcbiAgICAgICAgaWYgKFRyZWVFdmVudC5ldmVudHNbdGhpcy5uYW1lXSA9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgVHJlZUV2ZW50LmV2ZW50c1t0aGlzLm5hbWVdID0gYXR0cmlidXRlcztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgaW4gVHJlZUV2ZW50LmV2ZW50c1t0aGlzLm5hbWVdKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmF0dHJpYnV0ZXNbaV0gPSBUcmVlRXZlbnQuZXZlbnRzW3RoaXMubmFtZV1baV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgYXR0cmlidXRlcyA9PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpIGluIGF0dHJpYnV0ZXMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXR0cmlidXRlc1tpXSA9IGF0dHJpYnV0ZXNbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGV2ZW50cyA9IHtcclxuICAgICAgICBjbGljazogeyBuYW1lOiAnQ2xpY2snLCBkdXJhdGlvbjogJzFzZWMnLCBidWJibGU6IHRydWUgfSxcclxuICAgICAgICBob3ZlcjogeyBuYW1lOiAnSG92ZXInLCBkdXJhdGlvbjogJ0luZmluaXR5JywgYnViYmxlOiB0cnVlIH0sXHJcbiAgICAgICAgcmVtb3ZlOiB7IG5hbWU6ICdSZW1vdmUnLCBidWJibGU6IGZhbHNlIH0sXHJcbiAgICAgICAgY3JlYXRlZDoge25hbWU6ICdDcmVhdGVkJywgYnViYmxlOiBmYWxzZSwgZHVyYXRpb246ICcwc2VjJ31cclxuICAgIH07XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVHJlZUV2ZW50OyIsImNvbnN0IE1hdGhzTGlicmFyeSA9IHJlcXVpcmUoJy4vTWF0aHNMaWJyYXJ5Jyk7XHJcbmNvbnN0IE9iamVjdHNMaWJyYXJ5ID0gcmVxdWlyZSgnLi9PYmplY3RzTGlicmFyeScpO1xyXG5cclxubGV0IG1hdGhMaWJyYXJ5ID0gbmV3IE1hdGhzTGlicmFyeSgpO1xyXG5sZXQgb2JqZWN0TGlicmFyeSA9IG5ldyBPYmplY3RzTGlicmFyeSgpO1xyXG5cclxuZnVuY3Rpb24gQW5hbHlzaXNMaWJyYXJ5KCkge1xyXG4gICAgdGhpcy5lbnRyb3B5ID0gKGRhdGEpID0+IHtcclxuICAgICAgICBsZXQgZW50cm9weSA9IDA7Ly9pbml0aWFsaXplIGVudHJvcHlcclxuICAgICAgICBsZXQgdmFsdWVzID0gT2JqZWN0LnZhbHVlcyhkYXRhKTsvL2dldCB0aGUgdmFsdWVzIG9mIHRoZSBvYmplY3QgdmFyaWFibGVcclxuICAgICAgICBsZXQgc3VtID0gbWF0aExpYnJhcnkuc3VtKHZhbHVlcyk7Ly9nZXQgdGhlIHN1bSBvZiB0aGUgVmFsdWVzXHJcbiAgICAgICAgZm9yIChsZXQgdmFsdWUgb2YgdmFsdWVzKSB7XHJcbiAgICAgICAgICAgIGVudHJvcHkgLT0gdmFsdWUgLyBzdW0gKiBNYXRoLmxvZzIodmFsdWUgLyBzdW0pOyAvL3VzZSB0aGUgZm9ybXVsYXIgb24gZWFjaCBpdGVtXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBlbnRyb3B5O1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaW5mb3JtYXRpb25HYWluID0gKHRhcmdldE5vZGUsIHZhcmlhYmxlRGF0YSkgPT4ge1xyXG4gICAgICAgIGxldCBhcnJhbmdlRGF0YSA9IChsaXN0KSA9PiB7Ly9hcnJhbmdlIHRoZSBsaXN0IGludG8gYW4gb2JqZWN0IG9mIGNvdW50c1xyXG4gICAgICAgICAgICBsZXQgZGF0YSA9IHt9O1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpdGVtIG9mIGxpc3QpIHtcclxuICAgICAgICAgICAgICAgIGRhdGFbaXRlbV0gPSBkYXRhW2l0ZW1dIHx8IDA7XHJcbiAgICAgICAgICAgICAgICBkYXRhW2l0ZW1dKys7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGxldCB0YXJnZXREYXRhID0gYXJyYW5nZURhdGEodGFyZ2V0Tm9kZSk7XHJcblxyXG4gICAgICAgIGxldCB0YXJnZXRFbnRyb3B5ID0gdGhpcy5lbnRyb3B5KHRhcmdldERhdGEpOy8vZ2V0IHRoZSBlbnRyb3B5IG9mIHRoZSB0YXJnZXQgbm9kZVxyXG4gICAgICAgIGxldCBzdW1PZkluZm9ybWF0aW9uID0gMDsvL2luaXRpYWxpemUgc3VtIG9mIGluZm9ybWF0aW9uIGdhaW5cclxuXHJcbiAgICAgICAgbGV0IHZhcmlhYmxlVmFsdWVzID0gT2JqZWN0LnZhbHVlcyh2YXJpYWJsZURhdGEpOy8vZ2V0IHRoZSB2YWx1ZXMgb2YgdGhpcyB2YXJpYWJsZVxyXG4gICAgICAgIGxldCB2YXJpYWJsZUxlbmd0aCA9IDA7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmFyaWFibGVWYWx1ZXMubGVuZ3RoOyBpKyspIHsvL2dldCB0aGUgbGVuZ3RoIG9mIHRoZSB2YXJpYWJsZSBieSB0aGUgYWRkaW5nIHRoZSB2YWx1ZXNcclxuICAgICAgICAgICAgdmFyaWFibGVMZW5ndGggKz0gdmFyaWFibGVWYWx1ZXNbaV0ubGVuZ3RoO1xyXG4gICAgICAgICAgICB2YXJpYWJsZVZhbHVlc1tpXSA9IGFycmFuZ2VEYXRhKHZhcmlhYmxlVmFsdWVzW2ldKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IHYgb2YgdmFyaWFibGVWYWx1ZXMpIHsvL2dldCB0aGUgZW50cm9weSBvZiBlYWNoIGFuZCBtdWx0aXBseSBieSB0aGUgcHJvYmFiaWxpdHlcclxuICAgICAgICAgICAgc3VtT2ZJbmZvcm1hdGlvbiArPSAobWF0aExpYnJhcnkuc3VtKE9iamVjdC52YWx1ZXModikpIC8gdmFyaWFibGVMZW5ndGgpICogdGhpcy5lbnRyb3B5KHYpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGluZm9ybWF0aW9uR2FpbiA9IHRhcmdldEVudHJvcHkgLSBzdW1PZkluZm9ybWF0aW9uO1xyXG4gICAgICAgIHJldHVybiBpbmZvcm1hdGlvbkdhaW47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5oaWdoZXN0SW5mb3JtYXRpb25HYWluTm9kZSA9IChkYXRhLCBub2RlcykgPT4ge1xyXG4gICAgICAgIGxldCBnYWluZWRJbmZvcm1hdGlvbiA9IHt9O1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpIGluIG5vZGVzKSB7XHJcbiAgICAgICAgICAgIGdhaW5lZEluZm9ybWF0aW9uW2ldID0gdGhpcy5pbmZvcm1hdGlvbkdhaW4oZGF0YSwgbm9kZXNbaV0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG9iamVjdExpYnJhcnkubWF4KGdhaW5lZEluZm9ybWF0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnF1YXJ0aWxlUmFuZ2UgPSAoZGF0YSkgPT4ge1xyXG5cclxuICAgICAgICBsZXQgbWlkZGxlID0gKF9kdCkgPT4gey8vZ2V0IHRoZSBtaWRkbGUgcG9zaXRpb24gb2YgYSBsaXN0IG9mIG51bWJlcnNcclxuICAgICAgICAgICAgbGV0IG1pZGRsZTtcclxuICAgICAgICAgICAgaWYgKChfZHQubGVuZ3RoKSAlIDIgPT0gMCkgey8vaWYgdGhlIGxpc3QgY291bnQgaXMgbm90IGV2ZW5cclxuICAgICAgICAgICAgICAgIG1pZGRsZSA9IFtNYXRoLmNlaWwoX2R0Lmxlbmd0aCAvIDIpIC0gMSwgTWF0aC5jZWlsKF9kdC5sZW5ndGggLyAyKV07Ly9nZXQgdGhlIHR3byBpbiB0aGUgbWlkZGxlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBtaWRkbGUgPSBbTWF0aC5jZWlsKF9kdC5sZW5ndGggLyAyKSAtIDFdO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbWlkZGxlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGdldE1pZGRsZSA9IChfZHQpID0+IHsvLyBnZXQgdGhlIGl0ZW1zIGluIHRoZSBtaWRkbGUgb2YgYSBsaXN0XHJcbiAgICAgICAgICAgIGxldCBbbWlkZGxlMSwgbWlkZGxlMl0gPSBtaWRkbGUoX2R0KTtcclxuICAgICAgICAgICAgbGV0IG1pZGRsZXMgPSBbXTtcclxuICAgICAgICAgICAgbWlkZGxlcy5wdXNoKF9kdFttaWRkbGUxXSk7XHJcbiAgICAgICAgICAgIGlmIChtaWRkbGUyICE9IHVuZGVmaW5lZCkgbWlkZGxlcy5wdXNoKF9kdFttaWRkbGUyXSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbWlkZGxlcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBoYWxmcyA9IChfZHQpID0+IHsvL2RpdmlkZSBhIGxpc3QgaW50byB0d28gZXF1YWwgaGFsZnNcclxuICAgICAgICAgICAgbGV0IFttaWRkbGUxLCBtaWRkbGUyXSA9IG1pZGRsZShfZHQpO1xyXG4gICAgICAgICAgICBpZiAobWlkZGxlMiA9PSB1bmRlZmluZWQpIG1pZGRsZTIgPSBtaWRkbGUxO1xyXG4gICAgICAgICAgICBsZXQgaGFsZjEgPSBfZHQuc2xpY2UoMCwgbWlkZGxlMSk7XHJcbiAgICAgICAgICAgIGxldCBoYWxmMiA9IF9kdC5zbGljZShtaWRkbGUyICsgMSk7XHJcbiAgICAgICAgICAgIHJldHVybiBbaGFsZjEsIGhhbGYyXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBsYXllcnMgPSBoYWxmcyhkYXRhKTsvL2dldCB0aGUgaGFsZnMgb2YgdGhlIGxpc3RcclxuICAgICAgICBsZXQgW2xheWVyMSwgbGF5ZXIyXSA9IGhhbGZzKGxheWVyc1swXSk7Ly9kaXZpZGUgZWFjaCBoYWxmIGludG8gaGFsZnNcclxuICAgICAgICBsZXQgW2xheWVyMywgbGF5ZXI0XSA9IGhhbGZzKGxheWVyc1sxXSk7XHJcblxyXG4gICAgICAgIGxldCBtaWRkbGUxID0gZ2V0TWlkZGxlKGxheWVyc1swXSk7Ly9nZXQgdGhlIG1pZGRsZSBvZiB0aGUgZmlyc3QgbGF5ZXJzXHJcbiAgICAgICAgbGV0IG1pZGRsZTMgPSBnZXRNaWRkbGUobGF5ZXJzWzFdKTtcclxuXHJcbiAgICAgICAgbGV0IHExID0gbWF0aExpYnJhcnkubWVkaWFuKG1pZGRsZTEpOy8vZ2V0IHRoZSBtZWRpYW4gb2YgdGhlIGZpcnN0IGFuZCBsYXN0IGxheWVyc1xyXG4gICAgICAgIGxldCBxMyA9IG1hdGhMaWJyYXJ5Lm1lZGlhbihtaWRkbGUzKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHEzIC0gcTE7Ly9maW5kIHRoZSByYW5nZVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubm9ybWFsaXplRGF0YSA9IChkYXRhKSA9PiB7XHJcbiAgICAgICAgZGF0YS5zb3J0KChhLCBiKSA9PiB7IHJldHVybiBhIC0gYiB9KTtcclxuICAgICAgICB2YXIgbWF4ID0gZGF0YVtkYXRhLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgIHZhciBtaW4gPSBkYXRhWzBdO1xyXG4gICAgICAgIHZhciBub3JtYWxpemVkID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIG5vcm1hbGl6ZWQucHVzaCgoZGF0YVtpXSAtIG1pbikgLyAobWF4IC0gbWluKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBub3JtYWxpemVkO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFuYWx5c2lzTGlicmFyeTsiLCJjb25zdCBGdW5jID0gcmVxdWlyZSgnLi8uLi9jbGFzc2VzL0Z1bmMnKTtcclxubGV0IGZ1bmMgPSBuZXcgRnVuYygpO1xyXG5cclxuZnVuY3Rpb24gQXBwTGlicmFyeSgpIHtcclxuICAgIHRoaXMubWFrZVdlYmFwcCA9IChjYWxsYmFjayA9ICgpID0+IHsgfSkgPT4ge1xyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICBsZXQgYW5jaG9yID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgICAgICAgICBsZXQgcGFyZW50QW5jaG9yID0gZXZlbnQudGFyZ2V0LmdldFBhcmVudHMoJ2EnKTtcclxuICAgICAgICAgICAgbGV0IHVybCA9IGFuY2hvci5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTsvL2NoZWNrIHdoZW4gYSB1cmwgaXMgYWJvdXQgdG8gYmUgb3BlblxyXG5cclxuICAgICAgICAgICAgaWYgKGFuY2hvci5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpICE9ICdhJyAmJiAhZnVuYy5pc251bGwocGFyZW50QW5jaG9yKSkge1xyXG4gICAgICAgICAgICAgICAgYW5jaG9yID0gcGFyZW50QW5jaG9yO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZnVuYy5pc251bGwodXJsKSAmJiAhZnVuYy5pc251bGwocGFyZW50QW5jaG9yKSkge1xyXG4gICAgICAgICAgICAgICAgYW5jaG9yID0gcGFyZW50QW5jaG9yO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vZ2V0IHRoZSBhbmNob3IgZWxlbWVudFxyXG4gICAgICAgICAgICB1cmwgPSBhbmNob3IuZ2V0QXR0cmlidXRlKCdocmVmJyk7XHJcbiAgICAgICAgICAgIGxldCB0YXJnZXQgPSBhbmNob3IuZ2V0QXR0cmlidXRlKCd0YXJnZXQnKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0YXJnZXQgPT0gJ19ibGFuaycpIHsvL2NoZWNrIGlmIGl0IGlzIGZvciBuZXcgcGFnZVxyXG4gICAgICAgICAgICAgICAgd2luZG93Lm9wZW4odGhpcy5wcmVwYXJlVXJsKHVybCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKCFmdW5jLmlzbnVsbCh1cmwpKSB7XHJcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpOy8vYmxvY2sgYW5kIG9wZW4gaW5zaWRlIGFzIHdlYmFwcFxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucHJlcGFyZVVybCh1cmwpICE9IGxvY2F0aW9uLmhyZWYpIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSgncGFnZScsICd0aXRsZScsIHVybCk7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHdpbmRvdy5vbnBvcHN0YXRlID0gY2FsbGJhY2s7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5wcmVwYXJlVXJsID0gKHVybCA9ICcnKSA9PiB7XHJcbiAgICAgICAgaWYgKCF1cmwuaW5jbHVkZXMobG9jYXRpb24ub3JpZ2luKSkge1xyXG4gICAgICAgICAgICBsZXQgc3BsaXRVcmwgPSBmdW5jLnVybFNwbGl0dGVyKHVybCk7XHJcbiAgICAgICAgICAgIGlmIChzcGxpdFVybC5sb2NhdGlvbiA9PSBsb2NhdGlvbi5vcmlnaW4pIHtcclxuICAgICAgICAgICAgICAgIHVybCA9IGxvY2F0aW9uLm9yaWdpbiArICcvJyArIHVybDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICghdXJsLmluY2x1ZGVzKGxvY2F0aW9uLnByb3RvY29sKSkge1xyXG4gICAgICAgICAgICB1cmwgPSBsb2NhdGlvbi5wcm90b2NvbCArICcvLycgKyB1cmw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdXJsO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuYWpheCA9IChwYXJhbXMgPSB7IGFzeW5jOiB0cnVlLCBkYXRhOiB7fSwgdXJsOiAnJywgbWV0aG9kOiAnJywgc2VjdXJlZDogZmFsc2UgfSkgPT4ge1xyXG4gICAgICAgIHBhcmFtcy5hc3luYyA9IHBhcmFtcy5hc3luYyB8fCB0cnVlO1xyXG4gICAgICAgIHBhcmFtcy5kYXRhID0gcGFyYW1zLmRhdGEgfHwge307XHJcbiAgICAgICAgcGFyYW1zLnVybCA9IHBhcmFtcy51cmwgfHwgJy4vJztcclxuICAgICAgICBwYXJhbXMubWV0aG9kID0gcGFyYW1zLm1ldGhvZCB8fCAnUE9TVCc7XHJcbiAgICAgICAgcGFyYW1zLnNlY3VyZWQgPSBwYXJhbXMuc2VjdXJlZCB8fCBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYgKHBhcmFtcy5zZWN1cmVkKSB7XHJcbiAgICAgICAgICAgIHBhcmFtcy51cmwgPSAnaHR0cHM6Ly9jb3JzLWFueXdoZXJlLmhlcm9rdWFwcC5jb20vJyArIHBhcmFtcy51cmw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgZGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgICAgIGlmIChwYXJhbXMuZGF0YSBpbnN0YW5jZW9mIEZvcm1EYXRhKSB7XHJcbiAgICAgICAgICAgIGRhdGEgPSBwYXJhbXMuZGF0YTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgaW4gcGFyYW1zLmRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGRhdGEuYXBwZW5kKGksIHBhcmFtcy5kYXRhW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5yZWFkeVN0YXRlID09IDQgJiYgdGhpcy5zdGF0dXMgPT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBpZiAoZnVuYy5pc3NldChwYXJhbXMub25wcm9ncmVzcykpIHtcclxuICAgICAgICAgICAgICAgIHJlcXVlc3QudXBsb2FkLm9ucHJvZ3Jlc3MgPSAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBwYXJhbXMub25wcm9ncmVzcygoZXZlbnQubG9hZGVkIC8gZXZlbnQudG90YWwpICogNTApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJlcXVlc3Qub25wcm9ncmVzcyA9IChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcy5vbnByb2dyZXNzKChldmVudC5sb2FkZWQgLyBldmVudC50b3RhbCkgKiAxMDApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0Lm9uZXJyb3IgPSAoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0Lm9wZW4ocGFyYW1zLm1ldGhvZCwgcGFyYW1zLnVybCwgcGFyYW1zLmFzeW5jKTtcclxuICAgICAgICAgICAgcmVxdWVzdC5zZW5kKGRhdGEpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFwcExpYnJhcnk7IiwiZnVuY3Rpb24gQXJyYXlMaWJyYXJ5KCkge1xyXG5cclxuICAgIHRoaXMuY29tYmluZSA9IChoYXlzdGFjaywgZmlyc3QsIHNlY29uZCwgcG9zKSA9PiB7Ly91c2VkIHRvIGdldCB3aGF0IGlzIGJldHdlZW4gdHdvIGl0ZW1zIGF0IGEgcGFydGljdWxhciBvY2N1cnJhbmNlIGluIGFuIEFycmF5IGFuZCB0aGUgaXRlbXMgY29tYmluZWRcclxuICAgICAgICBwb3MgPSBwb3MgfHwgMDsvL2luaXRpYWxpemUgcG9zaXRpb24gaWYgbm90IHNldFxyXG4gICAgICAgIGxldCBhdDEgPSBwb3MsXHJcbiAgICAgICAgICAgIGF0MiA9IGZpcnN0ID09PSBzZWNvbmQgPyBwb3MgKyAxIDogcG9zOyAvL2NoZWNrIGlmIGl0IGlzIHRoZSBzYW1lIGFuZCBjaGFuZ2UgcG9zaXRpb25cclxuICAgICAgICBsZXQgc3RhcnQgPSB0aGlzLmluZGV4QXQoaGF5c3RhY2ssIGZpcnN0LCBhdDEpOy8vZ2V0IHRoZSBzdGFydFxyXG4gICAgICAgIGxldCBlbmQgPSB0aGlzLmluZGV4QXQoaGF5c3RhY2ssIHNlY29uZCwgYXQyKSArIDE7Ly9nZXQgdGhlIGVuZFxyXG5cclxuICAgICAgICBpZiAoc3RhcnQgPT0gLTEgfHwgZW5kID09IDApIHsvL251bGwgaWYgb25lIGlzIG5vdCBmb3VuZFxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBoYXlzdGFjay5zbGljZShzdGFydCwgZW5kKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmluQmV0d2VlbiA9IChoYXlzdGFjaywgZmlyc3QsIHNlY29uZCwgcG9zKSA9PiB7Ly91c2VkIHRvIGdldCB3aGF0IGlzIGJldHdlZW4gdHdvIGl0ZW1zIGF0IGEgcGFydGljdWxhciBvY2N1cnJhbmNlIGluIGFuIEFycmF5XHJcbiAgICAgICAgcG9zID0gcG9zIHx8IDA7Ly9pbml0aWFsaXplIHBvc2l0aW9uIGlmIG5vdCBzZXRcclxuICAgICAgICBsZXQgYXQxID0gcG9zLFxyXG4gICAgICAgICAgICBhdDIgPSBmaXJzdCA9PT0gc2Vjb25kID8gcG9zICsgMSA6IHBvczsgLy9jaGVjayBpZiBpdCBpcyB0aGUgc2FtZSBhbmQgY2hhbmdlIHBvc2l0aW9uXHJcbiAgICAgICAgbGV0IHN0YXJ0ID0gdGhpcy5pbmRleEF0KGhheXN0YWNrLCBmaXJzdCwgYXQxKSArIDE7Ly9nZXQgdGhlIHN0YXJ0XHJcbiAgICAgICAgbGV0IGVuZCA9IHRoaXMuaW5kZXhBdChoYXlzdGFjaywgc2Vjb25kLCBhdDIpOy8vZ2V0IHRoZSBlbmRcclxuXHJcbiAgICAgICAgaWYgKHN0YXJ0ID09IDAgfHwgZW5kID09IC0xKSB7Ly9udWxsIGlmIG9uZSBpcyBub3QgZm91bmRcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gaGF5c3RhY2suc2xpY2Uoc3RhcnQsIGVuZCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jb250YWlucyA9IChoYXlzdGFjaywgbmVlZGxlKSA9PiB7Ly91c2VkIHRvIGNoZWNrIGlmIGFuIEFycmF5IGhhcyBhbiBpdGVtXHJcbiAgICAgICAgbGV0IGZsYWcgPSBmYWxzZTsvL3NldCBmbGFnIHRvIGZhbHNlXHJcbiAgICAgICAgZm9yIChsZXQgaSBpbiBoYXlzdGFjaykge1xyXG4gICAgICAgICAgICBpZiAoaGF5c3RhY2tbaV0gPT0gbmVlZGxlKSB7Ly9pZiBmb3VuZCBicmVha291dFxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZsYWc7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5pbmRleEF0ID0gKGhheXN0YWNrLCBuZWVkbGUsIHBvcykgPT4gey8vdXNlZCB0byBnZXQgdGhlIGluZGV4IG9mIGFuIGl0ZW0gYXQgYSBwYXJ0aWN1bGFyIG9jY3VycmFuY2VcclxuICAgICAgICBwb3MgPSBwb3MgfHwgMDtcclxuICAgICAgICBsZXQgY291bnQgPSAtMTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGhheXN0YWNrLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChoYXlzdGFja1tpXSA9PSBuZWVkbGUpIHtcclxuICAgICAgICAgICAgICAgIGNvdW50Kys7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGNvdW50ID09IHBvcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gLTE7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5maW5kID0gKGhheXN0YWNrLCBjYWxsYmFjaykgPT4gey8vdXNlZCBhcyBhIGhpZ2hlciBvcmRlciBmdW5jdGlvbiB0byBnZXQgYW4gaXRlbXMgdGhhdCBtYXRjaCB0aGUgY29uZGl0aW9uc1xyXG4gICAgICAgIGZvciAobGV0IGkgaW4gaGF5c3RhY2spIHtcclxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKGhheXN0YWNrW2ldKSA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaGF5c3RhY2tbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5maW5kQWxsID0gKGhheXN0YWNrLCBjYWxsYmFjaykgPT4gey8vdXNlZCBhcyBhIGhpZ2hlciBvcmRlciBmdW5jdGlvbiB0byBnZXQgYWxsIHRoZSBpdGVtcyB0aGF0IG1hdGNoIHRoZSBjb25kaXRpb25zXHJcbiAgICAgICAgbGV0IHZhbHVlcyA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgaW4gaGF5c3RhY2spIHtcclxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKGhheXN0YWNrW2ldKSA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZXMucHVzaChoYXlzdGFja1tpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB2YWx1ZXM7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5nZXRPYmplY3QgPSAoaGF5c3RhY2ssIGtleSwgdmFsdWUpID0+IHsvL3VzZWQgdG8gZ2V0IGFuIE9iamVjdCB3aXRoIGFuIEl0ZW0gaW4gYSBKc29uQXJyYXlcclxuICAgICAgICBsZXQgb2JqZWN0O1xyXG4gICAgICAgIGZvciAobGV0IGkgaW4gaGF5c3RhY2spIHtcclxuICAgICAgICAgICAgaWYgKGhheXN0YWNrW2ldW2tleV0gPT0gdmFsdWUpIG9iamVjdCA9IGhheXN0YWNrW2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb2JqZWN0O1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZ2V0QWxsT2JqZWN0cyA9IChoYXlzdGFjaywga2V5LCB2YWx1ZSkgPT4gey8vdXNlZCB0byBnZXQgYWxsIG9jY3VycmFuY2VzIG9mIGFuIE9iamVjdCB3aXRoIGFuIEl0ZW0gaW4gYSBKc29uQXJyYXlcclxuICAgICAgICBsZXQgbmV3QXJyYXkgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpIGluIGhheXN0YWNrKSB7XHJcbiAgICAgICAgICAgIGlmIChoYXlzdGFja1tpXVtrZXldID09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdBcnJheS5wdXNoKGhheXN0YWNrW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3QXJyYXk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5nZXRBbGwgPSAoaGF5c3RhY2ssIG5lZWRsZSkgPT4gey8vdXNlZCB0byBhbGwgb2NjdXJyYW5jZXMgb2YgYW4gaXRlbSBpbiBhbiBBcnJheVxyXG4gICAgICAgIGxldCBuZXdBcnJheSA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgaW4gaGF5c3RhY2spIHtcclxuICAgICAgICAgICAgaWYgKGhheXN0YWNrW2ldID09IG5lZWRsZSkgbmV3QXJyYXkucHVzaChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ld0FycmF5O1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucmVtb3ZlQWxsID0gKGhheXN0YWNrLCBuZWVkbGUpID0+IHsvL3VzZWQgdG8gcmVtb3ZlIGluc3RhbmNlcyBvZiBhbiBpdGVtXHJcbiAgICAgICAgbGV0IG5ld0FycmF5ID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaSBvZiBoYXlzdGFjaykge1xyXG4gICAgICAgICAgICBpZiAoaSAhPSBuZWVkbGUpIHtcclxuICAgICAgICAgICAgICAgIG5ld0FycmF5LnB1c2goaSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ld0FycmF5O1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucHV0QXQgPSAoaGF5c3RhY2sgPSBbXSwgdmFsdWUsIGtleSA9IDApID0+IHsvL3VzZWQgdG8gcHVzaCBhbiBpdGVtIGludG8gYW4gaW5kZXggaW4gQXJyYXlcclxuICAgICAgICBsZXQgbmV3QXJyYXkgPSBbXTsvL3N0b3JhZ2VcclxuICAgICAgICBmb3IgKGxldCBpIGluIGhheXN0YWNrKSB7XHJcbiAgICAgICAgICAgIGlmIChpID09IGtleSkgey8vbWF0Y2hlZFxyXG4gICAgICAgICAgICAgICAgbmV3QXJyYXlbaV0gPSB2YWx1ZTsvL3B1c2ggaW4gdGhlIHZhbHVlXHJcbiAgICAgICAgICAgICAgICBsZXQgbmV4dCA9IE1hdGguZmxvb3Ioa2V5KTsvL2NoZWNrIGlmIGl0J3MgYSBudW1iZXJcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaXNOYU4obmV4dCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXh0ID0ga2V5ICsgMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIG5leHQrKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIG5ld0FycmF5W25leHRdID0gaGF5c3RhY2tbaV07Ly9hZGQgdGhlIHByZXZpb3VzIHZhbHVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBuZXdBcnJheVtpXSA9IGhheXN0YWNrW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbmV3QXJyYXk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5wdXNoQXJyYXkgPSAoaGF5c3RhY2sgPSBbXSwgbmVlZGxlLCBpbnNlcnQpID0+IHsvL3VzZWQgdG8gcHVzaCBpbiBhbiBpdGVtIGJlZm9yZSBhbm90aGVyIGV4aXN0aW5nIGl0ZW0gaW4gYW4gQXJyYXlcclxuICAgICAgICBsZXQgcG9zaXRpb24gPSB0aGlzLmFycmF5SW5kZXgoaGF5c3RhY2ssIG5lZWRsZSk7Ly9nZXQgdGhlIGV4aXN0aW5nIGl0ZW0gcG9zaXRpb25cclxuICAgICAgICBsZXQgbmV3QXJyYXkgPSB0aGlzLnB1dEF0KGhheXN0YWNrLCBpbnNlcnQsIHBvc2l0aW9uKTsvL3B1c2ggaW4gbmV3IGl0ZW1cclxuICAgICAgICByZXR1cm4gbmV3QXJyYXk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5hcnJheUluZGV4ID0gKGhheXN0YWNrID0gW10sIG5lZWRsZSA9IFtdKSA9PiB7Ly91c2VkIHRvIGdldCBwb3NpdGlvbiBvZiBhbiBpdGVtIGluIGFuIEFycmF5XHJcbiAgICAgICAgZm9yIChsZXQgaSBpbiBoYXlzdGFjaykge1xyXG4gICAgICAgICAgICBpZiAoSlNPTi5zdHJpbmdpZnkoaGF5c3RhY2tbaV0pID09IEpTT04uc3RyaW5naWZ5KG5lZWRsZSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmhhc0FycmF5ID0gKGhheXN0YWNrID0gW10sIG5lZWRsZSA9IFtdKSA9PiB7Ly91c2VkIHRvIGNoZWNrIGlmIGFuIEFycmF5IGlzIGEgc3ViLUFycmF5IHRvIGFub3RoZXIgQXJyYXlcclxuICAgICAgICBoYXlzdGFjayA9IEpTT04uc3RyaW5naWZ5KGhheXN0YWNrKTtcclxuICAgICAgICBuZWVkbGUgPSBKU09OLnN0cmluZ2lmeShuZWVkbGUpO1xyXG5cclxuICAgICAgICByZXR1cm4gaGF5c3RhY2suaW5kZXhPZihuZWVkbGUpICE9IC0xO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudG9PYmplY3QgPSAoYXJyYXkgPSBbXSwga2V5KSA9PiB7Ly91c2VkIHRvIHR1cm4gYW4gSnNvbkFycmF5IHRvIGFuIE9iamVjdCBsaXRlcmFsXHJcbiAgICAgICAgbGV0IG9iamVjdCA9IHt9Oy8vc3RvcmFnZVxyXG4gICAgICAgIGZvciAobGV0IGkgaW4gYXJyYXkpIHtcclxuICAgICAgICAgICAgb2JqZWN0W2FycmF5W2ldW2tleV1dID0gYXJyYXlbaV07Ly9zdG9yZSB0aGUgaW50ZW5kZWQgW2tleSwgdmFsdWVdXHJcbiAgICAgICAgICAgIGRlbGV0ZSBvYmplY3RbYXJyYXlbaV1ba2V5XV1ba2V5XTsvL3JlbW92ZSB0aGUga2V5IGluIHRoZSB2YWx1ZVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb2JqZWN0O1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucmVzaGFwZSA9IChwYXJhbXMpID0+IHsvL3VzZWQgdG8gY2hhbmdlIHRoZSBzaGFwZSBvZiBhbiBBcnJheVxyXG4gICAgICAgIC8vIFBlbmRpbmdcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnJhbmRvbVBpY2sgPSAoYXJyYXkpID0+IHsvL3VzZWQgdG8gcGljayBhIHJhbmRvbSBpdGVtIGZyb20gYW4gQXJyYXlcclxuICAgICAgICByZXR1cm4gYXJyYXlbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogYXJyYXkubGVuZ3RoKV07XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMucmVtb3ZlRW1wdHkgPSAoYXJyYXkgPSBbXSkgPT4gey8vdXNlZCB0byB0cnVuY2F0ZSBhbiBBcnJheVxyXG4gICAgICAgIGxldCBuZXdBcnJheSA9IFtdOy8vc3RvcmFnZVxyXG4gICAgICAgIGZvciAobGV0IGkgaW4gYXJyYXkpIHtcclxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYXJyYXlbaV0pICYmIGFycmF5W2ldLmxlbmd0aCA+IDApIHsvL2lmIGFycmF5IGdvIGRlZXBcclxuICAgICAgICAgICAgICAgIG5ld0FycmF5LnB1c2godGhpcy5yZW1vdmVFbXB0eShhcnJheVtpXSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGFycmF5W2ldICE9IHVuZGVmaW5lZCAmJiBhcnJheVtpXSAhPSBudWxsICYmIGFycmF5W2ldICE9IDAgJiYgYXJyYXlbaV0gIT0gJycpIHsvL3NraXAgW3VuZGVmaW5lZCwgbnVsbCwgMCwgJyddXHJcbiAgICAgICAgICAgICAgICBuZXdBcnJheS5wdXNoKGFycmF5W2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3QXJyYXk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5lYWNoID0gKGFycmF5ID0gW10sIGNhbGxiYWNrID0gKCkgPT4geyB9KSA9PiB7Ly91c2VkIGFzIGEgaGlnaGVyIG9yZGVyIEFycmF5IGZ1bmN0aW9uXHJcbiAgICAgICAgbGV0IG5ld0FycmF5ID0gW107Ly9zdG9yYWdlXHJcbiAgICAgICAgZm9yIChsZXQgaSBpbiBhcnJheSkge1xyXG4gICAgICAgICAgICBuZXdBcnJheS5wdXNoKGNhbGxiYWNrKGFycmF5W2ldLCBpKSk7Ly9tYWtlIGNoYW5nZXMgdG8gdGhlIGl0ZW0gYW5kIHN0b3JlIGl0LlxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3QXJyYXk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5oYXNBcnJheUVsZW1lbnQgPSAoaGF5c3RhY2sgPSBbXSwgbmVlZGxlID0gW10pID0+IHsvL3VzZWQgdG8gY2hlY2sgaWYgdHdvIGFycmF5cyBoYXMgYW4gaXRlbSBpbiBjb21tb25cclxuICAgICAgICBsZXQgZmxhZyA9IGZhbHNlO1xyXG4gICAgICAgIGZvciAobGV0IGkgaW4gbmVlZGxlKSB7XHJcbiAgICAgICAgICAgIGlmIChoYXlzdGFjay5pbmRleE9mKG5lZWRsZVtpXSkgIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmbGFnO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudG9TZXQgPSAoaGF5c3RhY2sgPSBbXSkgPT4gey8vdXNlZCB0byB0dXJuIGFuIEFycmF5IGludG8gYSBzZXQoTWFrZSBzdXJlIHRoZXJlIGEgbm8gZHVwbGljYXRlcylcclxuICAgICAgICBsZXQgc2luZ2xlID0gW107Ly9zdG9yYWdlXHJcbiAgICAgICAgZm9yIChsZXQgaSBpbiBoYXlzdGFjaykgey8vc2tpcCBpZiBhbHJlYWR5IHN0b3JlZFxyXG4gICAgICAgICAgICBpZiAoc2luZ2xlLmluZGV4T2YoaGF5c3RhY2tbaV0pID09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBzaW5nbGUucHVzaChoYXlzdGFja1tpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHNpbmdsZTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnBvcEluZGV4ID0gKGFycmF5ID0gW10sIGluZGV4KSA9PiB7Ly91c2VkIHRvIHJlbW92ZSBhbiBpdGVtIGF0IGEgcG9zaXRpb24gaW4gYW4gQXJyYXlcclxuICAgICAgICBsZXQgbmV3QXJyYXkgPSBbXTsvL3N0b3JhZ2UgQXJyYXlcclxuICAgICAgICBmb3IgKGxldCBpIGluIGFycmF5KSB7XHJcbiAgICAgICAgICAgIGlmIChpICE9IGluZGV4KSB7Ly9za2lwIHRoZSBwb3NpdGlvblxyXG4gICAgICAgICAgICAgICAgbmV3QXJyYXkucHVzaChhcnJheVtpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ld0FycmF5O1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZGF0YVR5cGUgPSAoYXJyYXkgPSBbXSkgPT4gey8vdXNlZCB0byBnZXQgdGhlIGRhdGF0eXBlcyBpbnNpZGUgYW4gQXJyYXlcclxuICAgICAgICBsZXQgdHlwZSA9IHR5cGVvZiBhcnJheVswXTsvL2dldCB0aGUgaW5kZXh0IHR5cGVcclxuICAgICAgICBmb3IgKGxldCBpIGluIGFycmF5KSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgYXJyYXlbaV0gIT0gdHlwZSkgey8vaWYgdHdvIHR5cGVzIGRvIG5vdCBtYXRjaCByZXR1cm4gbWl4ZWRcclxuICAgICAgICAgICAgICAgIHJldHVybiAnbWl4ZWQnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0eXBlO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBBcnJheUxpYnJhcnk7IiwiY29uc3QgVGVtcGxhdGUgPSByZXF1aXJlKCcuLi9jbGFzc2VzL1RlbXBsYXRlJyk7XHJcblxyXG5mdW5jdGlvbiBDb2xvclBpY2tlcih3aW5kb3cgPSB7fSkge1xyXG4gICAgY29uc3QgYmFzZSA9IG5ldyBUZW1wbGF0ZSh3aW5kb3cpO1xyXG5cclxuICAgIHRoaXMuY29sb3JJbmRpY2F0b3JQb3NpdGlvbiA9IHsgeDogMCwgeTogMCB9O1xyXG4gICAgdGhpcy5vcGFjaXR5SW5kaWNhdG9yUG9zaXRpb24gPSB7IHg6IDAsIHk6IDAgfTtcclxuICAgIHRoaXMuY29udmVydFRvID0gJ1JHQic7XHJcblxyXG4gICAgdGhpcy5pbml0ID0gKHBhcmFtcyA9IHt9KSA9PiB7XHJcbiAgICAgICAgdGhpcy5waWNrZXIgPSBiYXNlLmNyZWF0ZUVsZW1lbnQoe1xyXG4gICAgICAgICAgICBlbGVtZW50OiAnZGl2JywgYXR0cmlidXRlczogeyBjbGFzczogJ2NvbG9yLXBpY2tlcicgfSwgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50OiAnc3BhbicsIGF0dHJpYnV0ZXM6IHsgaWQ6ICdjb2xvci1waWNrZXItc2V0dGVycycgfSwgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudDogJ3NwYW4nLCBhdHRyaWJ1dGVzOiB7IGlkOiAnY29sb3ItcGlja2VyLWNvbG9ycy13aW5kb3cnIH0sIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBlbGVtZW50OiAnY2FudmFzJywgYXR0cmlidXRlczogeyBpZDogJ2NvbG9yLXBpY2tlci1jb2xvcnMnIH0gfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGVsZW1lbnQ6ICdzcGFuJywgYXR0cmlidXRlczogeyBpZDogJ2NvbG9yLXBpY2tlci1jb2xvci1pbmRpY2F0b3InIH0gfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50OiAnc3BhbicsIGF0dHJpYnV0ZXM6IHsgaWQ6ICdjb2xvci1waWNrZXItb3BhY2l0aWVzLXdpbmRvdycgfSwgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGVsZW1lbnQ6ICdjYW52YXMnLCBhdHRyaWJ1dGVzOiB7IGlkOiAnY29sb3ItcGlja2VyLW9wYWNpdGllcycgfSB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgZWxlbWVudDogJ3NwYW4nLCBhdHRyaWJ1dGVzOiB7IGlkOiAnY29sb3ItcGlja2VyLW9wYWNpdHktaW5kaWNhdG9yJyB9IH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudDogJ2RpdicsIGF0dHJpYnV0ZXM6IHsgaWQ6ICdjb2xvci1waWNrZXItcmVzdWx0JyB9LCBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB7IGVsZW1lbnQ6ICdzcGFuJywgYXR0cmlidXRlczogeyBpZDogJ3BpY2tlZC1jb2xvcicgfSB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50OiAnc3BhbicsIGF0dHJpYnV0ZXM6IHsgaWQ6ICdwaWNrZWQtY29sb3Itd2luZG93JyB9LCBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgZWxlbWVudDogJ3NlbGVjdCcsIGF0dHJpYnV0ZXM6IHsgaWQ6ICdwaWNrZWQtY29sb3Itc2V0dGVyJyB9LCBvcHRpb25zOiBbJ1JHQicsICdIRVgnLCAnSFNMJ10gfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGVsZW1lbnQ6ICdzcGFuJywgYXR0cmlidXRlczogeyBpZDogJ3BpY2tlZC1jb2xvci12YWx1ZScgfSB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQ6ICdzdHlsZScsXHJcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlczogeyB0eXBlOiAndGV4dC9jc3MnLCByZWw6ICdzdHlsZXNoZWV0JyB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGAuY29sb3ItcGlja2VyIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogLjVlbTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogZ3JpZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgei1pbmRleDogMjA7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICNjb2xvci1waWNrZXItc2V0dGVycyB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGdyaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyIG1pbi1jb250ZW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnYXA6IDFlbTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBpbmhlcml0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogaW5oZXJpdDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgI2NvbG9yLXBpY2tlci1jb2xvcnMtd2luZG93IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIGdyYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgI2NvbG9yLXBpY2tlci1vcGFjaXRpZXMtd2luZG93IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDIwcHg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCBncmF5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG92ZXJmbG93OiBoaWRkZW47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICNjb2xvci1waWNrZXItY29sb3ItaW5kaWNhdG9yIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAuNWVtO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMTAwJTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAwO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAjY29sb3ItcGlja2VyLW9wYWNpdHktaW5kaWNhdG9yIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAuMmVtO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAwO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAjY29sb3ItcGlja2VyLXJlc3VsdCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW46IC4xZW0gMGVtO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAjcGlja2VkLWNvbG9yIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDUwcHg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogMzBweDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICNwaWNrZWQtY29sb3Itd2luZG93IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogZ3JpZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2FwOiAuM2VtO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IG1heC1jb250ZW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBncmlkLXRlbXBsYXRlLXJvd3M6IHJlcGVhdCgyLCAxZnIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5LWl0ZW1zOiBsZWZ0O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAjcGlja2VkLWNvbG9yLXZhbHVlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogaW5saW5lLWZsZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogYmxhY2s7XHJcbiAgICAgICAgICAgICAgICAgICAgfWBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmNvbG9yV2luZG93ID0gdGhpcy5waWNrZXIuZmluZCgnI2NvbG9yLXBpY2tlci1jb2xvcnMtd2luZG93Jyk7XHJcbiAgICAgICAgdGhpcy5vcGFjaXR5V2luZG93ID0gdGhpcy5waWNrZXIuZmluZCgnI2NvbG9yLXBpY2tlci1vcGFjaXRpZXMtd2luZG93Jyk7XHJcbiAgICAgICAgdGhpcy5jb2xvckNhbnZhcyA9IHRoaXMucGlja2VyLmZpbmQoJyNjb2xvci1waWNrZXItY29sb3JzJyk7XHJcbiAgICAgICAgdGhpcy5vcGFjaXR5Q2FudmFzID0gdGhpcy5waWNrZXIuZmluZCgnI2NvbG9yLXBpY2tlci1vcGFjaXRpZXMnKTtcclxuICAgICAgICB0aGlzLmNvbG9yTWFya2VyID0gdGhpcy5waWNrZXIuZmluZCgnI2NvbG9yLXBpY2tlci1jb2xvci1pbmRpY2F0b3InKTtcclxuICAgICAgICB0aGlzLm9wYWNpdHlNYXJrZXIgPSB0aGlzLnBpY2tlci5maW5kKCcjY29sb3ItcGlja2VyLW9wYWNpdHktaW5kaWNhdG9yJyk7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IHBhcmFtcy53aWR0aCA/IHBhcmFtcy53aWR0aCA6IDMwMDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IHBhcmFtcy5oZWlnaHQgPyBwYXJhbXMuaGVpZ2h0IDogMzAwO1xyXG4gICAgICAgIHRoaXMucGlja2VkQ29sb3IgPSBwYXJhbXMuY29sb3IgPyBwYXJhbXMuY29sb3IgOiAncmdiKDAsIDAsIDApJztcclxuICAgICAgICB0aGlzLmNvbG9yV2luZG93LmNzcyh7IGhlaWdodDogdGhpcy5oZWlnaHQgKyAncHgnIH0pO1xyXG4gICAgICAgIHRoaXMuY29sb3JDYW52YXMud2lkdGggPSB0aGlzLndpZHRoO1xyXG4gICAgICAgIHRoaXMuY29sb3JDYW52YXMuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5vcGFjaXR5V2luZG93LmNzcyh7IGhlaWdodDogdGhpcy5oZWlnaHQgKyAncHgnIH0pO1xyXG4gICAgICAgIHRoaXMub3BhY2l0eUNhbnZhcy5oZWlnaHQgPSB0aGlzLmhlaWdodDtcclxuICAgICAgICB0aGlzLm9wYWNpdHlDYW52YXMud2lkdGggPSAyMDtcclxuXHJcbiAgICAgICAgLy90aGUgY29udGV4dFxyXG4gICAgICAgIHRoaXMuY29sb3JDb250ZXh0ID0gdGhpcy5jb2xvckNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgICAgIHRoaXMub3BhY2l0eUNvbnRleHQgPSB0aGlzLm9wYWNpdHlDYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuXHJcbiAgICAgICAgdGhpcy5waWNrZXIuZmluZCgnI3BpY2tlZC1jb2xvci12YWx1ZScpLmlubmVyVGV4dCA9IHRoaXMucGlja2VkQ29sb3I7XHJcbiAgICAgICAgdGhpcy5waWNrZXIuZmluZCgnI3BpY2tlZC1jb2xvci1zZXR0ZXInKS5vbkNoYW5nZWQodmFsdWUgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnZlcnRUbyA9IHZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLnJlcGx5KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMubGlzdGVuKCk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnBpY2tlcjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmNhbGlicmF0ZUNvbG9yID0gKCkgPT4ge1xyXG4gICAgICAgIGxldCBjb2xvckdyYWRpZW50ID0gdGhpcy5jb2xvckNvbnRleHQuY3JlYXRlTGluZWFyR3JhZGllbnQoMCwgMCwgdGhpcy53aWR0aCwgMCk7XHJcblxyXG4gICAgICAgIC8vY29sb3Igc3RvcHNcclxuICAgICAgICBjb2xvckdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCBcInJnYigyNTUsIDAsIDApXCIpO1xyXG4gICAgICAgIGNvbG9yR3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuMTUsIFwicmdiKDI1NSwgMCwgMjU1KVwiKTtcclxuICAgICAgICBjb2xvckdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjMzLCBcInJnYigwLCAwLCAyNTUpXCIpO1xyXG4gICAgICAgIGNvbG9yR3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuNDksIFwicmdiKDAsIDI1NSwgMjU1KVwiKTtcclxuICAgICAgICBjb2xvckdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjY3LCBcInJnYigwLCAyNTUsIDApXCIpO1xyXG4gICAgICAgIGNvbG9yR3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuODcsIFwicmdiKDI1NSwgMjU1LCAwKVwiKTtcclxuICAgICAgICBjb2xvckdyYWRpZW50LmFkZENvbG9yU3RvcCgxLCBcInJnYigyNTUsIDAsIDApXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbG9yQ29udGV4dC5maWxsU3R5bGUgPSBjb2xvckdyYWRpZW50O1xyXG4gICAgICAgIHRoaXMuY29sb3JDb250ZXh0LmZpbGxSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgLy9hZGQgYmxhY2sgYW5kIHdoaXRlIHN0b3BzXHJcbiAgICAgICAgY29sb3JHcmFkaWVudCA9IHRoaXMuY29sb3JDb250ZXh0LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIDAsIHRoaXMuaGVpZ2h0KTtcclxuICAgICAgICBjb2xvckdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCBcInJnYmEoMjU1LCAyNTUsIDI1NSwgMSlcIik7XHJcbiAgICAgICAgY29sb3JHcmFkaWVudC5hZGRDb2xvclN0b3AoMC41LCBcInJnYmEoMjU1LCAyNTUsIDI1NSwgMClcIik7XHJcbiAgICAgICAgY29sb3JHcmFkaWVudC5hZGRDb2xvclN0b3AoMC41LCBcInJnYmEoMCwgMCwgMCwgMClcIik7XHJcbiAgICAgICAgY29sb3JHcmFkaWVudC5hZGRDb2xvclN0b3AoMSwgXCJyZ2JhKDAsIDAsIDAsIDEpXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbG9yQ29udGV4dC5maWxsU3R5bGUgPSBjb2xvckdyYWRpZW50O1xyXG4gICAgICAgIHRoaXMuY29sb3JDb250ZXh0LmZpbGxSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmNhbGlicmF0ZU9wYWNpdHkgPSAoKSA9PiB7XHJcbiAgICAgICAgbGV0IHJnYmE7XHJcblxyXG4gICAgICAgIHRoaXMub3BhY2l0eUNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRoaXMub3BhY2l0eUNhbnZhcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xyXG4gICAgICAgIGxldCBvcGFjaXR5R3JhZGllbnQgPSB0aGlzLm9wYWNpdHlDb250ZXh0LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIDAsIHRoaXMub3BhY2l0eUNhbnZhcy5oZWlnaHQpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMTAwOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgICAgICByZ2JhID0gdGhpcy5hZGRPcGFjaXR5KHRoaXMucGlja2VkQ29sb3IsIGkgLyAxMDApO1xyXG4gICAgICAgICAgICBvcGFjaXR5R3JhZGllbnQuYWRkQ29sb3JTdG9wKGkgLyAxMDAsIHJnYmEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5vcGFjaXR5Q29udGV4dC5maWxsU3R5bGUgPSBvcGFjaXR5R3JhZGllbnQ7XHJcbiAgICAgICAgdGhpcy5vcGFjaXR5Q29udGV4dC5jbGVhclJlY3QoMCwgMCwgdGhpcy5vcGFjaXR5Q2FudmFzLndpZHRoLCB0aGlzLm9wYWNpdHlDYW52YXMuaGVpZ2h0KTtcclxuICAgICAgICB0aGlzLm9wYWNpdHlDb250ZXh0LmZpbGxSZWN0KDAsIDAsIHRoaXMub3BhY2l0eUNhbnZhcy53aWR0aCwgdGhpcy5vcGFjaXR5Q2FudmFzLmhlaWdodCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5saXN0ZW4gPSAoKSA9PiB7XHJcbiAgICAgICAgbGV0IGlzQ29sb3JNb3VzZURvd24gPSBmYWxzZTtcclxuICAgICAgICBsZXQgaXNPcGFjaXR5TW91c2VEb3duID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHRoaXMucGlja2VyLm5vdEJ1YmJsZWRFdmVudCgnY2xpY2snLCBldmVudCA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmFkZGVkICYmICFpc0NvbG9yTW91c2VEb3duICYmICFpc09wYWNpdHlNb3VzZURvd24pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGlzcG9zZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbG9yTW91c2VEb3duID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBjdXJyZW50WCA9IGV2ZW50LmNsaWVudFggLSB0aGlzLmNvbG9yQ2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQ7XHJcbiAgICAgICAgICAgIGxldCBjdXJyZW50WSA9IGV2ZW50LmNsaWVudFkgLSB0aGlzLmNvbG9yQ2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcDtcclxuXHJcbiAgICAgICAgICAgIC8vaXMgbW91c2UgaW4gY29sb3IgcGlja2VyXHJcbiAgICAgICAgICAgIGlzQ29sb3JNb3VzZURvd24gPSAoY3VycmVudFggPiAwICYmIGN1cnJlbnRYIDwgdGhpcy5jb2xvckNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCAmJiBjdXJyZW50WSA+IDAgJiYgY3VycmVudFkgPCB0aGlzLmNvbG9yQ2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3QgY29sb3JNb3VzZU1vdmUgPSAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgaWYgKGlzQ29sb3JNb3VzZURvd24pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29sb3JJbmRpY2F0b3JQb3NpdGlvbi54ID0gZXZlbnQuY2xpZW50WCAtIHRoaXMuY29sb3JDYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdDtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29sb3JJbmRpY2F0b3JQb3NpdGlvbi55ID0gZXZlbnQuY2xpZW50WSAtIHRoaXMuY29sb3JDYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb2xvck1hcmtlci5jc3MoeyB0b3A6IHRoaXMuY29sb3JJbmRpY2F0b3JQb3NpdGlvbi55ICsgJ3B4JywgbGVmdDogdGhpcy5jb2xvckluZGljYXRvclBvc2l0aW9uLnggKyAncHgnIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBwaWNrZWQgPSB0aGlzLmdldFBpY2tlZENvbG9yKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBpY2tlZENvbG9yID0gYHJnYigke3BpY2tlZC5yfSwgJHtwaWNrZWQuZ30sICR7cGlja2VkLmJ9KWA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlcGx5KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBjb2xvckNsaWNrZWQgPSAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jb2xvckluZGljYXRvclBvc2l0aW9uLnggPSBldmVudC5jbGllbnRYIC0gdGhpcy5jb2xvckNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0O1xyXG4gICAgICAgICAgICB0aGlzLmNvbG9ySW5kaWNhdG9yUG9zaXRpb24ueSA9IGV2ZW50LmNsaWVudFkgLSB0aGlzLmNvbG9yQ2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcDtcclxuICAgICAgICAgICAgdGhpcy5jb2xvck1hcmtlci5jc3MoeyB0b3A6IHRoaXMuY29sb3JJbmRpY2F0b3JQb3NpdGlvbi55ICsgJ3B4JywgbGVmdDogdGhpcy5jb2xvckluZGljYXRvclBvc2l0aW9uLnggKyAncHgnIH0pO1xyXG5cclxuICAgICAgICAgICAgbGV0IHBpY2tlZCA9IHRoaXMuZ2V0UGlja2VkQ29sb3IoKTtcclxuICAgICAgICAgICAgdGhpcy5waWNrZWRDb2xvciA9IGByZ2IoJHtwaWNrZWQucn0sICR7cGlja2VkLmd9LCAke3BpY2tlZC5ifSlgO1xyXG4gICAgICAgICAgICB0aGlzLnJlcGx5KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBjb2xvck1vdXNlVXAgPSAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgaXNDb2xvck1vdXNlRG93biA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmNhbGlicmF0ZU9wYWNpdHkoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvL1JlZ2lzdGVyXHJcbiAgICAgICAgdGhpcy5jb2xvckNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGNvbG9yTW91c2VEb3duKTtcclxuICAgICAgICB0aGlzLmNvbG9yQ2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgY29sb3JNb3VzZU1vdmUpO1xyXG4gICAgICAgIHRoaXMuY29sb3JDYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNvbG9yQ2xpY2tlZCk7XHJcbiAgICAgICAgdGhpcy5jb2xvckNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBjb2xvck1vdXNlVXApO1xyXG5cclxuICAgICAgICBjb25zdCBvcGFjaXR5TW91c2VEb3duID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBjdXJyZW50WCA9IGV2ZW50LmNsaWVudFggLSB0aGlzLm9wYWNpdHlDYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdDtcclxuICAgICAgICAgICAgbGV0IGN1cnJlbnRZID0gZXZlbnQuY2xpZW50WSAtIHRoaXMub3BhY2l0eUNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3A7XHJcblxyXG4gICAgICAgICAgICAvL2lzIG1vdXNlIGluIGNvbG9yIHBpY2tlclxyXG4gICAgICAgICAgICBpc09wYWNpdHlNb3VzZURvd24gPSAoY3VycmVudFggPiAwICYmIGN1cnJlbnRYIDwgdGhpcy5vcGFjaXR5Q2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoICYmIGN1cnJlbnRZID4gMCAmJiBjdXJyZW50WSA8IHRoaXMub3BhY2l0eUNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IG9wYWNpdHlNb3VzZU1vdmUgPSAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgaWYgKGlzT3BhY2l0eU1vdXNlRG93bikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vcGFjaXR5SW5kaWNhdG9yUG9zaXRpb24ueCA9IGV2ZW50LmNsaWVudFggLSB0aGlzLm9wYWNpdHlDYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdDtcclxuICAgICAgICAgICAgICAgIHRoaXMub3BhY2l0eUluZGljYXRvclBvc2l0aW9uLnkgPSBldmVudC5jbGllbnRZIC0gdGhpcy5vcGFjaXR5Q2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcDtcclxuICAgICAgICAgICAgICAgIHRoaXMub3BhY2l0eU1hcmtlci5jc3MoeyB0b3A6IHRoaXMub3BhY2l0eUluZGljYXRvclBvc2l0aW9uLnkgKyAncHgnIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBwaWNrZWQgPSB0aGlzLmdldFBpY2tlZE9wYWNpdHkoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucGlja2VkQ29sb3IgPSBgcmdiKCR7cGlja2VkLnJ9LCAke3BpY2tlZC5nfSwgJHtwaWNrZWQuYn0sICR7cGlja2VkLmF9KWA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlcGx5KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBvcGFjaXR5Q2xpY2tlZCA9IChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLm9wYWNpdHlJbmRpY2F0b3JQb3NpdGlvbi54ID0gZXZlbnQuY2xpZW50WCAtIHRoaXMub3BhY2l0eUNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0O1xyXG4gICAgICAgICAgICB0aGlzLm9wYWNpdHlJbmRpY2F0b3JQb3NpdGlvbi55ID0gZXZlbnQuY2xpZW50WSAtIHRoaXMub3BhY2l0eUNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3A7XHJcbiAgICAgICAgICAgIHRoaXMub3BhY2l0eU1hcmtlci5jc3MoeyB0b3A6IHRoaXMub3BhY2l0eUluZGljYXRvclBvc2l0aW9uLnkgKyAncHgnIH0pO1xyXG5cclxuICAgICAgICAgICAgbGV0IHBpY2tlZCA9IHRoaXMuZ2V0UGlja2VkT3BhY2l0eSgpO1xyXG4gICAgICAgICAgICB0aGlzLnBpY2tlZENvbG9yID0gYHJnYigke3BpY2tlZC5yfSwgJHtwaWNrZWQuZ30sICR7cGlja2VkLmJ9LCAke3BpY2tlZC5hfSlgO1xyXG4gICAgICAgICAgICB0aGlzLnJlcGx5KCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3Qgb3BhY2l0eU1vdXNlVXAgPSAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgaXNPcGFjaXR5TW91c2VEb3duID0gZmFsc2U7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5vcGFjaXR5Q2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgb3BhY2l0eU1vdXNlRG93bik7XHJcbiAgICAgICAgdGhpcy5vcGFjaXR5Q2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgb3BhY2l0eU1vdXNlTW92ZSk7XHJcbiAgICAgICAgdGhpcy5vcGFjaXR5Q2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBvcGFjaXR5Q2xpY2tlZCk7XHJcbiAgICAgICAgdGhpcy5vcGFjaXR5Q2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIG9wYWNpdHlNb3VzZVVwKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnJlcGx5ID0gKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuY29udmVyQ29sb3IoKTtcclxuICAgICAgICB0aGlzLnBpY2tlci5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnY29sb3JDaGFuZ2VkJykpO1xyXG4gICAgICAgIHRoaXMucGlja2VyLmZpbmQoJyNwaWNrZWQtY29sb3InKS5jc3MoeyBiYWNrZ3JvdW5kQ29sb3I6IHRoaXMuY29udmVydGVkQ29sb3IgfSk7XHJcbiAgICAgICAgdGhpcy5waWNrZXIuZmluZCgnI3BpY2tlZC1jb2xvci12YWx1ZScpLmlubmVyVGV4dCA9IHRoaXMuY29udmVydGVkQ29sb3I7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jb252ZXJDb2xvciA9ICgpID0+IHtcclxuICAgICAgICBpZiAodGhpcy5jb252ZXJ0VG8gPT0gJ0hFWCcpIHtcclxuICAgICAgICAgICAgdGhpcy5jb252ZXJ0ZWRDb2xvciA9IHRoaXMucmdiVG9IZXgodGhpcy5waWNrZWRDb2xvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHRoaXMuY29udmVydFRvID09ICdIU0wnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udmVydGVkQ29sb3IgPSB0aGlzLnJnYlRvSFNMKHRoaXMucGlja2VkQ29sb3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0aGlzLmNvbnZlcnRUbyA9PSAnUkdCJykge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnZlcnRlZENvbG9yID0gdGhpcy5waWNrZWRDb2xvcjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5vbkNoYW5nZWQgPSAoY2FsbEJhY2spID0+IHtcclxuICAgICAgICB0aGlzLnBpY2tlci5hZGRFdmVudExpc3RlbmVyKCdjb2xvckNoYW5nZWQnLCBldmVudCA9PiB7XHJcbiAgICAgICAgICAgIGNhbGxCYWNrKHRoaXMuY29udmVydGVkQ29sb3IpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZ2V0UGlja2VkQ29sb3IgPSAoKSA9PiB7XHJcbiAgICAgICAgbGV0IGltYWdlRGF0YSA9IHRoaXMuY29sb3JDb250ZXh0LmdldEltYWdlRGF0YSh0aGlzLmNvbG9ySW5kaWNhdG9yUG9zaXRpb24ueCwgdGhpcy5jb2xvckluZGljYXRvclBvc2l0aW9uLnksIDEsIDEpO1xyXG4gICAgICAgIHJldHVybiB7IHI6IGltYWdlRGF0YS5kYXRhWzBdLCBnOiBpbWFnZURhdGEuZGF0YVsxXSwgYjogaW1hZ2VEYXRhLmRhdGFbMl0gfTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmdldFBpY2tlZE9wYWNpdHkgPSAoKSA9PiB7XHJcbiAgICAgICAgbGV0IGltYWdlRGF0YSA9IHRoaXMub3BhY2l0eUNvbnRleHQuZ2V0SW1hZ2VEYXRhKHRoaXMub3BhY2l0eUluZGljYXRvclBvc2l0aW9uLngsIHRoaXMub3BhY2l0eUluZGljYXRvclBvc2l0aW9uLnksIDEsIDEpO1xyXG5cclxuICAgICAgICBsZXQgYWxwaGEgPSBNYXRoLmNlaWwoKChpbWFnZURhdGEuZGF0YVszXSAvIDI1NSkgKiAxMDApKSAvIDEwMDtcclxuICAgICAgICByZXR1cm4geyByOiBpbWFnZURhdGEuZGF0YVswXSwgZzogaW1hZ2VEYXRhLmRhdGFbMV0sIGI6IGltYWdlRGF0YS5kYXRhWzJdLCBhOiBhbHBoYSB9O1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZHJhdyA9IChwYXJhbXMpID0+IHtcclxuICAgICAgICB0aGlzLmluaXQocGFyYW1zKTtcclxuICAgICAgICB0aGlzLmNhbGlicmF0ZUNvbG9yKCk7XHJcbiAgICAgICAgdGhpcy5jYWxpYnJhdGVPcGFjaXR5KCk7XHJcblxyXG4gICAgICAgIGxldCBpbnRlcnZhbCA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmFkZGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGludGVydmFsKTtcclxuICAgICAgICB9LCAyMDAwKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGlja2VyO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZGlzcG9zZSA9ICgpID0+IHtcclxuICAgICAgICBjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWwpO1xyXG4gICAgICAgIHRoaXMucGlja2VyLnJlbW92ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY29sb3JUeXBlID0gKGNvbG9yID0gJyNmZmZmZmYnKSA9PiB7XHJcbiAgICAgICAgbGV0IHR5cGUgPSAnc3RyaW5nJztcclxuICAgICAgICBpZiAoY29sb3IuaW5kZXhPZignIycpID09IDAgJiYgKGNvbG9yLmxlbmd0aCAtIDEpICUgMyA9PSAwKSB7XHJcbiAgICAgICAgICAgIHR5cGUgPSAnaGV4JztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoY29sb3IuaW5kZXhPZigncmdiYScpID09IDApIHtcclxuICAgICAgICAgICAgbGV0IHZhbHVlcyA9IGJhc2UuaW5CZXR3ZWVuKGNvbG9yLCAncmdiYSgnLCAnKScpO1xyXG4gICAgICAgICAgICBpZiAodmFsdWVzICE9IC0xICYmIHZhbHVlcy5zcGxpdCgnLCcpLmxlbmd0aCA9PSA0KSB7XHJcbiAgICAgICAgICAgICAgICB0eXBlID0gJ3JnYmEnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGNvbG9yLmluZGV4T2YoJ3JnYicpID09IDApIHtcclxuICAgICAgICAgICAgbGV0IHZhbHVlcyA9IGJhc2UuaW5CZXR3ZWVuKGNvbG9yLCAncmdiKCcsICcpJyk7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZXMgIT0gLTEgJiYgdmFsdWVzLnNwbGl0KCcsJykubGVuZ3RoID09IDMpIHtcclxuICAgICAgICAgICAgICAgIHR5cGUgPSAncmdiJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjb2xvci5pbmRleE9mKCdoc2xhJykgPT0gMCkge1xyXG4gICAgICAgICAgICBsZXQgdmFsdWVzID0gYmFzZS5pbkJldHdlZW4oY29sb3IsICdoc2xhKCcsICcpJyk7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZXMgIT0gLTEgJiYgdmFsdWVzLnNwbGl0KCcsJykubGVuZ3RoID09IDQpIHtcclxuICAgICAgICAgICAgICAgIHR5cGUgPSAnaHNsYSc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoY29sb3IuaW5kZXhPZignaHNsJykgPT0gMCkge1xyXG4gICAgICAgICAgICBsZXQgdmFsdWVzID0gYmFzZS5pbkJldHdlZW4oY29sb3IsICdoc2woJywgJyknKTtcclxuICAgICAgICAgICAgaWYgKHZhbHVlcyAhPSAtMSAmJiB2YWx1ZXMuc3BsaXQoJywnKS5sZW5ndGggPT0gMykge1xyXG4gICAgICAgICAgICAgICAgdHlwZSA9ICdoc2wnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHlwZTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmhleFRvUkdCID0gKGhleCA9ICcjZmZmZmZmJywgYWxwaGEgPSB0cnVlKSA9PiB7XHJcbiAgICAgICAgbGV0IHIgPSAwLCBnID0gMCwgYiA9IDAsIGEgPSAyNTU7XHJcbiAgICAgICAgaWYgKGhleC5sZW5ndGggPT0gNCkge1xyXG4gICAgICAgICAgICByID0gXCIweFwiICsgaGV4WzFdICsgaGV4WzFdO1xyXG4gICAgICAgICAgICBnID0gXCIweFwiICsgaGV4WzJdICsgaGV4WzJdO1xyXG4gICAgICAgICAgICBiID0gXCIweFwiICsgaGV4WzNdICsgaGV4WzNdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChoZXgubGVuZ3RoID09IDUpIHtcclxuICAgICAgICAgICAgciA9IFwiMHhcIiArIGhleFsxXSArIGhleFsxXTtcclxuICAgICAgICAgICAgZyA9IFwiMHhcIiArIGhleFsyXSArIGhleFsyXTtcclxuICAgICAgICAgICAgYiA9IFwiMHhcIiArIGhleFszXSArIGhleFszXTtcclxuICAgICAgICAgICAgYSA9IFwiMHhcIiArIGhleFs0XSArIGhleFs0XTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoaGV4Lmxlbmd0aCA9PSA3KSB7XHJcbiAgICAgICAgICAgIHIgPSBcIjB4XCIgKyBoZXhbMV0gKyBoZXhbMl07XHJcbiAgICAgICAgICAgIGcgPSBcIjB4XCIgKyBoZXhbM10gKyBoZXhbNF07XHJcbiAgICAgICAgICAgIGIgPSBcIjB4XCIgKyBoZXhbNV0gKyBoZXhbNl07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGhleC5sZW5ndGggPT0gOSkge1xyXG4gICAgICAgICAgICByID0gXCIweFwiICsgaGV4WzFdICsgaGV4WzJdO1xyXG4gICAgICAgICAgICBnID0gXCIweFwiICsgaGV4WzNdICsgaGV4WzRdO1xyXG4gICAgICAgICAgICBiID0gXCIweFwiICsgaGV4WzVdICsgaGV4WzZdO1xyXG4gICAgICAgICAgICBhID0gXCIweFwiICsgaGV4WzddICsgaGV4WzhdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBhID0gKyhhIC8gMjU1KS50b0ZpeGVkKDMpO1xyXG5cclxuICAgICAgICBpZiAoYWxwaGEgPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGByZ2IoJHsrcn0sICR7K2d9LCAkeytifSlgO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGByZ2IoJHsrcn0sICR7K2d9LCAkeytifSwgJHthfSlgO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmhleFRvSFNMID0gKGhleCA9ICcjZmZmZmZmJywgYWxwaGEgPSB0cnVlKSA9PiB7XHJcbiAgICAgICAgbGV0IGNvbG9yID0gdGhpcy5oZXhUb1JHQihoZXgsIGFscGhhKTtcclxuICAgICAgICBjb2xvciA9IHRoaXMucmdiVG9IU0woY29sb3IsIGFscGhhKTtcclxuICAgICAgICByZXR1cm4gY29sb3I7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5yZ2JUb0hleCA9IChyZ2IgPSAncmdiKDAsIDAsIDApJywgYWxwaGEgPSB0cnVlKSA9PiB7XHJcbiAgICAgICAgbGV0IHN0YXJ0ID0gcmdiLmluZGV4T2YoJygnKSArIDE7XHJcbiAgICAgICAgbGV0IGVuZCA9IHJnYi5pbmRleE9mKCcpJyk7XHJcbiAgICAgICAgbGV0IFtyLCBnLCBiLCBhXSA9IHJnYi5zbGljZShzdGFydCwgZW5kKS5zcGxpdCgnLCcpO1xyXG5cclxuICAgICAgICBpZiAoIWJhc2UuaXNzZXQoYSkpIHtcclxuICAgICAgICAgICAgYSA9IDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByID0gKCtyKS50b1N0cmluZygxNik7XHJcbiAgICAgICAgZyA9ICgrZykudG9TdHJpbmcoMTYpO1xyXG4gICAgICAgIGIgPSAoK2IpLnRvU3RyaW5nKDE2KTtcclxuICAgICAgICBhID0gTWF0aC5yb3VuZChhICogMjU1KS50b1N0cmluZygxNik7XHJcblxyXG4gICAgICAgIGlmIChyLmxlbmd0aCA9PSAxKSB7XHJcbiAgICAgICAgICAgIHIgPSBgMCR7cn1gO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGcubGVuZ3RoID09IDEpIHtcclxuICAgICAgICAgICAgZyA9IGAwJHtnfWA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoYi5sZW5ndGggPT0gMSkge1xyXG4gICAgICAgICAgICBiID0gYDAke2J9YDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGEubGVuZ3RoID09IDEpIHtcclxuICAgICAgICAgICAgYSA9IGAwJHthfWA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgaGV4ID0gJyMnO1xyXG4gICAgICAgIGlmIChhbHBoYSAhPSBmYWxzZSkge1xyXG4gICAgICAgICAgICBoZXggKz0gYCR7cn0ke2d9JHtifSR7YX1gO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaGV4ICs9IGAke3J9JHtnfSR7Yn1gO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGhleDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnJnYlRvSFNMID0gKHJnYiA9ICdyZ2IoMCwgMCwgMCknLCBhbHBoYSA9IHRydWUpID0+IHtcclxuICAgICAgICBsZXQgc3RhcnQgPSByZ2IuaW5kZXhPZignKCcpICsgMTtcclxuICAgICAgICBsZXQgZW5kID0gcmdiLmluZGV4T2YoJyknKTtcclxuICAgICAgICBsZXQgW3IsIGcsIGIsIGFdID0gcmdiLnNsaWNlKHN0YXJ0LCBlbmQpLnNwbGl0KCcsJyk7XHJcblxyXG4gICAgICAgIGlmICghYmFzZS5pc3NldChhKSkge1xyXG4gICAgICAgICAgICBhID0gMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHIgLz0gMjI1O1xyXG4gICAgICAgIGcgLz0gMjI1O1xyXG4gICAgICAgIGIgLz0gMjI1O1xyXG5cclxuICAgICAgICBsZXQgY21pbiA9IE1hdGgubWluKHIsIGcsIGIpLFxyXG4gICAgICAgICAgICBjbWF4ID0gTWF0aC5tYXgociwgZywgYiksXHJcbiAgICAgICAgICAgIGRlbHRhID0gY21heCAtIGNtaW4sXHJcbiAgICAgICAgICAgIGggPSAwLFxyXG4gICAgICAgICAgICBzID0gMCxcclxuICAgICAgICAgICAgbCA9IDA7XHJcblxyXG4gICAgICAgIC8vIENhbGN1bGF0ZSBodWVcclxuICAgICAgICAvLyBObyBkaWZmZXJlbmNlXHJcbiAgICAgICAgaWYgKGRlbHRhID09IDApIHtcclxuICAgICAgICAgICAgaCA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGNtYXggPT0gcikge1xyXG4gICAgICAgICAgICBoID0gKChnIC0gYikgLyBkZWx0YSkgJSA2O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjbWF4ID09IGcpIHtcclxuICAgICAgICAgICAgaCA9IChiIC0gcikgLyBkZWx0YSArIDI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGNtYXggPT0gZykge1xyXG4gICAgICAgICAgICBoID0gKHIgLSBnKSAvIGRlbHRhICsgNDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGggPSBNYXRoLnJvdW5kKGggKiA2MCk7XHJcbiAgICAgICAgLy8gTWFrZSBuZWdhdGl2ZSBodWVzIHBvc2l0aXZlIGJlaGluZCAzNjDCsFxyXG4gICAgICAgIGlmIChoIDwgMCkge1xyXG4gICAgICAgICAgICBoICs9IDM2MDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGwgPSAoY21heCArIGNtaW4pIC8gMjtcclxuXHJcbiAgICAgICAgcyA9IGRlbHRhID09IDAgPyAwIDogZGVsdGEgLyAoMSAtIE1hdGguYWJzKDIgKiBsIC0gMSkpO1xyXG5cclxuICAgICAgICBsID0gKyhsICogMTAwKS50b0ZpeGVkKDEpO1xyXG4gICAgICAgIHMgPSArKHMgKiAxMDApLnRvRml4ZWQoMSk7XHJcblxyXG4gICAgICAgIGxldCBoc2wgPSBgaHNsYDtcclxuICAgICAgICBpZiAoYWxwaGEgPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgaHNsICs9IGAoJHtofSwgJHtzfSUsICR7bH0lKWA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBoc2wgKz0gYCgke2h9LCAke3N9JSwgJHtsfSUsICR7YX0pYDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGhzbDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmhzbFRvUkdCID0gKGhzbCA9ICdoc2woMCwgMCUsIDAlKScsIGFscGhhID0gdHJ1ZSkgPT4ge1xyXG4gICAgICAgIGxldCByZ2IgPSAncmdiJztcclxuICAgICAgICBsZXQgc3RhcnQgPSBoc2wuaW5kZXhPZignKCcpICsgMTtcclxuICAgICAgICBsZXQgZW5kID0gaHNsLmluZGV4T2YoJyknKTtcclxuICAgICAgICBsZXQgW2gsIHMsIGwsIGFdID0gaHNsLnNsaWNlKHN0YXJ0LCBlbmQpLnNwbGl0KCcsJyk7XHJcblxyXG4gICAgICAgIGlmICghYmFzZS5pc3NldChhKSkge1xyXG4gICAgICAgICAgICBhID0gMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChoLmluZGV4T2YoXCJkZWdcIikgPiAtMSlcclxuICAgICAgICAgICAgaCA9IGguc3Vic3RyKDAsIGgubGVuZ3RoIC0gMyk7XHJcbiAgICAgICAgZWxzZSBpZiAoaC5pbmRleE9mKFwicmFkXCIpID4gLTEpXHJcbiAgICAgICAgICAgIGggPSBNYXRoLnJvdW5kKGguc3Vic3RyKDAsIGgubGVuZ3RoIC0gMykgKiAoMTgwIC8gTWF0aC5QSSkpO1xyXG4gICAgICAgIGVsc2UgaWYgKGguaW5kZXhPZihcInR1cm5cIikgPiAtMSlcclxuICAgICAgICAgICAgaCA9IE1hdGgucm91bmQoaC5zdWJzdHIoMCwgaC5sZW5ndGggLSA0KSAqIDM2MCk7XHJcbiAgICAgICAgLy8gS2VlcCBodWUgZnJhY3Rpb24gb2YgMzYwIGlmIGVuZGluZyB1cCBvdmVyXHJcbiAgICAgICAgaWYgKGggPj0gMzYwKVxyXG4gICAgICAgICAgICBoICU9IDM2MDtcclxuXHJcbiAgICAgICAgcyA9IHMucmVwbGFjZSgnJScsICcnKSAvIDEwMDtcclxuICAgICAgICBsID0gbC5yZXBsYWNlKCclJywgJycpIC8gMTAwO1xyXG5cclxuICAgICAgICBsZXQgYyA9ICgxIC0gTWF0aC5hYnMoMiAqIGwgLSAxKSkgKiBzLFxyXG4gICAgICAgICAgICB4ID0gYyAqICgxIC0gTWF0aC5hYnMoKGggLyA2MCkgJSAyIC0gMSkpLFxyXG4gICAgICAgICAgICBtID0gbCAtIGMgLyAyLFxyXG4gICAgICAgICAgICByID0gMCxcclxuICAgICAgICAgICAgZyA9IDAsXHJcbiAgICAgICAgICAgIGIgPSAwO1xyXG5cclxuICAgICAgICBpZiAoMCA8PSBoICYmIGggPCA2MCkge1xyXG4gICAgICAgICAgICByID0gYzsgZyA9IHg7IGIgPSAwO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoNjAgPD0gaCAmJiBoIDwgMTIwKSB7XHJcbiAgICAgICAgICAgIHIgPSB4OyBnID0gYzsgYiA9IDA7XHJcbiAgICAgICAgfSBlbHNlIGlmICgxMjAgPD0gaCAmJiBoIDwgMTgwKSB7XHJcbiAgICAgICAgICAgIHIgPSAwOyBnID0gYzsgYiA9IHg7XHJcbiAgICAgICAgfSBlbHNlIGlmICgxODAgPD0gaCAmJiBoIDwgMjQwKSB7XHJcbiAgICAgICAgICAgIHIgPSAwOyBnID0geDsgYiA9IGM7XHJcbiAgICAgICAgfSBlbHNlIGlmICgyNDAgPD0gaCAmJiBoIDwgMzAwKSB7XHJcbiAgICAgICAgICAgIHIgPSB4OyBnID0gMDsgYiA9IGM7XHJcbiAgICAgICAgfSBlbHNlIGlmICgzMDAgPD0gaCAmJiBoIDwgMzYwKSB7XHJcbiAgICAgICAgICAgIHIgPSBjOyBnID0gMDsgYiA9IHg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHIgPSBNYXRoLnJvdW5kKChyICsgbSkgKiAyNTUpO1xyXG4gICAgICAgIGcgPSBNYXRoLnJvdW5kKChnICsgbSkgKiAyNTUpO1xyXG4gICAgICAgIGIgPSBNYXRoLnJvdW5kKChiICsgbSkgKiAyNTUpO1xyXG5cclxuICAgICAgICBpZiAoYWxwaGEgPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgcmdiICs9IGAoJHtyfSwgJHtnfSwgJHtifSlgO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmdiICs9IGAoJHtyfSwgJHtnfSwgJHtifSwgJHthfSlgO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJnYjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmhzbFRvSGV4ID0gKGhzbCA9ICcnLCBhbHBoYSA9IHRydWUpID0+IHtcclxuICAgICAgICBsZXQgY29sb3IgPSB0aGlzLmhzbFRvUkdCKGhzbCwgYWxwaGEpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJnYlRvSGV4KGNvbG9yLCBhbHBoYSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5hZGRPcGFjaXR5ID0gKGNvbG9yID0gJ3JnYigwLCAwLCAwKScsIG9wYWNpdHkgPSAwLjUpID0+IHtcclxuICAgICAgICBsZXQgdHlwZSA9IHRoaXMuY29sb3JUeXBlKGNvbG9yKTtcclxuICAgICAgICBpZiAodHlwZSA9PSAnaGV4JykgY29sb3IgPSB0aGlzLmhleFRvUkdCKGNvbG9yKTtcclxuICAgICAgICBlbHNlIGlmICh0eXBlID09ICdoc2wnIHx8IHR5cGUgPT0gJ2hzbGEnKSBjb2xvciA9IHRoaXMuaHNsVG9SR0IoY29sb3IpO1xyXG5cclxuICAgICAgICBsZXQgc3RhcnQgPSBjb2xvci5pbmRleE9mKCcoJykgKyAxO1xyXG4gICAgICAgIGxldCBlbmQgPSBjb2xvci5pbmRleE9mKCcpJyk7XHJcbiAgICAgICAgbGV0IHBvaW50cyA9IGNvbG9yLnNsaWNlKHN0YXJ0LCBlbmQpLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgcG9pbnRzWzNdID0gb3BhY2l0eTtcclxuXHJcbiAgICAgICAgbGV0IGNoYW5nZWRDb2xvciA9IGByZ2JhKCR7cG9pbnRzLmpvaW4oJywnKX0pYDtcclxuXHJcbiAgICAgICAgaWYgKHR5cGUgPT0gJ2hleCcpIGNoYW5nZWRDb2xvciA9IHRoaXMucmdiVG9IZXgoY2hhbmdlZENvbG9yKTtcclxuICAgICAgICBlbHNlIGlmICh0eXBlID09ICdoc2wnIHx8IHR5cGUgPT0gJ2hzbGEnKSBjaGFuZ2VkQ29sb3IgPSB0aGlzLnJnYlRvSFNMKGNoYW5nZWRDb2xvcik7XHJcblxyXG4gICAgICAgIHJldHVybiBjaGFuZ2VkQ29sb3I7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5nZXRPcGFjaXR5ID0gKGNvbG9yID0gJ3JnYigwLCAwLCAwKScpID0+IHtcclxuICAgICAgICBjb2xvciA9IGJhc2UuaW5CZXR3ZWVuKGNvbG9yLCAnKCcsICcpJyk7XHJcbiAgICAgICAgbGV0IFtyLCBnLCBiLCBhXSA9IGNvbG9yLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgcmV0dXJuIGEudHJpbSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaW52ZXJ0Q29sb3IgPSAoY29sb3IgPSAnI2ZmZmZmZicpID0+IHtcclxuICAgICAgICBsZXQgdHlwZSA9IHRoaXMuY29sb3JUeXBlKGNvbG9yKTtcclxuICAgICAgICBsZXQgaW52ZXJ0O1xyXG4gICAgICAgIGlmICh0eXBlID09ICdoZXgnKSB7XHJcbiAgICAgICAgICAgIGNvbG9yID0gY29sb3IucmVwbGFjZSgnIycsICcnKTtcclxuICAgICAgICAgICAgaW52ZXJ0ID0gJyMnICsgdGhpcy5pbnZlcnRIZXgoY29sb3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0eXBlID09ICdyZ2InKSB7XHJcbiAgICAgICAgICAgIGNvbG9yID0gdGhpcy5yZ2JUb0hleChjb2xvcikucmVwbGFjZSgnIycsICcnKTtcclxuICAgICAgICAgICAgaW52ZXJ0ID0gdGhpcy5pbnZlcnRIZXgoY29sb3IpO1xyXG4gICAgICAgICAgICBpbnZlcnQgPSB0aGlzLmhleFRvUkdCKGludmVydCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHR5cGUgPT0gJ3JnYmEnKSB7XHJcbiAgICAgICAgICAgIGxldCBvcGFjaXR5ID0gdGhpcy5nZXRPcGFjaXR5KGNvbG9yKTtcclxuICAgICAgICAgICAgY29sb3IgPSB0aGlzLnJnYlRvSGV4KGNvbG9yKS5yZXBsYWNlKCcjJywgJycpO1xyXG4gICAgICAgICAgICBpbnZlcnQgPSB0aGlzLmludmVydEhleChjb2xvcik7XHJcbiAgICAgICAgICAgIGludmVydCA9IHRoaXMuaGV4VG9SR0IoaW52ZXJ0KTtcclxuICAgICAgICAgICAgaW52ZXJ0ID0gdGhpcy5hZGRPcGFjaXR5KGludmVydCwgb3BhY2l0eSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpbnZlcnQ7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5pbnZlcnRIZXggPSAoaGV4ID0gJ2ZmZmZmZicpID0+IHtcclxuICAgICAgICByZXR1cm4gKE51bWJlcihgMHgxJHtoZXh9YCkgXiAweEZGRkZGRikudG9TdHJpbmcoMTYpLnN1YnN0cigxKS50b1VwcGVyQ2FzZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubmFtZVRvSGV4ID0gKGNvbG9yID0gJ3doaXRlJykgPT4ge1xyXG4gICAgICAgIGxldCBjdHggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKS5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBjb2xvcjtcclxuICAgICAgICByZXR1cm4gY3R4LmZpbGxTdHlsZTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm5hbWVUb1JHQiA9IChjb2xvciA9ICd3aGl0ZScpID0+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5oZXhUb1JHQih0aGlzLm5hbWVUb0hleChjb2xvcikpO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENvbG9yUGlja2VyOyIsImNvbnN0IE1hdGhzTGlicmFyeSA9IHJlcXVpcmUoJy4vTWF0aHNMaWJyYXJ5Jyk7XHJcbmNvbnN0IE9iamVjdHNMaWJyYXJ5ID0gcmVxdWlyZSgnLi9PYmplY3RzTGlicmFyeScpO1xyXG5jb25zdCBBcnJheUxpYnJhcnkgPSByZXF1aXJlKCcuL0FycmF5TGlicmFyeScpO1xyXG5jb25zdCBUcmVlID0gcmVxdWlyZSgnLi8uLi9jbGFzc2VzL1RyZWUnKTtcclxuXHJcbmxldCBtYXRoTGlicmFyeSA9IG5ldyBNYXRoc0xpYnJhcnkoKTtcclxubGV0IG9iamVjdExpYnJhcnkgPSBuZXcgT2JqZWN0c0xpYnJhcnkoKTtcclxubGV0IGFycmF5TGlicmFyeSA9IG5ldyBBcnJheUxpYnJhcnkoKTtcclxuXHJcbmZ1bmN0aW9uIENvbXByZXNzaW9uKCkge1xyXG4gICAgdGhpcy5nZXRGcmVxdWVuY3kgPSAoZGF0YSA9IFtdKSA9PiB7Ly9nZXQgdGhlIG9jY3VycmFuY2Ugb2Ygc3ltYm9scyBpbiBhIGxpc3RcclxuICAgICAgICBjb25zdCBmcmVxdWVuY3kgPSB7fTtcclxuICAgICAgICBmb3IgKGxldCBkIGluIGRhdGEpIHtcclxuICAgICAgICAgICAgaWYgKGZyZXF1ZW5jeVtkYXRhW2RdXSA9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGZyZXF1ZW5jeVtkYXRhW2RdXSA9IDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmcmVxdWVuY3lbZGF0YVtkXV0rKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZyZXF1ZW5jeTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmdldFByb2JhYmlsaXRpZXMgPSAoZGF0YSA9IFtdKSA9PiB7Ly9nZXQgdGhlIHByb2JhYmlsaXRpZXMgb2YgYWxsIHN5bWJvbHMgaW4gYSBsaXN0XHJcbiAgICAgICAgbGV0IHByb2JzID0gdGhpcy5nZXRGcmVxdWVuY3koZGF0YSk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgaW4gcHJvYnMpIHtcclxuICAgICAgICAgICAgcHJvYnNbaV0gPSBwcm9ic1tpXSAvIGRhdGEubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcHJvYnM7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5lbnRyb3B5ID0gKGRhdGEgPSBbXSkgPT4gey8vdGhpcyBzaG93cyB0aGUgc2hvcnRlc3QgcG9zc2libGUgYXZlcmFnZSBsZW5ndGggb2YgYSBsb3NzbGVzcyBjb21wcmVzc2lvblxyXG4gICAgICAgIGxldCBzdW0gPSAwO1xyXG4gICAgICAgIGxldCBkYXRhVHlwZSA9IGFycmF5TGlicmFyeS5kYXRhVHlwZShkYXRhKTsvL2dldCB0aGUgZGF0YXR5cGUgb2YgdGhlIGxpc3RcclxuICAgICAgICBsZXQgcHJvYmFiaWxpdGllcztcclxuICAgICAgICBpZiAoZGF0YVR5cGUgPT0gJ251bWJlcicpIHtcclxuICAgICAgICAgICAgcHJvYmFiaWxpdGllcyA9IGRhdGE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGRhdGFUeXBlID09ICdzdHJpbmcnKSB7Ly9nZXQgdGhlIHN5bWJvbHMgcHJvYmFiaWxpdGllc1xyXG4gICAgICAgICAgICBwcm9iYWJpbGl0aWVzID0gT2JqZWN0LnZhbHVlcyh0aGlzLmdldFByb2JhYmlsaXRpZXMoZGF0YSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9TdW0gb2YgKC1wIGxvZyBiYXNlIDIgb2YgcClcclxuICAgICAgICBmb3IgKGxldCBwcm9iIG9mIHByb2JhYmlsaXRpZXMpIHtcclxuICAgICAgICAgICAgc3VtICs9ICgtcHJvYiAqIE1hdGgubG9nMihwcm9iKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc3VtO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaXNVREMgPSAoZGF0YSA9IFtdKSA9PiB7Ly9jaGVjayBpZiBhIGxpc3QgaXMgdW5pcXVlbHkgZGVjb2RhYmxlIGNvZGVcclxuICAgICAgICBsZXQgZmxhZyA9IHRydWUsIG5vUHJlZml4LCBrZWVwUnVubmluZyA9IHRydWU7XHJcblxyXG4gICAgICAgIGxldCBhZGRTdXJmaXggPSAoc3RyKSA9PiB7XHJcbiAgICAgICAgICAgIC8vY2hlY2sgaWYgc3VmZml4IGlzIGluIGxpc3QgYWxyZWFkeSB0aGVuIHN0b3AgcnVubmluZ1xyXG4gICAgICAgICAgICBpZiAoZGF0YS5pbmNsdWRlcyhzdHIpKSB7XHJcbiAgICAgICAgICAgICAgICBmbGFnID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBrZWVwUnVubmluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBkYXRhLnB1c2goc3RyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBjaGVja1ByZWZpeCA9IChwb3MpID0+IHsvL2NoZWNrIGZvciBwcmVmaXhcclxuICAgICAgICAgICAgbm9QcmVmaXggPSB0cnVlO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChpID09IHBvcykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vc2tpcCB0aGUgY3VycmVudCBwb3NpdGlvblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoZGF0YVtpXSA9PSBkYXRhW3Bvc10pIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2RvdWJsZSBmb3VuZCBpbiB0aGUgbGlzdFxyXG4gICAgICAgICAgICAgICAgICAgIGZsYWcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBrZWVwUnVubmluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoZGF0YVtpXS5pbmRleE9mKGRhdGFbcG9zXSkgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vYWRkIHN1ZmZpeCBmb3VuZCB0byB0aGUgbGlzdFxyXG4gICAgICAgICAgICAgICAgICAgIGFkZFN1cmZpeChkYXRhW2ldLnJlcGxhY2UoZGF0YVtwb3NdLCAnJykpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vc3RvcCBjaGVja2luZyBmb3IgcHJlZml4XHJcbiAgICAgICAgICAgICAgICBpZiAoIWtlZXBSdW5uaW5nKSBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgd2hpbGUgKGtlZXBSdW5uaW5nKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY2hlY2tQcmVmaXgoaSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoa2VlcFJ1bm5pbmcgPT0gZmFsc2UpIGJyZWFrOy8vc3RvcCBydW5uaW5nXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChub1ByZWZpeCA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAvL2lmIG5vIHByZWZpeCBpcyBmb3VuZCBzdG9wIGl0IGlzIFVEQ1xyXG4gICAgICAgICAgICAgICAga2VlcFJ1bm5pbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZsYWc7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zZkFsZ29yaXRobSA9IChkYXRhID0gW10pID0+IHtcclxuICAgICAgICBsZXQgZnJlcXVlbmN5ID0gdGhpcy5nZXRGcmVxdWVuY3koZGF0YSk7Ly9nZXQgdGhlIGZyZXF1ZWNpZXMgb2YgdGhlIHN5bWJvbHNcclxuICAgICAgICBsZXQgc29ydGVkID0gb2JqZWN0TGlicmFyeS5zb3J0KGZyZXF1ZW5jeSwgeyB2YWx1ZTogdHJ1ZSB9KTsvL3NvcnQgdGhlIHN5bWJvbHMgYmFzZWQgb24gZnJlcXVlY3kgb2Ygb2NjdXJyYW5jZVxyXG4gICAgICAgIGxldCBjb2RlV29yZCA9ICcnO1xyXG5cclxuICAgICAgICBsZXQgdHJlZSA9IHsgcGF0aDogJycsIHNpemU6IG1hdGhMaWJyYXJ5LnN1bShPYmplY3QudmFsdWVzKHNvcnRlZCkpLCB2YWx1ZTogSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShzb3J0ZWQpKSB9Oy8vc2V0IGEgY29weSBvZiB0aGUgc29ydGVkIGRhdGEgYXMgYSB0cmVlXHJcbiAgICAgICAgbGV0IHRhYmxlID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShzb3J0ZWQpKTsvL3NldCB0aGUgc29ydGVkIGFzIHRhYmxlXHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgaW4gdGFibGUpIHtcclxuICAgICAgICAgICAgdGFibGVbaV0gPSB7IGZyZXF1ZW5jeTogdGFibGVbaV0gfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCB0cnlTd2l0Y2hpbmcgPSAobm9kZSkgPT4gey8vc3dpdGNoIG5vZGVzIGlmIHRoZSBsZWZ0IHNpemUgaXMgYmlnZ2VyIHRoYW4gdGhlIHJpZ2h0IHNpZGVcclxuICAgICAgICAgICAgaWYgKG5vZGVbMF0uc2l6ZSA+IG5vZGVbMV0uc2l6ZSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRlbXAgPSBub2RlWzBdO1xyXG4gICAgICAgICAgICAgICAgbm9kZVswXSA9IG5vZGVbMV07XHJcbiAgICAgICAgICAgICAgICBub2RlWzFdID0gdGVtcDtcclxuXHJcbiAgICAgICAgICAgICAgICB0ZW1wID0gbm9kZVswXS5wYXRoO1xyXG4gICAgICAgICAgICAgICAgbm9kZVswXS5wYXRoID0gbm9kZVsxXS5wYXRoXHJcbiAgICAgICAgICAgICAgICBub2RlWzFdLnBhdGggPSB0ZW1wO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBub2RlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHNwbGl0RGF0YSA9IChjb21pbmdOb2RlKSA9PiB7Ly9zcGxpdCBhIHRyZWVcclxuICAgICAgICAgICAgbGV0IG5vZGUgPSBbeyBwYXRoOiBjb21pbmdOb2RlLnBhdGggKyAnMCcsIHNpemU6IDAsIHZhbHVlOiBbXSB9LCB7IHBhdGg6IGNvbWluZ05vZGUucGF0aCArICcxJywgc2l6ZTogMCwgdmFsdWU6IFtdIH1dOy8vaW50byB0d28gYWxtb3N0IGVxdWFsIGxlbmd0aFxyXG4gICAgICAgICAgICBmb3IgKGxldCBpIGluIGNvbWluZ05vZGUudmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChub2RlWzBdLnNpemUgPCBub2RlWzFdLnNpemUpIHsvL3NwbGl0IGludG8gMiBhbG1vc3QgZXF1YWwgbm9kZXNcclxuICAgICAgICAgICAgICAgICAgICBub2RlWzBdLnZhbHVlW2ldID0gY29taW5nTm9kZS52YWx1ZVtpXTtcclxuICAgICAgICAgICAgICAgICAgICBub2RlWzBdLnNpemUgKz0gY29taW5nTm9kZS52YWx1ZVtpXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vZGVbMV0udmFsdWVbaV0gPSBjb21pbmdOb2RlLnZhbHVlW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIG5vZGVbMV0uc2l6ZSArPSBjb21pbmdOb2RlLnZhbHVlW2ldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBub2RlID0gdHJ5U3dpdGNoaW5nKG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSBpbiBub2RlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LnZhbHVlcyhub2RlW2ldLnZhbHVlKS5sZW5ndGggPiAxKSB7Ly9pZiBpdCBoYXMgbW9yZSB0aGFuIDEgc3ltYm9sIGl0J3MgYSBub2RlIHRoZW4gc3BsaXQgaXQgYWdhaW5cclxuICAgICAgICAgICAgICAgICAgICBub2RlW2ldLnZhbHVlID0gc3BsaXREYXRhKG5vZGVbaV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7Ly9pdCBpcyBhIGxlYWYsIGFkZCBpdCB0byB0aGUgdGFibGUgYW5kIGdldCB0aGUgcHJvcGVydGllc1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBrZXkgPSBPYmplY3Qua2V5cyhub2RlW2ldLnZhbHVlKVswXTtcclxuICAgICAgICAgICAgICAgICAgICB0YWJsZVtrZXldLmNvZGUgPSBub2RlW2ldLnBhdGg7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFibGVba2V5XS5sZW5ndGggPSBub2RlW2ldLnBhdGgubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgICAgIHRhYmxlW2tleV0ucHJvYmFiaWxpdHkgPSBub2RlW2ldLnNpemUgLyBkYXRhLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgICAgICB0YWJsZVtrZXldLmxvZyA9IE1hdGgubG9nMigxIC8gdGFibGVba2V5XS5wcm9iYWJpbGl0eSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG5vZGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0cmVlID0gc3BsaXREYXRhKHRyZWUpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBkIG9mIGRhdGEpIHtcclxuICAgICAgICAgICAgY29kZVdvcmQgKz0gdGFibGVbZF0uY29kZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7IGNvZGVXb3JkLCB0YWJsZSwgZGF0YSwgdHJlZSB9O1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaHVmZm1hbkNvZGluZyA9IChkYXRhID0gW10pID0+IHtcclxuICAgICAgICBsZXQgZnJlcXVlbmN5ID0gdGhpcy5nZXRQcm9iYWJpbGl0aWVzKGRhdGEpOy8vZ2V0IHRoZSBmcmVxdWVjaWVzIG9mIHRoZSBzeW1ib2xzXHJcbiAgICAgICAgbGV0IHNvcnRlZCA9IG9iamVjdExpYnJhcnkuc29ydChmcmVxdWVuY3ksIHsgdmFsdWU6IHRydWUgfSk7Ly9zb3J0IHRoZSBzeW1ib2xzIGJhc2VkIG9uIGZyZXF1ZWN5IG9mIG9jY3VycmFuY2VcclxuXHJcbiAgICAgICAgbGV0IHRyZWUgPSBbXTtcclxuICAgICAgICBsZXQgdGFibGUgPSB7fTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSBpbiBzb3J0ZWQpIHsvL2luaXQgdGhlIHRhYmxlIGFuZCB0aGUgdHJlZVxyXG4gICAgICAgICAgICB0YWJsZVtpXSA9IHsgcHJvYmFiaWxpdHk6IHNvcnRlZFtpXSwgcGF0aDogJycsIGxlbmd0aDogMCwgcHJvZDogMCB9O1xyXG4gICAgICAgICAgICB0cmVlLnB1c2goeyB2YWx1ZTogc29ydGVkW2ldLCBvcmlnaW5zOiBpIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGRpZyA9IChjb21pbmcgPSBbXSkgPT4gey8vcnVuIHRoZSBhbGdvcml0aG0gbG9vcCB1bnRpbCBvbmUgbm9kZSBpcyByZW1haW5pbmcgd2l0aCB2YWx1ZSBvZiAnMSdcclxuICAgICAgICAgICAgbGV0IGxlbmd0aCA9IGNvbWluZy5sZW5ndGg7Ly9zaXplIG9mIGxpc3QgXHJcbiAgICAgICAgICAgIGxldCBub2RlID0gW107Ly9pbml0IG5vZGVcclxuICAgICAgICAgICAgaWYgKGxlbmd0aCA+IDEpIHsvLyBsaXN0IGhhcyBtb3JlIHRoYW4gb25lIG5vZGU/XHJcbiAgICAgICAgICAgICAgICBsZXQgZG93biA9IGxlbmd0aCAtIDE7Ly9pbmRleCBvZiBsYXN0IHR3byBpdGVtcyBpbiBsaXN0XHJcbiAgICAgICAgICAgICAgICBsZXQgdXAgPSBsZW5ndGggLSAyO1xyXG4gICAgICAgICAgICAgICAgbGV0IHN1bSA9IGNvbWluZ1t1cF0udmFsdWUgKyBjb21pbmdbZG93bl0udmFsdWU7XHJcbiAgICAgICAgICAgICAgICBsZXQgYWRkZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29taW5nLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGkgPT0gdXAgfHwgaSA9PSBkb3duKSB7Ly9zdW0gbGFzdCAyIGl0ZW1zIGFuZCBza2lwIGFkZGluZyB0aGVtXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsZW5ndGggPT0gMikgey8vaWYgbGFzdCAyIHN1bSB0aGVtIGFuZCBleGlzdCBkaWdnaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmV3TGVhZiA9IHsgdmFsdWU6IHN1bSwgb3JpZ2luczogW2NvbWluZ1t1cF0ub3JpZ2lucywgY29taW5nW2Rvd25dLm9yaWdpbnNdIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLnB1c2gobmV3TGVhZik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoY29taW5nW2ldLnZhbHVlIDw9IHN1bSAmJiAhYWRkZWQpIHsvL2FkZCBzdW0gaWYgaXQgaGFzIG5vdCBiZWVuIGFkZGVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuZXdMZWFmID0geyB2YWx1ZTogc3VtLCBvcmlnaW5zOiBbY29taW5nW3VwXS5vcmlnaW5zLCBjb21pbmdbZG93bl0ub3JpZ2luc10gfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5wdXNoKG5ld0xlYWYpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBub2RlLnB1c2goY29taW5nW2ldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobGVuZ3RoID4gMikge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vZGUgPSBkaWcobm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBub2RlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdHJlZSA9IGRpZyh0cmVlKTtcclxuXHJcbiAgICAgICAgLy9nZXQgdGhlIHBhdGgvY29kZXdvcmQgZm9yZWFjaCBzeW1ib2xcclxuICAgICAgICBsZXQgbmFtZUl0ZW1zID0gKG9yaWdpbnMsIHBhdGgpID0+IHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSBpbiBvcmlnaW5zKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShvcmlnaW5zW2ldKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWVJdGVtcyhvcmlnaW5zW2ldLCBwYXRoICsgaSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRhYmxlW29yaWdpbnNbaV1dLnBhdGggPSBwYXRoICsgaTtcclxuICAgICAgICAgICAgICAgICAgICB0YWJsZVtvcmlnaW5zW2ldXS5sZW5ndGggPSBwYXRoLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgICAgICB0YWJsZVtvcmlnaW5zW2ldXS5wcm9kID0gcGF0aC5sZW5ndGggKiB0YWJsZVtvcmlnaW5zW2ldXS5wcm9iYWJpbGl0eTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbmFtZUl0ZW1zKHRyZWVbMF0ub3JpZ2lucywgJycpO1xyXG5cclxuICAgICAgICAvL2NhbGN1bGF0ZSB0aGUgYXZldmFnZSBsZW5ndGggb2YgdGhlIGNvZGVzXHJcbiAgICAgICAgbGV0IGF2Z0xlbmd0aCA9IG1hdGhMaWJyYXJ5LnN1bShvYmplY3RMaWJyYXJ5LnZhbHVlT2ZPYmplY3RBcnJheSh0YWJsZSwgJ3Byb2QnKSk7XHJcblxyXG4gICAgICAgIGZyZXF1ZW5jeSA9IHNvcnRlZCA9IHVuZGVmaW5lZDtcclxuICAgICAgICByZXR1cm4geyB0YWJsZSwgZGF0YSwgYXZnTGVuZ3RoLCB0cmVlIH07XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5lbmNvZGVIdWZmbWFuID0gKGRhdGEsIGRpY3Rpb25hcnkgPSBbXSkgPT4ge1xyXG4gICAgICAgIGxldCBkaWN0aW9uYXJ5TGVuZ3RoID0gZGljdGlvbmFyeS5sZW5ndGg7XHJcbiAgICAgICAgbGV0IGNvZGVXb3JkID0gJycsIG55dENvZGUsIGNvZGU7XHJcblxyXG4gICAgICAgIC8vZ2V0IHRoZSBlIGFuZCByIHBhcmFtZXRlcnNcclxuICAgICAgICBsZXQgeyBlLCByIH0gPSAoKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgb2sgPSBmYWxzZTtcclxuICAgICAgICAgICAgbGV0IGUgPSAwLCByO1xyXG4gICAgICAgICAgICB3aGlsZSAoIW9rKSB7XHJcbiAgICAgICAgICAgICAgICBlKys7XHJcbiAgICAgICAgICAgICAgICByID0gZGljdGlvbmFyeUxlbmd0aCAtIDIgKiogZTtcclxuICAgICAgICAgICAgICAgIG9rID0gciA8IDIgKiogZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4geyBlLCByIH07XHJcbiAgICAgICAgfSkoKTtcclxuXHJcbiAgICAgICAgbGV0IGZpeGVkQ29kZSA9IChzeW1ib2wpID0+IHsvL2dldCB0aGUgZml4ZWQgY29kZVxyXG4gICAgICAgICAgICBsZXQgayA9IGRpY3Rpb25hcnkuaW5kZXhPZihzeW1ib2wpICsgMTtcclxuICAgICAgICAgICAgbGV0IGNvZGU7XHJcbiAgICAgICAgICAgIGlmIChrIDw9IDIgKiByKSB7IC8vIDEgPD0gayA8PSAyclxyXG4gICAgICAgICAgICAgICAgY29kZSA9IChrIC0gMSkudG9TdHJpbmcoMik7XHJcbiAgICAgICAgICAgICAgICBjb2RlID0gQXJyYXkoKGUgKyAxKSAtIGNvZGUubGVuZ3RoKS5maWxsKDApLmpvaW4oJycpICsgY29kZTsgLy8gZSArIDEgcmVwcmVzZW50YXRpb24gb2YgayAtIDFcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChrID4gMiAqIHIpIHsvL2sgPiAyclxyXG4gICAgICAgICAgICAgICAgY29kZSA9IChrIC0gciAtIDEpLnRvU3RyaW5nKDIpO1xyXG4gICAgICAgICAgICAgICAgY29kZSA9IEFycmF5KChlKSAtIGNvZGUubGVuZ3RoKS5maWxsKDApLmpvaW4oJycpICsgY29kZTsvLyBlIHJlcHJlc2VudGF0aW9uIG9mIGsgLSByIC0gMVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBjb2RlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHVwZGF0ZUNvdW50ID0gKHQpID0+IHsvL3NldCB0aGUgY291bnQgb2YgYSBub2RlIGFuZCBzd2l0Y2ggaWYgbGVmdCBpcyBncmVhdGVyIHRoYW4gcmlnaHRcclxuICAgICAgICAgICAgbGV0IGNvdW50ID0gdC5nZXRBdHRyaWJ1dGUoJ2NvdW50Jyk7XHJcbiAgICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgICAgIHQuc2V0QXR0cmlidXRlcyh7IGNvdW50IH0pO1xyXG4gICAgICAgICAgICBsZXQgcCA9IHQucGFyZW50VHJlZTtcclxuICAgICAgICAgICAgaWYgKHAgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdHJ5U3dpdGNoaW5nKHApO1xyXG4gICAgICAgICAgICAgICAgdXBkYXRlQ291bnQocCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCB0cnlTd2l0Y2hpbmcgPSAobm9kZSkgPT4gey8vc3dpdGNoIGlmIGxlZnQgaXMgZ3JlYXRlciB0aGFuIHJpZ2h0XHJcbiAgICAgICAgICAgIGlmIChub2RlLnZhbHVlc1swXS5nZXRBdHRyaWJ1dGUoJ2NvdW50JykgPiBub2RlLnZhbHVlc1sxXS5nZXRBdHRyaWJ1dGUoJ2NvdW50JykpIHtcclxuICAgICAgICAgICAgICAgIG5vZGUucmV2ZXJzZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgbGV0IHRyZWUgPSBuZXcgVHJlZSgpO1xyXG4gICAgICAgIHRyZWUuc2V0QXR0cmlidXRlKCdjb3VudCcsIDApO1xyXG4gICAgICAgIGxldCBOWVQgPSB0cmVlO1xyXG5cclxuICAgICAgICBsZXQgcmVhZFN5bWJvbCA9IChzeW1ib2wpID0+IHtcclxuICAgICAgICAgICAgbGV0IHMgPSB0cmVlLnNlYXJjaCgodiwgaSkgPT4gey8vc2VhcmNoIGFuZCBnZXQgc3ltYm9sIG5vZGUgaWYgYWRkZWQgYWxyZWFkeVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHYuZ2V0QXR0cmlidXRlKCdpZCcpID09IHN5bWJvbDtcclxuICAgICAgICAgICAgfSwgdHJlZS5oZWlnaHQpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHYgPSBzLnZhbHVlO1xyXG4gICAgICAgICAgICBueXRDb2RlID0gdHJlZS5zZWFyY2goKHYsIGkpID0+IHsvL2dldCB0aGUgbnl0IG5vZGVcclxuICAgICAgICAgICAgICAgIHJldHVybiB2LmdldEF0dHJpYnV0ZSgnaWQnKSA9PSAnbnl0JztcclxuICAgICAgICAgICAgfSwgdHJlZS5oZWlnaHQpLnBhdGguam9pbignJyk7XHJcblxyXG4gICAgICAgICAgICBpZiAodiA9PSB1bmRlZmluZWQpIHsvL2hhcyBub3QgYmVlbiBhZGRlZFxyXG4gICAgICAgICAgICAgICAgTllULnJlbW92ZUF0dHJpYnV0ZSgnaWQnKTsvL3JlbW92ZSB0aGUgY3VycmVudCBOWVQgdGFnXHJcbiAgICAgICAgICAgICAgICBOWVQucHVzaChbXSwgW10pOy8vYWRkIHRoZSAyIG5vZGVzXHJcbiAgICAgICAgICAgICAgICBsZXQgdGVtcCA9IE5ZVC52YWx1ZXNbMF07XHJcbiAgICAgICAgICAgICAgICB2ID0gTllULnZhbHVlc1sxXTtcclxuXHJcbiAgICAgICAgICAgICAgICB0ZW1wLnNldEF0dHJpYnV0ZXMoeyBpZDogJ255dCcsIGNvdW50OiAwIH0pOy8vc2V0IG5ldyBueXRcclxuICAgICAgICAgICAgICAgIHYuc2V0QXR0cmlidXRlcyh7IGlkOiBzeW1ib2wsIGNvdW50OiAwIH0pO1xyXG4gICAgICAgICAgICAgICAgTllUID0gdGVtcDtcclxuICAgICAgICAgICAgICAgIGNvZGUgPSBueXRDb2RlICsgZml4ZWRDb2RlKHN5bWJvbCk7Ly9ueXQgKyBmaXhlZENvZGVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvZGUgPSBzLnBhdGguam9pbignJyk7Ly9nZXQgcGF0aFxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb2RlV29yZCArPSBjb2RlOy8vY29uY2F0IHRoZSBjb2RlXHJcblxyXG4gICAgICAgICAgICB1cGRhdGVDb3VudCh2KTsvL3VwZGF0ZSB0aGUgY291bnQgc3RhcnRpbmcgZnJvbSB0aGlzIG5vZGUgdG8gdGhlIHJvb3RcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IHN5bWJvbCBvZiBkYXRhKSB7XHJcbiAgICAgICAgICAgIHJlYWRTeW1ib2woc3ltYm9sKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7IGNvZGVXb3JkLCB0cmVlLCBkYXRhIH07XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5kZWNvZGVIdWZmbWFuID0gKGNvZGVXb3JkLCBkaWN0aW9uYXJ5ID0gW10pID0+IHtcclxuICAgICAgICBsZXQgZGljdGlvbmFyeUxlbmd0aCA9IGRpY3Rpb25hcnkubGVuZ3RoO1xyXG4gICAgICAgIGxldCBkYXRhID0gJycsIG55dENvZGUsIGNvZGUsIHBhdGggPSBbXTtcclxuICAgICAgICBsZXQgdHJlZSA9IG5ldyBUcmVlKCk7XHJcbiAgICAgICAgdHJlZS5zZXRBdHRyaWJ1dGVzKHsgY291bnQ6IDAsIGlkOiAnbnl0JyB9KTtcclxuICAgICAgICBsZXQgTllUID0gdHJlZTtcclxuICAgICAgICBsZXQgaTtcclxuICAgICAgICBsZXQgeyBlLCByIH0gPSAoKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgb2sgPSBmYWxzZTtcclxuICAgICAgICAgICAgbGV0IGUgPSAwLCByO1xyXG4gICAgICAgICAgICB3aGlsZSAoIW9rKSB7XHJcbiAgICAgICAgICAgICAgICBlKys7XHJcbiAgICAgICAgICAgICAgICByID0gZGljdGlvbmFyeUxlbmd0aCAtIDIgKiogZTtcclxuICAgICAgICAgICAgICAgIG9rID0gciA8IDIgKiogZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4geyBlLCByIH07XHJcbiAgICAgICAgfSkoKTtcclxuXHJcbiAgICAgICAgbGV0IHRyeVN3aXRjaGluZyA9IChub2RlKSA9PiB7Ly9zd2l0Y2ggbm9kZXMgaWYgbGVmdCBzaWRlIGlzIGdyZWF0ZXIgdGhhbiByaWdodCBzaWRlXHJcbiAgICAgICAgICAgIGlmIChub2RlLnZhbHVlc1swXS5nZXRBdHRyaWJ1dGUoJ2NvdW50JykgPiBub2RlLnZhbHVlc1sxXS5nZXRBdHRyaWJ1dGUoJ2NvdW50JykpIHtcclxuICAgICAgICAgICAgICAgIG5vZGUucmV2ZXJzZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgbGV0IHVwZGF0ZUNvdW50ID0gKHQpID0+IHsvL3VwZGF0ZSB0aGUgc2l6ZSBvZiB0aGUgY3VycmVudCBub2RlIGFuZCBpdCdzIG5leHQgcGFyZW50XHJcbiAgICAgICAgICAgIGxldCBjb3VudCA9IHQuZ2V0QXR0cmlidXRlKCdjb3VudCcpO1xyXG4gICAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgICAgICB0LnNldEF0dHJpYnV0ZXMoeyBjb3VudCB9KTtcclxuICAgICAgICAgICAgbGV0IHAgPSB0LnBhcmVudFRyZWU7XHJcbiAgICAgICAgICAgIGlmIChwICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRyeVN3aXRjaGluZyhwKTtcclxuICAgICAgICAgICAgICAgIHVwZGF0ZUNvdW50KHApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgcmVhZFN5bWJvbCA9IChzeW1ib2wpID0+IHtcclxuICAgICAgICAgICAgbGV0IHMgPSB0cmVlLnNlYXJjaCgodikgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHYuZ2V0QXR0cmlidXRlKCdpZCcpID09IHN5bWJvbDsvL3NlYXJjaCBhbmQgZ2V0IHN5bWJvbCBpZiBleGlzdHMgYWxyZWFkeVxyXG4gICAgICAgICAgICB9LCB0cmVlLmhlaWdodCk7XHJcblxyXG4gICAgICAgICAgICBsZXQgdiA9IHMudmFsdWU7XHJcbiAgICAgICAgICAgIG55dENvZGUgPSB0cmVlLnNlYXJjaCgodiwgaSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHYuZ2V0QXR0cmlidXRlKCdpZCcpID09ICdueXQnOy8vZ2V0IHRoZSBOWVQgY29kZVxyXG4gICAgICAgICAgICB9LCB0cmVlLmhlaWdodCkucGF0aC5qb2luKCcnKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh2ID09IHVuZGVmaW5lZCkgey8vbmV3IHN5bWJvbD8gYWRkIGl0IHRvIHRoZSB0cmVlIHdpdGggbmV3IE5ZVFxyXG4gICAgICAgICAgICAgICAgTllULnJlbW92ZUF0dHJpYnV0ZSgnaWQnKTtcclxuICAgICAgICAgICAgICAgIE5ZVC5wdXNoKFtdLCBbXSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGVtcCA9IE5ZVC52YWx1ZXNbMF07XHJcbiAgICAgICAgICAgICAgICB2ID0gTllULnZhbHVlc1sxXTtcclxuXHJcbiAgICAgICAgICAgICAgICB0ZW1wLnNldEF0dHJpYnV0ZXMoeyBpZDogJ255dCcsIGNvdW50OiAwIH0pO1xyXG4gICAgICAgICAgICAgICAgdi5zZXRBdHRyaWJ1dGVzKHsgaWQ6IHN5bWJvbCwgY291bnQ6IDAgfSk7XHJcbiAgICAgICAgICAgICAgICBOWVQgPSB0ZW1wO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB1cGRhdGVDb3VudCh2KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBpbnRlcnByZXRlID0gKG5vZGUpID0+IHtcclxuICAgICAgICAgICAgbGV0IGNvZGU7XHJcbiAgICAgICAgICAgIGlmIChub2RlID09IE5ZVCkgey8vaXMgbm9kZSBOWVRcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZTsgaisrKSB7Ly9yZWFkIG5leHQgNCBjb2Rlc1xyXG4gICAgICAgICAgICAgICAgICAgIHBhdGgucHVzaChjb2RlV29yZFsrK2ldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGxldCBwID0gcGFyc2VJbnQocGF0aC5qb2luKCcnKSwgMik7XHJcbiAgICAgICAgICAgICAgICBpZiAocCA8IHIpIHsvL3AgaXMgbW9yZSB0aGFuIHIsIHJlYWQgMSBtb3JlXHJcbiAgICAgICAgICAgICAgICAgICAgcGF0aC5wdXNoKGNvZGVXb3JkWysraV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHAgPSBwYXJzZUludChwYXRoLmpvaW4oJycpLCAyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHAgKz0gcjsvL2FkZCByIHRvIHBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvZGUgPSBkaWN0aW9uYXJ5W3BdOy8vZ2V0IHN5bWJvbCBmcm9tIGRpY3Rpb25hcnlcclxuICAgICAgICAgICAgICAgIHJlYWRTeW1ib2woY29kZSk7Ly9hZGQgdGhpcyBzeW1ib2wgdG8gdHJlZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29kZSA9IG5vZGUuZ2V0QXR0cmlidXRlKCdpZCcpOy8vZ2V0IHRoZSBzeW1ib2wgZnJvbSB0aGUgdHJlZVxyXG4gICAgICAgICAgICAgICAgcmVhZFN5bWJvbChjb2RlKTsvL3VwZGF0ZSB0aGUgc3ltYm9sXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGNvZGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGkgPSAtMTsgaSA8IGNvZGVXb3JkLmxlbmd0aDsgaSsrKSB7Ly9zdGFydCB3aXRoIGVtcHR5IE5ZVFxyXG4gICAgICAgICAgICBsZXQgY29kZSA9IGNvZGVXb3JkW2ldO1xyXG4gICAgICAgICAgICBpZiAoY29kZSAhPSB1bmRlZmluZWQpIHsvL3doZW4gbm90IGVtcHR5XHJcbiAgICAgICAgICAgICAgICBwYXRoLnB1c2goY29kZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IG5vZGUgPSB0cmVlLnRyYWNlKHBhdGgpLnZhbHVlO1xyXG4gICAgICAgICAgICBpZiAobm9kZS5nZXRBdHRyaWJ1dGUoJ2lkJykgIT0gdW5kZWZpbmVkKSB7Ly9pcyBub2RlIGxhYmVsbGVkXHJcbiAgICAgICAgICAgICAgICBwYXRoID0gW2l0ZW1dO1xyXG4gICAgICAgICAgICAgICAgZGF0YSArPSBpbnRlcnByZXRlKG5vZGUpOy8vd2hhdCBpcyB0aGlzIG5vZGVcclxuICAgICAgICAgICAgICAgIHBhdGggPSBbXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHsgZGF0YSwgdHJlZSwgY29kZVdvcmQgfTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmdvbG9tYiA9IChuLCBtKSA9PiB7XHJcbiAgICAgICAgbGV0IHEgPSBNYXRoLmZsb29yKG4gLyBtKTsvL3N0ZXAgMVxyXG4gICAgICAgIGxldCB1bmFyeSA9IEFycmF5KHEpLmZpbGwoMSkuam9pbignJykgKyAnMCc7Ly91bmFyeSBvZiBxXHJcblxyXG4gICAgICAgIGxldCBrID0gTWF0aC5jZWlsKE1hdGgubG9nMihtKSk7XHJcbiAgICAgICAgbGV0IGMgPSAyICoqIGsgLSBtO1xyXG4gICAgICAgIGxldCByID0gbiAlIG07XHJcbiAgICAgICAgbGV0IHJDID0gKCgpID0+IHsvL3JgXHJcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IHIudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgaWYgKHIgPCBjKSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHIudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gQXJyYXkoKGsgLSAxKSAtIHZhbHVlLmxlbmd0aCkuZmlsbCgwKS5qb2luKCcnKSArIHZhbHVlOy8vay0xIGJpdHMgcmVwIG9mIHJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gKHIgKyBjKS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBBcnJheShrIC0gdmFsdWUubGVuZ3RoKS5maWxsKDApLmpvaW4oJycpICsgdmFsdWU7Ly9rIGJpdHMgcmVwIG9mIHIrY1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICB9KSgpO1xyXG5cclxuICAgICAgICBsZXQgY29kZSA9IHVuYXJ5ICsgckM7Ly9jb25jYXQgdW5hcnkgYW5kIHInXHJcbiAgICAgICAgcmV0dXJuIGNvZGU7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5lbmNvZGVBcml0aG1ldGljID0gKGRhdGEsIHByb2JhYmlsaXRpZXMpID0+IHtcclxuICAgICAgICBsZXQgZ2V0WCA9IChuKSA9PiB7Ly9mKHgobikpPSBzdW0gb2YgeCgxKSAuLi4uIHgobilcclxuICAgICAgICAgICAgbGV0IHZhbHVlID0gMDtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSBpbiBwcm9iYWJpbGl0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobiA9PSBpKSBicmVhaztcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gKHZhbHVlIC8gMTAgKyBwcm9iYWJpbGl0aWVzW2ldIC8gMTApICogMTAwIC8gMTA7Ly9oYW5kbGUgdGhlIEpTIGRlY2ltYWwgcHJvYmxlbVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGwoMCkgPSAwLCB1KDApID0gMCwgZngoMCkgPSAwXHJcbiAgICAgICAgbGV0IGJvdW5kcyA9IFt7IGw6IDAsIHU6IDEgfV07XHJcblxyXG4gICAgICAgIGxldCBsb3dlck4gPSAobikgPT4gey8vbG93ZXIgbGltaXQgb2YgbiBsKG4pID0gbChuLTEpICsgKHUobi0xKSAtIGwobi0xKSkgKiBmKHgobi0xKSlcclxuICAgICAgICAgICAgbGV0IGJvdW5kID0gYm91bmRzW25dO1xyXG4gICAgICAgICAgICBsZXQgbCA9IGJvdW5kLmwgKyAoKGJvdW5kLnUgLSBib3VuZC5sKSAqIGdldFgoZGF0YVtuXSAtIDEpKTtcclxuICAgICAgICAgICAgcmV0dXJuIGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgdXBwZXJOID0gKG4pID0+IHsvL2xvd2VyIGxpbWl0IG9mIG4gdShuKSA9IGwobi0xKSArICh1KG4tMSkgLSBsKG4tMSkpICogZih4KG4pKVxyXG4gICAgICAgICAgICBsZXQgYm91bmQgPSBib3VuZHNbbl07XHJcbiAgICAgICAgICAgIGxldCB1ID0gYm91bmQubCArICgoYm91bmQudSAtIGJvdW5kLmwpICogZ2V0WChkYXRhW25dKSk7XHJcbiAgICAgICAgICAgIHJldHVybiB1O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGJvdW5kcy5wdXNoKHsgbDogbG93ZXJOKGkpLCB1OiB1cHBlck4oaSkgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgbiA9IGJvdW5kcy5wb3AoKTtcclxuICAgICAgICByZXR1cm4gKG4ubCArIG4udSkgLyAyO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZGVjb2RlQXJpdGhtZXRpYyA9ICh0YWcgPSAwLCBwcm9iYWJpbGl0aWVzKSA9PiB7XHJcbiAgICAgICAgbGV0IGRhdGEgPSAnJztcclxuICAgICAgICBsZXQgZ2V0WCA9IChuKSA9PiB7Ly9mKHgobikpPSBzdW0gb2YgeCgxKSAuLi4uIHgobilcclxuICAgICAgICAgICAgbGV0IHZhbHVlID0gMDtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSBpbiBwcm9iYWJpbGl0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobiA9PSBpKSBicmVhaztcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gKHZhbHVlIC8gMTAgKyBwcm9iYWJpbGl0aWVzW2ldIC8gMTApICogMTAwIC8gMTA7Ly9oYW5kbGUgdGhlIEpTIGRlY2ltYWwgcHJvYmxlbVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGwoMCkgPSAwLCB1KDApID0gMCwgZngoMCkgPSAwXHJcbiAgICAgICAgbGV0IGJvdW5kcyA9IFt7IGw6IDAsIHU6IDEgfV07XHJcblxyXG4gICAgICAgIGxldCBsb3dlck4gPSAobikgPT4gey8vbG93ZXIgbGltaXQgb2YgbiBsKG4pID0gbChuLTEpICsgKHUobi0xKSAtIGwobi0xKSkgKiBmKHgobi0xKSlcclxuICAgICAgICAgICAgbGV0IGJvdW5kID0gYm91bmRzW25dO1xyXG4gICAgICAgICAgICBsZXQgbCA9IGJvdW5kLmwgKyAoKGJvdW5kLnUgLSBib3VuZC5sKSAqIGdldFgoZGF0YVtuXSAtIDEpKTtcclxuICAgICAgICAgICAgcmV0dXJuIGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgdXBwZXJOID0gKG4pID0+IHsvL2xvd2VyIGxpbWl0IG9mIG4gdShuKSA9IGwobi0xKSArICh1KG4tMSkgLSBsKG4tMSkpICogZih4KG4pKVxyXG4gICAgICAgICAgICBsZXQgYm91bmQgPSBib3VuZHNbbl07XHJcbiAgICAgICAgICAgIGxldCB1ID0gYm91bmQubCArICgoYm91bmQudSAtIGJvdW5kLmwpICogZ2V0WChkYXRhW25dKSk7XHJcbiAgICAgICAgICAgIHJldHVybiB1O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGNvdW50ID0gMCwgY29tcGxldGUgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgd2hpbGUgKCFjb21wbGV0ZSkgey8vcnVuIHVudGlsIGFsbCB0aGUgY29kZXMgYXJlIGZvdW5kXHJcbiAgICAgICAgICAgIGxldCBmb3VuZCA9IGZhbHNlLCB4ID0gMSwgbiA9IHt9O1xyXG5cclxuICAgICAgICAgICAgd2hpbGUgKCFmb3VuZCkgey8vIGZvciBlYWNoIG5ldyBjb2RlXHJcbiAgICAgICAgICAgICAgICBsZXQgbCA9IGxvd2VyTihjb3VudCwgeCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgdSA9IHVwcGVyTihjb3VudCwgeCk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29tcGxldGUgPSAobCA+PSB0YWcgJiYgdGFnIDw9IHUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNvbXBsZXRlKSBicmVhazsvL2lmIGFsbCBpcyBmb3VuZCBzdG9wIHJ1bm5pbmdcclxuXHJcbiAgICAgICAgICAgICAgICBmb3VuZCA9IChsIDwgdGFnICYmIHRhZyA8IHUpOy8vY2hlY2sgaWYgaXQgc2FjdGlzZmllcyB0aGUgY29uZGl0aW9uc1xyXG4gICAgICAgICAgICAgICAgbiA9IHsgbCwgdSwgeCB9O1xyXG4gICAgICAgICAgICAgICAgeCsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChjb21wbGV0ZSkgYnJlYWs7XHJcbiAgICAgICAgICAgIGNvdW50Kys7XHJcblxyXG4gICAgICAgICAgICBib3VuZHMucHVzaChuKTsvL2FkZCBjb2RlXHJcbiAgICAgICAgICAgIGRhdGEgKz0gbi54O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmVuY29kZURpYWdyYW0gPSAoZGF0YSA9ICcnLCBkaWN0aW9uYXJ5ID0ge30pID0+IHsvL2RhaWdyYW0gY29kaW5nXHJcbiAgICAgICAgbGV0IGk7XHJcbiAgICAgICAgbGV0IGNvZGVXb3JkID0gJyc7XHJcbiAgICAgICAgbGV0IGVuY29kZSA9ICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IGZpcnN0ID0gZGF0YVtpXTsvL3Rha2UgdHdvIGF0IGEgdGltZVxyXG4gICAgICAgICAgICBsZXQgc2Vjb25kID0gZGF0YVtpICsgMV07XHJcbiAgICAgICAgICAgIGxldCBzeW1ib2wgPSBmaXJzdCArIHNlY29uZDtcclxuXHJcbiAgICAgICAgICAgIGxldCBjb2RlO1xyXG4gICAgICAgICAgICBpZiAoZGljdGlvbmFyeVtzeW1ib2xdICE9IHVuZGVmaW5lZCkgey8vaXMgc3ltYm9sIGluIGRpY3Rpb25hcnlcclxuICAgICAgICAgICAgICAgIGNvZGUgPSBkaWN0aW9uYXJ5W3N5bWJvbF07XHJcbiAgICAgICAgICAgICAgICBpKys7Ly9zZXQgY291bnQgdG8ga25vdyBpdCByZWFkIHR3b1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29kZSA9IGRpY3Rpb25hcnlbZmlyc3RdO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gY29kZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvZGVXb3JkICs9IGVuY29kZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGNvZGVXb3JkO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZW5jb2RlTFoxID0gKGRhdGEgPSAnJywgcGFyYW1zID0geyB3aW5kb3dTaXplOiAwLCBzZWFyY2hTaXplOiAwLCBsb29rQWhlYWRTaXplOiAwIH0pID0+IHsvL0xaNy8vTFoxLy9TbGlkaW5nIHdpbmRvd1xyXG4gICAgICAgIGlmIChwYXJhbXMud2luZG93U2l6ZSA9PSB1bmRlZmluZWQpIHBhcmFtcy53aW5kb3dTaXplID0gcGFyYW1zLnNlYXJjaFNpemUgKyBwYXJhbXMubG9va0FoZWFkU2l6ZTsvL2luaXQgdGhlIHdpbmRvdywgc2VhcmNoIGFuZCBsb29rYWhlYWQgc2l6ZXNcclxuICAgICAgICBpZiAocGFyYW1zLnNlYXJjaFNpemUgPT0gdW5kZWZpbmVkKSBwYXJhbXMuc2VhcmNoU2l6ZSA9IHBhcmFtcy53aW5kb3dTaXplIC0gcGFyYW1zLmxvb2tBaGVhZFNpemU7XHJcbiAgICAgICAgaWYgKHBhcmFtcy5sb29rQWhlYWRTaXplID09IHVuZGVmaW5lZCkgcGFyYW1zLmxvb2tBaGVhZFNpemUgPSBwYXJhbXMud2luZG93U2l6ZSAtIHBhcmFtcy5zZWFyY2hTaXplO1xyXG5cclxuXHJcbiAgICAgICAgbGV0IGkgPSAwLCBsb29rQWhlYWRTdG9wLCBzZWFyY2hTdG9wLCBsb29rQWhlYWRCdWZmZXIsIHNlYXJjaEJ1ZmZlcjsvL2luaXQgdGhlIGJ1ZmZlcnMgYW5kIGxvY2F0aW9uc1xyXG5cclxuICAgICAgICBsZXQgZ2V0VHJpcGxldCA9ICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IHggPSBsb29rQWhlYWRCdWZmZXJbMF07XHJcbiAgICAgICAgICAgIGxldCBwaWNrZWQgPSB7IG86IDAsIGw6IDAsIGM6IHggfTsvL3NldCB0aGUgdHJpcGxldCA8bywgbCwgYyhuKT5cclxuXHJcbiAgICAgICAgICAgIGlmIChzZWFyY2hCdWZmZXIuaW5jbHVkZXMoeCkpIHtcclxuICAgICAgICAgICAgICAgIGxldCBmb3VuZE1hdGNoZXMgPSBbXTsvL3N0b3JhZ2UgZm9yIHRoZSBtYXRjaGVzXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpIGluIHNlYXJjaEJ1ZmZlcikgey8vZmluZCBhbGwgdGhlIG1hdGNoZXMgaW4gc2VhcmNoIGJ1ZmZlclxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWFyY2hCdWZmZXJbaV0gPT0gcGlja2VkLmMpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbmRleEluRGF0YSA9ICtzZWFyY2hTdG9wICsgK2ksLy90aGlzIGlzIHRoZSBqb2ludCBvZiB0aGUgc2VhcmNoIGFuZCBsb29rQWhlYWQgYnVmZmVyc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXhJbkxvb2tBaGVhZCA9IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudCA9IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRjaGluZyA9IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRjaGVkID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlIChtYXRjaGluZykgey8va2VlcCBnZXR0aW5nIHRoZSBtYXRjaGVzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRjaGVkLnB1c2goZGF0YVtpbmRleEluRGF0YV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoaW5nID0gbG9va0FoZWFkQnVmZmVyW2luZGV4SW5Mb29rQWhlYWQgKyBjb3VudF0gPT09IGRhdGFbaW5kZXhJbkRhdGEgKyBjb3VudF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZm91bmRNYXRjaGVzLnB1c2goeyBvOiBzZWFyY2hCdWZmZXIubGVuZ3RoIC0gaSwgbDogbWF0Y2hlZC5sZW5ndGgsIGM6IGxvb2tBaGVhZEJ1ZmZlclttYXRjaGVkLmxlbmd0aF0gfSk7Ly9zYXZlIG1hdGNoZXNcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcGlja2VkID0gZm91bmRNYXRjaGVzWzBdO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgeSBvZiBmb3VuZE1hdGNoZXMpIHsvL2dldCB0aGUgbWF0Y2ggd2l0aCBtb3N0IHNpemUgYW5kIGNsb3Nlc3QgdG8gdGhlIGxvb2tBaGVhZCBidWZmZXJcclxuICAgICAgICAgICAgICAgICAgICBpZiAocGlja2VkLmwgPCB5LmwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGlja2VkID0geTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAocGlja2VkLmwgPT0geS5sICYmIHBpY2tlZC5vID4geS5vKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpY2tlZCA9IHk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpICs9IHBpY2tlZC5sO1xyXG4gICAgICAgICAgICByZXR1cm4gcGlja2VkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGxpc3QgPSBbXTtcclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBzZWFyY2hTdG9wID0gaSAtIHBhcmFtcy5zZWFyY2hTaXplO1xyXG4gICAgICAgICAgICBpZiAoc2VhcmNoU3RvcCA8IDApIHNlYXJjaFN0b3AgPSAwO1xyXG4gICAgICAgICAgICBsb29rQWhlYWRTdG9wID0gaSArIHBhcmFtcy5sb29rQWhlYWRTaXplO1xyXG4gICAgICAgICAgICBzZWFyY2hCdWZmZXIgPSBkYXRhLnNsaWNlKHNlYXJjaFN0b3AsIGkpLnNwbGl0KCcnKTtcclxuICAgICAgICAgICAgbG9va0FoZWFkQnVmZmVyID0gZGF0YS5zbGljZShpLCBsb29rQWhlYWRTdG9wKS5zcGxpdCgnJyk7XHJcbiAgICAgICAgICAgIGxpc3QucHVzaChnZXRUcmlwbGV0KCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGxpc3Q7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5kZWNvZGVMWjEgPSAodHJpcGxldHMgPSBbeyBvOiAwLCBsOiAwLCBjOiAnJyB9XSwgcGFyYW1zID0geyB3aW5kb3dTaXplOiAwLCBzZWFyY2hTaXplOiAwLCBsb29rQWhlYWRTaXplOiAwIH0pID0+IHtcclxuICAgICAgICBsZXQgd29yZCA9ICcnO1xyXG5cclxuICAgICAgICBpZiAocGFyYW1zLndpbmRvd1NpemUgPT0gdW5kZWZpbmVkKSBwYXJhbXMud2luZG93U2l6ZSA9IHBhcmFtcy5zZWFyY2hTaXplICsgcGFyYW1zLmxvb2tBaGVhZFNpemU7Ly9pbml0IHRoZSB3aW5kb3csIHNlYXJjaCBhbmQgbG9va2FoZWFkIHNpemVzXHJcbiAgICAgICAgaWYgKHBhcmFtcy5zZWFyY2hTaXplID09IHVuZGVmaW5lZCkgcGFyYW1zLnNlYXJjaFNpemUgPSBwYXJhbXMud2luZG93U2l6ZSAtIHBhcmFtcy5sb29rQWhlYWRTaXplO1xyXG4gICAgICAgIGlmIChwYXJhbXMubG9va0FoZWFkU2l6ZSA9PSB1bmRlZmluZWQpIHBhcmFtcy5sb29rQWhlYWRTaXplID0gcGFyYW1zLndpbmRvd1NpemUgLSBwYXJhbXMuc2VhcmNoU2l6ZTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgdCBvZiB0cmlwbGV0cykgey8vZGVjb2RlIGVhY2ggdHJpcGxldFxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHQubDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB3b3JkICs9ICh3b3JkW3dvcmQubGVuZ3RoIC0gdC5vXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgd29yZCArPSAodC5jKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB3b3JkO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZW5jb2RlTFoyID0gKGRhdGEgPSAnJykgPT4gey8vTFo4Ly9MWjJcclxuICAgICAgICBsZXQgZHVwbGV0cyA9IFtdOy8vaW5pdCBkdXBsZXQgbGlzdFxyXG4gICAgICAgIGxldCBlbnRyaWVzID0gW107Ly9pbml0IGRpY3Rpb25hcnlcclxuICAgICAgICBsZXQgaSwgbGFzdEluZGV4O1xyXG5cclxuICAgICAgICBsZXQgZ2V0UmFuZ2UgPSAocmFuZ2UpID0+IHsvL2dldCB0aGUgc3ltYm9scyB3aXRoaW4gdGhlIHJhbmdlXHJcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9ICcnO1xyXG4gICAgICAgICAgICBmb3IgKGxldCByIG9mIHJhbmdlKSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSArPSBkYXRhW3JdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBlbmNvZGUgPSAocmFuZ2UpID0+IHtcclxuICAgICAgICAgICAgbGV0IGUgPSBnZXRSYW5nZShyYW5nZSk7Ly9nZXQgdGhlIHZhbHVlIG9mIHRoZSByYW5nZVxyXG4gICAgICAgICAgICBsZXQgaW5kZXggPSBlbnRyaWVzLmluZGV4T2YoZSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgZCA9IHsgaTogbGFzdEluZGV4LCBjOiBlW2UubGVuZ3RoIC0gMV0gfTsvL2NyZWF0ZSBkdXBsZXRcclxuICAgICAgICAgICAgaWYgKGluZGV4ID09IC0xKSB7Ly9jdXJyZW50IGdyb3VwIG9mIHN5bWJvbHMgaXMgaW4gbm90IGluIHRoZSBkaWN0aW9uYXJ5XHJcbiAgICAgICAgICAgICAgICBlbnRyaWVzLnB1c2goZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByYW5nZS5wdXNoKCsraSk7XHJcbiAgICAgICAgICAgICAgICBsYXN0SW5kZXggPSBpbmRleCArIDE7XHJcbiAgICAgICAgICAgICAgICBkID0gZW5jb2RlKHJhbmdlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsYXN0SW5kZXggPSAwO1xyXG4gICAgICAgICAgICBkdXBsZXRzLnB1c2goZW5jb2RlKFtpXSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGR1cGxldHM7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5kZWNvZGVMWjIgPSAoZHVwbGV0cyA9IFt7IGk6IDAsIGM6ICcnIH1dKSA9PiB7XHJcbiAgICAgICAgbGV0IGVudHJpZXMgPSBbXTsvL2luaXQgZGljdGlvbmFyeVxyXG4gICAgICAgIGxldCBjO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBkIG9mIGR1cGxldHMpIHsvL2RlY29kZSBlYWNoIGR1cGxldFxyXG4gICAgICAgICAgICBjID0gJyc7XHJcbiAgICAgICAgICAgIGlmIChkLmkgIT0gMCkge1xyXG4gICAgICAgICAgICAgICAgYyA9IGVudHJpZXNbZC5pIC0gMV07Ly9nZXQgdGhlIGNvZGUgZnJvbSB0aGUgZGljdGlvbmFyeVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGMgKz0gZC5jO1xyXG4gICAgICAgICAgICBlbnRyaWVzLnB1c2goYyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZW50cmllcy5qb2luKCcnKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmVuY29kZUxaVyA9IChkYXRhID0gJycsIGluaXREaWN0aW9uYXJ5ID0gW10pID0+IHtcclxuICAgICAgICBsZXQgY29kZVdvcmQgPSBbXSwgbGFzdEluZGV4LCBpO1xyXG4gICAgICAgIGxldCBlbnRyaWVzID0gQXJyYXkuZnJvbShpbml0RGljdGlvbmFyeSk7XHJcblxyXG4gICAgICAgIGxldCBnZXRSYW5nZSA9IChyYW5nZSkgPT4gey8vIGdldCB0aGUgdmFsdWVzIHdpdGhpbiB0aGUgcmFuZ2VcclxuICAgICAgICAgICAgbGV0IHZhbHVlID0gJyc7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHIgb2YgcmFuZ2UpIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlICs9IGRhdGFbcl07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGVuY29kZSA9IChyYW5nZSkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgZSA9IGdldFJhbmdlKHJhbmdlKTtcclxuICAgICAgICAgICAgbGV0IGluZGV4ID0gZW50cmllcy5pbmRleE9mKGUpO1xyXG4gICAgICAgICAgICBpZiAoaW5kZXggPT0gLTEpIHsvL2lzIHZhbHVlIG5vdCBpbiBkaWN0aW9uYXJ5P1xyXG4gICAgICAgICAgICAgICAgZW50cmllcy5wdXNoKGUpOy8vYWRkIGl0IGFuZCBzZXQgdGhlIGNvdW50ZXIgdG8gdGhlIGxhc3QgcmVhZCBzeW1ib2xcclxuICAgICAgICAgICAgICAgIGluZGV4ID0gMDtcclxuICAgICAgICAgICAgICAgIGktLTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGkrKzsvL3NldCB0aGUgY291bnRlciB0byB0aGUgbmV4dCBzeW1ib2wgYW5kIHRyeSBlbmNvZGluZyB0aGUgcmFuZ2VcclxuICAgICAgICAgICAgICAgIHJhbmdlLnB1c2goaSk7XHJcbiAgICAgICAgICAgICAgICBsYXN0SW5kZXggPSBpbmRleCArPSAxOy8vc2V0IHRoZSBsYXN0IHJlYWQgaW5kZXgsIHRoaXMgaXMgdGhlIGNvZGVcclxuICAgICAgICAgICAgICAgIGUgPSBlbmNvZGUocmFuZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBsYXN0SW5kZXg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsYXN0SW5kZXggPSAwO1xyXG4gICAgICAgICAgICBsZXQgY29kZSA9IGVuY29kZShbaV0pO1xyXG4gICAgICAgICAgICBpZiAoY29kZSAhPSB1bmRlZmluZWQpIHsvL2NvZGUgd2FzIGNyZWF0ZWRcclxuICAgICAgICAgICAgICAgIGNvZGVXb3JkLnB1c2goY29kZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBjb2RlV29yZDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmRlY29kZUxaVyA9IChzaW5nbGV0b24gPSBbXSwgaW5pdERpY3Rpb25hcnkgPSBbXSkgPT4ge1xyXG4gICAgICAgIGxldCB3b3JkID0gJycsIGNvZGVXb3JkID0gW10sIHN0YXRlLCBjb3VudCA9IDAsIHJlYnVpbGQgPSBmYWxzZSwgYnVpbGRXaXRoID0gJycsIGksIHN0YXJ0ID0gMDtcclxuICAgICAgICBsZXQgZW50cmllcyA9IEFycmF5LmZyb20oaW5pdERpY3Rpb25hcnkpO1xyXG5cclxuICAgICAgICBsZXQgZ2V0Q29kZSA9IChyYW5nZSkgPT4gey8vZ2V0IHRoZSBjb2RlIHdpdGhpbiB0aGUgcmFuZ2VcclxuICAgICAgICAgICAgbGV0IHZhbHVlID0gJyc7XHJcbiAgICAgICAgICAgIGNvdW50ID0gMDtcclxuICAgICAgICAgICAgYnVpbGRXaXRoID0gJyc7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHIgb2YgcmFuZ2UpIHtcclxuICAgICAgICAgICAgICAgIGlmICh3b3JkW3JdID09IHVuZGVmaW5lZCkgey8vaXQgaXMgbm90IGNvbXBsZXRlXHJcbiAgICAgICAgICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICAgICAgICAgICAgICByZWJ1aWxkID0gdHJ1ZTsvL3NldCB0byByZWJ1aWxkXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBidWlsZFdpdGggKz0gd29yZFtyXTsvL3NldCB0byByZWJ1aWxkIHdpdGggaW5jYXNlIG9mIG5vdCBjb21wbGV0ZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFsdWUgKz0gd29yZFtyXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgZGVjb2RlID0gKHJhbmdlID0gW10pID0+IHtcclxuICAgICAgICAgICAgbGV0IGUgPSBnZXRDb2RlKHJhbmdlKTtcclxuICAgICAgICAgICAgbGV0IGluZGV4ID0gZW50cmllcy5pbmRleE9mKGUpO1xyXG4gICAgICAgICAgICBpZiAoaW5kZXggPT0gLTEpIHsvL2lzIG5vdCBpbiBkaWN0aW9uYXJ5P1xyXG4gICAgICAgICAgICAgICAgZW50cmllcy5wdXNoKGUpO1xyXG4gICAgICAgICAgICAgICAgaS0tOy8vc2V0IHRoZSBjb3VudGVyIHRvIHRoZSBsYXN0IHN5bWJvbCByZWFkXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICArK2k7XHJcbiAgICAgICAgICAgICAgICByYW5nZS5wdXNoKGkpO1xyXG4gICAgICAgICAgICAgICAgZGVjb2RlKHJhbmdlKTsvL2FkZCBuZXh0IHN5bWJvbCBhbmQgZGVjb2RlIGFnYWluXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgYnVpbGQgPSAoc3RhdGUpID0+IHsvL2J1aWxkIHVwIHRoZSBkaWN0aW9uYXJ5IGZyb20gdGhlIGRlY29kZWQgdmFsdWVzXHJcbiAgICAgICAgICAgIGZvciAoaSA9IHN0YXJ0OyBpIDwgd29yZC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IGUgPSBkZWNvZGUoW2ldKTtcclxuICAgICAgICAgICAgICAgIGlmIChlbnRyaWVzLmxlbmd0aCA9PSBzdGF0ZSkgey8vc3RvcCBhdCB0aGUgY3VycmVudCBkZWNvZGluZyBwb2ludFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0ID0gaSArIDEgLSBjb3VudDsvL3NldCBuZXh0IHN0YXJ0aW5nIHBvaW50IGF0IHRoZSBjdXJyZW50IHN0b3BcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgcyBvZiBzaW5nbGV0b24pIHtcclxuICAgICAgICAgICAgbGV0IGUgPSBlbnRyaWVzW3MgLSAxXTtcclxuICAgICAgICAgICAgaWYgKGUgPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBidWlsZChzKTsvL2J1aWxkIHRoZSBkaWN0aW9uYXJ5XHJcbiAgICAgICAgICAgICAgICBlID0gZW50cmllc1tzIC0gMV07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvZGVXb3JkLnB1c2goZSk7XHJcbiAgICAgICAgICAgIHdvcmQgPSBjb2RlV29yZC5qb2luKCcnKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZWJ1aWxkKSB7Ly9yZWJ1aWxkIHRoZSBsYXN0IGVudHJ5IGluIHRoZSBkaWN0aW9uYXJ5IFxyXG4gICAgICAgICAgICAgICAgcmVidWlsZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7Ly9rZWVwIGFkZCBpdGVtcyB0byB0aGUgYnVpbGR3aXRoIHRvIHRoZSBidWlsZHdpdGggdW50aWwgaXQgaXMgY29tcGxldGVcclxuICAgICAgICAgICAgICAgICAgICBidWlsZFdpdGggKz0gYnVpbGRXaXRoW2ldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29kZVdvcmQucG9wKCk7Ly9zZXQgbGFzdCBidWlsdCBhbmQgbGFzdCBkZWNvZGVkIHRvIHRoZSBuZXcgYnVpbGRcclxuICAgICAgICAgICAgICAgIGNvZGVXb3JkLnB1c2goYnVpbGRXaXRoKTtcclxuICAgICAgICAgICAgICAgIGVudHJpZXMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICBlbnRyaWVzLnB1c2goYnVpbGRXaXRoKTtcclxuICAgICAgICAgICAgICAgIHN0YXJ0ICs9IGNvdW50Oy8vc2V0IHRoZSBuZXh0IGJ1aWxkIHN0YXJ0aW5nIHBvaW50XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB3b3JkO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENvbXByZXNzaW9uO1xyXG4iLCJjb25zdCBPYmplY3RzTGlicmFyeSA9IHJlcXVpcmUoJy4vT2JqZWN0c0xpYnJhcnknKTtcclxubGV0IG9iamVjdExpYnJhcnkgPSBuZXcgT2JqZWN0c0xpYnJhcnkoKTtcclxuXHJcbmZ1bmN0aW9uIEluZGV4ZWRMaWJyYXJ5KG5hbWUsIHZlcnNpb24pIHtcclxuICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICB0aGlzLnZlcnNpb24gPSB2ZXJzaW9uO1xyXG4gICAgdGhpcy5pbml0aWFsaXplZCA9IGZhbHNlO1xyXG4gICAgdGhpcy5pbmRleGVkREIgPSB3aW5kb3cuaW5kZXhlZERCIHx8IHdpbmRvdy5tb3pJbmRleGVkREIgfHwgd2luZG93LndlYmtpdEluZGV4ZWREQiB8fCB3aW5kb3cubXNJbmRleGVkREI7XHJcbiAgICB0aGlzLklEQlRyYW5zYWN0aW9uID0gd2luZG93LklEQlRyYW5zYWN0aW9uIHx8IHdpbmRvdy53ZWJraXRJREJUcmFuc2FjdGlvbiB8fCB3aW5kb3cubXNJREJUcmFuc2FjdGlvbjtcclxuICAgIHRoaXMuSURCS2V5UmFuZ2UgPSB3aW5kb3cuSURCS2V5UmFuZ2UgfHwgd2luZG93LndlYmtpdElEQktleVJhbmdlIHx8IHdpbmRvdy5tc0lEQktleVJhbmdlO1xyXG5cclxuICAgIHRoaXMuaW5pdCA9IGZ1bmN0aW9uIChjYWxsYmFjaykgey8vaW5pdGlhbGl6ZSBkYiBieSBzZXR0aW5nIHRoZSBjdXJyZW50IHZlcnNpb25cclxuICAgICAgICBjb25zdCByZXF1ZXN0ID0gdGhpcy5pbmRleGVkREIub3Blbih0aGlzLm5hbWUpO1xyXG4gICAgICAgIHJlcXVlc3Qub251cGdyYWRlbmVlZGVkID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgKGNhbGxiYWNrKGV2ZW50LnRhcmdldC5yZXN1bHQpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy52ZXJzaW9uID0gTWF0aC5mbG9vcihyZXF1ZXN0LnJlc3VsdC52ZXJzaW9uKSB8fCBNYXRoLmZsb29yKHRoaXMudmVyc2lvbik7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVxdWVzdC5vbmVycm9yID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LnRhcmdldC5lcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZ2V0VmVyc2lvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCByZXF1ZXN0ID0gdGhpcy5pbmRleGVkREIub3Blbih0aGlzLm5hbWUpO1xyXG4gICAgICAgICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudmVyc2lvbiA9PSB1bmRlZmluZWQgfHwgdGhpcy52ZXJzaW9uIDwgcmVxdWVzdC5yZXN1bHQudmVyc2lvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmVyc2lvbiA9IHJlcXVlc3QucmVzdWx0LnZlcnNpb247XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0LnJlc3VsdC5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLnZlcnNpb24pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0Lm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm9wZW4gPSBhc3luYyBmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuICAgICAgICBpZiAodGhpcy52ZXJzaW9uID09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLmdldFZlcnNpb24oKTsvL3NldCB0aGUgdmVyc2lvbiBpZiBub3Qgc2V0XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlcXVlc3QgPSB0aGlzLmluZGV4ZWREQi5vcGVuKHRoaXMubmFtZSwgdGhpcy52ZXJzaW9uKTsvL29wZW4gZGJcclxuICAgICAgICAgICAgcmVxdWVzdC5vbnVwZ3JhZGVuZWVkZWQgPSAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmVyc2lvbiA9IHJlcXVlc3QucmVzdWx0LnZlcnNpb247Ly91cGRhdGUgdmVyc2lvbiBhZnRlciB1cGdyYWRlXHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PSAnZnVuY3Rpb24nKSB7Ly9ydW4gdGhlIGNhbGxiYWNrIGlmIHNldFxyXG4gICAgICAgICAgICAgICAgICAgIGxldCB3b3JrZWREYiA9IGNhbGxiYWNrKGV2ZW50LnRhcmdldC5yZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHdvcmtlZERiLm9uZXJyb3IgPSB3b3JrZWRFdmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdCh3b3JrZWRFdmVudC50YXJnZXQuZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoZXZlbnQudGFyZ2V0LnJlc3VsdCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3Qub25lcnJvciA9IChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmNvbGxlY3Rpb25FeGlzdHMgPSBmdW5jdGlvbiAoY29sbGVjdGlvbikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9wZW4oKS50aGVuKGRiID0+IHtcclxuICAgICAgICAgICAgbGV0IGV4aXN0cyA9IGRiLm9iamVjdFN0b3JlTmFtZXMuY29udGFpbnMoY29sbGVjdGlvbik7Ly9jaGVjayBpZiBkYiBoYXMgdGhpcyBjb2xsZWN0aW9uIGluIG9iamVjdHN0b3JlXHJcbiAgICAgICAgICAgIHJldHVybiBleGlzdHM7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jcmVhdGVDb2xsZWN0aW9uID0gYXN5bmMgZnVuY3Rpb24gKC4uLmNvbGxlY3Rpb25zKSB7XHJcbiAgICAgICAgbGV0IHZlcnNpb24gPSBhd2FpdCB0aGlzLmdldFZlcnNpb24oKTsvL3VwZ3JhZGUgY29sbGVjdGlvblxyXG4gICAgICAgIHRoaXMudmVyc2lvbiA9IHZlcnNpb24gKyAxO1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9wZW4oZGIgPT4ge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBjb2xsZWN0aW9uIG9mIGNvbGxlY3Rpb25zKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWRiLm9iamVjdFN0b3JlTmFtZXMuY29udGFpbnMoY29sbGVjdGlvbikpIHsvL2NyZWF0ZSBuZXcgY29sbGVjdGlvbiBhbmQgc2V0IF9pZCBhcyB0aGUga2V5cGF0aFxyXG4gICAgICAgICAgICAgICAgICAgIGRiLmNyZWF0ZU9iamVjdFN0b3JlKGNvbGxlY3Rpb24sIHsga2V5UGF0aDogJ19pZCcgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGRiO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZmluZCA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLm9wZW4oKS50aGVuKGRiID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBkb2N1bWVudHMgPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZGIub2JqZWN0U3RvcmVOYW1lcy5jb250YWlucyhwYXJhbXMuY29sbGVjdGlvbikpIHsvL2NvbGxlY3Rpb24gZXhpc3RzXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRyYW5zYWN0aW9uID0gZGIudHJhbnNhY3Rpb24ocGFyYW1zLmNvbGxlY3Rpb24sICdyZWFkb25seScpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0cmFuc2FjdGlvbi5vbmVycm9yID0gZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYi5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zYWN0aW9uLm9uY29tcGxldGUgPSBldmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJhbXMubWFueSA9PSB0cnVlKSB7Ly9tYW55IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGIuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZG9jdW1lbnRzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRiLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGRvY3VtZW50c1swXSk7Ly9zaW5nbGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHN0b3JlID0gdHJhbnNhY3Rpb24ub2JqZWN0U3RvcmUocGFyYW1zLmNvbGxlY3Rpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gc3RvcmUub3BlbkN1cnNvcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjdXJzb3I7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3Qub25lcnJvciA9IChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYi5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnNvciA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJzb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJhbXMucXVlcnkgPT0gdW5kZWZpbmVkKSB7Ly9maW5kIGFueVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50cy5wdXNoKGN1cnNvci52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChvYmplY3RMaWJyYXJ5LmlzU3ViT2JqZWN0KGN1cnNvci52YWx1ZSwgcGFyYW1zLnF1ZXJ5KSkgey8vZmluZCBzcGVjaWZpY1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50cy5wdXNoKGN1cnNvci52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJzb3IuY29udGludWUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocGFyYW1zLm1hbnkgPT0gdHJ1ZSkgey8vbWFueSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGIuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkb2N1bWVudHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGIuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkb2N1bWVudHNbMF0pOy8vc2luZ2xlXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KS5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICBkYi5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5lbXB0eUNvbGxlY3Rpb24gPSBmdW5jdGlvbiAoY29sbGVjdGlvbikge1xyXG4gICAgICAgIGxldCByZW1vdmVkQ291bnQgPSAwLCBmb3VuZENvdW50ID0gMDsvL3NldCB0aGUgY291bnRlcnNcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmZpbmQoeyBjb2xsZWN0aW9uLCBxdWVyeToge30sIG1hbnk6IHRydWUgfSkudGhlbihmb3VuZCA9PiB7Ly9maW5kIGFsbCBkb2N1bWVudHNcclxuICAgICAgICAgICAgICAgIHRoaXMub3BlbigpLnRoZW4oZGIgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYi5vYmplY3RTdG9yZU5hbWVzLmNvbnRhaW5zKGNvbGxlY3Rpb24pKSB7Ly9oYW5kbGUgY29sbGVjdGlvbiBub24tZXhpc3RlbmNlIGVycm9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0cmFuc2FjdGlvbiA9IGRiLnRyYW5zYWN0aW9uKGNvbGxlY3Rpb24sICdyZWFkd3JpdGUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHN0b3JlID0gdHJhbnNhY3Rpb24ub2JqZWN0U3RvcmUoY29sbGVjdGlvbik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2FjdGlvbi5vbmVycm9yID0gZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGIuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChldmVudC50YXJnZXQuZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2FjdGlvbi5vbmNvbXBsZXRlID0gZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGIuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoeyBhY3Rpb246ICdlbXB0eWNvbGxlY3Rpb24nLCByZW1vdmVkQ291bnQsIG9rOiByZW1vdmVkQ291bnQgPT0gZm91bmRDb3VudCB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3VuZENvdW50ID0gZm91bmQubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBkYXRhIG9mIGZvdW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVxdWVzdCA9IHN0b3JlLmRlbGV0ZShkYXRhLl9pZCk7Ly9kZWxldGUgZWFjaCBkb2N1bWVudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdC5vbmVycm9yID0gZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBFcnJvciB3aGlsZSBkZWxldGluZyBkb2N1bWVudHMgPT4gJHtldmVudC50YXJnZXQuZXJyb3J9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSBldmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlZENvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRiLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoeyByZW1vdmVkQ291bnQsIG9rOiByZW1vdmVkQ291bnQgPT0gZm91bmRDb3VudCB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KS5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGIuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgICAgICAgICAgIGRiLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZG9jdW1lbnRFeGlzdHMgPSBmdW5jdGlvbiAocGFyYW1zKSB7XHJcbiAgICAgICAgZGVsZXRlIHBhcmFtcy5tYW55Oy8vY2hlY2sgZm9yIG9ubHkgb25lXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZmluZChwYXJhbXMpLnRoZW4ocmVzID0+IHsvL1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzICE9IHVuZGVmaW5lZDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmdlbmVyYXRlSWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgbGV0IGlkID0gRGF0ZS5ub3coKS50b1N0cmluZygzNikgKyBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zbGljZSgyKSArIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnNsaWNlKDIpOy8vZ2VuZXJhdGUgdGhlIGlkIHVzaW5nIHRpbWVcclxuICAgICAgICByZXR1cm4gaWQ7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jaGVja0lkID0gZnVuY3Rpb24gKHJlcXVlc3QsIF9pZCwgY2FsbGJhY2spIHtcclxuICAgICAgICBpZiAodHlwZW9mIF9pZCAhPSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICBfaWQgPSB0aGlzLmdlbmVyYXRlSWQoKTsvL2dldCBuZXcgX2lkIGlmIG5vdCBzZXRcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGdldCA9IHJlcXVlc3QuZ2V0KF9pZCk7Ly9jaGVjayBpZiBleGlzdGluZ1xyXG4gICAgICAgIGdldC5vbnN1Y2Nlc3MgPSBldmVudCA9PiB7XHJcbiAgICAgICAgICAgIGlmIChldmVudC50YXJnZXQucmVzdWx0ICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja0lkKHJlcXVlc3QsIF9pZCwgY2FsbGJhY2spO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soX2lkKTsvL3VzZSB0aGUgX2lkXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldC5vbmVycm9yID0gZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgRXJyb3IgY2hlY2tpbmcgSUQgPT4gJHtldmVudC50YXJnZXQuZXJyb3J9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuYWRkID0gZnVuY3Rpb24gKHBhcmFtcywgZGIpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgdHJhbnNhY3Rpb24gPSBkYi50cmFuc2FjdGlvbihwYXJhbXMuY29sbGVjdGlvbiwgJ3JlYWR3cml0ZScpO1xyXG4gICAgICAgICAgICB0cmFuc2FjdGlvbi5vbmVycm9yID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkYi5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcilcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHRyYW5zYWN0aW9uLm9uY29tcGxldGUgPSAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGRiLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKHsgYWN0aW9uOiAnaW5zZXJ0JywgZG9jdW1lbnRzOiBwYXJhbXMucXVlcnkgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gdHJhbnNhY3Rpb24ub2JqZWN0U3RvcmUocGFyYW1zLmNvbGxlY3Rpb24pO1xyXG5cclxuICAgICAgICAgICAgaWYgKHBhcmFtcy5tYW55ID09IHRydWUgJiYgQXJyYXkuaXNBcnJheShwYXJhbXMucXVlcnkpKSB7Ly8gZm9yIG1hbnlcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHF1ZXJ5IG9mIHBhcmFtcy5xdWVyeSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tJZChyZXF1ZXN0LCBxdWVyeS5faWQsIF9pZCA9PiB7Ly92YWxpZGF0ZSBfaWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnkuX2lkID0gX2lkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXF1ZXN0LmFkZChxdWVyeSk7Ly9hZGRcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tJZChyZXF1ZXN0LCBwYXJhbXMucXVlcnkuX2lkLCBfaWQgPT4gey8vdmFsaWRhdGUgX2lkXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zLnF1ZXJ5Ll9pZCA9IF9pZDtcclxuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0LmFkZChwYXJhbXMucXVlcnkpOy8vYWRkXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaW5zZXJ0ID0gYXN5bmMgZnVuY3Rpb24gKHBhcmFtcykge1xyXG4gICAgICAgIGxldCBpc0NvbGxlY3Rpb24gPSBhd2FpdCB0aGlzLmNvbGxlY3Rpb25FeGlzdHMocGFyYW1zLmNvbGxlY3Rpb24pO1xyXG4gICAgICAgIGlmIChpc0NvbGxlY3Rpb24pIHsvL2NvbGxlY3Rpb24gaXMgZXhpc3RpbmdcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMub3BlbigpXHJcbiAgICAgICAgICAgICAgICAudGhlbihkYiA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWRkKHBhcmFtcywgZGIpOy8vYWRkIHRvIGNvbGxlY3Rpb25cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlcnJvcjtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlQ29sbGVjdGlvbihwYXJhbXMuY29sbGVjdGlvbikvL2NyZWF0ZSBjb2xsZWN0aW9uXHJcbiAgICAgICAgICAgICAgICAudGhlbihkYiA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWRkKHBhcmFtcywgZGIpOy8vYWRkIHRvIG5ldyBDb2xsZWN0aW9uXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXJyb3I7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy51cGRhdGUgPSBmdW5jdGlvbiAocGFyYW1zKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5vcGVuKCkudGhlbihkYiA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWRiLm9iamVjdFN0b3JlTmFtZXMuY29udGFpbnMocGFyYW1zLmNvbGxlY3Rpb24pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGIuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoJ0NvbGxlY3Rpb24gbm90IGZvdW5kJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHRyYW5zYWN0aW9uID0gZGIudHJhbnNhY3Rpb24ocGFyYW1zLmNvbGxlY3Rpb24sICdyZWFkd3JpdGUnKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0cmFuc2FjdGlvbi5vbmVycm9yID0gZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGRiLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdHJhbnNhY3Rpb24ub25jb21wbGV0ZSA9IGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBkYi5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoeyBhY3Rpb246ICd1cGRhdGUnLCBkb2N1bWVudHMgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHN0b3JlID0gdHJhbnNhY3Rpb24ub2JqZWN0U3RvcmUocGFyYW1zLmNvbGxlY3Rpb24pO1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSBzdG9yZS5vcGVuQ3Vyc29yKCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgZG9jdW1lbnRzID0ge307XHJcblxyXG4gICAgICAgICAgICAgICAgcmVxdWVzdC5vbmVycm9yID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGIuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXZlbnQudGFyZ2V0LmVycm9yKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9IChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjdXJzb3IgPSBldmVudC50YXJnZXQucmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBmb3VuZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJzb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdExpYnJhcnkuaXNTdWJPYmplY3QoY3Vyc29yLnZhbHVlLCBwYXJhbXMuY2hlY2spKSB7Ly9yZXRyaWV2ZSB0aGUgbWF0Y2hlZCBkb2N1bWVudHNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgaW4gcGFyYW1zLnF1ZXJ5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yLnZhbHVlW2ldID0gcGFyYW1zLnF1ZXJ5W2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlcyA9IGN1cnNvci51cGRhdGUoY3Vyc29yLnZhbHVlKTsvL3VwZGF0ZVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMub25lcnJvciA9IChyRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnRzW3JFdmVudC50YXJnZXQucmVzdWx0XSA9IHsgdmFsdWU6IGN1cnNvci52YWx1ZSwgc3RhdHVzOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLm9uc3VjY2VzcyA9IChyRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnRzW3JFdmVudC50YXJnZXQucmVzdWx0XSA9IHsgdmFsdWU6IGN1cnNvci52YWx1ZSwgc3RhdHVzOiB0cnVlIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYi5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJhbXMubWFueSA9PSB0cnVlIHx8IGZvdW5kID09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJzb3IuY29udGludWUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0pLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgICAgICAgICAgIGRiLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnNhdmUgPSBmdW5jdGlvbiAocGFyYW1zID0geyBjb2xsZWN0aW9uOiAnJywgcXVlcnk6IHt9LCBjaGVjazoge30gfSkge1xyXG4gICAgICAgIC8vY2hlY2sgZXhpc3RlbmNlIG9mIGRvY3VtZW50XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZG9jdW1lbnRFeGlzdHMoeyBjb2xsZWN0aW9uOiBwYXJhbXMuY29sbGVjdGlvbiwgcXVlcnk6IHBhcmFtcy5jaGVjayB9KS50aGVuKGV4aXN0cyA9PiB7XHJcbiAgICAgICAgICAgIGlmIChleGlzdHMgPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmluc2VydChwYXJhbXMpOy8vaW5zZXJ0IGlmIG5vdCBmb3VuZFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudXBkYXRlKHBhcmFtcyk7Ly8gdXBkYXRlIGlmIGZvdW5kXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmRlbGV0ZSA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcclxuICAgICAgICBsZXQgZm91bmRDb3VudCA9IDAsIHJlbW92ZWRDb3VudCA9IDA7Ly9zZXQgdGhlIGNvdW50ZXJzXHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5maW5kKHBhcmFtcykudGhlbihmb3VuZCA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9wZW4oKS50aGVuKGRiID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgdHJhbnNhY3Rpb24gPSBkYi50cmFuc2FjdGlvbihwYXJhbXMuY29sbGVjdGlvbiwgJ3JlYWR3cml0ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzdG9yZSA9IHRyYW5zYWN0aW9uLm9iamVjdFN0b3JlKHBhcmFtcy5jb2xsZWN0aW9uKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNhY3Rpb24ub25lcnJvciA9IGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGIuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGV2ZW50LnRhcmdldC5lcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB0cmFuc2FjdGlvbi5vbmNvbXBsZXRlID0gZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYi5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHsgYWN0aW9uOiAnZGVsZXRlJywgcmVtb3ZlZENvdW50LCBvazogcmVtb3ZlZENvdW50ID09IGZvdW5kQ291bnQgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShmb3VuZCkpIHsvL2lmIG1hbnlcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm91bmRDb3VudCA9IGZvdW5kLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgZGF0YSBvZiBmb3VuZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSBzdG9yZS5kZWxldGUoZGF0YS5faWQpOy8vZGVsZXRlIGVhY2hcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3Qub25lcnJvciA9IGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgRXJyb3Igd2hpbGUgZGVsZXRpbmcgZG9jdW1lbnRzID0+ICR7ZXZlbnQudGFyZ2V0LmVycm9yfWApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZWRDb3VudCsrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGZvdW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kQ291bnQgPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVxdWVzdCA9IHN0b3JlLmRlbGV0ZShmb3VuZC5faWQpOy8vZGVsZXRlIGRvY3VtZW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3Qub25lcnJvciA9IGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBFcnJvciB3aGlsZSBkZWxldGluZyBkb2N1bWVudHMgPT4gJHtldmVudC50YXJnZXQuZXJyb3J9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlZENvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KS5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGIuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgICAgICAgICAgIGRiLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbmRleGVkTGlicmFyeTtcclxuIiwiY29uc3QgQXJyYXlMaWJyYXJ5ID0gcmVxdWlyZSgnLi9BcnJheUxpYnJhcnknKTtcclxubGV0IGFycmF5TGlicmFyeSA9IG5ldyBBcnJheUxpYnJhcnkoKTtcclxuXHJcbmZ1bmN0aW9uIE1hdGhzTGlicmFyeSgpIHtcclxuXHJcbiAgICB0aGlzLnBsYWNlVW5pdCA9IChudW0sIHZhbHVlLCBjb3VudCkgPT4ge1xyXG4gICAgICAgIG51bSA9IE1hdGguZmxvb3IobnVtKS50b1N0cmluZygpO1xyXG4gICAgICAgIHZhbHVlID0gdmFsdWUgfHwgbnVtWzBdO1xyXG4gICAgICAgIGNvdW50ID0gY291bnQgfHwgMDtcclxuXHJcbiAgICAgICAgbGV0IHBvcyA9IC0xO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChudW1baV0gPT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjb3VudCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zID0gaTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvdW50LS07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBpZiAocG9zICE9IC0xKSBwb3MgPSAxMCAqKiAobnVtLmxlbmd0aCAtIHBvcyAtIDEpO1xyXG4gICAgICAgIHJldHVybiBwb3M7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5yb3VuZCA9IChwYXJhbXMpID0+IHtcclxuICAgICAgICBwYXJhbXMuZGlyID0gcGFyYW1zLmRpciB8fCAncm91bmQnO1xyXG4gICAgICAgIHBhcmFtcy50byA9IHBhcmFtcy50byB8fCAxO1xyXG5cclxuICAgICAgICBsZXQgdmFsdWUgPSBNYXRoW3BhcmFtcy5kaXJdKHBhcmFtcy5udW0gLyBwYXJhbXMudG8pICogcGFyYW1zLnRvO1xyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnZhcmlhbmNlID0gKGRhdGEpID0+IHtcclxuICAgICAgICBsZXQgbWVhbiA9IHRoaXMubWVhbihkYXRhKTtcclxuICAgICAgICBsZXQgdmFyaWFuY2UgPSAwO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXJpYW5jZSArPSAoZGF0YVtpXSAtIG1lYW4pICoqIDI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2YXJpYW5jZSAvIGRhdGEubGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc3RhbmRhcmREZXZpYXRpb24gPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgIGxldCB2YXJpYW5jZSA9IHRoaXMudmFyaWFuY2UoZGF0YSk7XHJcbiAgICAgICAgbGV0IHN0ZCA9IE1hdGguc3FydCh2YXJpYW5jZSk7XHJcbiAgICAgICAgcmV0dXJuIHN0ZDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnJhbmdlID0gKGRhdGEpID0+IHtcclxuICAgICAgICBsZXQgbWluID0gTWF0aC5taW4oLi4uZGF0YSk7XHJcbiAgICAgICAgbGV0IG1heCA9IE1hdGgubWF4KC4uLmRhdGEpO1xyXG5cclxuICAgICAgICBsZXQgcmFuZ2UgPSBtYXggLSBtaW47XHJcbiAgICAgICAgcmV0dXJuIHJhbmdlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubWVhbiA9IChkYXRhKSA9PiB7XHJcbiAgICAgICAgbGV0IHN1bSA9IHRoaXMuc3VtKGRhdGEpO1xyXG5cclxuICAgICAgICBsZXQgbWVhbiA9IHN1bSAvIGRhdGEubGVuZ3RoO1xyXG4gICAgICAgIHJldHVybiBtZWFuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubWVkaWFuID0gKGRhdGEpID0+IHtcclxuICAgICAgICBsZXQgbGVuZ3RoID0gZGF0YS5sZW5ndGg7XHJcbiAgICAgICAgbGV0IG1lZGlhbjtcclxuICAgICAgICBpZiAobGVuZ3RoICUgMiA9PSAwKSB7XHJcbiAgICAgICAgICAgIG1lZGlhbiA9IChkYXRhWyhsZW5ndGggLyAyKSAtIDFdICsgZGF0YVtsZW5ndGggLyAyXSkgLyAyO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG1lZGlhbiA9IGRhdGFbTWF0aC5mbG9vcihsZW5ndGggLyAyKV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbWVkaWFuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubW9kZSA9IChkYXRhKSA9PiB7XHJcbiAgICAgICAgbGV0IHJlY29yZCA9IHt9O1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAocmVjb3JkW2RhdGFbaV1dICE9IHVuZGVmaW5lZCkgcmVjb3JkW2RhdGFbaV1dKys7XHJcbiAgICAgICAgICAgIGVsc2UgcmVjb3JkW2RhdGFbaV1dID0gaTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBtYXggPSBNYXRoLm1heCguLi5PYmplY3QudmFsdWUocmVjb3JkKSk7XHJcbiAgICAgICAgbGV0IG1vZGU7XHJcbiAgICAgICAgZm9yIChsZXQgaSBpbiByZWNvcmQpIHtcclxuICAgICAgICAgICAgaWYgKHJlY29yZFtpXSA9PSBtYXgpIHtcclxuICAgICAgICAgICAgICAgIG1vZGUgPSBpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBtb2RlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubm9ybWFsaXplRGF0YSA9IChkYXRhKSA9PiB7XHJcbiAgICAgICAgZGF0YS5zb3J0KChhLCBiKSA9PiB7IHJldHVybiBhIC0gYiB9KTtcclxuICAgICAgICB2YXIgbWF4ID0gZGF0YVtkYXRhLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgIHZhciBtaW4gPSBkYXRhWzBdO1xyXG4gICAgICAgIHZhciBub3JtYWxpemVkID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIG5vcm1hbGl6ZWQucHVzaCgoZGF0YVtpXSAtIG1pbikgLyAobWF4IC0gbWluKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBub3JtYWxpemVkO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubWluaW11aW1Td2FwcyA9IChhcnIsIG9yZGVyKSA9PiB7XHJcbiAgICAgICAgdmFyIHN3YXAgPSAwO1xyXG4gICAgICAgIHZhciBjaGVja2VkID0gW107XHJcbiAgICAgICAgdmFyIGNvdW50ZXIgPSAwO1xyXG4gICAgICAgIHZhciBmaW5hbCA9IFsuLi5hcnJdLnNvcnQoKGEsIGIpID0+IHsgcmV0dXJuIGEgLSBiIH0pO1xyXG4gICAgICAgIGlmIChvcmRlciA9PSAtMSkgZmluYWwgPSBmaW5hbC5yZXZlcnNlKCk7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gYXJyW2ldO1xyXG4gICAgICAgICAgICBpZiAoaSA9PSBlbGVtZW50IHx8IGNoZWNrZWRbaV0pIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgICAgY291bnRlciA9IDA7XHJcblxyXG4gICAgICAgICAgICBpZiAoYXJyWzBdID09IDApIGVsZW1lbnQgPSBpO1xyXG5cclxuICAgICAgICAgICAgd2hpbGUgKCFjaGVja2VkW2ldKSB7XHJcbiAgICAgICAgICAgICAgICBjaGVja2VkW2ldID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGkgPSBmaW5hbC5pbmRleE9mKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudCA9IGFycltpXTtcclxuICAgICAgICAgICAgICAgIGNvdW50ZXIrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoY291bnRlciAhPSAwKSB7XHJcbiAgICAgICAgICAgICAgICBzd2FwICs9IGNvdW50ZXIgLSAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzd2FwO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucHJpbWVGYWN0b3JpemUgPSAobnVtYmVyKSA9PiB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBudW1iZXIgIT0gXCJudW1iZXJcIikgcmV0dXJuIFtdO1xyXG4gICAgICAgIG51bWJlciA9IE1hdGguYWJzKHBhcnNlSW50KG51bWJlcikpO1xyXG4gICAgICAgIGlmIChudW1iZXIgPT0gMSB8fCBudW1iZXIgPT0gMCkgcmV0dXJuIFtdLy8xIGFuZCAwIGhhcyBubyBwcmltZXNcclxuICAgICAgICB2YXIgZGl2aWRlciA9IDI7XHJcbiAgICAgICAgdmFyIGRpdmlkZW5kO1xyXG4gICAgICAgIHZhciBmYWN0b3JzID0gW107XHJcbiAgICAgICAgd2hpbGUgKG51bWJlciAhPSAxKSB7XHJcbiAgICAgICAgICAgIGRpdmlkZW5kID0gbnVtYmVyIC8gZGl2aWRlcjtcclxuICAgICAgICAgICAgaWYgKGRpdmlkZW5kLnRvU3RyaW5nKCkuaW5kZXhPZignLicpICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBkaXZpZGVyKytcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG51bWJlciA9IGRpdmlkZW5kO1xyXG4gICAgICAgICAgICBmYWN0b3JzLnB1c2goZGl2aWRlcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWN0b3JzO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubGNmID0gKG51bWJlcnMpID0+IHtcclxuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkobnVtYmVycykpIHJldHVybiBbXTtcclxuICAgICAgICB2YXIgZmFjdG9ycyA9IFtdO1xyXG4gICAgICAgIHZhciBjb21tb25GYWN0b3JzID0gW107XHJcbiAgICAgICAgdmFyIHZhbHVlID0gMTtcclxuICAgICAgICBmb3IgKHZhciBudW1iZXIgb2YgbnVtYmVycykge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIG51bWJlciAhPSBcIm51bWJlclwiKSByZXR1cm4gW107XHJcbiAgICAgICAgICAgIGZhY3RvcnMucHVzaCh0aGlzLnByaW1lRmFjdG9yaXplKG51bWJlcikpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBtYWluOlxyXG4gICAgICAgIGZvciAodmFyIGZhY3RvciBvZiBmYWN0b3JzWzBdKSB7XHJcbiAgICAgICAgICAgIGlmIChjb21tb25GYWN0b3JzLmluZGV4T2YoZmFjdG9yKSA9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBvZiBmYWN0b3JzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGkuaW5kZXhPZihmYWN0b3IpID09IC0xKSBjb250aW51ZSBtYWluO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29tbW9uRmFjdG9ycy5wdXNoKGZhY3Rvcik7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSAqPSBmYWN0b3I7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc3RyaXBJbnRlZ2VyID0gKG51bWJlcikgPT4ge1xyXG4gICAgICAgIG51bWJlciA9IG51bWJlci50b1N0cmluZygpO1xyXG4gICAgICAgIG51bWJlciA9IChudW1iZXIuaW5kZXhPZignLicpID09IC0xKSA/IG51bWJlciA6IG51bWJlci5zbGljZSgwLCBudW1iZXIuaW5kZXhPZignLicpKTtcclxuICAgICAgICByZXR1cm4gbnVtYmVyO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc3RyaXBGcmFjdGlvbiA9IChudW1iZXIpID0+IHtcclxuICAgICAgICBudW1iZXIgPSBudW1iZXIudG9TdHJpbmcoKTtcclxuICAgICAgICBudW1iZXIgPSAobnVtYmVyLmluZGV4T2YoJy4nKSA9PSAtMSkgPyAnMCcgOiBudW1iZXIuc2xpY2UobnVtYmVyLmluZGV4T2YoJy4nKSArIDEpO1xyXG4gICAgICAgIHJldHVybiBudW1iZXI7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jaGFuZ2VCYXNlID0gKG51bWJlciwgZnJvbSwgdG8pID0+IHtcclxuICAgICAgICByZXR1cm4gcGFyc2VGbG9hdChudW1iZXIsIGZyb20pLnRvU3RyaW5nKHRvKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm1heCA9IChhcnJheSkgPT4ge1xyXG4gICAgICAgIHZhciBtYXggPSBhcnJheVswXTtcclxuICAgICAgICBhcnJheUxpYnJhcnkuZWFjaChhcnJheSwgdmFsdWUgPT4ge1xyXG4gICAgICAgICAgICBpZiAobWF4IDwgdmFsdWUpIG1heCA9IHZhbHVlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBtYXg7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5taW4gPSAoYXJyYXkpID0+IHtcclxuICAgICAgICB2YXIgbWF4ID0gYXJyYXlbMF07XHJcbiAgICAgICAgYXJyYXlMaWJyYXJ5LmVhY2goYXJyYXksIHZhbHVlID0+IHtcclxuICAgICAgICAgICAgaWYgKG1heCA+IHZhbHVlKSBtYXggPSB2YWx1ZTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gbWF4O1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc3VtID0gKGFycmF5KSA9PiB7XHJcbiAgICAgICAgLy9mb3IgZmluZGluZyB0aGUgc3VtIG9mIG9uZSBsYXllciBhcnJheVxyXG4gICAgICAgIGxldCBzdW0gPSAwO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGlzTmFOKE1hdGguZmxvb3IoYXJyYXlbaV0pKSkge1xyXG4gICAgICAgICAgICAgICAgc3VtID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzdW0gKz0gYXJyYXlbaV0gLyAxO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHN1bTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnByb2R1Y3QgPSAoYXJyYXkpID0+IHtcclxuICAgICAgICAvL2ZvciBmaW5kaW5nIHRoZSBzdW0gb2Ygb25lIGxheWVyIGFycmF5XHJcbiAgICAgICAgbGV0IHByb2R1Y3QgPSAxO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGlzTmFOKE1hdGguZmxvb3IoYXJyYXlbaV0pKSkge1xyXG4gICAgICAgICAgICAgICAgcHJvZHVjdCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcHJvZHVjdCAqPSBhcnJheVtpXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBwcm9kdWN0O1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuYWRkID0gKC4uLmFycmF5cykgPT4ge1xyXG4gICAgICAgIGxldCBuZXdBcnJheSA9IFtdO1xyXG4gICAgICAgIGFycmF5c1swXS5mb3JFYWNoKCh2YWx1ZSwgcG9zaXRpb24pID0+IHtcclxuICAgICAgICAgICAgYXJyYXlzLmZvckVhY2goKGFycmF5LCBsb2NhdGlvbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGxvY2F0aW9uICE9IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZWxlbWVudCA9IEFycmF5LmlzQXJyYXkoYXJyYXkpID8gYXJyYXlbcG9zaXRpb25dIDogYXJyYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgKz0gaXNOYU4oZWxlbWVudCkgPT0gdHJ1ZSA/IDAgOiBlbGVtZW50O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBuZXdBcnJheS5wdXNoKHZhbHVlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gbmV3QXJyYXk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zdWIgPSAoLi4uYXJyYXlzKSA9PiB7XHJcbiAgICAgICAgbGV0IG5ld0FycmF5ID0gW107XHJcbiAgICAgICAgYXJyYXlzWzBdLmZvckVhY2goKHZhbHVlLCBwb3NpdGlvbikgPT4ge1xyXG4gICAgICAgICAgICBhcnJheXMuZm9yRWFjaCgoYXJyYXksIGxvY2F0aW9uKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAobG9jYXRpb24gIT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBlbGVtZW50ID0gQXJyYXkuaXNBcnJheShhcnJheSkgPyBhcnJheVtwb3NpdGlvbl0gOiBhcnJheTtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSAtPSBpc05hTihlbGVtZW50KSA9PSB0cnVlID8gMCA6IGVsZW1lbnQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIG5ld0FycmF5LnB1c2godmFsdWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBuZXdBcnJheTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm11bCA9ICguLi5hcnJheXMpID0+IHtcclxuICAgICAgICBsZXQgbmV3QXJyYXkgPSBbXTtcclxuICAgICAgICBhcnJheXNbMF0uZm9yRWFjaCgodmFsdWUsIHBvc2l0aW9uKSA9PiB7XHJcbiAgICAgICAgICAgIGFycmF5cy5mb3JFYWNoKChhcnJheSwgbG9jYXRpb24pID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChsb2NhdGlvbiAhPSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSBBcnJheS5pc0FycmF5KGFycmF5KSA/IGFycmF5W3Bvc2l0aW9uXSA6IGFycmF5O1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlICo9IGlzTmFOKGVsZW1lbnQpID09IHRydWUgPyAwIDogZWxlbWVudDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgbmV3QXJyYXkucHVzaCh2YWx1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIG5ld0FycmF5O1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZGl2aWRlID0gKC4uLmFycmF5cykgPT4ge1xyXG4gICAgICAgIGxldCBuZXdBcnJheSA9IFtdO1xyXG4gICAgICAgIGFycmF5c1swXS5mb3JFYWNoKCh2YWx1ZSwgcG9zaXRpb24pID0+IHtcclxuICAgICAgICAgICAgYXJyYXlzLmZvckVhY2goKGFycmF5LCBsb2NhdGlvbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGxvY2F0aW9uICE9IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZWxlbWVudCA9IEFycmF5LmlzQXJyYXkoYXJyYXkpID8gYXJyYXlbcG9zaXRpb25dIDogYXJyYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgLz0gaXNOYU4oZWxlbWVudCkgPT0gdHJ1ZSA/IDAgOiBlbGVtZW50O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBuZXdBcnJheS5wdXNoKHZhbHVlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gbmV3QXJyYXk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5hYnMgPSAoYXJyYXkpID0+IHtcclxuICAgICAgICByZXR1cm4gYXJyYXlMaWJyYXJ5LmVhY2goYXJyYXksIHZhbHVlID0+IHtcclxuICAgICAgICAgICAgdmFsdWUgPSBpc05hTih2YWx1ZSkgPT0gdHJ1ZSA/IDAgOiB2YWx1ZTtcclxuICAgICAgICAgICAgcmV0dXJuIE1hdGguYWJzKHZhbHVlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNYXRoc0xpYnJhcnk7IiwiY29uc3QgQXJyYXlMaWJyYXJ5ID0gcmVxdWlyZSgnLi9BcnJheUxpYnJhcnknKTtcclxubGV0IGFycmF5TGlicmFyeSA9IG5ldyBBcnJheUxpYnJhcnkoKTtcclxuXHJcbmZ1bmN0aW9uIE9iamVjdHNMaWJyYXJ5KCkge1xyXG5cclxuICAgIHRoaXMuZXh0cmFjdEZyb21Kc29uQXJyYXkgPSAobWV0YSwgc291cmNlKSA9PiB7Ly9leHRyYWN0IGEgYmx1ZXByaW50IG9mIGRhdGEgZnJvbSBhIEpzb25BcnJheVxyXG4gICAgICAgIGxldCBrZXlzID0gT2JqZWN0LmtleXMobWV0YSk7Ly9nZXQgdGhlIGtleXNcclxuICAgICAgICBsZXQgdmFsdWVzID0gT2JqZWN0LnZhbHVlcyhtZXRhKTsvL2dldCB0aGUgdmFsdWVzXHJcblxyXG4gICAgICAgIGxldCBlU291cmNlID0gW107XHJcbiAgICAgICAgaWYgKHNvdXJjZSAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgb2JqIG9mIHNvdXJjZSkgey8vZWFjaCBpdGVtIGluIHNvdXJjZVxyXG4gICAgICAgICAgICAgICAgbGV0IG9iamVjdCA9IHt9O1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSBpbiBrZXlzKSB7Ly9lYWNoIGJsdWVwcmludCBrZXlcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYXJyYXlMaWJyYXJ5LmNvbnRhaW5zKE9iamVjdC5rZXlzKG9iaiksIHZhbHVlc1tpXSkpIHsvL3NvdXJjZSBpdGVtIGhhcyBibHVlcHJpbnQgdmFsdWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0W2tleXNbaV1dID0gb2JqW3ZhbHVlc1tpXV07Ly9zdG9yZSBhY2NvcmRpbmcgdG8gYmx1ZXByaW50XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZVNvdXJjZS5wdXNoKG9iamVjdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGVTb3VyY2U7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5maW5kID0gKG9iaiwgY2FsbGJhY2spID0+IHsvL2hpZ2hlciBvcmRlciBPYmplY3QgZnVuY3Rpb24gZm9yIHRoZSBmaXJzdCBpdGVtIGluIGFuIE9iamVjdCB0aGF0IG1hdGNoXHJcbiAgICAgICAgZm9yIChsZXQgaSBpbiBvYmopIHtcclxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKG9ialtpXSkgPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9ialtpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmZpbmRBbGwgPSAob2JqLCBjYWxsYmFjaykgPT4gey8vaGlnaGVyIG9yZGVyIE9iamVjdCBmdW5jdGlvbiBmb3IgYWxsIGl0ZW1zIGluIGFuIE9iamVjdCB0aGF0IG1hdGNoXHJcbiAgICAgICAgbGV0IHZhbHVlcyA9IHt9O1xyXG4gICAgICAgIGZvciAobGV0IGkgaW4gb2JqKSB7XHJcbiAgICAgICAgICAgIGlmIChjYWxsYmFjayhvYmpbaV0pID09IHRydWUpXHJcbiAgICAgICAgICAgICAgICB2YWx1ZXNbaV0gPSBvYmpbaV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdmFsdWVzO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubWFrZUl0ZXJhYmxlID0gKG9iaikgPT4gey8vbWFrZSBhbiBvYmplY3QgdG8gdXNlICdmb3IgaW4nXHJcbiAgICAgICAgb2JqW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgICAgICBsZXQgcHJvcGVydGllcyA9IE9iamVjdC5rZXlzKG9iaik7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHAgb2YgcHJvcGVydGllcykge1xyXG4gICAgICAgICAgICAgICAgeWllbGQgdGhpc1twXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubWF4ID0gKG9iamVjdCkgPT4ge1xyXG4gICAgICAgIG9iamVjdCA9IHRoaXMuc29ydChvYmplY3QsIHsgdmFsdWU6IHRydWUgfSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5kZXgob2JqZWN0KTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm1pbiA9IChvYmplY3QpID0+IHsvL2dldCB0aGUgbWluaW51bSBpbiBpdGVtIGluIGFuIE9iamVjdFxyXG4gICAgICAgIG9iamVjdCA9IHRoaXMuc29ydChvYmplY3QsIHsgdmFsdWU6IGZhbHNlIH0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldEluZGV4KG9iamVjdCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5vbkNoYW5nZWQgPSAob2JqLCBjYWxsYmFjaykgPT4gey8vbWFrZSBhbiBvYmplY3QgbGlzdGVuIHRvIGNoYW5nZXMgb2YgaXQncyBpdGVtc1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSB7XHJcbiAgICAgICAgICAgIGdldCh0YXJnZXQsIHByb3BlcnR5LCByZWNlaXZlcikgey8vd2hlbiBhbiBJdGVtIGlzIGZldGNoZWRcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm94eSh0YXJnZXRbcHJvcGVydHldLCBoYW5kbGVyKTtcclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBSZWZsZWN0LmdldCh0YXJnZXQsIHByb3BlcnR5LCByZWNlaXZlcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGRlZmluZVByb3BlcnR5KHRhcmdldCwgcHJvcGVydHksIGRlc2NyaXB0b3IpIHsvL3doZW4gYW4gSXRlbSBpcyBhZGRlZFxyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2sodGFyZ2V0LCBwcm9wZXJ0eSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gUmVmbGVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIHByb3BlcnR5LCBkZXNjcmlwdG9yKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBwcm9wZXJ0eSkgey8vd2hlbiBhbiBJdGVtIGlzIHJlbW92ZWRcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKHRhcmdldCwgcHJvcGVydHkpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFJlZmxlY3QuZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBwcm9wZXJ0eSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFByb3h5KG9iaiwgaGFuZGxlcik7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy50b0FycmF5ID0gKG9iamVjdCwgbmFtZWQpID0+IHsvL3R1cm4gYW4gT2JqZWN0IGludG8gYW4gQXJyYXlcclxuICAgICAgICB2YXIgYXJyYXkgPSBbXTtcclxuICAgICAgICBPYmplY3Qua2V5cyhvYmplY3QpLm1hcCgoa2V5KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChuYW1lZCA9PSB0cnVlKSB7Ly9tYWtlIGl0IG5hbWVkXHJcbiAgICAgICAgICAgICAgICBhcnJheVtrZXldID0gb2JqZWN0W2tleV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhcnJheS5wdXNoKG9iamVjdFtrZXldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBhcnJheTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnZhbHVlT2ZPYmplY3RBcnJheSA9IChhcnJheSwgbmFtZSkgPT4gey8vZ2V0IGFsbCB0aGUga2V5cyBpbiBhIEpzb25BcnJheSBvZiBpdGVtIG5hbWVcclxuICAgICAgICB2YXIgbmV3QXJyYXkgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpIGluIGFycmF5KSB7XHJcbiAgICAgICAgICAgIG5ld0FycmF5LnB1c2goYXJyYXlbaV1bbmFtZV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3QXJyYXk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5rZXlzT2ZPYmplY3RBcnJheSA9IChhcnJheSA9IFtdKSA9PiB7Ly9nZXQgYWxsIHRoZSBrZXlzIGluIGEgSnNvbkFycmF5XHJcbiAgICAgICAgdmFyIG5ld0FycmF5ID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaSBpbiBhcnJheSkge1xyXG4gICAgICAgICAgICBuZXdBcnJheSA9IG5ld0FycmF5LmNvbmNhdChPYmplY3Qua2V5cyhhcnJheVtpXSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYXJyYXlMaWJyYXJ5LnRvU2V0KG5ld0FycmF5KTsvL3JlbW92ZSBkdXBsaWNhdGVzXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5vYmplY3RPZk9iamVjdEFycmF5ID0gKGFycmF5ID0gW10sIGlkLCBuYW1lKSA9PiB7Ly9zdHJpcCBba2V5IHZhbHVlXSBmcm9tIGEgSnNvbkFycmF5XHJcbiAgICAgICAgdmFyIG9iamVjdCA9IHt9O1xyXG4gICAgICAgIGZvciAobGV0IGkgaW4gYXJyYXkpIHtcclxuICAgICAgICAgICAgb2JqZWN0W2FycmF5W2ldW2lkXV0gPSBhcnJheVtpXVtuYW1lXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG9iamVjdDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmNvcHkgPSAoZnJvbSwgdG8pID0+IHsvL2Nsb25lIGFuIE9iamVjdFxyXG4gICAgICAgIE9iamVjdC5rZXlzKGZyb20pLm1hcChrZXkgPT4ge1xyXG4gICAgICAgICAgICB0b1trZXldID0gZnJvbVtrZXldO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZm9yRWFjaCA9IChvYmplY3QsIGNhbGxiYWNrKSA9PiB7Ly9oaWdoZXIgb3JkZXIgZnVuY3Rpb24gZm9yIE9iamVjdCBsaXRlcmFsXHJcbiAgICAgICAgZm9yIChsZXQga2V5IGluIG9iamVjdCkge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhvYmplY3Rba2V5XSwga2V5KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5lYWNoID0gZnVuY3Rpb24gKG9iamVjdCwgY2FsbGJhY2spIHsvL2hpZ2hlciBvcmRlciBmdW5jdGlvbiBmb3IgT2JqZWN0IGxpdGVyYWxcclxuICAgICAgICBsZXQgbmV3T2JqZWN0ID0ge307XHJcbiAgICAgICAgZm9yIChsZXQga2V5IGluIG9iamVjdCkge1xyXG4gICAgICAgICAgICBuZXdPYmplY3Rba2V5XSA9IGNhbGxiYWNrKG9iamVjdFtrZXldLCBrZXkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3T2JqZWN0O1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaXNTdWJPYmplY3QgPSAoZGF0YSwgc2FtcGxlKSA9PiB7Ly9jaGVjayBpZiBhbiBvYmplY3QgaXMgYSBzdWItT2JqZWN0IG9mIGFub3RoZXIgT2JqZWN0XHJcbiAgICAgICAgbGV0IGZsYWc7XHJcbiAgICAgICAgZm9yIChsZXQgbmFtZSBpbiBzYW1wbGUpIHtcclxuICAgICAgICAgICAgZmxhZyA9IEpTT04uc3RyaW5naWZ5KHNhbXBsZVtuYW1lXSkgPT0gSlNPTi5zdHJpbmdpZnkoZGF0YVtuYW1lXSk7Ly9jb252ZXJ0IHRvIHN0cmluZyBhbmQgY29tcGFyZVxyXG4gICAgICAgICAgICBpZiAoIWZsYWcpIGJyZWFrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZsYWc7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5nZXRTdWJPYmplY3QgPSAoZGF0YSA9IFtdLCBzYW1wbGUgPSB7fSkgPT4gey8vZ2V0IG1hdGNoZWQgaXRlbXMgaW4gT2JqZWN0XHJcbiAgICAgICAgbGV0IG1hdGNoZWQgPSBbXSwgZmxhZyA9IHRydWU7XHJcbiAgICAgICAgZm9yIChsZXQgaSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgIGZsYWcgPSB0aGlzLmlzU3ViT2JqZWN0KGRhdGFbaV0sIHNhbXBsZSk7Ly9jaGVjayBlYWNoIG9iamVjdFxyXG4gICAgICAgICAgICBpZiAoIWZsYWcpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBtYXRjaGVkLnB1c2goZGF0YVtpXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbWF0Y2hlZFxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc29ydCA9IChkYXRhID0ge30sIHBhcmFtcyA9IHsgaXRlbXM6IFtdLCBkZXNjZW5kOiBmYWxzZSwga2V5OiBmYWxzZSwgdmFsdWU6IGZhbHNlIH0pID0+IHsvL3NvcnQgYW4gT2JqZWN0IGJhc2VkIG9uW2tleSwgdmFsdWUgb3IgaXRlbXNdXHJcbiAgICAgICAgcGFyYW1zLml0ZW0gPSBwYXJhbXMuaXRlbSB8fCAnJztcclxuICAgICAgICBwYXJhbXMuZGVzY2VuZCA9IHBhcmFtcy5kZXNjZW5kIHx8IGZhbHNlO1xyXG5cclxuICAgICAgICBsZXQgc29ydGVkID0gW10sIG5EYXRhID0ge307XHJcbiAgICAgICAgZm9yIChsZXQgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGRhdGEpKSB7XHJcbiAgICAgICAgICAgIHNvcnRlZC5wdXNoKHsga2V5LCB2YWx1ZSB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChwYXJhbXMua2V5ICE9IHVuZGVmaW5lZCkgey8vc29ydCB3aXRoIGtleVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnSGVsbG8nKTtcclxuICAgICAgICAgICAgc29ydGVkLnNvcnQoKGEsIGIpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IChhLmtleSA+PSBiLmtleSk7XHJcbiAgICAgICAgICAgICAgICBpZiAocGFyYW1zLmtleSA9PSB0cnVlKSB2YWx1ZSA9ICF2YWx1ZTsvL2Rlc2NlbmRcclxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocGFyYW1zLnZhbHVlICE9IHVuZGVmaW5lZCkgey8vc29ydCB3aXRoIHZhbHVlXHJcbiAgICAgICAgICAgIHNvcnRlZC5zb3J0KChhLCBiKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSAoYS52YWx1ZSA+PSBiLnZhbHVlKTtcclxuICAgICAgICAgICAgICAgIGlmIChwYXJhbXMudmFsdWUgPT0gdHJ1ZSkgdmFsdWUgPSAhdmFsdWU7Ly9kZXNjZW5kXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBhcmFtcy5pdGVtcyAhPSB1bmRlZmluZWQpIHsvL3NvcnQgd2l0aCBpdGVtc1xyXG4gICAgICAgICAgICBzb3J0ZWQuc29ydCgoYSwgYikgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGdyZWF0ZXIgPSAwLCBsZXNzZXIgPSAwO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaXRlbSBvZiBwYXJhbXMuaXRlbXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYS52YWx1ZVtpdGVtXSA+PSBiLnZhbHVlW2l0ZW1dKSBncmVhdGVyKytcclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGxlc3NlcisrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gZ3JlYXRlciA+PSBsZXNzZXI7XHJcbiAgICAgICAgICAgICAgICBpZiAocGFyYW1zLmRlc2NlbmQgPT0gdHJ1ZSkgdmFsdWUgPSAhdmFsdWU7Ly9kZXNjZW5kIGl0ZW1zXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgeyBrZXksIHZhbHVlIH0gb2Ygc29ydGVkKSB7XHJcbiAgICAgICAgICAgIG5EYXRhW2tleV0gPSB2YWx1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBuRGF0YTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnJldmVyc2UgPSAoZGF0YSA9IHt9KSA9PiB7Ly9yZXZlcnNlIGFuIE9iamVjdFxyXG4gICAgICAgIGxldCBrZXlzID0gT2JqZWN0LmtleXMoZGF0YSkucmV2ZXJzZSgpO1xyXG4gICAgICAgIGxldCBuZXdPYmplY3QgPSB7fTtcclxuICAgICAgICBmb3IgKGxldCBpIG9mIGtleXMpIHtcclxuICAgICAgICAgICAgbmV3T2JqZWN0W2ldID0gZGF0YVtpXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ld09iamVjdDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmdldEluZGV4ID0gKGRhdGEgPSB7fSkgPT4gey8vZ2V0IHRoZSBmaXJzdCBpdGVtIGluIHRoZSBPYmplY3RcclxuICAgICAgICBsZXQga2V5ID0gT2JqZWN0LmtleXMoZGF0YSkuc2hpZnQoKTtcclxuICAgICAgICBsZXQgdmFsdWUgPSBkYXRhW2tleV07XHJcbiAgICAgICAgcmV0dXJuIHsga2V5LCB2YWx1ZSB9O1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZ2V0TGFzdCA9IChkYXRhID0ge30pID0+IHsvL2dldCB0aGUgbGFzdCBpdGVtIGluIHRoZSBPYmplY3RcclxuICAgICAgICBsZXQga2V5ID0gT2JqZWN0LmtleXMoZGF0YSkucG9wKCk7XHJcbiAgICAgICAgbGV0IHZhbHVlID0gZGF0YVtrZXldO1xyXG4gICAgICAgIHJldHVybiB7IGtleSwgdmFsdWUgfTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmdldEF0ID0gKGRhdGEgPSB7fSwgaW5kZXgpID0+IHsvL2dldCB0aGUgaXRlbSBvZiBpbmRleCBpbiB0aGUgT2JqZWN0XHJcbiAgICAgICAgbGV0IGtleSA9IE9iamVjdC5rZXlzKGRhdGEpW2luZGV4XTtcclxuICAgICAgICBsZXQgdmFsdWUgPSBkYXRhW2tleV07XHJcbiAgICAgICAgcmV0dXJuIHsga2V5LCB2YWx1ZSB9O1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMua2V5T2YgPSAoZGF0YSA9IHt9LCBpdGVtKSA9PiB7Ly9nZXQgdGhlIGZpcnN0IG9jY3VycmFuY2Ugb2YgYW4gaXRlbSBpbiBhbiBPYmplY3RcclxuICAgICAgICBsZXQgaW5kZXggPSAtMTtcclxuICAgICAgICBmb3IgKGxldCBpIGluIGRhdGEpIHtcclxuICAgICAgICAgICAgaWYgKEpTT04uc3RyaW5naWZ5KGRhdGFbaV0pID09IEpTT04uc3RyaW5naWZ5KGl0ZW0pKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGluZGV4O1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubGFzdEtleU9mID0gKGRhdGEgPSB7fSwgaXRlbSkgPT4gey8vZ2V0IHRoZSBsYXN0IG9jY3VycmFuY2Ugb2YgYW4gaXRlbSBpbiBhbiBvYmplY3RcclxuICAgICAgICBsZXQgaW5kZXggPSAtMTtcclxuICAgICAgICBmb3IgKGxldCBpIGluIGRhdGEpIHtcclxuICAgICAgICAgICAgaWYgKEpTT04uc3RyaW5naWZ5KGRhdGFbaV0pID09IEpTT04uc3RyaW5naWZ5KGl0ZW0pKSB7XHJcbiAgICAgICAgICAgICAgICBpbmRleCA9IGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBpbmRleDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmluY2x1ZGVzID0gKGRhdGEgPSB7fSwgaXRlbSkgPT4gey8vY2hlY2sgaWYgYW4gT2JqZWN0IGhhcyBhbiBpdGVtXHJcbiAgICAgICAgcmV0dXJuIHRoaXMua2V5T2YoZGF0YSwgaXRlbSkgIT0gLTE7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5hZ2dyZWdhdGUgPSAoZGF0YSA9IHt9LCBncm91cHMgPSB7fSkgPT4ge1xyXG4gICAgICAgIGxldCBmdW5jcyA9IHtcclxuICAgICAgICAgICAgJHN1bTogKC4uLmEpID0+IHsgcmV0dXJuIGEucmVkdWNlKChpLCBqKSA9PiBpICsgaikgfSxcclxuICAgICAgICAgICAgJGRpZjogKC4uLmEpID0+IHsgcmV0dXJuIGFbMF0gLSBhWzFdID8gYVsxXSA6IDAgfSxcclxuICAgICAgICAgICAgJG11bDogKC4uLmEpID0+IHsgcmV0dXJuIGEucmVkdWNlKChpLCBqKSA9PiBpICogaikgfSxcclxuICAgICAgICAgICAgJGRpZjogKC4uLmEpID0+IHsgcmV0dXJuIGFbMF0gLSBhWzFdID8gYVsxXSA6IDEgfSxcclxuICAgICAgICAgICAgY2FzdDogKGEsIHRvKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodG8gPT0gJ2ludCcpIGEgPSBwYXJzZUludChhKTtcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRvID09ICdmbG9hdCcpIGEgPSBwYXJzZUZsb2F0KGEpO1xyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodG8gPT0gJ3N0cmluZycpIGEgPSBhLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0byA9PSAnZGF0ZScpIGEgPSBuZXcgRGF0ZShhKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGFnZyA9IE9iamVjdC5hc3NpZ24oe30sIGRhdGEpO1xyXG4gICAgICAgIGxldCB4LCBsaXN0LCBsO1xyXG4gICAgICAgIGZvciAoeCBpbiBncm91cHMpIHtcclxuICAgICAgICAgICAgbGlzdCA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKGwgb2YgZ3JvdXBzW3hdLmxpc3QpIGxpc3QucHVzaChhZ2dbbF0pO1xyXG4gICAgICAgICAgICBhZ2dbeF0gPSBmdW5jc1tncm91cHNbeF0uYWN0aW9uXSguLi5saXN0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBhZ2c7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0c0xpYnJhcnk7IiwiY29uc3QgRnVuYyA9IHJlcXVpcmUoJy4vLi4vY2xhc3Nlcy9GdW5jJyk7XHJcbmxldCBmdW5jID0gbmV3IEZ1bmMoKTtcclxuXHJcbmZ1bmN0aW9uIFNoYWRvdyhlbGVtZW50KSB7XHJcbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50LmNsb25lTm9kZSh0cnVlKTtcclxuICAgIHRoaXMucHJvcGVydGllcyA9IHt9O1xyXG4gICAgdGhpcy5jaGlsZFByb3BlcnRpZXMgPSB7fTtcclxuXHJcbiAgICB0aGlzLnVwZGF0ZU5ld0VsZW1lbnRDaGlsZFByb3BlcnRpZXMgPSBmdW5jdGlvbiAoZWxlbWVudCwgcHJvcGVydHlDb2xsZWN0aW9uID0ge30pIHtcclxuICAgICAgICBsZXQgY2hpbGRyZW4sIHBvc2l0aW9ucztcclxuICAgICAgICBmb3IgKGxldCBpZGVudGlmaWVyIGluIHByb3BlcnR5Q29sbGVjdGlvbikge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBjaGlsZFByb3BlcnRpZXMgb2YgcHJvcGVydHlDb2xsZWN0aW9uW2lkZW50aWZpZXJdKSB7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbnMgPSB0aGlzLnNldFBvc2l0aW9ucyhjaGlsZFByb3BlcnRpZXMucG9zaXRpb25zKTtcclxuICAgICAgICAgICAgICAgIGNoaWxkcmVuID0gdGhpcy5nZXRDaGlsZHJlbihpZGVudGlmaWVyLCBlbGVtZW50LCBwb3NpdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjaGlsZHJlbi5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuW2pdLnNldFByb3BlcnRpZXMoY2hpbGRQcm9wZXJ0aWVzLnByb3BlcnRpZXMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudXBkYXRlTmV3RWxlbWVudENoaWxkQXR0cmlidXRlcyA9IGZ1bmN0aW9uIChlbGVtZW50LCBhdHRyaWJ1dGVDb2xsZWN0aW9uID0ge30pIHtcclxuICAgICAgICBsZXQgY2hpbGRyZW4sIHBvc2l0aW9ucztcclxuICAgICAgICBmb3IgKGxldCBpZGVudGlmaWVyIGluIGF0dHJpYnV0ZUNvbGxlY3Rpb24pIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgY2hpbGRBdHJyaWJ1dGVzIG9mIGF0dHJpYnV0ZUNvbGxlY3Rpb25baWRlbnRpZmllcl0pIHtcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9ucyA9IHRoaXMuc2V0UG9zaXRpb25zKGNoaWxkQXRycmlidXRlcy5wb3NpdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgY2hpbGRyZW4gPSB0aGlzLmdldENoaWxkcmVuKGlkZW50aWZpZXIsIGVsZW1lbnQsIHBvc2l0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNoaWxkcmVuLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW5bal0uc2V0QXR0cmlidXRlcyhjaGlsZEF0cnJpYnV0ZXMuYXR0cmlidXRlcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zZXRQb3NpdGlvbnMgPSBmdW5jdGlvbiAocG9zaXRpb25zID0gMSkge1xyXG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShwb3NpdGlvbnMpKSB7XHJcbiAgICAgICAgICAgIHBvc2l0aW9ucyA9IGZ1bmMucmFuZ2UocG9zaXRpb25zKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBwb3NpdGlvbnM7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jcmVhdGVFbGVtZW50ID0gZnVuY3Rpb24gKHBhcmFtcyA9IHsgY2hpbGREZXRhaWxzOiB7IGF0dHJpYnV0ZXM6IHt9LCBwcm9wZXJ0aWVzOiB7fSB9LCBkZXRhaWxzOiB7IGF0dHJpYnV0ZXM6IHt9LCBwcm9wZXJ0aWVzOiB7fSB9IH0pIHtcclxuICAgICAgICBsZXQgZWxlbWVudCA9IHRoaXMuZWxlbWVudC5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5wdXNoKGVsZW1lbnQpO1xyXG5cclxuICAgICAgICB0aGlzLnByZXBhcmVFbGVtZW50KGVsZW1lbnQsIHBhcmFtcyk7XHJcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5wcmVwYXJlRWxlbWVudCA9IGZ1bmN0aW9uIChlbGVtZW50LCBwYXJhbXMgPSB7IGNoaWxkRGV0YWlsczogeyBhdHRyaWJ1dGVzOiB7fSwgcHJvcGVydGllczoge30gfSwgZGV0YWlsczogeyBhdHRyaWJ1dGVzOiB7fSwgcHJvcGVydGllczoge30gfSB9KSB7XHJcbiAgICAgICAgaWYgKHBhcmFtcy5jaGlsZERldGFpbHMgIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGlmIChwYXJhbXMuY2hpbGREZXRhaWxzLmF0dHJpYnV0ZXMgIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZU5ld0VsZW1lbnRDaGlsZEF0dHJpYnV0ZXMoZWxlbWVudCwgcGFyYW1zLmNoaWxkRGV0YWlscy5hdHRyaWJ1dGVzKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHBhcmFtcy5jaGlsZERldGFpbHMucHJvcGVydGllcyAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlTmV3RWxlbWVudENoaWxkUHJvcGVydGllcyhlbGVtZW50LCBwYXJhbXMuY2hpbGREZXRhaWxzLnByb3BlcnRpZXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocGFyYW1zLmRldGFpbHMgIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGlmIChwYXJhbXMuZGV0YWlscy5hdHRyaWJ1dGVzICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGVzKHBhcmFtcy5kZXRhaWxzLmF0dHJpYnV0ZXMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAocGFyYW1zLmRldGFpbHMucHJvcGVydGllcyAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0UHJvcGVydGllcyhwYXJhbXMuZGV0YWlscy5wcm9wZXJ0aWVzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVOZXdFbGVtZW50Q2hpbGRQcm9wZXJ0aWVzKGVsZW1lbnQsIHRoaXMuY2hpbGRQcm9wZXJ0aWVzKTtcclxuICAgICAgICBlbGVtZW50LnNldFByb3BlcnRpZXModGhpcy5wcm9wZXJ0aWVzKTtcclxuXHJcbiAgICAgICAgdGhpcy5tYWtlQ2xvbmVhYmxlKGVsZW1lbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucmVtb3ZlRWxlbWVudCA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgbGV0IGNoaWxkcmVuID0gW107XHJcbiAgICAgICAgbGV0IHBvc2l0aW9uID0gdGhpcy5jaGlsZHJlbi5pbmRleE9mKGVsZW1lbnQpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChwb3NpdGlvbiAhPSBpKSB7XHJcbiAgICAgICAgICAgICAgICBjaGlsZHJlbi5wdXNoKHRoaXMuY2hpbGRyZW5baV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmNsb25lRWxlbWVudCA9IGZ1bmN0aW9uIChwb3NpdGlvbiwgcGFyYW1zID0geyBjaGlsZERldGFpbHM6IHsgYXR0cmlidXRlczoge30sIHByb3BlcnRpZXM6IHt9IH0sIGRldGFpbHM6IHsgYXR0cmlidXRlczoge30sIHByb3BlcnRpZXM6IHt9IH0gfSkge1xyXG4gICAgICAgIGxldCBlbGVtZW50ID0gdGhpcy5jaGlsZHJlbltwb3NpdGlvbl0uY2xvbmVOb2RlKHRydWUpO1xyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaChlbGVtZW50KTtcclxuXHJcbiAgICAgICAgdGhpcy5wcmVwYXJlRWxlbWVudChlbGVtZW50LCBwYXJhbXMpO1xyXG4gICAgICAgIHJldHVybiBlbGVtZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubWFrZUNsb25lYWJsZSA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgbGV0IHBvc2l0aW9uID0gdGhpcy5jaGlsZHJlbi5pbmRleE9mKGVsZW1lbnQpO1xyXG4gICAgICAgIGlmIChwb3NpdGlvbiA9PSAtMSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBlbGVtZW50LnVuaXRDbG9uZSA9IChwYXJhbXMpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmVFbGVtZW50KHBvc2l0aW9uLCBwYXJhbXMpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubGVuZ3RoID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLmxlbmd0aDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnNldFByb3BlcnRpZXMgPSBmdW5jdGlvbiAocHJvcGVydGllcyA9IHt9KSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5baV0uc2V0UHJvcGVydGllcyhwcm9wZXJ0aWVzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnNldFByb3BlcnRpZXMocHJvcGVydGllcyk7XHJcbiAgICAgICAgZm9yIChsZXQgaSBpbiBwcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgIHRoaXMucHJvcGVydGllc1tpXSA9IHByb3BlcnRpZXNbaV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY3NzID0gZnVuY3Rpb24gKHN0eWxlID0ge30pIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbltpXS5jc3Moc3R5bGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmVsZW1lbnQuY3NzKHN0eWxlKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnNldEF0dHJpYnV0ZXMgPSBmdW5jdGlvbiAoYXR0cmlidXRlcyA9IHt9KSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5baV0uc2V0QXR0cmlidXRlcyhhdHRyaWJ1dGVzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZXMoYXR0cmlidXRlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5hZGRDbGFzc2VzID0gZnVuY3Rpb24gKGNsYXNzZXMgPSAnJykge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuW2ldLmFkZENsYXNzZXMoY2xhc3Nlcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRDbGFzc2VzKGNsYXNzZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucmVtb3ZlQ2xhc3NlcyA9IGZ1bmN0aW9uIChjbGFzc2VzID0gJycpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbltpXS5yZW1vdmVDbGFzc2VzKGNsYXNzZXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlQ2xhc3NlcyhjbGFzc2VzKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmdldENoaWxkcmVuID0gZnVuY3Rpb24gKGlkZW50aWZpZXIgPSAnJywgZWxlbWVudCwgcG9zaXRpb25zID0gW10pIHtcclxuICAgICAgICBsZXQgY29sbGVjdGlvbiA9IFtdO1xyXG4gICAgICAgIGxldCBjaGlsZHJlbiA9IGVsZW1lbnQuZmluZEFsbChpZGVudGlmaWVyKTsvL2dldCB0aGUgY2hpbGRyZW4gbWF0Y2hpbmcgaWRlbnRpZmllciBpbiBlYWNoIGVsZW1lbnRcclxuICAgICAgICBpZiAoY2hpbGRyZW4ubGVuZ3RoID4gMCkgey8vaWYgbm90IGVtcHR5XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgcG9zaXRpb25zLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGRyZW5bcG9zaXRpb25zW2pdXSAhPSB1bmRlZmluZWQpIHsvL2lmIGF2YWlsYWJsZVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24ucHVzaChjaGlsZHJlbltwb3NpdGlvbnNbal1dKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY29sbGVjdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmNoaWxkQ3NzID0gZnVuY3Rpb24gKGlkZW50aWZpZXIgPSAnJywgc3R5bGUgPSB7fSwgcG9zaXRpb25zID0gW10pIHtcclxuICAgICAgICBwb3NpdGlvbnMgPSB0aGlzLnNldFBvc2l0aW9ucyhwb3NpdGlvbnMpO1xyXG5cclxuICAgICAgICBsZXQgY2hpbGRyZW47XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNoaWxkcmVuID0gdGhpcy5nZXRDaGlsZHJlbihpZGVudGlmaWVyLCB0aGlzLmNoaWxkcmVuW2ldLCBwb3NpdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjaGlsZHJlbi5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgY2hpbGRyZW5bal0uY3NzKHN0eWxlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2hpbGRyZW4gPSB0aGlzLmdldENoaWxkcmVuKGlkZW50aWZpZXIsIHRoaXMuZWxlbWVudCwgcG9zaXRpb25zKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjaGlsZHJlbi5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBjaGlsZHJlbltqXS5jc3Moc3R5bGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnNldENoaWxkUHJvcGVydGllcyA9IGZ1bmN0aW9uIChpZGVudGlmaWVyID0gJycsIHByb3BlcnRpZXMgPSB7fSwgcG9zaXRpb25zID0gW10pIHtcclxuICAgICAgICBwb3NpdGlvbnMgPSB0aGlzLnNldFBvc2l0aW9ucyhwb3NpdGlvbnMpO1xyXG5cclxuICAgICAgICBsZXQgY2hpbGRyZW47XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNoaWxkcmVuID0gdGhpcy5nZXRDaGlsZHJlbihpZGVudGlmaWVyLCB0aGlzLmNoaWxkcmVuW2ldLCBwb3NpdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjaGlsZHJlbi5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgY2hpbGRyZW5bal0uc2V0UHJvcGVydGllcyhwcm9wZXJ0aWVzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2hpbGRyZW4gPSB0aGlzLmdldENoaWxkcmVuKGlkZW50aWZpZXIsIHRoaXMuZWxlbWVudCwgcG9zaXRpb25zKTtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNoaWxkcmVuLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgIGNoaWxkcmVuW2pdLnNldFByb3BlcnRpZXMocHJvcGVydGllcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNoaWxkUHJvcGVydGllc1tpZGVudGlmaWVyXSA9IHRoaXMuY2hpbGRQcm9wZXJ0aWVzW2lkZW50aWZpZXJdIHx8IFtdO1xyXG4gICAgICAgIHRoaXMuY2hpbGRQcm9wZXJ0aWVzW2lkZW50aWZpZXJdLnB1c2goeyBwcm9wZXJ0aWVzLCBwb3NpdGlvbnMgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zZXRDaGlsZEF0dHJpYnV0ZXMgPSBmdW5jdGlvbiAoaWRlbnRpZmllciA9ICcnLCBhdHRyaWJ1dGVzID0ge30sIHBvc2l0aW9ucyA9ICcnKSB7XHJcbiAgICAgICAgcG9zaXRpb25zID0gdGhpcy5zZXRQb3NpdGlvbnMocG9zaXRpb25zKTtcclxuXHJcbiAgICAgICAgbGV0IGNoaWxkcmVuO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjaGlsZHJlbiA9IHRoaXMuZ2V0Q2hpbGRyZW4oaWRlbnRpZmllciwgdGhpcy5jaGlsZHJlbltpXSwgcG9zaXRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY2hpbGRyZW4ubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGNoaWxkcmVuW2pdLnNldEF0dHJpYnV0ZXMoYXR0cmlidXRlcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNoaWxkcmVuID0gdGhpcy5nZXRDaGlsZHJlbihpZGVudGlmaWVyLCB0aGlzLmVsZW1lbnQsIHBvc2l0aW9ucyk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY2hpbGRyZW4ubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgY2hpbGRyZW5bal0uc2V0QXR0cmlidXRlcyhhdHRyaWJ1dGVzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5hZGRDbGFzc2VzVG9DaGlsZCA9IGZ1bmN0aW9uIChpZGVudGlmaWVyID0gJycsIGNsYXNzZXMgPSAnJywgcG9zaXRpb25zID0gW10pIHtcclxuICAgICAgICBwb3NpdGlvbnMgPSB0aGlzLnNldFBvc2l0aW9ucyhwb3NpdGlvbnMpO1xyXG5cclxuICAgICAgICBsZXQgY2hpbGRyZW47XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNoaWxkcmVuID0gdGhpcy5nZXRDaGlsZHJlbihpZGVudGlmaWVyLCB0aGlzLmNoaWxkcmVuW2ldLCBwb3NpdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjaGlsZHJlbi5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgY2hpbGRyZW5bal0uYWRkQ2xhc3NlcyhjbGFzc2VzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2hpbGRyZW4gPSB0aGlzLmdldENoaWxkcmVuKGlkZW50aWZpZXIsIHRoaXMuZWxlbWVudCwgcG9zaXRpb25zKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjaGlsZHJlbi5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBjaGlsZHJlbltqXS5hZGRDbGFzc2VzKGNsYXNzZXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnJlbW92ZUNsYXNzZXNGcm9tQ2hpbGQgPSBmdW5jdGlvbiAoaWRlbnRpZmllciA9ICcnLCBjbGFzc2VzID0gJycsIHBvc2l0aW9ucyA9IFtdKSB7XHJcbiAgICAgICAgcG9zaXRpb25zID0gdGhpcy5zZXRQb3NpdGlvbnMocG9zaXRpb25zKTtcclxuXHJcbiAgICAgICAgbGV0IGNoaWxkcmVuO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjaGlsZHJlbiA9IHRoaXMuZ2V0Q2hpbGRyZW4oaWRlbnRpZmllciwgdGhpcy5jaGlsZHJlbltpXSwgcG9zaXRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY2hpbGRyZW4ubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGNoaWxkcmVuW2pdLnJlbW92ZUNsYXNzZXMoY2xhc3Nlcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNoaWxkcmVuID0gdGhpcy5nZXRDaGlsZHJlbihpZGVudGlmaWVyLCB0aGlzLmVsZW1lbnQsIHBvc2l0aW9ucyk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY2hpbGRyZW4ubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgY2hpbGRyZW5bal0ucmVtb3ZlQ2xhc3NlcyhjbGFzc2VzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2hhZG93OyJdfQ==
