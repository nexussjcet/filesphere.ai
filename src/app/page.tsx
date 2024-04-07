import { auth } from "@/auth";
import Social from "./login/page";
import SignoutButton from "./dashboard/_components/signout";

export default async function Home() {
  const session = await auth();

  return (
    <>
      <Social />
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <SignoutButton />
    </>
  );
}
