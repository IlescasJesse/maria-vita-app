module.exports = {
    apps: [
        {
            name: 'maria-vita-backend',
            cwd: '/var/www/maria-vita-app',
            script: 'npm',
            args: 'run backend:start',
            env_production: {
                NODE_ENV: 'production',
                BACKEND_HOST: '0.0.0.0',
                BACKEND_PORT: '5000'
            },
            autorestart: true,
            max_restarts: 10,
            restart_delay: 3000,
            out_file: '/var/log/mariavita-backend.log',
            error_file: '/var/log/mariavita-backend-error.log',
            merge_logs: true,
            time: true
        },
        {
            name: 'maria-vita-frontend',
            cwd: '/var/www/maria-vita-app',
            script: 'npm',
            args: 'start',
            env_production: {
                NODE_ENV: 'production',
                PORT: '3000',
                BACKEND_INTERNAL_URL: 'http://127.0.0.1:5000/api'
            },
            autorestart: true,
            max_restarts: 10,
            restart_delay: 3000,
            out_file: '/var/log/mariavita-frontend.log',
            error_file: '/var/log/mariavita-frontend-error.log',
            merge_logs: true,
            time: true
        }
    ]
};
