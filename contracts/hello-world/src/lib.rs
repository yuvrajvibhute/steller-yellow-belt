#![no_std]
use soroban_sdk::{contract, contractimpl, Env, Address, Vec, Map, Symbol};

#[contract]
pub struct PollContract;

#[contractimpl]
impl PollContract {
    pub fn vote(env: Env, option: u32, voter: Address) {
        voter.require_auth();

        let voted_key = (Symbol::new(&env, "voted"), voter.clone());
        if env.storage().persistent().has(&voted_key) {
            panic!("Already voted");
        }

        let mut results: Vec<u32> =
            env.storage().persistent().get(&Symbol::new(&env, "results"))
            .unwrap_or(Vec::new(&env));

        while results.len() <= option {
            results.push_back(0);
        }

        results.set(option, results.get(option).unwrap() + 1);

        env.storage().persistent().set(&Symbol::new(&env, "results"), &results);
        env.storage().persistent().set(&voted_key, &true);

        env.events().publish(
            (Symbol::new(&env, "poll"), Symbol::new(&env, "vote_cast")),
            (option, results.get(option).unwrap()),
        );
    }

    pub fn get_results(env: Env) -> Vec<u32> {
        env.storage()
            .persistent()
            .get(&Symbol::new(&env, "results"))
            .unwrap_or(Vec::new(&env))
    }
}

