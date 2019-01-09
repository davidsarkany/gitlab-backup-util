# Gitlab Backup Script

## How to use
Log into your GitLab profile, then head to `User Settings` → `Access Tokens` → `Personal Access Tokens` and create a new token with the API Scope.

### Use with Docker
```
docker run --rm \
            -e "SERVER=https://www.gitlab.com" \
            -e "BACKUP_FOLDER=backup" \
            -e "TOKEN=XXXXXXXXXXXXXXXXX-XX" \
            -v /home/user/backup:/usr/src/app/backup davidsarkany/gitlab-backup-util
```

### Use with NPM
Rename the `.env.example` file to `.env`.
Replace the sample TOKEN to your TOKEN.
Run the following commands:
```
npm install
npm start
```
