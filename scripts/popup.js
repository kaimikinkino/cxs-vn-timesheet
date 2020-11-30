jQuery(document).ready(function () {
  generateData(false);

  document.getElementById("reLoad").addEventListener("click", async () => {
    generateData(false);
  });

  document.getElementById("lastWeek").addEventListener("click", async () => {
    generateData(true);
  });
});

function getData(isGetLastWeek) {
  let url =
    "https://portaladmin.orientsoftware.net/api/EmployeeTimeSheet/get?" +
    buildTimeParam(isGetLastWeek) +
    "&EmployeeID=00004";

  $.ajax({
    url: url,
    success: function (result) {
      let data = result;
      let tableHtml =
        "<tr><th>Date of week</th><th>In</th><th>Out</th><th>Total</th></tr>";
      let options = {
        weekday: "long",
        year: "numeric",
        month: "numeric",
        day: "numeric",
      };
      let totalTimeOfWeek = 0;
      let name = "";
      let id = "";
      let lastTimeOut = "";
      let lastTimeIn = "";
      let i = 0;
      data.forEach((item) => {
        let workingDate = new Date(item.osdWorkingDate).toLocaleDateString(
          "en-US",
          options
        );
        let timeIn =
          item.osdTimeIn != null
            ? new Date(item.osdTimeIn).toLocaleTimeString(["vi-VN"], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "--";
        let timeOut =
          item.osdTimeOut != null
            ? new Date(item.osdTimeOut).toLocaleTimeString(["vi-VN"], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "--";
        let timeTotal =
          item.osdHoursPerDay == 0
            ? "--"
            : (item.osdHoursPerDay).toFixed(2);
        totalTimeOfWeek += item.osdHoursPerDay;

        tableHtml +=
          "<tr><td>" +
          workingDate +
          "</td><td>" +
          timeIn +
          "</td><td>" +
          timeOut +
          "</td><td>" +
          timeTotal +
          "</td></tr>\n";

        if (name == "" && item.osdFullNameEN != "") {
          name = item.osdFullNameEN;
        }

        if (id == "" && item.osdTimesheetId != "") {
          id = item.osdTimesheetId;
        }

        if (item.osdTimeOut != null) {
          lastTimeOut = new Date(item.osdTimeOut);
        }

        if (item.osdTimeIn != null) {
          lastTimeIn = new Date(item.osdTimeIn);
        }

        if (item.osdHoursPerDay != 0) {
          i++;
        }
      });

      let remainingTimeUntilNow = lastTimeOut != ""
        ? 40 -
        totalTimeOfWeek -
        (new Date().getTime() - lastTimeOut.getTime()) / 1000 / 3600
        : 0;

      let totalTimeOfDay = lastTimeIn != ""
      ? (new Date().getTime() - lastTimeIn.getTime()) / 1000 / 3600 - 1
      : 0;

      console.log(totalTimeOfDay);

      $("#content").append(tableHtml);
      $("#totalTime").html(
        "Total Time: " + timeConvert(totalTimeOfWeek)
      );
      $("#totalTimeOfDay").html(
        "Total Time Until Now: " + timeConvert(totalTimeOfDay)
      );
      $("#remainingTime").html(
        "Remaining Time: " + timeConvert(40 - totalTimeOfWeek)
      );
      $("#nameEmployee").html(name + " - " + id);
      $("#remainingTimeUntilNow").html(
        "Remaining Time Until Now: " + timeConvert(remainingTimeUntilNow)
      );
    },
  });
}

function generateData(isGetLastWeek) {
  $("#content").empty();
  $("#totalTime").empty();
  $("#remainingTime").empty();
  getData(isGetLastWeek);
}

function timeConvert(n) {
  if (n <= 0) {
    return "0 hour and 0 minute.";
  }
  var num = n;
  var hours = num / 1;
  var rhours = Math.floor(hours);
  var minutes = (hours - rhours) * 60;
  var rminutes = Math.round(minutes);
  return rhours + " hour(s) and " + rminutes + " minute(s).";
}

function buildTimeParam(isGetLastWeek) {
  var curr = new Date();
  day = curr.getDay();

  var mulDate = 1;
  if(isGetLastWeek){
    mulDate = 7;
  }

  firstday = new Date(curr.getTime() - 60 * 60 * 24 * day * 1000 * mulDate); // will return firstday (i.e. Sunday) of the week
  lastday = new Date(firstday.getTime() + 60 * 60 * 24 * 6 * 1000); // adding (60*60*6*24*1000) means adding six days to the firstday which results in lastday (Saturday) of the week
  return "FromDate=" + formatDate(firstday) + "&ToDate=" + formatDate(lastday);
}

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}
