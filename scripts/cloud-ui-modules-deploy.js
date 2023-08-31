const { spawnSync } = require("child_process");

const { CHANGED_FILES } = process.env;
const AWS_S3_PROD_BUCKET = "s3://cloud-ui-modules-prod";

const spawnSync = (command, args) => {
  const ret = spawn(command, args, {
    stdio: "inherit",
    shell: true,
  });
  if (ret.error) {
    throw ret.error;
  } else if (ret.status !== 0) {
    process.exit(ret.status);
  }
};
console.log(CHANGED_FILES);

const pathSegments = CHANGED_FILES.split(",");

const deployResults = pathSegments.map((path) => {
  const parts = path.split("/");
  const moduleName = parts[parts.length - 1].replace(".json", "");

  let env = "";
  if (path.includes("sm-prod")) {
    env = "prod";
  } else if (path.includes("sm-staging")) {
    env = "staging";
  }

  const version = require(`../${path}`).version;

  console.log(`Deploying ${moduleName}-${version} to ${env}`);
  const childProcess = spawnSync(
    "aws",
    `s3 sync ${AWS_S3_PROD_BUCKET}/builds/modules/${moduleName}/${version} ${AWS_S3_PROD_BUCKET}/${env}/modules/${moduleName}`.split(
      " "
    ),
    {
      stdio: "inherit",
      shell: true,
    }
  );

  if (!childProcess.error) {
    console.log(`✅ Successfully deployed ${moduleName}-${version} to ${env}`);
  } else {
    console.log(`❌ Failed to deploy ${moduleName}-${version} to ${env}`);
  }

  return {
    moduleName,
    env,
    version,
    error: childProcess.error,
  };
});

console.log(deployResults);

const hasFailedDeployments = deployResults.some((result) => result.error);

if (hasFailedDeployments) {
  console.log("❌ Failed to deploy some modules");
  // throw new Error();
}
