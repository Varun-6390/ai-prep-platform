function log(level, event, data = {}) {
  console.log(JSON.stringify({ timestamp: new Date().toISOString(), level, event, ...data }));
}

module.exports = {
  info: (event, data) => log("info", event, data),
  warn: (event, data) => log("warn", event, data),
  error: (event, data) => log("error", event, data),
};
