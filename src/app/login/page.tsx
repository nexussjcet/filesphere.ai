import { Button } from "@/components/ui/button";
import { handleLogin } from "../_actions";

const Social = () => {
  return (
    <>
      <form action={handleLogin}>
        <Button>Sign in with Google</Button>
      </form>
    </>
  );
};

export default Social;

