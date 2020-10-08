'use strict';
require('dotenv').config();
const request = require('request-promise');
const git = require('nodegit');
const fs = require('fs-extra');

if(process.env.SERVER === undefined || process.env.TOKEN === undefined || process.env.BACKUP_FOLDER === undefined){
    console.error(
        "Configuration is invalid. Please check the documentation.\n" +
        "https://github.com/davidsarkany/gitlab-backup-util"
    );
    process.exit(1);
}

const server = process.env.SERVER;
const serverProtocol = `${server.split('/')[0]}//`;
const token = process.env.TOKEN;
const repositoryBackupFolder = `${process.env.BACKUP_FOLDER}/repositories/`;
const snippetBackupFolder = `${process.env.BACKUP_FOLDER}/snippets/`;

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

    fs.removeSync(repositoryBackupFolder);
    fs.removeSync(snippetBackupFolder);

    const repositories = [];
    const groups = await authorizedGetRequest(`${server}/api/v4/groups`);
    for(const group of groups){
        let groupProjects = await authorizedGetRequest(`${server}/api/v4/groups/${group.id}/projects`);
        for(const groupProject of groupProjects){
            repositories.push({name:groupProject.name, path: groupProject.path_with_namespace, url: groupProject.http_url_to_repo});
        }
    }

    const user = await authorizedGetRequest(`${server}/api/v4/user`);
    const userProjects = await authorizedGetRequest(`${server}/api/v4/users/${user.id}/projects`);
    for(const userProject of userProjects){
        repositories.push({name:userProject.name, path: userProject.path_with_namespace, url: userProject.http_url_to_repo});
    }

    for(const repository of repositories){
        await git.Clone(generateAuthorizedRepoUrl(repository.url), `${repositoryBackupFolder}${repository.path}`);
        console.info(`"${repository.path}" repository cloned.`);
    }

    const snippets = await authorizedGetRequest(`${server}/api/v4/snippets`);
    for(const snippet of snippets){
        const snippetRawContent = await authorizedGetRequest(`${server}/api/v4/snippets/${snippet.id}/raw`);

        await fs.outputFile(`${snippetBackupFolder}${snippet.id}-meta.json`, JSON.stringify(snippet));
        console.info(`${snippet.title} snippet meta saved.`);

        await fs.outputFile(`${snippetBackupFolder}${snippet.id}`, snippetRawContent);
        console.info(`${snippet.title} snippet content saved.`);
    }
})();
