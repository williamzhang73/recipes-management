import { Link, useNavigate } from 'react-router-dom';
function SignUpForm() {
  const navigate = useNavigate();
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      const data = Object.fromEntries(formData);
      const req = {
        method: 'post',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(data),
      };
      const resposne = await fetch('/api/auth/sign-up', req);
      if (!resposne.ok) throw new Error('Network response not ok.');
      alert('User created successfully, will navigate to sign-in form');
      navigate('/sign-in');
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="w-full pt-8 flex justify-center border-l-2 border-white md:w-4/5">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center border-2 py-10 items-center bg-white  h-fit w-4/5 rounded-lg gap-y-3">
        <span className="block font-bold">Register</span>
        <div>
          <input
            type="text"
            placeholder="Username"
            className="border-2 rounded cursor-pointer"
            name="username"
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            className="border-2 rounded cursor-pointer"
            name="password"
          />
        </div>
        <div className="flex flex-col items-center">
          <button className="bg-blue-300 text-xs rounded h-7 w-12 text-gray-700">
            Register
          </button>
          <span className="block text-xs">
            Already have an account?
            <Link to="/sign-in">
              <span className="text-blue-500">Sign in</span>
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
}
export default SignUpForm;
