var jiff_instance;

function connect() {
  $('#connectButton').prop('disabled', true);
  var computation_id = $('#computation_id').val();
  var party_count = parseInt($('#count').val());

  if(isNaN(party_count)) {
    $("#output").append("<p class='error'>Party count must be a valid number!</p>");
    $('#connectButton').prop('disabled', false);
  } else {
    var options = { party_count: party_count};
    options.onError = function(error) { $("#output").append("<p class='error'>"+error+"</p>"); };
    options.onConnect = function() { $("#sumButton").attr("disabled", false); $("#output").append("<p>All parties Connected!</p>"); };
    
    var hostname = window.location.hostname.trim();
    var port = window.location.port;
    if(port == null || port == '') 
      port = "80";
    if(!(hostname.startsWith("http://") || hostname.startsWith("https://")))
      hostname = "http://" + hostname;
    if(hostname.endsWith("/"))
      hostname = hostname.substring(0, hostname.length-1);
    if(hostname.indexOf(":") > -1)
      hostanme = hostname.substring(0, hostname.indexOf(":"));

    hostname = hostname + ":" + port;
    jiff_instance = jiff.make_jiff(hostname, computation_id, options);
  }
}

function sum() {
  var input = parseInt($("#number").val());

  if (isNaN(input))
    $("#output").append("<p class='error'>Input a valid number!</p>");
  else if (100 < input || input < 0 || input != Math.floor(input))
    $("#output").append("<p class='error'>Input a WHOLE number between 0 and 100!</p>");
  else if (jiff_instance == null || !jiff_instance.isReady())
    alert("Please wait!");
  else {
    $("#sumButton").attr("disabled", true);
    $("#output").append("<p>Starting...</p>");
    var promise = mpc.mpc(jiff_instance, input);
    promise.then(handleResult);
  }
}

function handleResult(result) {
  $("#output").append("<p>Result is: " + result + "</p>");
  $("#sumButton").attr("disabled", false);
}