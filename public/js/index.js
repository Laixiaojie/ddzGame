$("#target").HappyImage({
	autoplay: 2500,
	effect: 'fade'
});
$("#showPage").hide();

function my$(str) {
	if (str.indexOf("#") == "0") {
		return document.getElementById(str.slice(1));
	} else if (str.indexOf(".") == "0") {
		return document.getElementsByClassName(str.slice(1));
	} else {
		return document.getElementsByTagName(str);
	}
}
my$(".fa")[0].addEventListener('click', function(){
	// alert('success');
	if (this.style.color == ""){
		this.style.color = 'red';
	} else {
		this.style.color = '';
	}
	$("#showPage").stop().fadeToggle().css('zIndex', '10');
})




/* my$('#sub').onsubmit = function() {

	var user = document.getElementById("user");
	var paw = document.getElementById("paw");

	if (user.value == '' || user.value == null) {
		alert('sorry uearName can\'t be null!');
		// console.log('sorry uearName');
		this.reset();
		return false;
	} else if (paw.value == '' || paw.value == null) {
		alert('sorry password can\'t be null!');
		// console.log('sorry password');
		this.reset();
		return false;
	}
} */

// var tempW = my$("img")[0].offsetWidth / window.devicePixelRatio;
// my$("img")[0].style.width = tempW + 'px';