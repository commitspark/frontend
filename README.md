# Commitspark Content Editing Frontend

This repository holds the content editing frontend of CMS [Commitspark](https://commitspark.com).

In Commitspark, by design, all data is stored in a Git repository on a hosted Git provider (e.g. GitHub), from
content model (schema) and configuration all the way to actual content entries.

As all data is stored in a Git repository hosted by a Git provider, the editing frontend is light-weight and does not
require any additional persistence such as a database. Please see
the [Commitspark documentation](https://commitspark.com/en-us/documentation) for further information.

## User authentication

Authentication of frontend users (i.e. content editors) is performed against the Git provider where a content repository
is hosted. The underlying idea is that content editors can then use the same collaboration features that software
developers use on these platforms (e.g. commenting, approval).

### Supported Git providers

* GitHub

Support for GitLab is planned for a future release.

### GitHub

On GitHub, user authentication can be performed via a GitHub App.

To create a GitHub App that can authenticate your content editors, go
to `Settings -> Developers settings -> (GitHub Apps) -> New GitHub App` under the user or organization that owns your
designated content repository.

The following settings are relevant, all other settings can be left to their defaults:

| Setting                          | Description                                                                                                                                                                   | Value                                                                                                                     |
|----------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------|
| Homepage URL                     | Enter the base URL that the frontend will be reachable under                                                                                                                  | e.g. `http://localhost:3000/` or `https://cms.exmaple.com/`                                                               |
| Callback URL                     | Enter the URL that GitHub should redirect to upon successful user authentication.<br/><br/>The built-in authentication route for GitHub is `/api/oauth/authorize-github-app/` | e.g. `http://localhost:3000/api/oauth/authorize-github-app/` or `https://cms.example.com/api/oauth/authorize-github-app/` |
| Expire user authorization tokens | Turn this off as token expiry is currently not supported                                                                                                                      | Off                                                                                                                       |
| Webhook                          | Notification about GitHub platform events related to the App is not relevant and must be turned off                                                                           | Off                                                                                                                       |
| Permissions                      | Determines App access                                                                                                                                                         | **Repository permissions**<br/>Contents: `Read and write`<br/>Metadata: `Read-only`                                       |

See the
[GitHub documentation](https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/registering-a-github-app)
for details.

Once the App is created:

* On the App's settings page, note the `Client ID` under `General -> About`, e.g.  `Iv1.abcef12345678901`
* Generate a client secret with `Generate a new client secret` and copy the 40 character long hex key shown on screen
* Install the App into your GitHub account or organization under `Install App -> Install` and select one or more
  of your designated content repositories that content editors authenticating via the App may access

## Running the Commitspark editing frontend

### Preparation

The frontend application is configured through environment variables or a `.env` file (`.env.dist` can be used as
a template).

The following variables must be configured:

| Variable                     | Description                                                                                                            |
|------------------------------|------------------------------------------------------------------------------------------------------------------------|
| `GITHUB_OAUTH_CLIENT_ID`     | Client ID of GitHub App to be used for user authentication (see above),<br/>e.g. `Iv1.abcef12345678901`                |
| `GITHUB_OAUTH_CLIENT_SECRET` | 40 character long hexadecimal client secret of the GitHub App,<br/>e.g. `0123456789abcdef01234567890abcdef0123456`     |
| `HOSTING_URL`                | Public URL where this frontend is going to be reachable,<br/>e.g. `http://localhost:3000` or `https://cms.example.com` |

### Running from source

The frontend is implemented as a [Next.js](https://nextjs.org/) application, so the standard concepts of running and
deploying Next.js applications apply.

For local development or evaluation, simply run these commands:

```shell
npm install
npm run dev
```

Then open `http://localhost:3000` in your browser.

### Running from Docker

Automated builds of branch `main` are published as a Docker image to GitHub packages:

```
ghcr.io/commitspark/frontend:latest
```

Run the image as follows:

```shell
docker run -e "GITHUB_OAUTH_CLIENT_ID=..." -e "GITHUB_OAUTH_CLIENT_SECRET=..." -e "HOSTING_URL=http://localhost:3000" -p 127.0.0.1:3000:3000 --name commitspark-frontend ghcr.io/commitspark/frontend:latest
```

Then open `http://localhost:3000` in your browser.

## Getting started with content editing

To quickly see the Commitspark editing frontend in action, we offer a
[public example content repository](https://github.com/commitspark/example-content-website) which you can
[use as a template](https://github.com/new?template_name=example-content-website&template_owner=commitspark) for
your own content repository.

After cloning, ensure your GitHub App grants access to this new repository
(`GitHub -> Settings -> GitHub Apps -> Configure -> Repository access`), then go to your Commitspark frontend,
sign in with GitHub and start editing in the repository.
