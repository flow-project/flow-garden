module.exports = {
  apps : [{
    name: 'flow-garden-pm2',
    script: 'node ./bin/www',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    autorestart: true,
    watch: true,
    ignore_watch: ['node_modules', 'data'],
    max_memory_restart: '2G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],
};
