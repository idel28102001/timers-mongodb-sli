const { signup, logout, login, statusActive, statusEtc, createOneTimer, stopOneTimer } = require("./scripts/sli");
const argv = require("yargs")
  .usage("Usage: $0 <command> [options]")
  .command("signup", "Sign up on that domen")
  .example("$0 signup", "Sign up a new user")
  .command("login", "Log in you account")
  .example("$0 login", "Log in you account")
  .command("logout", "Logout from your account")
  .example("$0 logout", "Log out from your account")
  .command("status <id>", "Check specified timer")
  .example("$0 status 62294a68b9fb9d3d87aaa83e", "Check specified timer")
  .command("status old", "Check current non-active timers")
  .example("$0 status old", "Check current non-active timers")
  .command("status", "Check current active timers")
  .example("$0 status", "Check current active timers")
  .command("start <descr>", "Specify decription to your timer")
  .example("$0 start 'New timer'", "Start new timer with your description")
  .command("stop <id>", "Stop specified active timer")
  .example("$0 stop 62294a68b9fb9d3d87aaa83e", "Stop specified active timer")
  .help("h")
  .alias("h", "help").argv;
if (argv._[0]) {
  switch (argv._[0]) {
    case "signup":
      signup();
      break;
    case "logout":
      logout();
      break;
    case "login":
      login();
      break;
    case "status":
      if (argv._[1]) {
        statusEtc(argv._[1]);
      } else {
        statusActive();
      }
      break;
    case "start":
      if (argv.descr) {
        createOneTimer(argv.descr);
        break;
      }
      console.log(`Please specify description for your new timer.`);
      break;
    case "stop":
      if (argv.id) {
        stopOneTimer(argv.id);
        break;
      }
      console.log(`Please specify description for timer you want to stop.`);
      break;
  }
}
