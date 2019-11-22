using System.Web.Mvc;

namespace Did365App.Controllers
{
    public class HomeController : BaseController
    {
        public ActionResult Index()
        {
            ViewBag.Title = "Home";
            return View();
        }
        public ActionResult Projects()
        {
            ViewBag.Title = "Projects";
            return View();
        }
        public ActionResult Customers()
        {
            ViewBag.Title = "Customers";
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Title = "About";
            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Title = "Contact";
            return View();
        }

        public ActionResult Error(string message, string debug)
        {
            Flash(message, debug);
            return RedirectToAction("Index");
        }
    }
}