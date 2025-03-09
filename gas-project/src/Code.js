// スプレッドシートのIDを設定
const SPREADSHEET_ID = 'setupSpreadsheet()で表示されたIDをここに貼り付け';
const SHEET_NAME = 'Sheet1';
const CELL_RANGE = 'A1';

// APIアクセス用のシークレットキー
const API_SECRET = 'linefreak-2024-secret';  // セキュリティのため、この値は本番環境では変更してください

// 残り席数を取得するAPI
function doGet(e) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    const remainingSeats = sheet.getRange(CELL_RANGE).getValue();
    
    return ContentService.createTextOutput(JSON.stringify({
      remainingSeats: remainingSeats,
      totalSeats: 12,
      lastUpdated: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// 残り席数を更新するAPI
function doPost(e) {
  try {
    // パラメータのバリデーション
    const params = JSON.parse(e.postData.contents);
    if (!params.secret || params.secret !== API_SECRET) {
      throw new Error('認証に失敗しました');
    }
    
    if (typeof params.remainingSeats !== 'number' || 
        params.remainingSeats < 0 || 
        params.remainingSeats > 12) {
      throw new Error('不正な席数です');
    }

    // スプレッドシートの更新
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    sheet.getRange(CELL_RANGE).setValue(params.remainingSeats);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      remainingSeats: params.remainingSeats,
      lastUpdated: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// 初期設定用の関数
function setupSpreadsheet() {
  const spreadsheet = SpreadsheetApp.create('講座残り席数管理');
  const sheet = spreadsheet.getSheetByName('Sheet1');
  
  // 初期データの設定
  sheet.getRange('A1').setValue(12);
  
  // スプレッドシートのIDをログに出力
  Logger.log('スプレッドシートID: ' + spreadsheet.getId());
  
  // 共有設定を変更
  spreadsheet.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  
  return spreadsheet.getId();
} 