/**
 * This module declears the Application object 'App'
 */

'use strict'

function App() {
  this._progName = "Election WebApp v1.0";
  this._account = null; // will store the EOSIO account created
}

App.prototype.alertMessage = function(title, msg) {
  $('#alert_dialog #title').html(title);
  $('#alert_dialog #msg').html(msg);
  $('#alert_dialog').modal('show');
}

App.prototype.version = function() {
  console.log(this._progName);
}

// Call server.js /api/getinfo to get server info
App.prototype.getInfo = function() {
  return $.ajax({
    type: 'GET',
    dataType: 'json',
    url: '/api/getinfo'
  });
}

// Call server.js /api/unlock_wallet to unlock default wallet
App.prototype.unlockWallet = function() {
  return $.ajax({
    type: 'POST',
    dataType: 'json',
    url: '/api/unlock_wallet'
  });
}

// Call server.js /api/candidates to get candidates
App.prototype.getCandidates = function() {
  return $.ajax({
    type: 'GET',
    dataType: 'json',
    url: '/api/candidates'
  });
}

App.prototype.createAccountByName = function(name) {
  console.assert(name != null);
  return $.ajax({
    type: 'POST',
    data: {
      name: name
    },
    dataType: 'json',
    url: '/api/create_account'
  });
}

App.prototype.voteCandidate = function(account, candidate) {
  return $.ajax({
    type: 'POST',
    data: {
      account: account,
      candidate: candidate
    },
    dataType: 'json',
    url: '/api/vote_candidate'
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

App.prototype.onBtnInputNameClicked = function(evt) {
  var self = this;
  evt.preventDefault();
  if (!$('#input_portion .form').form('is valid')) {
    $('#input_portion input[name="name"]').focus();
    this.alertMessage('Error', 'Please input your name!');
    return;
  }
  var name = $('#input_portion input[name="name"]').val();
  name = name.trim();
  if (name.length > 0) {
    this.createAccountByName(name).done(function(resp) {
      console.info('EOSIO account created successfully');
      console.log(resp);
      self._account = resp.account;
      $('#input_portion #btn_inputname_submit').prop('disabled', true);
      $('#voting_portion').transition('swing down');
    })
  }
}

App.prototype.onBtnVoteSubmitClicked = function(evt) {
  var self = this;
  evt.preventDefault();
  if (!$('#voting_portion .form').form('is valid')) {
    this.alertMessage('Error', 'Please select a candidate!')
    return;
  }
  var val = $('#candidates_cb').dropdown('get value')
  this.voteCandidate(this._account, val).done(function(resp) {
    console.info('Vote AJAX call result');
    console.log(resp);
    $('#voting_portion #btn_vote_submit').prop('disabled', true);
    self.alertMessage('Congratulation', 'You\'re voted successfully');
    $('#voted_portion').transition('swing down');
    self.showVotedResult();
  }).fail(function(xhr, error, msg) {
    debugger;
  });
}

App.prototype.onBtnShowVotingResult = function(evt) {
  // Hide the #hints_portion
  $('#hints_portion').transition({
    animation: 'fade down',
    duration: '0.5s',
    onComplete : function() {
      $('#hints_portion').html('');
    }
  });
  // Show/hide the #voted_portion #cards
  $('#voted_portion #cards').transition('swing down');
}

App.prototype.showVotedResult = function() {
  var self = this;
  this.getCandidates().done(function(resp) {
    // Get the markup content
    var template = $('#voted_result_card').html();

    // Use lodash's template compiler
    var compiler = _.template(template);
    var markup = '';
    for (var i = 0; i < resp.length; ++i) {
      var c = resp[i];
      // Interpolate the values using template function
      markup += compiler({
        name: c._name,
        count: c._count
      });
    }
    $('#voted_portion #cards').html(markup);
    $('#btn_show_voting_result').click(self.onBtnShowVotingResult);
  });
}

App.prototype.start = function() {
  var self = this;
  self.getInfo().then(function() {
    return self.unlockWallet();
  }).done(function() {
    $('#input_portion').transition('swing down');

    self.renderCandidatesCb();

    // Form validation rules
    $('#input_portion .form').form({
      fields: {
        name: 'empty'
      }
    });
    $('#voting_portion .form').form({
      fields: {
        candidate: 'empty'
      }
    });

    // Activate SemanticUI controls
    $('.ui.dropdown').dropdown();

    // Define event handlers
    $('#btn_inputname_submit').click(self.onBtnInputNameClicked.bind(self));
    $('#btn_vote_submit').click(self.onBtnVoteSubmitClicked.bind(self));
  }).fail(function() {
    $('#status_portion').transition('scale')
    $('#input_portion')
  });
}