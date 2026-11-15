import Image from "next/image";

import { SigninForm } from "@/components/signin-form";

export default function SigninScreen() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <div className="flex items-center justify-center gap-4 mb-5">
          <Image
            loading="eager"
            src="/assets/logos/logo-hscbet-full.light.svg"
            alt="Logo"
            width={420}
            height={128}
            className="h-15 w-auto block dark:hidden"
          />
          <Image
            loading="eager"
            src="/assets/logos/logo-hscbet-full.dark.svg"
            alt="Logo"
            width={420}
            height={128}
            className="h-15 w-auto hidden dark:block"
          />
        </div>
        <SigninForm />
      </div>
    </div>
  );
}
