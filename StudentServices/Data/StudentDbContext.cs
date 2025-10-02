using Microsoft.EntityFrameworkCore;
using StudentServices.Model;

namespace StudentServices.Data
{
    public class StudentDbContext : DbContext
    {
        public StudentDbContext(DbContextOptions<StudentDbContext> options) 
            : base(options)
        { 
        }

        public DbSet<Student> Students { get; set; }
    }
}
