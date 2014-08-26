var args = arguments[0] || {};

//$.webView.url='http://docs.appcelerator.com/titanium/latest/#!/api/Titanium.UI.WebView';
$.webView.url='/index.html';

Ti.App.addEventListener('app:fromWebView', function(e) {
	var ven2=Alloy.createController('ventana2').getView();
	ven2.open();
});
