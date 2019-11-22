using Microsoft.Graph;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Did365App.TokenStorage;
using Did365App.Extensions;
using Microsoft.Identity.Client;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Security.Claims;
using System.Web;
using System;

namespace Did365App.Services
{
    public class GraphService
    {
        private static readonly string clientId = ConfigurationManager.AppSettings["ida:ClientId"];
        private static readonly string clientSecret = ConfigurationManager.AppSettings["ida:ClientSecret"];
        private static readonly string redirectUri = ConfigurationManager.AppSettings["ida:RedirectUri"];
        private static readonly string graphScopes = ConfigurationManager.AppSettings["ida:GraphScopes"];

        public static async Task<User> GetUserDetailsAsync(string accessToken)
        {
            var client = new GraphServiceClient(
                new DelegateAuthenticationProvider(
                    async (requestMessage) =>
                    {
                        requestMessage.Headers.Authorization =
                            new AuthenticationHeaderValue("Bearer", accessToken);
                    }));

            return await client.Me.Request().GetAsync();
        }

        public static async Task<IEnumerable<Event>> GetOutlookEventsAsync()
        {
            var client = GetAuthenticatedClient();
            var events = await client.Me.Events.Request()
                .Select("id,subject,body,organizer,start,end,categories")
                .OrderBy("createdDateTime DESC")
                .Filter($"start/dateTime ge '2019-11-18 00:00:00' and end/dateTime le '2019-11-24T00:00:00'")
                .GetAsync();
            return events.CurrentPage;
        }

        private static GraphServiceClient GetAuthenticatedClient()
        {
            return new GraphServiceClient(
                new DelegateAuthenticationProvider(
                    async (requestMessage) =>
                    {
                        var idClient = ConfidentialClientApplicationBuilder.Create(clientId)
                            .WithRedirectUri(redirectUri)
                            .WithClientSecret(clientSecret)
                            .Build();
                        var tokenStore = new SessionTokenStore(idClient.UserTokenCache,
                            HttpContext.Current, ClaimsPrincipal.Current);
                        var accounts = await idClient.GetAccountsAsync();
                        var scopes = graphScopes.Split(' ');
                        var result = await idClient.AcquireTokenSilent(scopes, accounts.FirstOrDefault())
                            .ExecuteAsync();

                        requestMessage.Headers.Authorization =
                            new AuthenticationHeaderValue("Bearer", result.AccessToken);
                    }));
        }
    }
}