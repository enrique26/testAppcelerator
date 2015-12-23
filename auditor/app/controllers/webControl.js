var args = arguments[0] || {};

var Cloud=require('ti.cloud');

//idobjeto default para la primera busqueda
var idObjetoPagina='aaaaaaaa0000000000000000';

if(Ti.Network.online){
	
}else{
	alert('No cuentas con conexión a internet en este momento');
}

function checkUrl(busqueda) {
	var str = busqueda;
	var filter = /^([A-Za-z0-9_\-\.])+\.([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
	var filter2 = /^([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
	var testresults=0;
	if (filter.test(str)== true) {
		testresults = 1;
	}else if(filter2.test(str)==true){
		testresults = 2;
	}else {
		testresults = 0;
	}
	return (testresults);
}


function registarPagina(url) {
	
	// //consultar los datos del usuario registado en el custom object
		// Cloud.Objects.query({
			// classname : 'metrica',
			// page : 1,
			// per_page : 10,
			// where : {
				// email : 'enr@test.com'
			// }
		// }, function(e) {
			// if (e.success) {
				// alert('Success:\n' + 'Count: ' + e.metrica.length);
				// for (var i = 0; i < e.metrica.length; i++) {
					// var metrica = e.metrica[i];
					// alert('id: ' + metrica.idUsuario + '\n' + 'make: ' + metrica.idSesion + '\n' + 'color: ' + metrica.email + '\n' + 'year: ' + metrica.name);
					// Ti.API.info('todos: '+JSON.stringify(metrica));
				// }
			// } else {
				// alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
			// }
		// });
	
	var horaInicio=new Date().getHours();
	var minInicio=new Date().getMinutes();
	
	Cloud.Objects.create({
		classname : 'VisitLog',
		fields : {
			idSesion : args.idSesion.toString(),
			email : args.emailSesion,
			url : url,
			visitStartHour : horaInicio+':'+minInicio,
			visitEndHour :':'
			
		}
	}, function(e) {
		if (e.success) {
			var VisitLog = e.VisitLog[0];
			alert('Success->\n' +
			'idObjeto: ' + VisitLog.id + '\n' + 
			'idSesion: ' + VisitLog.idSesion + '\n' + 
			'email: ' + VisitLog.email + '\n' + 
			'url'+VisitLog.url+'\n'+
			'visirStartHour'+VisitLog.visitStartHour+'\n'+
			'visitEndHour'+VisitLog.visitEndHour);
			
			//
			idObjetoPagina=VisitLog.id;
			//
		} else {
			alert('Error no se pudo crear el objeto:\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});
}

function endVisit(idObjeto) {
	var horaEnd= new Date().getHours();
	var minEnd = new Date().getMinutes();

	Cloud.Objects.update({
		classname : 'VisitLog',
		id : idObjeto,
		fields : {
			visitEndHour : horaEnd + ':' + minEnd
		}
	}, function(e) {
		if (e.success) {
			var VisitLog = e.VisitLog[0];
			alert('Success:\n' + 'id: ' + VisitLog.id + '\n' + 
			'visitStartHour: ' + VisitLog.visitStartHour + '\n' + 
			'visitEndHour: ' + VisitLog.visitEndHour + 
			'\nupdated at' + VisitLog.updated_at);

		} else {
			alert('Error endVisit:\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});
}


$.back.addEventListener('click',function(){
	endVisit(idObjetoPagina);
});

$.front.addEventListener('click',function(){
	endVisit(idObjetoPagina);
});


$.irB.addEventListener('click', function() {
	endVisit(idObjetoPagina);
	if ($.campoUrl.value != '') {

		var campo = $.campoUrl.value + '';

		var strUrl = checkUrl(campo);
		var ishttp = campo.search('http://');

		if (ishttp >= 0) {
			$.auditWeb.url = $.campoUrl.value;
			Ti.API.info('0');
			$.campoUrl.value = $.auditWeb.getUrl();
			//objeto busqueda con ulr
			registarPagina($.auditWeb.getUrl());

		} else if (strUrl == 1) {
			$.auditWeb.url = 'http://' + $.campoUrl.value;
			Ti.API.info('1');
			$.campoUrl.value = $.auditWeb.getUrl();
			//objeto busqueda con ulr
			registarPagina($.auditWeb.getUrl());

		} else if (strUrl == 2) {
			$.auditWeb.url = 'http://www.' + $.campoUrl.value;
			Ti.API.info('2');
			$.campoUrl.value = $.auditWeb.getUrl();
			//objeto busqueda con ulr
			registarPagina($.auditWeb.getUrl());

		} else {
			var ts = $.campoUrl.value;
			var encoded = Ti.Network.encodeURIComponent(ts);
			$.auditWeb.url = "https://www.google.com.mx/?gws_rd=ssl#q=" + encoded;
			Ti.API.info('3');
			$.campoUrl.value = $.auditWeb.getUrl();

			//objeto busqueda con google
			registarPagina($.auditWeb.getUrl());
		}

		
	}
}); 




$.back.addEventListener('click',function(){
	if($.auditWeb.canGoBack()){
		$.auditWeb.goBack();
	}else{
		Ti.API.info('No se puede regresar mas en el historial');
	}
});

$.front.addEventListener('click',function(){
	if($.auditWeb.canGoForward()){
		$.auditWeb.goForward();
	}else{
		Ti.API.info('No se puede avanzar mas en el historial');
	}
});


function updateSesionClose(idObjeto) {
	var horaSalida=new Date().getHours();
	var minSalida=new Date().getMinutes();
	
	//terminar la visita a la ultima pagina antes de actualizar la session y cerrarla
	endVisit(idObjetoPagina);
	//
	
	Cloud.Objects.update({
		classname : 'UserSession',
		id : idObjeto,
		fields : {
			closeHour:horaSalida+':'+minSalida  
		}
	}, function(e) {
		if (e.success) {
			var UserSession = e.UserSession[0];
			alert('Success:\n' + 'id: ' + UserSession.id + '\n' + 'startHour: ' + UserSession.startHour + '\n' + 'closehour: ' + UserSession.closeHour+'\nupdated at'+ UserSession.updated_at);
			
			//terminar sesion del usuario
			Cloud.Users.logout(function (e) {
			    if (e.success) {
			        Ti.API.info('Success: Logged out');
			    } else {
			        Ti.API.error('Error personalizado webControl closeEvent:\n' +
			            ((e.error && e.message) || JSON.stringify(e)));
			    }
			});
			
		} else {
			alert('Error udapteSessionClose:\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});

}

$.webControl.addEventListener('close',function(){
	// idObjeto es el ID generado en el objeto al crearse
	updateSesionClose(args.idObjeto);
	
});
// para consultar los objetos o custom objects usar https://api.cloud.appcelerator.com/v1/objects/classname/method.json
//consultar un registro de VisitLog
// curl -c cookies.txt -b cookies.txt -X GET --data-urlencode 'where={"idSesion":"202"}' --data-urlencode 'order=created_at' "https://api.cloud.appcelerator.com/v1/objects/VisitLog/query.json?key=GErIr5iIfpztZAAVmEHUfu3NP0UByCIL"
//consultar todos los registros en VisitLog
// curl -c cookies.txt -b cookies.txt -X GET --data-urlencode --data-urlencode "https://api.cloud.appcelerator.com/v1/objects/VisitLog/query.json?key=GErIr5iIfpztZAAVmEHUfu3NP0UByCIL"
//consultar UserSession por nombre muestra un unico usuario
// curl -c cookies.txt -b cookies.txt -X GET --data-urlencode 'where={"name":"nombre"}' --data-urlencode 'order=created_at' "https://api.cloud.appcelerator.com/v1/objects/UserSession/query.json?key=GErIr5iIfpztZAAVmEHUfu3NP0UByCIL"
//consultar los UserSession todos los usuarios-muestra todoas las sesiones registradas
// curl -c cookies.txt -b cookies.txt -X GET --data-urlencode --data-urlencode "https://api.cloud.appcelerator.com/v1/objects/UserSession/query.json?key=GErIr5iIfpztZAAVmEHUfu3NP0UByCIL"

//consultar la tabla de usuarios https://api.cloud.appcelerator.com/v1/users/query.json
//para consultar usuario registrados por nombre
// curl -c cookies.txt -b cookies.txt -X GET --data-urlencode 'where={"first_name":"manic"}' --data-urlencode 'order=created_at' "https://api.cloud.appcelerator.com/v1/users/query.json?key=GErIr5iIfpztZAAVmEHUfu3NP0UByCIL"
//consultar todos los usuario registrados
// curl -c cookies.txt -b cookies.txt -X GET --data-urlencode  --data-urlencode  "https://api.cloud.appcelerator.com/v1/users/query.json?key=GErIr5iIfpztZAAVmEHUfu3NP0UByCIL"
// key: GErIr5iIfpztZAAVmEHUfu3NP0UByCIL


