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
DIndex.VERSION = "0.2.4";

DIndex.Meta = {};
DIndex.WeekRows = [];

DIndex.InitMeta= function (){
	this.Meta.IndexRow = [];
	this.Meta.SpanLength  = this.PATTERN.length; 
	this.Meta.TotalLength = this.Meta.SpanLength*this.INDEX_RANGE;
	
	this.Meta.CurrentDate = new Date();
	
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
	
	this.Meta.DayOffset = this._DayDiff(this.START_DATE, this.Meta.CurrentDate);
	
	for (var i = 0; i < this.Meta.IndexRow.length; i++){
		if (this.Meta.IndexRow[i] == this.START_INDEX){
			this.Meta.TodayPointer = i;
            //console.log(i+" : " +this.Meta.IndexRow[i]);
            break;
		}
	}
     
	//this.Meta.TodayPointer = this.START_INDEX * this.Meta.SpanLength - this.GAP_LENGTH - 1;
	this.Meta.TodayPointer += this.Meta.DayOffset;
    //console.log( this.Meta.TodayPointer);
	this.Meta.FirstPointer = this.Meta.TodayPointer - this.Meta.CurrentDate.getDay() - this.WEEKDAYS*this.WEEK_ROW_CURRENT; //start from Sunday index(0)
    //console.log( this.Meta.FirstPointer);
	this.Meta.CurrentPointer = this.Meta.FirstPointer;
    
  //console.log( this.Meta.TodayPointer);
   //console.log(this.Meta.FirstPointer);
    console.log(this.Meta.IndexRow);
	
}



DIndex.InitMetaSimple= function (){
	this.Meta.IndexRow = [];
	this.Meta.SpanLength  = (this.GAP_LENGTH+ this.STACK_LENGTH); 
	this.Meta.TotalLength = this.Meta.SpanLength* this.INDEX_RANGE;
	
	this.Meta.CurrentDate = new Date();
	
	var label = 1;
	
	for(var i = 0 ; i < this.Meta.TotalLength; i++){
		if ( i % this.Meta.SpanLength < this.STACK_LENGTH){
			
				if (label%this.INDEX_RANGE == 0){
					this.Meta.IndexRow[i] =  (label%this.INDEX_RANGE + this.INDEX_RANGE);
				}else{
					this.Meta.IndexRow[i] =  (label%this.INDEX_RANGE);
				}
				label++;
			
		}else{
			this.Meta.IndexRow[i] = -1;
		}
	}
	
	var dayOffSet = this._DayDiff(this.START_DATE, this.Meta.CurrentDate);
	
	for (var i = 0; i < this.Meta.IndexRow.length; i++){
		if (this.Meta.IndexRow[i] == this.START_INDEX){
			this.Meta.TodayPointer = i;
            break;
		}
	}
     console.log( this.Meta.TodayPointer);
	//this.Meta.TodayPointer = this.START_INDEX * this.Meta.SpanLength - this.GAP_LENGTH - 1;
	this.Meta.TodayPointer += dayOffSet;
    
	this.Meta.FirstPointer = this.Meta.TodayPointer - this.Meta.CurrentDate.getDay() - this.WEEKDAYS*this.WEEK_ROW_CURRENT; //start from Sunday index(0)
    
	this.Meta.CurrentPointer = this.Meta.FirstPointer;
    
  console.log( this.Meta.TodayPointer);
   console.log(this.Meta.FirstPointer);
    console.log(this.Meta.IndexRow);
	
}

DIndex.NextWeek = function(){
	
	var weekRow = []; 
	for (var i =  0 ; i < this.WEEKDAYS; i++){
		var unsign = (i+this.Meta.CurrentPointer)%this.Meta.TotalLength;
		
		/* negative index is not a requirement for now
		if (unsign < 0){
			unsign = this.Meta.TotalLength + unsign;
		}
		*/
		weekRow[i] = this.Meta.IndexRow[unsign];
	}

	this.Meta.CurrentPointer += this.WEEKDAYS;
	return weekRow;
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
		this.WeekRows[i] = this.NextWeek();
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