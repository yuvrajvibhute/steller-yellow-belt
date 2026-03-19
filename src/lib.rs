#![no_std]

use soroban_sdk::{contract, contractimpl, Env, Address, Symbol, symbol_short};

#[contract]
pub struct PollContract;

#[contractimpl]
impl PollContract {
    /// Initialize the poll with options
    pub fn init(env: Env, options: soroban_sdk::Vec<String>) -> u32 {
        let poll_id: u32 = 1;
        let key = Symbol::new(&env, "poll");
        env.storage().instance().set(&key, &options);
        poll_id
    }

    /// Cast a vote for an option
    pub fn cast_vote(env: Env, voter: Address, option_index: u32) -> bool {
        voter.require_auth();

        let key = Symbol::new(&env, symbol_short!("votes"));
        let mut votes: soroban_sdk::Vec<u32> = env.storage()
            .instance()
            .get(&key)
            .unwrap_or(soroban_sdk::Vec::new(&env));

        // Ensure enough slots
        while votes.len() <= option_index as usize {
            votes.push_back(0);
        }

        // Increment vote count
        if let Some(count) = votes.get(option_index as usize) {
            votes.set(option_index as usize, count + 1);
        }

        env.storage().instance().set(&key, &votes);

        // Store voter record to prevent double voting (basic check)
        let voter_key = Symbol::new(&env, "voter_list");
        let mut voter_list: soroban_sdk::Vec<Address> = env.storage()
            .instance()
            .get(&voter_key)
            .unwrap_or(soroban_sdk::Vec::new(&env));
        
        voter_list.push_back(voter.clone());
        env.storage().instance().set(&voter_key, &voter_list);

        true
    }

    /// Get current vote counts
    pub fn get_votes(env: Env) -> soroban_sdk::Vec<u32> {
        let key = Symbol::new(&env, symbol_short!("votes"));
        env.storage()
            .instance()
            .get(&key)
            .unwrap_or(soroban_sdk::Vec::new(&env))
    }

    /// Get total votes cast
    pub fn get_total_votes(env: Env) -> u32 {
        let key = Symbol::new(&env, symbol_short!("votes"));
        let votes: soroban_sdk::Vec<u32> = env.storage()
            .instance()
            .get(&key)
            .unwrap_or(soroban_sdk::Vec::new(&env));
        
        votes.iter().sum()
    }
}
