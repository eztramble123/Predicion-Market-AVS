import { ethers } from "ethers";
import * as dotenv from "dotenv";
const fs = require('fs');
const path = require('path');
dotenv.config();

// Setup environment variables
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
/// TODO: Hack
let chainId = 31337;

const avsDeploymentData = JSON.parse(fs.readFileSync(path.resolve(__dirname, `../contracts/deployments/hello-world/${chainId}.json`), 'utf8'));
const helloWorldServiceManagerAddress = avsDeploymentData.addresses.helloWorldServiceManager;
const helloWorldServiceManagerABI = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../abis/HelloWorldServiceManager.json'), 'utf8'));

// Initialize contract objects from ABIs
const helloWorldServiceManager = new ethers.Contract(helloWorldServiceManagerAddress, helloWorldServiceManagerABI, wallet);

// Predefined list of basketball teams
const basketballTeams = [
    "Los Angeles Lakers",
    "Boston Celtics",
    "Chicago Bulls",
    "Golden State Warriors",
    "Miami Heat",
    "Toronto Raptors",
    "San Antonio Spurs",
    "Houston Rockets",
    "Philadelphia 76ers",
    "Brooklyn Nets",
    "Dallas Mavericks",
    "Denver Nuggets",
    "Phoenix Suns",
    "Milwaukee Bucks",
    "New York Knicks",
    "Utah Jazz",
    "Orlando Magic",
    "Indiana Pacers",
    "Detroit Pistons",
    "Portland Trail Blazers"
];

// Predefined list of football teams
const footballTeams = [
    "New England Patriots",
    "Dallas Cowboys",
    "Green Bay Packers",
    "Pittsburgh Steelers",
    "San Francisco 49ers",
    "Chicago Bears",
    "Miami Dolphins",
    "Seattle Seahawks",
    "Denver Broncos",
    "New York Giants",
    "Los Angeles Rams",
    "Kansas City Chiefs",
    "New York Jets",
    "Buffalo Bills",
    "Baltimore Ravens",
    "Indianapolis Colts",
    "Tampa Bay Buccaneers",
    "Arizona Cardinals",
    "Cleveland Browns",
    "Tennessee Titans"
];

// Predefined list of presidential candidates
const presidentialCandidates = [
    "Candidate A",
    "Candidate B",
    "Candidate C",
    "Candidate D",
    "Candidate E",
    "Candidate F",
    "Candidate G",
    "Candidate H",
    "Candidate I",
    "Candidate J",
    "Candidate K",
    "Candidate L",
    "Candidate M",
    "Candidate N",
    "Candidate O",
    "Candidate P",
    "Candidate Q",
    "Candidate R",
    "Candidate S",
    "Candidate T"
];

// Enum to represent different task types
enum TaskType {
    Basketball = "Basketball",
    Football = "Football",
    Presidential = "Presidential"
}

// Function to generate a random integer between min and max (inclusive)
function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to select a random team from a given array
function selectRandomTeam(teams: string[]): string {
    return teams[getRandomInt(0, teams.length - 1)];
}

// Function to generate a random matchup based on task type
function generateRandomMatchup(): string {
    // Randomly select a task type
    const taskTypes = Object.values(TaskType);
    const selectedTaskType = taskTypes[getRandomInt(0, taskTypes.length - 1)];

    let matchup = "";

    switch (selectedTaskType) {
        case TaskType.Basketball:
            matchup = generateTeamMatchup(basketballTeams, "Basketball");
            break;
        case TaskType.Football:
            matchup = generateTeamMatchup(footballTeams, "Football");
            break;
        case TaskType.Presidential:
            matchup = generateCandidateMatchup();
            break;
        default:
            matchup = "Undefined Task Type";
    }

    return matchup;
}

// Function to generate a team matchup
function generateTeamMatchup(teams: string[], sport: string): string {
    let team1 = selectRandomTeam(teams);
    let team2 = selectRandomTeam(teams);

    // Ensure both teams are not the same
    while (team2 === team1) {
        team2 = selectRandomTeam(teams);
    }

    return `${sport}: ${team1} vs ${team2}`;
}

// Function to generate a presidential candidate matchup
function generateCandidateMatchup(): string {
    let candidate1 = selectRandomTeam(presidentialCandidates);
    let candidate2 = selectRandomTeam(presidentialCandidates);

    // Ensure both candidates are not the same
    while (candidate2 === candidate1) {
        candidate2 = selectRandomTeam(presidentialCandidates);
    }

    return `Presidential: ${candidate1} vs ${candidate2}`;
}

// Function to create a new task
async function createNewTask(taskName: string) {
    try {
        // Send a transaction to the createNewTask function
        const tx = await helloWorldServiceManager.createNewTask(taskName);
        
        // Wait for the transaction to be mined
        const receipt = await tx.wait();
        
        console.log(`Transaction successful with hash: ${receipt.hash}`);
    } catch (error) {
        console.error('Error sending transaction:', error);
    }
}

// Function to create a new task with a random matchup every 24 seconds
function startCreatingTasks() {
    setInterval(() => {
        const randomMatchup = generateRandomMatchup();
        console.log(`Creating new task with matchup: ${randomMatchup}`);
        createNewTask(randomMatchup);
    }, 24000);
}

// Start the process
startCreatingTasks();