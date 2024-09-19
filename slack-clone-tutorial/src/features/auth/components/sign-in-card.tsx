//注册卡片组件
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@radix-ui/react-separator";
import { SignFlow } from "../types";
import { useState } from "react";
interface SignInCardProps {
  setState: (state: SignFlow) => void;
}
export const SignInCard = ({ setState }: SignInCardProps) => {
  const [email, setEmail] = useState("");
  const [pasword, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  //使用convexAuth提供的的方法来注册用户(第三方平台)
  const { signIn } = useAuthActions();
  const onProviderSignIn = (value: "github" | "google") => {
    setPending(true);
    signIn(value).finally(() => {
      setPending(false);
    });
  };
  return (
    <Card className=" w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Login to continue</CardTitle>
        <CardDescription>
          Use your email or another service to continue.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 px-0 pb-0">
        <form className="space-y-2.5">
          <Input
            disabled={pending}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="email"
            type="email"
            required
          ></Input>
          <Input
            disabled={pending}
            value={pasword}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="Pasword"
            type="password"
            required
          ></Input>
          <Button type="submit" className="w-full" size="lg" disabled={false}>
            Continue
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button
            className="w-full relative"
            variant="outline"
            onClick={() => {
              onProviderSignIn("google");
            }}
            size="lg"
            disabled={pending}
          >
            <FcGoogle className="size-5 absolute top-3 left-2.5 "></FcGoogle>
            Continue with Google
          </Button>
          <Button
            className="w-full relative"
            variant="outline"
            onClick={() => {
              onProviderSignIn("github");
            }}
            size="lg"
            disabled={pending}
          >
            <FaGithub className="size-5 absolute top-3 left-2.5 "></FaGithub>
            Continue with Github
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Don&apos;t have an account?
          <span
            onClick={() => setState("signUp")}
            className="text-sky-700 hover:underline cursor-pointer"
          >
            Sign up
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
