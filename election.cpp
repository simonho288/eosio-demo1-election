#include <eosiolib/eosio.hpp>

using namespace eosio;

class election : public contract
{
private:
  // create the multi index tables to store the data

  /// @abi table
  struct candidate {
    uint64_t _key;       // primary key
    std::string _name;   // candidate name
    uint32_t _count = 0; // voted count

    uint64_t primary_key() const { return _key; }
  };
  typedef eosio::multi_index<N(candidate), candidate> candidates;

  /// @abi table
  struct voter {
    uint64_t _key;
    uint64_t _candidate_key; // name of poll
    account_name _account;   // this account has voted, avoid duplicate voter

    uint64_t primary_key() const { return _key; }
    uint64_t candidate_key() const { return _candidate_key; }
  };
  typedef eosio::multi_index<N(voter), voter, indexed_by<N(_candidate_key), const_mem_fun<voter, uint64_t, &voter::candidate_key>>> voters;

  // local instances of the multi indexes
  candidates _candidates;
  voters _voters;
  uint64_t _candidates_count;

public:
  election(account_name s) : contract(s), _candidates(s, s), _voters(s, s), _candidates_count(0) {}

  // public methods exposed via the ABI
  // on candidates

  /// @abi action
  void version() {
    print("Election Smart Contract version 0.0.1\n");
  };

  /// @abi action
  void addc(std::string name) {
    print("Adding candidate ", name, "\n");

    uint64_t key = _candidates.available_primary_key();

    // update the table to include a new candidate
    _candidates.emplace(get_self(), [&](auto &p) {
      p._key = key;
      p._name = name;
      p._count = 0;
    });

    print("Candidate added successfully. candidate_key = ", key, "\n");
  };

  /// @abi action
  void reset() {
    // Get all keys of _candidates
    std::vector<uint64_t> keysForDeletion;
    for (auto &itr : _candidates) {
      keysForDeletion.push_back(itr.primary_key());
    }

    // now delete each item for that poll
    for (uint64_t key : keysForDeletion) {
      auto itr = _candidates.find(key);
      if (itr != _candidates.end()) {
        _candidates.erase(itr);
      }
    }

    // Get all keys of _voters
    keysForDeletion.empty();
    for (auto &itr : _voters) {
      keysForDeletion.push_back(itr.primary_key());
    }

    // now delete each item for that poll
    for (uint64_t key : keysForDeletion) {
      auto itr = _voters.find(key);
      if (itr != _voters.end()) {
        _voters.erase(itr);
      }
    }

    print("candidates and voters reset successfully.\n");
  };

  /// @abi action
  void results() {
    print("Start listing voted results\n");
    for (auto& item : _candidates) {
      print("Candidate ", item._name, " has voted count: ", item._count, "\n");
    }
  };

  /// @abi action
  void vote(account_name s, uint64_t candidate_key) {
    require_auth(s);

    bool found = false;

    // Did the voter vote before?
    for (auto& item : _voters) {
      if (item._account == s) {
        found = true;
        break;
      }
    }
    eosio_assert(!found, "You're voted already!");

    // Findout the candidate by id
    std::vector<uint64_t> keysForModify;
    for (auto& item : _candidates) {
      if (item.primary_key() == candidate_key) {
        keysForModify.push_back(item.primary_key());
        break;
      }
    }

    if (keysForModify.size() == 0) {
      eosio_assert(found, "Invlidate candidate id!");
      return;
    }

    // Update the voted count inside the candidate
    for (uint64_t key : keysForModify) {
      auto itr = _candidates.find(key);
      auto candidate = _candidates.get(key);
      if (itr != _candidates.end()) {
        _candidates.modify(itr, get_self(), [&](auto& p) {
          p._count++;
        });

        print("Voted candidate: ", candidate._name, " successfully\n");
      }
    }

    // Add this user to voters array
    _voters.emplace(get_self(), [&](auto& p) {
      p._key = _voters.available_primary_key();
      p._candidate_key = candidate_key;
      p._account = s;
    });
  };
};

EOSIO_ABI(election, (version)(reset)(addc)(results)(vote))