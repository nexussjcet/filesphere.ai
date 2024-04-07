import { handleSubmit } from "./_actions";

const Social = () => {
  return (
    <>
      <form action={handleSubmit}>
        <button>Sign in with Google</button>
      </form>
    </>
  );
};

export default Social;
