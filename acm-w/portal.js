let notificationBool = 0;
let alertDiv = document.querySelector("#alert");
let userInfoCard = document.querySelector("#userInfoCard");
let leftPanel = document.querySelector("#leftPanel");
let infoCards = document.querySelector("#infoCards");
let userCardBox = '<div id="profilePicture"><img class="circleCrop" src="default_photo.jpeg" width="100" height="100"></div><br>' + 
                  '<b>Name:</b> <p id="name">LOADING</p>' + 
                  '<b>UGA Email:</b> <p id="email">LOADING@uga.edu</p>' +
                  '<b>Total Attendance Hours:</b> <p id="totalHours">Loading...</p>'
let signInButton = document.querySelector(".signInButton");

// fetching the login credential data, validating the uga.edu, and then sending it to database to take care of the rest
function login(response) {
  const responsePayLoad = decodeJwtResponse(response.credential);
  signInButton.innerHTML = "<a href='javascript:location.reload();'>Logout</a>";
  if (responsePayLoad.hd != "uga.edu") {
    userInfoCard.innerHTML = "Please log in with your UGA email (MyID@uga.edu)";
  } else {
    userInfoCard.innerHTML = userCardBox;
    let profilePicture = document.querySelector("#profilePicture");
    let name = document.querySelector("#name");
    let email = document.querySelector("#email");
    name.innerHTML = responsePayLoad.name;
    email.innerHTML = responsePayLoad.email;
    attendance = generateAttendance(responsePayLoad.email, responsePayLoad.given_name, responsePayLoad.family_name);
    profilePicture.innerHTML = '<img class="circleCrop" src="' + responsePayLoad.picture + '" width="100" height="100">';
  } // if
} // login

function generateAttendance(email, fName, lName) {
  infoCards.innerHTML = "<div id='attendance' class = 'infoCard'><b>Attandance:</b><br><br><table id='attendanceTable'></table><br>This updates automatically! If you checked-in to a meeting or filled out a reflection and it does not show up here, please contact <a href='mailto:ugagirls.code@gmail.com'>ugagirls.code@gmail.com</a>.</div></div>" +
"<div id='elInfo' class = 'infoCard'><b>About UGAHacks Experiential Learning</b> [<a href='javascript:showELInfo();'>show</a>]</div>"
  httpGetAsync("https://script.google.com/macros/s/AKfycbxD_-FnsTiWAEB1xrMVkl6gBWt0B8jOGoMzezLxNZagkoWbu_UoP4jup7UKMKGxGGoBtw/exec?myid=" + email.split("@")[0], function(data){
  dataParsed = JSON.parse(data);
    console.log(dataParsed);
    let attendanceTable = document.querySelector("#attendanceTable");
    initAttendanceTable(attendanceTable);
    fillAttendance(attendanceTable, dataParsed);
    //return dataParsed

      var hourCounter = 0;
    for (i = 0; i < dataParsed.length; i++) {
      hourCounter = hourCounter + dataParsed[i].hours;
      if (dataParsed[i].elAvailable && dataParsed[i].el == 0) {
        notificationBool = 1;
      } // if
    } // for
    document.querySelector("#totalHours").innerHTML = hourCounter;
    if (notificationBool) {
      alertDiv.innerHTML = '<div id="notifications" class="infoCard"></div>'
      let notifications = document.querySelector("#notifications");
      notifications.innerHTML = "<b>Notifications:</b>"
      addReflectionNotifications(notifications, dataParsed);
    } // if
  });
} // generateAttendance

function initAttendanceTable(table) {
  table.innerHTML += "<tr><th>Attendance ID (AID)</th><th>Date</th><th>Program</th><th>Hours</th><th>Reflection Status</th><th>Notes</th></tr>"
} // initAttendanceTable

function fillAttendance(table, attendance) {
  for (i = 0; i < attendance.length; i++) {
    table.innerHTML += "<tr><td>" + attendance[i].aid + "</td><td>" + attendance[i].month + "-" + attendance[i].day + "-" + attendance[i].year + "</td><td>" + attendance[i].program + "</td><td>" + attendance[i].hours + "</td><td>" + generateReflectionStatus(attendance[i]) + "</td><td>" + attendance[i].note + "</td></tr>"
  } // for
} //fillAttendance

function generateReflectionStatus(attendanceInfo) {
  if (attendanceInfo.elAvailable == 1 && attendanceInfo.el == 0) {
    return "Not Submitted";
  } else if (attendanceInfo.el > 0) {
    return "Submitted";
  } else {
    return "Not Submitted";
  } // if
} // generateReflectionStatus

function showELInfo() {
  document.querySelector("#elInfo").innerHTML = "<b>About UGAHacks Experiential Learning</b> [<a href='javascript:hideELInfo();'>hide</a>]<br>";
  document.querySelector("#elInfo").innerHTML += '<p id="elPara"><b>UGAHacks</b> (University Hackathons) is a 501(c)3 non-profit organization with the purpose of hosting large scale hackathon events every year for college students on the UGA campus. As a UGA student, you are eligible to earn Experiential Learning credit through UGAHacks by attending the flagship event hosted by the organization each year, along with completing several requirements as outlined by the UGAHacks Experiential Learning packet.' +
'<br><br>For a portion of this requirement, students must attend at least 3-hours of student organization activities through the UGA chapter of Association for Computing Machinery, ACM-W Girls.Code(), or Society for Cyber Security. There is an additional 9-hours of involvement that can also be fulfilled by student organization activities, adding up to a total of 12-hours in campus involvement. You can either choose to fulfill all 12 of your involvement hours through the same student organization, or complete your requirement by completing a combination of different activities through the various student organizations.' +
'<br><br>For any event to count towards your UGAHacks Experiential Learning requirement, you must fill out a <b>100-word</b> reflection within <b>1 week</b> of the event. You can submit your reflection and track your progress for ACM-related hours through your membership portal. You <b>DO NOT</b> need to be a paying member for your attendance to count towards UGAHacks EL.' +
'<br><br>Some examples of what you can put in your reflection include, but are not limited to:</p>' + '<ul>' +
'<li>Highlighting anything that you found valuable during a particular workshop or speaker event</li>' +
'<li>Discussing a topic or problem solving strategy that you learned during a particular CSIP or Competitive Programming session with examples from the meeting</li>' + 
'<li>Pointing out difficult concepts or misconceptions you encountered during a workshop</li>' + 
'<li>Making connections between something that you learned during a workshop and either something you encountered in class, or during a personal project</li>' +
'<li>Evaluating your strengths and weaknesses from participating in a programming competition, and brainstorming ways you can improve your skillset</li>' + '</ul>' +
"<br>* Please email <a href='mailto:hello@ugahacks.com'>hello@ugahacks.com</a> for any additional questions relating to UGAHacks Experiential Learning credit!</p>"
} // showELInfo

function hideELInfo() {
  document.querySelector("#elInfo").innerHTML = "<b>About UGAHacks Experiential Learning</b> [<a href='javascript:showELInfo();'>show</a>]";
} // hideELInfo

function addReflectionNotifications(notification, attendance) {
  for (i = 0; i < attendance.length; i++) {
    if (attendance[i].elAvailable && attendance[i].elReflection.length == 0) {
      notification.innerHTML += "<p><u>EL Reflection</u> - It looks like you have not filled out a reflection from <i>" + attendance[i].month + "-" + attendance[i].day + "-" + attendance[i].year + "</i> yet. If you would like for your attendance to count towards UGAHacks Experiential Learning, please fill out your reflection <a href='" + attendance[i].elLink + "'>here</a>.</p>"
    } // if
  } // for
} // addReflectionNotifications

// parsing the login auth
function decodeJwtResponse(data) {
  var tokens = data.split(".");
  return JSON.parse(atob(tokens[1]));
} // decodeJwtResponse

function httpGetAsync(theUrl, callback)
{
var xmlHttp = new XMLHttpRequest();
xmlHttp.onreadystatechange = function() { 
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        callback(xmlHttp.responseText);
}
xmlHttp.open("GET", theUrl, true); // true for asynchronous 
xmlHttp.send(null);
} // httpGetAsync

function httpGetSync(theUrl, callback)
{
var xmlHttp = new XMLHttpRequest();
xmlHttp.onreadystatechange = function() { 
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        callback(xmlHttp.responseText);
}
xmlHttp.open("GET", theUrl, false); // true for asynchronous 
xmlHttp.send(null);
} // httpGetAsync
