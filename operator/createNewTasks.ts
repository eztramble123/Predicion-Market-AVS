import { ethers } from "ethers";
import * as dotenv from "dotenv";
import fs from 'fs';
import path from 'path';
dotenv.config();

// Setup environment variables
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
// TODO: Hack
let chainId = 31337;

const avsDeploymentData = JSON.parse(fs.readFileSync(path.resolve(__dirname, `../contracts/deployments/hello-world/${chainId}.json`), 'utf8'));
const helloWorldServiceManagerAddress = avsDeploymentData.addresses.helloWorldServiceManager;
const helloWorldServiceManagerABI = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../abis/HelloWorldServiceManager.json'), 'utf8'));

// Initialize contract objects from ABIs
const helloWorldServiceManager = new ethers.Contract(helloWorldServiceManagerAddress, helloWorldServiceManagerABI, wallet);

// Predefined list of basketball teams (sequentially)
const basketballTeams = [
    "Los Angeles Lakers",
    "Boston Celtics",
    // Add more teams as needed
];

// Predefined list of football teams (sequentially)
const footballTeams = [
    "New England Patriots",
    // Add more teams as needed
];

// Predefined list of presidential candidates (sequentially)
const presidentialCandidates = [
    "Candidate A",
    "Candidate B",
    // Add more candidates as needed
];

// Enum to represent different task types
enum TaskType {
    Basketball = "Basketball",
    Football = "Football",
    Presidential = "Presidential"
}

// Sequential indices for each TaskType
let basketballIndex = 0;
let footballIndex = 0;
let presidentialIndex = 0;

// Function to generate a sequential matchup based on task type
export function generateSequentialMatchup(): string {
    // Define the order of TaskTypes
    const taskTypes = Object.values(TaskType);
    
    // Cycle through TaskTypes based on a simple index
    // Here, we assume a fixed order: Basketball -> Football -> Presidential
    const selectedTaskType = taskTypes[(basketballIndex + footballIndex + presidentialIndex) % taskTypes.length];

    let matchup = "";

    switch (selectedTaskType) {
        case TaskType.Basketball:
            matchup = generateSequentialTeamMatchup(basketballTeams, "Basketball");
            break;
        case TaskType.Football:
            matchup = generateSequentialTeamMatchup(footballTeams, "Football");
            break;
        case TaskType.Presidential:
            matchup = generateSequentialCandidateMatchup();
            break;
        default:
            matchup = "Undefined Task Type";
    }

    return matchup;
}

// Function to generate a sequential team matchup
function generateSequentialTeamMatchup(teams: string[], sport: string): string {
    const team1 = teams[Math.floor(basketballIndex / 2) % teams.length];
    const team2 = teams[(Math.floor(basketballIndex / 2) + 1) % teams.length];

    // Increment the index for the next call
    if (sport === "Basketball") {
        basketballIndex += 2;
    } else if (sport === "Football") {
        footballIndex += 2;
    }

    return `${sport}: ${team1} vs ${team2}`;
}

// Function to generate a sequential presidential candidate matchup
function generateSequentialCandidateMatchup(): string {
    const candidate1 = presidentialCandidates[Math.floor(presidentialIndex / 2) % presidentialCandidates.length];
    const candidate2 = presidentialCandidates[(Math.floor(presidentialIndex / 2) + 1) % presidentialCandidates.length];

    // Increment the index for the next call
    presidentialIndex += 2;

    return `Presidential: ${candidate1} vs ${candidate2}`;
}

// Function to create a new task
export async function createNewTask(taskName?: string) {
    try {
        const finalTaskName = taskName || generateSequentialMatchup();

        // Send a transaction to the createNewTask function
        const tx = await helloWorldServiceManager.createNewTask(finalTaskName);
        
        // Wait for the transaction to be mined
        const receipt = await tx.wait();
        
        console.log(`Transaction successful with hash: ${receipt.hash}`);
    } catch (error) {
        console.error('Error sending transaction:', error);
        throw error;
    }
}

// Function to create a new task with a sequential matchup every 24 seconds
function startCreatingTasks() {
    setInterval(() => {
        const matchup = generateSequentialMatchup();
        console.log(`Creating new task with matchup: ${matchup}`);
        createNewTask(matchup);
    }, 24000);
}

// Start the process
startCreatingTasks();