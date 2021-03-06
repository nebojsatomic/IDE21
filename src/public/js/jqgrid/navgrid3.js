jQuery("#navgrid3").jqGrid({
   	url:'editing.php?q=1',
	datatype: "xml",
   	colNames:['Inv No','Date', 'Client', 'Amount','Tax','Total','Closed','Ship via','Notes'],
   	colModel:[
   		{name:'id',index:'id', width:55,editable:false,editoptions:{readonly:true,size:10}},
   		{name:'invdate',index:'invdate', width:80,
			editable:true,
			editoptions:{size:12,
				dataInit:function(el){
					$(el).datepicker({dateFormat:'yy-mm-dd'});
				},
				defaultValue: function(){
					var currentTime = new Date();
					var month = parseInt(currentTime.getMonth() + 1);
					month = month <= 9 ? "0"+month : month;
					var day = currentTime.getDate();
					day = day <= 9 ? "0"+day : day;
					var year = currentTime.getFullYear();
					return year+"-"+month + "-"+day;				
				}
			},
			formoptions:{ rowpos:2, elmprefix:"(*)",elmsuffix:"  yyyy-mm-dd" },
			editrules:{required:true}
		},
   		{name:'name',index:'name', width:90,editable:true,editoptions:{size:25}, formoptions:{ rowpos:1, label: "Name", elmprefix:"(*)"},editrules:{required:true}},
   		{name:'amount',index:'amount', width:60, align:"right",editable:true,editoptions:{size:10}, formoptions:{ rowpos:5,elmprefix:"&nbsp;&nbsp;&nbsp;&nbsp;"}},
   		{name:'tax',index:'tax', width:60, align:"right",editable:true,editoptions:{size:10},formoptions:{ rowpos:6,elmprefix:"&nbsp;&nbsp;&nbsp;&nbsp;"}},
   		{name:'total',index:'total', width:60,align:"right",editable:true,editoptions:{size:10}, formoptions:{ rowpos:7,elmprefix:"&nbsp;&nbsp;&nbsp;&nbsp;" }},
		{name:'closed',index:'closed',width:55,align:'center',editable:true,edittype:"checkbox",editoptions:{value:"Yes:No",defaultValue:"Yes"}, formoptions:{ rowpos:4,elmprefix:"&nbsp;&nbsp;&nbsp;&nbsp;" }},
		{name:'ship_via',index:'ship_via',width:70,
			editable: true,
			edittype:"select",
			editoptions:{dataUrl:'test.txt', defaultValue:'Intime'},
			formoptions:{ rowpos:3,elmprefix:"&nbsp;&nbsp;&nbsp;&nbsp;" }
		},
   		{name:'note',index:'note', width:100, sortable:false,editable: true,edittype:"textarea", editoptions:{rows:"2",cols:"20"}, formoptions:{ rowpos:8,elmprefix:"&nbsp;&nbsp;&nbsp;&nbsp;" }}		
   	],
   	rowNum:10,
   	rowList:[10,20,30],
   	imgpath: gridimgpath,
   	pager: '#pagernav3',
   	sortname: 'id',
    viewrecords: true,
    sortorder: "desc",
    caption:"Navigator Example",
    editurl:"someurl.php",
	height:210
}).navGrid('#pagernav3',
{view:true}, //options
{height:290,reloadAfterSubmit:false, jqModal:false, closeOnEscape:true, bottominfo:"Fields marked with (*) are required"}, // edit options
{height:290,reloadAfterSubmit:false,jqModal:false, closeOnEscape:true,bottominfo:"Fields marked with (*) are required", closeAfterAdd: true}, // add options
{reloadAfterSubmit:false,jqModal:false, closeOnEscape:true}, // del options
{closeOnEscape:true}, // search options
{height:250,jqModal:false,closeOnEscape:true} // view options
);