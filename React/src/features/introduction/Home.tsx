import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex justify-center gap-4 text-center items-center my-24 mx-auto">
      <Link
        className="p-2 border text-white bg-blue-800 hover:bg-blue-600 animate-bounce"
        to="/login"
      >
        Login
      </Link>
      <Link
        className="p-2 border text-white bg-green-800 hover:bg-green-600 animate-spin"
        to="/register"
      >
        Register
      </Link>
    </div>
  );
};

export default Home;
