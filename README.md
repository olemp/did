# Did365 #

## 1. Structure ##

### Server ###
Folder/File | Description
--- | --- | 
`/client` | Client TypeScript source using e.g. `react` and `apollo-client`
`/public` |
`/public/css` | CSS files
`/public/js` | JS files (hidden from `vscode`, `/client` puts the bundle here)
`/routes` | Express routes using HBS views
`/middleware` |
`/middleware/graphql` | GraphQL implementation
`/middleware/graphql/resolvers` | GraphQL resolvers, queries and mutations
`/services` | Services (Graph and Table Storage)
`/utils` | Utilities
`/views` | Express HBS views
`app.js` | Express app
`server.js` | Node server  
***


### Client ###
Client files resides under `/client`. The resulting bundle ends up under `/public/js`.
 
## 2. Development ##

### 1. Install npm packages using pnpm ###
`pnpm i`

### 2. Add the Azure App Service extension to vscode ###
https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice

### 3. Create an app registration in the Azure Portal ###

### **NOTE** This is if you want to test with your own development tenant. We have a registration in the Puzzlepart Azure ###

*  Log on to portal.azure.com with your subscription
*  Navigate to Azure Active Directory -> App registrations
*  Create a New registration with multi tenant support. Note down the App id - this is your OAUTH_APP_ID env variable
*  Authentication
   *  set the redirect URI's (localhost:port/auth/callback for dev, [yourwebsite].azurewebsites.net/auth/callback if you've created an enterprise app)
   *  Enable Implicit grant flow using both Access tokens and ID tokens
   *  Ensure Supported account types are set to Multitenant
*  Under Certificates & secrets, create a new Client secret and note it down - this is your OAUTH_APP_PASSWORD environment variables
* API permissions - all Delegated
    * Calendars.Read
    * User.Read
    * offline_access
    * openid
* Exposed APIs
  * Add a scope for Calendar.Read

### 4. Set up Azure Table Storage ###

TODO


### 5. Create Web App in Azure ###
Use Azure CLI Script

```cli
SUBSCRIPTION="Azure CSP"
RESOURCEGROUP="pzl-did"
LOCATION="westeurope"
PLANNAME="ASP-pzldid-a0b2"
PLANSKU="S1"
SITENAME="did365"

# login supports device login, username/password, and service principals
# see https://docs.microsoft.com/en-us/cli/azure/?view=azure-cli-latest#az_login
az login
# list all of the available subscriptions
az account list -o table
# set the default subscription for subsequent operations
az account set --subscription $SUBSCRIPTION
# create a resource group for your application
az group create --name $RESOURCEGROUP --location $LOCATION
# create an appservice plan (a machine) where your site will run
az appservice plan create --name $PLANNAME --location $LOCATION --sku $PLANSKU --resource-group $RESOURCEGROUP
# create the web application on the plan
# specify the node version your app requires
az webapp create --name $SITENAME --plan $PLANNAME --resource-group $RESOURCEGROUP

# To set up deployment from a local git repository, uncomment the following commands.
# first, set the username and password (use environment variables!)
# USERNAME=""
# PASSWORD=""
# az webapp deployment user set --user-name $USERNAME --password $PASSWORD

# now, configure the site for deployment. in this case, we will deploy from the local git repository
# you can also configure your site to be deployed from a remote git repository or set up a CI/CD workflow
# az webapp deployment source config-local-git --name $SITENAME --resource-group $RESOURCEGROUP

# the previous command returned the git remote to deploy to
# use this to set up a new remote named "azure"
# git remote add azure "https://$USERNAME@$SITENAME.scm.azurewebsites.net/$SITENAME.git"
# push master to deploy the site
# git push azure master

# browse to the site
# az webapp browse --name $SITENAME --resource-group $RESOURCEGROUP
```

### 6. Developing locally ###

#### npm run-script watch ####

To watch both `server` and `client` changes concurrently, use `npm run-script watch` 

## Deploying ##

The `/master` branch - requiring pull requests, is set up with a CI/CD pipeline which deploys to `did365.azurewebsites.net`.


### Maintainers

`@damsleth`, `@olemp`, `@okms`