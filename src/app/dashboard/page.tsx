import { sendEmail } from "./_actions";

import Image from "next/image";

const Dash = async () => {
  return (
    <div className="flex h-full items-center justify-center rounded-xl bg-muted/90 text-center">
      <Image
        className="grayscale-[50%]"
        src="/illu.png"
        alt="Empty"
        width={500}
        height={500}
      />
    </div>
  );
};

export default Dash;
