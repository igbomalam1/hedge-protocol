module.exports = {
    apps: [{
        name: "hedge-worker",
        script: "./scripts/multi_chain_worker.js",
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
            NODE_ENV: "production",
        }
    }]
};
