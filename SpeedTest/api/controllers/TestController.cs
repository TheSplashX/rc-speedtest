using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace SpeedTest.Controllers
{
    [Controller]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok();
        }

        [HttpPost]
        [DisableRequestSizeLimit]
        public IActionResult Upload(IFormFile file)
        {
            return Ok();
        }
    }
}
