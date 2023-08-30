

// import { spawnSync as spawn } from "child_process";

const { CHANGED_FILES } = env

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
