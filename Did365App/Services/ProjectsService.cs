using Microsoft.WindowsAzure.Storage.Table;
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
            var query = new TableQuery<Project>() {
                TakeCount = 100
            };
            return GetTable().ExecuteQuery(query).ToList();
        }


        public TableResult Add(Project project)
        {
            return GetTable().Execute(TableOperation.Insert(project));
        }
    }
}