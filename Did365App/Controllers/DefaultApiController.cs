using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Did365App.Controllers
{
    public class DefaultApiController : ApiController
    {
        public string Get()
        {
            return "Welcome To Web API";
        }
    }
}
