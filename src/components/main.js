import { Chart } from "chart.js/auto";
import { Operations } from "./operations/operations.js";
import { Filters } from './filters.js';

export class Main {
    constructor() {
        this.init();
    };

    init() {
        this.filters = new Filters(this.getDataForCharts.bind(this));
        this.newDate = new Date();
        this.currentDate = `${this.newDate.getFullYear()}-${this.newDate.getMonth()+1}-${this.newDate.getDate()}`;
        this.operations = new Operations;
        this.operationsList = this.operations.getOperations('today', this.currentDate, this.currentDate);

        console.log(this.operationsList)

        this.dateFrom = null;
        this.dateTo = null;

        this.colorArray = ["rgb(253 126 20)", "rgb(32 201 151)", "rgb(255 193 7)", "rgb(13 110 253)", "rgb(220 53 69)"];

        this.incomeData = [];
        this.expensesData = [];

        this.incomeLabels = [];
        this.expenseLebels = [];

        this.getDataForCharts();

        this.datePickerFrom = document.getElementById('dateFrom');
        this.datePickerTo = document.getElementById('dateTo');

        this.datePickerFrom.onchange = () => {
            this.className = (this.value !== '' ? 'has-value' : '');
            this.blur();
        }
        this.datePickerTo.onchange = () => {
            this.className = (this.value !== '' ? 'has-value' : '');
            this.blur();
        }

        this.filters.setFiltersBtn('main');

        let currentFilters = document.getElementById('today');
        currentFilters.classList.add('btn-secondary');
        currentFilters.classList.remove('btn-outline-secondary');
    }

    getDataForCharts(period='interval', dateFrom=null, dateTo=null) {
        this.incomeData = [];
        this.expensesData = [];

        this.incomeLabels = [];
        this.expenseLebels = [];

        console.log(period)
        console.log(dateFrom)
        console.log(dateTo)

        this.operationsList = this.operations.getOperations(period, dateFrom, dateTo);

        console.log('Список операций', this.operationsList)

        this.operationsList.then(operation => {

            this.incomeData = operation.filter(item => item.type === 'income').map(item => item.amount);
            this.incomeLabels = operation.filter(item => item.type === 'income').map(item => item.category);
            this.expensesData = operation.filter(item => item.type === 'expense').map(item => item.amount);
            this.expenseLebels = operation.filter(item => item.type === 'expense').map(item => item.category);

            this.showCharts();
            this.createCharts();
        })
    }

    showCharts() {

        const charts = [
            {
                id: 'income',
                title: 'Доходы',
                blockClassList: [
                    'income-block', 'border-end'
                ],
                chartsClassList: 'income-canvas',
                w: '360',
                h: '360'
            },
            {
                id: 'expenses',
                title: 'Расходы',
                blockClassList: [
                    'expenses-block'
                ],
                chartsClassList: '',
                w: '360',
                h: '360'
            }
        ]

        const chartsElements = document.getElementById('charts');
        chartsElements.innerHTML = '';
        charts.forEach(chart => {
            let chartBlock = document.createElement('div');
            chartBlock.classList.add(chart.id);

            let chartTitle = document.createElement('h1');
            chartTitle.classList.add('title');
            chartTitle.classList.add('text-center');
            chartTitle.innerText = chart.title;

            let chartBlockSec = document.createElement('div');
            chart.blockClassList.forEach(item => {
                chartBlockSec.classList.add(item);
            });

            let canvas = document.createElement('canvas');
            canvas.id = chart.id;
            canvas.width = chart.w;
            canvas.height = chart.h;

            chart.chartsClassList === '' ? '' : canvas.classList.add(chart.chartsClassList);

            chartBlockSec.appendChild(canvas);
            chartBlock.appendChild(chartTitle);
            chartBlock.appendChild(chartBlockSec);
            chartsElements.appendChild(chartBlock);
        })
    }

    createCharts() {

        this.setColor(this.incomeData);
        this.setColor(this.expensesData);

        const ctx = document.getElementById('income');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: this.incomeLabels,
                datasets: [{
                    label: 'Рублей',
                    data: this.incomeData,
                    backgroundColor: this.colorArray
                }]
            },
        });
        const ctx1 = document.getElementById('expenses');
        new Chart(ctx1, {
            type: 'pie',
            data: {
                labels: this.expenseLebels,
                datasets: [{
                    label: 'Рублей',
                    data: this.expensesData,
                    backgroundColor: this.colorArray
                }]
            },
        });
    }

    getRandomInt() {
        return Math.floor(Math.random() * 255);
    };

    setColor(category) {
        if (this.colorArray.length < category.length) {
            let count = category.length - this.colorArray.length + 1;

            for (let i = 0; i < count; i++) {
                let color = `rgb(${this.getRandomInt()} ${this.getRandomInt()} ${this.getRandomInt()})`;
                this.colorArray.push(color);
            }
        }
    };

    setFiltersBtn() {
        this.filters.setFiltersBtn();
    }

    // setFiltersBtn() {
    //
    //     let newDate = new Date();
    //     let currentDate = `${newDate.getFullYear()}-${newDate.getMonth()+1}-${newDate.getDate()}`;
    //
    //     let btnList = ['today', 'week', 'month', 'year', 'all', 'interval'];
    //     btnList.forEach(btn => {
    //         let btnItem = document.getElementById(btn);
    //         btnItem.onclick = () => {
    //             btnList.forEach(item => {
    //                 document.getElementById(item).classList.remove('btn-secondary');
    //                 document.getElementById(item).classList.add('btn-outline-secondary');
    //             });
    //
    //             btnItem.classList.remove('btn-outline-secondary');
    //             btnItem.classList.add('btn-secondary');
    //
    //             this.dateTo = null;
    //             this.dateFrom = null;
    //
    //             if (btnItem === 'today') {
    //                 this.dateTo = currentDate;
    //                 this.dateFrom = currentDate;
    //                 this.period = 'interval';
    //             } else if (btnItem === 'interval') {
    //                 this.period = 'interval';
    //                 let intervalBlock = document.getElementById('interval-block');
    //                 let dateFromInput = document.getElementById('dateFrom');
    //                 let dateToInput = document.getElementById('dateTo');
    //
    //                 intervalBlock.classList.remove('d-none');
    //                 intervalBlock.classList.add('d-flex');
    //
    //                 dateFromInput.onchange = () => {
    //                     this.dateFrom = dateFromInput.value;
    //                 }
    //
    //                 dateToInput.onchange = () => {
    //                     this.dateTo = dateToInput.value;
    //                     if (this.dateFrom && this.dateTo) {
    //
    //                         this.operationsList = this.operations.getOperations('interval', this.dateFrom, this.dateTo);
    //
    //                         this.getDataForCharts();
    //                     }
    //                 }
    //             } else if (btnItem.id === 'week') {
    //                 this.period = 'week';
    //             } else if (btnItem.id === 'month') {
    //                 this.period = 'month';
    //             } else if (btnItem.id === 'year') {
    //                 this.period = 'year';
    //             } else if (btnItem.id === 'all') {
    //                 this.period = 'all'
    //             }
    //
    //             this.operationsList = this.operations.getOperations(this.period, this.dateFrom, this.dateTo);
    //             this.getDataForCharts();
    //         }
    //     });
    // }
}

