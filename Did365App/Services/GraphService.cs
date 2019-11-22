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
using Did365App.Helpers;

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

        public static async Task<IEnumerable<Event>> GetOutlookEventsAsync(int weekNumber)
        {
            var client = GetAuthenticatedClient();
            var start = DateHelpers.FirstDateOfWeek(2019, weekNumber);
            List<Option> options = new List<Option>
            {
                new QueryOption("startDateTime", start.ToString("o")),
                new QueryOption("endDateTime", start.AddDays(7).ToString("o"))
            };
            var events = await client.Me.Calendar.CalendarView.Request(options)
                .Select("id,subject,body,organizer,start,end,categories,webLink")
                .OrderBy("start/dateTime ASC")
                .Top(100)
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