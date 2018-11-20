module.exports = {
  apps : [{
    name: 'flow-garden-pm2',
    script: 'startup.sh',
    kill_timeout : 3000,
    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    autorestart: true,
    watch: true,
    ignore_watch: ['.git', 'node_modules', 'data'],
    max_memory_restart: '2G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],
};
