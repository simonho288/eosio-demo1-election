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

App.prototype.getCandidates = function() {
  return $.ajax({
    type: 'GET',
    dataType: 'json',
    url: '/api/candidates'
  });
}

App.prototype.renderCandidatesCb = function() {
  this.getCandidates().done(function(resp) {
    console.log(resp)
    var markup = '';
    for (var i = 0; i < resp.length; ++i) {
      var c = resp[i];
      markup += '<div class="item" data-value="' + c._key + '">' + c._name + '</div>';
    }
    $('#candidates_cb .menu').html(markup);
  })
}

App.prototype.start = function() {
  $('.ui.dropdown').dropdown();
  this.renderCandidatesCb();
}