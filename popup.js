function renderContent(content) {
  document.getElementById('content').innerHTML = content;
}

async function getData() {
  let tag = document.getElementById('employeeId').value;
  let url = 'https://portaladmin.orientsoftware.net/api/EmployeeTimeSheet/get?FromDate=2019-09-02&ToDate=2019-09-06&EmployeeID=00004';
  let result = await fetch(url);
  console.log(result);
  let jsonResult = await result.json();
  let jsonObject = JSON.parse(jsonResult);
  return jsonObject;
}

document.getElementById('getTime').addEventListener('click', async () => {
  var data = await getData();
  console.log(data);
});