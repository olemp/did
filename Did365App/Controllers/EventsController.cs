using System.Threading.Tasks;
using System.Web.Mvc;

namespace Did365App.Controllers
{
    public class EventsController : BaseController
    {
        [Authorize]
        public  ActionResult Index()
        {
            return View();
        }

        [Authorize]
        public ActionResult Week()
        {
            ViewBag.Title = "Week";
            return View();
        }
    }
}