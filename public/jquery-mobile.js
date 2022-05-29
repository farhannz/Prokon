$(document).ready(function() {
$("input[type=submit]").click(function(e) {
var name = $("#name").val();
var Kelas = $("#Kelas").val();
if (name == '' || Kelas == '') {
e.preventDefault();
alert("Please Fill Required Fields");
}
});
});