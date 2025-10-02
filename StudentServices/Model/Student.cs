using System.ComponentModel.DataAnnotations;

namespace StudentServices.Model
{
    public class Student
    {
        [Key]
        public int StudentId { get; set; }

        [Required, Display(Name = "First Name")]
        [DataType(DataType.Text)]
        public string FirstName { get; set; }

        [Required, DataType(DataType.Text)]
        public string LastName { get; set; }

        [Required, DataType(DataType.MultilineText)]
        public string Address { get; set; }

        [Required, DataType(DataType.PhoneNumber)]
        public int PhoneNumber { get; set; }

        [Required, DataType(DataType.Text)]
        public string Major { get; set; }

    }
}
