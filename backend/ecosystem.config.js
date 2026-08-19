module.exports = {
  apps: [
    {
      name: '724bets-data-engine',
      script: 'npm',
      args: 'start',
      env: {
        PORT: 4000,
        NODE_ENV: 'production'
      }
    }
  ]
};
