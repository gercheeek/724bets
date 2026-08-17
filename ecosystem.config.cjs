module.exports = {
  apps: [{
    name: "socket-server",
    script: "./socket_server.cjs",
    watch: false,
    max_memory_restart: "1G",
    env: {
      NODE_ENV: "production",
    },
    error_file: "logs/pm2-err.log",
    out_file: "logs/pm2-out.log",
    time: true,
    log_date_format: "YYYY-MM-DD HH:mm Z"
  }]
}
