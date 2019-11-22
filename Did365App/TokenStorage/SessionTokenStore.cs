using Microsoft.Identity.Client;
using Newtonsoft.Json;
using System.Security.Claims;
using System.Threading;
using System.Web;

namespace Did365App.TokenStorage
{
    // Simple class to serialize into the session
    public class CachedUser
    {
        public string DisplayName { get; set; }
        public string Email { get; set; }
        public string Avatar { get; set; }
    }

    public class SessionTokenStore
    {
        private static readonly ReaderWriterLockSlim sessionLock = new ReaderWriterLockSlim(LockRecursionPolicy.NoRecursion);

        private HttpContext HttpContext { get; set; }
        private string UserCacheKey { get; set; }
        public string TokenCacheKey { get; set; }

        public SessionTokenStore(ITokenCache tokenCache, HttpContext context, ClaimsPrincipal user)
        {
            HttpContext = context;
            if (tokenCache != null)
            {
                tokenCache.SetBeforeAccess(BeforeAccessNotification);
                tokenCache.SetAfterAccess(AfterAccessNotification);
            }

            var userId = GetUsersUniqueId(user);
            TokenCacheKey = $"{userId}_TokenCache";
            UserCacheKey = $"{userId}_UserCache";
        }

        public bool HasData()
        {
            return (HttpContext.Session[TokenCacheKey] != null && ((byte[])HttpContext.Session[TokenCacheKey]).Length > 0);
        }

        public void Clear()
        {
            sessionLock.EnterWriteLock();

            try
            {
                HttpContext.Session.Remove(TokenCacheKey);
            }
            finally
            {
                sessionLock.ExitWriteLock();
            }
        }

        private void BeforeAccessNotification(TokenCacheNotificationArgs args)
        {
            sessionLock.EnterReadLock();

            try
            {
                // Load the cache from the session
                args.TokenCache.DeserializeMsalV3((byte[])HttpContext.Session[TokenCacheKey]);
            }
            finally
            {
                sessionLock.ExitReadLock();
            }
        }

        private void AfterAccessNotification(TokenCacheNotificationArgs args)
        {
            if (args.HasStateChanged)
            {
                sessionLock.EnterWriteLock();

                try
                {
                    // Store the serialized cache in the session
                    HttpContext.Session[TokenCacheKey] = args.TokenCache.SerializeMsalV3();
                }
                finally
                {
                    sessionLock.ExitWriteLock();
                }
            }
        }

        public void SaveUserDetails(CachedUser user)
        {

            sessionLock.EnterWriteLock();
            HttpContext.Session[UserCacheKey] = JsonConvert.SerializeObject(user);
            sessionLock.ExitWriteLock();
        }

        public CachedUser GetUserDetails()
        {
            sessionLock.EnterReadLock();
            var cachedUser = JsonConvert.DeserializeObject<CachedUser>((string)HttpContext.Session[UserCacheKey]);
            sessionLock.ExitReadLock();
            return cachedUser;
        }

        private string GetUsersUniqueId(ClaimsPrincipal user)
        {
            if (user != null)
            {
                var userObjectId = user.FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier").Value ??
                    user.FindFirst("oid").Value;

                var userTenantId = user.FindFirst("http://schemas.microsoft.com/identity/claims/tenantid").Value ??
                    user.FindFirst("tid").Value;

                if (!string.IsNullOrEmpty(userObjectId) && !string.IsNullOrEmpty(userTenantId))
                {
                    return $"{userObjectId}.{userTenantId}";
                }
            }

            return null;
        }
    }
}