using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace SpeedTest.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        [HttpPost]
        public IActionResult Post([FromBody] IFormFile file)
        {
            return Ok( new { file.Length } );
        }
    }
}
