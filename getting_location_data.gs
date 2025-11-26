function geocoder(cell) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var address_sheet = spreadsheet.getSheets()[0];

  var output_sheet = spreadsheet.getSheets()[1];
  var max_row = address_sheet.getMaxRows();
  var LastRow = address_sheet.getRange(max_row,1).getNextDataCell(SpreadsheetApp.Direction.UP).getRowIndex();
  for (let i=1; i<LastRow;i++){
    var index_num = 'address' + String(i);
    address_sheet.getRange(i+1, 2).setValue('address'+String(i));
    output_sheet.getRange(i+1, 1).setValue('address'+String(i));

    var address = address_sheet.getRange(i+1, 1).getValue();
    address = String(address).replace(",", "");
    
    try{
      const response = Maps.newGeocoder().geocode(address)
      var lat = response['results'][0]['geometry']['location']['lat'];
      var long = response['results'][0]['geometry']['location']['lng'];
      output_sheet.getRange(i+1, 2).setValue(lat);
      output_sheet.getRange(i+1, 3).setValue(long);
      // const response = Maps.newGeocoder().geocode(cell)
      // if(response['results'][0] != null){
      //   return response['results'][0]['geometry']['location']['lat']+","+response['results'][0]['geometry']['location']['lng'];
      // }
    }catch(e){
      //return e.message;
      output_sheet.getRange(i+1, 2).setValue(e.message);
      output_sheet.getRange(i+1, 3).setValue(e.message);

      }
  }

  Browser.msgBox("Acquisition complete");
}


function convertcsv2(folder){
  const ui = SpreadsheetApp.getUi();
  const title = "Enter Company Name";
  const prompt = "e.g., XXX";
  const response = ui.prompt(title,prompt,ui.ButtonSet.OK_CANCEL);

  /*Get information from the input box here*/
  const company_name = response.getResponseText();


  var today = new Date();
  var filename = Utilities.formatDate(today, "Asia/Tokyo", "yyyyMMdd") + "_" + company_name + "_alldata" + ".csv";// Specify file name
  var contentType = "text/csv";// Specify output format
  var charSet = "Shift_JIS";// Specify character encoding
  var lineDelimiter = ",";
  var newLineChar = "\r\n";


  var output_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[1];
  // Get data from the CSV sheet
  var sheetID= SpreadsheetApp.getActiveSpreadsheet().getId();
  Logger.log(sheetID)
  var range = SpreadsheetApp.getActiveSpreadsheet().getDataRange();
  var values = range.getValues();
  var header = values.shift();
  var filtered_values = values.filter(data => (data[1] > 0) & (data[2] > 0));
  filtered_values.unshift(header);

  // Convert the 2D array data to a CSV string
  var _ = Underscore.load();
  var csvString = _.map(
    filtered_values,
    function(row){return row.join(lineDelimiter);}
  ).join(newLineChar);

  // Convert to a Shift_JIS Blob
  var blob = Utilities.newBlob("", contentType, filename).setDataFromString(csvString, charSet);

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ssId = ss.getId(); // Get Spreadsheet ID

  // 
  var parentFolder = DriveApp.getFileById(ssId).getParents(); // Get the spreadsheet file by ID -> Get the parent folder
  var folderId = parentFolder.next().getId(); // Get the parent folder ID
  var folder = DriveApp.getFolderById(folderId);
  // Output the Blob to a file
  folder.createFile(blob);


  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var address_sheet = spreadsheet.getSheets()[0];
  var max_row = address_sheet.getMaxRows();
  var LastRow = address_sheet.getRange(max_row,1).getNextDataCell(SpreadsheetApp.Direction.UP).getRowIndex();
  var cnt_output_sheet = Math.floor(LastRow / 50);

  for(let j=0; j<=cnt_output_sheet;j++){
    var dataArray = output_sheet.getRange(2+(50*j), 1, 50, 3).getValues();
    dataArray.unshift(header);

    filename = Utilities.formatDate(today, "Asia/Tokyo", "yyyyMMdd") + "_" + company_name + "_" + String(j+1) + ".csv";// Specify file name
    // Convert the 2D array data to a CSV string
    var _ = Underscore.load();
    var csvString = _.map(
      dataArray,
      function(row){return row.join(lineDelimiter);}
    ).join(newLineChar);

    // Convert to a Shift_JIS Blob
    var blob = Utilities.newBlob("", contentType, filename).setDataFromString(csvString, charSet);

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var ssId = ss.getId(); // Get Spreadsheet ID

    // 
    var parentFolder = DriveApp.getFileById(ssId).getParents(); // Get the spreadsheet file by ID -> Get the parent folder
    var folderId = parentFolder.next().getId(); // Get the parent folder ID
    var folder = DriveApp.getFolderById(folderId);
    // Output the Blob to a file
    folder.createFile(blob);

  };

  Browser.msgBox("Output complete");
  
}