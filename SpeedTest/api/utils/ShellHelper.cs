using System.Diagnostics;
using System.IO;

namespace SpeedTest.api.utils
{
    /// <summary>
    /// see https://stackoverflow.com/a/1881076/6296782
    /// </summary>
    public static class ShellHelper
    {
        public static void CreateDummy(string webroot)
        {
            var file = Path.Combine(webroot, "test.jpg");
            using (var fs = new FileStream(file, FileMode.CreateNew))
            {
                fs.Seek(50L * 1024 * 1024, SeekOrigin.Begin);
                fs.WriteByte(0);
            }
        }
    }
}
