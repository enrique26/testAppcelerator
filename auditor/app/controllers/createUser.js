var args = arguments[0] || {};

var Cloud=require('ti.cloud');

function crearUsuario(user,email,name,lastname,pass){
	Cloud.Users.create({
		username:user.toString(),
	    email: email.toString(),
	    first_name: name.toString(),
	    last_name: lastname.toString(),
	    password: pass.toString(),
	    password_confirmation: pass.toString()
	}, function (e) {
	    if (e.success) {
	        var user = e.users[0];
	        Ti.API.info('Success:\n' +
	            'id: ' + user.id + '\n' +
	            'sessionId: ' + Cloud.sessionId + '\n' +
	            'first name: ' + user.first_name + '\n' +
	            'last name: ' + user.last_name + '\n' +
	            'email: ' + user.email);
	            
	    var nextId=(parseInt(Math.random()*1000));
	    
	    var horaInicio=new Date().getHours();
		var minInicio=new Date().getMinutes();
	    
	    Cloud.Objects.create({
		    classname: 'UserSession',
		    fields: {
		        idUsuario: user.id,
		        idSesion:nextId.toString(),
		        email: user.email,
		        name: name.toString(),
		        lastName:lastname.toString(),
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
	    			Alloy.createController('webControl',{"idSesion":nextId,"idObjeto":UserSession.id,"emailSesion":UserSession.email}).getView().open();
	    			//
		    } else {
		        alert('Error no se pudo crear el objeto:\n' +
		            ((e.error && e.message) || JSON.stringify(e)));
		    }
		});
	    
	    $.createUser.close();
	    } else {
	        alert('Error:\n' +
	            ((e.error && e.message) || JSON.stringify(e)));
	    }
	});

}

function checkemail(emailAddress) {
	var str = emailAddress;
	var filter = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
	if (filter.test(str)) {
		testresults = true;
	} else {
		testresults = false;
	}
	return (testresults);
}



$.registrar.addEventListener('click',function(){
	var revisarCorreo=checkemail($.email.value);
	
	if(revisarCorreo==true){
	
		if($.pass.value==$.confPass.value){
			crearUsuario($.user.value,$.email.value,$.name.value,$.lastname.value,$.confPass.value);
		}else{
			alert('las contraseñas no coinciden');
		}
	}else{
		alert('El formato de email es invalido');
	}
});


$.createUser.addEventListener('close',function(){
	$.destroy();
	$.off();
});