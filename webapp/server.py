import os
import sys
import json
import subprocess
import random
import configparser

from flask import Flask
from flask import render_template
from flask import jsonify
from flask import request
from subprocess import PIPE

####################################
# Configuration
####################################

eosio_config = configparser.ConfigParser()
eosio_config.read('eosio-config.ini') # Read config file

####################################
# Functions
####################################

def cleos(args):
    if isinstance(args, list):
        command = ['cleos']
        command.extend(args)
        command = ' '.join(command)
    else:
        command = 'cleos ' + args

    results = subprocess.run(command, stdin=PIPE, stdout=PIPE, stderr=PIPE, shell=True, check=False)
    return results

# The Web Application Server
app = Flask(__name__)

####################################
# The route index
####################################

@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')

####################################
# RESTful API functions
####################################

@app.route('/api/getinfo', methods=['GET'])
def get_info():
    result = cleos(['get', 'info'])
    rstmsg = result.stderr.decode('ascii')
    if not rstmsg.startswith('Fail'):
        return result.stdout
    else:
        return 'nodeos connection failed', 500

@app.route('/api/unlock_wallet', methods=['POST'])
def unlock_wallet():
    cleos(['wallet', 'unlock', '--password', eosio_config['DEFAULT']['WALLET_PASSWORD']])
    return '{}'


@app.route('/api/candidates', methods=['GET'])
def get_candidates():
    result = cleos(['get', 'table', 'election', 'election', 'candidate'])
    result = json.loads(result.stdout)
    return jsonify(result['rows'])

@app.route('/api/create_account', methods=['POST'])
def create_account():
    account = ''
    while True:
        num = random.randint(1, 1000000000000) # EOSIO account name within 12 chars
        num = str(num).zfill(12) # pad the zero to the number at left-side
        account = ''
        # Convert the number to alphabet
        for c in num:
            ascii = ord(c) - 48 + 97
            account += chr(ascii)
        # Is the account exists?    
        result = cleos(['get', 'account', account])
        if result.returncode == 1: # Exit the loop if the account not found
            break
    # Create the account    
    result = cleos(['create', 'account', 'eosio', account, eosio_config['DEFAULT']['PUBLIC_OWNER_KEY'], eosio_config['DEFAULT']['PUBLIC_ACTIVE_KEY']])
    if result.returncode == 0:
        return jsonify({'account': account})
    else:
        return 'Can\'t create EOSIO user!', 500

@app.route('/api/vote_candidate', methods=['POST'])
def vote_candidate():
    account = request.form.get('account')
    candidate = request.form.get('candidate')
    param = '\'["' + account + '", ' + candidate + ']\''
    result = cleos(['push', 'action', 'election', 'vote', param, '-p', account])
    print(result.stderr)
    if result.returncode == 0:
        return '{}'
    else:
        return result.stderr, 500
