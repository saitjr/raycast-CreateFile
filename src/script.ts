import { exec } from "child_process";

// eslint-disable-next-line require-jsdoc
export async function execCmd(cmd: string): Promise<string> {
  return new Promise((res, rej) => {
    exec(cmd, (error, stdout, _0) => {
      if (error) {
        rej(error.message);
        return;
      }
      res(stdout);
    });
  });
}
