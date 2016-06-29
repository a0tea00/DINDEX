/*

##############################################
#                                            #
# DIndex (dynamic indexing calender)         #
#                                            #
# Author: Trey Huang (email2treyh@gmail.com) #
#                                            #
# since: 9/16/2015                           #
#                                            #
##############################################
*/
DIndex  = {};
DIndex.START_DATE = new Date(2015, 11, 1);
DIndex.START_INDEX = 1;
DIndex.INDEX_RANGE = 5;
DIndex.GAP_LENGTH = 1;
DIndex.STACK_LENGTH = 2;
DIndex.PATTERN =  [1,0,1,0,1,0,0]; 
DIndex.WEEK_ROW_SHOWN = 4;
DIndex.WEEK_ROW_CURRENT = 1; //start from 0
DIndex.WEEKDAYS = 7; //7 day starts from 1, sunday is 0
DIndex.VERSION = "0.3.1";

DIndex.Meta = {};
DIndex.WeekRows = [];
DIndex.BoxRows = [];

DIndex.box = function (label, date, rank_label, rank_all ){
	this.label = label;
	this.date = date;
	this.rank_label = rank_label;
	this.rank_index = rank_all;
}
/*
pattern based version
*/
DIndex.InitMeta= function (){
	this.Meta.rank_label = 0;
	this.Meta.IndexRow = [];
	this.Meta.SpanLength  = this.PATTERN.length; 
	this.Meta.TotalLength = this.Meta.SpanLength*this.INDEX_RANGE;
	this.Meta.CurrentDate = new Date();
	//this.Meta.CurrentDate = new Date(Date.UTC(this.Meta.CurrentDate.getFullYear(), this.Meta.CurrentDate.getMonth(), this.Meta.CurrentDate.getDate(), 0, 0, 0));
	
	this.START_DATE = new Date(Date.UTC(this.START_DATE.getFullYear(), this.START_DATE.getMonth(), this.START_DATE.getDate(), 0, 0, 0));
	
	this.Meta.NoneEmptySpanDays = 0;
	for (var i in this.PATTERN){
		if (this.PATTERN[i] == 1){
			this.Meta.NoneEmptySpanDays ++;
		}
		
	}
	var label = 1;
	for(var i = 0 ; i < this.Meta.TotalLength; i++){
		
		if (this.PATTERN[i%this.Meta.SpanLength] == 0){
			this.Meta.IndexRow[i] = -1;
			
		}else{
			
			if(label%this.INDEX_RANGE == 0){
				this.Meta.IndexRow[i] = this.INDEX_RANGE;
			}else{
				this.Meta.IndexRow[i] = label%this.INDEX_RANGE ;
			}
			label++;
		}
		
	}
	
	//set first displayed day as today
	this.Meta.DayOffset = this._DayDiff(this.START_DATE, new Date(this.Meta.CurrentDate.getTime() - this.WEEKDAYS*this.WEEK_ROW_CURRENT*24*60*60*1000 - this.Meta.CurrentDate.getDay()*24*60*60*1000 ));
	//get the first day rank
	this.Meta.rank_label = this.RankOfToday();
	
	//set offset back to between startday and currentday
	this.Meta.DayOffset = this._DayDiff(this.START_DATE, this.Meta.CurrentDate);
		
	for (var i = 0; i < this.Meta.IndexRow.length; i++){
		if (this.Meta.IndexRow[i] == this.START_INDEX){
			this.Meta.TodayPointer = i;
            //console.log(i+" : " +this.Meta.IndexRow[i]);
            break;
		}
	}
     
	//this.Meta.TodayPointer = this.START_INDEX * this.Meta.SpanLength - this.GAP_LENGTH - 1;
	this.Meta.TodayPointer += this.Meta.DayOffset-1;
		
    //console.log( this.Meta.TodayPointer);
	this.Meta.FirstPointer = this.Meta.TodayPointer - this.Meta.CurrentDate.getDay() - this.WEEKDAYS*this.WEEK_ROW_CURRENT; //start from Sunday index(0)
    //console.log( this.Meta.FirstPointer);
	this.Meta.CurrentPointer = this.Meta.FirstPointer;
    
	
  //console.log( this.Meta.TodayPointer);
   //console.log(this.Meta.FirstPointer);
    console.log(this.Meta.FirstPointer);
	
}


DIndex.NextWeek = function(){
	
	//var weekRow = []; 
	var BoxRow = [];
	for (var i =  0 ; i < this.WEEKDAYS; i++){
		var unsign = (i+this.Meta.CurrentPointer)%this.Meta.TotalLength;
		
		/* negative index is not a requirement for now
		if (unsign < 0){
			unsign = this.Meta.TotalLength + unsign;
		}
		*/
		
		var newDate = new Date(DIndex.START_DATE.getTime()+((i+this.Meta.CurrentPointer+1)*24*60*60*1000));
		if (this.Meta.IndexRow[unsign] > 0){
			this.Meta.rank_label += 1;
		}
		BoxRow[i] = new this.box(this.Meta.IndexRow[unsign], newDate, this.Meta.rank_label ,(i+this.Meta.CurrentPointer+1));
			
		//weekRow[i] = this.Meta.IndexRow[unsign];
	}

	this.Meta.CurrentPointer += this.WEEKDAYS;
	return BoxRow;
}

DIndex._DayDiff = function(a, b){
        var _MS_PER_DAY = 1000 * 60 * 60 * 24;
		var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
		console.log(b);
		var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

		return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

DIndex.PrePopulate = function(){
	
	for(var i = 0; i < this.WEEK_ROW_SHOWN; i++ ){
		this.BoxRows[i] = this.NextWeek();
	}
	
}

DIndex.RankOfToday = function(){

	var fullspan = Math.floor(this.Meta.DayOffset / this.Meta.SpanLength);
	if (fullspan < 0){
		fullspan = 0;
	} 
	
	var rank = 0;
	for(var i = 0; i < (this.Meta.DayOffset % this.Meta.SpanLength); i++ ){
		
		if (this.PATTERN[i] == 1){
			rank ++;
		}
	}

	return (fullspan*this.Meta.NoneEmptySpanDays + rank);
}
