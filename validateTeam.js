const { getOctokit, context } = require("@actions/github");

const octokit = getOctokit(process.env.GITHUB_TOKEN);

const validate = async () => {
  const teamName = process.env.TEAM_NAME;
  const { data } = await octokit.rest.teams.listMembersInOrg({
    org: "redislabsdev",
    team_slug: "cloud-ui-approvers",
  });

  console.log(`Checking team permission for ${context.sender.login}`);

  console.log(
    `Team members of ${teamName} are: ${data.map((user) => user.login)}`
  );

  const isUserIncludedInTeam = data.some(
    (user) => user.login === context.sender.login
  );

  if (!isUserIncludedInTeam) {
    throw new Error(
      `Github user: ${context.sender.login} is not part of ${teamName} and cannot run this workflow`
    );
  }
};

validate();
