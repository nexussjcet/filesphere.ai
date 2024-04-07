import { Button } from "@/components/ui/button";
import { handleSubmit } from "./_actions";

const Social = () => {
  return (
    <>
      <form action={handleSubmit}>
        <Button>Sign in with Google</Button>
      </form>
    </>
  );
};

export default Social;
