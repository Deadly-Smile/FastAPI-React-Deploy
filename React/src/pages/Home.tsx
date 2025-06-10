import { useUser } from "@/contexts/UserContext";
import { motion } from "framer-motion";
const Home = () => {
  const { user } = useUser();
  return (
    <section className="flex flex-wrap justify-center gap-6 my-24 mx-auto px-4 max-w-5xl">
      {user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-zinc-900 shadow-xl rounded-2xl p-6 w-full max-w-md border border-zinc-200 dark:border-zinc-700"
        >
          <h2 className="text-2xl font-semibold mb-4 text-zinc-800 dark:text-zinc-100">
            User Info
          </h2>
          <ul className="space-y-2 text-zinc-700 dark:text-zinc-300">
            <li>
              <strong>Username:</strong> {user?.username}
            </li>
            <li>
              <strong>E-mail:</strong> {user?.email}
            </li>
            <li>
              <strong>Is Active:</strong> {user?.is_active ? "Yes" : "No"}
            </li>
          </ul>
        </motion.div>
      )}
    </section>
  );
};

export default Home;
