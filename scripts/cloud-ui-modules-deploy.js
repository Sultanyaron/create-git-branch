

// import { spawnSync as spawn } from "child_process";

const { CHANGED_FILES } = process.env;

// export const spawnSync = (command, args, options = {}, alwaysThrow) => {
//   const ret = spawn(command, args, {
//     stdio: "inherit",
//     shell: true,
//     ...options,
//   });
//   if (ret.error) {
//     throw ret.error;
//   } else if (ret.status !== 0) {
//     if (alwaysThrow) {
//       throw new Error();
//     } else {
//       process.exit(ret.status);
//     }
//   }
// };
console.log(CHANGED_FILES)

const pathSegments = CHANGED_FILES.split(',');

const result = pathSegments.map(path => {
  const parts = path.split('/');
  const moduleName = parts[parts.length - 1].replace('.json', '');
  
  let env = '';
  if (path.includes('sm-prod')) {
    env = 'prod';
  } else if (path.includes('sm-staging')) {
    env = 'staging';
  }
  
  const version = require(`./${path}`).version; // Assuming the version is a key inside the JSON file
  
  return {
    moduleName,
    env,
    version
  };
});

console.log(result);


