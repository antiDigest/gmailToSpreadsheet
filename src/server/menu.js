global.showHelp = () => {
  Browser.msgBox('Develop Google Apps Script project locally inside VS Code');
};

global.showCredits = () => {
  SpreadsheetApp.getActiveSpreadsheet().toast(
    'Developed by AntiDigest @AntiDigest'
  );
};

global.onOpen = () => {
  try {
    SpreadsheetApp.getUi()
      .createMenu('Apps Script Starter')
      .addItem('Help', 'showHelp')
      .addSeparator()
      .addItem('Credits', 'showCredits')
      .addToUi();
  } catch (f) {
    console.error(f);
  }
};
