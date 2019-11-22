using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Configuration;
using System.Threading.Tasks;
using Did365App.Models;
using System.Linq;
using System.Collections.Generic;

namespace Did365App.Services
{
    public class ProjectsService : TableService
    {
        public ProjectsService() : base("Projects")
        {
          
        }

        public IEnumerable<Project> Get()
        {
            return GetTable().ExecuteQuery(new TableQuery<Project>() { TakeCount = 100 }).ToList();
        }
    }
}