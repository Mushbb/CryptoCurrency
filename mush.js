d3.selection.prototype.moveToFront = function() {
	return this.each(function(){
		this.parentNode.appendChild(this);
	});
};

d3.selection.prototype.moveToBack = function() {
	return this.each(function() {
		var firstChild = this.parentNode.firstChild;
		if (firstChild) {
			this.parentNode.insertBefore(this, firstChild);
		}
	});
};

function formatDate(date) {
	var d = new Date(date),
		month = '' + (d.getMonth()+1),
		day = '' + d.getDate(),
		year = '' + d.getFullYear();
	
	if (month.length < 2) month = '0' + month;
	if (day.length < 2) day = '0' + day;
	
	return [year, month, day].join('-');
}

function strDate(date){
	var d = new Date(date),
		month = d.getMonth()+1,
		day = d.getDate(),
		year = d.getFullYear();
	
	if( day < 10 )
		day = "0"+day;
	if( month < 10)
		month = "0"+month;
	
	return ""+year+"-"+month+"-"+day;
}

function reverseString(str) {
	var newString = "";
	for (var i = str.length - 1; i >= 0; i--) {
		newString += str[i];
	}
	return newString;
}

function formatMoney(prize){
	var str = ''+prize,
		len = str.length-1,
		tem = [];
	
	for(i=len,j=0;i>=0;i--,j++){
		if( j%4 === 3 )
			tem[j++] = ',';
		
		tem[j] = str[i];
	}
	
	return reverseString(tem);
}

function formattitle(title){
	var tem;
	if( title.length > 35 ){
		tem = title.slice(0, 35);
	}
	else
		tem = title;
	
	return tem;
}

function cal_age(bday){
	var b_day = new Date(bday);
	var age;
	var year = b_day.getFullYear();
	var month = b_day.getMonth();
	var day = b_day.getDate();
	age = today.getFullYear() - year;
	if (today.getMonth() < month || (today.getMonth() === month && today.getDate() < day)) {
		age--;
	}
	
	return age;
}

function DisplayDate(date){
	var d = new Date(date),
		str = d.toDateString(),
		month = str.slice(4, 7),
		day = str.slice(8, 10),
		year = str.slice(11,15);
	
	return day+" "+month+" "+year;
}

function DisplayDate1(date){
	var d = new Date(date),
		str = d.toDateString(),
		month = str.slice(4, 7),
		day = str.slice(8, 10),
		year = str.slice(11,15);
	
	return year+" "+month+" "+day;
}

function daydiff(first, second) {
	return Math.round((second-first)/(1000*60*60*24));
}

function remove(array, element) {
	const index = array.indexOf(element);
	
	if (index !== -1) {
		array.splice(index, 1);
	}
}