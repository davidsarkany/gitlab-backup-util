'use strict';

require('dotenv').config();
const request = require('request-promise');
const git = require("nodegit");
const server = process.env.SERVER;
const serverProtocol = server.split("/")[0]+"//";
const token = process.env.TOKEN;
const backupFolder = process.env.BACKUP_FOLDER;

const authorizedGetRequest = async (url) => {
    return await request.get(url, {
        json: true,
        qs: {
            simple: true
        },
        headers: {
            'PRIVATE-TOKEN': token
        }
    })
};

const generateAuthorizedRepoUrl = (url) => {
    return url.replace(serverProtocol,`${serverProtocol}oauth2:${token}@`);
};

(async () => {
    const repos = [];
    const groups = await authorizedGetRequest(`${server}/api/v4/groups`);
    for(const group of groups){
        let groupProjects = await authorizedGetRequest(`${server}/api/v4/groups/${group.id}/projects`);
        for(const groupProject of groupProjects){
            repos.push({name:groupProject.name, path: groupProject.path, url: groupProject.http_url_to_repo});
        }
    }

    const user = await authorizedGetRequest(`${server}/api/v4/user`);
    const userProjects = await authorizedGetRequest(`${server}/api/v4/users/${user.id}/projects`);
    for(const userProject of userProjects){
        repos.push({name:userProject.name, path: userProject.path, url: userProject.http_url_to_repo});
    }

    for(const repo of repos){
        await git.Clone(generateAuthorizedRepoUrl(repo.url), backupFolder + '/' + repo.path);
        console.info(repo.name);
    }
})();
