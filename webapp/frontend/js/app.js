/**
 * This module declears the Application object 'App'
 */

'use strict'

function App() {
  this._progName = "Election WebApp v1.0";
}

App.prototype.version = function() {
  console.log(this._progName);
}
