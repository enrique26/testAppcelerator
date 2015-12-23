var args = arguments[0] || {};


var Cloud=require('ti.cloud');

function login(user,pass){

	Cloud.Users.login({
	    login: user.toString(),
	    password: pass.toString()
	}, function (e) {
	    if (e.success) {
	        var user = e.users[0];
	        Ti.API.info('Success:\n' +
	            'id: ' + user.id + '\n' +
	            'sessionId: ' + Cloud.sessionId + '\n' +
	            'first name: ' + user.first_name + '\n' +
	            'last name: ' + user.last_name+ '\n' +
	            'todo:'+JSON.stringify(e.users[0]));
	         
	         var nextId=(parseInt(Math.random()*1000)); 
	         var horaInicio=new Date().getHours();
	         var minInicio=new Date().getMinutes();
	         
	         //crear custom object para registar la actividad del usuario
	           Cloud.Objects.create({
				    classname: 'UserSession',
				    fields: {
				        idUsuario: user.id,
				        idSesion:nextId.toString(),
				        email: user.email,
				        name: user.first_name.toString(),
				        lastName:user.last_name.toString(),
				        startHour:horaInicio+':'+minInicio,
				        closeHour:':'   
				    }
				}, function (e) {
				    if (e.success) {
				        var UserSession = e.UserSession[0];
				        alert('Success->\n' +
				        	'idObjeto: ' + UserSession.id + '\n' +
				            'idUsuario: ' + UserSession.idUsuario + '\n' +
				            'idSesion: ' + UserSession.idSesion + '\n' +
				            'email: ' + UserSession.email + '\n' +
				            'name: ' + UserSession.name + '\n' +
				            'lastName: ' + UserSession.lastName + '\n' +
				            'starthour: ' + UserSession.startHour+ '\n' +
				            'closeHour: ' + UserSession.closeHour);
				            
				            //          
					        Alloy.createController('webControl',{'idSesion':nextId,"idObjeto":UserSession.id}).getView().open();
					        //
				    } else {
				        alert('Error no se pudo crear el objeto:\n' +
				            ((e.error && e.message) || JSON.stringify(e)));
				    }
				});
			    //
			    
	    } else {
	        alert('Error:\n' +
	            ((e.error && e.message) || JSON.stringify(e)));
	    }
	});

}

$.entrar.addEventListener('click',function(){
	if(Ti.Network.online){
		login($.userField.value,$.passField.value);	
	}else{
		alert('No cuentas con conexion a internet en este momento');
	}
	
});


$.registrarse.addEventListener('click',function(){
	Alloy.createController('createUser').getView().open({
		modal:true
	});
});
