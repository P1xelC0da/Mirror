const Express = require("express");
const app = Express();

const axios = require("axios");

const fs = require("fs");
const template = fs.readFileSync("./views/index.html", "utf-8");

const GITEA_API_URL = "";
const GITEA_ACCESS_TOKEN = "";
const GITEA_ORGANIZATION = "";

app.get("/", async (request, response) => {
    try {
        const repositories = await getRepositoriesFromGitea();
        let html = template.replace("@@REPOSITORIES@@", generateRepositoryList(repositories));
        response.send(html);
    } catch (err) {
        console.error(err);
        response.status(500).send("There was an issue fetching repositories from Gitea.");
    }
});

app.use("*", (request, response) => {
    response.status(404).redirect("/");
});

app.listen(1031, () => {
    console.log("Listening.");
});

async function getRepositoriesFromGitea() {
    const url = `${GITEA_API_URL}/orgs/${GITEA_ORGANIZATION}/repos`;
    const headers = {
        Authorization: `token ${GITEA_ACCESS_TOKEN}`
    };

    try {
        const response = await axios.get(url, { headers });
        return response.data;
    } catch (error) {
        console.error(error);
        return [];
    }
}

function generateRepositoryList(repositories) {
    let repoList = "<ul>";

    repositories.forEach((repo) => {
        repoList += `<li><a href="${repo.html_url}">${repo.name}</a></li>`;
    });

    repoList += "</ul>";
    return repoList;
}