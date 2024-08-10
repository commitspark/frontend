# Commitspark Data Editing Frontend

This repository holds the data editing frontend of [Commitspark](https://commitspark.com). It enables users with limited
technical
knowledge to create, read, update, and delete [Commitspark-managed](https://github.com/commitspark/graphql-api)
structured data stored in a Git repository hosted on a Git provider (e.g. GitHub, GitLab).

## User authentication

To obtain repository access, frontend users (i.e. data editors) must authenticate against a configurable
authenticator. Typically, this is implemented by the same provider where the targeted Git repository
is hosted. The underlying idea is that data editors are then considered native users of the provider's platform
and can then use all of the provider's collaboration features (e.g. commenting, approval).

## Supported Git providers

* GitHub
* User-defined custom Git provider

Official support for GitLab is planned for a future release.

### GitHub

On GitHub, user authentication can be performed via GitHub App.

To create a GitHub App that can authenticate your data editors, go
to `Settings -> Developers settings -> (GitHub Apps) -> New GitHub App` under the user or organization that owns your
designated data repository.

The following settings are relevant, all other settings can be left to their defaults:

| Setting                          | Description                                                                                                                                                                            | Value                                                                                                                                |
|----------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------|
| Homepage URL                     | Enter the base URL that the frontend will be reachable under                                                                                                                           | e.g. `http://localhost:3000/` or `https://cs.exmaple.com/`                                                                           |
| Callback URL                     | Enter the URL that GitHub should redirect to upon successful user authentication.<br/><br/>The built-in route that accepts these callbacks is `/api/oauth/authenticate-with-provider/` | e.g. `http://localhost:3000/api/oauth/authenticate-with-provider/` or `https://cs.example.com/api/oauth/authenticate-with-provider/` |
| Expire user authorization tokens | Turn this off as token expiry is currently not supported                                                                                                                               | Off                                                                                                                                  |
| Webhook                          | Notification about GitHub platform events related to the App is not relevant and must be turned off                                                                                    | Off                                                                                                                                  |
| Permissions                      | Determines App access                                                                                                                                                                  | **Repository permissions**<br/>Contents: `Read and write`<br/>Metadata: `Read-only`                                                  |

See the
[GitHub documentation](https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/registering-a-github-app)
for details.

Once the App is created:

* On the App's settings page, note the `Client ID` under `General -> About`, e.g.  `Iv1.abcef12345678901`
* Generate a client secret with `Generate a new client secret` and copy the 40 character long hex key shown on screen
* Install the App into your GitHub account or organization under `Install App -> Install` and select one or more
  of your designated data repositories that should be available to data editors

Environment variables needed by the GitHub integration:

| Variable                     | Description                                                                                                        |
|------------------------------|--------------------------------------------------------------------------------------------------------------------|
| `GITHUB_OAUTH_CLIENT_ID`     | Client ID of GitHub App to be used for user authentication (see above),<br/>e.g. `Iv1.abcef12345678901`            |
| `GITHUB_OAUTH_CLIENT_SECRET` | 40 character long hexadecimal client secret of the GitHub App,<br/>e.g. `0123456789abcdef01234567890abcdef0123456` |

### Custom provider

All Git provider functionality is abstracted away by interfaces defined in `lib/provider/provider.ts` and
`lib/provider/authenticator.ts`. To use your own Git provider or authenticator, simply implement these interfaces and
enable your implementation through the frontend configuration file (see below).

## Running the Commitspark editing frontend

### Configuration

The frontend application is configured through a configuration file [commitspark.config.ts](commitspark.config.ts)
and further parametrized through environment variables or `.env` file.

The following environment variables must be set independent of configuration:

| Variable      | Description                                                                                                                     |
|---------------|---------------------------------------------------------------------------------------------------------------------------------|
| `HOSTING_URL` | Set to a public URL where this frontend is going to be reachable,<br/>e.g. `http://localhost:3000` or `https://cms.example.com` |

### Running from source

The frontend is implemented as a [Next.js](https://nextjs.org/) application, so the standard concepts of running and
deploying Next.js applications apply.

To run locally from source, simply clone this repository and run the following commands:

```shell
npm install
npm run dev
```

Then open `http://localhost:3000` in your browser.

### Running from Docker

Automated builds of branch `main` with GitHub configured as Git provider are published as a Docker image to GitHub
packages:

```
ghcr.io/commitspark/frontend:latest
```

Run the image locally as follows:

```shell
docker run -e "GITHUB_OAUTH_CLIENT_ID=..." -e "GITHUB_OAUTH_CLIENT_SECRET=..." -e "HOSTING_URL=http://localhost:3000" -p 127.0.0.1:3000:3000 --name commitspark-frontend ghcr.io/commitspark/frontend:latest
```

Then open `http://localhost:3000` in your browser.

## Getting started with data editing

To quickly see the Commitspark editing frontend in action, we offer a
[public example data repository](https://github.com/commitspark/example-content-website) which you can
[use as a template](https://github.com/new?template_name=example-content-website&template_owner=commitspark) for
your own data repository.

After cloning, ensure your GitHub App grants access to this new repository
(`GitHub -> Settings -> GitHub Apps -> Configure -> Repository access`), then go to your Commitspark frontend,
sign in with your authentication provider and start editing in the repository.
