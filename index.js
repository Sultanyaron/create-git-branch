#! /usr/bin/env node

const { exec } = require("child_process");
const inquirer = require("inquirer");

const init = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "prefix",
        message: "Choose branch prefix",
        choices: [
          { name: "feat", value: "feat" },
          { name: "fix", value: "fix" },
          { name: "hotfix", value: "hotfix" },
          { name: "revert", value: "revert" },
          { name: "chore", value: "chore" },
          { name: "refactor", value: "refactor" },
          { name: "test", value: "test" },
          { name: "release", value: "release" },
        ],
      },
      {
        type: "input",
        name: "jiraNumber",
        message: "Jira ticket number (without the `RED-`)",
        validate(input) {
          if (!/^\d+$/.test(input)) {
            return "Jira ticket number must contain numbers only";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "description",
        message: "Branch description (up to 6 words)",
        validate(input) {
          if (input.trim().split(/\s+/).length > 6) {
            return "Description can contain up to 6 words";
          }

          if (/[^a-zA-Z0-9 ]/g.test(input)) {
            return "Description should not contain special characters";
          }
          return true;
        },
      },
    ])
    .then((answers) => {
      const jiraTicket = `RED-${answers.jiraNumber.trim()}`;
      const description = answers.description
        .trim()
        .toLowerCase()
        .split(" ")
        .join("-");

      const branchName = `${answers.prefix}/${jiraTicket}-${description}`;
      inquirer
        .prompt([
          {
            type: "confirm",
            name: `isBranchNameConfirmed`,
            message: `Confirm branch name: ${branchName}`,
            default: true,
          },
        ])
        .then(({ isBranchNameConfirmed }) => {
          if (isBranchNameConfirmed) {
            exec(`git checkout -b ${branchName}`, (error, stdout, stderr) => {
              if (error) {
                console.log(error.message);
                return;
              }
              if (stderr) {
                console.log(stderr);
                return;
              }
            });
          } else {
            init();
          }
        });
    });
};

init();
