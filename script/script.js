'use strict';

let incomeItems = document.querySelectorAll('.income-items'),
	expensesItems = document.querySelectorAll('.expenses-items');

const start = document.getElementById('start'),
	buttons = document.getElementsByTagName('button'),
	 incomePlus = buttons[0],
	 expensesPlus = buttons[1],
	 depositCheck = document.querySelector('#deposit-check'),
	 addIncomeItem = document.querySelectorAll('.additional_income-item'),
	 budgetMonthValue = document.getElementsByClassName('budget_month-value')[0],
	 budgetDayValue = document.getElementsByClassName('budget_day-value')[0],
	 expensesMonthValue = document.getElementsByClassName('expenses_month-value')[0],
	 addIncomeValue = document.getElementsByClassName('additional_income-value')[0],
	 addExpensesValue = document.getElementsByClassName('additional_expenses-value')[0],
	 incomePeriodValue = document.getElementsByClassName('income_period-value')[0],
	 targetMonthValue = document.getElementsByClassName('target_month-value')[0],
	 salaryAmount = document.querySelector('.salary-amount'),
	 incomeTitle = incomeItems[0],
	 incomeAmount = document.querySelector('.income-amount'),
	 expensesTitle = expensesItems[0],
	 expensesAmount = document.querySelector('.expenses-amount'),
	 addExpensesItem = document.querySelector('.additional_expenses-item'),
	 targetAmount = document.querySelector('.target-amount'),
	 periodSelect = document.querySelector('.period-select'),
	 
	 data = document.querySelector('.data'),
	 resetBtn = document.getElementById('cancel'),
	 depositBank = document.querySelector('.deposit-bank'),
	 depositAmount = document.querySelector('.deposit-amount'),
	 depositPercent = document.querySelector('.deposit-percent');
let inputData = data.querySelectorAll('input'),
	periodAmount = document.querySelector('.period-amount');
 
	
class AppData { 
	constructor() {
		this.budget = 0;
		this.budgetDay = 0;
		this.budgetMonth = 0;
		this.income = {};
		this.incomeMonth = 0;
		this.addIncome = [];
		this.expenses = {};
		this.expensesMonth = 0;
		this.deposit = false;
		this.percentDeposit = 0;
		this.moneyDeposit = 0;
		this.addExpenses = [];
	}

	// запуск программы по нажатию кнопки "Расчитать"
	start() {
		this.budget = Number(salaryAmount.value);
		this.calcExpIncome();
		this.getTargetMonth();
		this.getAddExpenses();
		this.getAddIncome();
		this.getInfoDeposit();
		this.getBudget();
		this.showResult();
	}

// Занесение данных в правый столбик  - результат
	showResult() {
		budgetMonthValue.value = this.budgetMonth;
		budgetDayValue.value = this.budgetDay;
		expensesMonthValue.value = this.expensesMonth;
		addExpensesValue.value = this.addExpenses.join(', ');
		addIncomeValue.value = this.addIncome.join(', ');
		targetMonthValue.value = Math.ceil(this.getTargetMonth());
		incomePeriodValue.value = this.calcPeriod();		
	}
//универсальный метод по добавлению текстовых полей
	addBlock(value) {
		
		let cloneExpensesItem = expensesItems[0].cloneNode(true);
		let inputsClone = cloneExpensesItem.querySelectorAll('input');
		let div = document.createElement('div');
		
		inputsClone.forEach((item) => {
			item.removeAttribute('class');
			item.value = '';
			this.onlyNum(item);
			this.onlyText(item);
		});
		if (value === 1){
			div.setAttribute('class', 'expenses-items');
			inputsClone[0].setAttribute('class', 'expenses-title');
			div.appendChild(inputsClone[0]);
			inputsClone[1].setAttribute('class', 'expenses-amount');
			div.appendChild(inputsClone[1]);
			console.log(div);
			expensesItems[0].parentNode.insertBefore(div, expensesPlus);
			expensesItems = document.querySelectorAll('.expenses-items');
			if(expensesItems.length == 3){
				expensesPlus.style.display = 'none';
			}
		} 
		if (value === 2){
			div.setAttribute('class', 'income-items');
			inputsClone[0].setAttribute('class', 'income-title');
			div.appendChild(inputsClone[0]);
			inputsClone[1].setAttribute('class', 'income-amount');
			div.appendChild(inputsClone[1]);
			incomeItems[0].parentNode.insertBefore(div, incomePlus);
			incomeItems = document.querySelectorAll('.income-items');
			if(incomeItems.length == 3){
				incomePlus.style.display = 'none';
			}
		}
	}
// внесение в объект данных по обязательным доходам и расходам  - универсальный метод по 2-пункуту ДЗ урока 11.1
	calcExpIncome() {
		expensesItems.forEach((item) => {
			let itemExpenses = item.querySelector('.expenses-title').value;
			let cashExpenses = item.querySelector('.expenses-amount').value;
			if(itemExpenses !== '' && cashExpenses !== ''){
				this.expenses[itemExpenses] = Number(cashExpenses);
			}
		})

		for (let keys in this.expenses){
			this.expensesMonth += this.expenses[keys];
		}
			
		incomeItems.forEach((item) => {
			let itemIncome = item.querySelector('.income-title').value;
			let cashIncome = item.querySelector('.income-amount').value;
			if (itemIncome !== '' && cashIncome !== ''){
				this.income[itemIncome] = Number(cashIncome);
			}
		})
		for (let key in this.income){
			this.incomeMonth += +this.income[key];
		}
	}

	getInfoDeposit() {
		if (this.deposit){
			this.percentDeposit = depositPercent.value;
			this.moneyDeposit = depositAmount.value;
		}
	}
// расчет бюджета
	getBudget() { 
		 this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth + 
		 					Math.round((this.moneyDeposit * this.percentDeposit)/12);
		 this.budgetDay = Math.floor(this.budgetMonth / 30);
	}

	getTargetMonth() { 
		return targetAmount.value / this.budgetMonth;
	};
// сколько денег заработано за указанный на ползунке период
	calcPeriod() {
		return this.budgetMonth * periodSelect.value;
	};
// информация по дополнительным расходам
	getAddExpenses() {
		let addExpenses = addExpensesItem.value.split(',');
		addExpenses.forEach((item) => {
			item = item.trim();
			if(item !== ''){
				this.addExpenses.push(item);
			}
		})
	}

	getAddIncome() {
		addIncomeItem.forEach((item) => {
			let itemValue = item.value.trim();
			if(itemValue !== ''){
				this.addIncome.push(itemValue);
			}
		})
	}
// Сброс всех параметров
	reset() {
		const inputs = document.querySelectorAll('input');
		expensesItems.forEach((item, i) => {
			if(i > 0){
				expensesItems[i].remove();
			}
		})
		incomeItems.forEach((item, i) => {
			if(i > 0){
				incomeItems[i].remove();
			}
		
		})
		incomePlus.style.display = 'block';
		expensesPlus.style.display = 'block';
			
		this.budget = 0;
		this.budgetDay = 0;
		this.budgetMonth =0;
		this.expensesMonth = 0;
		this.income = {};
		this.incomeMonth = 0;
		this.expenses = {};
		this.addIncome = [];
		this.addExpenses = [];
		this.deposit = false;
		this.moneyDeposit = 0;
		this.percentDeposit = 0;
				
		periodAmount.innerHTML = 1;

		inputs.forEach((item) => {
			item.value = '';
		})
		inputData.forEach((item, i) => {
			item.removeAttribute('disabled');
		})

		depositCheck.checked = false;
		depositBank.style.display = 'none';
		depositAmount.style.display = 'none';
		depositPercent.style.display = 'none';

		start.style.display = 'block';
		cancel.style.display = 'none';
		this.block();
		periodSelect.value = 1;
	localStorage.removeItem('month budget');
	localStorage.removeItem('day budget');
	localStorage.removeItem('month expenses');
	localStorage.removeItem('addition expenses');
	localStorage.removeItem('addition income');
	localStorage.removeItem('month target');
	localStorage.removeItem('period');
	
		document.cookie = 'month budget' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		document.cookie = 'day budget' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		document.cookie = 'month expenses' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		document.cookie = 'addition expenses' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		document.cookie = 'addition income' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		document.cookie = 'month target' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		document.cookie = 'period' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		document.cookie = 'isLoad' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	}
//блокировка для внесение в поля только цифр
	onlyNum(item) {
		if(item.hasAttribute('placeholder')){
			if (item.placeholder == 'Сумма'){
			   item.addEventListener('input', removeNotNumbers);
		    }
		}
		function removeNotNumbers(){
			this.value = this.value.replace(/[^0-9]/g, '')
		}
	}
//блокировка для внесение в поля только текста
	onlyText(item) {
		if(item.hasAttribute('placeholder')){
			if (item.placeholder == 'Наименование'){
			   item.addEventListener('input', removeNotText);
		    }
		}
		function removeNotText(){
			this.value = this.value.replace(/\w/g, '')
		}
	}
// отлавливание событий элементов
	eventsListeners() {
		document.addEventListener("DOMContentLoaded", this.onLoad())
		periodSelect.addEventListener('change', () => {
			periodAmount.innerHTML = periodSelect.value;
			incomePeriodValue.value = this.calcPeriod();
			
			
		
		})
		
		start.addEventListener('click', this.start.bind(this));
		
		start.addEventListener('click', () => {
			start.style.display = 'none';
			cancel.style.display = 'block';
			inputData = data.querySelectorAll('input');
			inputData.forEach((item, i) => {
				item.setAttribute('disabled', 'disabled');
			})
			inputData[inputData.length - 1].removeAttribute('disabled');
			incomePlus.style.display = 'none';
			expensesPlus.style.display = 'none';
		})
		
		start.addEventListener('click',() =>{
			localStorage.setItem('month budget', this.budgetMonth);
			localStorage.setItem('day budget', this.budgetDay);
			localStorage.setItem('month expenses', this.expensesMonth);
			localStorage.setItem('addition expenses', this.addExpenses.join(', '));
			localStorage.setItem('addition income', this.addIncome.join(', '));
			localStorage.setItem('month target', Math.ceil(this.getTargetMonth()));
			localStorage.setItem('period', this.calcPeriod());
			

			document.cookie = 'month budget' + '=' + this.budgetMonth;
			document.cookie = 'day budget' + '=' + this.budgetDay;
			document.cookie = 'month expenses' + '=' + this.expensesMonth;
			document.cookie = 'addition expenses' + '=' + this.addExpenses.join(', ');
			document.cookie = 'addition income' + '=' + this.addIncome.join(', ');
			document.cookie = 'month target' + '=' + Math.ceil(this.getTargetMonth());
			document.cookie = 'period' + '=' + this.calcPeriod();
			document.cookie = 'isLoad=true';


		});

		inputData.forEach((item) => {
			this.onlyNum(item);
			this.onlyText(item);
			});
		expensesPlus.addEventListener('click', () =>{
			this.addBlock(1);
		})
		incomePlus.addEventListener('click', () =>{
			this.addBlock(2);
		});
		resetBtn.addEventListener('click', this.reset.bind(this));
		depositCheck.addEventListener('change', () =>  {
			if (depositCheck.checked){
				depositBank.style.display = 'inline-block';
				depositAmount.style.display = 'inline-block';
				this.deposit = 'true';

				depositBank.addEventListener('change', () => {
					let selectIndex = depositBank.options[depositBank.selectedIndex].value;
					if(selectIndex === 'other'){
						depositPercent.style.display = 'inline-block';
						depositPercent.removeAttribute('disabled');
						depositPercent.value = '';
					}else{
						depositPercent.style.display = 'none';
						depositPercent.value = selectIndex;
					}
				})
			}else{
				depositBank.style.display = 'none';
				depositAmount.style.display = 'none';
				depositAmount.value = '';
				this.deposit = 'false';
			}

		})

		this.block();
	}
//блокировка всех текстовых полей
	block() {	
		start.setAttribute('disabled', 'disabled');	
		salaryAmount.addEventListener('input', () => {
			let trimValue = salaryAmount.value.trim();
			let check = trimValue.split('');
			if (check.length == 0){
				start.setAttribute('disabled', 'disabled');
			} else if(salaryAmount.value == Number(salaryAmount.value)){
				start.removeAttribute('disabled');
			} else{
				start.setAttribute('disabled', 'disabled');
			}
		})
	}
	onLoad(){
	budgetMonthValue.value = localStorage.getItem('month budget');
	budgetDayValue.value = localStorage.getItem('day budget');
	expensesMonthValue.value = localStorage.getItem('month expenses');
	addExpensesValue.value = localStorage.getItem('addition expenses');
	addIncomeValue.value = localStorage.getItem('addition income');
	targetMonthValue.value = localStorage.getItem('month target');
	incomePeriodValue.value = localStorage.getItem('period');	
		if(document.cookie !== ''){
			inputData = data.querySelectorAll('input');
			inputData.forEach((item, i) => {
				item.setAttribute('disabled', 'disabled');
			})
			inputData[inputData.length - 1].removeAttribute('disabled');
			start.style.display = 'none';
			cancel.style.display = 'block';

		}
		let cookie = document.cookie;
		let arrCoockie = cookie.split(';');
		let coincid = 0;
		for(let i = 0; i < localStorage.length; i++){
			arrCoockie.forEach(item =>{
				let oneCookie =  item.split('=');
				if(oneCookie[0].trim() == localStorage.key(i).trim()){
					coincid++;
				}
			})
		}
		if (coincid < localStorage.length){
			this.reset();
		}
	}
}

const appData = new AppData();




appData.eventsListeners();