# Gitlab Backup Script

[![build](https://badgen.net/github/status/davidsarkany/gitlab-backup-util)](https://hub.docker.com/r/davidsarkany/gitlab-backup-util/builds)
[![commits](https://badgen.net/github/commits/davidsarkany/gitlab-backup-util)](https://github.com/davidsarkany/gitlab-backup-util/commits/master)
[![last_commit](https://badgen.net/github/last-commit/davidsarkany/gitlab-backup-util)](https://github.com/davidsarkany/gitlab-backup-util/commits/master)
[![docker pulls](https://badgen.net/docker/pulls/davidsarkany/gitlab-backup-util)](https://hub.docker.com/r/davidsarkany/gitlab-backup-util)
[![license](https://badgen.net/github/license/davidsarkany/gitlab-backup-util)](https://github.com/davidsarkany/gitlab-backup-util/blob/master/LICENSE)


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
